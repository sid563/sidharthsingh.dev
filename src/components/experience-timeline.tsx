import { Section } from "@/components/section";
import { FadeInItem, FadeInStagger } from "@/components/fade-in";
import { Badge } from "@/components/ui/badge";
import { resume } from "@/data/resume";
import { formatRange } from "@/lib/format";
import { cn } from "@/lib/utils";

function TimelineDot({ current = false }: { current?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute top-1.5 -left-[2.4rem] flex size-3 items-center justify-center rounded-full border-2 border-background ring-1 ring-border",
        current ? "bg-brand" : "bg-muted-foreground/40",
      )}
    />
  );
}

/** Vertical career timeline from the structured resume, followed by education. */
export function ExperienceTimeline() {
  return (
    <Section
      eyebrow="Career"
      title="Where I have worked"
      description="Two companies, three roles, all of them on the backend of platforms that move physical goods."
      href="/resume"
      hrefLabel="Full resume"
    >
      <FadeInStagger faster>
        <ol className="relative ml-1.5 space-y-10 border-l border-border pl-8">
          {resume.experience.map((job) => (
            <li key={`${job.company}-${job.role}`} className="relative">
              <TimelineDot current={job.end === null} />
              <FadeInItem>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatRange(job.start, job.end)} · {job.location}
                </p>
                <h3 className="mt-1 font-semibold tracking-tight">
                  {job.role} <span className="font-normal text-muted-foreground">at {job.company}</span>
                </h3>
                {job.tagline ? <p className="mt-1 text-sm text-muted-foreground">{job.tagline}</p> : null}
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
                  {job.bullets.slice(0, 2).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {job.stack.map((item) => (
                    <li key={item}>
                      <Badge variant="secondary" className="font-mono text-[11px] font-normal">
                        {item}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </FadeInItem>
            </li>
          ))}

          {resume.education.map((edu) => (
            <li key={edu.school} className="relative">
              <TimelineDot />
              <FadeInItem>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatRange(edu.start, edu.end)} · Education
                </p>
                <h3 className="mt-1 font-semibold tracking-tight">{edu.degree}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {edu.school}
                  {edu.detail ? ` · ${edu.detail}` : ""}
                </p>
              </FadeInItem>
            </li>
          ))}
        </ol>
      </FadeInStagger>
    </Section>
  );
}
