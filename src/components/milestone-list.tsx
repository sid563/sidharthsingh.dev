import { CheckIcon } from "lucide-react";
import type { ProgressJourney } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Milestone = ProgressJourney["milestones"][number];

/** Ordered checklist: filled brand check for done items, hollow ring for pending. */
export function MilestoneList({ milestones }: { milestones: Milestone[] }) {
  if (milestones.length === 0) {
    return <p className="text-sm text-muted-foreground">No milestones defined yet.</p>;
  }

  return (
    <ol className="space-y-2">
      {milestones.map((milestone, index) => (
        <li
          key={`${index}-${milestone.title}`}
          className="flex items-start gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm"
        >
          <span
            aria-hidden
            className={cn(
              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
              milestone.done
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-background",
            )}
          >
            {milestone.done ? <CheckIcon className="size-3" strokeWidth={3} /> : null}
          </span>
          <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <span className={milestone.done ? "text-foreground" : "text-muted-foreground"}>
              {milestone.title}
            </span>
            {milestone.date ? (
              <time
                dateTime={milestone.date}
                className="font-mono text-[11px] text-muted-foreground tabular-nums"
              >
                {formatDate(milestone.date)}
              </time>
            ) : null}
          </span>
          <span className="sr-only">{milestone.done ? "Done" : "Pending"}</span>
        </li>
      ))}
    </ol>
  );
}
