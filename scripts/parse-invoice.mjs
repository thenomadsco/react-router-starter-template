#!/usr/bin/env node
// Parses The Nomads Co. tax invoice PDFs (real text layer, not scanned/OCR)
// into structured JSON. Uses `pdftotext` (poppler-utils) in two modes:
//   -layout  : preserves column alignment -> used for header fields + item table
//   (raw)    : blocks (Billing Address etc.) are cleanly newline-separated,
//              without the column-interleaving that -layout introduces
//              when Billing/Shipping addresses sit side by side
//
// Known limitation: pictographic emoji in the "Notes" field extract as a
// U+25A0 replacement square, not the original emoji. The invoice template's
// embedded font has no ToUnicode mapping for those glyphs, so the codepoint
// isn't recoverable from the text layer at all -- this is a PDF-generation
// ceiling, not something a smarter parser can fix. Accented/non-ASCII text
// (e.g. "François", "José") is unaffected and extracts correctly.
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

function pdftotext(pdfPath, layout) {
  const args = layout ? ["-layout", pdfPath, "-"] : [pdfPath, "-"];
  return execFileSync("pdftotext", args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 32 });
}

function num(str) {
  if (str == null) return null;
  const cleaned = String(str).replace(/,/g, "").trim();
  if (cleaned === "" || cleaned === "-") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function matchLine(text, label) {
  // Grabs the value after a "Label:" up to a run of 2+ spaces or end of line
  // (works on -layout text where the next column starts after a wide gap).
  const re = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*(.*?)(?:\\s{2,}|$)", "m");
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function parseHeader(layoutText) {
  return {
    invoice_no: matchLine(layoutText, "Invoice No.:"),
    invoice_date: matchLine(layoutText, "Invoice Date:"),
    reference_no: matchLine(layoutText, "Reference No:"),
    place_of_supply: matchLine(layoutText, "Place of Supply:"),
    due_date: matchLine(layoutText, "Due Date:"),
    from_gstin: (layoutText.match(/GSTIN:\s*(\S+)/) || [])[1] ?? null,
    from_pan: (layoutText.match(/PAN:\s*(\S+)/) || [])[1] ?? null,
  };
}

function parseBillingBlock(rawText) {
  const lines = rawText.split("\n");
  const startIdx = lines.findIndex((l) => l.trim() === "Billing Address");
  if (startIdx === -1) {
    return { client_name: null, client_gstin: null, client_state: null, client_address_line: null };
  }
  const block = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") break;
    block.push(line.trim());
  }

  let client_gstin = null;
  let client_address_line = null;
  let client_state = null;
  let nameLines = block;

  const lastLine = block[block.length - 1] ?? "";
  const gstinMatch = lastLine.match(/^GSTIN:\s*(\S+)$/);
  if (gstinMatch) {
    // Corporate client: [name...], "street, State", "GSTIN: xxx"
    client_gstin = gstinMatch[1];
    const addressLine = block[block.length - 2] ?? "";
    const parts = addressLine.split(",").map((s) => s.trim());
    client_state = parts.length > 1 ? parts[parts.length - 1] : addressLine || null;
    client_address_line = addressLine || null;
    nameLines = block.slice(0, block.length - 2);
  } else {
    // Individual client: [name...], State
    client_state = lastLine || null;
    nameLines = block.slice(0, block.length - 1);
  }

  // A name that wraps across lines is a single unbroken token cut mid-word by
  // pdftotext -layout column width (no space/hyphen inserted at the break),
  // so multi-line names are joined with no separator, not a space.
  const client_name = nameLines.join("") || null;

  return { client_name, client_gstin, client_state, client_address_line };
}

function parseNotes(layoutText) {
  const m = layoutText.match(/Notes:\s*\n([\s\S]*?)\n\s*\n\s*The Nomads Co\./);
  if (!m) return null;
  const text = m[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "")
    .join(" ");
  return text || null;
}

function parseItemsAndTotals(layoutText) {
  const lines = layoutText.split("\n");
  const headerIdx = lines.findIndex((l) => /Description\s+HSN\/SAC/.test(l));
  const totalIdx = lines.findIndex((l, i) => i > headerIdx && /^\s*TOTAL\s*\(/.test(l));
  if (headerIdx === -1 || totalIdx === -1) {
    return { tax_structure: null, line_items: [], taxable_total: null, tax_total: null, grand_total: null };
  }

  const headerLine = lines[headerIdx];
  const tax_structure = /IGST/.test(headerLine) ? "inter" : /CGST/.test(headerLine) ? "intra" : null;

  const body = lines
    .slice(headerIdx + 1, totalIdx)
    .filter((l) => l.trim() !== "");

  // Each item renders as 3 physical lines: [tax amount(s)], [item row], [tax %].
  const line_items = [];
  for (let i = 0; i + 2 < body.length; i += 3) {
    const taxAmtTokens = body[i].trim().split(/\s{2,}/);
    const itemTokens = body[i + 1].trim().split(/\s{2,}/);
    const taxPctTokens = body[i + 2].trim().split(/\s{2,}/);

    const [idx, description, hsn_sac, qty, rate, taxable_value, total] = itemTokens;

    const item = {
      index: num(idx),
      description: description ?? null,
      hsn_sac: hsn_sac && hsn_sac !== "-" ? hsn_sac : null,
      qty: num(qty),
      rate: num(rate),
      taxable_value: num(taxable_value),
      total: num(total),
    };

    if (tax_structure === "intra") {
      item.cgst_amount = num(taxAmtTokens[0]);
      item.cgst_pct = taxPctTokens[0] ? num(taxPctTokens[0].replace(/[()%]/g, "")) : null;
      item.sgst_amount = num(taxAmtTokens[1]);
      item.sgst_pct = taxPctTokens[1] ? num(taxPctTokens[1].replace(/[()%]/g, "")) : null;
      item.igst_amount = null;
      item.igst_pct = null;
    } else {
      item.cgst_amount = null;
      item.cgst_pct = null;
      item.sgst_amount = null;
      item.sgst_pct = null;
      item.igst_amount = num(taxAmtTokens[0]);
      item.igst_pct = taxPctTokens[0] ? num(taxPctTokens[0].replace(/[()%]/g, "")) : null;
    }

    line_items.push(item);
  }

  const totalTokens = lines[totalIdx].trim().split(/\s{2,}/).slice(1); // drop "TOTAL (■)"
  let taxable_total = null;
  let tax_total = null;
  let grand_total = null;
  if (tax_structure === "intra" && totalTokens.length >= 4) {
    taxable_total = num(totalTokens[0]);
    tax_total = num(totalTokens[1]) + num(totalTokens[2]);
    grand_total = num(totalTokens[3]);
  } else if (tax_structure === "inter" && totalTokens.length >= 3) {
    taxable_total = num(totalTokens[0]);
    tax_total = num(totalTokens[1]);
    grand_total = num(totalTokens[2]);
  } else if (totalTokens.length) {
    grand_total = num(totalTokens[totalTokens.length - 1]);
  }

  return { tax_structure, line_items, taxable_total, tax_total, grand_total };
}

function parseInvoicePdf(pdfPath) {
  const layoutText = pdftotext(pdfPath, true);
  const rawText = pdftotext(pdfPath, false);

  const header = parseHeader(layoutText);
  const billing = parseBillingBlock(rawText);
  const notes = parseNotes(layoutText);
  const { tax_structure, line_items, taxable_total, tax_total, grand_total } = parseItemsAndTotals(layoutText);

  const total_amount_words_match = layoutText.match(/Total amount \(in words\):/);
  const total_amount_declared = (layoutText.match(/Total Amount:\s*\S?\s*([\d,]+\.\d{2})/) || [])[1] ?? null;

  return {
    file: basename(pdfPath),
    invoice_no: header.invoice_no,
    invoice_date: header.invoice_date,
    reference_no: header.reference_no,
    place_of_supply: header.place_of_supply,
    due_date: header.due_date,
    from: {
      name: "The Nomads Co.",
      gstin: header.from_gstin,
      pan: header.from_pan,
    },
    client: {
      name: billing.client_name,
      state: billing.client_state,
      address_line: billing.client_address_line,
      gstin: billing.client_gstin,
      type: billing.client_gstin ? "Company" : "Individual",
    },
    tax_structure,
    line_items,
    taxable_total,
    tax_total,
    grand_total: grand_total ?? num(total_amount_declared),
    grand_total_declared: num(total_amount_declared),
    notes,
    has_total_in_words_line: Boolean(total_amount_words_match),
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node scripts/parse-invoice.mjs <file.pdf|dir> [--out output.json]");
    process.exit(1);
  }
  const target = args[0];
  const outFlagIdx = args.indexOf("--out");
  const outPath = outFlagIdx !== -1 ? args[outFlagIdx + 1] : null;

  let results;
  const isDir = target.endsWith("/") || (!target.endsWith(".pdf") && readdirSync(target, { withFileTypes: true }).length >= 0);

  if (isDir) {
    const files = readdirSync(target).filter((f) => f.endsWith(".pdf")).sort();
    results = files.map((f) => parseInvoicePdf(join(target, f)));
  } else {
    results = parseInvoicePdf(target);
  }

  const json = JSON.stringify(results, null, 2);
  if (outPath) {
    writeFileSync(outPath, json);
    console.error(`Wrote ${Array.isArray(results) ? results.length : 1} record(s) to ${outPath}`);
  } else {
    console.log(json);
  }
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main();
}

export { parseInvoicePdf };
