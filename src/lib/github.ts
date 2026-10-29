import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * GitHub contribution calendar for the progress page, fetched at build time.
 *
 * Sources, in order: GitHub's GraphQL API when GITHUB_TOKEN is set in the
 * build environment (a token with no scopes will do); the public calendar
 * API at github-contributions-api.jogruber.de, which scrapes the graph a
 * profile shows; and finally the committed snapshot written by
 * `pnpm github:sync`, so a build with no network to either still renders
 * the section. Only if all three fail does the section disappear.
 */
export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; days: ContributionDay[]; source: "graphql" | "public" | "snapshot" };

const SNAPSHOT = path.join(process.cwd(), "content", "github-contributions.json");

/** Hard cap so a slow API never stalls the build. */
async function fetchWithTimeout(url: string, init: RequestInit = {}, ms = 15_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function fromSnapshot(user: string): Contributions | null {
  if (!fs.existsSync(SNAPSHOT)) return null;
  const json = JSON.parse(fs.readFileSync(SNAPSHOT, "utf8")) as {
    user?: string;
    total: number;
    days: ContributionDay[];
  };
  if (json.user && json.user !== user) return null;
  return { total: json.total, days: json.days, source: "snapshot" };
}

const levelFromName: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fromGraphQL(user: string, token: string): Promise<Contributions | null> {
  const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar {
    totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
  const res = await fetchWithTimeout("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: user } }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
          };
        };
      };
    };
  };
  const calendar = json.data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) return null;
  const days = calendar.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: levelFromName[d.contributionLevel] ?? 0,
    })),
  );
  return { total: calendar.totalContributions, days, source: "graphql" };
}

async function fromPublicApi(user: string): Promise<Contributions | null> {
  const res = await fetchWithTimeout(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, {
    headers: { "User-Agent": "sidharthsingh.dev build" },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    total?: Record<string, number>;
    contributions?: { date: string; count: number; level: number }[];
  };
  if (!json.contributions?.length) return null;
  const days = json.contributions.map((d) => ({
    date: d.date,
    count: d.count,
    level: Math.max(0, Math.min(4, d.level)) as ContributionDay["level"],
  }));
  const total = json.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);
  return { total, days, source: "public" };
}

export async function getContributions(user: string): Promise<Contributions | null> {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    try {
      const viaGraphQL = await fromGraphQL(user, token);
      if (viaGraphQL) return viaGraphQL;
    } catch (error) {
      console.warn(`[github] GraphQL failed for ${user}:`, error instanceof Error ? error.message : error);
    }
  }
  try {
    const viaPublic = await fromPublicApi(user);
    if (viaPublic) return viaPublic;
  } catch (error) {
    console.warn(`[github] public calendar API failed for ${user}:`, error instanceof Error ? error.message : error);
  }
  const snapshot = fromSnapshot(user);
  if (snapshot) console.warn(`[github] using the committed snapshot for ${user}`);
  return snapshot;
}
