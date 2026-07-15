import { getSupabaseClient } from "./supabase.server";

// Only genuinely judgment-based fields are asked of Groq now — destination/
// timeline/vibe/lead_category/lead_score/urgency_level/ai_summary/next_action.
// Identity (name/email/phone), travelers (a fixed 5-option chip), contact_method
// (derivable from whether a phone was given), and budget (a fixed 5-option
// chip) are all deterministic and computed in code instead — Groq has proven
// unreliable even at simple passthrough (an XSS-payload name once came back
// empty; the old travelers-conversion rule's example labels didn't even match
// the funnel's real chip text). Budget and returning-customer status are still
// given to Groq as scoring *context* (they legitimately affect lead_score),
// just never trusted as something Groq echoes back.
const GROQ_SYSTEM_PROMPT = `You are an AI data enricher for a luxury travel CRM. You receive structured lead data from a web funnel. Your job is to format it into a strict JSON object and calculate missing CRM metrics.

RULES:
1. If a text value is missing, output "".
2. Generate a 1-sentence 'ai_summary' of their ideal trip.
3. Assign a 'lead_score' (1-100) and 'urgency_level' (Low, Medium, High). This score directly controls how fast the lead gets contacted, so use the full range decisively rather than clustering around the middle. Score using these calibrated bands:
   - 75-100 (Hot -> same-day WhatsApp outreach): a fixed-date occasion (Honeymoon, Anniversary) with a mid-to-top budget (anything above "Under ₹50k" or "Not sure yet"), OR any returning customer with a clear budget. A first-time inquiry combining a fixed-date occasion with the top budget bracket (₹3L+) is unambiguously in this band — score it 80-90, not 60.
   - 50-74 (Warm -> next-day email follow-up): an open-ended occasion (Holiday, Family Trip, Friends Trip, Work + Leisure) with a clear budget signal, or a fixed-date occasion paired with an unclear/low budget.
   - 1-49 (Cold -> nurture sequence): vague signals — no stated budget preference, or an open-ended occasion with the lowest budget bracket.
   Base the band on: the 'Timeline' field, which is actually an occasion/trip-type label (e.g. Honeymoon, Anniversary, Family Trip, Friends Trip, Work + Leisure, or a general Holiday) rather than a booking date; their stated budget (a higher budget signals a more valuable lead); and whether they are a returning customer (see rule 4).
4. If 'Returning Customer' is true, weight 'lead_score' upward — a proven past paying customer submitting an identical inquiry should score higher than a first-time stranger with the same answers, typically pushing well into the 85-100 range when other signals are also strong.
5. Suggest a logical 'next_action'.

Return EXACTLY this JSON structure:
{
  "destination": "",
  "timeline": "",
  "vibe": "",
  "lead_category": "",
  "lead_score": 0,
  "urgency_level": "",
  "ai_summary": "",
  "next_action": ""
}`;

type LeadPayload = Record<string, FormDataEntryValue>;

// Identity fields, travelers, contact_method, and budget are deliberately
// absent from this type — see the comment above GROQ_SYSTEM_PROMPT. Nothing
// downstream may read scored.name/email/phone/travelers/contact_method/budget;
// only the raw funnel payload (via the raw*/deriveContactMethod/map* helpers
// below) is a valid source for them.
type ScoredLead = {
  destination: string;
  timeline: string;
  vibe: string;
  lead_category: string;
  lead_score: number;
  urgency_level: string;
  ai_summary: string;
  next_action: string;
};

const MAX_NAME_LENGTH = 200;

// Keyed by the DestinationFunnel component's exact current chip labels
// (app/routes/home.tsx) — verify against the live component if these ever
// drift, since Groq's old conversion rule silently used example labels that
// didn't even match the real chips.
const TRAVELERS_MAP: Record<string, number> = {
  "Just me": 1,
  "The two of us": 2,
  "Family with kids": 4,
  "A group of friends": 5,
  "Large family group": 10,
};

// Numeric lower-bound of each budget bracket. "Under ₹50k" and "Not sure yet"
// both intentionally store 0 — the former's true lower bound genuinely is 0,
// and there's no separate text field to distinguish "a real low budget" from
// "no answer given". Acceptable given the funnel only exposes these 5 labels;
// flagged here rather than silently picked.
const BUDGET_MAP: Record<string, number> = {
  "Under ₹50k": 0,
  "₹50k–1L": 50000,
  "₹1L–3L": 100000,
  "₹3L+": 300000,
  "Not sure yet": 0,
};

function field(payload: LeadPayload, key: string): string {
  return typeof payload[key] === "string" ? (payload[key] as string) : "";
}

function mapTravelersToInt(travelersLabel: string): number {
  return TRAVELERS_MAP[travelersLabel] ?? 0;
}

function mapBudgetToNumber(budgetLabel: string): number {
  return BUDGET_MAP[budgetLabel] ?? 0;
}

