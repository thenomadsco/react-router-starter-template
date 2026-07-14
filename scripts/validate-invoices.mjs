#!/usr/bin/env node
// Runs parse-invoice.mjs against every PDF in test-receipts-synthetic/,
// diffs the result field-by-field against manifest.csv (ground truth),
// and prints an accuracy report.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseInvoicePdf } from "./parse-invoice.mjs";

const DIR = "test-receipts-synthetic";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // skip
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
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

  console.error(`Manifest rows: ${manifest.length}, PDF files: ${pdfFiles.length}`);

  const FIELDS = [
    "invoice_no",
    "invoice_date",
    "client_name",
    "client_type",
    "tax_type",
    "total_amount",
    "n_line_items",
    "notes",
  ];

  const fieldErrors = Object.fromEntries(FIELDS.map((f) => [f, 0]));
  const mismatches = [];
  let exactMatchCount = 0;
  let parseFailures = 0;

  // edge-case tracking
  const edgeCases = {
    leapYearDates: [],
    blankNotes: [],
    emojiNotes: [],
    longNames: [],
    shortNames: [],
    tinyAmounts: [],
    hugeAmounts: [],
    forcedIntra: [],
    forcedInter: [],
  };

  for (const file of pdfFiles) {
    const gt = manifestByFile.get(file);
    if (!gt) {
      mismatches.push({ file, field: "__manifest__", expected: "(row present)", actual: "(missing from manifest)" });
      continue;
    }

    let parsed;
    try {
      parsed = parseInvoicePdf(join(DIR, file));
    } catch (err) {
      parseFailures++;
      mismatches.push({ file, field: "__parse__", expected: "(no exception)", actual: String(err) });
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
      if (field === "total_amount") {
        ok = amountsEqual(actual.total_amount, expected.total_amount);
      } else if (field === "notes") {
        ok = notesMatch(actual.notes, expected.notes);
      } else if (field === "n_line_items") {
        ok = actual.n_line_items === expected.n_line_items;
      } else {
        ok = actual[field] === expected[field];
      }
      if (!ok) {
        allMatch = false;
        fieldErrors[field]++;
        mismatches.push({
          file,
          field,
          expected: field === "notes" ? expected[field] : expected[field],
          actual: field === "notes" ? actual[field] : actual[field],
        });
      }
    }
    if (allMatch) exactMatchCount++;

    // edge case classification (based on ground truth)
    if (/^29\/02\//.test(gt.invoice_date)) edgeCases.leapYearDates.push({ file, allMatch });
    if (gt.notes_preview.trim() === "") edgeCases.blankNotes.push({ file, allMatch });
    if ([...gt.notes_preview].some((c) => c.codePointAt(0) > 127)) edgeCases.emojiNotes.push({ file, allMatch });
    if (gt.client_name.length >= 40) edgeCases.longNames.push({ file, allMatch, len: gt.client_name.length });
    if (gt.client_name.length <= 3) edgeCases.shortNames.push({ file, allMatch, len: gt.client_name.length });
    if (Number(gt.total_amount) <= 200) edgeCases.tinyAmounts.push({ file, allMatch, amt: gt.total_amount });
    if (Number(gt.total_amount) >= 500000) edgeCases.hugeAmounts.push({ file, allMatch, amt: gt.total_amount });
    if (gt.tax_type === "intra") edgeCases.forcedIntra.push({ file, allMatch });
    if (gt.tax_type === "inter") edgeCases.forcedInter.push({ file, allMatch });
  }

  const total = pdfFiles.length;
  const report = {
    total_invoices: total,
    exact_match_count: exactMatchCount,
    exact_match_pct: ((exactMatchCount / total) * 100).toFixed(1) + "%",
    parse_failures: parseFailures,
    field_error_rates: Object.fromEntries(
      FIELDS.map((f) => [f, { errors: fieldErrors[f], rate: ((fieldErrors[f] / total) * 100).toFixed(1) + "%" }])
    ),
    edge_cases: Object.fromEntries(
      Object.entries(edgeCases).map(([name, arr]) => [
        name,
        {
          count: arr.length,
          matched: arr.filter((x) => x.allMatch).length,
          failed_files: arr.filter((x) => !x.allMatch).map((x) => x.file),
        },
      ])
    ),
    mismatches,
  };

  console.log(JSON.stringify(report, null, 2));
}

main();
