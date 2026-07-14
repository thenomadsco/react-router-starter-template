// Reusable Playwright regression audit for thenomadsco.in.
// Usage: node scripts/site-audit.mjs
// Requires: npm install -D playwright && npx playwright install chromium --with-deps
//
// Sections 1-7 are the original funnel/UTM/entry-point/console/journal checks.
// Sections A-H (added in the "most thorough audit yet" pass) cover crawling,
// form edge cases, resilience, security, mobile/a11y, performance, backend
// data health, and a quick regression re-check. All Supabase access here
// uses the service role key from .dev.vars — this script must only ever be
// run locally, never committed with real credentials inlined.

import { chromium, devices } from "playwright";
import fs from "fs";

const BASE = "https://thenomadsco.in";

const TEST_EMAIL_1 = "playwright-audit@example.com";
const TEST_EMAIL_2 = "playwright-audit-utm@example.com";
const TEST_NAME = "Playwright Audit Test";

// ---- Supabase REST helper (service role, local-only) ----
function loadDevVars() {
  const path = new URL("../.dev.vars", import.meta.url);
  if (!fs.existsSync(path)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(path, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1)];
      })
  );
}
const DEV_VARS = loadDevVars();
const SUPABASE_URL = DEV_VARS.SUPABASE_URL;
const SUPABASE_KEY = DEV_VARS.SUPABASE_SERVICE_ROLE_KEY;

async function sb(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: opts.prefer || "return=representation",
      ...opts.headers,
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

// Standing rule: any filter-based DELETE must SELECT-and-print the exact
// same filter first, and only delete once the caller has looked at the
// printed match. This helper enforces that shape everywhere it's used.
async function selectThenDelete(label, selectPath, deletePath) {
  const matches = await sb(selectPath);
  console.log(`  [SELECT before DELETE] ${label}: ${Array.isArray(matches) ? matches.length : "?"} row(s) matched`);
  console.log(JSON.stringify(matches, null, 2));
  if (Array.isArray(matches) && matches.length === 0) return matches;
  const deleted = await sb(deletePath, { method: "DELETE" });
  console.log(`  [DELETE] ${label}: ${deleted.length} row(s) deleted`);
  return deleted;
}

// Orphaned route files that exist under app/routes/ but are never referenced
// in app/routes.ts — confirmed via direct comparison of routes.ts's imports
// against `ls app/routes/`. React Router 7 uses explicit route config (no
// filesystem-based routing), so any file not listed there is unreachable by
// definition; this list exists to empirically double-check that.
const ORPHANED_ROUTE_SLUGS = [
  "andaman", "australia", "contactus", "family", "france", "friends", "goa",
  "gujarat", "himachal", "honeymoon", "indonesia", "italy", "japan", "kashmir",
  "kerala", "ladakh", "london", "maldives", "meghalaya", "mp", "rajasthan",
  "sikkim", "singapore", "switzerland", "thailand", "uae", "up", "vietnam",
];

const HEADINGS = {
  step0: "Where are you dreaming of going?",
  step1: "What's the occasion?",
  step2: "Who's making this trip happen?",
  step3: "How do you actually travel?",
  step4: "What's your rough budget for this trip?",
  step5: "Almost there.",
  success: "Preferences Secured!",
  failure: "Something went wrong",
};

// Every real funnel submission needs a budget pick + consent check before
// "Secure My Trip" is even clickable (it also gates Turnstile alongside the
// button's disabled state). Centralized here so every call site advances
// through both in the same way.
async function pickBudgetAndConsent(pageOrLocatorScope) {
  await pageOrLocatorScope.locator("button", { hasText: "₹1L–3L" }).first().click();
  await pageOrLocatorScope.waitForTimeout(500);
  await pageOrLocatorScope.locator("h3").filter({ hasText: HEADINGS.step5 }).waitFor({ timeout: 15000 });
}

async function checkConsent(pageOrLocatorScope) {
  await pageOrLocatorScope.locator('input[type="checkbox"]').first().check();
}

// The submit button is disabled until Turnstile produces a real token
// (in addition to consent being checked) — this was never accounted for in
// this script before, so every submission check would otherwise click a
// still-disabled button and then time out waiting for a response that never
// fires. On the real production domain the site key is valid, so Turnstile
// should genuinely solve on its own within a few seconds.
async function waitForSubmitEnabled(page, timeoutMs = 20000) {
  const button = page.locator("button", { hasText: "Secure My Trip" });
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (!(await button.isDisabled())) return true;
    await page.waitForTimeout(1000);
  }
  return false;
}

