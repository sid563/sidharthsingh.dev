import { chromium } from "playwright-core";
import fs from "node:fs";

const base = process.env.BASE ?? "http://localhost:3111";

// Expected project counts come from the content folder, so adding a project
// never breaks this suite. Drafts are hidden in production builds.
const projectsDir = new URL("../content/projects/", import.meta.url);
const byKind = {};
for (const f of fs.readdirSync(projectsDir)) {
  if (!f.endsWith(".mdx")) continue;
  const src = fs.readFileSync(new URL(f, projectsDir), "utf8");
  if (/^draft:\s*true/m.test(src)) continue;
  const kind = (src.match(/^kind:\s*["']?(\w+)/m) ?? [])[1] ?? "unknown";
  byKind[kind] = (byKind[kind] ?? 0) + 1;
}
const expected = {
  all: Object.values(byKind).reduce((a, b) => a + b, 0),
  personal: byKind.personal ?? 0,
  academic: byKind.academic ?? 0,
};
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
const test = async (name, fn) => {
  try {
    await fn();
    results.push(["PASS", name]);
  } catch (e) {
    results.push(["FAIL", `${name} :: ${String(e.message).split("\n")[0].slice(0, 180)}`]);
  }
};

const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "light",
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await ctx.newPage();
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message.slice(0, 160)));
await page.goto(`${base}/`, { waitUntil: "networkidle" });

await test("theme toggle switches to dark, persists across reload, switches back", async () => {
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"), null, { timeout: 3000 });
  await page.reload({ waitUntil: "networkidle" });
  const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  if (!dark) throw new Error("dark theme not persisted after reload");
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await page.waitForFunction(() => !document.documentElement.classList.contains("dark"), null, { timeout: 3000 });
});

await test("Cmd+K opens the palette, typing finds the Kafka journey, selecting navigates", async () => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Meta+k");
  const input = page.locator("[data-slot=command-input]");
  await input.waitFor({ state: "visible", timeout: 3000 });
  await input.fill("kafka");
  const item = page.locator("[data-slot=command-item]", { hasText: "Kafka mastery in Rust" }).first();
  await item.waitFor({ timeout: 3000 });
  await item.click();
  await page.waitForURL(/\/progress\/kafka-mastery$/, { timeout: 5000 });
});

await test("Search button opens the palette and Escape closes it", async () => {
  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open search" }).click();
  await page.locator("[data-slot=command-input]").waitFor({ state: "visible", timeout: 3000 });
  await page.keyboard.press("Escape");
  await page.locator("[data-slot=command-input]").waitFor({ state: "hidden", timeout: 3000 });
});

await test(`project filter tabs narrow the grid (Personal = ${expected.personal}, Academic = ${expected.academic}, All = ${expected.all})`, async () => {
  await page.goto(`${base}/projects`, { waitUntil: "networkidle" });
  const cards = () => page.locator("main a[href^='/projects/']").count();
  if ((await cards()) !== expected.all) throw new Error(`All shows ${await cards()}`);
  await page.getByRole("tab", { name: /Personal/ }).click();
  await page.waitForTimeout(400);
  if ((await cards()) !== expected.personal) throw new Error(`Personal shows ${await cards()}`);
  await page.getByRole("tab", { name: /Academic/ }).click();
  await page.waitForTimeout(400);
  if ((await cards()) !== expected.academic) throw new Error(`Academic shows ${await cards()}`);
});

await test("writing tag filter narrows the list", async () => {
  await page.goto(`${base}/writing`, { waitUntil: "networkidle" });
  const before = await page.locator("main a[href^='/writing/']").count();
  const chip = page.locator("main button[aria-pressed]", { hasText: /postgres/ }).first();
  await chip.click();
  await page.waitForTimeout(300);
  const after = await page.locator("main a[href^='/writing/']").count();
  if (!(after >= 1 && after < before)) throw new Error(`before=${before} after=${after}`);
});

await test("roadmap 'By theme' tab switches the board", async () => {
  await page.goto(`${base}/roadmap`, { waitUntil: "networkidle" });
  await page.getByRole("tab", { name: /theme/i }).click();
  await page.waitForTimeout(300);
  const panel = page.locator("[data-slot=tabs-content]:visible");
  if (!(await panel.getByText("Distributed systems").first().isVisible())) throw new Error("theme grouping not visible");
});

await test("active nav link carries aria-current on /about", async () => {
  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  const cur = (await page.locator("nav[aria-label='Primary'] a[aria-current='page']").textContent())?.trim();
  if (cur !== "About") throw new Error(`aria-current on "${cur}"`);
});

