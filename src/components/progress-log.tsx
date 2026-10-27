import type { ProgressJourney } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type LogEntry = ProgressJourney["log"][number];

/** Vertical timeline of dated notes, newest first. */
export function ProgressLog({ entries }: { entries: LogEntry[] }) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return <p className="text-sm text-muted-foreground">No log entries yet.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l pl-6">
      {sorted.map((entry, index) => (
        <li key={`${entry.date}-${index}`} className="relative">
          <span
            aria-hidden
            className={cn(
              "absolute top-1.5 -left-[29px] size-2.5 rounded-full border-2 border-background",
              index === 0 ? "bg-brand" : "bg-border",
            )}
          />
          <time
            dateTime={entry.date}
            className="font-mono text-xs text-muted-foreground tabular-nums"
          >
            {formatDate(entry.date)}
          </time>
          <p className="mt-1 text-sm leading-relaxed">{entry.note}</p>
        </li>
      ))}
    </ol>
  );
}
