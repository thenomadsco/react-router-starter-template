import { getSupabaseClient } from "./supabase.server";
import { today, addDays, fillTemplate, WARM_TEMPLATE, COLD_TEMPLATE } from "./lead-pipeline.server";

const DIGEST_FROM_ADDRESS = "crm@thenomadsco.in";
const DIGEST_TO_ADDRESS = "thenomadsco@gmail.com";

// cron_runs only has run_type/success/error_message (no separate "details"
// column) — error_message doubles as a general message field, carrying a
// short outcome summary on success too, not just errors on failure.
async function logCronRun(
  supabase: ReturnType<typeof getSupabaseClient>,
  runType: string,
  success: boolean,
  message?: string
): Promise<void> {
  const { error } = await supabase.from("cron_runs").insert({
    run_type: runType,
    success,
    error_message: message ?? null,
  });
  if (error) {
    console.error(`Failed to log cron_runs row for ${runType}:`, error);
  }
}

// Shared by checkVisaExpiry (its own cron_runs-logged slot, mirroring every
// other top-level cron function) and sendDailyTaskDigest (which surfaces the
// same data inline in the existing digest email rather than a separate one).
async function queryExpiringVisas(supabase: ReturnType<typeof getSupabaseClient>, todayDate: string): Promise<any[]> {
  const cutoffDate = addDays(30);

  const { data, error } = await supabase
    .from("visa_applications")
    .select(
      "id, country, visa_type, expiry_date, traveler_id, travelers(name, lead_id, leads(name, destination, deleted_at))"
    )
    .eq("status", "Approved")
    .gte("expiry_date", todayDate)
    .lte("expiry_date", cutoffDate);

  if (error) throw new Error(`Failed to fetch expiring visa applications: ${error.message}`);

  // traveler.lead_id is nullable — a traveler with no lead at all has
  // nothing to suppress. Only exclude when the linked lead genuinely exists
  // and has been soft-deleted (a plain PostgREST embed can't express this
  // "lead present but active OR lead absent" OR-condition via !inner without
  // wrongly dropping lead-less travelers too, so it's filtered here instead).
  return (data ?? []).filter((v: any) => v.travelers?.leads?.deleted_at == null);
}

function formatVisaWarningLine(v: any): string {
  const traveler = v.travelers;
  const travelerName = traveler?.name ?? `Traveler ${v.traveler_id}`;
  const lead = traveler?.leads;
  const leadLine = lead ? ` (${lead.name} — ${lead.destination})` : "";
  return `⚠️ VISA EXPIRING SOON — ${travelerName}${leadLine} — ${v.country} ${v.visa_type} visa expires ${v.expiry_date}`;
}

// Standalone cron slot purely for cron_runs observability, same as every
// other top-level cron function — the actual surfacing of this data happens
// inline inside sendDailyTaskDigest's own email, not here.
export async function checkVisaExpiry(env: Env): Promise<void> {
  const supabase = getSupabaseClient(env);
  try {
    const todayDate = today();
    const visas = await queryExpiringVisas(supabase, todayDate);
    await logCronRun(supabase, "checkVisaExpiry", true, `${visas.length} visa(s) expiring within 30 days`);
  } catch (err: any) {
    console.error("checkVisaExpiry failed:", err);
    await logCronRun(supabase, "checkVisaExpiry", false, err?.message ?? String(err));
  }
}

