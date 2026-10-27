import { FadeInItem, FadeInStagger } from "@/components/fade-in";
import { Section } from "@/components/section";
import { site } from "@/data/site";

/**
 * Working principles, each one a line lifted from a project write-up on
 * this site rather than a slogan written for the home page.
 */
export function Principles() {
  return (
    <Section
      eyebrow="How I work"
      title="Working principles"
      description="Lines from the project write-ups, not a manifesto. Each one cost something to learn."
    >
      <FadeInStagger faster>
        <ol className="divide-y divide-border/60 border-y border-border/60">
          {site.principles.map((line, i) => (
            <FadeInItem key={line}>
              <li className="flex items-baseline gap-5 py-4 sm:gap-8 sm:py-5">
                <span className="w-6 shrink-0 font-mono text-xs text-brand tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-lg font-medium tracking-tight text-balance sm:text-2xl">{line}</p>
              </li>
            </FadeInItem>
          ))}
        </ol>
      </FadeInStagger>
    </Section>
  );
}
