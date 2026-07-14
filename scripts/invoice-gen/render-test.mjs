import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { buildInvoiceHtml } from "./template.mjs";

const inv = {
  invoice_no: "TNC/999/25-26",
  invoice_date: "27/11/2025",
  reference_no: "-",
  place_of_supply: "24-Gujarat",
  due_date: "27/11/2025",
  tax_structure: "intra",
  client: { name: "Test Person", gstin: null, address_line: null, state: "Gujarat" },
  line_items: [
    { index: 1, description: "Thailand Group Package", hsn_sac: null, qty: 1, rate: 16500, taxable_value: 16500, total: 16500, cgst_amount: 0, cgst_pct: 0, sgst_amount: 0, sgst_pct: 0 },
    { index: 2, description: "Service Charges", hsn_sac: "998552", qty: 1, rate: 8500, taxable_value: 8500, total: 10030, cgst_amount: 765, cgst_pct: 9, sgst_amount: 765, sgst_pct: 9 },
    { index: 3, description: "Service Charges", hsn_sac: "998552", qty: 1, rate: 2500, taxable_value: 2500, total: 2950, cgst_amount: 225, cgst_pct: 9, sgst_amount: 225, sgst_pct: 9 },
  ],
  taxable_total: 27500,
  cgst_total: 990,
  sgst_total: 990,
  tax_total: 1980,
  grand_total: 29480,
  total_words: "Twenty Nine Thousand Four Hundred Eighty Rupees Only",
  notes: "Group booking of 3 travelers, includes all internal transfers.",
};

const html = buildInvoiceHtml(inv);
writeFileSync(new URL("./test.html", import.meta.url), html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.pdf({ path: new URL("./test.pdf", import.meta.url).pathname, format: "A4" });
await browser.close();
console.log("done");
