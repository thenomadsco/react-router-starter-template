// Defines the extended edge-case test invoices: genuinely new coverage
// beyond the original 150-invoice synthetic suite (which already nailed
// leap-year dates, blank/emoji notes, long/short names, tiny/huge amounts,
// forced intra/inter). Each case is minimal input; buildInvoice() derives
// all totals/tax amounts/words so ground truth can't drift from the PDF.
import { numberToWords } from "./number-to-words.mjs";

const FROM_GSTIN = "24DFQPS2199E1ZY";
const FROM_STATE_CODE = "24";

function taxRateFor(taxStructure) {
  // Matches the real template: 18% total (9+9 intra, 18 inter) on
  // "Service Charges" style items, 0% on the primary package line.
  return taxStructure === "intra" ? { cgst_pct: 9, sgst_pct: 9 } : { igst_pct: 18 };
}

function buildInvoice(spec) {
  const { invoice_no, invoice_date, reference_no = "-", place_of_supply, due_date, client, tax_structure, items, notes = "" } = spec;
  const isIntra = tax_structure === "intra";

  const line_items = items.map((it, i) => {
    const taxable_value = round2(it.qty * it.rate);
    let cgst_amount = 0, sgst_amount = 0, igst_amount = 0;
    let cgst_pct = 0, sgst_pct = 0, igst_pct = 0;
    if (it.taxPct !== undefined) {
      if (isIntra) {
        cgst_pct = it.taxPct / 2;
        sgst_pct = it.taxPct / 2;
        cgst_amount = round2((taxable_value * cgst_pct) / 100);
        sgst_amount = round2((taxable_value * sgst_pct) / 100);
      } else {
        igst_pct = it.taxPct;
        igst_amount = round2((taxable_value * igst_pct) / 100);
      }
    }
    const total = round2(taxable_value + cgst_amount + sgst_amount + igst_amount);
    return {
      index: i + 1,
      description: it.description,
      hsn_sac: it.hsn_sac ?? null,
      qty: it.qty,
      rate: it.rate,
      taxable_value,
      cgst_amount, cgst_pct, sgst_amount, sgst_pct, igst_amount, igst_pct,
      total,
    };
  });

  const taxable_total = round2(line_items.reduce((s, i) => s + i.taxable_value, 0));
  const cgst_total = round2(line_items.reduce((s, i) => s + i.cgst_amount, 0));
  const sgst_total = round2(line_items.reduce((s, i) => s + i.sgst_amount, 0));
  const igst_total = round2(line_items.reduce((s, i) => s + i.igst_amount, 0));
  const tax_total = isIntra ? round2(cgst_total + sgst_total) : igst_total;
  const grand_total = round2(taxable_total + tax_total);

  return {
    invoice_no, invoice_date, reference_no, place_of_supply, due_date,
    tax_structure, client, line_items,
    taxable_total, cgst_total, sgst_total, igst_total, tax_total, grand_total,
    total_words: numberToWords(grand_total),
    notes,
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// invoice numbers continue past the original suite's TNC/41-TNC/190 range
let seq = 500;
function nextInvoiceNo(fy) {
  return { invoice_no: `TNC/${seq++}/${fy}`, };
}

const CASES = [];

function addCase(id, spec) {
  CASES.push({ id, ...spec });
}

// 1. many line items (12) -- stress the 3-line-per-item grouping at scale
addCase("many_items_12", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "05/06/2025", due_date: "05/06/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Aarav Mehta", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: Array.from({ length: 12 }, (_, i) => ({
    description: i === 0 ? "Kerala Backwaters Package" : "Service Charges",
    hsn_sac: i === 0 ? null : "998552",
    qty: 1, rate: i === 0 ? 45000 : 500 + i * 50, taxPct: i === 0 ? 0 : 18,
  })),
  notes: "Multi-service group booking, 12 line items.",
});

// 2. many line items (30) -- deliberately forces a page overflow, beyond
// anything observed in the real 150 (max was 4 items / 1 page)
addCase("many_items_30_pagination_stress", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "12/06/2025", due_date: "12/06/2025",
  place_of_supply: "27-Maharashtra",
  client: { name: "Global Voyage Enterprises", gstin: "27TESTX0000T1ZQ", address_line: "500, Business Park, Maharashtra", state: "Maharashtra" },
  tax_structure: "inter",
  items: Array.from({ length: 30 }, (_, i) => ({
    description: i === 0 ? "Europe Grand Tour Package" : "Service Charges",
    hsn_sac: i === 0 ? null : "998552",
    qty: 1, rate: i === 0 ? 150000 : 1000 + i * 25, taxPct: i === 0 ? 0 : 18,
  })),
  notes: "Deliberately oversized invoice to test multi-page extraction (not observed in real data; forward-looking robustness check).",
});

// 3. decimal / fractional quantity
addCase("decimal_qty", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "18/06/2025", due_date: "18/06/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Diya Patel", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [
    { description: "Airport Transfer (per hr)", hsn_sac: "996601", qty: 2.5, rate: 800, taxPct: 18 },
  ],
  notes: "",
});