export async function sendDailyTaskDigest(env: Env): Promise<void> {
  const supabase = getSupabaseClient(env);
  try {
    const todayDate = new Date().toISOString().slice(0, 10);

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("task_type, priority, due_date, notes, lead_id, leads(name, destination, phone, email, deleted_at)")
      .eq("status", "Open")
      .eq("due_date", todayDate);

    if (error) throw new Error(`Failed to fetch tasks for daily digest: ${error.message}`);

    // Soft-deleted leads are inert going forward — their tasks shouldn't
    // keep showing up in the operational digest.
    const activeTasks = (tasks ?? []).filter((t: any) => t.leads?.deleted_at == null);

    const lines = activeTasks.map((t: any) => {
      const lead = t.leads;
      const leadLine = lead ? `${lead.name} — ${lead.destination} (${lead.phone || lead.email})` : `Lead ${t.lead_id}`;
      const isOverdueEscalation = typeof t.notes === "string" && t.notes.startsWith("Overdue —");
      if (isOverdueEscalation) {
        return `⚠️ OVERDUE ESCALATION — ${t.task_type} — ${leadLine}\n    ${t.notes}`;
      }
      return `[${t.priority}] ${t.task_type} — ${leadLine}`;
    });

    // A visa-query failure shouldn't block the whole digest from sending —
    // degrade to an empty visa section rather than losing today's task list.
    let expiringVisas: any[] = [];
    try {
      expiringVisas = await queryExpiringVisas(supabase, todayDate);
    } catch (visaErr) {
      console.error("Failed to fetch expiring visas for digest:", visaErr);
    }
    const visaLines = expiringVisas.map(formatVisaWarningLine);

    const text =
      `Tasks due today (${todayDate}):\n\n${lines.length > 0 ? lines.join("\n") : "No tasks due today."}` +
      (visaLines.length > 0 ? `\n\nVisas expiring within 30 days:\n\n${visaLines.join("\n")}` : "");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: DIGEST_FROM_ADDRESS,
        to: DIGEST_TO_ADDRESS,
        subject: `The Nomads Co — Task Digest for ${todayDate}`,
        text,
      }),
    });

    if (!res.ok) {
      throw new Error(`Resend digest email failed with status ${res.status}: ${await res.text()}`);
    }

    await logCronRun(supabase, "sendDailyTaskDigest", true, `${activeTasks.length} task(s) in digest`);
  } catch (err: any) {
    console.error("sendDailyTaskDigest failed:", err);
    await logCronRun(supabase, "sendDailyTaskDigest", false, err?.message ?? String(err));
  }
}

// Cadence definition: each stage maps to the next stage + how many days from
// today the next follow-up should land, or `null` if the stage is terminal
// (sequence complete, hand off to a human via a Manual Review task).
// Warm's stage 1 -> 3 gap is a fixed 3 days per product spec (not the
// 3-1=2 day-difference the Cold ladder uses) — these are intentionally
// different cadences, not a shared formula.
const WARM_CADENCE: Record<number, { nextStage: number; daysUntilNext: number } | null> = {
  1: { nextStage: 3, daysUntilNext: 3 },
  3: null,
};

const COLD_CADENCE: Record<number, { nextStage: number; daysUntilNext: number } | null> = {
  1: { nextStage: 3, daysUntilNext: 3 - 1 },
  3: { nextStage: 7, daysUntilNext: 7 - 3 },
  7: { nextStage: 14, daysUntilNext: 14 - 7 },
  14: null,
};

export async function checkDueFollowUps(env: Env): Promise<void> {
  const supabase = getSupabaseClient(env);
  const todayDate = today();
  let processedCount = 0;

  try {
    await runCheckDueFollowUps(supabase, todayDate, (n) => (processedCount = n));
    await logCronRun(supabase, "checkDueFollowUps", true, `${processedCount} follow-up(s) processed`);
  } catch (err: any) {
    console.error("checkDueFollowUps failed:", err);
    await logCronRun(supabase, "checkDueFollowUps", false, err?.message ?? String(err));
  }
}

