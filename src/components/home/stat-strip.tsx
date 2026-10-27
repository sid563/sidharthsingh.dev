import { CountUp } from "@/components/home/count-up";

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail?: string;
};

/** Four hairline-divided tiles. Numbers count up on load. */
export function StatStrip({ stats, className }: { stats: readonly Stat[]; className?: string }) {
  return (
    <dl
      className={
        "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border/70 shadow-[0_30px_80px_-50px_rgb(0_0_0/0.35)] sm:grid-cols-4 dark:shadow-[0_30px_80px_-50px_rgb(0_0_0/0.9)] " +
        (className ?? "")
      }
    >
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex flex-col-reverse justify-end gap-1.5 bg-background/90 p-5 backdrop-blur-sm sm:p-6">
          <dt className="text-sm text-muted-foreground">
            {stat.label}
            {stat.detail ? (
              <span className="mt-0.5 block text-xs text-muted-foreground/70">{stat.detail}</span>
            ) : null}
          </dt>
          <dd className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
            <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} delay={0.75 + i * 0.12} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
