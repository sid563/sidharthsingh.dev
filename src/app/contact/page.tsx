import type { Metadata } from "next";
import { ArrowUpRightIcon, MailIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { site } from "@/data/site";
import { CopyEmailButton } from "./copy-email-button";

export const metadata: Metadata = {
  title: "Contact",
  description: site.availability,
};

const reasons = [
  {
    title: "Distributed backends",
    body: "Event-driven services, job orchestration and data pipelines that have to stay correct under concurrency.",
  },
  {
    title: "Rust, Kafka and PostgreSQL",
    body: "The stack I work in every day, and the one I am currently going deepest on.",
  },
  {
    title: "Hard infrastructure problems",
    body: "Throughput, failure modes, or keeping many services in agreement about what just happened.",
  },
  {
    title: "Learning in public",
    body: "Engineers who write up what they learn. Trading notes is half the fun.",
  },
];

export default function ContactPage() {
  const profiles = site.socials.filter((s) => !s.href.startsWith("mailto:"));

  return (
    <Container className="pb-8">
      <PageHeader eyebrow="Contact" title="Let's talk" description={site.availability} />

      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Email</p>
        <a
          href={`mailto:${site.email}`}
          className="mt-2 inline-flex items-center gap-3 text-2xl font-semibold tracking-tight break-all transition-colors hover:text-brand sm:text-3xl"
        >
          <MailIcon className="size-6 shrink-0 text-muted-foreground" aria-hidden />
          {site.email}
        </a>
        <p className="mt-3 text-sm text-muted-foreground">
          Based in {site.location}. I reply to most messages within a couple of days.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`mailto:${site.email}`} className={buttonVariants()}>
            Write an email
          </a>
          <CopyEmailButton email={site.email} />
        </div>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2" aria-label="Profiles">
        {profiles.map((profile) => (
          <a
            key={profile.href}
            href={profile.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-muted/40"
          >
            <div className="min-w-0">
              <p className="font-medium">{profile.label}</p>
              <p className="mt-0.5 truncate font-mono text-sm text-muted-foreground">{profile.handle}</p>
            </div>
            <ArrowUpRightIcon
              className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
              aria-hidden
            />
          </a>
        ))}
      </section>

      <section className="py-12 sm:py-16">
        <h2 className="text-xl font-semibold tracking-tight">Good reasons to reach out</h2>
        <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {reasons.map((reason) => (
            <li key={reason.title}>
              <p className="font-medium">{reason.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{reason.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
