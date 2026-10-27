import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/container";
import { NotFoundSuggestions, type Route } from "@/components/not-found-suggestions";
import { site } from "@/data/site";
import { getPosts, getProgress, getProjects } from "@/lib/content";

export default function NotFound() {
  const routes: Route[] = [
    { href: "/", label: "Home" },
    ...site.nav.map((n) => ({ href: n.href, label: n.label })),
    { href: "/now", label: "Now" },
    { href: "/contact", label: "Contact" },
    ...getProjects().map((p) => ({ href: `/projects/${p.slug}`, label: p.data.title })),
    ...getPosts().map((p) => ({ href: `/writing/${p.slug}`, label: p.data.title })),
    ...getProgress().map((p) => ({ href: `/progress/${p.slug}`, label: p.data.title })),
  ];

  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <div className="max-w-2xl">
        <p className="font-mono text-xs tracking-wider text-brand uppercase">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page does not exist.</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The link may be old, or I moved the page while refining the site.
        </p>
        <div className="mt-8">
          <NotFoundSuggestions routes={routes} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={buttonVariants()}>
            Home
          </Link>
          <Link href="/projects" className={buttonVariants({ variant: "outline" })}>
            Work
          </Link>
          <Link href="/writing" className={buttonVariants({ variant: "outline" })}>
            Writing
          </Link>
        </div>
      </div>
    </Container>
  );
}
