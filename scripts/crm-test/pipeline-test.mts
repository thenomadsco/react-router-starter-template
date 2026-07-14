// Exercises the real processLeadSubmission() pipeline directly against the
// live Supabase DB, bypassing only the Turnstile browser widget (a Cloudflare
// edge concern, not CRM business logic -- and Cloudflare's own bot management
// is *designed* to block headless automation, so fighting it isn't a
// meaningful test). Everything else -- Groq scoring, dedupe, routing,
// task/follow_up creation, consent rules, soft-delete-aware lookups -- runs
// for real. All test data is tagged (name prefix "TEST_", email tag
// "+nomadstest") for later cleanup.
import ws from "ws";
// Node 20 (unlike the Cloudflare Workers runtime this code actually deploys
// to) has no global WebSocket, which @supabase/supabase-js needs at client
// construction time -- including inside processLeadSubmission's own internal
// getSupabaseClient() call, which this script doesn't control. Polyfilling
// here (test-script-only) avoids touching supabase.server.ts, which must
// stay Workers-buildable and can't depend on the Node-only "ws" package.
(globalThis as any).WebSocket = ws;

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { processLeadSubmission } from "../../app/lib/lead-pipeline.server.ts";

config({ path: ".dev.vars" });

const env = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  GROQ_API_KEY: process.env.GROQ_API_KEY!,
} as any;

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Unique per run so re-running this harness never inherits leftover state
// from a previous run (each test's "starting from clean" assumptions must
// actually hold, or failures are the harness's fault, not the pipeline's).
const RUN_ID = Date.now().toString(36);
function testEmail(tag: string): string {
  return `vedantshah197+nomadstest-${tag}-${RUN_ID}@gmail.com`;
}

function payload(overrides: Record<string, string>): Record<string, string> {
  return {
    name: "TEST_ Pipeline QA",
    email: "vedantshah197+nomadstest@gmail.com",
    whatsapp: "",
    destination: "Bali",
    occasion: "Holiday",
    travelers: "Just me",
    vibe: "Mix of both",
    budget: "Not sure yet",
    contact_consent: "true",
    source: "test-harness",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    ...overrides,
  };
}

async function leadByEmail(email: string) {
  const { data, error } = await supabase.from("leads").select("*").ilike("email", email).is("deleted_at", null);
  if (error) throw error;
  return data ?? [];
}

