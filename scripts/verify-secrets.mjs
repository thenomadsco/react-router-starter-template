#!/usr/bin/env node
// Diagnostic: cross-references what the code expects, what worker-configuration.d.ts
// declares, and what's actually deployed as a Cloudflare Worker secret. Read-only;
// makes no changes. Run with: node scripts/verify-secrets.mjs
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = new URL("..", import.meta.url).pathname;

function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git" || entry === "build") continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => entry.endsWith(e))) out.push(full);
  }
  return out;
}

// 1. What the code actually reads (env.X or context.cloudflare.env.X)
const files = walk(join(REPO_ROOT, "app"), [".ts", ".tsx"])
  .concat(walk(join(REPO_ROOT, "workers"), [".ts", ".tsx"]));
const codeRefs = new Set();
const refPattern = /(?:context\.cloudflare\.env|env)\.([A-Z][A-Z0-9_]*)/g;
for (const f of files) {
  const text = readFileSync(f, "utf8").replace(/import\.meta\.env\.[A-Z][A-Z0-9_]*/g, "");
  for (const m of text.matchAll(refPattern)) codeRefs.add(m[1]);
}

// 2. What worker-configuration.d.ts declares
const typesText = readFileSync(join(REPO_ROOT, "worker-configuration.d.ts"), "utf8");
const declaredEnv = new Set();
const envBlockMatch = typesText.match(/interface Env \{([\s\S]*?)\n\t\}/);
if (envBlockMatch) {
  for (const m of envBlockMatch[1].matchAll(/^\t\t([A-Z][A-Z0-9_]*)\s*:/gm)) declaredEnv.add(m[1]);
}

// 3. What's actually deployed as a secret
let deployedSecrets = [];
try {
  const raw = execSync("npx wrangler secret list", { cwd: REPO_ROOT, encoding: "utf8" });
  const jsonStart = raw.indexOf("[");
  deployedSecrets = JSON.parse(raw.slice(jsonStart)).map((s) => s.name);
} catch (err) {
  console.error("Failed to run `wrangler secret list`:", err.message);
  process.exit(1);
}
const deployedSet = new Set(deployedSecrets);

// wrangler.json plain `vars` are not secrets -- exclude from the secret comparison
const wranglerConfig = JSON.parse(readFileSync(join(REPO_ROOT, "wrangler.json"), "utf8"));
const plainVars = new Set(Object.keys(wranglerConfig.vars ?? {}));

const secretLikeCodeRefs = [...codeRefs].filter((k) => !plainVars.has(k));
const secretLikeDeclared = [...declaredEnv].filter((k) => !plainVars.has(k));

console.log("=== Code references (env.X / context.cloudflare.env.X) ===");
console.log([...codeRefs].sort().join(", "));
console.log("\n=== worker-configuration.d.ts Env declarations ===");
console.log([...declaredEnv].sort().join(", "));
console.log("\n=== Deployed Cloudflare Worker secrets (wrangler secret list) ===");
console.log(deployedSecrets.sort().join(", "));

console.log("\n=== MISMATCHES ===");
let clean = true;

for (const ref of secretLikeCodeRefs) {
  if (!deployedSet.has(ref)) {
    clean = false;
    console.log(`MISSING IN PRODUCTION: code reads "${ref}" but it is not in \`wrangler secret list\`.`);
  }
  if (!declaredEnv.has(ref)) {
    clean = false;
    console.log(`UNDECLARED IN TYPES: code reads "${ref}" but worker-configuration.d.ts does not declare it.`);
  }
}
for (const s of deployedSecrets) {
  if (!secretLikeCodeRefs.includes(s)) {
    clean = false;
    console.log(`DEAD SECRET: "${s}" is deployed but no code in app/ or workers/ references it.`);
  }
}
for (const d of secretLikeDeclared) {
  if (!secretLikeCodeRefs.includes(d)) {
    clean = false;
    console.log(`DECLARED BUT UNUSED: "${d}" is in worker-configuration.d.ts but no code references it.`);
  }
  if (!deployedSet.has(d)) {
    clean = false;
    console.log(`DECLARED BUT NOT DEPLOYED: "${d}" is in worker-configuration.d.ts but not in \`wrangler secret list\`.`);
  }
}

if (clean) console.log("None -- code references, type declarations, and deployed secrets all match exactly.");
