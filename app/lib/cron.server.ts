import { getSupabaseClient } from "./supabase.server";

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

export async function checkDueFollowUps(env: Env): Promise<void> {
  const supabase = getSupabaseClient(env);
  const today = new Date().toISOString().slice(0, 10);

  const { data: followUps, error } = await supabase
    .from("follow_ups")
    .select("id, lead_id, follow_up_date, message_template, leads(lead_status)")
    .eq("completed", false)
    .lte("follow_up_date", today);

  if (error) {
    console.error("Failed to fetch due follow-ups:", error);
    return;
  }

  const due = (followUps ?? []).filter((f: any) => {
    const status = f.leads?.lead_status;
    return status !== "Converted" && status !== "Lost";
  });

  for (const followUp of due) {
    // TODO: nurture cadence not yet defined (Cold: Day 1/3/7/14, Warm: Day 1/3).
    // Needs product input on what each step should do (send via WhatsApp/Resend?
    // advance follow_up_date to the next cadence day? mark completed?) before
    // this hook can safely act instead of just logging.
    console.log(`Follow-up due for lead ${followUp.lead_id} (follow_ups.id=${followUp.id})`);
  }
}
