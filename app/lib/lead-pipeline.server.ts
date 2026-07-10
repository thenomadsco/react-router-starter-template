import { getSupabaseClient } from "./supabase.server";

const GROQ_SYSTEM_PROMPT = `You are an AI data enricher for a luxury travel CRM. You receive structured lead data from a web funnel. Your job is to format it into a strict JSON object and calculate missing CRM metrics.

RULES:
1. If a text value is missing, output "". If a number is missing, output 0.
2. Convert the 'Travelers' string into an integer (e.g., 'Solo Adventure' = 1, 'Couples Retreat' = 2, 'Family Vacation' = 4, 'Group of Friends' = 5).
3. We do not ask for Budget yet, so output 0.
4. Determine 'contact_method' based on whether phone or email was provided.
5. Generate a 1-sentence 'ai_summary' of their ideal trip.
6. Assign a 'lead_score' (1-100) and 'urgency_level' (Low, Medium, High) based on their timeline (e.g. 'Within 30 Days' is High urgency).
7. Suggest a logical 'next_action'.

Return EXACTLY this JSON structure:
{
  "name": "",
  "email": "",
  "phone": "",
  "destination": "",
  "timeline": "",
  "travelers": 0,
  "vibe": "",
  "budget": 0,
  "contact_method": "",
  "lead_category": "",
  "lead_score": 0,
  "urgency_level": "",
  "ai_summary": "",
  "next_action": ""
}`;

type LeadPayload = Record<string, FormDataEntryValue>;

type ScoredLead = {
  name: string;
  email: string;
  phone: string;
  destination: string;
  timeline: string;
  travelers: number;
  vibe: string;
  budget: number;
  contact_method: string;
  lead_category: string;
  lead_score: number;
  urgency_level: string;
  ai_summary: string;
  next_action: string;
};

function field(payload: LeadPayload, key: string): string {
  return typeof payload[key] === "string" ? (payload[key] as string) : "";
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function fillTemplate(template: string, name: string, destination: string): string {
  return template.replaceAll("{name}", name).replaceAll("{destination}", destination);
}

const HOT_TEMPLATE = `Hi {name}! 👋 Kirti here from The Nomads Co.
I can see you're thinking about a trip to {destination} very soon and I would love to make it absolutely unforgettable for you.
I've put together premium packages that match your travel style perfectly and I can have a personalised itinerary ready within 24 hours.
Are you free for a quick chat today? I'm on WhatsApp right now.
— Kirti Shah | The Nomads Co.
📞 +91 99243 99335 | thenomadsco.in`;

const WARM_TEMPLATE = `Hi {name}! 😊 This is Kirti from The Nomads Co.
I noticed you're planning a trip to {destination} in the coming months.
I have some great ideas that match your travel style perfectly.
Would it help if I sent over a few curated options to get the planning started?
— Kirti Shah | The Nomads Co.
📞 +91 99243 99335 | thenomadsco.in`;

const COLD_TEMPLATE = `Hi {name}! 🌍 Kirti here from The Nomads Co.
Whenever you're ready to start planning your trip to {destination}, I'm here to help make it completely stress-free.
No pressure at all — just reach out when the time feels right. I'll make sure it's worth every rupee. 🌟
— Kirti Shah | The Nomads Co.
📞 +91 99243 99335 | thenomadsco.in`;

async function scoreWithGroq(payload: LeadPayload, env: Env): Promise<ScoredLead> {
  const userMessage = `Name: ${field(payload, "name")}
Email: ${field(payload, "email")}
Phone: ${field(payload, "whatsapp")}
Destination: ${field(payload, "destination")}
Timeline: ${field(payload, "timeline")}
Travelers: ${field(payload, "travelers")}
Vibe: ${field(payload, "vibe")}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: GROQ_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq request failed with status ${res.status}`);
  }

  const json: any = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Groq response missing message content");
  }

  return JSON.parse(content) as ScoredLead;
}

