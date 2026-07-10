import { getSupabaseClient } from "./supabase.server";
import { today, addDays, fillTemplate, WARM_TEMPLATE, COLD_TEMPLATE } from "./lead-pipeline.server";

const DIGEST_FROM_ADDRESS = "crm@thenomadsco.in";
const DIGEST_TO_ADDRESS = "thenomadsco@gmail.com";

export async function sendDailyTaskDigest(env: Env): Promise<void> {
  const supabase = getSupabaseClient(env);
  const today = new Date().toISOString().slice(0, 10);

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("task_type, priority, due_date, lead_id, leads(name, destination, phone, email)")
    .eq("status", "Open")
    .eq("due_date", today);

  if (error) {
    console.error("Failed to fetch tasks for daily digest:", error);
    return;
  }

  const lines = (tasks ?? []).map((t: any) => {
    const lead = t.leads;
    const leadLine = lead ? `${lead.name} — ${lead.destination} (${lead.phone || lead.email})` : `Lead ${t.lead_id}`;
    return `[${t.priority}] ${t.task_type} — ${leadLine}`;
  });

  const text = `Tasks due today (${today}):\n\n${lines.length > 0 ? lines.join("\n") : "No tasks due today."}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: DIGEST_FROM_ADDRESS,
      to: DIGEST_TO_ADDRESS,
      subject: `The Nomads Co — Task Digest for ${today}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error(`Resend digest email failed with status ${res.status}: ${await res.text()}`);
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

  const { data: followUps, error } = await supabase
    .from("follow_ups")
    .select("id, lead_id, follow_up_date, message_template, sequence_stage, leads(name, destination, lead_score, lead_status)")
    .eq("completed", false)
    .lte("follow_up_date", todayDate);

  if (error) {
    console.error("Failed to fetch due follow-ups:", error);
    return;
  }

  const due = (followUps ?? []).filter((f: any) => {
    const status = f.leads?.lead_status;
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
}
