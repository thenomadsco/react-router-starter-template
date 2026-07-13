// import-receipts.mjs
//
// One-time (but safely rerunnable) script to backfill leads + booked_trips
// from historical invoices, uploading the actual PDFs to Supabase Storage.
//
// SETUP BEFORE RUNNING:
// 1. In Supabase dashboard -> Storage -> create a bucket named "invoices", set Private.
//    (Skip if it already exists.)
// 2. Place whichever receipt PDFs you currently have into a `receipts/` folder
//    in the repo root, using the filenames referenced below (or edit the
//    `localPath` values to match whatever you actually named them).
// 3. Add `receipts/` to .gitignore if it isn't already there.
// 4. npm install dotenv --save-dev   (only new dependency needed)
// 5. node import-receipts.mjs
//
// SAFE TO RERUN: missing files are skipped with a warning (not fatal), and
// invoices already present in booked_trips (matched by invoice_number) are
// skipped rather than duplicated. Leads are matched by exact name before
// creating a new one, so re-running after adding more receipts for an
// existing client reuses the same lead instead of creating a duplicate.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import dotenv from "dotenv";
import ws from "ws";

dotenv.config({ path: ".dev.vars" });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .dev.vars");
  process.exit(1);
}

// Node 20 has no native WebSocket, which the supabase-js realtime client
// requires just to construct — this script never uses realtime, but the
// client still needs a WebSocket implementation to initialize.
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  realtime: { transport: ws },
});
const BUCKET = "invoices";

// ---- Known historical receipts. Edit localPath if your filenames differ. ----
const LEADS = [
  { key: "dhanshree", name: "Dhanshree Impex", lead_status: "Converted", source: "Historical Import" },
  { key: "abelasto", name: "A B Elasto Products Pvt. Ltd.", lead_status: "Converted", source: "Historical Import" },
  { key: "alpathakkur", name: "Alpa Thakkur", lead_status: "Converted", source: "Historical Import" },
];

const TRIPS = [
  {
    leadKey: "dhanshree",
    localPath: "./receipts/Dhanshree_Impex_Dubai_Package.pdf",
    trip_name: "Dubai Package",
    destination: "Dubai",
    invoice_number: "TNC/50/19-20",
    total_invoice_value: 16500.0,
    amount_paid: 16500.0,
    payment_status: "Paid",
    booking_date: "2019-08-03",
    trip_status: "Completed",
  },
  {
    leadKey: "abelasto",
    localPath: "./receipts/A_B_1.pdf",
    trip_name: "Flight Booking — Sushim Mukul Bhol (BOM–NBO)",
    destination: "Nairobi",
    invoice_number: "TNC/47/19-20",
    total_invoice_value: 33380.0,
    amount_paid: 33380.0,
    payment_status: "Paid",
    booking_date: "2019-08-02",
    trip_status: "Completed",
  },
  {
    leadKey: "abelasto",
    localPath: "./receipts/A_B_2.pdf",
    trip_name: "Flight Booking — Ujjwal Baran Bhol (BOM–NBO)",
    destination: "Nairobi",
    invoice_number: "TNC/48/19-20",
    total_invoice_value: 33380.0,
    amount_paid: 33380.0,
    payment_status: "Paid",
    booking_date: "2019-08-02",
    trip_status: "Completed",
  },
  {
    leadKey: "abelasto",
    localPath: "./receipts/A_B_3.pdf",
    trip_name: "Flight Booking — Sanjeev Kumar Das (BOM–NBO)",
    destination: "Nairobi",
    invoice_number: "TNC/49/19-20",
    total_invoice_value: 33380.0,
    amount_paid: 33380.0,
    payment_status: "Paid",
    booking_date: "2019-08-02",
    trip_status: "Completed",
  },
  {
    leadKey: "alpathakkur",
    localPath: "./receipts/Alpa_Thakkur_hotel.pdf",
    trip_name: "Jaipur Hotel Booking",
    destination: "Jaipur",
    invoice_number: "TNC/93/19-20",
    total_invoice_value: 14967.0,
    amount_paid: 14967.0,
    payment_status: "Paid",
    booking_date: "2019-09-19",
    trip_status: "Completed",
  },
];
// --------------------------------------------------------------------------