async function runCheckDueFollowUps(
  supabase: ReturnType<typeof getSupabaseClient>,
  todayDate: string,
  reportCount: (n: number) => void
): Promise<void> {
  const { data: followUps, error } = await supabase
    .from("follow_ups")
    .select(
      "id, lead_id, follow_up_date, message_template, sequence_stage, leads(name, destination, lead_score, lead_status, deleted_at)"
    )
    .eq("completed", false)
    .lte("follow_up_date", todayDate);

  if (error) throw new Error(`Failed to fetch due follow-ups: ${error.message}`);

  // Soft-deleted leads are inert going forward — treat that the same as a
  // terminal Converted/Lost status so their cadence stops progressing.
  const due = (followUps ?? []).filter((f: any) => {
    const lead = f.leads;
    if (lead?.deleted_at != null) return false;
    const status = lead?.lead_status;
    return status !== "Converted" && status !== "Lost";
  });

  for (const followUp of due as any[]) {
    const lead = followUp.leads;
    if (!lead) {
      console.error(`Follow-up ${followUp.id} has no linked lead — skipping`);
      continue;
    }

    const score = lead.lead_score ?? 0;

    // Hot leads only ever get the one immediate WhatsApp Outreach task from
    // processLeadSubmission and never enter this cadence — leave their
    // follow_up row completely untouched.
    if (score >= 75) {
      continue;
    }

    const tier: "warm" | "cold" = score >= 50 ? "warm" : "cold";
    const cadence = tier === "warm" ? WARM_CADENCE : COLD_CADENCE;
    const stage = followUp.sequence_stage;

    if (stage == null || !(stage in cadence)) {
      console.error(
        `Follow-up ${followUp.id} (lead ${followUp.lead_id}) has unrecognized sequence_stage ${stage} for tier ${tier} — skipping`
      );
      continue;
    }

    const { error: completeErr } = await supabase
      .from("follow_ups")
      .update({ completed: true })
      .eq("id", followUp.id);
    if (completeErr) {
      console.error(`Failed to mark follow-up ${followUp.id} completed:`, completeErr);
      continue;
    }

    const next = cadence[stage];

    if (next) {
      const template = tier === "warm" ? WARM_TEMPLATE : COLD_TEMPLATE;
      const { error: insertErr } = await supabase.from("follow_ups").insert({
        lead_id: followUp.lead_id,
        follow_up_date: addDays(next.daysUntilNext),
        message_template: fillTemplate(template, lead.name, lead.destination),
        sequence_stage: next.nextStage,
      });
      if (insertErr) {
        console.error(`Failed to insert next-stage follow-up for lead ${followUp.lead_id}:`, insertErr);
      }
    } else {
      const { error: taskErr } = await supabase.from("tasks").insert({
        lead_id: followUp.lead_id,
        task_type: "Manual Review",
        priority: "Medium",
        due_date: todayDate,
        notes: "Nurture sequence complete — decide next steps",
      });
      if (taskErr) {
        console.error(`Failed to insert sequence-complete task for lead ${followUp.lead_id}:`, taskErr);
      }
    }
  }

  reportCount(due.length);
}

// Manual Review safety net: an Open Manual Review task sitting untouched for
// more than 2 days means either the Groq-failure fallback fired and nobody's
// acted on it, or the digest isn't surfacing it correctly. Escalate once per
// original task (tracked via tasks.escalated) rather than re-escalating the
// same task every day.
export async function escalateOverdueManualReviews(env: Env): Promise<void> {
  const supabase = getSupabaseClient(env);
  try {
    const count = await runEscalateOverdueManualReviews(supabase);
    await logCronRun(supabase, "escalateOverdueManualReviews", true, `${count} task(s) escalated`);
  } catch (err: any) {
    console.error("escalateOverdueManualReviews failed:", err);
    await logCronRun(supabase, "escalateOverdueManualReviews", false, err?.message ?? String(err));
  }
}

async function runEscalateOverdueManualReviews(supabase: ReturnType<typeof getSupabaseClient>): Promise<number> {
  const todayDate = today();
  const cutoff = `${addDays(-2)}T00:00:00Z`;

  const { data: overdueTasks, error } = await supabase
    .from("tasks")
    .select("id, lead_id, created_at, leads(deleted_at)")
    .eq("task_type", "Manual Review")
    .eq("status", "Open")
    .eq("escalated", false)
    .lt("created_at", cutoff);

  if (error) throw new Error(`Failed to fetch overdue Manual Review tasks: ${error.message}`);

  let escalatedCount = 0;
  for (const task of (overdueTasks ?? []) as any[]) {
    // Soft-deleted leads are inert going forward — don't keep escalating
    // their stale Manual Review tasks.
    if (task.leads?.deleted_at != null) continue;
    escalatedCount++;

    const originalDate = task.created_at.slice(0, 10);
    const { error: insertErr } = await supabase.from("tasks").insert({
      lead_id: task.lead_id,
      task_type: "Manual Review",
      priority: "High",
      due_date: todayDate,
      notes: `Overdue — original Manual Review task from ${originalDate} still open`,
    });
    if (insertErr) {
      console.error(`Failed to insert overdue-escalation task for lead ${task.lead_id}:`, insertErr);
      continue;
    }

    const { error: updateErr } = await supabase.from("tasks").update({ escalated: true }).eq("id", task.id);
    if (updateErr) {
      console.error(`Failed to mark task ${task.id} as escalated:`, updateErr);
    }
  }

  return escalatedCount;
}