// 4. sub-rupee / tiny paise total
addCase("tiny_paise_total", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "20/06/2025", due_date: "20/06/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Zoya Khan", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Convenience Fee Adjustment", hsn_sac: "998552", qty: 1, rate: 0.75, taxPct: 0 }],
  notes: "",
});

// 5. non-round rate producing a rounding edge case (333.33 * 18% = 59.9994)
addCase("rounding_edge_case", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "22/06/2025", due_date: "22/06/2025",
  place_of_supply: "29-Karnataka",
  client: { name: "Kabir Rao", gstin: null, address_line: null, state: "Karnataka" },
  tax_structure: "inter",
  items: [{ description: "Local Guide Fee", hsn_sac: "998552", qty: 1, rate: 333.33, taxPct: 18 }],
  notes: "",
});

// 6-8. non-Latin script client names -- tests whether the parser (and the
// underlying font/ToUnicode chain) handles scripts beyond Latin/accented
addCase("devanagari_name", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "24/06/2025", due_date: "24/06/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "राजेश शर्मा", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Rajasthan Heritage Tour", hsn_sac: null, qty: 1, rate: 22000, taxPct: 0 }],
  notes: "",
});
addCase("chinese_name", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "25/06/2025", due_date: "25/06/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "陈伟", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Goa Beach Package", hsn_sac: null, qty: 1, rate: 18000, taxPct: 0 }],
  notes: "",
});
addCase("cyrillic_name", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "26/06/2025", due_date: "26/06/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Владимир Петров", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Himalayan Trek Package", hsn_sac: null, qty: 1, rate: 27000, taxPct: 0 }],
  notes: "",
});

// 9. apostrophe + ampersand in a corporate client name
addCase("apostrophe_ampersand_company", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "27/06/2025", due_date: "27/06/2025",
  place_of_supply: "07-Delhi",
  client: { name: "O'Brien & Sons Pvt. Ltd.", gstin: "07TESTX0000T1ZQ", address_line: "12, Connaught Place, Delhi", state: "Delhi" },
  tax_structure: "inter",
  items: [{ description: "Corporate Retreat Package", hsn_sac: null, qty: 1, rate: 95000, taxPct: 18 }],
  notes: "Annual offsite booking for 15 employees.",
});

// 10. long company name -- forces the "street, State" address line to wrap
addCase("long_company_address_wrap", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "28/06/2025", due_date: "28/06/2025",
  place_of_supply: "33-Tamil Nadu",
  client: {
    name: "Coromandel International Overseas Trading & Logistics Solutions Pvt. Ltd.",
    gstin: "33TESTX0000T1ZQ",
    address_line: "1250, Anna Salai Business Complex, Phase 2, Near Guindy Industrial Estate, Chennai, Tamil Nadu",
    state: "Tamil Nadu",
  },
  tax_structure: "inter",
  items: [{ description: "Bulk Corporate Booking", hsn_sac: "998552", qty: 1, rate: 210000, taxPct: 18 }],
  notes: "",
});

// 11. long/special reference number
addCase("long_reference_no", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "29/06/2025", due_date: "29/06/2025",
  place_of_supply: "24-Gujarat",
  reference_no: "REF-2025-JUN-CORP-00918-A",
  client: { name: "Ishita Joshi", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Manali Honeymoon Package", hsn_sac: null, qty: 1, rate: 60000, taxPct: 0 }],
  notes: "",
});

// 12. notes with quotes/ampersand/pipe/special punctuation
addCase("special_char_notes", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "30/06/2025", due_date: "30/06/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Rohan Desai", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Andaman Package", hsn_sac: null, qty: 1, rate: 85000, taxPct: 0 }],
  notes: `Client requested "sea-view" room & late check-out | confirmed w/ hotel (ref #4521).`,
});

// 13. very long, multi-sentence notes (well beyond the ~110-char max seen in the original 150)
addCase("very_long_notes", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "01/07/2025", due_date: "01/07/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Neha Trivedi", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Switzerland Group Package", hsn_sac: null, qty: 1, rate: 320000, taxPct: 0 }],
  notes: "This booking covers a group of 8 travelers across two families, including all internal transfers between Zurich, Lucerne, and Interlaken, three guided city tours, one private chalet dinner, travel insurance for all members, and a dedicated on-call coordinator for the full 10-day itinerary as agreed over multiple planning calls with both families' primary contacts.",
});

// 14. a free / zero-value line item alongside paid ones
addCase("zero_value_line_item", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "02/07/2025", due_date: "02/07/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Aditya Bose", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [
    { description: "Sikkim Package", hsn_sac: null, qty: 1, rate: 40000, taxPct: 0 },
    { description: "Complimentary Airport Pickup", hsn_sac: "996601", qty: 1, rate: 0, taxPct: 0 },
  ],
  notes: "",
});

// 15. single-character / minimal HSN code
addCase("minimal_hsn_code", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "03/07/2025", due_date: "03/07/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Kunal Iyer", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Misc Service", hsn_sac: "9", qty: 1, rate: 500, taxPct: 18 }],
  notes: "",
});