await test("resume print view hides header and footer", async () => {
  await page.goto(`${base}/resume`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  const header = await page.locator("header").first().evaluate((el) => getComputedStyle(el).display);
  const footer = await page.locator("footer").first().evaluate((el) => getComputedStyle(el).display);
  await page.emulateMedia({ media: "screen" });
  if (header !== "none" || footer !== "none") throw new Error(`header=${header} footer=${footer}`);
});

await test("contact page copy-email button reports Copied", async () => {
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(`${base}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /copy/i }).first().click();
  await page.getByText(/copied/i).first().waitFor({ timeout: 3000 });
});

await test("chat widget streams an answer from the chat API (mocked)", async () => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const handler = async (route) => {
    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type, x-chat-key",
    };
    if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: cors });
    const body = [
      'data: {"type":"sources","sources":["experience"]}',
      'data: {"type":"token","text":"Sidharth works at **1buy.ai** in Delhi, on the "}',
      'data: {"type":"token","text":"order-fulfilment backend."}',
      'data: {"type":"done","provider":"mock"}',
      "",
    ].join("\n\n");
    return route.fulfill({ status: 200, headers: { ...cors, "content-type": "text/event-stream" }, body });
  };
  await page.route("**/api/chat/stream", handler);
  try {
    await page.getByRole("button", { name: "Ask about me" }).click();
    const dialog = page.getByRole("dialog", { name: /Ask about/ });
    await dialog.waitFor({ timeout: 3000 });
    const input = dialog.getByLabel("Your question");
    await input.fill("Where does Sidharth work?");
    await input.press("Enter");
    await dialog.locator("strong", { hasText: "1buy.ai" }).waitFor({ timeout: 5000 });
    await dialog.getByText("from experience").waitFor({ timeout: 3000 });
    // the conversation survives navigation within the tab
    await page.goto(`${base}/about`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Ask about me" }).click();
    const again = page.getByRole("dialog", { name: /Ask about/ });
    await again.locator("strong", { hasText: "1buy.ai" }).waitFor({ timeout: 3000 });
    await again.getByRole("button", { name: "Clear" }).click();
    await again.getByText("Ask about my work, projects").waitFor({ timeout: 3000 });
    await page.keyboard.press("Escape");
    await again.waitFor({ state: "hidden", timeout: 3000 });
  } finally {
    await page.unroute("**/api/chat/stream", handler);
  }
});

await test("OG image is a PNG and sitemap lists content routes", async () => {
  const og = await page.request.get(`${base}/opengraph-image`);
  if (!og.headers()["content-type"]?.startsWith("image/png")) throw new Error(`og content-type ${og.headers()["content-type"]}`);
  const xml = await (await page.request.get(`${base}/sitemap.xml`)).text();
  for (const p of ["/projects/go-job-scheduler", "/writing/learning-postgres-from-the-inside", "/progress/kafka-mastery", "/now", "/resume", "/roadmap"]) {
    if (!xml.includes(p)) throw new Error(`sitemap missing ${p}`);
  }
});

await test("every internal link on every page resolves (crawl)", async () => {
  const seen = new Set();
  const queue = ["/"];
  const bad = [];
  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await page.goto(base + path, { waitUntil: "domcontentloaded" });
    if (!res || res.status() >= 400) { bad.push(`${path} -> ${res?.status()}`); continue; }
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
    for (let h of hrefs) {
      if (!h || !h.startsWith("/")) continue;
      h = h.split("#")[0].split("?")[0];
      if (h && !seen.has(h)) queue.push(h);
    }
  }
  results.push(["INFO", `crawled ${seen.size} internal pages: ${[...seen].join(" ")}`]);
  if (bad.length) throw new Error(bad.join(", "));
});
await test("keyboard: g then w goes to Work, ? opens the shortcuts dialog", async () => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.keyboard.press("g");
  await page.keyboard.press("w");
  await page.waitForURL(/\/projects$/, { timeout: 5000 });
  await page.keyboard.press("?");
  const dialog = page.getByRole("dialog", { name: "Keyboard shortcuts" });
  await dialog.waitFor({ state: "visible", timeout: 3000 });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 3000 });
});

await test("every project card and page carries a system sketch with moving packets", async () => {
  await page.goto(`${base}/projects`, { waitUntil: "networkidle" });
  const cards = await page.locator("main a[href^='/projects/']").count();
  const thumbs = await page.locator("main a[href^='/projects/'] svg.sketch").count();
  if (thumbs !== cards) throw new Error(`${thumbs} sketches for ${cards} cards`);
  await page.goto(`${base}/projects/go-job-scheduler`, { waitUntil: "networkidle" });
  const packets = await page.locator("svg.sketch-full .sketch-packet").count();
  if (packets === 0) throw new Error("no packets on the project page sketch");
});

await test("code blocks get a copy button that reports Copied", async () => {
  await page.goto(`${base}/projects/inbound-mail-agents`, { waitUntil: "networkidle" });
  const button = page.locator(".code-block-copy").first();
  await button.hover();
  await button.click();
  await page.waitForSelector(".code-block-copy[data-copied]", { timeout: 3000 });
});

await test("every project, post and journey has its own OG image, and pages point at it", async () => {
  for (const route of ["/projects/go-job-scheduler", "/writing/learning-postgres-from-the-inside", "/progress/kafka-mastery"]) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    const og = await page.locator("meta[property='og:image']").first().getAttribute("content");
    if (!og || !og.includes(`${route}/opengraph-image`)) throw new Error(`${route}: og:image is ${og}`);
    // og:image is absolute on the production host; fetch the same path from the server under test.
    const local = new URL(og);
    const res = await page.request.get(`${base}${local.pathname}${local.search}`);
    const type = res.headers()["content-type"] ?? "";
    if (!res.ok() || !type.startsWith("image/png")) throw new Error(`${og}: ${res.status()} ${type}`);
  }
});

await test("resume offers the generated PDF for download", async () => {
  await page.goto(`${base}/resume`, { waitUntil: "networkidle" });
  const href = await page.locator("a[download]").first().getAttribute("href");
  if (!href) throw new Error("no download link");
  const res = await page.request.get(`${base}${href}`);
  const type = res.headers()["content-type"] ?? "";
  if (!res.ok() || !type.includes("pdf")) throw new Error(`${href}: ${res.status()} ${type}`);
});

await test("progress page shows the GitHub activity calendar", async () => {
  await page.goto(`${base}/progress`, { waitUntil: "networkidle" });
  const cells = await page.locator(".activity-grid .activity-day").count();
  if (cells < 300) throw new Error(`only ${cells} day cells`);
});

await test("404 suggests the closest real route", async () => {
  await page.goto(`${base}/projects/go-job-schedule`, { waitUntil: "networkidle" });
  await page.locator(".not-found-log a[href='/projects/go-job-scheduler']").waitFor({ state: "visible", timeout: 3000 });
});

await test("footer shows the local time and a Source link, but no commit hash", async () => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => /\d{2}:\d{2} IST/.test(document.querySelector("footer")?.textContent ?? ""), null, { timeout: 3000 });
  const source = await page.locator("footer a", { hasText: "Source" }).count();
  const commits = await page.locator("footer a[href*='/commit/']").count();
  if (source !== 1 || commits !== 0) throw new Error(`source=${source} commit links=${commits}`);
});

await ctx.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark", isMobile: true, hasTouch: true });
const mp = await mobile.newPage();
mp.on("pageerror", (e) => pageErrors.push("mobile: " + e.message.slice(0, 160)));
await test("mobile menu opens and navigates to Roadmap", async () => {
  await mp.goto(`${base}/`, { waitUntil: "networkidle" });
  await mp.getByRole("button", { name: "Open menu" }).click();
  const link = mp.locator("[data-slot=sheet-content] a", { hasText: "Roadmap" });
  await link.waitFor({ state: "visible", timeout: 3000 });
  await link.click();
  await mp.waitForURL(/\/roadmap$/, { timeout: 5000 });
});
await test("mobile: desktop nav hidden, menu button visible, no horizontal scroll on home", async () => {
  await mp.goto(`${base}/`, { waitUntil: "networkidle" });
  const navVisible = await mp.locator("nav[aria-label='Primary']").isVisible();
  const menuVisible = await mp.getByRole("button", { name: "Open menu" }).isVisible();
  const { sw, cw } = await mp.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  if (navVisible || !menuVisible || sw > cw) throw new Error(`nav=${navVisible} menu=${menuVisible} ${sw}>${cw}`);
});
await mobile.close();
await browser.close();

for (const [s, n] of results) console.log(`${s.padEnd(5)} ${n}`);
if (pageErrors.length) console.log("page errors:\n  " + [...new Set(pageErrors)].join("\n  "));
const fails = results.filter(([s]) => s === "FAIL").length;
console.log(fails ? `\n${fails} FAILED` : "\nall interaction tests passed");
process.exit(fails ? 1 : 0);
