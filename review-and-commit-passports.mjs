#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
//  review-and-commit-passports.mjs — Interactive Approval + Supabase Write  v1.0
// ═══════════════════════════════════════════════════════════════════════════════
//
//  ⚠️  THIS SCRIPT MUST BE RUN DIRECTLY BY A HUMAN, IN A REAL TERMINAL.  ⚠️
//  ───────────────────────────────────────────────────────────────────
//  This is the ONLY script in the pipeline that shows passport data on
//  screen and the ONLY one that writes to Supabase. It is deliberately NOT
//  something Claude Code CLI (or any automated agent) can run — the
//  approval decision requires actually seeing the extracted name, passport
//  number, DOB, and flags to judge whether they're correct, and that
//  content must never pass through an AI agent's context to get there.
//
//  This is enforced in code, not just by instruction: the script checks
//  for a real interactive TTY on both stdin and stdout and refuses to run
//  at all if either is missing — which is what happens when a process
//  (rather than a human at a keyboard) invokes it. If you're reading this
//  because the script just refused to run: that's correct behavior, not a
//  bug. Run it yourself, directly, in Terminal.
//
//  WORKFLOW
//  ─────────
//  1. Claude Code CLI runs client-document-intake.mjs (extraction/matching,
//     counts-only output, safe for the CLI to run and report back on).
//  2. YOU run this script yourself, directly. It walks through each
//     extracted document one at a time, shows you what was found, and asks
//     for your decision right there in the terminal — no separate file to
//     hand-edit.
//  3. At the end, it shows you a final tally and asks for one last
//     confirmation before writing anything to Supabase.
//
//  Nothing is written until that final confirmation. You can quit at any
//  point (Ctrl+C or 'q') and nothing will have been written yet.
//
//  ERROR HANDLING: compiler-style. Every approved row is attempted; one
//  failure doesn't stop the rest. A full local report is written at the end
//  (counts/docIds only — safe for the CLI to read afterward if you want it
//  to summarize the run for you).
//
//  USAGE
//  ─────
//  node review-and-commit-passports.mjs --review "<path>/document-review.json"
//
//  PREREQUISITES
//  ──────────────
//  npm install @supabase/supabase-js dotenv ws
//  .dev.vars must contain SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// ═══════════════════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });

// ── TTY gate — the actual enforcement, not just a warning in a comment ──────
if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error(
    "\n❌  This script requires a real interactive terminal (stdin/stdout must both be a TTY).\n" +
    "    It looks like it's being run by an automated process rather than a human directly.\n" +
    "    This is intentional: this is the one step where passport data is shown on screen,\n" +
    "    and it must never be mediated by an agent. Run this command yourself, directly,\n" +
    "    in Terminal — not through Claude Code CLI or any other automated tool.\n"
  );
  process.exit(1);
}

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

if (!REVIEW_FILE || !existsSync(REVIEW_FILE)) die("--review <path to document-review.json> is required.");
if (!SUPABASE_URL || !SUPABASE_KEY) die("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .dev.vars");

const { createClient } = await import("@supabase/supabase-js");
const ws = (await import("ws")).default;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { transport: ws }, auth: { persistSession: false } });

const rl = createInterface({ input: process.stdin, output: process.stdout });
async function ask(prompt) { return (await rl.question(prompt)).trim(); }

// ─────────────────────────────────────────────────────────────────────────────
//  Live schema check — same as before, abort entirely rather than write
//  against columns that don't actually exist.
// ─────────────────────────────────────────────────────────────────────────────

async function fetchLiveSchema(tableNames) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
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

// ─────────────────────────────────────────────────────────────────────────────
//  Interactive review of one document
// ─────────────────────────────────────────────────────────────────────────────

function printDoc(row, index, total) {
  console.log("\n" + "═".repeat(70));
  console.log(`Document ${index + 1} of ${total}   [${row.docType}]`);
  console.log("═".repeat(70));
  console.log(`  Name:            ${row.name ?? "(not read)"}`);
  if (row.docType === "passport") {
    console.log(`  Passport number: ${row.passportNumber ?? "(not verified)"}`);
    console.log(`  DOB:             ${row.dob ?? "(not verified)"}`);
    console.log(`  Expiry:          ${row.expiry ?? "(not verified)"}`);
    console.log(`  Issue date:      ${row.issueDate ?? "(not found)"}`);
    console.log(`  Nationality:     ${row.nationality ?? "(not read)"}`);
  } else {
    console.log(`  Email:           ${row.email ?? "(none)"}`);
    console.log(`  Booking ref:     ${row.bookingRef ?? "(none)"}`);
  }

  const flags = row.flags ?? [];
  if (flags.length) {
    console.log(`\n  Flags:`);
    for (const f of flags) console.log(`    [${f.type}] ${f.reason}`);
  }

  if (row.match?.candidates?.length) {
    console.log(`\n  Possible matches (${row.match.status}):`);
    row.match.candidates.forEach((c, i) => {
      console.log(`    ${i + 1}. ${c.candidate.full_name}  (score: ${c.score.toFixed(2)}${c.corroboration.length ? ", " + c.corroboration.join(", ") : ""})`);
    });
  } else {
    console.log(`\n  No matching existing record found.`);
  }
}

