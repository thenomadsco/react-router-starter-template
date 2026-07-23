#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
//  export-supabase-candidates.mjs — Local Candidates Exporter  v1.0
// ═══════════════════════════════════════════════════════════════════════════════
//
//  Read-only. Queries your Supabase `leads` and `travelers` tables and writes
//  ONE local JSON file in the shape client-document-intake.mjs expects for
//  --candidates. This is the only network call in the whole document-intake
//  pipeline that isn't to your own Supabase project — there isn't one; this
//  script only ever talks to SUPABASE_URL from your .dev.vars.
//
//  INSTRUCTIONS FOR CLAUDE CODE CLI: install deps if missing, run the
//  command, relay only the printed summary (row counts). Do not open the
//  generated candidates file — it contains real client names/emails/phones.
//
//  USAGE
//  ─────
//  node export-supabase-candidates.mjs --out "<path>/candidates.json"
//
//  PREREQUISITES
//  ──────────────
//  npm install @supabase/supabase-js dotenv ws   (same as the invoice importer)
//  .dev.vars must contain SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// ═══════════════════════════════════════════════════════════════════════════════

import { writeFileSync, existsSync } from "node:fs";
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
const OUT_FILE = resolve(argVal("--out", "candidates.json"));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function die(msg) { console.error(`\n❌  ${msg}`); process.exit(1); }
function log(msg) { console.log(msg); }

if (!SUPABASE_URL || !SUPABASE_KEY) die("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .dev.vars");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { transport: ws },
  auth: { persistSession: false },
});

// ── Live schema check — confirms actual column names before querying, so we
//    never guess a column that doesn't exist on your current schema. ────────
async function fetchLiveSchema(tableNames) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) die(`Schema fetch failed: ${res.status} ${res.statusText}`);
  const spec = await res.json();
  const schemas = new Map();
  for (const table of tableNames) {
    const def = spec.definitions?.[table];
    if (!def?.properties) { schemas.set(table, null); continue; }
    schemas.set(table, new Set(Object.keys(def.properties)));
  }
  return schemas;
}

// Prefer the first of these column names that actually exists on the table.
function pickCol(cols, candidates) {
  if (!cols) return null;
  for (const c of candidates) if (cols.has(c)) return c;
  return null;
}

// ── Robust name resolution ───────────────────────────────────────────────
// The earlier version picked ONE name column by guessing from a fixed alias
// list and trusted it blindly — if that guess landed on a sparsely-populated
// column, or the real schema split names across first_name/last_name, every
// row using the "right" data still exported as null. Instead: discover
// EVERY column that looks name-related directly from the live schema (not a
// fixed list), fetch all of them, and resolve per row with a priority chain,
// so a null in one column doesn't sink the whole row if another has data.

const KNOWN_FULL_NAME_COLS = ["name", "full_name", "lead_name", "traveler_name", "client_name", "contact_name", "guest_name", "passenger_name"];
const FIRST_NAME_PATTERNS = [/^first_?name$/i, /^fname$/i, /^given_?name$/i];
const LAST_NAME_PATTERNS = [/^last_?name$/i, /^lname$/i, /^surname$/i, /^family_?name$/i];

function discoverNameColumns(cols) {
  if (!cols) return { fullNameCols: [], firstNameCol: null, lastNameCol: null, otherNameCols: [] };
  const all = [...cols];
  const fullNameCols = KNOWN_FULL_NAME_COLS.filter((c) => cols.has(c));
  const firstNameCol = all.find((c) => FIRST_NAME_PATTERNS.some((p) => p.test(c))) ?? null;
  const lastNameCol = all.find((c) => LAST_NAME_PATTERNS.some((p) => p.test(c))) ?? null;
  // Anything else with "name" in it that we haven't already classified —
  // catches custom/unexpected schema naming without needing to be told about it.
  const classified = new Set([...fullNameCols, firstNameCol, lastNameCol].filter(Boolean));
  const otherNameCols = all.filter((c) => /name/i.test(c) && !classified.has(c));
  return { fullNameCols, firstNameCol, lastNameCol, otherNameCols };
}

