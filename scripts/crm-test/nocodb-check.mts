import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";

const PASSWORD_FILE = new URL("./.nocodb-password", import.meta.url);
const EMAIL = "thenomadsco@gmail.com";
const NOCODB_URL = "https://nocodb-production-4bc7.up.railway.app/wt3mdoom/pzyka47t3gb16g5";
const PROFILE_DIR = new URL("./.nocodb-browser-profile", import.meta.url).pathname;

async function main() {
  // Persistent profile -- login (and any manual navigation you do in the
  // window) survives across script runs, so this only needs to sign in once.
  const context = await chromium.launchPersistentContext(PROFILE_DIR, { headless: false, slowMo: 80 });
  const page = context.pages()[0] ?? (await context.newPage());

  page.on("response", async (res) => {
    const url = res.url();
    if (url.includes("/api/v2/tables/") && url.includes("/records")) {
      let bodyPreview = "";
      try {
        bodyPreview = (await res.text()).slice(0, 400);
      } catch {}
      console.log(`[records API] ${res.status()} ${url}\n  ${bodyPreview}`);
    }
  });
  page.on("console", (msg) => {
    if (msg.type() === "error" && /chatwoot|404.*widget/i.test(msg.text())) return;
    if (msg.type() === "error") console.log("[console error]", msg.text());
  });

  console.log("Navigating to workspace URL...");
  await page.goto(NOCODB_URL, { waitUntil: "domcontentloaded", timeout: 30000 }).catch((e) => console.log("nav:", e.message));
  await page.waitForTimeout(2000);

  const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
  if (await emailInput.count().then((c) => c > 0).catch(() => false)) {
    console.log("Login form detected -- signing in.");
    const PASSWORD = readFileSync(PASSWORD_FILE, "utf8").trim();
    await emailInput.fill(EMAIL);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    await page.locator('button:has-text("Sign In"), button:has-text("Sign in")').first().click();
    await page.waitForTimeout(3000);
  } else {
    console.log("Already authenticated (persistent profile).");
  }
  console.log("Current URL:", page.url());
  await page.screenshot({ path: "scripts/crm-test/nocodb-03-after-login.png" });

  if (!page.url().includes(NOCODB_URL.split("/").slice(-2).join("/"))) {
    console.log("Not on the workspace yet -- navigating again.");
    await page.goto(NOCODB_URL, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
  }

  const sourceLink = page.locator("text=Nomads Supabase").first();
  if (await sourceLink.count()) {
    await sourceLink.click();
    await page.waitForTimeout(1000);
  }

  const leadsLink = page.locator('.nc-treeview-item:has-text("leads")').first();
  const target = (await leadsLink.count()) ? leadsLink : page.locator("text=leads").last();
  await target.click();
  await page.waitForTimeout(2500);
  console.log("URL after clicking leads:", page.url());
  await page.screenshot({ path: "scripts/crm-test/nocodb-05-leads-table.png" });

  console.log("Reloading to force a fresh records fetch (watching for [records API] logs above)...");
  await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scripts/crm-test/nocodb-09-after-reload.png" });

  console.log("\nLeaving browser open for manual inspection -- close it yourself when done, or re-run this script.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