async function reviewDocument(row, index, total) {
  if (row.docType !== "passport") {
    console.log(`\n(Skipping document ${index + 1}/${total} — not a passport, ticket/voucher documents aren't written by this script.)`);
    return { docId: row.docId, decision: "reject" };
  }
  if (!row.passportNumber || !row.dob) {
    console.log(`\n(Skipping document ${index + 1}/${total} — missing a verified passport number or DOB, can't be written regardless of approval.)`);
    return { docId: row.docId, decision: "reject" };
  }

  printDoc(row, index, total);

  const hasConflict = (row.flags ?? []).some((f) => f.type === "conflict");
  let conflictOverride = false, resolution = null;
  if (hasConflict) {
    console.log(`\n  ⚠  This row has a CONFLICT flag — the existing record disagrees with this document`);
    console.log(`     in a way that isn't explained by a normal renewal. Look at it carefully.`);
  }

  const topMatch = row.match?.candidates?.[0]?.candidate ?? null;
  const canUpdate = topMatch?.source_table === "travelers";
  if (topMatch && !canUpdate) {
    console.log(`\n  Note: this matched a "${topMatch.source_table}" record, not an existing traveler —`);
    console.log(`  that confirms this is a known person, but there's no traveler record to update yet.`);
    console.log(`  "New traveler" is the right choice here even though a match was found.`);
  }
  const options = canUpdate
    ? "[u]pdate matched record / [n]ew traveler / [s]kip"
    : "[n]ew traveler / [s]kip";

  const choice = (await ask(`\n  Decision? ${options}: `)).toLowerCase();

  if (choice === "s" || choice === "") {
    return { docId: row.docId, decision: "reject" };
  }
  if (choice === "u" && canUpdate) {
    if (hasConflict) {
      const confirm = await ask(`  You're updating a record despite a conflict flag. Type a short reason to confirm (or leave blank to skip this document): `);
      if (!confirm.trim()) return { docId: row.docId, decision: "reject" };
      conflictOverride = true;
      resolution = confirm.trim();
    }
    return { docId: row.docId, decision: "approve-update", target_id: topMatch.id, conflict_override: conflictOverride, resolution };
  }
  if (choice === "n") {
    return { docId: row.docId, decision: "approve-new" };
  }
  console.log(`  Not understood — treating as skip.`);
  return { docId: row.docId, decision: "reject" };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const review = JSON.parse(readFileSync(REVIEW_FILE, "utf8"));
  const results = review.results ?? [];

  console.log(`\nLoaded ${results.length} document(s) from the review file.`);
  console.log(`You'll be asked to decide on each one. Nothing is written to Supabase until you`);
  console.log(`confirm a final summary at the end. Ctrl+C at any point to quit — nothing written yet.\n`);

  const decisions = [];
  for (let i = 0; i < results.length; i++) {
    const decision = await reviewDocument(results[i], i, results.length);
    decisions.push({ ...results[i], ...decision });
  }

  const toWrite = decisions.filter((d) => d.decision === "approve-update" || d.decision === "approve-new");

  console.log("\n" + "═".repeat(70));
  console.log("FINAL TALLY");
  console.log("═".repeat(70));
  console.log(`  Update existing : ${toWrite.filter((d) => d.decision === "approve-update").length}`);
  console.log(`  New traveler    : ${toWrite.filter((d) => d.decision === "approve-new").length}`);
  console.log(`  Skipped/rejected: ${decisions.length - toWrite.length}`);

  if (!toWrite.length) {
    console.log(`\nNothing approved — nothing to write. Exiting.`);
    rl.close();
    return;
  }

  const confirm = await ask(`\nWrite these ${toWrite.length} record(s) to Supabase now? Type "yes" to proceed: `);
  if (confirm.toLowerCase() !== "yes") {
    console.log(`\nNot confirmed — nothing written. Exiting.`);
    rl.close();
    return;
  }

  console.log(`\n── Checking live schema ────────────────────────────────`);
  const schemas = await fetchLiveSchema(["travelers"]);
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

  console.log(`── Writing ${toWrite.length} record(s) ───────────────────`);
  let succeeded = 0, failed = 0;
  const outcomes = [];

  for (const row of toWrite) {
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
        if (!row.target_id.startsWith("travelers:")) {
          throw new Error(`refusing to update — target "${row.target_id}" is not a travelers record (this should have been caught earlier; treat as a bug if you see this)`);
        }
        const rawId = row.target_id.split(":")[1];
        const { error } = await supabase.from("travelers").update(payload).eq(idCol, rawId);
        if (error) throw error;
      }
      succeeded++;
      outcomes.push({ docId: row.docId, decision: row.decision, status: "written" });
      console.log(`  ✓ ${row.docId} — written`);
    } catch (err) {
      failed++;
      outcomes.push({ docId: row.docId, decision: row.decision, status: "failed", error: err.message });
      console.log(`  ✗ ${row.docId} — failed: ${err.message}`);
    }
  }

  writeFileSync(REPORT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), succeeded, failed, outcomes }, null, 2));

  console.log(`\n── Done ─────────────────────────────────────────────`);
  console.log(`  Written : ${succeeded}`);
  console.log(`  Failed  : ${failed}`);
  console.log(`  Report  : ${REPORT_FILE}`);

  const cleanup = await ask(`\nDelete the review file now that this is committed? (it has cleartext passport data) [y/N]: `);
  if (cleanup.toLowerCase() === "y") {
    unlinkSync(REVIEW_FILE);
    console.log(`  Deleted ${REVIEW_FILE}`);
  }

  rl.close();
}

main().catch((err) => { console.error(`\n❌  Fatal: ${err.message}`); rl.close(); process.exit(1); });
