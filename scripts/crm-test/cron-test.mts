// Exercises cron.server.ts functions against tagged test data on the live
// DB. sendDailyTaskDigest sends a real email to Kirti's real inbox
// (hardcoded DIGEST_TO_ADDRESS, not test-configurable) -- rather than
// actually emailing her with synthetic test tasks, this intercepts fetch()
// calls to api.resend.com specifically (letting every other fetch, i.e. the
// real Supabase calls, through untouched) so the real query/filter/format
// logic is exercised without the side effect. Every other function here
// (checkVisaExpiry, checkDueFollowUps, escalateOverdueManualReviews,
// backupDatabase) is invoked for real -- none of them have any non-DB side
// effect, and backupDatabase is a normal idempotent-per-day operation.
import ws from "ws";
(globalThis as any).WebSocket = ws;

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import {
  checkVisaExpiry,
  sendDailyTaskDigest,
  checkDueFollowUps,
  escalateOverdueManualReviews,
  backupDatabase,
} from "../../app/lib/cron.server.ts";
import { today, addDays } from "../../app/lib/lead-pipeline.server.ts";

config({ path: ".dev.vars" });
const env = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  GROQ_API_KEY: process.env.GROQ_API_KEY!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
} as any;

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const RUN_ID = Date.now().toString(36);

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

async function latestCronRun(runType: string) {
  const { data } = await supabase.from("cron_runs").select("*").eq("run_type", runType).order("ran_at", { ascending: false }).limit(1);
  return data?.[0];
}

// Minimal end-to-end test lead + task/follow_up scaffolding, independent of
// the lead pipeline (direct inserts) so each cron test controls its own
// dates precisely instead of depending on today()/addDays() at submission time.
async function makeTestLead(tag: string, overrides: Record<string, unknown> = {}) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: `TEST_ Cron ${tag}`,
      email: `vedantshah197+crontest-${tag}-${RUN_ID}@gmail.com`,
      destination: "Bali",
      source: "test-harness",
      ...overrides,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

async function testCheckVisaExpiry() {
  console.log("\n=== checkVisaExpiry ===");
  const leadId = await makeTestLead("visa");
  const { data: traveler, error: travErr } = await supabase
    .from("travelers")
    .insert({ name: "TEST_ Cron Visa Traveler", lead_id: leadId })
    .select("id")
    .single();
  if (travErr) throw travErr;

  const expiringSoon = addDays(15);
  const { error: visaErr } = await supabase.from("visa_applications").insert({
    traveler_id: traveler.id,
    country: "TestLand",
    visa_type: "Tourist",
    status: "Approved",
    expiry_date: expiringSoon,
  });
  if (visaErr) throw visaErr;

  await checkVisaExpiry(env);
  const run = await latestCronRun("checkVisaExpiry");
  check("cron_runs logs success", run?.success === true, run);
  check("digest count includes >=1 expiring visa", /\d+ visa\(s\)/.test(run?.error_message ?? "") && parseInt(run.error_message) >= 1, run?.error_message);
}

async function testCheckDueFollowUpsWarmAndCold() {
  console.log("\n=== checkDueFollowUps (Warm 1->3->terminal, Cold 1->3->7->14->terminal) ===");

  const warmLeadId = await makeTestLead("warm-cadence", { lead_score: 60, lead_status: "New" });
  const { error: warmFupErr } = await supabase.from("follow_ups").insert({
    lead_id: warmLeadId, follow_up_date: today(), message_template: "test", sequence_stage: 1,
  });
  if (warmFupErr) throw warmFupErr;

  const coldLeadId = await makeTestLead("cold-cadence-terminal", { lead_score: 20, lead_status: "New" });
  const { error: coldFupErr } = await supabase.from("follow_ups").insert({
    lead_id: coldLeadId, follow_up_date: today(), message_template: "test", sequence_stage: 14,
  });
  if (coldFupErr) throw coldFupErr;

  // a Converted lead's follow-up must NOT progress even if due
  const convertedLeadId = await makeTestLead("converted-suppressed", { lead_score: 30, lead_status: "Converted" });
  const { error: convFupErr } = await supabase.from("follow_ups").insert({
    lead_id: convertedLeadId, follow_up_date: today(), message_template: "test", sequence_stage: 1,
  });
  if (convFupErr) throw convFupErr;

  await checkDueFollowUps(env);

  const { data: warmFups } = await supabase.from("follow_ups").select("*").eq("lead_id", warmLeadId).order("sequence_stage");
  check("warm stage1 marked completed", warmFups?.find((f) => f.sequence_stage === 1)?.completed === true, warmFups);
  check("warm stage3 created, due +3 days", warmFups?.some((f) => f.sequence_stage === 3 && f.follow_up_date === addDays(3)), warmFups);

  const { data: coldTasks } = await supabase.from("tasks").select("*").eq("lead_id", coldLeadId);
  check("cold stage14 (terminal) creates Manual Review task", coldTasks?.some((t) => t.task_type === "Manual Review"), coldTasks);

  const { data: convFups } = await supabase.from("follow_ups").select("*").eq("lead_id", convertedLeadId);
  check("Converted lead's due follow-up left untouched (not completed)", convFups?.[0]?.completed === false, convFups);

  const run = await latestCronRun("checkDueFollowUps");
  check("cron_runs logs success", run?.success === true, run);
}

