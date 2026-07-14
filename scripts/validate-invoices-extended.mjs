#!/usr/bin/env node
// Same diff-against-manifest approach as validate-invoices.mjs, but against
// the hand-authored edge-case suite in test-receipts-synthetic-extended/,
// plus item-level total/taxable-value cross-checks the original manifest
// (which only records n_line_items, not per-item detail) can't cover.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseInvoicePdf } from "./parse-invoice.mjs";

const DIR = "test-receipts-synthetic-extended";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* skip */ }
    else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift();
  return rows.filter((r) => r.length === header.length).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

function amountsEqual(a, b) {
  if (a == null || b == null) return a === b;
  return Math.abs(a - b) < 0.005;
}

function notesMatch(parsedNotes, previewGroundTruth) {
  const truncated = previewGroundTruth.endsWith("...");
  const preview = truncated ? previewGroundTruth.slice(0, -3) : previewGroundTruth;
  if (preview === "" && (parsedNotes === null || parsedNotes === "")) return true;
  if (parsedNotes === null) return preview === "";
  if (truncated) return parsedNotes.startsWith(preview);
  return parsedNotes === preview;
}

function main() {
  const manifestText = readFileSync(join(DIR, "manifest.csv"), "utf8");
  const manifest = parseCsv(manifestText);
  const manifestByFile = new Map(manifest.map((r) => [r.filename, r]));
  const pdfFiles = readdirSync(DIR).filter((f) => f.endsWith(".pdf")).sort();

  const FIELDS = ["invoice_no", "invoice_date", "client_name", "client_type", "tax_type", "total_amount", "n_line_items", "notes"];
  const fieldErrors = Object.fromEntries(FIELDS.map((f) => [f, 0]));
  const mismatches = [];
  let exactMatchCount = 0;

  for (const file of pdfFiles) {
    const gt = manifestByFile.get(file);
    if (!gt) { mismatches.push({ file, field: "__manifest__", expected: "row present", actual: "missing" }); continue; }

    let parsed;
    try {
      parsed = parseInvoicePdf(join(DIR, file));
    } catch (err) {
      mismatches.push({ file, field: "__parse__", expected: "no exception", actual: String(err) });
      continue;
    }

    const actual = {
      invoice_no: parsed.invoice_no,
      invoice_date: parsed.invoice_date,
      client_name: parsed.client.name,
      client_type: parsed.client.type,
      tax_type: parsed.tax_structure,
      total_amount: parsed.grand_total,
      n_line_items: parsed.line_items.length,
      notes: parsed.notes,
    };
    const expected = {
      invoice_no: gt.invoice_no,
      invoice_date: gt.invoice_date,
      client_name: gt.client_name,
      client_type: gt.client_type,
      tax_type: gt.tax_type,
      total_amount: Number(gt.total_amount),
      n_line_items: Number(gt.n_line_items),
      notes: gt.notes_preview,
    };

    let allMatch = true;
    for (const field of FIELDS) {
      let ok;
      if (field === "total_amount") ok = amountsEqual(actual.total_amount, expected.total_amount);
      else if (field === "notes") ok = notesMatch(actual.notes, expected.notes);
      else if (field === "n_line_items") ok = actual.n_line_items === expected.n_line_items;
      else ok = actual[field] === expected[field];

      if (!ok) {
        allMatch = false;
        fieldErrors[field]++;
        mismatches.push({ file, field, expected: expected[field], actual: actual[field] });
      }
    }

    // item-level cross-check: sum of parsed line-item totals must equal grand_total
    const itemSum = parsed.line_items.reduce((s, i) => s + (i.total ?? 0), 0);
    if (!amountsEqual(itemSum, parsed.grand_total)) {
      allMatch = false;
      mismatches.push({ file, field: "item_sum_consistency", expected: parsed.grand_total, actual: Math.round(itemSum * 100) / 100 });
    }

    if (allMatch) exactMatchCount++;
  }

  const total = pdfFiles.length;
  console.log(JSON.stringify({
    total_invoices: total,
    exact_match_count: exactMatchCount,
    exact_match_pct: ((exactMatchCount / total) * 100).toFixed(1) + "%",
    field_error_rates: Object.fromEntries(FIELDS.map((f) => [f, { errors: fieldErrors[f], rate: ((fieldErrors[f] / total) * 100).toFixed(1) + "%" }])),
    mismatches,
  }, null, 2));
}

main();