function deriveContactMethod(payload: LeadPayload): string {
  return field(payload, "whatsapp").trim() ? "WhatsApp" : "Email";
}

// Defensive server-side sanitization — the client already validates/trims,
// but an oversized name (e.g. 5000 chars) is large enough to break Groq's
// JSON response, so it's capped before anything touches Groq at all.
function sanitizePayload(payload: LeadPayload): LeadPayload {
  return { ...payload, name: field(payload, "name").trim().slice(0, MAX_NAME_LENGTH) };
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function fillTemplate(template: string, name: string, destination: string): string {
  return template.replaceAll("{name}", name).replaceAll("{destination}", destination);
}

export const HOT_TEMPLATE = `Hi {name}! 👋 Kirti here from The Nomads Co.
I can see you're thinking about a trip to {destination} very soon and I would love to make it absolutely unforgettable for you.
I've put together premium packages that match your travel style perfectly and I can have a personalised itinerary ready within 24 hours.
Are you free for a quick chat today? I'm on WhatsApp right now.
— Kirti Shah | The Nomads Co.
📞 +91 99243 99335 | thenomadsco.in`;

export const WARM_TEMPLATE = `Hi {name}! 😊 This is Kirti from The Nomads Co.
I noticed you're planning a trip to {destination} in the coming months.
I have some great ideas that match your travel style perfectly.
Would it help if I sent over a few curated options to get the planning started?
— Kirti Shah | The Nomads Co.
📞 +91 99243 99335 | thenomadsco.in`;

export const COLD_TEMPLATE = `Hi {name}! 🌍 Kirti here from The Nomads Co.
Whenever you're ready to start planning your trip to {destination}, I'm here to help make it completely stress-free.
No pressure at all — just reach out when the time feels right. I'll make sure it's worth every rupee. 🌟
— Kirti Shah | The Nomads Co.
📞 +91 99243 99335 | thenomadsco.in`;

async function checkIsReturningCustomer(email: string, supabase: ReturnType<typeof getSupabaseClient>): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return false;

  const { data, error } = await supabase
    .from("leads")
    .select("id, lead_status, booked_trips(id)")
    .ilike("email", normalizedEmail)
    .is("deleted_at", null);

  if (error) {
    console.error("Failed to check returning-customer status:", error);
    return false;
  }

  return (data ?? []).some(
    (l: any) => l.lead_status === "Converted" || (Array.isArray(l.booked_trips) && l.booked_trips.length > 0)
  );
}

async function scoreWithGroq(
  payload: LeadPayload,
  env: Env,
  context: { budget: number; isReturningCustomer: boolean }
): Promise<ScoredLead> {
  const userMessage = `Name: ${field(payload, "name")}
Email: ${field(payload, "email")}
Phone: ${field(payload, "whatsapp")}
Destination: ${field(payload, "destination")}
Timeline: ${field(payload, "occasion")}
Travelers: ${field(payload, "travelers")}
Vibe: ${field(payload, "vibe")}
Budget: ₹${context.budget}
Returning Customer: ${context.isReturningCustomer}`;

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
    signal: AbortSignal.timeout(15000),
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
  const normalizedEmail = field(payload, "email").trim().toLowerCase();

  // Groq enrichment failing doesn't mean this is a first-time lead -- leads.email
  // has a unique constraint, so a blind insert here crashes with a duplicate-key
  // error on any repeat submission. Mirror processLeadSubmission's find-or-insert
  // so a flaky Groq call can't turn a normal resubmission into a hard failure.
  const { data: matches, error: findErr } = await supabase
    .from("leads")
    .select("id, contact_consent")
    .ilike("email", normalizedEmail)
    .is("deleted_at", null)
    .limit(1);
  if (findErr) throw new Error(`Failed to look up existing lead: ${findErr.message}`);

  let leadId: string;

  if (matches && matches.length > 0) {
    leadId = matches[0].id;
    const existingConsent = matches[0].contact_consent === true;

    const { error: inquiryErr } = await supabase.from("inquiries").insert({
      lead_id: leadId,
      destination: field(payload, "destination"),
      timeline: field(payload, "occasion"),
      vibe: field(payload, "vibe"),
      travelers: mapTravelersToInt(field(payload, "travelers")),
    });
    if (inquiryErr) throw new Error(`Failed to insert fallback inquiry: ${inquiryErr.message}`);

    // Never downgrade an existing true consent back to false -- same rule as
    // the main dedupe path. Leave lead_score/urgency/etc untouched since Groq
    // didn't run this time; overwriting a real prior score with null would
    // regress a properly-scored lead.
    if (field(payload, "contact_consent") === "true" && !existingConsent) {
      const { error: updateErr } = await supabase.from("leads").update({ contact_consent: true }).eq("id", leadId);
      if (updateErr) throw new Error(`Failed to update lead consent: ${updateErr.message}`);
    }
  } else {
    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .insert({
        name: field(payload, "name"),
        email: field(payload, "email"),
        phone: field(payload, "whatsapp"),
        destination: field(payload, "destination"),
        timeline: field(payload, "occasion"),
        vibe: field(payload, "vibe"),
        // travelers/budget/contact_method are all deterministic now, so unlike
        // before, the fallback path can still capture them even though Groq
        // enrichment failed.
        travelers: mapTravelersToInt(field(payload, "travelers")),
        budget: mapBudgetToNumber(field(payload, "budget")),
        contact_method: deriveContactMethod(payload),
        trip_category: field(payload, "occasion"),
        contact_consent: field(payload, "contact_consent") === "true",
        lead_score: null,
        source: field(payload, "source"),
        utm_source: field(payload, "utm_source"),
        utm_medium: field(payload, "utm_medium"),
        utm_campaign: field(payload, "utm_campaign"),
      })
      .select("id")
      .single();
    if (leadErr) throw new Error(`Failed to insert fallback lead: ${leadErr.message}`);
    leadId = lead.id;
  }

  const { error: taskErr } = await supabase.from("tasks").insert({
    lead_id: leadId,
    task_type: "Manual Review",
    priority: "High",
    due_date: today(),
  });

  if (taskErr) throw new Error(`Failed to insert fallback task: ${taskErr.message}`);
}