// 16-17. leap-year date coverage beyond the original two (2020, 2024)
addCase("leap_year_2028", {
  ...nextInvoiceNo("27-28"),
  invoice_date: "29/02/2028", due_date: "29/02/2028",
  place_of_supply: "24-Gujarat",
  client: { name: "Meera Nair", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Ooty Hill Package", hsn_sac: null, qty: 1, rate: 25000, taxPct: 0 }],
  notes: "",
});
addCase("feb_28_non_leap_boundary", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "28/02/2025", due_date: "28/02/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Tanvi Shah", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Udaipur Package", hsn_sac: null, qty: 1, rate: 30000, taxPct: 0 }],
  notes: "",
});

// 18-19. new inter-state combinations not present in the original 150
addCase("inter_state_kerala", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "04/07/2025", due_date: "04/07/2025",
  place_of_supply: "32-Kerala",
  client: { name: "Sanjay Menon", gstin: null, address_line: null, state: "Kerala" },
  tax_structure: "inter",
  items: [{ description: "Munnar Tea Trail Package", hsn_sac: null, qty: 1, rate: 32000, taxPct: 18 }],
  notes: "",
});
addCase("inter_state_assam", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "05/07/2025", due_date: "05/07/2025",
  place_of_supply: "18-Assam",
  client: { name: "Priyanka Baruah", gstin: null, address_line: null, state: "Assam" },
  tax_structure: "inter",
  items: [{ description: "Kaziranga Wildlife Package", hsn_sac: null, qty: 1, rate: 28000, taxPct: 18 }],
  notes: "",
});

// 20. amount well past the original max (₹7,50,000) -- push to ₹12,50,000
addCase("huge_amount_12_5L", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "06/07/2025", due_date: "06/07/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Vikram Solanki", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Japan Cherry Blossom Package", hsn_sac: null, qty: 1, rate: 1250000, taxPct: 0 }],
  notes: "",
});

// 21. very low tax percentage (0.1%) -- tolerance/precision check
addCase("fractional_tax_pct", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "07/07/2025", due_date: "07/07/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Arnav Ghosh", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Nominal Service Fee", hsn_sac: "998552", qty: 1, rate: 10000, taxPct: 0.1 }],
  notes: "",
});

// 22. corporate client, reference "-" (combination not seen together in original set)
addCase("company_dash_reference", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "08/07/2025", due_date: "08/07/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Baroda Textile Traders", gstin: "24TESTX0000T1ZQ", address_line: "44, Business Park, Gujarat", state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Staff Incentive Trip", hsn_sac: null, qty: 1, rate: 180000, taxPct: 18 }],
  notes: "",
});

// 23. emoji at different positions within notes (start / middle / end) --
// confirms the known font-mapping limitation reproduces regardless of position
addCase("emoji_notes_start_position", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "09/07/2025", due_date: "09/07/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Simran Kaur", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Leh Ladakh Package", hsn_sac: null, qty: 1, rate: 55000, taxPct: 0 }],
  notes: "🏔️ Adventure package confirmed, all permits arranged.",
});

// 24. hyphen + apostrophe + space combo surname, single line (no wrap)
addCase("hyphen_apostrophe_name", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "10/07/2025", due_date: "10/07/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Jean-Pierre O'Sullivan-Fitzgerald", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Paris Honeymoon Package", hsn_sac: null, qty: 1, rate: 275000, taxPct: 0 }],
  notes: "",
});

// 25. corporate + inter-state + multiple items (combined coverage)
addCase("company_multi_item_inter", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "11/07/2025", due_date: "11/07/2025",
  place_of_supply: "36-Telangana",
  client: { name: "Deccan Overseas Exports", gstin: "36TESTX0000T1ZQ", address_line: "77, Business Park, Telangana", state: "Telangana" },
  tax_structure: "inter",
  items: [
    { description: "Hyderabad Corporate Package", hsn_sac: null, qty: 1, rate: 60000, taxPct: 0 },
    { description: "Service Charges", hsn_sac: "998552", qty: 1, rate: 5000, taxPct: 18 },
    { description: "Service Charges", hsn_sac: "998552", qty: 1, rate: 3000, taxPct: 18 },
  ],
  notes: "Corporate booking for regional sales team.",
});

// 26. integer quantity greater than 1 (original set never varied qty from 1.00)
addCase("qty_greater_than_one", {
  ...nextInvoiceNo("25-26"),
  invoice_date: "12/07/2025", due_date: "12/07/2025",
  place_of_supply: "24-Gujarat",
  client: { name: "Farhan Sheikh", gstin: null, address_line: null, state: "Gujarat" },
  tax_structure: "intra",
  items: [{ description: "Airport Transfer", hsn_sac: "996601", qty: 4, rate: 1200, taxPct: 18 }],
  notes: "4 separate airport transfers for the group.",
});

export function getCases() {
  return CASES.map((c) => ({ id: c.id, invoice: buildInvoice(c) }));
}