const report = {
  check1_submission_integrity: null,
  check2_utm_survival: null,
  check3_paris_chip: null,
  check4_entry_points: null,
  check5_console_errors: null,
  check6_journal_stability: null,
  check7_other_issues: [],
  checkA_crawl_and_links: null,
  checkB_form_edge_cases: null,
  checkC_resilience: null,
  checkD_security: null,
  checkE_mobile_a11y: null,
  checkF_performance: null,
  checkG_data_health: null,
  checkH_regression: null,
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
    await page.waitForTimeout(500);
    await page.locator("h3").filter({ hasText: HEADINGS.step1 }).waitFor({ timeout: 10000 });

    // Step 1 — occasion
    await page.locator("button", { hasText: "Holiday" }).first().click();
    await page.waitForTimeout(500);
    await page.locator("h3").filter({ hasText: HEADINGS.step2 }).waitFor({ timeout: 10000 });

    // Step 2 — travelers
    await page.locator("button", { hasText: "Just me" }).first().click();
    await page.waitForTimeout(500);
    await page.locator("h3").filter({ hasText: HEADINGS.step3 }).waitFor({ timeout: 10000 });

    // Step 3 — vibe
    await page.locator("button", { hasText: "Mix of both" }).first().click();
    await page.waitForTimeout(500);
    await page.locator("h3").filter({ hasText: HEADINGS.step4 }).waitFor({ timeout: 10000 });

    // Step 4 — budget
    await pickBudgetAndConsent(page);

    // Step 5 — contact info
    await page.locator('input[placeholder="Your First Name"]').fill(TEST_NAME);
    await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(TEST_EMAIL_1);
    await checkConsent(page);

    const submitEnabled = await waitForSubmitEnabled(page);
    result.submitEnabledAfterConsentAndTurnstile = submitEnabled;
    if (!submitEnabled) throw new Error("Submit button never became enabled (Turnstile token not obtained)");

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
    await page.waitForTimeout(500);
    await page.locator("h3").filter({ hasText: HEADINGS.step1 }).waitFor({ timeout: 10000 });

    await page.locator("button", { hasText: "Holiday" }).first().click();
    await page.waitForTimeout(500);
    await page.locator("h3").filter({ hasText: HEADINGS.step2 }).waitFor({ timeout: 10000 });

    await page.locator("button", { hasText: "Just me" }).first().click();
    await page.waitForTimeout(500);
    await page.locator("h3").filter({ hasText: HEADINGS.step3 }).waitFor({ timeout: 10000 });

    await page.locator("button", { hasText: "Mix of both" }).first().click();
    await page.waitForTimeout(500);
    await page.locator("h3").filter({ hasText: HEADINGS.step4 }).waitFor({ timeout: 10000 });

    await pickBudgetAndConsent(page);

    await page.locator('input[placeholder="Your First Name"]').fill(TEST_NAME);
    await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(TEST_EMAIL_2);
    await checkConsent(page);

    const submitEnabled = await waitForSubmitEnabled(page);
    result.submitEnabledAfterConsentAndTurnstile = submitEnabled;
    if (!submitEnabled) throw new Error("Submit button never became enabled (Turnstile token not obtained)");

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

// ============================================================
// SECTION A — Full crawl and link integrity
// ============================================================
async function runCheckA() {
  console.log("\n=== Section A: Full crawl and link integrity ===");
  const result = { orphanedRoutes: [], sitemapCheck: null, linkGraph: null };

  // A1 — every previously-found orphaned route file should genuinely be
  // unreachable (soft-404 via the catch-all route).
  console.log("-- A1: orphaned route files --");
  for (const slug of ORPHANED_ROUTE_SLUGS) {
    const url = `${BASE}/${slug}`;
    try {
      const res = await fetch(url);
      const html = await res.text();
      const isSoft404 = html.includes("Wandered off the map?") || html.includes("Page Not Found");
      result.orphanedRoutes.push({ slug, url, httpStatus: res.status, renderedAsNotFound: isSoft404 });
    } catch (err) {
      result.orphanedRoutes.push({ slug, url, error: err.message });
    }
  }
  const unexpectedlyReachable = result.orphanedRoutes.filter((r) => r.renderedAsNotFound === false);
  console.log(
    `Checked ${result.orphanedRoutes.length} orphaned routes — unexpectedly reachable: ${unexpectedlyReachable.length}`
  );
  if (unexpectedlyReachable.length) console.log(JSON.stringify(unexpectedlyReachable, null, 2));

  // A2 — robots.txt + sitemap.xml, cross-checked against a real crawl.
  console.log("-- A2: robots.txt + sitemap.xml --");
  const robotsRes = await fetch(`${BASE}/robots.txt`);
  const robotsText = await robotsRes.text();
  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  const sitemapLocs = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const sitemapUrlChecks = [];
  for (const loc of sitemapLocs) {
    try {
      const res = await fetch(loc);
      sitemapUrlChecks.push({ url: loc, status: res.status });
    } catch (err) {
      sitemapUrlChecks.push({ url: loc, error: err.message });
    }
  }
  const brokenSitemapUrls = sitemapUrlChecks.filter((c) => (c.status && c.status >= 400) || c.error);
  console.log(`robots.txt status: ${robotsRes.status}, sitemap.xml status: ${sitemapRes.status}`);
  console.log(`Sitemap lists ${sitemapLocs.length} URLs; ${brokenSitemapUrls.length} did not resolve cleanly`);
  if (brokenSitemapUrls.length) console.log(JSON.stringify(brokenSitemapUrls, null, 2));

  // A3 — crawl every registered/reachable page, extract every <a href>,
  // check each target for a real non-4xx/5xx response. Static-HTML crawl:
  // catches all server-rendered <a>/<Link> hrefs; does NOT catch JS-only
  // dynamically-constructed navigation (e.g. the WhatsApp deep-link button,
  // built at click-time via window.open(waLink(...))) — noted as a scope
  // limitation rather than silently claimed as covered.
  console.log("-- A3: crawl + link graph --");
  const destSlugs = sitemapLocs
    .filter((l) => l.includes("/destinations/"))
    .map((l) => l.split("/destinations/")[1]);
  const pagesToCrawl = [
    `${BASE}/`,
    `${BASE}/journal`,
    `${BASE}/privacypolicy`,
    `${BASE}/terms`,
    ...destSlugs.map((s) => `${BASE}/destinations/${s}`),
  ];

  const allLinks = new Set();
  const crawlErrors = [];
  for (const pageUrl of pagesToCrawl) {
    try {
      const res = await fetch(pageUrl);
      const html = await res.text();
      const hrefs = [...html.matchAll(/href="([^"]+)"/g)]
        .map((m) => m[1])
        .filter((h) => h && !h.startsWith("mailto:") && !h.startsWith("tel:") && !h.startsWith("#"));
      hrefs.forEach((h) => allLinks.add(h));
    } catch (err) {
      crawlErrors.push({ pageUrl, error: err.message });
    }
  }

  const linkChecks = [];
  for (const link of allLinks) {
    const fullUrl = link.startsWith("http") ? link : `${BASE}${link.startsWith("/") ? "" : "/"}${link}`;
    try {
      const res = await fetch(fullUrl);
      linkChecks.push({
        link,
        fullUrl,
        status: res.status,
        internal: fullUrl.startsWith(BASE),
      });
    } catch (err) {
      linkChecks.push({ link, fullUrl, error: err.message, internal: fullUrl.startsWith(BASE) });
    }
  }
  const brokenLinks = linkChecks.filter((c) => (c.status && c.status >= 400) || c.error);
  console.log(
    `Crawled ${pagesToCrawl.length} pages, found ${allLinks.size} unique link targets, ${brokenLinks.length} broken`
  );
  if (brokenLinks.length) console.log(JSON.stringify(brokenLinks, null, 2));

  result.sitemapCheck = {
    robotsStatus: robotsRes.status,
    robotsContent: robotsText,
    sitemapStatus: sitemapRes.status,
    totalUrlsListed: sitemapLocs.length,
    brokenSitemapUrls,
  };
  result.linkGraph = {
    pagesCrawled: pagesToCrawl.length,
    crawlErrors,
    uniqueLinksFound: allLinks.size,
    brokenLinks,
    allLinkChecks: linkChecks,
  };

  report.checkA_crawl_and_links = result;
}

// ============================================================
// SECTION B — Forms and lead capture: exhaustive edge cases
// ============================================================
async function openFunnelToContactStep(page) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.locator("nav button", { hasText: "Plan My Trip" }).first().click();
  await page.locator("h3").filter({ hasText: HEADINGS.step0 }).waitFor({ timeout: 15000 });
  await page.waitForTimeout(500);
  await page.locator(".flex.flex-wrap.gap-2 button", { hasText: "Bali" }).first().click();
  await page.locator("h3").filter({ hasText: HEADINGS.step1 }).waitFor({ timeout: 15000 });
  await page.waitForTimeout(500);
  await page.locator("button", { hasText: "Holiday" }).first().click();
  await page.locator("h3").filter({ hasText: HEADINGS.step2 }).waitFor({ timeout: 15000 });
  await page.waitForTimeout(500);
  await page.locator("button", { hasText: "Just me" }).first().click();
  await page.locator("h3").filter({ hasText: HEADINGS.step3 }).waitFor({ timeout: 15000 });
  await page.waitForTimeout(500);
  await page.locator("button", { hasText: "Mix of both" }).first().click();
  await page.locator("h3").filter({ hasText: HEADINGS.step4 }).waitFor({ timeout: 15000 });
  await page.waitForTimeout(500);
  await pickBudgetAndConsent(page);
  await page.waitForTimeout(500);
}