// Free daily backup via Supabase Storage (same private-bucket pattern as the
// Phase 4 "invoices" bucket — the existing service-role client, no new
// credentials): dump all tables in full as timestamped JSON, then prune
// anything older than 30 days so storage stays bounded. Phase B added the 8
// travel-ops tables (travelers through feedback) alongside the original 5.
const BACKUP_TABLES = [
  "leads",
  "inquiries",
  "tasks",
  "follow_ups",
  "booked_trips",
  "travelers",
  "trip_travelers",
  "visa_applications",
  "documents",
  "booking_items",
  "payments",
  "quotes",
  "feedback",
] as const;
const BACKUP_RETENTION_DAYS = 30;
const BACKUP_BUCKET = "database-backups";

export async function backupDatabase(env: Env): Promise<void> {
  const supabase = getSupabaseClient(env);
  try {
    const dateFolder = today();
    const rowCounts: Record<string, number> = {};

    for (const table of BACKUP_TABLES) {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw new Error(`Failed to query ${table} for backup: ${error.message}`);
      const rows = data ?? [];
      rowCounts[table] = rows.length;
      const path = `backups/${dateFolder}/${table}.json`;
      const { error: uploadErr } = await supabase.storage
        .from(BACKUP_BUCKET)
        .upload(path, JSON.stringify(rows, null, 2), { contentType: "application/json", upsert: true });
      if (uploadErr) throw new Error(`Failed to upload backup for ${table}: ${uploadErr.message}`);
    }

    const deletedCount = await cleanupOldBackups(supabase);

    await logCronRun(
      supabase,
      "backupDatabase",
      true,
      `Row counts: ${JSON.stringify(rowCounts)}; pruned ${deletedCount} stale folder(s)`
    );
  } catch (err: any) {
    console.error("backupDatabase failed:", err);
    await logCronRun(supabase, "backupDatabase", false, err?.message ?? String(err));
  }
}

// Supabase Storage objects, not Supabase table rows — the standing
// SELECT-before-DELETE rule is about DB rows specifically, but this still
// lists and filters before deleting rather than deleting blindly.
async function cleanupOldBackups(supabase: ReturnType<typeof getSupabaseClient>): Promise<number> {
  const cutoffDate = addDays(-BACKUP_RETENTION_DAYS);

  const { data: entries, error: listErr } = await supabase.storage.from(BACKUP_BUCKET).list("backups");
  if (listErr) {
    console.error("Failed to list backup folders for cleanup:", listErr);
    return 0;
  }

  let deletedFolders = 0;
  for (const entry of entries ?? []) {
    const folderDate = entry.name;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(folderDate) || folderDate >= cutoffDate) continue;

    const { data: files, error: filesErr } = await supabase.storage.from(BACKUP_BUCKET).list(`backups/${folderDate}`);
    if (filesErr) {
      console.error(`Failed to list files in stale backup folder ${folderDate}:`, filesErr);
      continue;
    }
    const paths = (files ?? []).map((f) => `backups/${folderDate}/${f.name}`);
    if (paths.length > 0) {
      const { error: removeErr } = await supabase.storage.from(BACKUP_BUCKET).remove(paths);
      if (removeErr) {
        console.error(`Failed to remove stale backup folder ${folderDate}:`, removeErr);
        continue;
      }
    }
    deletedFolders++;
  }

  return deletedFolders;
}
