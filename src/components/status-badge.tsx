import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusLabel, type Status } from "@/lib/status";

const styles: Record<Status, string> = {
  idea: "bg-muted text-muted-foreground",
  planned: "bg-info-soft text-info",
  "in-progress": "bg-brand-soft text-brand",
  paused: "bg-warning-soft text-warning",
  shipped: "bg-success-soft text-success",
};

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border-transparent", styles[status], className)}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full bg-current",
          status === "in-progress" && "animate-pulse",
        )}
      />
      {statusLabel[status]}
    </Badge>
  );
}
