import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import type { Entry, Project } from "@/lib/content";
import { formatMonth } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { SystemSketch } from "@/components/sketch/system-sketch";
import { Badge } from "@/components/ui/badge";

type ProjectCardProps = {
  /** Only slug + frontmatter are needed, so client components can pass serialisable data. */
  project: Pick<Entry<Project>, "slug" | "data">;
  featured?: boolean;
  className?: string;
};

export function ProjectCard({ project, featured = false, className }: ProjectCardProps) {
  const { slug, data } = project;
  return (
    <Link
      href={`/projects/${slug}`}
      data-spotlight
      className={cn(
        "spotlight-card group relative flex h-full flex-col justify-between gap-6 rounded-2xl border bg-card p-6 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.18)] dark:hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.7)]",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <div className="space-y-3">
        {data.diagram ? (
          <div className="sketch-thumb" aria-hidden>
            <SystemSketch spec={data.diagram} title={`${data.title}: system sketch`} size="card" packets={1} speed={3.4} />
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>{data.org ?? (data.kind === "work" ? "Work" : data.kind === "personal" ? "Personal" : "Academic")}</span>
            <span aria-hidden>·</span>
            <time dateTime={data.date}>{formatMonth(data.date)}</time>
          </div>
          <StatusBadge status={data.status} />
        </div>
        <h3 className={cn("font-semibold tracking-tight", featured ? "text-xl" : "text-lg")}>
          {data.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{data.summary}</p>
      </div>
      <div className="flex items-end justify-between gap-4">
        <ul className="flex flex-wrap gap-1.5">
          {data.stack.slice(0, featured ? 6 : 4).map((item) => (
            <li key={item}>
              <Badge variant="secondary" className="font-mono text-[11px] font-normal">
                {item}
              </Badge>
            </li>
          ))}
        </ul>
        <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}
