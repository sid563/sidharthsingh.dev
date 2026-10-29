import type { Contributions } from "@/lib/github";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * GitHub-style contribution calendar: one column per week, Sunday at the
 * top, colour by GitHub's own quartile level. Server-rendered, no JS; the
 * tooltip is the native title. Phones show the last 26 weeks.
 */
export function ActivityGrid({ data, user }: { data: Contributions; user: string }) {
  const days = [...data.days].sort((a, b) => a.date.localeCompare(b.date));
  if (days.length === 0) return null;

  // Align the first column to a Sunday so weekdays line up as rows.
  const first = new Date(`${days[0].date}T00:00:00Z`);
  const offset = first.getUTCDay();
  const weeks: (typeof days[number] | null)[][] = [];
  days.forEach((day, i) => {
    const index = Math.floor((i + offset) / 7);
    if (!weeks[index]) weeks[index] = Array(7).fill(null);
    weeks[index][(i + offset) % 7] = day;
  });

  const activeDays = days.filter((d) => d.count > 0).length;
  const cutoff = Math.max(0, weeks.length - 26);
  const labels = weeks.map((week) => {
    const firstOfMonth = week.find((d) => d && d.date.endsWith("-01"));
    if (!firstOfMonth) return null;
    return monthShort[new Date(`${firstOfMonth.date}T00:00:00Z`).getUTCMonth()];
  });

  return (
    <figure className="activity">
      <div className="activity-scroll">
        <div className="activity-months" aria-hidden>
          {weeks.map((_, i) => (
            <span key={i} className={cn("activity-month", i < cutoff && "activity-old")}>
              {labels[i] ?? ""}
            </span>
          ))}
        </div>
        <div className="activity-grid" role="img" aria-label={`${data.total} contributions on GitHub in the last year`}>
          {weeks.map((week, i) => (
            <div key={i} className={cn("activity-week", i < cutoff && "activity-old")}>
              {week.map((day, j) =>
                day ? (
                  <span
                    key={day.date}
                    className="activity-day"
                    data-level={day.level}
                    title={`${day.count === 1 ? "1 contribution" : `${day.count} contributions`} on ${formatDate(day.date)}`}
                  />
                ) : (
                  <span key={`empty-${j}`} className="activity-day activity-day-empty" />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground">
        <span>
          <span className="text-foreground">{data.total}</span> contributions in the last year ·{" "}
          <span className="text-foreground">{activeDays}</span> active days · public activity as @{user}; day-job
          commits live in a work account
        </span>
        <span className="flex items-center gap-1.5" aria-hidden>
          Less
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className="activity-day" data-level={level} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}
