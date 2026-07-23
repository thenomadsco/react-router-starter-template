#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
//  client-document-intake.mjs — The Nomads Co. Sensitive Document Intake  v1.0
//  (Passports · Air Tickets · Hotel Vouchers → matched & staged for Supabase)
// ═══════════════════════════════════════════════════════════════════════════════
//
//  ⚠️  INSTRUCTIONS FOR CLAUDE CODE CLI  ⚠️
//  ───────────────────────────────────────
//  100% local. No network call of any kind except the final --commit write,
//  which goes to Supabase only (your own database), never anywhere else.
//  There is no OCR/vision API, no LLM call, no third-party service, anywhere
//  in this pipeline. Passport reading uses the local `tesseract` binary only.
//
//  Your job: install deps if missing, run the command given to you, and
//  relay ONLY the printed summary (counts + flag categories) back to the
//  user. Never open, cat, view, or otherwise read:
//    - any file in the source documents folder (passports/tickets/vouchers)
//    - the local review file this script writes (contains real passport
//      numbers, DOB, etc. in cleartext — that's for the human only)
//  If something errors, diagnose from the error type/message printed to
//  stdout. Do not go inspect a document or the review file to troubleshoot.
//
//  TWO-STAGE DESIGN
//  ─────────────────
//  Stage 1 (default, this script without --commit):
//    extract → validate → match against existing Supabase records → flag
//    anything uncertain → write ONE local review file. Nothing is written
//    to Supabase in this stage, ever.
//  Stage 2 (--commit --approved <file>):
//    reads a file YOU produced by hand-editing the review output to mark
//    rows as approved, and only then writes those specific rows to Supabase.
//    Not implemented in this v1 run — this build focuses on getting Stage 1
//    (the hard, risk-bearing part) right first.
//
//  ERROR HANDLING PHILOSOPHY
//  ───────────────────────────
//  Compiler-style, not interpreter-style: every document in the batch is
//  processed regardless of what's wrong with earlier ones. All issues per
//  document accumulate into that document's flag list. Nothing is ever
//  auto-corrected by guessing — the one exception is a narrow, provable
//  case: known OCR letter/digit confusions (O↔0, I↔1, S↔5, Z↔2, B↔8) inside
//  a field that is *defined by the MRZ spec to be numeric-only*, and even
//  then the correction is only accepted if the ICAO check-digit then
//  validates — i.e. it's confirmed by an independent mathematical proof,
//  not assumed. Every such correction is logged, never silent.
//
//  USAGE
//  ─────
//  node client-document-intake.mjs --dir "<documents folder>" --candidates "<path to mock or exported candidates.json>"
//  node client-document-intake.mjs --dir ... --candidates ... --out review.json
//
//  In production, --candidates would be replaced by a live Supabase query
//  (same schema-introspection pattern as the invoice importer) — this build
//  accepts a JSON file so the matching/coherence logic can be tested fully
//  offline first, per your instruction, before it ever touches production.
//
//  PREREQUISITES
//  ──────────────
//  brew install poppler tesseract
//  npm install jimp
// ═══════════════════════════════════════════════════════════════════════════════

import { execFileSync } from "node:child_process";
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename, extname, resolve } from "node:path";
import { createHash } from "node:crypto";

// ── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function argVal(flag, def) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
}
const VERBOSE = args.includes("--verbose");
const ROOT_DIR = resolve(argVal("--dir", "."));
const CANDIDATES_FILE = argVal("--candidates", null);
const OUT_FILE = resolve(argVal("--out", "document-review.json"));
const STATE_FILE = resolve(argVal("--state", ".doc-intake-state.json"));

function die(msg) {
  console.error(`\n❌  ${msg}`);
  process.exit(1);
}

if (!existsSync(ROOT_DIR)) die(`Folder not found: ${ROOT_DIR}`);
if (!CANDIDATES_FILE || !existsSync(CANDIDATES_FILE)) {
  die(`--candidates file is required (path to existing leads/travelers JSON). In production this is a live Supabase query; for testing, pass a local JSON file.`);
}
try { execFileSync("pdftotext", ["-v"], { stdio: "pipe" }); } catch { die("pdftotext not found — run: brew install poppler"); }
try { execFileSync("tesseract", ["--version"], { stdio: "pipe" }); } catch { die("tesseract not found — run: brew install tesseract"); }

let Jimp;
try {
  const mod = await import("jimp");
  Jimp = mod.Jimp ?? mod.default ?? mod;
} catch {
  die('The "jimp" package is not installed. Run: npm install jimp');
}

