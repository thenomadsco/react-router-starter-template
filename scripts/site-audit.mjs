// Reusable Playwright regression audit for thenomadsco.in.
// Usage: node scripts/site-audit.mjs
// Requires: npm install -D playwright && npx playwright install chromium --with-deps

import { chromium } from "playwright";

const BASE = "https://thenomadsco.in";

const TEST_EMAIL_1 = "playwright-audit@example.com";
const TEST_EMAIL_2 = "playwright-audit-utm@example.com";
const TEST_NAME = "Playwright Audit Test";

const HEADINGS = {
  step0: "Where are you dreaming of going?",
  step1: "What's the occasion?",
  step2: "Who's making this trip happen?",
  step3: "How do you actually travel?",
  step4: "Almost there.",
  success: "Preferences Secured!",
  failure: "Something went wrong",
};

const report = {
  check1_submission_integrity: null,
  check2_utm_survival: null,
  check3_paris_chip: null,
  check4_entry_points: null,
  check5_console_errors: null,
  check6_journal_stability: null,
  check7_other_issues: [],
};

const globalIssues = [];

function attachGlobalListeners(page, label) {
  page.on("console", (msg) => {
    const type = msg.type();
    if (type === "error" || type === "warning") {
      globalIssues.push({ page: label, type: `console.${type}`, text: msg.text() });
    }
  });
  page.on("pageerror", (err) => {
    globalIssues.push({ page: label, type: "pageerror", text: err.message });
  });
  page.on("requestfailed", (req) => {
    globalIssues.push({
      page: label,
      type: "requestfailed",
      url: req.url(),
      failure: req.failure()?.errorText,
    });
  });
  page.on("response", (res) => {
    if (res.status() >= 400) {
      globalIssues.push({ page: label, type: "http_error", status: res.status(), url: res.url() });
    }
  });
}

async function waitForAnyHeading(page, timeout = 12000) {
  const regex = new RegExp(
    Object.values(HEADINGS)
      .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")
  );
  try {
    await page.locator("h3").filter({ hasText: regex }).first().waitFor({ state: "visible", timeout });
    const text = await page.locator("h3").filter({ hasText: regex }).first().textContent();
    return text?.trim() ?? null;
  } catch {
    return null;
  }
}

async function getFunnelModalState(page) {
  const heading = await waitForAnyHeading(page, 4000);
  return { opened: heading !== null, heading };
}

function parsePostDataForField(postData, contentType, fieldName) {
  if (!postData) return null;
  if (contentType?.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(postData);
    return params.get(fieldName);
  }
  // multipart/form-data or unknown — fall back to a text scan.
  const re = new RegExp(`name="${fieldName}"\\r?\\n\\r?\\n([^\\r\\n]*)`);
  const m = postData.match(re);
  return m ? m[1] : null;
}

async function runCheck1(browser) {
  console.log("\n=== Check 1: Submission error handling ===");
  const page = await browser.newPage();
  attachGlobalListeners(page, "check1:/");
  const result = {
    request: null,
    response: null,
    renderedAfterSubmit: null,
    responseSaysSuccess: null,
    renderedSaysSuccess: null,
    consistent: null,
  };

  try {
    await page.goto(BASE, { waitUntil: "networkidle" });

    await page.locator("nav button", { hasText: "Plan My Trip" }).first().click();
    await waitForAnyHeading(page);

    // Step 0 — quick pick chip
    await page.locator(".flex.flex-wrap.gap-2 button", { hasText: "Bali" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step1 }).waitFor({ timeout: 10000 });

    // Step 1 — occasion
    await page.locator("button", { hasText: "Holiday" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step2 }).waitFor({ timeout: 10000 });

    // Step 2 — travelers
    await page.locator("button", { hasText: "Just me" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step3 }).waitFor({ timeout: 10000 });

    // Step 3 — vibe
    await page.locator("button", { hasText: "Mix of both" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step4 }).waitFor({ timeout: 10000 });

    // Step 4 — contact info
    await page.locator('input[placeholder="Your First Name"]').fill(TEST_NAME);
    await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(TEST_EMAIL_1);

    // Filter out unrelated background POSTs (e.g. Cloudflare's /cdn-cgi/rum
    // beacon) so we don't pair the funnel submission's response with a
    // different request's data.
    const responsePromise = page.waitForResponse(
      (res) => res.request().method() === "POST" && !res.url().includes("/cdn-cgi/"),
      { timeout: 20000 }
    );

    await page.locator("button", { hasText: "Secure My Trip" }).click();

    const response = await responsePromise;
    const request = response.request();
    result.request = { url: request.url(), method: request.method() };
    let bodyText = null;
    try {
      bodyText = await response.text();
    } catch (e) {
      bodyText = `<failed to read body: ${e.message}>`;
    }
    result.response = { url: response.url(), status: response.status(), body: bodyText };
    result.responseSaysSuccess = /"success":\s*true/.test(bodyText) || /success.*true/i.test(bodyText);
    const responseSaysFailure = /"success":\s*false/.test(bodyText);

    // Let the fetcher's idle->next() transition settle.
    const finalHeading = await waitForAnyHeading(page, 8000);
    result.renderedAfterSubmit = finalHeading;
    result.renderedSaysSuccess = finalHeading === HEADINGS.success;

    if (responseSaysFailure && result.renderedSaysSuccess) {
      result.consistent = false;
      result.note = "MISMATCH: response body indicates failure but UI rendered the success screen.";
    } else if (result.responseSaysSuccess && !result.renderedSaysSuccess) {
      result.consistent = false;
      result.note = "MISMATCH: response body indicates success but UI did not render the success screen.";
    } else {
      result.consistent = true;
    }
  } catch (err) {
    result.error = err.message;
  } finally {
    await page.close();
  }

  report.check1_submission_integrity = result;
  console.log(JSON.stringify(result, null, 2));
}

