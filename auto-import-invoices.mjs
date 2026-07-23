#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
//  auto-import-invoices.mjs — The Nomads Co. Invoice Importer  v3.0
// ═══════════════════════════════════════════════════════════════════════════════
//
//  HOW IT WORKS
//  ────────────
//  1. Fetches live schema from Supabase (column names + types + required fields)
//  2. Recursively scans the invoice backup folder for PDFs
//  3. Parses every PDF locally using pdftotext (zero network, zero AI)
//  4. Smart-matches parsed fields → schema columns with type coercion
//  5. Validates required fields BEFORE attempting any insert
//  6. Inserts: leads → booked_trips → booking_items
//  7. Cleans up broken null-lead_id rows from prior failed runs
//  8. Saves progress to .import-state.json so reruns skip done files instantly
//  9. Rolls back trip row if booking_items insert fails (no orphaned data)
// 10. --analyze-errors reads your local log and groups failures by type
//     (no data ever leaves your machine in that mode)
//
//  USAGE
//  ─────
//  node auto-import-invoices.mjs               full run
//  node auto-import-invoices.mjs --dry-run     preview only, no DB writes
//  node auto-import-invoices.mjs --dir /path   use a different folder
//  node auto-import-invoices.mjs --reset       clear saved progress (reimport all)
//  node auto-import-invoices.mjs --analyze-errors [import-log.txt]
//  node auto-import-invoices.mjs --diagnose    read-only live-DB check — run this FIRST
//                                               if a re-import looks like it did nothing;
//                                               shows actual row counts, orphaned rows,
//                                               and placeholder names currently in Supabase
//
//  PREREQUISITES
//  ─────────────
//  brew install poppler    (provides pdftotext)
//  npm install             (supabase-js, dotenv, ws already in package.json)
// ═══════════════════════════════════════════════════════════════════════════════

import { execFileSync }                    from "node:child_process";
import { readdirSync, readFileSync,
         writeFileSync, existsSync,
         statSync }                        from "node:fs";
import { join, basename, dirname,
         resolve }                         from "node:path";
import { fileURLToPath }                   from "node:url";
import { createClient }                    from "@supabase/supabase-js";
import dotenv                              from "dotenv";
import ws                                  from "ws";

dotenv.config({ path: ".dev.vars" });

// ── Constants ──────────────────────────────────────────────────────────────────

const __dir         = dirname(fileURLToPath(import.meta.url));
const STATE_FILE    = join(__dir, ".import-state.json");
const LOG_FILE      = join(__dir, "import-log.txt");
const BUCKET        = "invoices";
const RETRY_LIMIT   = 3;
const RETRY_DELAY   = 1200; // ms

const SUPABASE_URL  = process.env.SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

const args          = process.argv.slice(2);
const DRY_RUN       = args.includes("--dry-run");
const RESET         = args.includes("--reset");
const ANALYZE       = args.includes("--analyze-errors");
const ANALYZE_FILE  = ANALYZE ? (args[args.indexOf("--analyze-errors") + 1] || LOG_FILE) : null;
const DIAGNOSE      = args.includes("--diagnose");
const dirIdx        = args.indexOf("--dir");
const ROOT_DIR      = dirIdx !== -1
  ? resolve(args[dirIdx + 1])
  : "/Users/soham2003/Documents/Workspace/react-router-starter-template/The Nomads Co. Invoices Backup";

// ── Startup ────────────────────────────────────────────────────────────────────

if (ANALYZE) { analyzeErrors(ANALYZE_FILE); process.exit(0); }

if (!SUPABASE_URL || !SUPABASE_KEY) {
  die("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .dev.vars");
}

// --diagnose is read-only against Supabase and needs neither the invoices
// folder nor pdftotext, so it's dispatched before those checks.
if (DIAGNOSE) {
  const diagClient = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { transport: ws }, auth: { persistSession: false } });
  await runDiagnostics(diagClient);
  process.exit(0);
}

if (!existsSync(ROOT_DIR)) {
  die(`Folder not found: ${ROOT_DIR}`);
}
try { execFileSync("pdftotext", ["-v"], { stdio: "pipe" }); } catch {
  die("pdftotext not found — run: brew install poppler");
}

if (DRY_RUN) log("🔍  DRY RUN — no database writes.\n");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { transport: ws },
  auth: { persistSession: false },
});

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 1 — LIVE SCHEMA INTROSPECTION
//  Fetches column names, types, formats, and required fields from PostgREST's
//  OpenAPI spec. Uses definitions (reliable) not GET params (unreliable).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {{ name: string, type: string, format: string|null, required: boolean }} ColDef
 * @typedef {Map<string, ColDef[]>} TableSchema
 */

async function fetchLiveSchema(tableNames) {
  const res = await retry(() =>
    fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey:        SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
  );
  if (!res.ok) die(`Schema fetch failed: ${res.status} ${res.statusText}`);

  const spec    = await res.json();
  /** @type {TableSchema} */
  const schemas = new Map();

  for (const table of tableNames) {
    const def = spec.definitions?.[table];
    if (!def?.properties) {
      log(`  ⚠  ${table}: not in schema — all fields will be passed through`);
      schemas.set(table, null);
      continue;
    }

    const required = new Set(def.required ?? []);
    /** @type {ColDef[]} */
    const cols = Object.entries(def.properties).map(([name, prop]) => ({
      name,
      type:     prop.type     ?? "string",
      format:   prop.format   ?? null,
      required: required.has(name),
    }));

    schemas.set(table, cols);
    const reqList = cols.filter(c => c.required).map(c => c.name);
    log(`  ✓ ${table} — ${cols.length} columns${reqList.length ? ` (required: ${reqList.join(", ")})` : ""}`);
  }
  return schemas;
}

