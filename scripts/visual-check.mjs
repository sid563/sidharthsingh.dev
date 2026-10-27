import { chromium } from "playwright-core";
import fs from "node:fs";

const base = process.env.BASE ?? "http://localhost:3111";
const out = new URL("../.checks/", import.meta.url).pathname;
fs.mkdirSync(out, { recursive: true });
const routes = [
  "/", "/about", "/projects", "/projects/tokio-job-scheduler", "/writing",
  "/writing/learning-postgres-from-the-inside", "/roadmap", "/progress",
  "/progress/postgres-internals", "/now", "/contact", "/resume", "/nope",
];
const modes = [
  ["desktop-light", { width: 1440, height: 900 }, "light"],
  ["desktop-dark", { width: 1440, height: 900 }, "dark"],
  ["mobile-light", { width: 390, height: 844 }, "light"],
  ["mobile-dark", { width: 390, height: 844 }, "dark"],
];
const only = process.argv.slice(2); // optional mode filter

const browser = await chromium.launch({ channel: "chrome", headless: true });
let problems = 0;
for (const [name, viewport, colorScheme] of modes) {
  if (only.length && !only.includes(name)) continue;
  const ctx = await browser.newContext({ viewport, colorScheme, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const logs = new Set();
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") logs.add(`${m.type()}: ${m.text().slice(0, 220)}`);
  });
  page.on("pageerror", (e) => logs.add(`pageerror: ${e.message.slice(0, 220)}`));
  for (const r of routes) {
    const res = await page.goto(base + r, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    // Scroll through in steps. At every step, any reveal block whose top is
    // at least 170px above the viewport bottom has passed its range and must
    // be fully opaque. Blocks still below the fold are allowed to be hidden.
    await page.waitForTimeout(900);
    const violations = await page.evaluate(async () => {
      const bad = [];
      const h = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      for (let y = 0; y <= h; y += 250) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
        for (const el of document.querySelectorAll(".reveal-view, .reveal-item, .reveal-load")) {
          const top = el.getBoundingClientRect().top;
          if (vh - top >= 170) {
            const o = parseFloat(getComputedStyle(el).opacity);
            if (o < 0.98) bad.push(`${el.className.split(" ").slice(0, 2).join(".")}@scroll${y} top=${Math.round(top)} o=${o}`);
          }
        }
        if (bad.length > 5) break;
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 150));
      return bad;
    });
    if (violations.length) { problems++; console.log(`    REVEAL STUCK on ${r}: ` + violations.slice(0, 5).join(", ")); }
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const cw = de.clientWidth, sw = de.scrollWidth;
      const over = [];
      if (sw > cw) {
        for (const el of document.querySelectorAll("body *")) {
          const b = el.getBoundingClientRect();
          if (b.right > cw + 1 && b.width > 0) {
            const cls = typeof el.className === "string" ? el.className.split(" ").slice(0, 4).join(".") : "";
            over.push(`${el.tagName.toLowerCase()}.${cls} right=${Math.round(b.right)} w=${Math.round(b.width)}`);
            if (over.length >= 6) break;
          }
        }
      }
      const theme = de.classList.contains("dark") ? "dark" : "light";
      return { cw, sw, over, theme };
    });
    const flag = m.sw > m.cw ? `OVERFLOW ${m.sw}>${m.cw}` : "ok";
    if (m.sw > m.cw) problems++;
    console.log(`${name.padEnd(13)} ${String(res?.status()).padEnd(4)} ${r.padEnd(44)} ${flag}  theme=${m.theme}`);
    for (const o of m.over) console.log(`    ${o}`);
    if (r !== "/nope") {
      const file = `${out}${name}${r === "/" ? "_home" : r.replace(/\//g, "_")}.png`;
      // Page-tall viewport so scroll-driven reveals are complete in the capture.
      const sh = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.setViewportSize({ width: viewport.width, height: Math.min(sh, 8000) });
      await page.waitForTimeout(300);
      await page.screenshot({ path: file });
      await page.setViewportSize(viewport);
    }
  }
  if (logs.size) {
    console.log(`${name} console:`);
    for (const l of [...logs].slice(0, 12)) console.log(`    ${l}`);
  }
  await ctx.close();
}
await browser.close();
console.log(problems ? `\n${problems} overflow problem(s)` : "\nno overflow anywhere");
fs.writeFileSync(`${out}.done`, String(Date.now()));
