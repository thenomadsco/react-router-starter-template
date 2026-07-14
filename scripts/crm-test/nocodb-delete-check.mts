import { chromium } from "playwright";

const NOCODB_URL = "https://nocodb-production-4bc7.up.railway.app/wt3mdoom/pzyka47t3gb16g5";
const PROFILE_DIR = new URL("./.nocodb-browser-profile", import.meta.url).pathname;

async function main() {
  const context = await chromium.launchPersistentContext(PROFILE_DIR, { headless: false, slowMo: 80 });
  const page = context.pages()[0] ?? (await context.newPage());

  let deleteResponse: { status: number; body: string } | null = null;
  page.on("response", async (res) => {
    const url = res.url();
    if (res.request().method() === "DELETE" && url.includes("/api/v2/tables/")) {
      let body = "";
      try {
        body = await res.text();
      } catch {}
      deleteResponse = { status: res.status(), body };
      console.log("[DELETE response]", res.status(), body.slice(0, 300));
    }
  });

  await page.goto(NOCODB_URL, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(6000);
  console.log("URL:", page.url());

  await page.screenshot({ path: "scripts/crm-test/nocodb-09b-workspace-home.png" });
  const sourceLink = page.locator("text=Nomads Supabase").first();
  await sourceLink.waitFor({ state: "visible", timeout: 10000 }).catch((e) => console.log("source link wait failed:", e.message));
  if (await sourceLink.count()) {
    await sourceLink.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: "scripts/crm-test/nocodb-09c-after-source-click.png" });

  const leadsLink = page.locator('.nc-treeview-item:has-text("leads")').first();
  await leadsLink.waitFor({ state: "visible", timeout: 10000 }).catch((e) => console.log("leads link wait failed:", e.message));
  const target = (await leadsLink.count()) ? leadsLink : page.locator("text=leads").last();
  await target.click();
  await page.waitForTimeout(2000);
  console.log("URL after leads click:", page.url());

  // Narrow to exactly one known-safe test row before touching anything --
  // never act on "the first row" of an unfiltered/unsorted grid, which could
  // be real customer data.
  const KNOWN_TEST_EMAIL_FRAGMENT = "nomadstest-hot";
  const toolbarSearchIcon = page.locator('.nc-search-btn, [data-testid="nc-search-btn"]').first();
  if (await toolbarSearchIcon.count()) {
    await toolbarSearchIcon.click();
  } else {
    await page.keyboard.press("Meta+F").catch(() => {});
  }
  await page.waitForTimeout(500);
  const searchInput = page.locator('input[placeholder*="Search" i]:visible').last();
  await searchInput.fill(KNOWN_TEST_EMAIL_FRAGMENT);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "scripts/crm-test/nocodb-10-before-delete.png" });

  const rowCountText = await page.locator("text=/\\d+ record/").first().textContent().catch(() => null);
  console.log("Row count after search:", rowCountText);
  if (!rowCountText || !rowCountText.startsWith("1 ")) {
    console.log(`ABORTING delete attempt -- search for "${KNOWN_TEST_EMAIL_FRAGMENT}" did not resolve to exactly 1 row.`);
    return;
  }

  console.log(`Confirmed exactly 1 matching row for "${KNOWN_TEST_EMAIL_FRAGMENT}" -- proceeding with delete attempt on it.`);
  await page.locator(".nc-grid-cell").first().click({ button: "right" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scripts/crm-test/nocodb-11-context-menu.png" });

  const deleteOption = page.locator('text="Delete Record", text="Delete row"').first();
  if (await deleteOption.count()) {
    console.log("Clicking Delete Record...");
    await deleteOption.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "scripts/crm-test/nocodb-12-after-delete-attempt.png" });
  } else {
    console.log("No 'Delete Record' context menu option found -- dumping visible menu text");
    console.log(await page.locator("body").innerText());
  }

  console.log("\nFinal DELETE response captured:", deleteResponse);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