async function insertManualReviewFallback(payload: LeadPayload, env: Env) {
  const supabase = getSupabaseClient(env);

  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .insert({
      name: field(payload, "name"),
      email: field(payload, "email"),
      phone: field(payload, "whatsapp"),
      destination: field(payload, "destination"),
      timeline: field(payload, "timeline"),
      vibe: field(payload, "vibe"),
      // travelers is an integer column but the raw funnel value is a free-text
      // label (e.g. "Just me") that only the Groq enrichment step can convert —
      // left unset here since enrichment failed.
      lead_score: null,
      source: field(payload, "source"),
      utm_source: field(payload, "utm_source"),
      utm_medium: field(payload, "utm_medium"),
      utm_campaign: field(payload, "utm_campaign"),
    })
    .select("id")
    .single();

  if (leadErr) throw new Error(`Failed to insert fallback lead: ${leadErr.message}`);

  const { error: taskErr } = await supabase.from("tasks").insert({
    lead_id: lead.id,
    task_type: "Manual Review",
    priority: "High",
    due_date: today(),
  });

  if (taskErr) throw new Error(`Failed to insert fallback task: ${taskErr.message}`);
}

export async function processLeadSubmission(payload: LeadPayload, env: Env): Promise<void> {
  let scored: ScoredLead;
  try {
    scored = await scoreWithGroq(payload, env);
  } catch (err) {
    console.error("Groq enrichment failed, falling back to manual review:", err);
    await insertManualReviewFallback(payload, env);
    return;
  }

  const supabase = getSupabaseClient(env);
  const normalizedEmail = scored.email.trim().toLowerCase();

  const { data: matches, error: findErr } = await supabase
    .from("leads")
    .select("id")
    .ilike("email", normalizedEmail)
    .limit(1);

  if (findErr) throw new Error(`Failed to look up existing lead: ${findErr.message}`);

  let leadId: string;

  if (matches && matches.length > 0) {
    leadId = matches[0].id;

    const { error: inquiryErr } = await supabase.from("inquiries").insert({
      lead_id: leadId,
      destination: scored.destination,
      timeline: scored.timeline,
      vibe: scored.vibe,
      travelers: scored.travelers,
    });
    if (inquiryErr) throw new Error(`Failed to insert inquiry: ${inquiryErr.message}`);

    const { error: updateErr } = await supabase
      .from("leads")
      .update({
        lead_score: scored.lead_score,
        urgency_level: scored.urgency_level,
        ai_summary: scored.ai_summary,
        next_action: scored.next_action,
        lead_category: scored.lead_category,
      })
      .eq("id", leadId);
    if (updateErr) throw new Error(`Failed to update lead: ${updateErr.message}`);
  } else {
    const { data: inserted, error: insertErr } = await supabase
      .from("leads")
      .insert({
        name: scored.name,
        email: scored.email,
        phone: scored.phone,
        destination: scored.destination,
        timeline: scored.timeline,
        travelers: scored.travelers,
        vibe: scored.vibe,
        budget: scored.budget,
        contact_method: scored.contact_method,
        lead_category: scored.lead_category,
        lead_score: scored.lead_score,
        urgency_level: scored.urgency_level,
        ai_summary: scored.ai_summary,
        next_action: scored.next_action,
        source: field(payload, "source"),
        utm_source: field(payload, "utm_source"),
        utm_medium: field(payload, "utm_medium"),
        utm_campaign: field(payload, "utm_campaign"),
      })
      .select("id")
      .single();
    if (insertErr) throw new Error(`Failed to insert lead: ${insertErr.message}`);
    leadId = inserted.id;
  }

  let taskType: string;
  let priority: string;
  let dueDate: string;
  let template: string;

  if (scored.lead_score >= 75) {
    taskType = "WhatsApp Outreach";
    priority = "High";
    dueDate = today();
    template = HOT_TEMPLATE;
  } else if (scored.lead_score >= 50) {
    taskType = "Email Follow-Up";
    priority = "Medium";
    dueDate = addDays(1);
    template = WARM_TEMPLATE;
  } else {
    taskType = "Nurture Sequence";
    priority = "Low";
    dueDate = addDays(3);
    template = COLD_TEMPLATE;
  }

  const { error: taskErr } = await supabase.from("tasks").insert({
    lead_id: leadId,
    task_type: taskType,
    priority,
    due_date: dueDate,
  });
  if (taskErr) throw new Error(`Failed to insert task: ${taskErr.message}`);

  const { error: followUpErr } = await supabase.from("follow_ups").insert({
    lead_id: leadId,
    follow_up_date: dueDate,
    message_template: fillTemplate(template, scored.name, scored.destination),
  });
  if (followUpErr) throw new Error(`Failed to insert follow-up: ${followUpErr.message}`);
}