/** Return columns as a Set<string> for fast lookup */
function colSet(cols) {
  return cols ? new Set(cols.map(c => c.name)) : null;
}

/** Look up a ColDef by name */
function colDef(cols, name) {
  return cols?.find(c => c.name === name) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 2 — SMART ROW BUILDER
//  Maps arbitrary parsed-field candidates to actual schema columns.
//  Priority: exact match → alias → semantic similarity.
//  Coerces every value to the correct type before inserting.
//  Throws if any required column has no value after matching.
// ─────────────────────────────────────────────────────────────────────────────

// Human-curated aliases for common field name variations
const FIELD_ALIASES = {
  invoice_no:           ["invoice_number"],
  invoice_number:       ["invoice_no"],
  grand_total:          ["total_invoice_value", "total_amount", "amount"],
  total_invoice_value:  ["grand_total", "total_amount", "amount"],
  total_amount:         ["grand_total", "total_invoice_value"],
  booking_date:         ["invoice_date", "date"],
  invoice_date:         ["booking_date", "date"],
  trip_name:            ["package_name", "description"],
  package_name:         ["trip_name", "description"],
  invoice_file_url:     ["file_url", "pdf_url"],
  file_url:             ["invoice_file_url", "pdf_url"],
  client_gstin:         ["gstin"],
  gstin:                ["client_gstin"],
  amount_paid:          ["grand_total", "total_invoice_value", "total_amount"],
  travel_start:         ["trip_start", "departure_date", "start_date"],
  travel_end:           ["trip_end", "return_date", "end_date"],
  // booking_items
  trip_id:              ["booked_trip_id", "booking_id"],
  booked_trip_id:       ["trip_id", "booking_id"],
  booking_id:           ["trip_id", "booked_trip_id"],
  cost:                 ["total", "amount", "price"],
  total:                ["cost", "amount", "price"],
  amount:               ["cost", "total", "price"],
};

/**
 * Coerce a value to match a column's expected type.
 * Handles: uuid passthrough, date strings, timestamps, numbers, booleans.
 */
function coerce(value, def) {
  if (value == null) return null;
  if (!def) return value;

  const fmt = def.format ?? "";
  const typ = def.type   ?? "string";

  // Dates
  if (fmt === "date") {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    // Try parsing DD/MM/YYYY
    const dm = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dm) return `${dm[3]}-${dm[2].padStart(2,"0")}-${dm[1].padStart(2,"0")}`;
    return null; // Can't parse — skip rather than insert garbage
  }

  // Timestamps
  if (fmt.includes("timestamp") || fmt === "timestamp with time zone") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  // UUIDs — pass through (Supabase rejects malformed ones)
  if (fmt === "uuid") {
    return /^[0-9a-f-]{36}$/i.test(String(value)) ? value : null;
  }

  // Numbers / integers
  if (typ === "number" || typ === "integer" || fmt.match(/int|numeric|float|double|real|money|decimal/i)) {
    const n = Number(String(value).replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  // Booleans
  if (typ === "boolean") {
    if (typeof value === "boolean") return value;
    return ["true","yes","1","y"].includes(String(value).toLowerCase());
  }

  // Strings — trim, null-out empty
  const s = String(value).trim();
  return s || null;
}

/**
 * Build a DB-ready row from loose candidate key/value pairs.
 * - cols: ColDef[] from fetchLiveSchema (null = pass everything)
 * - requiredGuard: extra columns that MUST survive (throw if missing)
 */
function buildRow(candidates, cols, requiredGuard = []) {
  // No schema info → pass all non-null values through unmodified
  if (cols === null) {
    const row = Object.fromEntries(
      Object.entries(candidates).filter(([, v]) => v != null)
    );
    for (const req of requiredGuard) {
      if (row[req] == null) throw new Error(`Required field "${req}" is missing (table not in schema)`);
    }
    return row;
  }

  const names = colSet(cols);
  const row   = {};

  for (const [key, rawVal] of Object.entries(candidates)) {
    if (rawVal == null) continue;

    // 1. Exact match
    if (names.has(key)) {
      const coerced = coerce(rawVal, colDef(cols, key));
      if (coerced != null) row[key] = coerced;
      continue;
    }

    // 2. Alias match (try each alias in order)
    const aliases = FIELD_ALIASES[key] ?? [];
    for (const alias of aliases) {
      if (names.has(alias) && row[alias] == null) {
        const coerced = coerce(rawVal, colDef(cols, alias));
        if (coerced != null) { row[alias] = coerced; break; }
      }
    }
    // (silently skip if no match — field doesn't exist in this table)
  }

  // Required field guard — throw before touching DB
  for (const req of requiredGuard) {
    if (row[req] == null) {
      const candidates_str = Object.keys(candidates).join(", ");
      throw new Error(
        `Required field "${req}" could not be mapped. ` +
        `Available candidate keys: [${candidates_str}]. ` +
        `Table columns: [${[...names].join(", ")}]`
      );
    }
  }

  return row;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 3 — PDF PARSING  (100% local, pdftotext -layout)
// ─────────────────────────────────────────────────────────────────────────────

function pdfToText(path) {
  return execFileSync("pdftotext", ["-layout", path, "-"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

function num(s) {
  if (s == null) return null;
  const n = Number(String(s).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

function matchField(text, label) {
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m   = text.match(new RegExp(esc + "[:\\s]+([^\\n]+?)(?:\\s{2,}|$)", "m"));
  return m ? m[1].trim().replace(/:$/, "").trim() : null;
}

function toIso(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return null;
}

function mirroredLeft(line) {
  const t = line.trim();
  const re = /\s{2,}/g;
  let m;
  while ((m = re.exec(t))) {
    const l = t.slice(0, m.index).trim();
    const r = t.slice(m.index + m[0].length).trim();
    if (l && l === r) return l;
  }
  return null;
}

function parseBillingBlock(text) {
  const lines = text.split("\n");
  const si    = lines.findIndex(l => /^\s*Billing Address\s{2,}Shipping Address\s*$/.test(l));
  if (si === -1) return { name: null, gstin: null, state: null };

  const block = [];
  for (let i = si + 1; i < lines.length; i++) {
    if (!lines[i].trim()) break;
    const left = mirroredLeft(lines[i]);
    if (left) block.push(left);
  }

  const last     = block[block.length - 1] ?? "";
  const gstinHit = last.match(/^GSTIN:\s*(\S+)$/);
  if (gstinHit) {
    const gstin    = gstinHit[1];
    const body     = block.slice(0, -1);
    let addrStart  = body.length;
    while (addrStart > 0 && body[addrStart - 1].includes(",")) addrStart--;
    if (addrStart === body.length) addrStart = Math.max(0, body.length - 1);
    const nameStr  = body.slice(0, addrStart).join("").trim() || null;
    const addrStr  = body.slice(addrStart).join(" ").trim()   || null;
    const parts    = (addrStr || "").split(",").map(s => s.trim());
    const state    = parts.length > 1 ? parts[parts.length - 1] : addrStr;
    return { name: nameStr, gstin, state };
  }
  // No GSTIN
  const state = last || null;
  const name  = block.slice(0, -1).join("").trim() || null;
  return { name, gstin: null, state };
}

function nameFromText(text) {
  // "To: ...", "Bill To: ...", "Dear ..."
  const patterns = [
    /^[ \t]*To[,:][ \t]*([A-Z][^\n]{2,80})/m,
    /Bill\s*To[:\s]*\n\s*([A-Z][^\n]{2,80})/im,
    /Dear\s+([A-Z][^\n,]{2,60})[,\n]/im,
    /^[ \t]*Attention[:\s]+([A-Z][^\n]{2,80})/im,
    /^[ \t]*Client[:\s]+([A-Z][^\n]{2,80})/im,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

function nameFromFilename(pdfPath) {
  let n = basename(pdfPath, ".pdf")
    // Strip common TNC prefixes and invoice number patterns
    .replace(/^TAX[_\s]INVOICE[_\s]TNC[_\s]\d+[_\s]\d{2}-\d{2}[_\s]/i, "")
    .replace(/^TNC[C]?[-_\s]\d+[-_\s]*/i, "")
    .replace(/^T[-_\s]\d+\s*/i, "")
    .replace(/^\d{4}-\d{4}[-_\s]*/i, "")
    .replace(/^\d+[._\s]+/,    "")
    .replace(/_/g, " ")
    // Strip document-type suffixes
    .replace(/\s+(Visa\s*\d*|Hotel\s*Booking|Air\s*Tkt|Air\s*Tickets?|Flight\s*Tickets?|Package|Proforma\s*Invoice?|Credit\s*Note|Ledger|Amended|Dom\.?|Domestic|Insurance)\s*$/i, "")
    .replace(/\s+\d+$/, "")
    .trim();
  // Reject if what's left is all numbers or too short
  if (!n || /^\d+$/.test(n) || n.length < 2) return null;
  return n;
}

function parseItemsTable(text) {
  const lines     = text.split("\n");
  const headerIdx = lines.findIndex(l => /Description\s+HSN.?SAC/i.test(l));
  const totalIdx  = lines.findIndex((l, i) => i > headerIdx && /^\s*TOTAL\s*\(/i.test(l));
  if (headerIdx === -1 || totalIdx === -1) return { taxStructure: null, items: [], grand: null };

  const headerLine  = lines[headerIdx];
  const taxStructure = /IGST/i.test(headerLine) ? "inter" : /CGST/i.test(headerLine) ? "intra" : null;

  // Items are in triplets: tax-amounts / main-row / tax-percentages
  const body = lines
    .slice(headerIdx + 1, totalIdx)
    .filter(l => l.trim() && !/Description\s+HSN/i.test(l));

  const items = [];
  for (let i = 0; i + 2 < body.length; i += 3) {
    const taxAmts = body[i].trim().split(/\s{2,}/);
    const row     = body[i + 1].trim().split(/\s{2,}/);
    const taxPcts = body[i + 2].trim().split(/\s{2,}/);

    // row: [sNo, description, hsn_sac, qty, rate, taxable_value, total]
    const [, description, hsn_sac, qty, rate, taxable_value, total] = row;
    if (!description) continue;

    const item = {
      description:    description?.trim() ?? null,
      hsn_sac:        (hsn_sac && hsn_sac !== "-") ? hsn_sac : null,
      qty:            num(qty),
      rate:           num(rate),
      taxable_value:  num(taxable_value),
      cost:           num(total),
      total:          num(total),
      amount:         num(total),
    };

    if (taxStructure === "intra") {
      item.cgst_amount = num(taxAmts[0]);
      item.cgst_pct    = num((taxPcts[0] || "").replace(/[()%]/g, ""));
      item.sgst_amount = num(taxAmts[1]);
      item.sgst_pct    = num((taxPcts[1] || "").replace(/[()%]/g, ""));
    } else {
      item.igst_amount = num(taxAmts[0]);
      item.igst_pct    = num((taxPcts[0] || "").replace(/[()%]/g, ""));
    }
    items.push(item);
  }

  // Parse totals line
  const totTok = lines[totalIdx].trim().split(/\s{2,}/).slice(1);
  let grand = null;
  if (taxStructure === "intra" && totTok.length >= 4) grand = num(totTok[3]);
  else if (totTok.length >= 3) grand = num(totTok[2]);
  else if (totTok.length)      grand = num(totTok[totTok.length - 1]);

  return { taxStructure, items, grand };
}

function itemType(desc) {
  if (!desc) return "Other";
  const d = desc.toLowerCase();
  if (/flight|airways|airline|air\s*ticket/.test(d)) return "Flight";
  if (/hotel|resort|accommodation|lodge|stay/.test(d)) return "Hotel";
  if (/transfer|cab|taxi|pickup|drop|transport/.test(d)) return "Transfer";
  if (/visa/.test(d)) return "Visa";
  if (/service\s*charge|handling/.test(d)) return "Service";
  if (/package|tour/.test(d)) return "Package";
  if (/insurance/.test(d)) return "Insurance";
  return "Activity";
}

/**
 * Parse a single PDF. Returns a flat object with all extracted fields.
 * Never throws — errors are returned in the `_error` field.
 */
function parsePdf(pdfPath) {
  try {
    const text     = pdfToText(pdfPath);
    const billing  = parseBillingBlock(text);
    const { taxStructure, items, grand } = parseItemsTable(text);

    const invoiceNo   = matchField(text, "Invoice No.");
    const invoiceDate = toIso(matchField(text, "Invoice Date"));
    const dueDate     = toIso(matchField(text, "Due Date"));
    const supply      = matchField(text, "Place of Supply");
    const ref         = matchField(text, "Reference No");

    const firstDesc = items[0]?.description ?? null;
    const dest = firstDesc
      ? firstDesc
          .replace(/\s+(Package|Hotel\s*Booking|Flight\s*Booking|Tour|Trip|Booking|Service\s*Charges?)\b.*$/i, "")
          .trim()
      : supply;

    const clientName =
      billing.name        ??
      nameFromText(text)  ??
      nameFromFilename(pdfPath) ??
      `Unknown — ${basename(pdfPath, ".pdf")}`;

    const tripLabel = firstDesc ?? (invoiceNo ? `Invoice ${invoiceNo}` : basename(pdfPath, ".pdf"));

    return {
      // Identity
      invoice_number:      invoiceNo,
      invoice_no:          invoiceNo,
      invoice_date:        invoiceDate,
      booking_date:        invoiceDate,
      due_date:            dueDate,
      place_of_supply:     supply,
      reference_no:        ref === "-" ? null : ref,
      tax_structure:       taxStructure,
      // Client
      client_name:         clientName,
      client_gstin:        billing.gstin,
      gstin:               billing.gstin,
      client_state:        billing.state,
      client_type:         billing.gstin ? "Company" : "Individual",
      // Trip
      trip_name:           tripLabel,
      package_name:        tripLabel,
      destination:         dest,
      // Financials (offer multiple aliases so buildRow finds the right column)
      grand_total:         grand,
      total_invoice_value: grand,
      total_amount:        grand,
      amount_paid:         grand,
      payment_status:      "Paid",
      trip_status:         "Completed",
      // Lead
      source:              "Historical Import",
      lead_status:         "Converted",
      // Items (internal — not inserted into trips table)
      _items:   items.map(it => ({ ...it, item_type: itemType(it.description) })),
      _rawPath: pdfPath,
    };
  } catch (err) {
    return { _error: err.message, _rawPath: pdfPath };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 4 — FILE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function collectPdfs(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    try {
      if (statSync(full).isDirectory()) out.push(...collectPdfs(full));
      else if (entry.toLowerCase().endsWith(".pdf")) out.push(full);
    } catch { /* permission error — skip */ }
  }
  return out.sort();
}

function loadState() {
  if (RESET && existsSync(STATE_FILE)) {
    writeFileSync(STATE_FILE, JSON.stringify({ imported: {}, failed: {} }, null, 2));
    log("  ♻️  Progress reset — will reimport all files.");
  }
  if (!existsSync(STATE_FILE)) return { imported: {}, failed: {} };
  try { return JSON.parse(readFileSync(STATE_FILE, "utf8")); }
  catch { return { imported: {}, failed: {} }; }
}

function saveState(state) {
  if (DRY_RUN) return;
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 5 — SUPABASE OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Retry wrapper — handles transient network/rate-limit errors */
async function retry(fn, label = "") {
  for (let attempt = 1; attempt <= RETRY_LIMIT; attempt++) {
    try {
      const result = await fn();
      // If result is a Response, check HTTP status
      if (result instanceof Response && !result.ok && result.status >= 500) {
        throw new Error(`HTTP ${result.status}`);
      }
      return result;
    } catch (err) {
      const transient = err.message.includes("fetch") ||
                        err.message.includes("ECONNRESET") ||
                        err.message.includes("HTTP 5") ||
                        err.message.includes("timeout");
      if (attempt === RETRY_LIMIT || !transient) throw err;
      log(`    ↺ Retry ${attempt}/${RETRY_LIMIT - 1}${label ? ` [${label}]` : ""}…`);
      await new Promise(r => setTimeout(r, RETRY_DELAY * attempt));
    }
  }
}

async function cleanupNullRows() {
  const { count } = await supabase
    .from("booked_trips")
    .select("*", { count: "exact", head: true })
    .is("lead_id", null);
  if (!count) { log("  ✓ No broken rows to clean up."); return; }
  log(`  🧹  Removing ${count} broken null-lead_id rows from previous runs…`);
  const { error } = await supabase.from("booked_trips").delete().is("lead_id", null);
  if (error) log(`  ⚠  Cleanup warning: ${error.message} — continuing anyway`);
  else log(`  ✓  Cleaned up ${count} broken rows`);
}

async function ensureBucket() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) die(`Cannot list storage buckets: ${error.message}`);
  if (!data.some(b => b.name === BUCKET)) {
    die(`Storage bucket "${BUCKET}" not found.\nCreate it in: Supabase Dashboard → Storage → New Bucket → Name: "invoices" → Private`);
  }
}

async function findOrCreateLead(inv, leadsCols) {
  // Try to find by exact name first
  const { data: found, error: findErr } = await retry(() =>
    supabase.from("leads").select("id, name").eq("name", inv.client_name).is("deleted_at", null).limit(1)
  );
  if (findErr) throw new Error(`Lead lookup failed: ${findErr.message}`);
  if (found?.length) return { id: found[0].id, created: false };

  // Also try case-insensitive (ilike)
  const { data: iFound } = await retry(() =>
    supabase.from("leads").select("id, name").ilike("name", inv.client_name).is("deleted_at", null).limit(1)
  );
  if (iFound?.length) return { id: iFound[0].id, created: false };

  // Create new lead
  const row = buildRow({
    name:        inv.client_name,
    lead_status: inv.lead_status,
    source:      inv.source,
    destination: inv.destination,
    client_type: inv.client_type,
  }, leadsCols, ["name"]);

  const { data, error } = await retry(() =>
    supabase.from("leads").insert(row).select("id").single()
  );
  if (error) throw new Error(`Lead insert failed for "${inv.client_name}": ${error.message}`);
  return { id: data.id, created: true };
}

async function alreadyImported(invoiceNo) {
  if (!invoiceNo) return false;
  for (const col of ["invoice_number", "invoice_no"]) {
    const { data, error } = await retry(() =>
      supabase.from("booked_trips").select("id").eq(col, invoiceNo).not("lead_id", "is", null).limit(1)
    );
    if (!error && data?.length) return true;
  }
  return false;
}

async function uploadPdf(pdfPath, invoiceNo) {
  const key    = `${String(invoiceNo ?? basename(pdfPath)).replace(/[\/\\]/g, "-")}.pdf`;
  const buffer = readFileSync(pdfPath);
  const { error: upErr } = await retry(() =>
    supabase.storage.from(BUCKET).upload(key, buffer, {
      contentType: "application/pdf",
      upsert: true,
    })
  );
  if (upErr) throw new Error(`PDF upload failed: ${upErr.message}`);

  const { data: signed, error: signErr } = await supabase.storage
    .from(BUCKET).createSignedUrl(key, 60 * 60 * 24 * 365 * 10);
  if (signErr) throw new Error(`Signed URL failed: ${signErr.message}`);
  return signed.signedUrl;
}

async function insertTrip(leadId, inv, pdfUrl, tripsCols) {
  const row = buildRow({
    lead_id:             leadId,
    trip_name:           inv.trip_name,
    package_name:        inv.package_name,
    destination:         inv.destination,
    invoice_number:      inv.invoice_number,
    invoice_no:          inv.invoice_no,
    invoice_file_url:    pdfUrl,
    file_url:            pdfUrl,
    invoice_date:        inv.invoice_date,
    booking_date:        inv.booking_date,
    due_date:            inv.due_date,
    place_of_supply:     inv.place_of_supply,
    reference_no:        inv.reference_no,
    tax_structure:       inv.tax_structure,
    grand_total:         inv.grand_total,
    total_invoice_value: inv.total_invoice_value,
    total_amount:        inv.total_amount,
    amount_paid:         inv.amount_paid,
    payment_status:      inv.payment_status,
    trip_status:         inv.trip_status,
    client_gstin:        inv.client_gstin,
    gstin:               inv.gstin,
    client_state:        inv.client_state,
    client_type:         inv.client_type,
    source:              inv.source,
  }, tripsCols, ["lead_id"]);

  const { data, error } = await retry(() =>
    supabase.from("booked_trips").insert(row).select("id").single()
  );
  if (error) throw new Error(`booked_trips insert failed: ${error.message}`);
  return data.id;
}

async function insertItems(tripId, items, itemsCols) {
  if (!items?.length) return 0;

  // Auto-detect foreign key column name from live schema
  const colNames   = colSet(itemsCols);
  const tripIdCol  =
    !colNames                       ? "trip_id"         :
    colNames.has("trip_id")         ? "trip_id"         :
    colNames.has("booked_trip_id")  ? "booked_trip_id"  :
    colNames.has("booking_id")      ? "booking_id"      : "trip_id";

  const rows = items.map(it => buildRow({
    [tripIdCol]:   tripId,
    item_type:     it.item_type,
    description:   it.description,
    hsn_sac:       it.hsn_sac,
    qty:           it.qty,
    rate:          it.rate,
    taxable_value: it.taxable_value,
    cgst_amount:   it.cgst_amount,
    cgst_pct:      it.cgst_pct,
    sgst_amount:   it.sgst_amount,
    sgst_pct:      it.sgst_pct,
    igst_amount:   it.igst_amount,
    igst_pct:      it.igst_pct,
    cost:          it.cost,
    total:         it.total,
    amount:        it.amount,
  }, itemsCols, [tripIdCol]));

  const { error } = await retry(() =>
    supabase.from("booking_items").insert(rows)
  );
  if (error) throw new Error(`booking_items insert failed: ${error.message}`);
  return rows.length;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 6 — ERROR ANALYZER  (100% local — no data leaves your machine)
//  Reads import-log.txt, strips data values, groups by error type + code path.
// ─────────────────────────────────────────────────────────────────────────────

function analyzeErrors(logPath) {
  const target = logPath ?? LOG_FILE;
  if (!existsSync(target)) {
    console.error(`Log file not found: ${target}`);
    console.error(`Run the importer first: node auto-import-invoices.mjs 2>&1 | tee import-log.txt`);
    process.exit(1);
  }

  const lines    = readFileSync(target, "utf8").split("\n");
  const failures = lines.filter(l => l.includes(" ✗ "));
  const total    = lines.filter(l => l.match(/^\s*(✓|=|\+)/)).length;

  if (!failures.length) {
    console.log("✅  No failures found in log — all imports succeeded!");
    return;
  }

  // Classify each error by pattern (never prints the actual value)
  const CATEGORIES = [
    { label: "PDF parse error",              re: /pdftotext|execFileSync|maxBuffer|Cannot read|ENOENT/ },
    { label: "No client name found",         re: /client name|Required field "name"/ },
    { label: "Required field missing",       re: /Required field|could not be mapped/ },
    { label: "Lead insert failed",           re: /Lead insert failed|Lead lookup/ },
    { label: "Trip insert failed",           re: /booked_trips insert/ },
    { label: "Items insert failed",          re: /booking_items insert/ },
    { label: "PDF upload failed",            re: /PDF upload|Signed URL/ },
    { label: "Supabase connection error",    re: /ECONNRESET|fetch|timeout|HTTP 5/ },
    { label: "Schema mapping issue",         re: /schema|column|filterToSchema|buildRow/ },
    { label: "Type coercion / date error",   re: /date|timestamp|uuid|coerce|invalid/ },
  ];

  const counts = {};
  const uncategorized = [];

  for (const line of failures) {
    // Extract only the error portion (after " — ")
    const errPart = line.replace(/.*✗\s+\[[^\]]+\]\s+[^\s—]+\s+—\s+/, "")
                        .replace(/.*✗\s+[^\s—]+\s+—\s+/, "")
                        .trim();
    let matched = false;
    for (const cat of CATEGORIES) {
      if (cat.re.test(errPart)) {
        counts[cat.label] = (counts[cat.label] ?? 0) + 1;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Sanitize: remove anything that looks like a client name or number
      const sanitized = errPart
        .replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, "[NAME]")
        .replace(/\b\d{3,}\b/g, "[NUM]")
        .slice(0, 80);
      uncategorized.push(sanitized);
      counts[`Other: ${sanitized}`] = (counts[`Other: ${sanitized}`] ?? 0) + 1;
    }
  }

  console.log("\n══ Import Error Analysis (no client data shown) ══\n");
  console.log(`Total processed lines: ~${total + failures.length}`);
  console.log(`Failures:             ${failures.length}\n`);

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  for (const [label, count] of sorted) {
    const bar = "█".repeat(Math.ceil(count / failures.length * 20));
    console.log(`  ${count.toString().padStart(4)}  ${bar.padEnd(20)}  ${label}`);
  }

  console.log("\n══ Fix Guidance ══\n");
  for (const [label] of sorted) {
    const fixes = {
      "No client name found":
        "  → parseBillingBlock couldn't find a 'Billing Address' header.\n" +
        "    nameFromText() or nameFromFilename() should have caught it.\n" +
        "    Check: do these PDFs use 'Bill To:', 'To:', or a custom header?",
      "PDF parse error":
        "  → pdftotext failed to read the PDF (corrupted, scanned image, or encrypted).\n" +
        "    Try: pdftotext -layout 'the-file.pdf' - to verify manually.",
      "Required field missing":
        "  → A required DB column has no matching parsed field.\n" +
        "    Add an alias in FIELD_ALIASES or check parsePdf() returns it.",
      "Trip insert failed":
        "  → booked_trips rejected the row. Check Supabase logs for constraint details.",
      "Items insert failed":
        "  → booking_items rejected. The trip row was rolled back automatically.",
      "Schema mapping issue":
        "  → buildRow() couldn't map a field to the live schema.\n" +
        "    Run --dry-run and check which columns it reports.",
      "PDF upload failed":
        "  → Supabase Storage upload error. Check bucket permissions and size limits.",
    };
    const fix = fixes[label];
    if (fix) console.log(`${label}:\n${fix}\n`);
  }

  console.log("══ Rerun after fixing ══");
  console.log("  node auto-import-invoices.mjs 2>&1 | tee import-log.txt");
  console.log("  (Already-imported invoices are skipped automatically)\n");
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 6b — LIVE DB DIAGNOSTICS  (read-only — merged from diagnose-import.mjs)
//  Queries Supabase directly to show what's actually there right now, as
//  opposed to --analyze-errors which reads the local log of a past run.
//  Run this FIRST when a re-import looks like it didn't do anything —
//  it tells you whether the DB is actually empty, partially populated, or
//  has orphaned rows from an interrupted previous run, before you decide
//  whether to --reset or just rerun.
// ─────────────────────────────────────────────────────────────────────────────

async function runDiagnostics(client) {
  async function q(label, query) {
    const { data, error, count } = await query;
    if (error) { console.error(`  ✗ ${label}: ${error.message}`); return null; }
    console.log(`\n── ${label}`);
    if (count !== null && count !== undefined) console.log(`  Count: ${count}`);
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((row, i) => console.log(`  [${i + 1}]`, JSON.stringify(row)));
    } else if (data && !Array.isArray(data)) {
      console.log(" ", JSON.stringify(data));
    }
    return data;
  }

  console.log("═══ Nomads CRM — Import Diagnostic (read-only) ═══\n");

  await q("leads by status", client.from("leads").select("lead_status, source", { count: "exact" }).order("lead_status"));

  await q("Converted leads (first 10)", client.from("leads").select("id, name, destination, source, lead_status").eq("lead_status", "Converted").limit(10));

  const { count: tripCount, error: tripErr } = await client.from("booked_trips").select("*", { count: "exact", head: true });
  console.log(`\n── booked_trips total rows: ${tripErr ? "ERROR: " + tripErr.message : tripCount}`);

  await q("booked_trips sample (5 rows)", client.from("booked_trips").select("*").limit(5));

  const { count: nullLeadCount } = await client.from("booked_trips").select("*", { count: "exact", head: true }).is("lead_id", null);
  console.log(`\n── booked_trips with null lead_id: ${nullLeadCount}`);
  if (nullLeadCount > 0) {
    console.log(`  ⚠  These are orphaned rows from an interrupted previous run — the importer's`);
    console.log(`     own cleanupNullRows() step removes these automatically on the next normal run.`);
  }

  await q("booked_trips linked to Historical Import leads", client.from("booked_trips")
    .select("id, trip_name, destination, invoice_number, total_invoice_value, payment_status, trip_status, lead_id, leads(name, lead_status, source)")
    .eq("leads.source", "Historical Import").limit(10));

  const { count: itemCount, error: itemErr } = await client.from("booking_items").select("*", { count: "exact", head: true });
  console.log(`\n── booking_items total rows: ${itemErr ? "ERROR: " + itemErr.message : itemCount}`);

  await q("booking_items sample (5 rows)", client.from("booking_items").select("*").limit(5));

  const { count: unknownCount } = await client.from("leads").select("*", { count: "exact", head: true }).ilike("name", "Unknown —%");
  console.log(`\n── Leads with placeholder "Unknown —" names: ${unknownCount}`);
  if (unknownCount > 0) {
    console.log(`  ⚠  Name extraction failed for these invoices (no billing block, "To:"/"Bill To:"`);
    console.log(`     pattern, or usable filename found) — they need a manual name fix in NocoDB.`);
  }

  const { data: sampleTrip } = await client.from("booked_trips").select("*").limit(1).single();
  if (sampleTrip) {
    const nullCols = Object.entries(sampleTrip).filter(([, v]) => v === null).map(([k]) => k);
    const filledCols = Object.entries(sampleTrip).filter(([, v]) => v !== null).map(([k]) => k);
    console.log(`\n── booked_trips columns populated: ${filledCols.join(", ")}`);
    console.log(`── booked_trips columns null:      ${nullCols.join(", ")}`);
  }

  console.log("\n═══ Done ═══");
  console.log("\nNext step based on what you saw above:");
  console.log("  • booked_trips total rows is 0 and no errors shown  → the import likely never");
  console.log("    actually ran to completion. Just run the importer normally.");
  console.log("  • Non-zero null-lead_id rows                        → run the importer normally,");
  console.log("    it cleans these up automatically before importing.");
  console.log("  • Numbers look roughly right already                → check .import-state.json,");
  console.log("    the batch may have completed and there's nothing left to do.");
}



// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 7 — MAIN
// ─────────────────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(msg);
}

function die(msg) {
  console.error(`\n❌  ${msg}`);
  process.exit(1);
}

async function main() {
  // ── 1. Collect PDFs ──────────────────────────────────────────────────────
  log("── Scanning invoice folder ──────────────────────────────────");
  const pdfs = collectPdfs(ROOT_DIR);
  if (!pdfs.length) die(`No PDFs found under ${ROOT_DIR}`);

  const byFolder = {};
  for (const p of pdfs) {
    const folder = p.replace(ROOT_DIR + "/", "").split("/").slice(0, -1).join("/") || "(root)";
    byFolder[folder] = (byFolder[folder] ?? 0) + 1;
  }
  for (const [f, c] of Object.entries(byFolder)) log(`  ${f}: ${c} PDF(s)`);
  log(`  Total: ${pdfs.length} files\n`);

  // ── 2. Load progress state ───────────────────────────────────────────────
  const state   = loadState();
  const alreadyDone = new Set(Object.keys(state.imported));
  const toDo    = pdfs.filter(p => !alreadyDone.has(p));
  if (alreadyDone.size) {
    log(`  ↩  Skipping ${alreadyDone.size} already-imported file(s) (from .import-state.json)\n`);
  }
  if (!toDo.length) {
    log("✅  All PDFs already imported. Use --reset to reimport everything.");
    return;
  }

  // ── 3. Fetch live schema ─────────────────────────────────────────────────
  log("── Fetching live Supabase schema ────────────────────────────");
  const schemas = await fetchLiveSchema(["leads", "booked_trips", "booking_items"]);
  log("");

  const leadsCols = schemas.get("leads");
  const tripsCols = schemas.get("booked_trips");
  const itemsCols = schemas.get("booking_items");

  // ── 4. Parse all PDFs locally ────────────────────────────────────────────
  log("── Parsing PDFs (local, no network) ────────────────────────");
  const parsed = [];
  for (const p of toDo) {
    const inv    = parsePdf(p);
    const label  = inv.invoice_number ?? basename(p);
    const folder = p.replace(ROOT_DIR + "/", "").split("/").slice(0, -1).join("/");
    if (inv._error) {
      log(`  ✗ [${folder}] ${label} — PDF parse error: ${inv._error}`);
    } else {
      log(`  ✓ [${folder}] ${label} — ${inv.client_name} — ₹${inv.grand_total ?? "?"}`);
    }
    parsed.push(inv);
  }
  log("");

  // ── 5. Dry run ───────────────────────────────────────────────────────────
  if (DRY_RUN) {
    log("── Dry run preview (schema column mapping) ──────────────────");
    for (const inv of parsed) {
      if (inv._error) { log(`  ✗ ${basename(inv._rawPath)} — parse failed`); continue; }
      try {
        const fakeLeadId = "00000000-0000-0000-0000-000000000001";
        const tripRow = buildRow({
          lead_id: fakeLeadId, trip_name: inv.trip_name,
          destination: inv.destination, invoice_number: inv.invoice_number,
          grand_total: inv.grand_total, amount_paid: inv.amount_paid,
          payment_status: inv.payment_status, trip_status: inv.trip_status,
        }, tripsCols, ["lead_id"]);
        log(`  ✓ ${inv.invoice_number ?? "?"} | ${inv.client_name} | ${inv.destination} | ₹${inv.grand_total}`);
        log(`    trip cols: ${Object.keys(tripRow).join(", ")}`);
      } catch (err) {
        log(`  ✗ ${basename(inv._rawPath)} — schema mapping issue: ${err.message}`);
      }
    }
    log("\n✅  Dry run done — no data written.");
    return;
  }

  // ── 6. Supabase pre-flight ───────────────────────────────────────────────
  log("── Supabase pre-flight ──────────────────────────────────────");
  await ensureBucket();
  log("  ✓ Storage bucket verified");
  await cleanupNullRows();
  log("");

  // ── 7. Import ────────────────────────────────────────────────────────────
  log("── Importing ────────────────────────────────────────────────");
  const results = { imported: 0, skipped: 0, failed: 0 };

  for (const inv of parsed) {
    const rawPath = inv._rawPath;
    const folder  = rawPath.replace(ROOT_DIR + "/", "").split("/").slice(0, -1).join("/");
    const label   = inv.invoice_number ?? basename(rawPath);

    // PDF parse failures
    if (inv._error) {
      log(`  ✗ [${folder}] ${label} — PDF parse error: ${inv._error}`);
      state.failed[rawPath] = { error: "PDF parse error", at: new Date().toISOString() };
      saveState(state);
      results.failed++;
      continue;
    }

    try {
      // Dedup check (in addition to state file, also check DB directly)
      if (await alreadyImported(inv.invoice_number)) {
        log(`  = [${folder}] ${label} — already in DB, skipping`);
        state.imported[rawPath] = { at: new Date().toISOString(), skipped: true };
        saveState(state);
        results.skipped++;
        continue;
      }

      // Lead
      const { id: leadId, created: leadCreated } = await findOrCreateLead(inv, leadsCols);
      log(`  ${leadCreated ? "+" : "→"} Lead: ${inv.client_name}${leadCreated ? " (new)" : " (existing)"}`);

      // PDF upload
      let pdfUrl = null;
      try {
        pdfUrl = await uploadPdf(rawPath, inv.invoice_number);
        log(`  ↑ PDF uploaded`);
      } catch (upErr) {
        log(`  ⚠  PDF upload failed (continuing without URL): ${upErr.message}`);
      }

      // Trip insert
      const tripId = await insertTrip(leadId, inv, pdfUrl, tripsCols);
      log(`  + booked_trips: ${label}`);

      // Items insert — rollback trip on failure
      let itemCount = 0;
      if (itemsCols !== undefined) {
        try {
          itemCount = await insertItems(tripId, inv._items, itemsCols);
          if (itemCount) log(`  + booking_items: ${itemCount} line item(s)`);
        } catch (itemErr) {
          log(`  ⚠  booking_items failed — rolling back trip row: ${itemErr.message}`);
          await supabase.from("booked_trips").delete().eq("id", tripId);
          throw itemErr; // Re-throw so the outer catch records this as failed
        }
      }

      // Mark done
      state.imported[rawPath] = {
        at: new Date().toISOString(), invoiceNo: inv.invoice_number,
        leadId, tripId, itemCount,
      };
      delete state.failed[rawPath];
      saveState(state);
      results.imported++;

    } catch (err) {
      log(`  ✗ [${folder}] ${label} — ${err.message}`);
      state.failed[rawPath] = { error: err.message, at: new Date().toISOString() };
      saveState(state);
      results.failed++;
    }
  }

  // ── 8. Summary ───────────────────────────────────────────────────────────
  log("\n── Summary ──────────────────────────────────────────────────");
  log(`  Imported  : ${results.imported}`);
  log(`  Skipped   : ${results.skipped}  (already in DB)`);
  log(`  Failed    : ${results.failed}`);

  if (results.failed) {
    log("\n  To diagnose failures without exposing client data:");
    log("  node auto-import-invoices.mjs --analyze-errors import-log.txt");
    log("\n  To retry only the failed files:");
    log("  node auto-import-invoices.mjs 2>&1 | tee import-log.txt");
    log("  (Progress is saved — already-imported files are skipped automatically)");
  } else {
    log("\n  ✅  All done.");
  }
}

main().catch(err => {
  console.error(`\n❌  Fatal: ${err.message}`);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
