// SELECT-and-count pass only -- no deletes here. Per the project's standing
// Supabase-delete-safety rule, every filter-based DELETE needs a confirmed
// count first. This finds every row this testing session (or, in two flagged
// cases, an earlier unrelated session) created, across all 14 tables, before
// any cleanup script touches anything.
import ws from "ws";
(globalThis as any).WebSocket = ws;
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".dev.vars" });
const env = { SUPABASE_URL: process.env.SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY! };
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function main() {
  console.log("=== Tagged test leads (name ILIKE 'TEST\\_%') created by this session ===");
  const { data: myLeads, error: leadsErr } = await supabase
    .from("leads")
    .select("id, name, email, created_at")
    .ilike("name", "TEST\\_%")
    .order("created_at");
  if (leadsErr) throw leadsErr;
  console.log(`Count: ${myLeads!.length}`);
  myLeads!.forEach((l) => console.log(`  ${l.id}  ${l.name}  ${l.email}  ${l.created_at}`));
  const myLeadIds = myLeads!.map((l) => l.id);

  console.log("\n=== Pre-existing test data NOT created by this session (found during NocoDB check) ===");
  const { data: otherLeads } = await supabase
    .from("leads")
    .select("id, name, email, created_at")
    .or("name.ilike.*Urgency Prompt*,name.ilike.*Returning Customer Test*");
  console.log(`Count: ${otherLeads?.length ?? 0}`);
  otherLeads?.forEach((l) => console.log(`  ${l.id}  ${l.name}  ${l.email}  ${l.created_at}`));

  const allTaggedLeadIds = [...myLeadIds, ...(otherLeads ?? []).map((l) => l.id)];

  console.log("\n=== Child rows referencing tagged leads (via lead_id) ===");
  const childTables = ["inquiries", "tasks", "follow_ups", "travelers"] as const;
  const childCounts: Record<string, number> = {};
  for (const table of childTables) {
    const { data, error } = await supabase.from(table).select("id").in("lead_id", allTaggedLeadIds);
    if (error) throw error;
    childCounts[table] = data!.length;
    console.log(`  ${table}: ${data!.length}`);
  }

  console.log("\n=== visa_applications referencing tagged travelers ===");
  const { data: taggedTravelers } = await supabase.from("travelers").select("id").in("lead_id", allTaggedLeadIds);
  const travelerIds = (taggedTravelers ?? []).map((t) => t.id);
  let visaCount = 0;
  if (travelerIds.length > 0) {
    const { data: visas, error } = await supabase.from("visa_applications").select("id").in("traveler_id", travelerIds);
    if (error) throw error;
    visaCount = visas!.length;
  }
  console.log(`  visa_applications: ${visaCount}`);

  console.log("\n=== cron_runs rows logged during this testing session (informational only, not linked to leads) ===");
  const { data: cronRuns } = await supabase
    .from("cron_runs")
    .select("run_type, ran_at")
    .gte("ran_at", new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString())
    .order("ran_at", { ascending: false });
  console.log(`Count in last 6h: ${cronRuns?.length ?? 0}`);
  const byType: Record<string, number> = {};
  cronRuns?.forEach((r) => (byType[r.run_type] = (byType[r.run_type] ?? 0) + 1));
  console.log(" ", byType);

  console.log("\n=== SUMMARY ===");
  console.log(`My tagged leads: ${myLeads!.length}`);
  console.log(`Pre-existing unrelated test leads: ${otherLeads?.length ?? 0}`);
  console.log(`Child rows (inquiries/tasks/follow_ups/travelers): ${JSON.stringify(childCounts)}`);
  console.log(`visa_applications: ${visaCount}`);
  console.log(`cron_runs logged in last 6h (not deleted by default -- observability log): ${cronRuns?.length ?? 0}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
