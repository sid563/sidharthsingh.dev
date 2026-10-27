import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { Section } from "@/components/section";
import { depthOrder, skillGroups } from "@/data/skills";

/** Eight strongest skills as chips, linking into the full matrix on /about. */
export function ExpertiseSnapshot() {
  const top = skillGroups
    .flatMap((group) => group.skills)
    .filter((skill) => skill.depth === "expert" || skill.depth === "production")
    .sort((a, b) => depthOrder.indexOf(a.depth) - depthOrder.indexOf(b.depth))
    .slice(0, 8);

  return (
    <Section
      eyebrow="Expertise"
      title="What I reach for"
      description="The tools I ship with every week. The full matrix on the about page is an honest self-rating, including what I am still learning."
      href="/about#expertise"
      hrefLabel="Full matrix"
    >
      <FadeIn>
        <ul className="flex flex-wrap gap-2">
          {top.map((skill) => (
            <li key={skill.name}>
              <Link
                href="/about#expertise"
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 font-mono text-sm transition-colors hover:border-foreground/30 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {skill.name}
                {skill.depth === "expert" ? (
                  <span className="size-1.5 rounded-full bg-brand" aria-label="daily driver" />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden />
          Daily driver
        </p>
      </FadeIn>
    </Section>
  );
}