async function tasksForLead(leadId: string) {
  const { data, error } = await supabase.from("tasks").select("*").eq("lead_id", leadId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

async function followUpsForLead(leadId: string) {
  const { data, error } = await supabase.from("follow_ups").select("*").eq("lead_id", leadId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

async function inquiriesForLead(leadId: string) {
  const { data, error } = await supabase.from("inquiries").select("*").eq("lead_id", leadId);
  if (error) throw error;
  return data ?? [];
}

let pass = 0;
let fail = 0;
function check(label: string, cond: boolean, detail?: unknown) {
  if (cond) {
    console.log(`  PASS: ${label}`);
    pass++;
  } else {
    console.log(`  FAIL: ${label}`, detail ?? "");
    fail++;
  }
}

async function testHotLead() {
  console.log("\n=== Test 1: Hot lead (Honeymoon, high budget) -> WhatsApp Outreach ===");
  const email = testEmail("hot");
  await processLeadSubmission(
    payload({ name: "TEST_ Hot Lead", email, occasion: "Honeymoon", budget: "₹3L+", travelers: "The two of us" }),
    env
  );
  const leads = await leadByEmail(email);
  check("exactly one lead created", leads.length === 1, leads.length);
  const lead = leads[0];
  if (!lead) return;
  check("lead_score >= 75", lead.lead_score >= 75, lead.lead_score);
  const tasks = await tasksForLead(lead.id);
  check("task_type = WhatsApp Outreach", tasks[0]?.task_type === "WhatsApp Outreach", tasks[0]?.task_type);
  check("priority = High", tasks[0]?.priority === "High", tasks[0]?.priority);
  const dueToday = new Date().toISOString().slice(0, 10);
  check("due_date = today", tasks[0]?.due_date === dueToday, tasks[0]?.due_date);
  const fups = await followUpsForLead(lead.id);
  check("follow_up sequence_stage = 1", fups[0]?.sequence_stage === 1, fups[0]?.sequence_stage);
  check("follow_up message mentions Kirti", fups[0]?.message_template?.includes("Kirti"), fups[0]?.message_template);
}

async function testColdLead() {
  console.log("\n=== Test 2: Cold lead (Holiday, low budget) -> Nurture Sequence ===");
  const email = testEmail("cold");
  await processLeadSubmission(
    payload({ name: "TEST_ Cold Lead", email, occasion: "Holiday", budget: "Under ₹50k" }),
    env
  );
  const leads = await leadByEmail(email);
  const lead = leads[0];
  check("lead created", !!lead);
  if (!lead) return;
  check("lead_score < 50", lead.lead_score < 50, lead.lead_score);
  const tasks = await tasksForLead(lead.id);
  check("task_type = Nurture Sequence", tasks[0]?.task_type === "Nurture Sequence", tasks[0]?.task_type);
  check("priority = Low", tasks[0]?.priority === "Low", tasks[0]?.priority);
  const in3Days = new Date();
  in3Days.setUTCDate(in3Days.getUTCDate() + 3);
  check("due_date = +3 days", tasks[0]?.due_date === in3Days.toISOString().slice(0, 10), tasks[0]?.due_date);
}

async function testDedupeAndConsentUpgrade() {
  console.log("\n=== Test 3: Dedupe (2nd submission -> inquiry, not new lead) + consent upgrade-only ===");
  const email = testEmail("dedupe");

  await processLeadSubmission(payload({ name: "TEST_ Dedupe A", email, destination: "Goa", contact_consent: "false" }), env);
  let leads = await leadByEmail(email);
  check("first submission creates 1 lead", leads.length === 1, leads.length);
  check("consent false after first (no consent given)", leads[0]?.contact_consent === false, leads[0]?.contact_consent);
  const leadId = leads[0]?.id;

  await processLeadSubmission(payload({ name: "TEST_ Dedupe A", email, destination: "Kashmir", contact_consent: "true" }), env);
  leads = await leadByEmail(email);
  check("second submission does NOT create a new lead", leads.length === 1, leads.length);
  check("same lead id reused", leads[0]?.id === leadId, { before: leadId, after: leads[0]?.id });
  check("consent upgraded true -> stays true", leads[0]?.contact_consent === true, leads[0]?.contact_consent);
  const inquiries = await inquiriesForLead(leadId);
  check("inquiries row created for 2nd submission", inquiries.length === 1, inquiries.length);
  check("trip_category untouched by update (insert-only)", leads[0]?.trip_category === "Holiday", leads[0]?.trip_category);

  await processLeadSubmission(payload({ name: "TEST_ Dedupe A", email, destination: "Dubai", contact_consent: "false" }), env);
  leads = await leadByEmail(email);
  check("consent never downgrades true -> false", leads[0]?.contact_consent === true, leads[0]?.contact_consent);
  const tasksAfter3 = await tasksForLead(leadId);
  check("3 submissions -> 3 tasks total", tasksAfter3.length === 3, tasksAfter3.length);
}

async function testSoftDeleteExcludedFromDedupe() {
  console.log("\n=== Test 4: soft-deleted lead excluded from dedupe (treated as genuinely new) ===");
  const email = testEmail("softdel");
  await processLeadSubmission(payload({ name: "TEST_ SoftDel Original", email }), env);
  let leads = await leadByEmail(email);
  const originalId = leads[0]?.id;
  check("original lead created", !!originalId);

  const { error: delErr } = await supabase.from("leads").update({ deleted_at: new Date().toISOString() }).eq("id", originalId);
  check("soft-delete succeeded", !delErr, delErr);

  await processLeadSubmission(payload({ name: "TEST_ SoftDel Replacement", email }), env);
  const { data: allWithEmail, error } = await supabase.from("leads").select("id, deleted_at").ilike("email", email);
  if (error) throw error;
  check("2 total rows now exist for this email (old soft-deleted + new)", allWithEmail!.length === 2, allWithEmail!.length);
  const newRow = allWithEmail!.find((r) => r.id !== originalId);
  check("new row is NOT soft-deleted", newRow?.deleted_at === null, newRow);
}

async function testGroqFallback() {
  console.log("\n=== Test 5: Groq failure -> insertManualReviewFallback (no crash, no data loss) ===");
  const email = testEmail("fallback");
  const badEnv = { ...env, GROQ_API_KEY: "sk-deliberately-invalid-for-testing" };
  let threw = false;
  try {
    await processLeadSubmission(payload({ name: "TEST_ Groq Fallback", email, occasion: "Anniversary" }), badEnv);
  } catch (e) {
    threw = true;
    console.log("  unexpected throw:", e);
  }
  check("does not throw even though Groq call fails", !threw);
  const leads = await leadByEmail(email);
  check("fallback still inserts a bare lead", leads.length === 1, leads.length);
  check("deterministic fields still captured (name)", leads[0]?.name === "TEST_ Groq Fallback", leads[0]?.name);
  check("deterministic fields still captured (destination raw)", leads[0]?.destination === "Bali", leads[0]?.destination);
  check("lead_score is null (never scored)", leads[0]?.lead_score === null, leads[0]?.lead_score);
  const tasks = await tasksForLead(leads[0]?.id);
  check("fallback creates High-priority Manual Review task", tasks[0]?.task_type === "Manual Review" && tasks[0]?.priority === "High", tasks[0]);
}

async function main() {
  await testHotLead();
  await testColdLead();
  await testDedupeAndConsentUpgrade();
  await testSoftDeleteExcludedFromDedupe();
  await testGroqFallback();

  console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Test harness crashed:", err);
  process.exit(1);
});
