import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { getProject, getProjects, type Project } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { formatMonth } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Container } from "@/components/container";
import { MetricsGrid } from "@/components/metrics-grid";
import { PrevNext } from "@/components/prev-next";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

const kindLabel: Record<Project["kind"], string> = {
  work: "Work",
  personal: "Personal",
  academic: "Academic",
};

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.data.title,
    description: project.data.summary,
    openGraph: {
      type: "article",
      title: project.data.title,
      description: project.data.summary,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { data, body } = project;
  const all = getProjects();
  const index = all.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const content = await renderMDX(body);

  const meta = [
    data.org ? { label: "Organisation", value: data.org } : null,
    data.role ? { label: "Role", value: data.role } : null,
    { label: "Date", value: formatMonth(data.date), dateTime: data.date },
    { label: "Kind", value: kindLabel[data.kind] },
  ].filter((item) => item !== null);

  return (
    <>
      <Container>
        <div className="pt-8 sm:pt-12">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
            All projects
          </Link>
        </div>

        <header className="py-8 sm:py-10">
          <StatusBadge status={data.status} />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{data.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{data.summary}</p>

          <dl className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs text-muted-foreground">
            {meta.map((item, i) => (
              <div key={item.label} className="flex items-center gap-x-3">
                {i > 0 ? <span aria-hidden>·</span> : null}
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  {"dateTime" in item && item.dateTime ? (
                    <time dateTime={item.dateTime}>{item.value}</time>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <MetricsGrid metrics={data.metrics} className="mt-8" />

          {data.stack.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Stack">
              {data.stack.map((item) => (
                <li key={item}>
                  <Badge variant="secondary" className="font-mono text-[11px] font-normal">
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}

          {data.links.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {data.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  {link.label}
                  <ExternalLinkIcon data-icon="inline-end" />
                </a>
              ))}
            </div>
          ) : null}
        </header>
      </Container>

      <Container>
        <article className="prose prose-neutral dark:prose-invert max-w-3xl">{content}</article>
        <PrevNext
          className="mt-16"
          prev={
            prev
              ? { href: `/projects/${prev.slug}`, title: prev.data.title, eyebrow: "Previous project" }
              : null
          }
          next={
            next
              ? { href: `/projects/${next.slug}`, title: next.data.title, eyebrow: "Next project" }
              : null
          }
        />
      </Container>
    </>
  );
}
