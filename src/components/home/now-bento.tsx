import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import type { ContentPage, Entry, Post, ProgressJourney, Project } from "@/lib/content";
import { site } from "@/data/site";
import { formatDate, readingTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { FadeInItem, FadeInStagger } from "@/components/fade-in";
import { SpotlightGroup } from "@/components/spotlight";
import { ProgressMeter } from "@/components/progress-meter";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";

type BentoCardProps = {
  href: string;
  eyebrow: string;
  meta?: string;
  className?: string;
  children: React.ReactNode;
};

function BentoCard({ href, eyebrow, meta, className, children }: BentoCardProps) {
  return (
    <Link
      href={href}
      data-spotlight
      className={cn(
        "spotlight-card group relative flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.18)] dark:hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.7)]",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
        <span className="tracking-wider text-brand uppercase">{eyebrow}</span>
        <span className="flex items-center gap-2">
          {meta ? <span className="truncate">{meta}</span> : null}
          <ArrowUpRightIcon className="size-4 shrink-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </span>
      </div>
      {children}
    </Link>
  );
}

type NowBentoProps = {
  now: Entry<ContentPage> | null;
  project: Entry<Project> | null;
  journey: Entry<ProgressJourney> | null;
  journeys: Entry<ProgressJourney>[];
  post: Entry<Post> | null;
};

/** "Right now" grid: a live snapshot pulled from the content collections. */
export function NowBento({ now, project, journey, journeys, post }: NowBentoProps) {
  const nextMilestone = journey?.data.milestones.find((m) => !m.done) ?? null;

  return (
    <SpotlightGroup>
    <FadeInStagger className="grid gap-4 md:grid-cols-6" faster>
      <FadeInItem className="md:col-span-2">
        <BentoCard
          href="/now"
          eyebrow="Now"
          meta={now ? `Updated ${formatDate(now.data.updated)}` : undefined}
        >
          <dl className="space-y-3 text-sm">
            {project ? (
              <div>
                <dt className="text-xs text-muted-foreground">Building</dt>
                <dd className="mt-0.5 font-medium">{project.data.title}</dd>
              </div>
            ) : null}
            {journeys.length > 0 ? (
              <div>
                <dt className="text-xs text-muted-foreground">Learning</dt>
                <dd className="mt-0.5 font-medium">
                  {journeys
                    .slice(0, 2)
                    .map((j) => j.data.title)
                    .join(" · ")}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs text-muted-foreground">Based in</dt>
              <dd className="mt-0.5 font-medium">{site.location}</dd>
            </div>
          </dl>
        </BentoCard>
      </FadeInItem>

      {project ? (
        <FadeInItem className="md:col-span-4">
          <BentoCard
            href={`/projects/${project.slug}`}
            eyebrow={project.data.status === "in-progress" ? "Building" : "Latest work"}
            meta={project.data.org}
          >
            <div className="flex flex-1 flex-col justify-between gap-5">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">{project.data.title}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {project.data.summary}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={project.data.status} />
                {project.data.stack.slice(0, 4).map((item) => (
                  <Badge key={item} variant="secondary" className="font-mono text-[11px] font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </BentoCard>
        </FadeInItem>
      ) : null}

      {journey ? (
        <FadeInItem className="md:col-span-3">
          <BentoCard
            href={`/progress/${journey.slug}`}
            eyebrow="Learning"
            meta={`Updated ${formatDate(journey.data.updated)}`}
          >
            <div className="flex flex-1 flex-col justify-between gap-5">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight">{journey.data.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{journey.data.summary}</p>
              </div>
              <div className="space-y-2">
                <ProgressMeter value={journey.data.percent} label="Progress" />
                {nextMilestone ? (
                  <p className="truncate text-xs text-muted-foreground">
                    Next: {nextMilestone.title}
                  </p>
                ) : null}
              </div>
            </div>
          </BentoCard>
        </FadeInItem>
      ) : null}

      {post ? (
        <FadeInItem className="md:col-span-3">
          <BentoCard href={`/writing/${post.slug}`} eyebrow="Writing" meta={formatDate(post.data.date)}>
            <div className="flex flex-1 flex-col justify-between gap-5">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight">{post.data.title}</h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">{post.data.summary}</p>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {readingTime(post.body)}
                {post.data.tags.length > 0 ? ` · ${post.data.tags.map((t) => `#${t}`).join(" ")}` : ""}
              </p>
            </div>
          </BentoCard>
        </FadeInItem>
      ) : null}
    </FadeInStagger>
    </SpotlightGroup>
  );
}
