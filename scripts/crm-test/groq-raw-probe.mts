import ws from "ws";
(globalThis as any).WebSocket = ws;
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { processLeadSubmission } from "../../app/lib/lead-pipeline.server.ts";

config({ path: ".dev.vars" });
const env = { SUPABASE_URL: process.env.SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!, GROQ_API_KEY: process.env.GROQ_API_KEY! } as any;
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const realFetch = globalThis.fetch;
(globalThis as any).fetch = async (input: any, init?: any) => {
  const url = typeof input === "string" ? input : input.url;
  if (url.includes("api.groq.com")) {
    const body = JSON.parse(init.body);
    console.log("=== REQUEST system prompt (first 300 chars) ===");
    console.log(body.messages[0].content.slice(0, 300));
    console.log("=== REQUEST user message ===");
    console.log(body.messages[1].content);
    const res = await realFetch(input, init);
    const clone = res.clone();
    const json = await clone.json();
    console.log("=== RESPONSE content ===");
    console.log(json.choices[0].message.content);
    return res;
  }
  return realFetch(input, init);
};

const email = `vedantshah197+groqraw-${Date.now().toString(36)}@gmail.com`;
await processLeadSubmission({
  name: "TEST_ Groq Raw Probe", email, whatsapp: "", destination: "Bali",
  occasion: "Honeymoon", travelers: "The two of us", vibe: "Mix of both", budget: "₹3L+",
  contact_consent: "true", source: "test-harness", utm_source: "", utm_medium: "", utm_campaign: "",
}, env);