async function testEscalateOverdueManualReviews() {
  console.log("\n=== escalateOverdueManualReviews ===");
  const leadId = await makeTestLead("escalation");
  const staleDate = new Date();
  staleDate.setUTCDate(staleDate.getUTCDate() - 5);

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({ lead_id: leadId, task_type: "Manual Review", priority: "High", due_date: today(), status: "Open", escalated: false })
    .select("id")
    .single();
  if (error) throw error;
  // backdate created_at directly since the insert always stamps "now"
  await supabase.from("tasks").update({ created_at: staleDate.toISOString() }).eq("id", task.id);

  await escalateOverdueManualReviews(env);

  const { data: allTasks } = await supabase.from("tasks").select("*").eq("lead_id", leadId);
  check("original task marked escalated", allTasks?.find((t) => t.id === task.id)?.escalated === true, allTasks);
  check("new High-priority escalation task created", allTasks?.some((t) => t.id !== task.id && t.priority === "High" && t.notes?.includes("Overdue")), allTasks);

  const run = await latestCronRun("escalateOverdueManualReviews");
  check("cron_runs logs success", run?.success === true, run);
}

async function testSendDailyTaskDigestNoRealEmail() {
  console.log("\n=== sendDailyTaskDigest (Resend call intercepted -- no real email to Kirti) ===");
  const leadId = await makeTestLead("digest");
  const { error } = await supabase.from("tasks").insert({
    lead_id: leadId, task_type: "WhatsApp Outreach", priority: "High", due_date: today(), status: "Open",
  });
  if (error) throw error;

  const realFetch = globalThis.fetch;
  let interceptedCall: { url: string; body: any } | null = null;
  (globalThis as any).fetch = async (input: any, init?: any) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.includes("api.resend.com")) {
      interceptedCall = { url, body: JSON.parse(init.body) };
      return new Response(JSON.stringify({ id: "test-intercepted-no-real-send" }), { status: 200 });
    }
    return realFetch(input, init);
  };

  try {
    await sendDailyTaskDigest(env);
  } finally {
    (globalThis as any).fetch = realFetch;
  }

  check("Resend call was intercepted (not skipped)", interceptedCall !== null, interceptedCall);
  check("digest 'to' is Kirti's real address (unchanged code path)", (interceptedCall as any)?.body?.to === "thenomadsco@gmail.com", interceptedCall);
  check("digest body mentions today's test task", (interceptedCall as any)?.body?.text?.includes("TEST_ Cron digest"), (interceptedCall as any)?.body?.text);
  console.log("  (No real email was sent -- Resend call intercepted before dispatch.)");

  const run = await latestCronRun("sendDailyTaskDigest");
  check("cron_runs logs success", run?.success === true, run);
}

async function testBackupDatabase() {
  console.log("\n=== backupDatabase ===");
  await backupDatabase(env);
  const run = await latestCronRun("backupDatabase");
  check("cron_runs logs success", run?.success === true, run);
  check("row counts message includes leads count", /"leads":\d+/.test(run?.error_message ?? ""), run?.error_message);

  const dateFolder = today();
  const { data: files, error } = await supabase.storage.from("database-backups").list(`backups/${dateFolder}`);
  check("backup files uploaded for today's folder", !error && (files?.length ?? 0) >= 13, { error, count: files?.length });
}

async function main() {
  await testCheckVisaExpiry();
  await testCheckDueFollowUpsWarmAndCold();
  await testEscalateOverdueManualReviews();
  await testSendDailyTaskDigestNoRealEmail();
  await testBackupDatabase();

  console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Cron test harness crashed:", err);
  process.exit(1);
});
