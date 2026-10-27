import { cn } from "@/lib/utils";

export type Metric = { label: string; value: string };

/** Stat tiles for a project header: small mono label, large value. */
export function MetricsGrid({
  metrics,
  className,
}: {
  metrics: Metric[];
  className?: string;
}) {
  if (metrics.length === 0) return null;
  const columns =
    metrics.length === 1
      ? "sm:grid-cols-1"
      : metrics.length === 2
        ? "sm:grid-cols-2"
        : metrics.length === 3
          ? "sm:grid-cols-3"
          : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden rounded-2xl border bg-border",
        columns,
        className,
      )}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-card p-5">
          <dt className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            {metric.label}
          </dt>
          <dd className="mt-2 text-lg font-semibold tracking-tight break-words sm:text-xl">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
