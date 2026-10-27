import Link from "next/link";
import { ArrowUpIcon, ArrowUpRightIcon } from "lucide-react";
import { site } from "@/data/site";
import { getLastUpdated } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Container } from "@/components/container";

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

export function SiteFooter() {
  const updated = getLastUpdated();
  const year = new Date().getUTCFullYear();

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
          <p>
            © {year} {site.name} · {site.location}
          </p>
          <div className="flex items-center gap-5">
            <p>Last updated {formatDate(updated)}</p>
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
