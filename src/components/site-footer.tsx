import Link from "next/link";
import { execSync } from "node:child_process";
import { ArrowUpIcon, ArrowUpRightIcon } from "lucide-react";
import { site } from "@/data/site";
import { getLastUpdated } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Container } from "@/components/container";
import { LocalTime } from "@/components/local-time";

const columns = [
  {
    title: "Work",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Writing", href: "/writing" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Progress", href: "/progress" },
    ],
  },
  {
    title: "Me",
    links: [
      { label: "About", href: "/about" },
      { label: "Resume", href: "/resume" },
      { label: "Now", href: "/now" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

const linkClass = "text-muted-foreground transition-colors hover:text-foreground";

/** The commit this build came from: Vercel sets it; locally we ask git. */
function commitSha(): string | null {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null;
  }
}

export function SiteFooter() {
  const updated = getLastUpdated();
  const year = new Date().getUTCFullYear();
  const sha = commitSha();

  return (
    <footer className="mt-16 border-t">
      <Container className="py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="space-y-3">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{column.title}</p>
              <ul className="space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="space-y-3">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Elsewhere</p>
            <ul className="space-y-2 text-sm">
              {site.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className={`group inline-flex items-center gap-1 ${linkClass}`}
                  >
                    {social.label}
                    <ArrowUpRightIcon className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-2">
            <span>
              © {year} {site.name}
            </span>
            <span aria-hidden>·</span>
            <span>{site.location}</span>
            <span aria-hidden>·</span>
            <LocalTime />
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>Updated {formatDate(updated)}</p>
            {sha ? (
              <a
                href={`${site.repo}/commit/${sha}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono transition-colors hover:text-foreground"
                title="The commit this build came from"
              >
                {sha.slice(0, 7)}
              </a>
            ) : null}
            <a href={site.repo} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
              Source
            </a>
            <span className="hidden md:inline">
              Press <kbd className="rounded border bg-muted px-1 py-px font-mono text-[10px]">?</kbd> for shortcuts
            </span>
            <a href="#top" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
              Back to top
              <ArrowUpIcon className="size-3" aria-hidden />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
