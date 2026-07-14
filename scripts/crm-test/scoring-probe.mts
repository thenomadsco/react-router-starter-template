// Observational probe (not pass/fail assertions): characterizes how Groq's
// lead_score responds to signal strength, to see whether the >=75 "Hot"
// threshold is reachable at all under the current system prompt, and what
// it actually takes to cross it.
import ws from "ws";
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
const RUN_ID = Date.now().toString(36);

function payload(overrides: Record<string, string>): Record<string, string> {
  return {
    name: "TEST_ Scoring Probe",
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

async function scoreOf(email: string) {
  const { data } = await supabase.from("leads").select("lead_score, lead_category, ai_summary, urgency_level").ilike("email", email).is("deleted_at", null).limit(1);
  return data?.[0];
}

async function markReturningCustomer(email: string) {
  const { data, error } = await supabase.from("leads").insert({
    name: "TEST_ Prior Customer", email, destination: "Goa", lead_status: "Converted", source: "test-harness",
  }).select("id").single();
  if (error) throw error;
  return data.id;
}

async function probe(label: string, email: string, overrides: Record<string, string>) {
  await processLeadSubmission(payload({ email, ...overrides }), env);
  const result = await scoreOf(email);
  console.log(`\n[${label}] score=${result?.lead_score} urgency=${result?.urgency_level} category=${result?.lead_category}`);
  console.log(`  summary: ${result?.ai_summary}`);
  return result;
}

async function main() {
  await probe("Baseline: Holiday, solo, unsure budget", `vedantshah197+probe-baseline-${RUN_ID}@gmail.com`, {});

  await probe("Honeymoon + couple + top budget", `vedantshah197+probe-honeymoon-${RUN_ID}@gmail.com`, {
    occasion: "Honeymoon", travelers: "The two of us", budget: "₹3L+",
  });

  await probe("Anniversary + couple + top budget", `vedantshah197+probe-anniversary-${RUN_ID}@gmail.com`, {
    occasion: "Anniversary", travelers: "The two of us", budget: "₹3L+",
  });

  await probe("Family Trip + kids + top budget (contrast)", `vedantshah197+probe-family-${RUN_ID}@gmail.com`, {
    occasion: "Family Trip", travelers: "Family with kids", budget: "₹3L+",
  });

  // returning customer + maximal signal -- the strongest combination the
  // system prompt describes ("weight lead_score upward" for returning + a
  // fixed-date, high-budget occasion)
  const returningEmail = `vedantshah197+probe-returning-${RUN_ID}@gmail.com`;
  await markReturningCustomer(returningEmail);
  await probe("Returning customer + Honeymoon + couple + top budget (max signal)", returningEmail, {
    occasion: "Honeymoon", travelers: "The two of us", budget: "₹3L+",
  });

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
