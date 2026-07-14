// Builds an HTML replica of The Nomads Co. tax invoice template.
// Structural goal (verified against the real 150-invoice synthetic sample via
// pdftotext): each line-item row must render as 3 distinct text-extraction
// lines -- [tax amount(s)] / [item row] / [tax %] -- because the tax column
// cell stacks amount-then-percent as two lines while every other cell in
// that row is single-line and vertically centered.
export function buildInvoiceHtml(inv) {
  const isIntra = inv.tax_structure === "intra";
  const taxHeaderCells = isIntra
    ? `<th class="num">CGST</th><th class="num">SGST/UTGST</th>`
    : `<th class="num">IGST</th>`;

  const itemRows = inv.line_items
    .map((item) => {
      const taxCell = isIntra
        ? `<td class="num taxcell">
             <div class="tax-line">
               <div>${fmt(item.cgst_amount)}</div>
               <div>(${item.cgst_pct.toFixed(1)}%)</div>
             </div>
           </td>
           <td class="num taxcell">
             <div class="tax-line">
               <div>${fmt(item.sgst_amount)}</div>
               <div>(${item.sgst_pct.toFixed(1)}%)</div>
             </div>
           </td>`
        : `<td class="num taxcell">
             <div class="tax-line">
               <div>${fmt(item.igst_amount)}</div>
               <div>(${item.igst_pct.toFixed(1)}%)</div>
             </div>
           </td>`;
      return `<tr>
        <td>${item.index}</td>
        <td>${escapeHtml(item.description)}</td>
        <td>${item.hsn_sac ?? "-"}</td>
        <td class="num">${item.qty.toFixed(2)}</td>
        <td class="num">${fmt(item.rate)}</td>
        <td class="num">${fmt(item.taxable_value)}</td>
        ${taxCell}
        <td class="num">${fmt(item.total)}</td>
      </tr>`;
    })
    .join("\n");

  const totalCells = isIntra
    ? `<td class="num">${fmt(inv.taxable_total)}</td><td class="num">${fmt(inv.cgst_total)}</td><td class="num">${fmt(inv.sgst_total)}</td><td class="num">${fmt(inv.grand_total)}</td>`
    : `<td class="num">${fmt(inv.taxable_total)}</td><td class="num">${fmt(inv.igst_total)}</td><td class="num">${fmt(inv.grand_total)}</td>`;

  const billingGstinRow = inv.client.gstin ? `<div>GSTIN: ${inv.client.gstin}</div>` : "";
  const billingAddressRow = inv.client.gstin
    ? `<div>${escapeHtml(inv.client.address_line)}</div>`
    : "";

  return `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 18mm 14mm; }
  body { font-family: Helvetica, Arial, sans-serif; font-size: 9.5pt; color: #111; }
  .row { display: flex; justify-content: space-between; }
  .top-labels { display:flex; justify-content: space-between; font-weight: bold; margin-bottom: 10px; }
  .from-meta { display:flex; justify-content: space-between; margin-bottom: 14px; }
  .from-meta .col { width: 48%; }
  .addr-block { display:flex; justify-content: space-between; margin-bottom: 14px; }
  .addr-block .col { width: 48%; }
  .label { font-weight: bold; margin-bottom: 2px; }
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
  table.items th, table.items td { padding: 6px 8px; border-top: 1px solid #ccc; vertical-align: middle; white-space: nowrap; }
  table.items th { border-bottom: 1px solid #333; border-top: none; font-size: 9pt; }
  .num { text-align: right; }
  .tax-line div { line-height: 1.5; }
  tr.total-row td { border-top: 2px solid #333; font-weight: bold; }
  .bank-total { display:flex; justify-content: space-between; margin-top: 14px; }
  .bank-total .col { width: 48%; }
  .words-total { display:flex; justify-content: space-between; margin-top: 10px; }
  .notes { margin-top: 14px; }
  .sign { margin-top: 40px; }
  .page-num { margin-top: 30px; }
</style></head>
<body>
  <div class="top-labels"><div>ORIGINAL FOR RECIPIENT</div><div>TAX INVOICE</div></div>

  <div class="from-meta">
    <div class="col">
      <div class="label">From</div>
      <div>The Nomads Co.</div>
      <div>A/49, Nutan Maheshwar Society, Subhanpura Main Road, Opp</div>
      <div>Vardhman Complex, Vadodara, Gujarat 390023</div>
      <div>GSTIN: 24DFQPS2199E1ZY</div>
      <div>PAN: DFQPS2199E</div>
    </div>
    <div class="col">
      <div>Invoice No.: ${inv.invoice_no}</div>
      <div>Invoice Date: ${inv.invoice_date}</div>
      <div>Reference No: ${inv.reference_no}</div>
      <div>Place of Supply: ${inv.place_of_supply}</div>
      <div>Due Date: ${inv.due_date}</div>
    </div>
  </div>

  <div class="addr-block">
    <div class="col">
      <div class="label">Billing Address</div>
      <div>${escapeHtml(inv.client.name)}</div>
      ${billingAddressRow}
      ${!inv.client.gstin ? `<div>${escapeHtml(inv.client.state)}</div>` : ""}
      ${billingGstinRow}
    </div>
    <div class="col">
      <div class="label">Shipping Address</div>
      <div>${escapeHtml(inv.client.name)}</div>
      ${billingAddressRow}
      ${!inv.client.gstin ? `<div>${escapeHtml(inv.client.state)}</div>` : ""}
      ${billingGstinRow}
    </div>
  </div>

  <table class="items">
    <thead><tr>
      <th>#</th><th>Description</th><th>HSN/SAC</th><th class="num">Qty</th>
      <th class="num">Rate/Unit</th><th class="num">Taxable Value</th>
      ${taxHeaderCells}<th class="num">Total</th>
    </tr></thead>
    <tbody>
      ${itemRows}
      <tr class="total-row">
        <td colspan="3">TOTAL (■)</td>
        <td></td>
        <td></td>
        ${totalCells}
      </tr>
    </tbody>
  </table>

  <div class="bank-total">
    <div class="col">
      <div class="label">Bank Details:</div>
      <div>Account Number: 000000000000</div>
      <div>IFSC: TEST0000001</div>
      <div>Bank Name: TEST BANK LIMITED</div>
      <div>Branch Name: TEST BRANCH</div>
    </div>
    <div class="col">
      <div>Taxable Amount: ■${fmt(inv.taxable_total)}</div>
      <div>Total Tax: ■${fmt(inv.tax_total)}</div>
    </div>
  </div>

  <div class="words-total">
    <div>Total amount (in words): ${escapeHtml(inv.total_words)}</div>
    <div>Total Amount: ■${fmt(inv.grand_total)}</div>
  </div>

  <div class="notes">
    <div class="label">Notes:</div>
    <div>${escapeHtml(inv.notes ?? "")}</div>
  </div>

  <div class="sign">
    <div>The Nomads Co.</div>
    <div style="margin-top:20px;">Authorised Signatory</div>
  </div>

  <div class="page-num">PAGE - 1</div>
</body></html>`;
}

function fmt(n) {
  return Number(n).toFixed(2);
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