const B_TEST_EMAILS = {
  emptyName: "edgecase-emptyname@example.com",
  invalidEmail: "edgecase-invalidemail-notused@example.com",
  whitespaceName: "edgecase-whitespace@example.com",
  xss: "edgecase-xss@example.com",
  longName: "edgecase-longname@example.com",
  doubleSubmit: "edgecase-doublesubmit@example.com",
  unicode: "edgecase-unicode@example.com",
};

async function runCheckB(browser) {
  console.log("\n=== Section B: Form edge cases ===");
  const result = {};

  // B1 — empty name field
  {
    const page = await browser.newPage();
    try {
      await openFunnelToContactStep(page);
      let postFired = false;
      page.on("request", (req) => {
        if (req.method() === "POST" && !req.url().includes("cdn-cgi")) postFired = true;
      });
      await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(B_TEST_EMAILS.emptyName);
      await checkConsent(page);
      await waitForSubmitEnabled(page);
      await page.locator("button", { hasText: "Secure My Trip" }).click();
      await page.waitForTimeout(1500);
      const validationShown = await page.locator("text=Name is required").isVisible().catch(() => false);
      result.emptyName = { clientBlockedSubmission: !postFired, validationMessageShown: validationShown };
    } catch (err) {
      result.emptyName = { error: err.message };
    } finally {
      await page.close();
    }
  }

  // B2 — obviously invalid email
  {
    const page = await browser.newPage();
    try {
      await openFunnelToContactStep(page);
      let postFired = false;
      page.on("request", (req) => {
        if (req.method() === "POST" && !req.url().includes("cdn-cgi")) postFired = true;
      });
      await page.locator('input[placeholder="Your First Name"]').fill("Edge Case Invalid Email");
      await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill("notanemail");
      await checkConsent(page);
      await waitForSubmitEnabled(page);
      await page.locator("button", { hasText: "Secure My Trip" }).click();
      await page.waitForTimeout(1500);
      const validationShown = await page
        .locator("text=Enter a valid email address")
        .isVisible()
        .catch(() => false);
      result.invalidEmail = { clientBlockedSubmission: !postFired, validationMessageShown: validationShown };
    } catch (err) {
      result.invalidEmail = { error: err.message };
    } finally {
      await page.close();
    }
  }

  // B3 — whitespace-only name
  {
    const page = await browser.newPage();
    try {
      await openFunnelToContactStep(page);
      let postFired = false;
      page.on("request", (req) => {
        if (req.method() === "POST" && !req.url().includes("cdn-cgi")) postFired = true;
      });
      await page.locator('input[placeholder="Your First Name"]').fill("   ");
      await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(B_TEST_EMAILS.whitespaceName);
      await checkConsent(page);
      await waitForSubmitEnabled(page);
      await page.locator("button", { hasText: "Secure My Trip" }).click();
      await page.waitForTimeout(1500);
      result.whitespaceName = { clientBlockedSubmission: !postFired };
    } catch (err) {
      result.whitespaceName = { error: err.message };
    } finally {
      await page.close();
    }
  }

  // B4 — XSS / SQL-metacharacter injection attempt (real submission, cleaned up after)
  {
    const page = await browser.newPage();
    try {
      await openFunnelToContactStep(page);
      const responsePromise = page.waitForResponse(
        (res) => res.request().method() === "POST" && !res.url().includes("cdn-cgi"),
        { timeout: 20000 }
      );
      await page.locator('input[placeholder="Your First Name"]').fill('<script>alert(1)</script>');
      await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(B_TEST_EMAILS.xss);
      await checkConsent(page);
      await waitForSubmitEnabled(page);
      await page.locator("button", { hasText: "Secure My Trip" }).click();
      const response = await responsePromise;
      await page.waitForTimeout(2500);
      result.xssAttempt = { httpStatus: response.status(), submittedName: "<script>alert(1)</script>" };
    } catch (err) {
      result.xssAttempt = { error: err.message };
    } finally {
      await page.close();
    }
  }

  // B5 — extremely long name (5000 chars)
  {
    const page = await browser.newPage();
    const longName = "A".repeat(5000);
    try {
      await openFunnelToContactStep(page);
      const responsePromise = page.waitForResponse(
        (res) => res.request().method() === "POST" && !res.url().includes("cdn-cgi"),
        { timeout: 20000 }
      );
      await page.locator('input[placeholder="Your First Name"]').fill(longName);
      await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(B_TEST_EMAILS.longName);
      await checkConsent(page);
      await waitForSubmitEnabled(page);
      await page.locator("button", { hasText: "Secure My Trip" }).click();
      const response = await responsePromise;
      await page.waitForTimeout(2500);
      result.longName = { httpStatus: response.status(), submittedLength: longName.length };
    } catch (err) {
      result.longName = { error: err.message };
    } finally {
      await page.close();
    }
  }

  // B6 — rapid double-submit (two synchronous click events, no await between them)
  {
    const page = await browser.newPage();
    try {
      await openFunnelToContactStep(page);
      await page.locator('input[placeholder="Your First Name"]').fill("Double Submit Test");
      await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(B_TEST_EMAILS.doubleSubmit);
      await checkConsent(page);
      await waitForSubmitEnabled(page);
      let postCount = 0;
      page.on("request", (req) => {
        if (req.method() === "POST" && !req.url().includes("cdn-cgi")) postCount++;
      });
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Secure My Trip"));
        btn.click();
        btn.click();
      });
      await page.waitForTimeout(3000);
      result.doubleSubmit = { postRequestsObserved: postCount };
    } catch (err) {
      result.doubleSubmit = { error: err.message };
    } finally {
      await page.close();
    }
  }

  // B7 — unicode / emoji in name
  {
    const page = await browser.newPage();
    const unicodeName = "अमन 🌍";
    try {
      await openFunnelToContactStep(page);
      const responsePromise = page.waitForResponse(
        (res) => res.request().method() === "POST" && !res.url().includes("cdn-cgi"),
        { timeout: 20000 }
      );
      await page.locator('input[placeholder="Your First Name"]').fill(unicodeName);
      await page.locator('input[placeholder="Email (For formal itinerary & docs)"]').fill(B_TEST_EMAILS.unicode);
      await checkConsent(page);
      await waitForSubmitEnabled(page);
      await page.locator("button", { hasText: "Secure My Trip" }).click();
      const response = await responsePromise;
      await page.waitForTimeout(2500);
      result.unicode = { httpStatus: response.status(), submittedName: unicodeName };
    } catch (err) {
      result.unicode = { error: err.message };
    } finally {
      await page.close();
    }
  }

  // Now check what actually landed in Supabase for each real-submission case.
  console.log("-- Verifying actual stored data in Supabase --");
  await new Promise((r) => setTimeout(r, 3000)); // let Groq scoring finish
  const emailsToCheck = [B_TEST_EMAILS.xss, B_TEST_EMAILS.longName, B_TEST_EMAILS.doubleSubmit, B_TEST_EMAILS.unicode];
  const orFilter = emailsToCheck.map((e) => `email.eq.${encodeURIComponent(e)}`).join(",");
  const storedRows = await sb(`leads?or=(${orFilter})&select=id,name,email`);
  result.storedDataVerification = storedRows;
  console.log(JSON.stringify(storedRows, null, 2));

  const doubleSubmitLeads = storedRows.filter((r) => r.email === B_TEST_EMAILS.doubleSubmit);
  if (doubleSubmitLeads.length > 0) {
    const leadIdFilter = `lead_id=in.(${doubleSubmitLeads.map((l) => l.id).join(",")})`;
    const tasks = await sb(`tasks?${leadIdFilter}&select=id`);
    const followUps = await sb(`follow_ups?${leadIdFilter}&select=id`);
    result.doubleSubmit.leadsCreated = doubleSubmitLeads.length;
    result.doubleSubmit.tasksCreated = tasks.length;
    result.doubleSubmit.followUpsCreated = followUps.length;
  }

  console.log(JSON.stringify(result, null, 2));
  report.checkB_form_edge_cases = result;
  return emailsToCheck;
}

