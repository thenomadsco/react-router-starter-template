#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
//  commit-approved-documents.mjs — Stage 2: Approved Write to Supabase  v1.0
// ═══════════════════════════════════════════════════════════════════════════════
//
//  This is the ONLY script in the document-intake pipeline that writes to
//  Supabase. It writes NOTHING automatically. It only processes rows in the
//  review file that YOU have hand-edited to carry an explicit "decision"
//  field — the approval has to already exist in the file before this script
//  ever runs; there is no prompt, no confirmation dialog, no interactive
//  step, because that interaction would happen over the same terminal
//  Claude Code CLI reads, and this pipeline's whole design is that the CLI
//  never sees passport data. Your approval happens by editing the file
//  yourself, beforehand, in your own editor.
//
//  HOW TO APPROVE A ROW
//  ─────────────────────
//  Open document-review.json (the file client-document-intake.mjs wrote) in
//  a text editor — NOT via Claude Code CLI. For each result you want written,
//  add a "decision" field:
//
//    "decision": "approve-update"   → write extracted fields onto the
//                                      matched existing traveler (uses
//                                      match.candidates[0].candidate.id
//                                      unless you add a "target_id" override)
//    "decision": "approve-new"      → create a brand-new traveler record
//                                      instead of matching an existing one
//    "decision": "reject"           → explicitly skip (same as omitting it)
//
//  If a row has a "conflict" flag, approve-update is refused unless you also
//  add "conflict_override": true AND a "resolution" note explaining why —
//  this is deliberate friction, not a bug.
//
//  Rows with no "decision" field are skipped automatically — nothing is
//  written unless you put it there yourself.
//
//  ERROR HANDLING: compiler-style. Every approved row is attempted; failures
//  don't stop the batch. A full local report is written at the end.
//
//  USAGE
//  ─────
//  node commit-approved-documents.mjs --review "<path>/document-review.json"
//
//  PREREQUISITES
//  ──────────────
//  npm install @supabase/supabase-js dotenv ws
//  .dev.vars must contain SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// ═══════════════════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import ws from "ws";

dotenv.config({ path: ".dev.vars" });

const args = process.argv.slice(2);
function argVal(flag, def) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
}
const REVIEW_FILE = argVal("--review", null);
const REPORT_FILE = resolve(argVal("--report", "commit-report.json"));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function die(msg) { console.error(`\n❌  ${msg}`); process.exit(1); }
function log(msg) { console.log(msg); }

if (!REVIEW_FILE || !existsSync(REVIEW_FILE)) die("--review <path to document-review.json> is required.");
if (!SUPABASE_URL || !SUPABASE_KEY) die("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .dev.vars");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { transport: ws },
  auth: { persistSession: false },
});

// ── Live schema check — abort entirely (no writes at all) if the columns
//    this script needs aren't found, rather than partially writing. ────────
async function fetchLiveSchema(tableNames) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) die(`Schema fetch failed: ${res.status} ${res.statusText}`);
  const spec = await res.json();
  const schemas = new Map();
  for (const table of tableNames) {
    const def = spec.definitions?.[table];
    schemas.set(table, def?.properties ? new Set(Object.keys(def.properties)) : null);
  }
  return schemas;
}

function pickCol(cols, candidates) {
  if (!cols) return null;
  for (const c of candidates) if (cols.has(c)) return c;
  return null;
}

