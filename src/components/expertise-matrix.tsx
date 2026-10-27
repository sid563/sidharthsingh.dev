import { FadeInItem, FadeInStagger } from "@/components/fade-in";
import { Section } from "@/components/section";
import { depthLabel, depthOrder, skillGroups, type Depth } from "@/data/skills";
import { cn } from "@/lib/utils";

const SEGMENTS = depthOrder.length;

function filledSegments(depth: Depth) {
  return SEGMENTS - depthOrder.indexOf(depth);
}

function DepthMeter({ depth, className }: { depth: Depth; className?: string }) {
  const filled = filledSegments(depth);
  return (
    <span className={cn("flex items-center gap-0.5", className)} aria-hidden>
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <span
          key={i}
          className={cn("h-1.5 w-3 rounded-sm transition-colors", i < filled ? "bg-brand" : "bg-muted")}
        />
      ))}
    </span>
  );
}

/** Honest expertise matrix: each skill gets a four-segment depth meter and a label. */
export function ExpertiseMatrix() {
  return (
    <Section
      id="expertise"
      eyebrow="Expertise"
      title="What I know, and how well"
      description="An honest self-rating rather than a wall of logos. Four levels, from tools I use daily to things I am actively learning."
      className="scroll-mt-20"
    >
      <ul className="mb-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground" aria-label="Legend">
        {depthOrder.map((depth) => (
          <li key={depth} className="flex items-center gap-2">
            <DepthMeter depth={depth} />
            {depthLabel[depth]}
          </li>
        ))}
      </ul>

      <FadeInStagger className="grid gap-x-12 gap-y-12 md:grid-cols-2" faster>
        {skillGroups.map((group) => (
          <FadeInItem key={group.name}>
            <h3 className="font-semibold tracking-tight">{group.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
            <ul className="mt-4 divide-y divide-border/60">
              {group.skills.map((skill) => (
                <li key={skill.name} className="py-2.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{skill.name}</p>
                      {skill.note ? (
                        <p className="text-xs text-muted-foreground">{skill.note}</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-3 pt-0.5">
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {depthLabel[skill.depth]}
                      </span>
                      <span className="sr-only sm:hidden">{depthLabel[skill.depth]}</span>
                      <DepthMeter depth={skill.depth} />
                    </div>
                  </div>
                  {skill.points ? (
                    <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                      {skill.points.map((point) => (
                        <li key={point} className="flex gap-2.5">
                          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand" aria-hidden />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </Section>
  );
}
