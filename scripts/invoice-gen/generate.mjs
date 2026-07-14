#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { buildInvoiceHtml } from "./template.mjs";
import { getCases } from "./cases.mjs";

const OUT_DIR = new URL("../../test-receipts-synthetic-extended/", import.meta.url).pathname;
mkdirSync(OUT_DIR, { recursive: true });

function notesPreview(notes) {
  if (!notes) return "";
  return notes.length > 50 ? notes.slice(0, 50) + "..." : notes;
}

async function main() {
  const cases = getCases();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const manifestRows = [
    "filename,invoice_no,invoice_date,client_name,client_type,tax_type,total_amount,n_line_items,notes_preview",
  ];

  for (const { id, invoice } of cases) {
    const filename = `ext_${id}_${invoice.invoice_no.replace(/\//g, "-")}.pdf`;
    const html = buildInvoiceHtml(invoice);
    await page.setContent(html, { waitUntil: "load" });
    await page.pdf({ path: OUT_DIR + filename, format: "A4" });

    const client_type = invoice.client.gstin ? "Company" : "Individual";
    const csvNotes = csvField(notesPreview(invoice.notes));
    manifestRows.push(
      [
        filename,
        invoice.invoice_no,
        invoice.invoice_date,
        csvField(invoice.client.name),
        client_type,
        invoice.tax_structure,
        invoice.grand_total.toFixed(2),
        invoice.line_items.length,
        csvNotes,
      ].join(",")
    );
    console.error(`rendered ${filename}`);
  }

  await browser.close();
  writeFileSync(OUT_DIR + "manifest.csv", manifestRows.join("\n") + "\n");
  console.error(`\nWrote ${cases.length} invoices + manifest.csv to ${OUT_DIR}`);
}

function csvField(value) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

main();
