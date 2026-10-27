import Link from "next/link";
import type { Entry, Post } from "@/lib/content";
import { cn } from "@/lib/utils";

type SeriesNavProps = {
  name: string;
  parts: Entry<Post>[];
  currentSlug: string;
  className?: string;
};

/** Multi-part writing: a compact list of every part with the current one marked. */
export function SeriesNav({ name, parts, currentSlug, className }: SeriesNavProps) {
  const index = parts.findIndex((p) => p.slug === currentSlug);
  return (
    <nav aria-label={`Series: ${name}`} className={cn("rounded-2xl border bg-card p-5", className)}>
      <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-mono text-xs tracking-wider text-brand uppercase">Series</span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          Part {index + 1} of {parts.length}
        </span>
      </p>
      <p className="mt-1 font-medium tracking-tight">{name}</p>
      <ol className="mt-3 space-y-1.5 text-sm">
        {parts.map((part, i) => {
          const current = part.slug === currentSlug;
          return (
            <li key={part.slug} className="flex items-baseline gap-3">
              <span className="w-4 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">{i + 1}</span>
              {current ? (
                <span aria-current="page" className="font-medium">
                  {part.data.title}
                </span>
              ) : (
                <Link
                  href={`/writing/${part.slug}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {part.data.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
