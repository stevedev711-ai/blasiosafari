/**
 * End-to-end checks against a running build.
 *
 *   npm run build && npm start            # preview mode (default)
 *   BASE=http://localhost:3000 npm run test:e2e
 *
 * Live-mode checks (confirmation + delivery) run when MODE=live and a mock
 * webhook is listening at MOCK_WEBHOOK_PORT (see README, "Testing").
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright"); // install with: npm i -D playwright && npx playwright install chromium
import fs from "node:fs";

const BASE = process.env.BASE || "http://localhost:3000";
const MODE = process.env.MODE || "preview";
const SHOTS = process.env.SHOTS; // directory for screenshots, optional
const results = [];
const ok = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};
const step = async (name, fn) => {
  try {
    await fn();
  } catch (e) {
    ok(name, false, e.message.split("\n")[0]);
  }
};

const PAGES = [
  "/",
  "/journeys",
  "/journeys/private-migration-circuit",
  "/journeys/rhino-and-big-cat-journey",
  "/destinations",
  "/destinations/maasai-mara",
  "/destinations/lewa-laikipia",
  "/destinations/chyulu-hills",
  "/experiences",
  "/our-approach",
  "/journal",
  "/journal/choosing-an-exclusive-use-safari-house-in-kenya",
  "/journal/when-a-private-charter-makes-sense",
  "/private-consultation",
  "/private-safari-kenya",
  "/privacy",
  "/cookies",
  "/image-credits",
];

const browser = await chromium.launch();

// ---------- Pages, metadata, links ----------
await step("pages", async () => {
  const page = await browser.newPage();
  const titles = new Set();
  const links = new Set();
  for (const p of PAGES) {
    const res = await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
    const title = await page.title();
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    const h1 = await page.locator("h1").count();
    const og = await page.locator('meta[property="og:title"]').count();
    const robots = await page.locator('meta[name="robots"]').getAttribute("content").catch(() => null);
    ok(`page ${p}`, res.status() === 200 && h1 === 1 && !!desc && og === 1, `status ${res.status()}, h1=${h1}`);
    if (titles.has(title)) ok(`unique title ${p}`, false, title);
    titles.add(title);
    if (MODE !== "live") ok(`noindex in preview ${p}`, (robots || "").includes("noindex"));
    for (const href of await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")))) links.add(href.split("#")[0]);
  }
  ok("all titles unique", titles.size === PAGES.length, `${titles.size}/${PAGES.length}`);
  let broken = [];
  for (const l of links) {
    const r = await fetch(BASE + l);
    if (r.status !== 200) broken.push(`${l}:${r.status}`);
  }
  ok("internal links resolve", broken.length === 0, `${links.size} links${broken.length ? "; broken " + broken.join(", ") : ""}`);
  const nf = await fetch(BASE + "/no-such-page");
  ok("404 page", nf.status === 404);
  const robots = await (await fetch(BASE + "/robots.txt")).text();
  ok("robots.txt matches mode", MODE === "live" ? robots.includes("Sitemap") : robots.includes("Disallow: /"));
  const sm = await (await fetch(BASE + "/sitemap.xml")).text();
  ok("sitemap lists pages, excludes paid landing page", sm.includes("/journeys/private-migration-circuit") && !sm.includes("private-safari-kenya"));
  const hdr = (await fetch(BASE + "/")).headers.get("x-robots-tag");
  if (MODE !== "live") ok("X-Robots-Tag noindex header in preview", (hdr || "").includes("noindex"));
  await page.close();
});

// ---------- Desktop navigation ----------
await step("desktop nav", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/");
  for (const [label, path] of [["Journeys", "/journeys"], ["Destinations", "/destinations"], ["Our Approach", "/our-approach"]]) {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label, exact: true }).click();
    await page.waitForURL(BASE + path);
    ok(`primary nav → ${label}`, page.url() === BASE + path);
  }
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Request a Private Consultation" }).click();
  await page.waitForURL(/private-consultation/);
  ok("primary nav → consultation carries origin", page.url().includes("from=%2Four-approach"));
  // keyboard: skip link
  const fresh = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await fresh.goto(BASE + "/journeys");
  await fresh.keyboard.press("Tab");
  const skip = await fresh.evaluate(() => document.activeElement?.textContent);
  await fresh.close();
  ok("skip link is first tab stop", skip === "Skip to content");
  await page.close();
});

// ---------- Mobile menu ----------
await step("mobile menu", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(BASE + "/");
  const toggle = page.locator(".menu-toggle");
  ok("mobile toggle visible, desktop nav hidden", (await toggle.isVisible()) && !(await page.getByRole("navigation", { name: "Primary" }).isVisible()));
  await toggle.click();
  ok("menu opens with aria-expanded", (await toggle.getAttribute("aria-expanded")) === "true" && (await page.locator("#mobile-menu").isVisible()));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/mobile-menu.png` });
  await page.keyboard.press("Escape");
  ok("Escape closes menu", (await toggle.getAttribute("aria-expanded")) === "false");
  await toggle.click();
  await page.locator("#mobile-menu").getByRole("link", { name: "Destinations", exact: true }).click();
  await page.waitForURL(BASE + "/destinations");
  ok("mobile menu link navigates and closes", !(await page.locator("#mobile-menu").isVisible()));
  await page.close();
});

// ---------- Itinerary links ----------
await step("itineraries", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + "/");
  await page.getByRole("link", { name: "The Private Migration Circuit: view the sample journey" }).click();
  await page.waitForURL(/private-migration-circuit/);
  const days = await page.locator(".day").count();
  const nights = await page.locator(".nights-table tbody tr").count();
  ok("home → Migration Circuit: days and nights", days >= 7 && nights === 3, `${days} day rows, ${nights} regions`);
  ok("sample label and conditions present", (await page.getByText("This is a sample journey").count()) > 0);
  await page.getByRole("link", { name: /Rhino & Big Cat Journey/ }).first().click();
  await page.waitForURL(/rhino-and-big-cat-journey/);
  ok("cross-link to Rhino journey", (await page.locator("h1").textContent()).includes("Rhino"));
  await page.locator(".cta-band").getByRole("link", { name: "Request a Private Consultation" }).click();
  await page.waitForURL(/private-consultation/);
  ok("journey CTA prefills context", (await page.locator(".context-chip").textContent()).includes("Rhino & Big Cat Journey"));
  await page.close();
});

// ---------- Responsive layout ----------
await step("responsive", async () => {
  for (const [w, h] of [[390, 844], [768, 1024], [1440, 900]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const overflow = [];
    for (const p of PAGES) {
      await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > w + 1) overflow.push(`${p} (${sw}px)`);
    }
    ok(`no horizontal scroll at ${w}px`, overflow.length === 0, overflow.join(", "));
    await page.close();
  }
});

// ---------- Consultation flow ----------
async function fillToStep5(page, { contactMethod = "email" } = {}) {
  await page.getByLabel("A family trip").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("A family, possibly several generations").check();
  await page.getByLabel("Approximate number of travellers").selectOption("5-8");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Flexible. Advise us on timing").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("group", { name: /Travel between regions/ }).getByLabel("I'd like your advice").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Your name").fill("Test Guest");
  await page.getByRole("textbox", { name: "Email" }).fill("guest@example.com");
  if (contactMethod !== "email") await page.getByRole("radio", { name: contactMethod === "whatsapp" ? "WhatsApp" : "Phone call" }).check();
}

await step("form", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + "/journeys?utm_source=google&utm_medium=cpc&utm_campaign=private-kenya&gclid=TEST123", { waitUntil: "networkidle" });
  await page.goto(BASE + "/private-consultation?journey=private-migration-circuit&from=/journeys/private-migration-circuit");

  if (MODE !== "live") ok("preview form labelled as test", (await page.getByText("Test form").count()) === 1);
  ok("progress shows step 1 of 5", (await page.getByText("Step 1 of 5").count()) === 1);

  // validation step 1
  await page.getByRole("button", { name: "Continue" }).click();
  ok("step 1 requires a reason", (await page.locator(".error-summary").textContent()).includes("bringing you to Kenya"));
  ok("still on step 1", (await page.getByText("Step 1 of 5").count()) === 1);
  await page.getByLabel("Something else").check();
  await page.getByRole("button", { name: "Continue" }).click();
  ok("'other' requires detail", (await page.locator(".error-summary").textContent()).includes("tell us a little"));
  await page.getByLabel("In a few words", { exact: true }).fill("A milestone birthday");
  await page.getByRole("button", { name: "Continue" }).click();

  // step 2
  await page.getByRole("button", { name: "Continue" }).click();
  ok("step 2 requires party and size", (await page.locator(".error-summary li").count()) === 2);
  await page.getByLabel("A couple").check();
  await page.getByLabel("Approximate number of travellers").selectOption("2");
  await page.getByLabel("I'm a travel advisor planning for a client").check();
  ok("advisor option reveals company field", await page.getByLabel(/Company or agency/).isVisible());
  await page.getByRole("button", { name: "Continue" }).click();

  // step 3 date validation
  await page.getByLabel("Specific dates").check();
  await page.getByLabel("From", { exact: true }).fill("2027-08-20");
  await page.getByLabel("To", { exact: true }).fill("2027-08-10");
  await page.getByRole("button", { name: "Continue" }).click();
  ok("date range validated", (await page.locator(".error-summary").textContent()).includes("after the start date"));
  await page.getByLabel("To", { exact: true }).fill("2027-08-29");
  await page.getByRole("button", { name: "Continue" }).click();

  // step 4 prefilled from journey
  ok("journey context prefilled region", await page.getByRole("group", { name: /Regions you're drawn to/ }).getByLabel("Maasai Mara").isChecked());
  await page.getByRole("group", { name: /Experiences/ }).getByLabel("A balloon flight").check();
  await page.getByRole("group", { name: /Experiences/ }).getByLabel("I'd like your advice").check();
  ok("advice is exclusive in multi-select", !(await page.getByRole("group", { name: /Experiences/ }).getByLabel("A balloon flight").isChecked()));
  await page.getByRole("button", { name: "Continue" }).click();

  // back keeps answers
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByRole("button", { name: "Back" }).click();
  ok("back preserves step 3 answers", (await page.getByLabel("To", { exact: true }).inputValue()) === "2027-08-29");
  await page.getByRole("button", { name: "Back" }).click();
  ok("back preserves step 2 answers", await page.getByLabel("A couple").isChecked());
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Continue" }).click();
  ok("returned to step 5", (await page.getByText("Step 5 of 5").count()) === 1);

  // step 5 validation
  await page.getByRole("radio", { name: "WhatsApp" }).check();
  await page.getByRole("button", { name: /Send test enquiry|Request a Private Consultation/ }).click();
  const alertText = await page.locator(".error-summary").textContent();
  ok("name, email required; phone required for WhatsApp", alertText.includes("name") && alertText.includes("email") && alertText.includes("WhatsApp"));
  await page.getByLabel("Your name").fill("Test Guest");
  await page.getByRole("textbox", { name: "Email" }).fill("not-an-email");
  await page.getByLabel(/Phone or WhatsApp number/).fill("+44 20 7946 0000");
  await page.getByRole("button", { name: /Send test enquiry|Request a Private Consultation/ }).click();
  ok("email format validated", (await page.locator(".error-summary").textContent()).includes("valid email"));
  await page.getByRole("textbox", { name: "Email" }).fill("guest@example.com");
  await page.getByRole("textbox", { name: "Email" }).fill("guest@example.com");
  await page.waitForTimeout(4200); // minimum completion time

  // submission failure
  await page.route("**/api/consultation", (r) => r.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ ok: false, code: "delivery_failed", message: "We couldn't send your enquiry." }) }));
  await page.getByRole("button", { name: /Send test enquiry|Request a Private Consultation/ }).click();
  await page.getByText("Your enquiry hasn't been sent").waitFor();
  ok("failure shows retry path", await page.getByRole("button", { name: "Try again" }).isVisible());
  ok("failure keeps answers", (await page.getByLabel("Your name").inputValue()) === "Test Guest");
  ok("no confirmation on failure", (await page.getByText(/Thank you|Test enquiry not sent/).count()) === 0);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/form-failure.png`, fullPage: false });
  await page.unroute("**/api/consultation");

  // network failure
  await page.route("**/api/consultation", (r) => r.abort());
  await page.getByRole("button", { name: "Try again" }).click();
  await page.waitForTimeout(500);
  ok("network failure handled", await page.getByRole("button", { name: "Try again" }).isVisible());
  await page.unroute("**/api/consultation");

  // real submission (retry)
  const reqP = page.waitForRequest("**/api/consultation");
  await page.getByRole("button", { name: "Try again" }).click();
  const req = await reqP;
  const body = req.postDataJSON();
  ok(
    "payload carries source page, journey and campaign",
    body.sourcePage === "/journeys/private-migration-circuit" && body.journey.includes("Private Migration Circuit") && body.attribution?.utm_campaign === "private-kenya" && body.attribution?.gclid === "TEST123",
    `${body.sourcePage} | ${body.journey} | ${JSON.stringify(body.attribution)}`,
  );
  if (MODE === "live") {
    await page.getByText(/Thank you, Test/).waitFor();
    ok("live confirmation shown after accepted submission", true);
  } else {
    await page.getByText("Test enquiry not sent.").waitFor();
    ok("preview result explains nothing was sent", (await page.getByText(/Thank you/).count()) === 0);
  }
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/form-result-${MODE}.png` });
  await page.close();
});

