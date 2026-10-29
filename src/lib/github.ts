import "server-only";

/**
 * GitHub contribution calendar for the progress page, fetched at build time.
 *
 * Preferred source: GitHub's GraphQL API, when GITHUB_TOKEN is set in the
 * build environment (any token with no scopes will do). Fallback: the
 * public calendar API at github-contributions-api.jogruber.de, which
 * scrapes the same graph GitHub shows on a profile. Either failing returns
 * null and the section simply does not render; the build never breaks.
 */
export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; days: ContributionDay[]; source: "graphql" | "public" };

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
  const res = await fetch("https://api.github.com/graphql", {
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
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`);
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
  try {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const viaGraphQL = await fromGraphQL(user, token);
      if (viaGraphQL) return viaGraphQL;
    }
    return await fromPublicApi(user);
  } catch (error) {
    console.warn(`[github] contributions unavailable for ${user}:`, error instanceof Error ? error.message : error);
    return null;
  }
}
