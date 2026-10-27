import { Section } from "@/components/section";
import { site } from "@/data/site";

/**
 * Working principles, each one a line lifted from a project write-up on
 * this site rather than a slogan written for the home page. Set at body
 * size on purpose: it is a list to read, not a poster. The <ol> is its own
 * stagger container so the markup stays a plain list.
 */
export function Principles() {
  return (
    <Section
      eyebrow="How I work"
      title="Working principles"
      description="Lines from the project write-ups, not a manifesto. Each one cost something to learn."
    >
      <ol className="reveal-stagger reveal-stagger-fast max-w-3xl divide-y divide-border/60 border-y border-border/60">
        {site.principles.map((line, i) => (
          <li key={line} className="reveal-item flex items-baseline gap-4 py-3 sm:gap-6">
            <span className="w-5 shrink-0 font-mono text-[11px] text-brand tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-base font-medium tracking-tight text-pretty sm:text-[1.0625rem]">{line}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
