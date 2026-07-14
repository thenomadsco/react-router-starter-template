// Repeats the identical "Honeymoon + couple + top budget" input multiple
// times to see how much run-to-run variance Groq's lead_score has for the
// same profile (temperature=0.1 in the real prompt, so should be low-ish,
// but two earlier one-off calls landed at 60 and 80 for the same input).
import ws from "ws";
(globalThis as any).WebSocket = ws;
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { processLeadSubmission } from "../../app/lib/lead-pipeline.server.ts";

config({ path: ".dev.vars" });
const env = { SUPABASE_URL: process.env.SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!, GROQ_API_KEY: process.env.GROQ_API_KEY! } as any;
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function main() {
  const scores: number[] = [];
  for (let i = 0; i < 6; i++) {
    const email = `vedantshah197+variance-${Date.now().toString(36)}-${i}@gmail.com`;
    await processLeadSubmission({
      name: "TEST_ Variance Probe", email, whatsapp: "", destination: "Bali",
      occasion: "Honeymoon", travelers: "The two of us", vibe: "Mix of both", budget: "₹3L+",
      contact_consent: "true", source: "test-harness", utm_source: "", utm_medium: "", utm_campaign: "",
    }, env);
    const { data } = await supabase.from("leads").select("lead_score").ilike("email", email).limit(1);
    const score = data?.[0]?.lead_score;
    scores.push(score);
    console.log(`trial ${i + 1}: score=${score}`);
  }
  console.log("\nAll scores:", scores);
  console.log(`Crossed 75 (Hot): ${scores.filter((s) => s >= 75).length}/${scores.length}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
