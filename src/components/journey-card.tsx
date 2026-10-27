import Link from "next/link";
import { ProgressMeter } from "@/components/progress-meter";
import { StatusBadge } from "@/components/status-badge";
import type { ProgressJourney } from "@/lib/content";
import { formatDate, formatMonth } from "@/lib/format";

type JourneyCardProps = {
  slug: string;
  journey: ProgressJourney;
};

/** Summary card for a learning journey; the whole card is the link. */
export function JourneyCard({ slug, journey }: JourneyCardProps) {
  const done = journey.milestones.filter((m) => m.done).length;
  const total = journey.milestones.length;

  return (
    <Link
      href={`/progress/${slug}`}
      data-spotlight
      className="spotlight-card group relative flex h-full flex-col gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium leading-snug decoration-foreground/30 underline-offset-4 group-hover:underline">
          {journey.title}
        </h3>
        <StatusBadge status={journey.status} className="shrink-0" />
      </div>
      <p className="line-clamp-3 text-sm text-muted-foreground">{journey.summary}</p>
      <div className="mt-auto space-y-3">
        <ProgressMeter value={journey.percent} size="sm" label="Progress" />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground tabular-nums">
          <span>
            {done} of {total} milestones
          </span>
          <span>
            Started {formatMonth(journey.started)} · Updated {formatDate(journey.updated)}
          </span>
        </div>
      </div>
    </Link>
  );
}
