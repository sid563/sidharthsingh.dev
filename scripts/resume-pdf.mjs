// Prints the resume page to a PDF using the installed Google Chrome.
// Usage: pnpm start -p 3111 (or BASE=...) then `pnpm resume:pdf`.
// The file is committed, so run this after editing src/data/resume.ts.
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const base = process.env.BASE ?? "http://localhost:3111";
const out = path.join(process.cwd(), "public", "resume", "sidharth-singh-resume.pdf");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 1400 }, colorScheme: "light" });
await page.goto(`${base}/resume`, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.waitForTimeout(300);
fs.mkdirSync(path.dirname(out), { recursive: true });
await page.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false,
});
await browser.close();
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`wrote ${path.relative(process.cwd(), out)} (${kb} KB)`);