async function main() {
  log("── Loading review file and checking live schema ──────────────────");
  const review = JSON.parse(readFileSync(REVIEW_FILE, "utf8"));
  const results = review.results ?? [];

  const decided = results.filter((r) => r.decision === "approve-update" || r.decision === "approve-new");
  log(`  Total rows in review file : ${results.length}`);
  log(`  Rows with a decision      : ${decided.length}`);
  if (!decided.length) {
    log(`\n  Nothing to do — no row in the review file has an "approve-update" or "approve-new" decision.`);
    log(`  Edit the file yourself first (not via Claude Code CLI), then rerun.`);
    return;
  }

  const schemas = await fetchLiveSchema(["travelers", "documents"]);
  const travelersCols = schemas.get("travelers");
  if (!travelersCols) die("'travelers' table not found on live schema — aborting, nothing written.");

  const nameCol = pickCol(travelersCols, ["name", "full_name", "traveler_name"]);
  const passportCol = pickCol(travelersCols, ["passport_number"]);
  const passportIssueCol = pickCol(travelersCols, ["passport_issue_date", "passport_issued_on"]);
  const passportExpiryCol = pickCol(travelersCols, ["passport_expiry", "passport_expiry_date"]);
  const dobCol = pickCol(travelersCols, ["dob", "date_of_birth"]);
  const nationalityCol = pickCol(travelersCols, ["nationality"]);
  const idCol = pickCol(travelersCols, ["id"]);

  const required = { nameCol, idCol, passportCol, dobCol };
  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) die(`Required travelers columns not found on live schema: ${missing.join(", ")} — aborting, nothing written.`);

  // ── Pass 1: validate every decided row BEFORE writing anything (compiler-style) ──
  const report = { generatedAt: new Date().toISOString(), attempted: [], skipped: [] };

  for (const row of decided) {
    const errs = [];
    const hasConflict = (row.flags ?? []).some((f) => f.type === "conflict");
    if (hasConflict && row.decision === "approve-update" && !(row.conflict_override === true && row.resolution)) {
      errs.push('row has a "conflict" flag — approve-update requires both "conflict_override": true and a "resolution" note');
    }
    if (row.decision === "approve-update" && !row.target_id && !row.match?.candidates?.[0]?.candidate?.id) {
      errs.push("approve-update has no target_id and no matched candidate to update");
    }
    if (row.docType !== "passport") {
      errs.push(`decision set on a non-passport document (docType: ${row.docType}) — this script only writes passport-derived fields`);
    }
    if (!row.passportNumber || !row.dob) {
      errs.push("missing verified passportNumber or dob — cannot write an incomplete identity record");
    }
    if (errs.length) report.skipped.push({ docId: row.docId, reasons: errs });
    else report.attempted.push(row);
  }

  log(`  Rows passing pre-write validation : ${report.attempted.length}`);
  log(`  Rows rejected before any write    : ${report.skipped.length}`);

  // ── Pass 2: perform the writes ──
  let succeeded = 0, failed = 0;
  const outcomes = [];

  for (const row of report.attempted) {
    const targetId = row.target_id ?? row.match.candidates[0].candidate.id;
    const rawId = targetId.includes(":") ? targetId.split(":")[1] : targetId;

    const payload = {};
    if (passportCol) payload[passportCol] = row.passportNumber;
    if (dobCol) payload[dobCol] = row.dob;
    if (passportExpiryCol && row.expiry) payload[passportExpiryCol] = row.expiry;
    if (passportIssueCol && row.issueDate) payload[passportIssueCol] = row.issueDate;
    if (nationalityCol && row.nationality) payload[nationalityCol] = row.nationality;

    try {
      if (row.decision === "approve-new") {
        if (nameCol) payload[nameCol] = row.name;
        const { error } = await supabase.from("travelers").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("travelers").update(payload).eq(idCol, rawId);
        if (error) throw error;
      }
      succeeded++;
      outcomes.push({ docId: row.docId, decision: row.decision, status: "written" });
    } catch (err) {
      failed++;
      outcomes.push({ docId: row.docId, decision: row.decision, status: "failed", error: err.message });
    }
  }

  report.outcomes = outcomes;
  writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  log("\n── Summary (counts only) ─────────────────────────────────────");
  log(`  Written successfully : ${succeeded}`);
  log(`  Failed               : ${failed}`);
  log(`  Rejected pre-write   : ${report.skipped.length}`);
  log(`\n  ✅  Full report: ${REPORT_FILE}`);
  log(`  Nothing else was written. Rows without a decision were left untouched.`);
}

main().catch((err) => { console.error(`\n❌  Fatal: ${err.message}`); process.exit(1); });
