// Executes the cleanup confirmed against cleanup-scan.mts's counts:
// - leads: soft-delete (deleted_at = now()), never hard-delete, per the
//   project's standing Supabase-delete-safety rule
// - child tables without a soft-delete column (inquiries, tasks, follow_ups,
//   travelers, visa_applications): hard-delete, since they're purely test rows
// - cron_runs: left untouched (observability log, not business data)
import ws from "ws";
(globalThis as any).WebSocket = ws;
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".dev.vars" });
const env = { SUPABASE_URL: process.env.SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY! };
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function main() {
  const { data: myLeads, error: e1 } = await supabase.from("leads").select("id").ilike("name", "TEST\\_%");
  if (e1) throw e1;
  const { data: otherLeads, error: e2 } = await supabase
    .from("leads")
    .select("id")
    .or("name.ilike.*Urgency Prompt*,name.ilike.*Returning Customer Test*");
  if (e2) throw e2;

  const allLeadIds = [...myLeads!.map((l) => l.id), ...otherLeads!.map((l) => l.id)];
  console.log(`Total tagged leads to clean up: ${allLeadIds.length}`);

  const { data: taggedTravelers } = await supabase.from("travelers").select("id").in("lead_id", allLeadIds);
  const travelerIds = (taggedTravelers ?? []).map((t) => t.id);

  if (travelerIds.length > 0) {
    const { error, count } = await supabase.from("visa_applications").delete({ count: "exact" }).in("traveler_id", travelerIds);
    if (error) throw error;
    console.log(`Deleted visa_applications: ${count}`);
  }

  for (const table of ["inquiries", "tasks", "follow_ups", "travelers"] as const) {
    const { error, count } = await supabase.from(table).delete({ count: "exact" }).in("lead_id", allLeadIds);
    if (error) throw error;
    console.log(`Deleted ${table}: ${count}`);
  }

  const { error: softDelErr, count: softDelCount } = await supabase
    .from("leads")
    .update({ deleted_at: new Date().toISOString() }, { count: "exact" })
    .in("id", allLeadIds);
  if (softDelErr) throw softDelErr;
  console.log(`Soft-deleted leads: ${softDelCount}`);

  // Verify: nothing should still resolve as "active" (deleted_at is null)
  const { data: stillActive } = await supabase.from("leads").select("id").in("id", allLeadIds).is("deleted_at", null);
  console.log(`\nVerification -- tagged leads still active (should be 0): ${stillActive?.length ?? 0}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