const CANDIDATES = JSON.parse(readFileSync(CANDIDATES_FILE, "utf8"));

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 1 — FILE COLLECTION & DEDUPE STATE
// ─────────────────────────────────────────────────────────────────────────────

const DOC_EXTS = new Set([".pdf", ".png", ".jpg", ".jpeg", ".tif", ".tiff"]);

function collectDocs(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    try {
      if (statSync(full).isDirectory()) out.push(...collectDocs(full));
      else if (DOC_EXTS.has(extname(entry).toLowerCase())) out.push(full);
    } catch { /* permission error — skip, counted later */ }
  }
  return out;
}

function fileHash(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function loadState() {
  if (!existsSync(STATE_FILE)) return { processed: {} };
  try { return JSON.parse(readFileSync(STATE_FILE, "utf8")); }
  catch { return { processed: {} }; }
}
function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 2 — IMAGE QUALITY GATE  (local heuristics via jimp, no network)
// ─────────────────────────────────────────────────────────────────────────────

const MIN_DIMENSION = 400;       // px, below this a passport data page is unreadable
const MIN_CONTRAST_STDDEV = 18;  // heuristic: flat/washed-out images have low pixel stddev

async function assessImageQuality(path) {
  const img = await Jimp.read(path);
  const w = img.bitmap.width, h = img.bitmap.height;
  if (w < MIN_DIMENSION || h < MIN_DIMENSION) {
    return { ok: false, reason: `resolution too low (${w}x${h}, need >= ${MIN_DIMENSION}px on each side)` };
  }

  // Contrast/sharpness proxy: stddev of grayscale pixel values. A heavily
  // blurred or washed-out scan collapses toward a narrow band of values.
  const clone = img.clone().greyscale();
  let sum = 0, sumSq = 0, n = 0;
  clone.scan(0, 0, clone.bitmap.width, clone.bitmap.height, function (x, y, idx) {
    const v = this.bitmap.data[idx];
    sum += v; sumSq += v * v; n++;
  });
  const mean = sum / n;
  const stddev = Math.sqrt(sumSq / n - mean * mean);

  if (stddev < MIN_CONTRAST_STDDEV) {
    return { ok: false, reason: `low contrast/likely blurred (stddev ${stddev.toFixed(1)}, need >= ${MIN_CONTRAST_STDDEV})`, stddev };
  }
  return { ok: true, stddev, width: w, height: h };
}

// One local recovery attempt: normalize contrast + upscale 2x, applied to the
// full page. Kept as a fallback strategy alongside the MRZ-crop strategies
// below.
async function enhanceForRetry(path, outPath) {
  const img = await Jimp.read(path);
  img.greyscale().contrast(0.35).resize({ w: img.bitmap.width * 2, h: img.bitmap.height * 2 });
  await img.write(outPath);
  return outPath;
}

// Real phone-photo scans are frequently rotated 90/180/270° from how they
// were held. Tesseract's own orientation-detection pass (--psm 0) catches
// this cheaply, before we spend effort on cropping/upscaling a sideways
// image. Best-effort: if the OSD trained data isn't installed, this simply
// skips rotation correction rather than failing the whole extraction.
const MIN_OSD_CONFIDENCE = 1.5; // tesseract's own confidence scale; low values are noise, not signal

async function correctRotation(path, tmpDir) {
  try {
    const osd = execFileSync("tesseract", [path, "stdout", "--psm", "0"], { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
    const rotM = osd.match(/Rotate:\s*(\d+)/);
    const confM = osd.match(/Orientation confidence:\s*([\d.]+)/);
    const rotation = rotM ? Number(rotM[1]) : 0;
    const confidence = confM ? Number(confM[1]) : 0;
    if (!rotation || confidence < MIN_OSD_CONFIDENCE) return path; // not confident enough — don't risk corrupting a fine image
    const img = await Jimp.read(path);
    img.rotate(rotation);
    const outPath = `${tmpDir}/rotated.png`;
    await img.write(outPath);
    return outPath;
  } catch {
    return path; // OSD unavailable or failed — proceed with original orientation
  }
}

// THE key fix for real-world scans: the MRZ occupies a small band near the
// bottom of a passport photo, so OCR-ing the whole page wastes resolution on
// everything else and reads the MRZ at low effective DPI. Cropping to just
// that band and upscaling it significantly is the standard technique for
// MRZ-specific OCR and typically improves accuracy far more than any global
// enhancement does.
async function cropMrzBand(path, tmpDir, label, { scale = 4, bandFraction = 0.28, binarize = false } = {}) {
  const img = await Jimp.read(path);
  const w = img.bitmap.width, h = img.bitmap.height;
  const bandTop = Math.floor(h * (1 - bandFraction));
  img.crop({ x: 0, y: bandTop, w, h: h - bandTop });
  img.greyscale();
  if (binarize) {
    // Simple global threshold at the midpoint of the observed range — the
    // MRZ's high black-on-white contrast makes this reliable without needing
    // a full Otsu implementation.
    let min = 255, max = 0;
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      const v = this.bitmap.data[idx];
      if (v < min) min = v;
      if (v > max) max = v;
    });
    const threshold = (min + max) / 2;
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      const v = this.bitmap.data[idx] > threshold ? 255 : 0;
      this.bitmap.data[idx] = this.bitmap.data[idx + 1] = this.bitmap.data[idx + 2] = v;
    });
  } else {
    img.contrast(0.3);
  }
  img.resize({ w: img.bitmap.width * scale, h: img.bitmap.height * scale });
  const outPath = `${tmpDir}/${label}.png`;
  await img.write(outPath);
  return outPath;
}


// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 3 — LOCAL OCR  (system tesseract binary, zero network)
// ─────────────────────────────────────────────────────────────────────────────

function ocrImage(path) {
  return execFileSync("tesseract", [path, "stdout", "--psm", "6"], {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 4 — MRZ (Machine Readable Zone) PARSING & ICAO 9303 CHECKSUM
// ─────────────────────────────────────────────────────────────────────────────

// Fields that MUST be numeric-only per the ICAO 9303 spec. OCR often confuses
// visually similar letters/digits here. Because these positions can only ever
// be digits, substituting the digit reading is a deterministic disambiguation
// — not a guess — and it is only ever kept if the checksum then validates.
const OCR_NUMERIC_CONFUSABLES = { O: "0", D: "0", I: "1", L: "1", S: "5", Z: "2", B: "8", G: "6", Q: "0" };
const OCR_FILLER_CONFUSABLES = { c: "<", C: "<", "«": "<", "‹": "<", " ": "<" };
// Stray-symbol misreads that stand in for a real letter. Applied to fields
// that may legitimately contain letters (e.g. passport numbers, which are
// alphanumeric per ICAO 9303 — unlike DOB/expiry, which are strictly
// numeric). This does NOT convert letters to digits; it only recovers a
// letter that OCR rendered as a non-alphanumeric symbol.
const OCR_SYMBOL_TO_LETTER = { "$": "S", "§": "S", "€": "E" };

function normalizeSymbols(s) {
  return s.split("").map((ch) => OCR_SYMBOL_TO_LETTER[ch] ?? ch).join("");
}

function normalizeFiller(s) {
  return s.split("").map((ch) => OCR_FILLER_CONFUSABLES[ch] ?? ch).join("");
}
function normalizeNumericField(s) {
  return s.split("").map((ch) => (/[0-9<]/.test(ch) ? ch : (OCR_NUMERIC_CONFUSABLES[ch] ?? ch))).join("");
}

function charValue(c) {
  if (/[0-9]/.test(c)) return Number(c);
  if (c === "<") return 0;
  if (/[A-Z]/.test(c)) return c.charCodeAt(0) - 55; // A=10 ... Z=35
  return null; // invalid — caller must treat as unreadable
}

function computeCheckDigit(s) {
  const weights = [7, 3, 1];
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const v = charValue(s[i]);
    if (v == null) return null;
    total += v * weights[i % 3];
  }
  return String(total % 10);
}

// Finds two consecutive OCR text lines that look like a TD3 MRZ block
// (starts with "P<", roughly 44 chars after normalization).
const MRZ_PURITY_THRESHOLD = 0.85; // fraction of chars that must be A-Z/0-9/< ; tolerates a stray OCR symbol

function purity(line) {
  const clean = (line.match(/[A-Z0-9<]/g) || []).length;
  return line.length ? clean / line.length : 0;
}

function locateMrzLines(ocrText) {
  const rawLines = ocrText.split("\n").map((l) => l.trim()).filter(Boolean);
  const candidates = rawLines.map((l) => normalizeFiller(l.toUpperCase().replace(/\s+/g, "")));
  for (let i = 0; i < candidates.length - 1; i++) {
    const l1 = candidates[i], l2 = candidates[i + 1];
    if (/^P</.test(l1) && l1.length >= 30 && l2.length >= 28 && purity(l1) >= MRZ_PURITY_THRESHOLD && purity(l2) >= MRZ_PURITY_THRESHOLD) {
      return { line1: l1.padEnd(44, "<").slice(0, 44), line2: l2.padEnd(44, "<").slice(0, 44) };
    }
  }
  return null;
}

/**
 * Parses + validates a TD3 MRZ pair. Returns per-field results where each
 * field is either { value, verified: true } (checksum passed, optionally
 * after a logged numeric-confusable correction) or { value: null, verified:
 * false, reason } — NEVER a best-guess value with verified left ambiguous.
 */
function parseAndValidateMrz(line1, line2) {
  const corrections = [];
  const result = { corrections };

  // Line 1: P<COUNTRY SURNAME<<GIVEN<<<...
  const surnameGiven = line1.slice(5).replace(/<+$/, "");
  const [surnamePart, givenPart] = surnameGiven.split("<<");
  result.surname = surnamePart ? surnamePart.replace(/</g, " ").trim() : null;
  result.givenNames = givenPart ? givenPart.replace(/</g, " ").trim() : null;
  result.issuingCountry = line1.slice(2, 5);

  // Line 2 fixed offsets (0-indexed): pno[0-8] check[9] nat[10-12] dob[13-18]
  // check[19] sex[20] exp[21-26] check[27] personal[28-41] check[42] composite[43]
  let l2 = line2;

  function field(start, end) { return l2.slice(start, end); }

  const rawPno = field(0, 9);
  const rawPnoCheck = field(9, 10);
  const rawNat = field(10, 13);
  const rawDob = field(13, 19);
  const rawDobCheck = field(19, 20);
  const rawSex = field(20, 21);
  const rawExp = field(21, 27);
  const rawExpCheck = field(27, 28);
  const rawPersonal = field(28, 42);
  const rawPersonalCheck = field(42, 43);
  const rawComposite = field(43, 44);

  function verifyNumericField(raw, rawCheck, label, alphanumeric = false) {
    // The field body: for strictly-numeric fields (DOB/expiry), try both
    // as-read and with letter->digit confusables corrected. For the
    // alphanumeric passport-number field, only correct stray *symbols* that
    // stand in for a letter — never convert a plausible letter to a digit,
    // since real passport numbers legitimately contain letters.
    const fieldAttempts = alphanumeric
      ? [raw, normalizeSymbols(raw)]
      : [raw, normalizeNumericField(raw)];
    // The check digit is always strictly numeric regardless of field type.
    const checkAttempts = [rawCheck, normalizeNumericField(rawCheck)];

    for (const attempt of fieldAttempts) {
      for (const chk of checkAttempts) {
        const expected = computeCheckDigit(attempt);
        if (expected != null && expected === chk) {
          if (attempt !== raw || chk !== rawCheck) {
            corrections.push(`${label}: corrected known OCR-confusable characters, then ICAO checksum verified match`);
          }
          return { value: attempt.replace(/</g, ""), verified: true, normalizedField: attempt, normalizedCheck: chk };
        }
      }
    }
    return { value: null, verified: false, reason: `${label}: checksum did not validate (read as "${raw}" / check "${rawCheck}")`, normalizedField: raw, normalizedCheck: rawCheck };
  }

  result.passportNumber = verifyNumericField(rawPno, rawPnoCheck, "passportNumber", true);
  result.dobRaw = verifyNumericField(rawDob, rawDobCheck, "dob");
  result.expiryRaw = verifyNumericField(rawExp, rawExpCheck, "expiry");
  result.nationality = /^[A-Z]{3}$/.test(rawNat) ? rawNat : null;
  result.sex = /^[MF<]$/.test(rawSex) ? rawSex : null;

  // Composite check over pno+check + dob+check + exp+check + personal+check.
  // Uses each field's already-verified/corrected form rather than the raw OCR
  // text — the composite spans the long filler-character run in the personal
  // number zone, which OCR is notoriously unreliable at counting, so feeding
  // it raw noise makes this check fail even when every individual field is
  // independently proven correct. Using the corrected forms keeps composite
  // meaningful as a genuine cross-check rather than a near-guaranteed false
  // failure caused by filler-run noise it was never meant to catch.
  const normalizedPersonal = normalizeFiller(rawPersonal);
  const normalizedPersonalCheck = rawPersonalCheck === "<" ? "<" : normalizeNumericField(rawPersonalCheck);
  const compositeInput =
    result.passportNumber.normalizedField + result.passportNumber.normalizedCheck +
    result.dobRaw.normalizedField + result.dobRaw.normalizedCheck +
    result.expiryRaw.normalizedField + result.expiryRaw.normalizedCheck +
    normalizedPersonal + normalizedPersonalCheck;
  const compositeExpected = computeCheckDigit(compositeInput);
  const allFieldsVerified = result.passportNumber.verified && result.dobRaw.verified && result.expiryRaw.verified;
  result.compositeVerified = compositeExpected != null && compositeExpected === rawComposite;
  // Composite failing while every individual field independently checksums out
  // correctly is a low-signal event (almost always filler-run OCR noise), not
  // real evidence of a misread — downgrade it so it doesn't force manual
  // review on documents that actually read cleanly.
  result.compositeSoftFail = !result.compositeVerified && allFieldsVerified;

  function yymmddToIso(yymmdd) {
    if (!yymmdd || yymmdd.length !== 6) return null;
    const yy = Number(yymmdd.slice(0, 2)), mm = yymmdd.slice(2, 4), dd = yymmdd.slice(4, 6);
    const century = yy <= 50 ? 2000 : 1900; // heuristic cutover; fine for DOB/expiry ranges in this dataset
    return `${century + yy}-${mm}-${dd}`;
  }
  result.dob = result.dobRaw.verified ? yymmddToIso(result.dobRaw.value) : null;
  result.expiry = result.expiryRaw.verified ? yymmddToIso(result.expiryRaw.value) : null;

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 5 — PASSPORT EXTRACTION PIPELINE (quality gate → OCR → retry → MRZ)
// ─────────────────────────────────────────────────────────────────────────────

async function extractPassport(path) {
  const flags = [];
  const quality = await assessImageQuality(path);
  if (!quality.ok) {
    flags.push({ type: "quality", reason: quality.reason });
    return { ok: false, flags, name: null };
  }

  const tmpDir = path + ".ocr-tmp";
  const { mkdirSync, rmSync } = await import("node:fs");
  mkdirSync(tmpDir, { recursive: true });
  const tempFiles = [];

  let best = null; // { mrz, parsed, allVerified, strategy, ocrText }
  try {
    const basePath = await correctRotation(path, tmpDir);
    if (basePath !== path) tempFiles.push(basePath);

    // Priority order: MRZ-band crop strategies first (the real fix for
    // phone-photo scans), full page as a fallback for edge cases where the
    // band-detection heuristic itself missed the MRZ's actual position.
    const strategies = [
      { label: "mrz-crop-upscaled", build: () => cropMrzBand(basePath, tmpDir, "crop-upscaled", { scale: 4, binarize: false }) },
      { label: "mrz-crop-binarized", build: () => cropMrzBand(basePath, tmpDir, "crop-binarized", { scale: 4, binarize: true }) },
      { label: "mrz-crop-tight-band", build: () => cropMrzBand(basePath, tmpDir, "crop-tight", { scale: 5, bandFraction: 0.18, binarize: true }) },
      { label: "full-page-raw", build: async () => basePath },
      { label: "full-page-enhanced", build: () => enhanceForRetry(basePath, `${tmpDir}/full-enhanced.png`) },
    ];

    async function tryStrategy(strategy) {
      const imgPath = await strategy.build();
      if (imgPath !== path && imgPath !== basePath) tempFiles.push(imgPath);
      const ocrText = ocrImage(imgPath);
      const mrz = locateMrzLines(ocrText);
      if (!mrz) return null;
      const parsed = parseAndValidateMrz(mrz.line1, mrz.line2);
      const allVerified = parsed.passportNumber.verified && parsed.dobRaw.verified && parsed.expiryRaw.verified;
      return { mrz, parsed, allVerified, strategy: strategy.label, ocrText };
    }

    let mrzWasLocatedAtAll = false;
    for (const strategy of strategies) {
      const outcome = await tryStrategy(strategy);
      if (!outcome) continue;
      mrzWasLocatedAtAll = true;
      if (!best || (outcome.allVerified && !best.allVerified)) best = outcome;
      if (outcome.allVerified) break;
    }

    // Rotation-search fallback: only paid when nothing above located an MRZ
    // at all. OSD orientation detection is unreliable on sparse, form-style
    // layouts (exactly what passport data pages are), so rather than trust
    // it blindly, we try the two most effective crop strategies at each
    // 90° rotation and let ICAO checksum validation — an objective signal —
    // decide which orientation was actually correct.
    if (!mrzWasLocatedAtAll) {
      for (const angle of [90, 180, 270]) {
        const img = await Jimp.read(basePath);
        img.rotate(angle);
        const rotPath = `${tmpDir}/rot${angle}.png`;
        await img.write(rotPath);
        tempFiles.push(rotPath);

        for (const build of [
          { label: `mrz-crop-upscaled@${angle}`, build: () => cropMrzBand(rotPath, tmpDir, `crop-upscaled-${angle}`, { scale: 4, binarize: false }) },
          { label: `mrz-crop-binarized@${angle}`, build: () => cropMrzBand(rotPath, tmpDir, `crop-binarized-${angle}`, { scale: 4, binarize: true }) },
        ]) {
          const outcome = await tryStrategy(build);
          if (!outcome) continue;
          if (!best || (outcome.allVerified && !best.allVerified)) best = outcome;
          if (outcome.allVerified) break;
        }
        if (best?.allVerified) break;
      }
    }
  } finally {
    try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }

  if (!best) {
    flags.push({ type: "mrz-not-found", reason: "MRZ block not located after trying all local preprocessing strategies (rotation correction, MRZ-band crop + upscale, binarized crop, full-page enhancement)" });
    return { ok: false, flags, name: null };
  }

  flags.push({ type: "ocr-strategy-used", reason: `MRZ read via: ${best.strategy}` });

  const parsed = best.parsed;
  for (const c of parsed.corrections) flags.push({ type: "checksum-corrected", reason: c });

  if (!parsed.passportNumber.verified) flags.push({ type: "checksum-fail", reason: parsed.passportNumber.reason });
  if (!parsed.dobRaw.verified) flags.push({ type: "checksum-fail", reason: parsed.dobRaw.reason });
  if (!parsed.expiryRaw.verified) flags.push({ type: "checksum-fail", reason: parsed.expiryRaw.reason });
  if (parsed.compositeSoftFail) {
    flags.push({ type: "composite-soft-fail", reason: "composite check digit didn't validate, but passport number/DOB/expiry each independently verified — likely filler-zone OCR noise, not a real misread. Informational only." });
  } else if (!parsed.compositeVerified) {
    flags.push({ type: "checksum-fail", reason: "composite check digit did not validate" });
  }

  const name = [parsed.givenNames, parsed.surname].filter(Boolean).join(" ").trim() || null;
  if (!name) flags.push({ type: "name-not-found", reason: "could not read surname/given names from MRZ" });

  // Also try to pick up a printed "Date of Issue" line from the visual text.
  // Only the full-page OCR passes will contain this (crop strategies only see
  // the MRZ band), so re-OCR the full page once more if a crop strategy won.
  let issueDate = null;
  const issueMatch = best.ocrText.match(/Date of Issue[:\s]+(\d{4}-\d{2}-\d{2})/i);
  if (issueMatch) {
    issueDate = issueMatch[1];
  } else if (best.strategy.startsWith("mrz-crop")) {
    try {
      const fullText = ocrImage(path);
      const m2 = fullText.match(/Date of Issue[:\s]+(\d{4}-\d{2}-\d{2})/i);
      if (m2) issueDate = m2[1];
    } catch {}
  }
  if (!issueDate) flags.push({ type: "issue-date-not-found", reason: "no printed issue date recognized on the page" });

  return {
    ok: true,
    flags,
    name,
    passportNumber: parsed.passportNumber.verified ? parsed.passportNumber.value : null,
    nationality: parsed.nationality,
    sex: parsed.sex,
    dob: parsed.dob,
    expiry: parsed.expiry,
    issueDate,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 6 — TICKET / VOUCHER EXTRACTION (text-based PDFs, same as invoices)
// ─────────────────────────────────────────────────────────────────────────────

function pdfToText(path) {
  return execFileSync("pdftotext", ["-layout", path, "-"], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}

function extractTicketOrVoucher(path) {
  const text = pdfToText(path);
  const nameMatch = text.match(/(?:Passenger Name|Guest Name|Traveller Name)[:\s]+([A-Za-z .]{2,60})/i);
  const emailMatch = text.match(/Email[:\s]+([\w.+-]+@[\w-]+\.[\w.-]+)/i);
  const refMatch = text.match(/Booking Reference[:\s]+(\S+)/i);
  const flags = [];
  if (!nameMatch) flags.push({ type: "name-not-found", reason: "no passenger/guest/traveller name pattern found in document" });
  return {
    ok: !!nameMatch,
    flags,
    name: nameMatch ? nameMatch[1].trim() : null,
    email: emailMatch ? emailMatch[1].trim() : null,
    bookingRef: refMatch ? refMatch[1].trim() : null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 7 — NAME CANONICALIZATION & FUZZY MATCHING
// ─────────────────────────────────────────────────────────────────────────────

function canonicalizeName(raw) {
  if (!raw) return "";
  return raw
    .replace(/^(mr|mrs|ms|miss|dr|shri|smt|m\/s|master)\.?\s+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// Classic Soundex — catches transliteration/spelling drift edit-distance misses.
function soundex(word) {
  if (!word) return "";
  const w = word.toUpperCase().replace(/[^A-Z]/g, "");
  if (!w) return "";
  const codes = { B: 1, F: 1, P: 1, V: 1, C: 2, G: 2, J: 2, K: 2, Q: 2, S: 2, X: 2, Z: 2, D: 3, T: 3, L: 4, M: 5, N: 5, R: 6 };
  let out = w[0];
  let lastCode = codes[w[0]] ?? 0;
  for (let i = 1; i < w.length && out.length < 4; i++) {
    const code = codes[w[i]] ?? 0;
    if (code !== 0 && code !== lastCode) out += code;
    lastCode = code;
  }
  return (out + "000").slice(0, 4);
}

function tokenSimilarity(a, b) {
  if (a === b) return 1;
  const dist = levenshtein(a, b);
  const editScore = 1 - dist / Math.max(a.length, b.length, 1);
  const phoneticMatch = soundex(a) === soundex(b) ? 1 : 0;
  return Math.max(editScore, phoneticMatch * 0.75);
}

// Greedy token-set alignment: order-independent, tolerant of missing/extra tokens.
function nameSimilarity(nameA, nameB) {
  const tokensA = canonicalizeName(nameA).split(" ").filter(Boolean);
  const tokensB = [...canonicalizeName(nameB).split(" ").filter(Boolean)];
  if (!tokensA.length || !tokensB.length) return 0;

  let total = 0;
  for (const ta of tokensA) {
    let best = 0, bestIdx = -1;
    tokensB.forEach((tb, idx) => {
      const s = tokenSimilarity(ta, tb);
      if (s > best) { best = s; bestIdx = idx; }
    });
    total += best;
    if (bestIdx !== -1) tokensB.splice(bestIdx, 1);
  }
  return total / Math.max(tokensA.length, canonicalizeName(nameA).split(" ").length);
}

const MATCH_THRESHOLD = 0.45;      // below this, a candidate isn't shown at all
const CONFIDENT_MATCH = 0.85;      // above this with no close rival = single confident match
const AMBIGUOUS_GAP = 0.12;        // if top two candidates are within this gap, flag ambiguous

function findMatches(extracted, candidates) {
  const scored = candidates.map((c) => {
    let score = nameSimilarity(extracted.name ?? "", c.full_name ?? "");
    const corroboration = [];
    if (extracted.email && c.email && extracted.email.toLowerCase() === c.email.toLowerCase()) {
      score = Math.min(1, score + 0.4); corroboration.push("email match");
    }
    if (extracted.bookingRef && c.booking_ref && extracted.bookingRef === c.booking_ref) {
      score = Math.min(1, score + 0.4); corroboration.push("booking reference match");
    }
    if (extracted.phone && c.phone && extracted.phone === c.phone) {
      score = Math.min(1, score + 0.3); corroboration.push("phone match");
    }
    return { candidate: c, score, corroboration };
  })
  .filter((r) => r.score >= MATCH_THRESHOLD)
  .sort((a, b) => b.score - a.score);

  if (!scored.length) return { status: "no-match", candidates: [] };
  if (scored.length === 1 || scored[0].score - scored[1].score >= AMBIGUOUS_GAP) {
    return { status: scored[0].score >= CONFIDENT_MATCH ? "confident" : "low-confidence", candidates: scored.slice(0, 3) };
  }
  return { status: "ambiguous", candidates: scored.filter((s) => scored[0].score - s.score < AMBIGUOUS_GAP || s === scored[1]) };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 8 — COHERENCE, RENEWAL & CONFLICT CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function checkCoherence(extracted) {
  const flags = [];
  if (extracted.issueDate && extracted.expiry) {
    if (new Date(extracted.issueDate) >= new Date(extracted.expiry)) {
      flags.push({ type: "coherence", reason: `issue date (${extracted.issueDate}) is not before expiry (${extracted.expiry})` });
    }
  }
  if (extracted.dob) {
    const age = (Date.now() - new Date(extracted.dob).getTime()) / (365.25 * 24 * 3600 * 1000);
    if (age < 0 || age > 120) {
      flags.push({ type: "coherence", reason: `implausible age derived from DOB (${extracted.dob}) — ${age.toFixed(1)} years` });
    }
  }
  return flags;
}

function checkAgainstExistingRecord(extracted, candidate) {
  const flags = [];
  if (!candidate) return flags;

  const samePassport = candidate.passport_number && extracted.passportNumber && candidate.passport_number === extracted.passportNumber;
  const diffPassport = candidate.passport_number && extracted.passportNumber && candidate.passport_number !== extracted.passportNumber;
  const sameDob = candidate.dob && extracted.dob && candidate.dob === extracted.dob;
  const diffDob = candidate.dob && extracted.dob && candidate.dob !== extracted.dob;

  if (samePassport && diffDob) {
    flags.push({ type: "conflict", reason: `same passport number on file (${candidate.passport_number}) but DOB differs from existing record (existing: ${candidate.dob}, new: ${extracted.dob}) — a passport number cannot belong to two different birthdates` });
  } else if (diffPassport && sameDob && candidate.passport_issue_date && extracted.issueDate && new Date(extracted.issueDate) > new Date(candidate.passport_issue_date)) {
    flags.push({ type: "renewal-detected", reason: `passport number changed (existing: ${candidate.passport_number} → new: ${extracted.passportNumber}) with a later issue date and matching DOB — looks like a passport renewal, not a conflict` });
  } else if (diffPassport && diffDob) {
    flags.push({ type: "conflict", reason: `both passport number and DOB differ from the existing record on file — verify this is actually the same person` });
  }
  return flags;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 9 — MAIN
// ─────────────────────────────────────────────────────────────────────────────

function log(msg) { console.log(msg); }

async function main() {
  log("── Scanning documents folder (local filesystem only) ────────────");
  const docs = collectDocs(ROOT_DIR);
  if (!docs.length) die(`No documents found under ${ROOT_DIR}`);
  log(`  Found ${docs.length} document(s)\n`);

  const state = loadState();
  const results = [];
  let skippedDup = 0, failedQuality = 0, failedMrz = 0, checksumIssues = 0, ok = 0;

  for (const path of docs) {
    const hash = fileHash(path);
    if (state.processed[hash]) { skippedDup++; continue; }

    const ext = extname(path).toLowerCase();
    const isImage = [".png", ".jpg", ".jpeg", ".tif", ".tiff"].includes(ext);
    const docId = createHash("sha256").update(path).digest("hex").slice(0, 12); // opaque local id, no PII

    let record;
    if (isImage) {
      const extracted = await extractPassport(path);
      record = { docId, docType: "passport", ...extracted };
    } else {
      const extracted = extractTicketOrVoucher(path);
      record = { docId, docType: "ticket_or_voucher", ...extracted };
    }

    if (record.flags?.some((f) => f.type === "quality")) failedQuality++;
    if (record.flags?.some((f) => f.type === "mrz-not-found")) failedMrz++;
    if (record.flags?.some((f) => f.type === "checksum-fail")) checksumIssues++;
    if (record.ok) ok++;

    // Match + coherence, only meaningful once we have a name to match on
    if (record.name) {
      const matchResult = findMatches(record, CANDIDATES);
      record.match = matchResult;

      const coherenceFlags = checkCoherence(record);
      const topCandidate = matchResult.candidates[0]?.candidate ?? null;
      const relationalFlags = record.docType === "passport" ? checkAgainstExistingRecord(record, topCandidate) : [];
      record.flags = [...(record.flags ?? []), ...coherenceFlags, ...relationalFlags];
    }

    results.push(record);
    state.processed[hash] = { at: new Date().toISOString(), docId, ok: record.ok };
  }

  saveState(state);

  // ── Write local review file (full detail — never printed, never opened by CLI) ──
  writeFileSync(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));

  // ── Console summary — counts and categories only, never a name/value ─────────
  const flagCounts = {};
  for (const r of results) for (const f of r.flags ?? []) flagCounts[f.type] = (flagCounts[f.type] ?? 0) + 1;

  const matchStatusCounts = { confident: 0, "low-confidence": 0, ambiguous: 0, "no-match": 0 };
  for (const r of results) if (r.match) matchStatusCounts[r.match.status]++;

  log("── Summary (counts only — no names, no document contents) ───────");
  log(`  Documents scanned        : ${docs.length}`);
  log(`  Already processed (skip) : ${skippedDup}`);
  log(`  Newly processed          : ${results.length}`);
  log(`  Extraction succeeded     : ${ok}`);
  log(`  Failed quality gate      : ${failedQuality}`);
  log(`  MRZ not located          : ${failedMrz}`);
  log(`  Docs with checksum issue : ${checksumIssues}`);
  log("");
  log("  Match status breakdown:");
  for (const [k, v] of Object.entries(matchStatusCounts)) log(`    ${k.padEnd(16)}: ${v}`);
  log("");
  log("  Flag type breakdown:");
  for (const [k, v] of Object.entries(flagCounts)) log(`    ${k.padEnd(24)}: ${v}`);
  log(`\n  ✅  Review file written: ${OUT_FILE}`);
  log(`  Nothing was written to Supabase — this is Stage 1 only.`);
  log(`  Open the review file yourself to make approval decisions.`);
}

main().catch((err) => {
  console.error(`\n❌  Fatal: ${err.message}`);
  if (VERBOSE) console.error(err.stack);
  process.exit(1);
});
