import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PrevNextItem = {
  href: string;
  title: string;
  /** Small label above the title, e.g. "Previous project" or "Older". */
  eyebrow?: string;
};

const cardClass =
  "group flex h-full flex-col gap-1.5 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/** Neighbour navigation at the bottom of a detail page. */
export function PrevNext({
  prev,
  next,
  className,
}: {
  prev?: PrevNextItem | null;
  next?: PrevNextItem | null;
  className?: string;
}) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Neighbouring pages" className={cn("grid gap-3 sm:grid-cols-2", className)}>
      <div>
        {prev ? (
          <Link href={prev.href} className={cardClass}>
            <span className="flex items-center gap-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              <ArrowLeftIcon className="size-3 transition-transform group-hover:-translate-x-0.5" />
              {prev.eyebrow ?? "Previous"}
            </span>
            <span className="font-medium tracking-tight">{prev.title}</span>
          </Link>
        ) : null}
      </div>
      <div>
        {next ? (
          <Link href={next.href} className={cn(cardClass, "sm:items-end sm:text-right")}>
            <span className="flex items-center gap-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              {next.eyebrow ?? "Next"}
              <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="font-medium tracking-tight">{next.title}</span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
