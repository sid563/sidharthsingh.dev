import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon, CompassIcon, GaugeIcon } from "lucide-react";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { FadeIn } from "@/components/fade-in";
import { ExpertiseMatrix } from "@/components/expertise-matrix";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { site } from "@/data/site";
import { resume } from "@/data/resume";
import { formatRange } from "@/lib/format";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a ${site.role.toLowerCase()} based in ${site.location}. ${site.tagline}`,
};

const beyond = [
  {
    href: "/roadmap",
    icon: CompassIcon,
    title: "Roadmap",
    text: "Future projects and visions, each with a status and a timeframe, never an exact date.",
  },
  {
    href: "/progress",
    icon: GaugeIcon,
    title: "Progress",
    text: "Learning journeys with honest percentages, milestones and a dated log.",
  },
];

export default function AboutPage() {
  return (
    <Container>
      <PageHeader eyebrow="About" title={site.name} description={`${site.role} · ${site.location}`} />

      <FadeIn>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5 text-base leading-relaxed sm:text-lg">
            {site.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className="self-start rounded-2xl border bg-card p-6 lg:sticky lg:top-24">
            <dl className="space-y-5 text-sm">
              <div>
                <dt className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Location</dt>
                <dd className="mt-1">{site.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Currently</dt>
                <dd className="mt-1">{site.role}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Education</dt>
                {resume.education.map((edu) => (
                  <dd key={edu.school} className="mt-1">
                    <p>{edu.degree}</p>
                    <p className="text-muted-foreground">
                      {edu.school}, {formatRange(edu.start, edu.end)}
                    </p>
                  </dd>
                ))}
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Elsewhere</dt>
                <dd className="mt-1">
                  <ul className="space-y-1.5">
                    {site.socials.map((social) => (
                      <li key={social.href}>
                        <a
                          href={social.href}
                          target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1 transition-colors hover:text-brand"
                        >
                          {social.label}
                          <span className="font-mono text-xs text-muted-foreground">{social.handle}</span>
                          <ArrowUpRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </FadeIn>

      <ExpertiseMatrix />
      <ExperienceTimeline />

      <Section
        eyebrow="Beyond work"
        title="Learning in public"
        description="A resume is a snapshot. These two pages are the moving picture."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {beyond.map(({ href, icon: Icon, title, text }) => (
            <Link
              key={href}
              href={href}
              className="group flex gap-4 rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon className="size-5" />
              </span>
              <span className="space-y-1">
                <span className="flex items-center gap-1 font-semibold tracking-tight">
                  {title}
                  <ArrowUpRightIcon className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </span>
                <span className="block text-sm text-muted-foreground">{text}</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </Container>
  );
}
