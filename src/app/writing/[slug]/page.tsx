import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowUpIcon, ArrowUpRightIcon, PencilLineIcon } from "lucide-react";
import { getPost, getPosts, getRelatedPosts, getSeries } from "@/lib/content";
import { postTypeLabel } from "@/lib/writing";
import { renderMDX } from "@/lib/mdx";
import { extractToc } from "@/lib/toc";
import { formatDate, readingTime } from "@/lib/format";
import { site } from "@/data/site";
import { Container } from "@/components/container";
import { PostCard } from "@/components/post-card";
import { PrevNext } from "@/components/prev-next";
import { ReadingProgress } from "@/components/writing/reading-progress";
import { SeriesNav } from "@/components/writing/series-nav";
import { Toc } from "@/components/writing/toc";
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
      modifiedTime: post.data.updated ?? post.data.date,
      tags: post.data.tags,
    },
  };
}

/**
 * Article template. One column of long-form text with a sticky "On this
 * page" rail on large screens, a reading-progress hairline, series
 * navigation for multi-part writing, related posts by shared tag and
 * neighbour links. Notes skip the rail: they are short by definition.
 */
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { data, body } = post;
  const all = getPosts();
  const index = all.findIndex((item) => item.slug === slug);
  // Posts are newest first, so index + 1 is older and index - 1 is newer.
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const newer = index > 0 ? all[index - 1] : null;

  const content = await renderMDX(body);
  const headings = data.type === "note" ? [] : extractToc(body);
  const showToc = headings.length >= 3;
  const series = data.series ? getSeries(data.series.name) : [];
  const related = getRelatedPosts(slug, 3);
  const updated = data.updated && data.updated !== data.date ? data.updated : null;
  const sourceUrl = `${site.repo}/blob/main/content/writing/${slug}.mdx`;

  return (
    <>
      <ReadingProgress />
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

        <div className={showToc ? "lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-14" : undefined}>
          <div className="min-w-0">
            <header className="max-w-3xl py-8 sm:py-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                <span className="text-brand">{postTypeLabel[data.type]}</span>
                <span aria-hidden>·</span>
                <time dateTime={data.date}>{formatDate(data.date)}</time>
                <span aria-hidden>·</span>
                <span>{readingTime(body)}</span>
                {updated ? (
                  <>
                    <span aria-hidden>·</span>
                    <span>
                      Updated <time dateTime={updated}>{formatDate(updated)}</time>
                    </span>
                  </>
                ) : null}
                {data.draft ? (
                  <>
                    <span aria-hidden>·</span>
                    <Badge variant="outline" className="text-[10px] text-warning">
                      Draft
                    </Badge>
                  </>
                ) : null}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {data.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
                {data.summary}
              </p>
              {data.tags.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tags">
                  {data.tags.map((tag) => (
                    <li key={tag}>
                      <Link href={`/writing?tag=${encodeURIComponent(tag)}`}>
                        <Badge variant="secondary" className="font-mono text-[11px] font-normal">
                          #{tag}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </header>

            {data.series && series.length > 1 ? (
              <SeriesNav name={data.series.name} parts={series} currentSlug={slug} className="mb-8 max-w-3xl" />
            ) : null}

            {showToc ? <Toc headings={headings} variant="inline" className="mb-8 max-w-3xl lg:hidden" /> : null}

            <article className="prose prose-neutral dark:prose-invert max-w-3xl">{content}</article>

            <footer className="mt-12 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-t pt-6 text-sm">
              <p className="text-muted-foreground">
                Spotted a mistake?{" "}
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1 text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-brand"
                >
                  <PencilLineIcon className="size-3.5" aria-hidden />
                  Edit this page on GitHub
                  <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </p>
              <a href="#top" className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                Back to top
                <ArrowUpIcon className="size-3.5" aria-hidden />
              </a>
            </footer>

            {related.length > 0 ? (
              <section aria-labelledby="related-heading" className="mt-12 max-w-3xl">
                <h2 id="related-heading" className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  Related
                </h2>
                <div className="mt-2 divide-y divide-border/60">
                  {related.map((item) => (
                    <PostCard key={item.slug} post={item} />
                  ))}
                </div>
              </section>
            ) : null}

            <PrevNext
              className="mt-12 max-w-3xl"
              prev={older ? { href: `/writing/${older.slug}`, title: older.data.title, eyebrow: "Older" } : null}
              next={newer ? { href: `/writing/${newer.slug}`, title: newer.data.title, eyebrow: "Newer" } : null}
            />
          </div>

          {showToc ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 pt-10">
                <Toc headings={headings} />
              </div>
            </aside>
          ) : null}
        </div>
      </Container>
    </>
  );
}
