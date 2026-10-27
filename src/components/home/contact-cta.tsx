import { ArrowUpRightIcon, MailIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { site } from "@/data/site";

export function ContactCta() {
  return (
    <section className="py-12 sm:py-16">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border bg-card p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-brand/15 blur-3xl dark:bg-brand/10"
          />
          <p className="font-mono text-xs tracking-wider text-brand uppercase">Contact</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Let&apos;s talk.</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {site.availability} Email is the fastest way to reach me.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${site.email}`} className={buttonVariants({ size: "lg" })}>
              <MailIcon data-icon="inline-start" />
              {site.email}
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              LinkedIn
              <ArrowUpRightIcon data-icon="inline-end" />
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
