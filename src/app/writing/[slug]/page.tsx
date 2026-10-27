import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import { getPost, getPosts } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { formatDate, readingTime } from "@/lib/format";
import { site } from "@/data/site";
import { Container } from "@/components/container";
import { PrevNext } from "@/components/prev-next";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.data.title,
    description: post.data.summary,
    openGraph: {
      type: "article",
      title: post.data.title,
      description: post.data.summary,
      publishedTime: post.data.date,
      tags: post.data.tags,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { data, body } = post;
  // Posts are newest first, so index + 1 is older and index - 1 is newer.
  const all = getPosts();
  const index = all.findIndex((item) => item.slug === slug);
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const newer = index > 0 ? all[index - 1] : null;
  const content = await renderMDX(body);

  return (
    <Container>
      <div className="pt-8 sm:pt-12">
        <Link
          href="/writing"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
          All writing
        </Link>
      </div>

      <header className="max-w-3xl py-8 sm:py-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
          <time dateTime={data.date}>{formatDate(data.date)}</time>
          <span aria-hidden>·</span>
          <span>{readingTime(body)}</span>
          {data.draft ? (
            <>
              <span aria-hidden>·</span>
              <Badge variant="outline" className="text-[10px] text-warning">
                Draft
              </Badge>
            </>
          ) : null}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{data.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{data.summary}</p>
        {data.tags.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tags">
            {data.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="secondary" className="font-mono text-[11px] font-normal">
                  #{tag}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <article className="prose prose-neutral dark:prose-invert max-w-3xl">{content}</article>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-sm">
        <Link
          href="/writing"
          className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
          All writing
        </Link>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          More on GitHub
          <ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </footer>

      <PrevNext
        className="mt-10"
        prev={older ? { href: `/writing/${older.slug}`, title: older.data.title, eyebrow: "Older" } : null}
        next={newer ? { href: `/writing/${newer.slug}`, title: newer.data.title, eyebrow: "Newer" } : null}
      />
    </Container>
  );
}
