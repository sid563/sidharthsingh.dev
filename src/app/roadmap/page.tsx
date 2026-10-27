import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { Container } from "@/components/container";
import { SpotlightGroup } from "@/components/spotlight";
import { PageHeader } from "@/components/page-header";
import { RoadmapBoard } from "@/components/roadmap-board";
import { StatusBadge } from "@/components/status-badge";
import {
  getRoadmap,
  getRoadmapThemes,
  statusLabel,
  statusOrder,
  type Entry,
  type RoadmapItem,
  type Status,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What I plan to build and learn next, grouped by status and theme, with timeframes instead of dates.",
};

/** Column headings read better in the plural for ideas. */
const columnLabel: Record<Status, string> = { ...statusLabel, idea: "Ideas" };

const dotClass: Record<Status, string> = {
  idea: "bg-muted-foreground",
  planned: "bg-info",
  "in-progress": "bg-brand",
  paused: "bg-warning",
  shipped: "bg-success",
};

type RoadmapEntry = Entry<RoadmapItem>;

export default function RoadmapPage() {
  const items = getRoadmap();
  const themes = getRoadmapThemes();
  const updated = items.map((i) => i.data.updated).sort().at(-1);

  const byStatus = statusOrder
    .map((status) => ({ status, items: items.filter((i) => i.data.status === status) }))
    .filter((group) => group.items.length > 0);

  const byTheme = themes
    .map((theme) => ({ theme, items: items.filter((i) => i.data.theme === theme) }))
    .filter((group) => group.items.length > 0);

  return (
    <Container>
      <PageHeader
        eyebrow="Roadmap"
        title="What I plan to build and learn"
        description="Grouped by theme and status rather than pinned to dates. Timeframes are deliberately loose; the statuses are kept honest. Shipped items link to their project or progress page."
      >
        {updated ? (
          <p className="font-mono text-xs text-muted-foreground">Updated {formatDate(updated)}</p>
        ) : null}
      </PageHeader>

      {items.length === 0 ? (
        <p className="pb-16 text-muted-foreground">Nothing on the roadmap yet.</p>
      ) : (
        <div className="pb-16">
          <SpotlightGroup>
            <RoadmapBoard
              legend={<Legend />}
              statusView={<StatusColumns groups={byStatus} />}
              themeView={<ThemeGroups groups={byTheme} />}
            />
          </SpotlightGroup>
        </div>
      )}
    </Container>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Status legend">
      {statusOrder.map((status) => (
        <li key={status} className="inline-flex items-center gap-1.5">
          <span aria-hidden className={cn("size-1.5 rounded-full", dotClass[status])} />
          {columnLabel[status]}
        </li>
      ))}
    </ul>
  );
}

function StatusColumns({ groups }: { groups: { status: Status; items: RoadmapEntry[] }[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <section key={group.status} aria-labelledby={`status-${group.status}`} className="space-y-3">
          <h2
            id={`status-${group.status}`}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <span aria-hidden className={cn("size-2 rounded-full", dotClass[group.status])} />
            {columnLabel[group.status]}
            <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
              {group.items.length}
            </span>
          </h2>
          <ul className="space-y-3">
            {group.items.map((item) => (
              <li key={item.slug}>
                <RoadmapCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ThemeGroups({ groups }: { groups: { theme: string; items: RoadmapEntry[] }[] }) {
  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.theme} aria-labelledby={`theme-${slugify(group.theme)}`}>
          <h2
            id={`theme-${slugify(group.theme)}`}
            className="mb-4 flex items-baseline gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase"
          >
            {group.theme}
            <span className="tabular-nums">{group.items.length}</span>
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <li key={item.slug}>
                <RoadmapCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function RoadmapCard({ item }: { item: RoadmapEntry }) {
  const { data } = item;
  const hasLinks = data.progress || data.project || data.links.length > 0;

  return (
    <article
      data-spotlight
      className="spotlight-card relative flex h-full flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={data.status} />
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          {data.theme}
        </span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground tabular-nums">
          {data.timeframe}
        </span>
      </div>
      <h3 className="font-medium leading-snug">{data.title}</h3>
      <p className="text-sm text-muted-foreground">{data.summary}</p>
      {hasLinks ? (
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm">
          {data.progress ? (
            <Link
              href={`/progress/${data.progress}`}
              className="group inline-flex items-center gap-1 text-brand hover:underline underline-offset-4"
            >
              Track progress
              <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null}
          {data.project ? (
            <Link
              href={`/projects/${data.project}`}
              className="group inline-flex items-center gap-1 text-foreground hover:underline underline-offset-4"
            >
              See project
              <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null}
          {data.links.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                {link.label}
                <ArrowRightIcon className="size-3.5" />
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                {link.label}
                <ArrowUpRightIcon className="size-3.5" />
              </a>
            ),
          )}
        </div>
      ) : null}
    </article>
  );
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