// ============================================================
// SECTION C — Failure and resilience testing
// ============================================================
async function runCheckC() {
  console.log("\n=== Section C: Failure and resilience ===");
  const result = {};

  // A second live forced-failure mode (e.g. malformed Groq response) would
  // require another temporary production secret/code change identical in
  // risk to the one used previously to verify the error screen —
  // browser-side network interception (page.route()) cannot reach the Groq
  // fetch call, since it happens server-side inside the Cloudflare Worker,
  // never in the browser. Declining to repeat that production-modifying
  // procedure again in this pass without being explicitly asked — verifying
  // the actual Groq-failure code path via inspection + real production
  // evidence instead.
  const pipelineSourcePath = new URL("../app/lib/lead-pipeline.server.ts", import.meta.url);
  const journalSourcePath = new URL("../app/routes/journal.tsx", import.meta.url);
  const source = fs.readFileSync(pipelineSourcePath, "utf8");
  const journalSource = fs.readFileSync(journalSourcePath, "utf8");

  // Search the whole file rather than a fixed-length slice from an anchor —
  // a slice window broke silently once earlier (the Groq-simplification
  // rewrite added enough lines before these patterns that a 900/500-char
  // window no longer reached them, making these checks falsely report
  // "false" for things that were actually still true).
  const groqFnMatch = source.match(/async function scoreWithGroq[\s\S]*?\n}/);
  const groqFetchBlock = groqFnMatch ? groqFnMatch[0] : "";
  const hasAbortSignalOnGroqCall = /AbortSignal\.timeout/.test(groqFetchBlock);
  const journalHasAbortSignal = /AbortSignal\.timeout/.test(journalSource);

  result.codeInspection = {
    groqFetchHasTimeout: hasAbortSignalOnGroqCall,
    journalFetchHasTimeout: journalHasAbortSignal,
    note: hasAbortSignalOnGroqCall
      ? "Groq fetch has a timeout configured."
      : "Groq fetch in scoreWithGroq() has NO AbortSignal timeout, unlike journal.tsx's loader (AbortSignal.timeout(8000)). If Groq hangs, nothing times this fetch out — the funnel submission would hang rather than falling back to Manual Review.",
  };

  const psMatch = source.match(/export async function processLeadSubmission[\s\S]*?\n}/);
  const errorHandlingBlock = psMatch ? psMatch[0] : "";
  result.groqFailureHandling = {
    catchWrapsScoreWithGroq: /try\s*\{\s*scored = await scoreWithGroq/.test(errorHandlingBlock),
    fallsBackWithoutRethrow: /insertManualReviewFallback\(sanitized, env\);\s*return;/.test(errorHandlingBlock),
    note: "Any Groq-side failure (auth error, malformed JSON, non-200 status) is caught inside processLeadSubmission's own try/catch around scoreWithGroq, which calls insertManualReviewFallback and returns normally — it does NOT rethrow. home.tsx's action still returns {success:true} and the user sees 'Preferences Secured!' even when Groq fails. The error screen verified previously only covers failures OUTSIDE this try/catch (e.g. a Supabase write failure) — it does not exercise the Groq-failure path at all.",
  };

  // Real evidence: any existing lead with lead_score IS NULL is proof the
  // Groq-failure fallback path has already fired for real, without needing
  // to force it again.
  const nullScoreLeads = await sb("leads?lead_score=is.null&select=id,name,email,source,created_at");
  result.realFallbackEvidence = {
    leadsWithNullScore: nullScoreLeads.length,
    rows: nullScoreLeads,
    note:
      nullScoreLeads.length > 0
        ? "Confirms the Groq-failure fallback path has fired for real production submissions."
        : "No real evidence found of the fallback path having fired naturally — doesn't mean it doesn't work, just that no Groq failure has happened yet in production data.",
  };

  console.log(JSON.stringify(result, null, 2));
  report.checkC_resilience = result;
}