// ---------- Landing page form ----------
await step("landing", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto(BASE + "/private-safari-kenya?utm_source=google&utm_medium=cpc&utm_campaign=lp-test&utm_term=private+safari+kenya");
  ok("landing page noindex", ((await page.locator('meta[name="robots"]').getAttribute("content")) || "").includes("noindex"));
  await page.getByRole("link", { name: "Request a Private Consultation" }).first().click();
  await fillToStep5(page, { contactMethod: "email" });
  await page.waitForTimeout(4200);
  const reqP = page.waitForRequest("**/api/consultation");
  await page.getByRole("button", { name: /Send test enquiry|Request a Private Consultation/ }).click();
  const body = (await reqP).postDataJSON();
  ok("landing submission keeps campaign + source", body.attribution?.utm_campaign === "lp-test" && body.sourcePage === "/private-safari-kenya", JSON.stringify(body.attribution));
  await page.getByText(MODE === "live" ? /Thank you/ : "Test enquiry not sent.").waitFor();
  ok("landing submission completes", true);
  await page.close();
});

// ---------- API ----------
await step("api", async () => {
  const bad = await fetch(BASE + "/api/consultation", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ purpose: "x" }) });
  const badBody = await bad.json();
  ok("API rejects invalid payload with field errors", bad.status === 422 && !!badBody.fieldErrors?.email);
  const spam = await fetch(BASE + "/api/consultation", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ purpose: "general", partyType: "couple", partySize: "2", timing: "flexible", name: "Bot", email: "bot@example.com", website: "http://spam", startedAt: Date.now() - 10000 }),
  });
  const sb = await spam.json();
  ok("honeypot submissions are not delivered", spam.status === 200 && sb.delivered === false);
});

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed (${MODE} mode)`);
if (process.env.REPORT) fs.writeFileSync(process.env.REPORT, JSON.stringify(results, null, 2));
process.exit(failed.length ? 1 : 0);
