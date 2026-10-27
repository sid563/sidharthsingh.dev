import Link from "next/link";
import { site } from "@/data/site";
import { getPosts, getProgress, getProjects } from "@/lib/content";
import { CommandMenu, type CommandEntry } from "@/components/command-menu";
import { Container } from "@/components/container";
import { MobileNav } from "@/components/mobile-nav";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";

const extraPages = [
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteHeader() {
  const entries: CommandEntry[] = [
    { label: "Home", href: "/", group: "Pages" },
    ...site.nav.map((n) => ({ label: n.label, href: n.href, group: "Pages" as const })),
    ...extraPages.map((n) => ({ label: n.label, href: n.href, group: "Pages" as const })),
    ...getProjects().map((p) => ({
      label: p.data.title,
      href: `/projects/${p.slug}`,
      group: "Projects" as const,
      hint: p.data.org,
    })),
    ...getPosts().map((p) => ({
      label: p.data.title,
      href: `/writing/${p.slug}`,
      group: "Writing" as const,
    })),
    ...getProgress().map((p) => ({
      label: p.data.title,
      href: `/progress/${p.slug}`,
      group: "Progress" as const,
      hint: `${p.data.percent}%`,
    })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
          aria-label={`${site.name}, home`}
        >
          <span className="grid size-7 place-items-center rounded-lg bg-foreground font-mono text-[11px] text-background">
            SS
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>
        <NavLinks items={site.nav} className="hidden md:flex" />
        <div className="flex items-center gap-1">
          <CommandMenu entries={entries} />
          <ThemeToggle />
          <MobileNav items={[...site.nav, ...extraPages]} />
        </div>
      </Container>
    </header>
  );
}
