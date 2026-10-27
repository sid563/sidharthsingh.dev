import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { getPage } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { renderMDX } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Now",
  description: "What I am working on, learning and thinking about right now.",
};

export default async function NowPage() {
  const page = getPage("now");
  if (!page) notFound();

  const body = await renderMDX(page.body);

  return (
    <Container>
      <header className="max-w-3xl py-12 sm:py-16">
        <p className="mb-3 font-mono text-xs tracking-wider text-brand uppercase">Now</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{page.data.title}</h1>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Updated {formatDate(page.data.updated)}
        </p>
      </header>
      <article className="prose prose-neutral dark:prose-invert max-w-3xl pb-16">{body}</article>
    </Container>
  );
}