async function ensureBucketExists() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`Failed to list buckets: ${error.message}`);
  if (!buckets.some((b) => b.name === BUCKET)) {
    console.error(
      `Bucket "${BUCKET}" not found. Create it in Supabase dashboard -> Storage (Private) before running this script.`
    );
    process.exit(1);
  }
}

async function getOrCreateLead(lead) {
  const { data: existing, error: findErr } = await supabase
    .from("leads")
    .select("id")
    .eq("name", lead.name)
    .limit(1);
  if (findErr) throw new Error(`Failed to look up lead "${lead.name}": ${findErr.message}`);

  if (existing && existing.length > 0) {
    console.log(`= Lead already exists, reusing: ${lead.name} (${existing[0].id})`);
    return existing[0].id;
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({ name: lead.name, lead_status: lead.lead_status, source: lead.source })
    .select("id")
    .single();
  if (error) throw new Error(`Failed to insert lead "${lead.name}": ${error.message}`);
  console.log(`+ Created lead: ${lead.name} (${data.id})`);
  return data.id;
}

async function tripAlreadyImported(invoiceNumber) {
  const { data, error } = await supabase
    .from("booked_trips")
    .select("id")
    .eq("invoice_number", invoiceNumber)
    .limit(1);
  if (error) throw new Error(`Failed to check existing invoice "${invoiceNumber}": ${error.message}`);
  return data && data.length > 0;
}

async function uploadInvoice(localPath, invoiceNumber) {
  const fileBuffer = fs.readFileSync(localPath);
  const storagePath = `${invoiceNumber.replace(/\//g, "-")}.pdf`;

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, { contentType: "application/pdf", upsert: true });
  if (uploadErr) throw new Error(`Upload failed for ${storagePath}: ${uploadErr.message}`);

  const { data: signed, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365 * 10); // 10-year signed URL
  if (signErr) throw new Error(`Signing failed for ${storagePath}: ${signErr.message}`);

  return signed.signedUrl;
}

async function main() {
  await ensureBucketExists();

  const leadIds = {};
  for (const lead of LEADS) {
    leadIds[lead.key] = await getOrCreateLead(lead);
  }

  const results = { imported: [], skippedMissingFile: [], skippedAlreadyImported: [] };

  for (const trip of TRIPS) {
    if (await tripAlreadyImported(trip.invoice_number)) {
      console.log(`= Skipping ${trip.invoice_number} — already in booked_trips`);
      results.skippedAlreadyImported.push(trip.invoice_number);
      continue;
    }

    if (!fs.existsSync(trip.localPath)) {
      console.warn(`! Skipping ${trip.invoice_number} — file not found at ${trip.localPath}`);
      results.skippedMissingFile.push(trip.invoice_number);
      continue;
    }

    const invoiceUrl = await uploadInvoice(trip.localPath, trip.invoice_number);
    console.log(`+ Uploaded ${trip.invoice_number} <- ${trip.localPath}`);

    const { error } = await supabase.from("booked_trips").insert({
      lead_id: leadIds[trip.leadKey],
      trip_name: trip.trip_name,
      destination: trip.destination,
      invoice_number: trip.invoice_number,
      invoice_file_url: invoiceUrl,
      total_invoice_value: trip.total_invoice_value,
      amount_paid: trip.amount_paid,
      payment_status: trip.payment_status,
      booking_date: trip.booking_date,
      trip_status: trip.trip_status,
    });
    if (error) throw new Error(`Failed to insert booked_trips for ${trip.invoice_number}: ${error.message}`);
    console.log(`+ Inserted booked_trips row for ${trip.invoice_number}`);
    results.imported.push(trip.invoice_number);
  }

  console.log("\n--- Summary ---");
  console.log(`Imported: ${results.imported.length > 0 ? results.imported.join(", ") : "(none)"}`);
  console.log(
    `Skipped (already imported): ${
      results.skippedAlreadyImported.length > 0 ? results.skippedAlreadyImported.join(", ") : "(none)"
    }`
  );
  console.log(
    `Skipped (file not found): ${
      results.skippedMissingFile.length > 0 ? results.skippedMissingFile.join(", ") : "(none)"
    }`
  );
  if (results.skippedMissingFile.length > 0) {
    console.log("\nAdd the missing PDFs to receipts/ and rerun this script to pick them up — already-imported ones will be skipped automatically.");
  }
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