export async function processLeadSubmission(payload: LeadPayload, env: Env): Promise<void> {
  const sanitized = sanitizePayload(payload);
  const rawName = field(sanitized, "name");
  const rawEmail = field(sanitized, "email").trim();
  const rawPhone = field(sanitized, "whatsapp").trim();
  const rawTravelers = mapTravelersToInt(field(sanitized, "travelers"));
  const rawBudget = mapBudgetToNumber(field(sanitized, "budget"));
  const rawContactMethod = deriveContactMethod(sanitized);
  const rawOccasion = field(sanitized, "occasion");
  const rawConsent = field(sanitized, "contact_consent") === "true";

  const supabase = getSupabaseClient(env);
  const isReturningCustomer = await checkIsReturningCustomer(rawEmail, supabase);

  let scored: ScoredLead;
  try {
    scored = await scoreWithGroq(sanitized, env, { budget: rawBudget, isReturningCustomer });
  } catch (err) {
    console.error("Groq enrichment failed, falling back to manual review:", err);
    await insertManualReviewFallback(sanitized, env);
    return;
  }

  const normalizedEmail = rawEmail.toLowerCase();

  const { data: matches, error: findErr } = await supabase
    .from("leads")
    .select("id, contact_consent")
    .ilike("email", normalizedEmail)
    .is("deleted_at", null)
    .limit(1);

  if (findErr) throw new Error(`Failed to look up existing lead: ${findErr.message}`);

  let leadId: string;

  if (matches && matches.length > 0) {
    leadId = matches[0].id;
    const existingConsent = matches[0].contact_consent === true;

    const { error: inquiryErr } = await supabase.from("inquiries").insert({
      lead_id: leadId,
      destination: scored.destination,
      timeline: scored.timeline,
      vibe: scored.vibe,
      travelers: rawTravelers,
    });
    if (inquiryErr) throw new Error(`Failed to insert inquiry: ${inquiryErr.message}`);

    const updatePayload: Record<string, unknown> = {
      lead_score: scored.lead_score,
      urgency_level: scored.urgency_level,
      ai_summary: scored.ai_summary,
      next_action: scored.next_action,
      lead_category: scored.lead_category,
    };
    // Never downgrade an existing true consent back to false.
    if (rawConsent && !existingConsent) {
      updatePayload.contact_consent = true;
    }

    const { error: updateErr } = await supabase.from("leads").update(updatePayload).eq("id", leadId);
    if (updateErr) throw new Error(`Failed to update lead: ${updateErr.message}`);
  } else {
    const { data: inserted, error: insertErr } = await supabase
      .from("leads")
      .insert({
        name: rawName,
        email: rawEmail,
        phone: rawPhone,
        destination: scored.destination,
        timeline: scored.timeline,
        travelers: rawTravelers,
        vibe: scored.vibe,
        budget: rawBudget,
        contact_method: rawContactMethod,
        trip_category: rawOccasion,
        lead_category: scored.lead_category,
        lead_score: scored.lead_score,
        urgency_level: scored.urgency_level,
        ai_summary: scored.ai_summary,
        next_action: scored.next_action,
        source: field(sanitized, "source"),
        utm_source: field(sanitized, "utm_source"),
        utm_medium: field(sanitized, "utm_medium"),
        utm_campaign: field(sanitized, "utm_campaign"),
        contact_consent: rawConsent,
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
    message_template: fillTemplate(template, rawName, scored.destination),
    sequence_stage: 1,
  });
  if (followUpErr) throw new Error(`Failed to insert follow-up: ${followUpErr.message}`);
}
