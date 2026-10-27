import { chromium } from "playwright-core";

const base = process.env.BASE ?? "http://localhost:3111";
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

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
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

await test("project filter tabs narrow the grid (Personal = 1, Academic = 1, All = 6)", async () => {
  await page.goto(`${base}/projects`, { waitUntil: "networkidle" });
  const cards = () => page.locator("main a[href^='/projects/']").count();
  if ((await cards()) !== 6) throw new Error(`All shows ${await cards()}`);
  await page.getByRole("tab", { name: /Personal/ }).click();
  await page.waitForTimeout(400);
  if ((await cards()) !== 1) throw new Error(`Personal shows ${await cards()}`);
  await page.getByRole("tab", { name: /Academic/ }).click();
  await page.waitForTimeout(400);
  if ((await cards()) !== 1) throw new Error(`Academic shows ${await cards()}`);
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

await test("OG image is a PNG and sitemap lists content routes", async () => {
  const og = await page.request.get(`${base}/opengraph-image`);
  if (!og.headers()["content-type"]?.startsWith("image/png")) throw new Error(`og content-type ${og.headers()["content-type"]}`);
  const xml = await (await page.request.get(`${base}/sitemap.xml`)).text();
  for (const p of ["/projects/tokio-job-scheduler", "/writing/learning-postgres-from-the-inside", "/progress/kafka-mastery", "/now", "/resume", "/roadmap"]) {
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
