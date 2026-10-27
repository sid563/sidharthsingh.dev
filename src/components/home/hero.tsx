import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/fade-in";
import { StatStrip } from "@/components/home/stat-strip";
import { HeroSketch } from "@/components/home/hero-sketch";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Splits text into words that reveal one after another (CSS, see .reveal-word). */
function Words({ text, className, start = 0 }: { text: string; className?: string; start?: number }) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className={cn("reveal-word", className)} style={{ "--i": start + i } as React.CSSProperties}>
        {word}
      </span>{" "}
    </span>
  ));
}

/**
 * Home hero, name-forward: the name is the headline, the value line follows
 * in a quieter tone, then the lede, the calls to action and a stats strip.
 * Motion is CSS only: aurora drift, word reveal, count-up numbers.
 */
export function Hero() {
  const nameWords = site.name.split(" ").length;
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="aurora" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_10%,transparent_70%)]"
      />

      <Container className="pt-16 pb-14 sm:pt-24 sm:pb-20">
        <FadeIn mode="load">
          <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">{site.eyebrow}</p>
        </FadeIn>

        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.03em] text-balance sm:text-6xl lg:text-7xl">
          <span className="block">
            <Words text={site.name} />
          </span>
          <span className="mt-1 block text-muted-foreground">
            <Words text={site.headline} start={nameWords} />
          </span>
        </h1>

        <FadeIn mode="load" delay={0.5}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {site.description}
          </p>
        </FadeIn>

        <FadeIn mode="load" delay={0.6}>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/projects" className={buttonVariants({ size: "lg" })}>
                View work
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
              <Link href="/resume" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Resume
              </Link>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ size: "lg", variant: "ghost" })}
              >
                GitHub
                <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </div>
            <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              {site.availability}
            </p>
          </div>
        </FadeIn>

        <FadeIn mode="load" delay={0.7} y={16} className="hidden sm:block">
          <HeroSketch className="mt-14" />
        </FadeIn>

        <FadeIn mode="load" delay={0.8} y={16}>
          <StatStrip stats={site.stats} className="mt-8 sm:mt-6" />
        </FadeIn>
      </Container>
    </section>
  );
}
