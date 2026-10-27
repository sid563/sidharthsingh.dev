import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowUpRightIcon, MapIcon } from "lucide-react";
import { Container } from "@/components/container";
import { MilestoneList } from "@/components/milestone-list";
import { ProgressLog } from "@/components/progress-log";
import { ProgressMeter } from "@/components/progress-meter";
import { StatusBadge } from "@/components/status-badge";
import { getProgress, getProgressItem, getRoadmap } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { renderMDX } from "@/lib/mdx";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getProgress().map((journey) => ({ slug: journey.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const journey = getProgressItem(slug);
  if (!journey) return { title: "Not found" };
  return {
    title: journey.data.title,
    description: journey.data.summary,
  };
}

export default async function ProgressJourneyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const journey = getProgressItem(slug);
  if (!journey) notFound();

  const { data } = journey;
  const roadmapItem = getRoadmap().find((item) => item.data.progress === slug) ?? null;
  const body = journey.body.trim() ? await renderMDX(journey.body) : null;
  const done = data.milestones.filter((m) => m.done).length;

  return (
    <Container>
      <header className="py-12 sm:py-16">
        <Link
          href="/progress"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          All journeys
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusBadge status={data.status} />
          {roadmapItem ? (
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <MapIcon className="size-3.5" />
              Part of roadmap: {roadmapItem.data.title}
            </Link>
          ) : null}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{data.title}</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{data.summary}</p>

        <div className="mt-8 rounded-xl border bg-card p-5 sm:p-6">
          <ProgressMeter value={data.percent} size="lg" label="Overall progress" />
          {data.target ? (
            <p className="mt-4 text-sm">
              <span className="font-medium">Done means: </span>
              <span className="text-muted-foreground">{data.target}</span>
            </p>
          ) : null}
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground tabular-nums">
            <div>
              <dt className="inline">Started </dt>
              <dd className="inline text-foreground">{formatDate(data.started)}</dd>
            </div>
            <div>
              <dt className="inline">Updated </dt>
              <dd className="inline text-foreground">{formatDate(data.updated)}</dd>
            </div>
            <div>
              <dt className="inline">Milestones </dt>
              <dd className="inline text-foreground">
                {done} / {data.milestones.length}
              </dd>
            </div>
            {data.repo ? (
              <div>
                <dt className="sr-only">Repository</dt>
                <dd className="inline">
                  <a
                    href={data.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-foreground transition-colors hover:text-brand"
                  >
                    Repository
                    <ArrowUpRightIcon className="size-3" />
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      <div className="grid gap-12 pb-12 lg:grid-cols-2 lg:gap-10">
        <section aria-labelledby="milestones-heading">
          <h2 id="milestones-heading" className="mb-4 text-xl font-semibold tracking-tight">
            Milestones
          </h2>
          <MilestoneList milestones={data.milestones} />
        </section>
        <section aria-labelledby="log-heading">
          <h2 id="log-heading" className="mb-4 text-xl font-semibold tracking-tight">
            Log
          </h2>
          <ProgressLog entries={data.log} />
        </section>
      </div>

      {body ? (
        <article className="prose prose-neutral dark:prose-invert max-w-3xl pb-16">{body}</article>
      ) : null}
    </Container>
  );
}