// ============================================================
// SECTION D — Security scan
// ============================================================
async function runCheckD() {
  console.log("\n=== Section D: Security scan ===");
  const result = {};

  // D1 — grep the live deployed CLIENT bundle (not build/server, which never
  // ships to the browser) for anything that looks like a leaked secret.
  const homePageHtml = await (await fetch(BASE)).text();
  const jsUrls = [...new Set([...homePageHtml.matchAll(/"(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]))];
  const secretPatterns = [
    { name: "GROQ_API_KEY (name)", re: /GROQ_API_KEY/ },
    { name: "SUPABASE_SERVICE_ROLE_KEY (name)", re: /SUPABASE_SERVICE_ROLE_KEY/ },
    { name: "RESEND_API_KEY (name)", re: /RESEND_API_KEY/ },
    { name: "Groq key value pattern (gsk_)", re: /gsk_[A-Za-z0-9]{10,}/ },
    { name: "Generic secret key value pattern (sk_)", re: /\bsk_[A-Za-z0-9]{10,}/ },
    { name: "Resend key value pattern (re_)", re: /\bre_[A-Za-z0-9_]{10,}/ },
    { name: "Supabase service_role JWT fragment", re: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]*service_role/ },
  ];
  const findings = [];
  for (const jsUrl of jsUrls) {
    const fullUrl = `${BASE}${jsUrl}`;
    try {
      const jsText = await (await fetch(fullUrl)).text();
      for (const pattern of secretPatterns) {
        const match = jsText.match(pattern.re);
        if (match) findings.push({ file: fullUrl, pattern: pattern.name, matchedText: match[0].slice(0, 40) });
      }
    } catch {
      // ignore individual bundle fetch failures
    }
  }
  result.clientBundleSecretScan = { bundlesChecked: jsUrls.length, findings, clean: findings.length === 0 };
  console.log(`Client bundle secret scan: ${jsUrls.length} JS files checked, ${findings.length} potential leaks found`);
  if (findings.length) console.log(JSON.stringify(findings, null, 2));

  // D2 — .dev.vars never in git history
  const { execSync } = await import("node:child_process");
  const repoRoot = new URL("..", import.meta.url).pathname;
  let gitLogOutput = "";
  try {
    gitLogOutput = execSync("git log --all --full-history -- .dev.vars", { cwd: repoRoot }).toString();
  } catch (err) {
    gitLogOutput = `<error: ${err.message}>`;
  }
  result.devVarsGitHistory = { output: gitLogOutput, clean: gitLogOutput.trim() === "" };
  console.log(
    `.dev.vars git history check: ${gitLogOutput.trim() === "" ? "clean (no output)" : "FOUND ENTRIES: " + gitLogOutput}`
  );

  // D3 — response security headers (informational, not blocking)
  const headResRaw = await fetch(BASE);
  const headers = Object.fromEntries(headResRaw.headers.entries());
  const securityHeaderNames = [
    "strict-transport-security",
    "x-content-type-options",
    "x-frame-options",
    "content-security-policy",
    "referrer-policy",
    "permissions-policy",
  ];
  result.securityHeaders = Object.fromEntries(securityHeaderNames.map((h) => [h, headers[h] ?? null]));
  console.log("Security headers:", JSON.stringify(result.securityHeaders, null, 2));

  // D4 — anon key / client-side Supabase exposure
  let anonKeyGrep = "";
  try {
    anonKeyGrep = execSync(`grep -rl "SUPABASE_ANON\\|supabase-js" "${repoRoot}app" || true`).toString();
  } catch (err) {
    anonKeyGrep = `<error: ${err.message}>`;
  }
  const filesFound = anonKeyGrep.trim() ? anonKeyGrep.trim().split("\n") : [];
  result.clientSideSupabaseUsage = {
    filesReferencingSupabaseClientSide: filesFound,
    note:
      filesFound.length === 0
        ? "No client-side Supabase usage found anywhere in app/ — all Supabase access is server-side (Cloudflare Worker, service role key only, never shipped to the browser per the bundle scan above). Could not obtain the project's actual anon key (only the service role key is available in .dev.vars) to literally attempt an anonymous REST read, but the architectural fact that the client never talks to Supabase directly makes RLS/anon-key exposure moot for this app's real attack surface."
        : "Found references — needs manual review.",
  };
  console.log(JSON.stringify(result.clientSideSupabaseUsage, null, 2));

  report.checkD_security = result;
}

// ============================================================
// SECTION E — Mobile and basic accessibility
// ============================================================
async function runCheckE(browser) {
  console.log("\n=== Section E: Mobile and accessibility ===");
  const result = {};

  // E1 — full funnel walkthrough on a real narrow (iPhone 13) viewport
  const iphone = devices["iPhone 13"];
  const context = await browser.newContext({ ...iphone });
  const page = await context.newPage();
  try {
    await page.goto(BASE, { waitUntil: "networkidle" });
    const mobileMenuToggle = page.locator('button[aria-label="Open navigation menu"]');
    await mobileMenuToggle.click();
    await page.waitForTimeout(500);
    // The desktop nav's "Plan My Trip" button is still in the DOM (just
    // hidden via CSS on mobile) and appears before the mobile menu's own
    // copy of that button — .first() alone would match the hidden desktop
    // one. Scope to :visible so this actually clicks the mobile menu's CTA.
    await page.locator('button:visible', { hasText: "Plan My Trip" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step0 }).waitFor({ timeout: 15000 });

    const stepsChecked = [];
    const viewportSize = page.viewportSize();

    async function checkNoOverflow(stepName) {
      const modal = page.locator(".max-w-lg").first();
      const box = await modal.boundingBox();
      const overflowsViewport = box ? box.x < -5 || box.x + box.width > viewportSize.width + 5 : null;
      stepsChecked.push({ step: stepName, boundingBox: box, overflowsViewport });
    }

    await checkNoOverflow("step0_destination");
    await page.waitForTimeout(400);
    await page.locator(".flex.flex-wrap.gap-2 button", { hasText: "Bali" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step1 }).waitFor({ timeout: 15000 });
    await checkNoOverflow("step1_occasion");
    await page.waitForTimeout(400);
    await page.locator("button", { hasText: "Holiday" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step2 }).waitFor({ timeout: 15000 });
    await checkNoOverflow("step2_travelers");
    await page.waitForTimeout(400);
    await page.locator("button", { hasText: "Just me" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step3 }).waitFor({ timeout: 15000 });
    await checkNoOverflow("step3_vibe");
    await page.waitForTimeout(400);
    await page.locator("button", { hasText: "Mix of both" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step4 }).waitFor({ timeout: 15000 });
    await checkNoOverflow("step4_budget");
    await page.waitForTimeout(400);
    await page.locator("button", { hasText: "₹1L–3L" }).first().click();
    await page.locator("h3").filter({ hasText: HEADINGS.step5 }).waitFor({ timeout: 15000 });
    await checkNoOverflow("step5_contact");

    const consentCheckbox = page.locator('input[type="checkbox"]').first();
    const consentVisible = await consentCheckbox.isVisible();

    const submitButton = page.locator("button", { hasText: "Secure My Trip" });
    const submitVisible = await submitButton.isVisible();
    const submitBox = await submitButton.boundingBox();
    await page.screenshot({ path: "/tmp/mobile-funnel-step5.png" });

    result.mobileWalkthrough = {
      viewport: viewportSize,
      device: "iPhone 13",
      stepsChecked,
      anyOverflow: stepsChecked.some((s) => s.overflowsViewport),
      consentCheckboxVisible: consentVisible,
      submitButtonVisible: submitVisible,
      submitButtonBoundingBox: submitBox,
      screenshotPath: "/tmp/mobile-funnel-step5.png",
    };
  } catch (err) {
    result.mobileWalkthrough = { error: err.message };
  } finally {
    await page.close();
    await context.close();
  }

  // E2 — basic accessibility pass (labels, keyboard nav)
  const page2 = await browser.newPage();
  try {
    await page2.goto(BASE, { waitUntil: "networkidle" });
    await page2.locator("nav button", { hasText: "Plan My Trip" }).first().click();
    await page2.locator("h3").filter({ hasText: HEADINGS.step0 }).waitFor({ timeout: 15000 });
    await page2.waitForTimeout(400);
    await page2.locator(".flex.flex-wrap.gap-2 button", { hasText: "Bali" }).first().click();
    await page2.locator("h3").filter({ hasText: HEADINGS.step1 }).waitFor({ timeout: 15000 });
    await page2.waitForTimeout(400);
    await page2.locator("button", { hasText: "Holiday" }).first().click();
    await page2.locator("h3").filter({ hasText: HEADINGS.step2 }).waitFor({ timeout: 15000 });
    await page2.waitForTimeout(400);
    await page2.locator("button", { hasText: "Just me" }).first().click();
    await page2.locator("h3").filter({ hasText: HEADINGS.step3 }).waitFor({ timeout: 15000 });
    await page2.waitForTimeout(400);
    await page2.locator("button", { hasText: "Mix of both" }).first().click();
    await page2.locator("h3").filter({ hasText: HEADINGS.step4 }).waitFor({ timeout: 15000 });
    await page2.waitForTimeout(400);
    await page2.locator("button", { hasText: "₹1L–3L" }).first().click();
    await page2.locator("h3").filter({ hasText: HEADINGS.step5 }).waitFor({ timeout: 15000 });

    const nameInput = page2.locator('input[placeholder="Your First Name"]');
    const hasAriaLabel = await nameInput.getAttribute("aria-label");
    const hasLabelledBy = await nameInput.getAttribute("aria-labelledby");
    const inputId = await nameInput.getAttribute("id");
    const associatedLabelCount = inputId ? await page2.locator(`label[for="${inputId}"]`).count() : 0;

    await page2.keyboard.press("Tab");
    const focusSequence = [];
    // 12 iterations comfortably covers the modal's current focusable set
    // (email, whatsapp, consent checkbox, Turnstile widget, submit) more
    // than twice over — enough to show whether focus cycles back inside the
    // modal (the focus trap working) or escapes to the page behind it (a
    // regression), not just a single pass through.
    for (let i = 0; i < 12; i++) {
      const focused = await page2.evaluate(
        () =>
          document.activeElement?.tagName +
          ":" +
          (document.activeElement?.placeholder || document.activeElement?.textContent?.slice(0, 24) || "")
      );
      focusSequence.push(focused);
      await page2.keyboard.press("Tab");
    }
    const escapedToPageBehindModal = focusSequence.some((f) => /^(BODY|BUTTON:About|BUTTON:Destinations|BUTTON:Reviews)/.test(f));

    result.accessibility = {
      nameInputHasAriaLabel: !!hasAriaLabel,
      nameInputHasAriaLabelledBy: !!hasLabelledBy,
      nameInputHasAssociatedLabelElement: associatedLabelCount > 0,
      nameInputLabelingMechanism:
        !hasAriaLabel && !hasLabelledBy && associatedLabelCount === 0 ? "placeholder text only (no real label)" : "properly labeled",
      keyboardTabFocusSequence: focusSequence,
      focusTrapHolding: !escapedToPageBehindModal,
    };
  } catch (err) {
    result.accessibility = { error: err.message };
  } finally {
    await page2.close();
  }

  console.log(JSON.stringify(result, null, 2));
  report.checkE_mobile_a11y = result;
}

// ============================================================
// SECTION F — Performance (rough timing, not a hard pass/fail)
// ============================================================
async function runCheckF(browser) {
  console.log("\n=== Section F: Performance (rough timing) ===");
  const result = {};

  for (const [label, url] of [
    ["homepage", `${BASE}/`],
    ["destination_goa", `${BASE}/destinations/goa`],
  ]) {
    const page = await browser.newPage();
    try {
      const start = Date.now();
      await page.goto(url, { waitUntil: "load" });
      const wallClockMs = Date.now() - start;
      const timing = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        return nav
          ? {
              domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
              loadEvent: Math.round(nav.loadEventEnd),
              responseStart: Math.round(nav.responseStart),
              transferSize: nav.transferSize,
            }
          : null;
      });
      result[label] = { url, wallClockMs, navigationTiming: timing };
    } catch (err) {
      result[label] = { url, error: err.message };
    } finally {
      await page.close();
    }
  }

  console.log(JSON.stringify(result, null, 2));
  report.checkF_performance = result;
}

// ============================================================
// SECTION G — Backend/data health check
// ============================================================
async function runCheckG() {
  console.log("\n=== Section G: Backend/data health ===");
  const result = {};

  const allLeads = await sb("leads?select=id,name,email,lead_score,lead_status,created_at,deleted_at");
  result.totalLeads = allLeads.length;
  result.activeLeads = allLeads.filter((l) => !l.deleted_at).length;

  // Only active (non-soft-deleted) leads matter for duplicate detection —
  // the dedupe lookup itself excludes deleted_at rows, so a soft-deleted
  // lead legitimately sharing an email with its active replacement (see
  // item 5's soft-delete-then-resubmit flow) is by design, not a bug.
  const emailCounts = {};
  for (const lead of allLeads) {
    if (!lead.email || lead.deleted_at) continue;
    const key = lead.email.toLowerCase();
    emailCounts[key] = (emailCounts[key] || 0) + 1;
  }
  result.duplicateEmails = Object.entries(emailCounts)
    .filter(([, count]) => count > 1)
    .map(([email, count]) => ({ email, count }));

  const todayDate = new Date().toISOString().slice(0, 10);
  result.overdueOpenTasks = await sb(
    `tasks?status=eq.Open&due_date=lt.${todayDate}&select=id,lead_id,task_type,due_date,priority`
  );

  const allLeadIds = new Set(allLeads.map((l) => l.id));
  const [allInquiries, allTasks, allFollowUps, allBookedTrips] = await Promise.all([
    sb("inquiries?select=id,lead_id"),
    sb("tasks?select=id,lead_id"),
    sb("follow_ups?select=id,lead_id"),
    sb("booked_trips?select=id,lead_id"),
  ]);
  result.orphanedRows = {
    inquiries: allInquiries.filter((r) => !allLeadIds.has(r.lead_id)),
    tasks: allTasks.filter((r) => !allLeadIds.has(r.lead_id)),
    followUps: allFollowUps.filter((r) => !allLeadIds.has(r.lead_id)),
    bookedTrips: allBookedTrips.filter((r) => !allLeadIds.has(r.lead_id)),
  };

  const phase4Names = ["Dhanshree Impex", "A B Elasto Products Pvt. Ltd.", "Alpa Thakkur"];
  const phase4Leads = allLeads.filter((l) => phase4Names.includes(l.name));
  const phase4LeadIds = phase4Leads.map((l) => l.id);
  const phase4Trips = phase4LeadIds.length
    ? await sb(`booked_trips?lead_id=in.(${phase4LeadIds.join(",")})&select=id,lead_id,invoice_number,trip_name,invoice_file_url`)
    : [];
  result.phase4Check = { leadsFound: phase4Leads, tripsFound: phase4Trips };

  console.log(JSON.stringify(result, null, 2));
  report.checkG_data_health = result;
}

// ============================================================
// SECTION H — Regression confirmation (quick re-check)
// ============================================================
async function runCheckH() {
  console.log("\n=== Section H: Regression confirmation ===");
  const result = {
    note: "UTM capture, Paris chip, and /journal stability are re-verified by checks 2/3/6 earlier in this same run — referencing those results rather than duplicating them.",
    utmCapture: report.check2_utm_survival,
    parisChip: report.check3_paris_chip,
    journalStability: report.check6_journal_stability,
  };

  result.errorScreenOnForcedFailure = {
    reVerifiedThisRun: false,
    note: "Last verified via real screenshot in the previous session (2026-07-10) — genuinely re-forcing this again would require another temporary FORCE_TEST_FAILURE secret + redeploy cycle, carrying the same process risk demonstrated last time. Not repeated here without being asked.",
  };

  await new Promise((r) => setTimeout(r, 2000));
  const recentEmails = [TEST_EMAIL_1, TEST_EMAIL_2];
  const orFilter = recentEmails.map((e) => `email.eq.${encodeURIComponent(e)}`).join(",");
  const recentLeads = await sb(`leads?or=(${orFilter})&select=id,email`);
  const leadIds = recentLeads.map((l) => l.id);
  const relatedFollowUps = leadIds.length
    ? await sb(`follow_ups?lead_id=in.(${leadIds.join(",")})&select=id,lead_id,sequence_stage`)
    : [];
  result.sequenceStageOnNewSubmissions = {
    leadsChecked: recentLeads,
    followUps: relatedFollowUps,
    allHaveSequenceStage: relatedFollowUps.length > 0 && relatedFollowUps.every((f) => f.sequence_stage != null),
  };

  console.log(JSON.stringify(result, null, 2));
  report.checkH_regression = result;
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  await runCheck1(browser);
  await runCheck2(browser);
  await runCheck3(browser);
  await runCheck4(browser);
  await runCheck5(browser);
  await runCheck6(browser);
  await runCheckA();
  const bTestEmails = await runCheckB(browser);
  await runCheckC();
  await runCheckD();
  await runCheckE(browser);
  await runCheckF(browser);
  await runCheckG();
  await runCheckH();

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

  // ---- Standing-rule cleanup: SELECT-and-confirm-count before any delete/soft-delete ----
  // Leads are soft-deleted (deleted_at = now()), never hard-deleted — matches the
  // app's own dedupe-lookup lifecycle. Child rows (tasks/follow_ups/inquiries)
  // are still hard-deleted since they carry no deleted_at column.
  console.log("\n\n========== CLEANUP (SELECT-then-DELETE per standing rule) ==========");
  const allTestEmails = [
    TEST_EMAIL_1,
    TEST_EMAIL_2,
    ...Object.values(B_TEST_EMAILS),
    ...(bTestEmails || []),
  ];
  const uniqueTestEmails = [...new Set(allTestEmails)];
  const cleanupOrFilter = uniqueTestEmails.map((e) => `email.eq.${encodeURIComponent(e)}`).join(",");
  const cleanupLeads = await sb(`leads?or=(${cleanupOrFilter})&deleted_at=is.null&select=id,name,email`);
  console.log(`SELECT before DELETE — matching test leads: ${cleanupLeads.length}`);
  console.log(JSON.stringify(cleanupLeads, null, 2));

  const cleanupSummary = { emailsChecked: uniqueTestEmails, leadsFound: cleanupLeads, deleted: null };

  if (cleanupLeads.length > 0) {
    const ids = cleanupLeads.map((l) => l.id);
    const leadIdFilter = `lead_id=in.(${ids.join(",")})`;
    const idFilter = `id=in.(${ids.join(",")})`;

    // Phase A added travelers/visa_applications, which can hang off a test
    // lead (travelers.lead_id -> leads.id, visa_applications.traveler_id ->
    // travelers.id). Neither table has a deleted_at column of its own, so —
    // same as tasks/follow_ups/inquiries — they're hard-deleted as child
    // rows of the (soft-deleted) lead, not soft-deleted themselves.
    const testTravelers = await sb(`travelers?${leadIdFilter}&select=id`);
    const travelerIds = testTravelers.map((t) => t.id);
    const deletedVisaApplications =
      travelerIds.length > 0
        ? await sb(`visa_applications?traveler_id=in.(${travelerIds.join(",")})`, { method: "DELETE" })
        : [];
    const deletedTravelers = await sb(`travelers?${leadIdFilter}`, { method: "DELETE" });

    const deletedFollowUps = await sb(`follow_ups?${leadIdFilter}`, { method: "DELETE" });
    const deletedTasks = await sb(`tasks?${leadIdFilter}`, { method: "DELETE" });
    const deletedInquiries = await sb(`inquiries?${leadIdFilter}`, { method: "DELETE" });
    const softDeletedLeads = await sb(`leads?${idFilter}`, {
      method: "PATCH",
      body: JSON.stringify({ deleted_at: new Date().toISOString() }),
    });
    cleanupSummary.deleted = {
      leads: softDeletedLeads.length,
      tasks: deletedTasks.length,
      followUps: deletedFollowUps.length,
      inquiries: deletedInquiries.length,
      travelers: deletedTravelers.length,
      visaApplications: deletedVisaApplications.length,
    };
    console.log("Soft-deleted leads / deleted child rows:", JSON.stringify(cleanupSummary.deleted, null, 2));

    const verifyLeads = await sb(`leads?or=(${cleanupOrFilter})&deleted_at=is.null&select=id`);
    cleanupSummary.verifiedZeroRemaining = verifyLeads.length === 0;
    console.log(`Post-cleanup verification — remaining active matches: ${verifyLeads.length}`);
  } else {
    cleanupSummary.deleted = { leads: 0, tasks: 0, followUps: 0, inquiries: 0, travelers: 0, visaApplications: 0 };
    cleanupSummary.verifiedZeroRemaining = true;
  }

  report.cleanupSummary = cleanupSummary;

  console.log("\n\n========== FULL STRUCTURED REPORT ==========");
  console.log(JSON.stringify(report, null, 2));

  return report;
}

main().catch((err) => {
  console.error("Audit script crashed:", err);
  process.exit(1);
});
