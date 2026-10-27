import Link from "next/link";
import type { Entry, Post } from "@/lib/content";
import { postTypeLabel } from "@/lib/writing";
import { formatDate, readingTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PostCard({ post, className }: { post: Entry<Post>; className?: string }) {
  const { slug, data, body } = post;
  return (
    <Link
      href={`/writing/${slug}`}
      className={cn(
        "group -mx-4 flex flex-col gap-2 rounded-xl px-4 py-4 transition-colors hover:bg-muted/60 sm:flex-row sm:items-baseline sm:gap-8",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <time
        dateTime={data.date}
        className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums sm:w-24"
      >
        {formatDate(data.date)}
      </time>
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="font-medium tracking-tight transition-colors group-hover:text-foreground">
          {data.title}
          {data.draft ? (
            <Badge variant="outline" className="ml-2 align-middle text-[10px] text-warning">
              Draft
            </Badge>
          ) : null}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{data.summary}</p>
        <p className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-muted-foreground">
          <span className={cn(data.type !== "article" && "text-brand")}>{postTypeLabel[data.type]}</span>
          <span aria-hidden>·</span>
          <span>{readingTime(body)}</span>
          {data.series ? (
            <span>
              · {data.series.name}, part {data.series.part}
            </span>
          ) : null}
          {data.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
      </div>
    </Link>
  );
}