async function runCheck2(browser) {
  console.log("\n=== Check 2: UTM survival from destination page ===");
  const context = await browser.newContext();
  const page = await context.newPage();
  attachGlobalListeners(page, "check2:/destinations/bali");
  const result = {
    sessionStorageAfterLoad: null,
    capturedPayload: null,
    utmFieldsMatch: null,
  };

  try {
    await page.goto(
      `${BASE}/destinations/bali?utm_source=playwrightcheck&utm_medium=test&utm_campaign=followup`,
      { waitUntil: "networkidle" }
    );

    result.sessionStorageAfterLoad = await page.evaluate(() => ({ ...sessionStorage }));

    // Destination page's own CTA opens the funnel with the destination pre-filled,
    // starting at the "occasion" step.
    await page.locator("button", { hasText: "Design Your Escape" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step1 }).waitFor({ timeout: 10000 });

    await page.locator("button", { hasText: "Holiday" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step2 }).waitFor({ timeout: 10000 });

    await page.locator("button", { hasText: "Just me" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step3 }).waitFor({ timeout: 10000 });

    await page.locator("button", { hasText: "Mix of both" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step4 }).waitFor({ timeout: 10000 });

    await page.locator('input[placeholder="Your First Name"]').fill(TEST_NAME);
    await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(TEST_EMAIL_2);

    const responsePromise = page.waitForResponse(
      (res) => res.request().method() === "POST" && !res.url().includes("/cdn-cgi/"),
      { timeout: 20000 }
    );
    await page.locator("button", { hasText: "Secure My Trip" }).click();
    const response = await responsePromise;
    const request = response.request();

    const contentType = request.headers()["content-type"];
    const postData = request.postData();
    const captured = {
      utm_source: parsePostDataForField(postData, contentType, "utm_source"),
      utm_medium: parsePostDataForField(postData, contentType, "utm_medium"),
      utm_campaign: parsePostDataForField(postData, contentType, "utm_campaign"),
    };
    result.capturedPayload = captured;
    result.utmFieldsMatch =
      captured.utm_source === "playwrightcheck" &&
      captured.utm_medium === "test" &&
      captured.utm_campaign === "followup";

    await waitForAnyHeading(page, 8000);
  } catch (err) {
    result.error = err.message;
  } finally {
    await page.close();
    await context.close();
  }

  report.check2_utm_survival = result;
  console.log(JSON.stringify(result, null, 2));
}

async function runCheck3(browser) {
  console.log("\n=== Check 3: Paris chip removed ===");
  const page = await browser.newPage();
  attachGlobalListeners(page, "check3:/");
  const result = { chips: null, parisPresent: null };

  try {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.locator("nav button", { hasText: "Plan My Trip" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step0 }).waitFor({ timeout: 10000 });

    const chips = await page.locator(".flex.flex-wrap.gap-2 button").allTextContents();
    result.chips = chips;
    result.parisPresent = chips.some((c) => c.trim().toLowerCase() === "paris");
  } catch (err) {
    result.error = err.message;
  } finally {
    await page.close();
  }

  report.check3_paris_chip = result;
  console.log(JSON.stringify(result, null, 2));
}

