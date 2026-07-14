import { chromium } from "playwright";

const TEST_EMAIL = process.argv[2] || "vedantshah197+nomadstest1@gmail.com";
const TEST_NAME = process.argv[3] || "TEST_ Playwright QA One";
const DEST = process.argv[4] || "Bali";
const OCCASION = process.argv[5] || "Honeymoon";
const TRAVELERS = process.argv[6] || "The two of us";
const VIBE = process.argv[7] || "Mix of both";
const BUDGET = process.argv[8] || "₹3L+";

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 120 });
  const page = await browser.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error" && msg.text().includes("cloudflareinsights")) return;
    console.log("[console]", msg.type(), msg.text());
  });

  console.log(`Submitting: ${TEST_NAME} <${TEST_EMAIL}> -> ${DEST}/${OCCASION}/${TRAVELERS}/${VIBE}/${BUDGET}`);
  await page.goto("https://thenomadsco.in", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  await page.locator("text=Plan My Trip").first().click();
  await page.waitForTimeout(800);

  // Step 0: destination
  await page.locator(`button:has-text("${DEST}")`).first().click();
  await page.waitForTimeout(600);

  // Step 1: occasion
  await page.locator(`button:has-text("${OCCASION}")`).first().click();
  await page.waitForTimeout(600);

  // Step 2: travelers
  await page.locator(`button:has-text("${TRAVELERS}")`).first().click();
  await page.waitForTimeout(600);

  // Step 3: vibe
  await page.locator(`button:has-text("${VIBE}")`).first().click();
  await page.waitForTimeout(600);

  // Step 4: budget
  await page.locator(`button:has-text("${BUDGET}")`).first().click();
  await page.waitForTimeout(800);

  // Step 5: contact form
  await page.screenshot({ path: "scripts/crm-test/step5-arrival.png" });
  await page.locator('input[aria-label="Your First Name"]').fill(TEST_NAME);
  await page.locator('input[aria-label="Email address"]').fill(TEST_EMAIL);
  await page.locator('input[aria-label="I agree to be contacted about my trip via WhatsApp or email"]').check();

  await page.screenshot({ path: "scripts/crm-test/step5-before-turnstile.png" });

  console.log("Waiting for Turnstile to resolve (up to 45s)...");
  page.on("framenavigated", (f) => console.log("[navigated]", f.url()));
  const submitBtn = page.locator('button:has-text("Secure My Trip")');
  try {
    await submitBtn.waitFor({ state: "attached", timeout: 5000 });
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(3000);
      console.log(`  [${(i + 1) * 3}s] url=${page.url()}`);
      const disabled = await submitBtn.getAttribute("disabled").catch(() => "gone");
      console.log(`  [${(i + 1) * 3}s] submit disabled attr = ${disabled}`);
      if (disabled === null) break;
    }
    const stillDisabled = await submitBtn.getAttribute("disabled").catch(() => "gone");
    if (stillDisabled !== null) throw new Error("still disabled after 45s");
    console.log("Turnstile resolved -- submit button enabled.");
  } catch (e) {
    console.log("Turnstile did NOT resolve within 45s -- submit button still disabled/gone.", e.message);
    await page.screenshot({ path: "scripts/crm-test/step5-turnstile-timeout.png" });
    await browser.close();
    return;
  }

  await page.screenshot({ path: "scripts/crm-test/step5-ready.png" });
  await submitBtn.click();

  console.log("Submitted, waiting for success screen...");
  try {
    await page.waitForSelector("text=Preferences Secured!", { timeout: 20000 });
    console.log("SUCCESS: Preferences Secured screen shown.");
    await page.screenshot({ path: "scripts/crm-test/step6-success.png" });
  } catch (e) {
    console.log("Did not see success screen within 20s.");
    await page.screenshot({ path: "scripts/crm-test/step6-timeout.png" });
  }

  await page.waitForTimeout(1500);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
