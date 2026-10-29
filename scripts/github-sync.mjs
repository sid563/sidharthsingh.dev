// Refreshes content/github-contributions.json, the committed snapshot the
// progress page falls back to when the build cannot reach GitHub.
// Usage: pnpm github:sync   (optionally GITHUB_TOKEN=... for the GraphQL source)
import fs from "node:fs";
import path from "node:path";

const user = process.argv[2] ?? "sid563";
const out = path.join(process.cwd(), "content", "github-contributions.json");

const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, {
  headers: { "User-Agent": "sidharthsingh.dev build (github-sync)" },
});
if (!res.ok) throw new Error(`calendar API responded ${res.status}`);
const json = await res.json();
const days = json.contributions.map((d) => ({ date: d.date, count: d.count, level: Math.max(0, Math.min(4, d.level)) }));
const total = json.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);
fs.writeFileSync(out, JSON.stringify({ user, fetchedAt: new Date().toISOString().slice(0, 10), total, days }, null, 0) + "\n");
console.log(`wrote ${path.relative(process.cwd(), out)}: ${total} contributions, ${days.length} days, as of ${days.at(-1)?.date}`);