async function runCheck4(browser) {
  console.log("\n=== Check 4: Funnel entry point consistency ===");
  const entries = [
    {
      name: "Homepage nav button",
      url: BASE,
      action: async (page) => {
        await page.locator("nav button", { hasText: "Plan My Trip" }).first().click();
      },
    },
    {
      name: "Homepage hero CTA",
      url: BASE,
      action: async (page) => {
        await page.locator("button", { hasText: "Design Your Escape" }).first().click();
      },
    },
    {
      name: "Destination page own CTA (/destinations/maldives)",
      url: `${BASE}/destinations/maldives`,
      action: async (page) => {
        await page.locator("button", { hasText: "Design Your Escape" }).first().click();
      },
    },
    {
      name: "Direct URL ?openFunnel=true",
      url: `${BASE}/?openFunnel=true`,
      action: async () => {},
    },
  ];

  const results = [];
  for (const entry of entries) {
    const page = await browser.newPage();
    attachGlobalListeners(page, `check4:${entry.name}`);
    const entryResult = { name: entry.name, url: entry.url };
    try {
      await page.goto(entry.url, { waitUntil: "networkidle" });
      await entry.action(page);
      const state = await getFunnelModalState(page);
      entryResult.opened = state.opened;
      entryResult.startingHeading = state.heading;
    } catch (err) {
      entryResult.error = err.message;
    } finally {
      await page.close();
    }
    results.push(entryResult);
    console.log(JSON.stringify(entryResult, null, 2));
  }

  report.check4_entry_points = results;
}

async function runCheck5(browser) {
  console.log("\n=== Check 5: Console errors/warnings across key pages ===");
  const paths = ["/", "/destinations/goa", "/journal", "/privacypolicy", "/terms"];
  const results = [];

  for (const p of paths) {
    const page = await browser.newPage();
    const messages = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        messages.push({ type: msg.type(), text: msg.text() });
      }
    });
    page.on("pageerror", (err) => messages.push({ type: "pageerror", text: err.message }));

    const pageResult = { path: p, messages: null };
    try {
      await page.goto(`${BASE}${p}`, { waitUntil: "networkidle", timeout: 20000 });
      await page.waitForTimeout(1000);
      pageResult.messages = messages;
    } catch (err) {
      pageResult.error = err.message;
      pageResult.messages = messages;
    } finally {
      await page.close();
    }
    results.push(pageResult);
    console.log(JSON.stringify(pageResult, null, 2));
  }

  report.check5_console_errors = results;
}

async function runCheck6(browser) {
  console.log("\n=== Check 6: /journal stability (3 fresh attempts) ===");
  const attempts = [];

  for (let i = 1; i <= 3; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    attachGlobalListeners(page, `check6:/journal attempt ${i}`);
    const attemptResult = { attempt: i, outcome: null };
    try {
      await page.goto(`${BASE}/journal`, { waitUntil: "networkidle", timeout: 20000 });
      const fallbackVisible = await page
        .locator("h1", { hasText: "Journal Maintenance" })
        .isVisible()
        .catch(() => false);
      attemptResult.outcome = fallbackVisible ? "fallback_screen" : "success";
    } catch (err) {
      attemptResult.outcome = "failure";
      attemptResult.error = err.message;
    } finally {
      await page.close();
      await context.close();
    }
    attempts.push(attemptResult);
    console.log(JSON.stringify(attemptResult, null, 2));
  }

  report.check6_journal_stability = attempts;
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  await runCheck1(browser);
  await runCheck2(browser);
  await runCheck3(browser);
  await runCheck4(browser);
  await runCheck5(browser);
  await runCheck6(browser);

  // Check 7 — anything else that surfaced naturally.
  // Dedupe: only report entries not already central to checks 1/2 (the lead
  // submission POST itself is expected, not a bug).
  const seen = new Set();
  for (const issue of globalIssues) {
    const key = JSON.stringify(issue);
    if (seen.has(key)) continue;
    seen.add(key);
    if (issue.type === "http_error" && issue.url.includes("/?index")) continue; // the funnel POST, expected
    report.check7_other_issues.push(issue);
  }

  await browser.close();

  console.log("\n\n========== FULL STRUCTURED REPORT ==========");
  console.log(JSON.stringify(report, null, 2));

  return report;
}

main().catch((err) => {
  console.error("Audit script crashed:", err);
  process.exit(1);
});
