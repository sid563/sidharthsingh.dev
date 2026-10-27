import { cn } from "@/lib/utils";

type ProgressMeterProps = {
  value: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Server-safe progress bar in the brand colour. */
export function ProgressMeter({
  value,
  label,
  showValue = true,
  size = "md",
  className,
}: ProgressMeterProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={cn("space-y-1.5", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-3 text-sm">
          {label ? <span className="font-medium">{label}</span> : <span />}
          {showValue ? (
            <span className="font-mono text-xs text-muted-foreground tabular-nums">{pct}%</span>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          size === "sm" && "h-1",
          size === "md" && "h-1.5",
          size === "lg" && "h-2.5",
        )}
      >
        <div
          className="meter-fill h-full rounded-full bg-brand transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