function clean(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

// Priority: an explicit full-name column > first+last concatenation > any
// other name-like column as a last resort. Tries every candidate in a tier
// before falling to the next tier, so one null column doesn't lose a row
// that has the name available elsewhere.
function resolveName(row, discovered) {
  for (const col of discovered.fullNameCols) {
    const v = clean(row[col]);
    if (v) return v;
  }
  if (discovered.firstNameCol || discovered.lastNameCol) {
    const first = clean(row[discovered.firstNameCol]) ?? "";
    const last = clean(row[discovered.lastNameCol]) ?? "";
    const combined = `${first} ${last}`.trim();
    if (combined) return combined;
  }
  for (const col of discovered.otherNameCols) {
    const v = clean(row[col]);
    if (v) return v;
  }
  return null;
}

function allNameColumns(discovered) {
  return [...discovered.fullNameCols, discovered.firstNameCol, discovered.lastNameCol, ...discovered.otherNameCols].filter(Boolean);
}

async function main() {
  log("── Checking live Supabase schema ─────────────────────────────────");
  const schemas = await fetchLiveSchema(["leads", "travelers"]);

  const leadsCols = schemas.get("leads");
  const travelersCols = schemas.get("travelers");
  if (!leadsCols && !travelersCols) die("Neither 'leads' nor 'travelers' table found on this schema.");

  const candidates = [];
  let leadsUnresolved = 0, travelersUnresolved = 0;

  if (leadsCols) {
    const nameDiscovery = discoverNameColumns(leadsCols);
    const emailCol = pickCol(leadsCols, ["email"]);
    const phoneCol = pickCol(leadsCols, ["phone", "phone_number"]);
    const idCol = pickCol(leadsCols, ["id"]);
    const nameCols = allNameColumns(nameDiscovery);

    if (!nameCols.length || !idCol) {
      log(`  ⚠  leads: couldn't find any name-like column or an id column — skipping this table`);
    } else {
      const selectCols = [idCol, ...nameCols, emailCol, phoneCol].filter(Boolean);
      let query = supabase.from("leads").select([...new Set(selectCols)].join(","));
      if (leadsCols.has("deleted_at")) query = query.is("deleted_at", null);
      const { data, error } = await query;
      if (error) die(`leads query failed: ${error.message}`);
      for (const row of data) {
        const name = resolveName(row, nameDiscovery);
        if (!name) { leadsUnresolved++; continue; }
        candidates.push({
          id: `lead:${row[idCol]}`,
          full_name: name,
          email: clean(row[emailCol]),
          phone: clean(row[phoneCol]),
          source_table: "leads",
        });
      }
      log(`  ✓ leads: ${data.length - leadsUnresolved} row(s) exported, ${leadsUnresolved} skipped (no name in any of: ${nameCols.join(", ")})`);
    }
  }

  if (travelersCols) {
    const nameDiscovery = discoverNameColumns(travelersCols);
    const emailCol = pickCol(travelersCols, ["email"]);
    const phoneCol = pickCol(travelersCols, ["phone", "phone_number"]);
    const idCol = pickCol(travelersCols, ["id"]);
    const passportCol = pickCol(travelersCols, ["passport_number"]);
    const passportIssueCol = pickCol(travelersCols, ["passport_issue_date", "passport_issued_on"]);
    const dobCol = pickCol(travelersCols, ["dob", "date_of_birth"]);
    const nameCols = allNameColumns(nameDiscovery);

    if (!nameCols.length || !idCol) {
      log(`  ⚠  travelers: couldn't find any name-like column or an id column — skipping this table`);
    } else {
      const selectCols = [idCol, ...nameCols, emailCol, phoneCol, passportCol, passportIssueCol, dobCol].filter(Boolean);
      const { data, error } = await supabase.from("travelers").select([...new Set(selectCols)].join(","));
      if (error) die(`travelers query failed: ${error.message}`);
      for (const row of data) {
        const name = resolveName(row, nameDiscovery);
        if (!name) { travelersUnresolved++; continue; }
        candidates.push({
          id: `traveler:${row[idCol]}`,
          full_name: name,
          email: clean(row[emailCol]),
          phone: clean(row[phoneCol]),
          passport_number: passportCol ? clean(row[passportCol]) : null,
          passport_issue_date: passportIssueCol ? clean(row[passportIssueCol]) : null,
          dob: dobCol ? clean(row[dobCol]) : null,
          source_table: "travelers",
        });
      }
      log(`  ✓ travelers: ${data.length - travelersUnresolved} row(s) exported, ${travelersUnresolved} skipped (no name in any of: ${nameCols.join(", ")})`);
    }
  }

  const totalUnresolved = leadsUnresolved + travelersUnresolved;
  if (totalUnresolved > 0) {
    log(`\n  ⚠  ${totalUnresolved} row(s) had no usable name in ANY discovered name column and were excluded.`);
    log(`     A row with truly no name can't be matched against anyway — but if this count looks high,`);
    log(`     check yourself (not via this script's output) whether the right columns were actually found.`);
  }

  writeFileSync(OUT_FILE, JSON.stringify(candidates, null, 2));
  log(`\n  ✅  Written: ${OUT_FILE}`);
  log(`  Total candidates: ${candidates.length} (counts only — no names printed above)`);
}

main().catch((err) => { console.error(`\n❌  Fatal: ${err.message}`); process.exit(1); });
