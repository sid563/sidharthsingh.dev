import Link from "next/link";
import { ArrowUpRightIcon, MailIcon, MapPinIcon } from "lucide-react";
import { resume, type Credential } from "@/data/resume";
import { site } from "@/data/site";
import { getDocument } from "@/data/links";
import { formatRange } from "@/lib/format";
import type { Entry, Project } from "@/lib/content";
import { Chips, ResumeEntry, ResumeSection } from "./resume-section";

/** Email, location and profile handles. Shows in print as the contact line. */
export function ContactLine() {
  const profiles = site.socials.filter((s) => !s.href.startsWith("mailto:"));
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
      <li>
        <a href={`mailto:${site.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
          <MailIcon className="size-3.5" aria-hidden />
          {site.email}
        </a>
      </li>
      <li className="inline-flex items-center gap-1.5">
        <MapPinIcon className="size-3.5" aria-hidden />
        {site.location}
      </li>
      {profiles.map((p) => (
        <li key={p.href}>
          <a href={p.href} target="_blank" rel="noreferrer" className="hover:text-foreground">
            {p.label}: <span className="font-mono text-[13px]">{p.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Summary() {
  return (
    <ResumeSection title="Summary">
      <p className="leading-relaxed">{resume.summary}</p>
    </ResumeSection>
  );
}

export function Experience() {
  return (
    <ResumeSection title="Experience">
      {resume.experience.map((job) => (
        <ResumeEntry
          key={`${job.company}-${job.role}-${job.start}`}
          meta={
            <>
              <div>{formatRange(job.start, job.end)}</div>
              <div>{job.location}</div>
            </>
          }
          heading={job.role}
          subheading={
            <>
              {job.url ? (
                <a href={job.url} target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                  {job.company}
                </a>
              ) : (
                <span className="text-foreground">{job.company}</span>
              )}
              {job.legalName ? <span> · {job.legalName}</span> : null}
            </>
          }
        >
          {job.tagline ? <p className="text-sm text-muted-foreground">{job.tagline}</p> : null}
          <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm leading-relaxed marker:text-border">
            {job.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <Chips items={job.stack} className="mt-4" />
        </ResumeEntry>
      ))}
    </ResumeSection>
  );
}

export function Education() {
  return (
    <ResumeSection title="Education">
      {resume.education.map((item) => {
        const doc = item.documentId ? getDocument(item.documentId) : null;
        return (
          <ResumeEntry
            key={item.school}
            meta={formatRange(item.start, item.end)}
            heading={item.degree}
            subheading={item.school}
          >
            {item.detail ? <p className="text-sm text-muted-foreground">{item.detail}</p> : null}
            {doc ? (
              <a
                href={doc.path}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-3 transition-colors hover:text-foreground hover:underline print:hidden"
              >
                View degree certificate
                <ArrowUpRightIcon className="size-3" aria-hidden />
              </a>
            ) : null}
          </ResumeEntry>
        );
      })}
    </ResumeSection>
  );
}

export function Skills() {
  return (
    <ResumeSection title="Skills">
      <dl className="space-y-4">
        {Object.entries(resume.skills).map(([group, items]) => (
          <div key={group} className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
            <dt className="text-sm font-medium">{group}</dt>
            <dd>
              <Chips items={items} />
            </dd>
          </div>
        ))}
      </dl>
    </ResumeSection>
  );
}

function CredentialList({ items }: { items: readonly Credential[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const doc = item.documentId ? getDocument(item.documentId) : null;
        return (
          <li key={item.title} className="grid gap-0.5 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
            <span className="text-sm text-muted-foreground tabular-nums">{item.year}</span>
            <div>
              <p className="text-sm font-medium leading-snug">{item.title}</p>
              {item.issuer || item.detail ? (
                <p className="text-sm text-muted-foreground">
                  {[item.issuer, item.detail].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              {doc ? (
                <a
                  href={doc.path}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-3 transition-colors hover:text-foreground hover:underline print:hidden"
                >
                  View certificate
                  <ArrowUpRightIcon className="size-3" aria-hidden />
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Credentials() {
  return (
    <ResumeSection title="Awards & certifications">
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Awards</h3>
        <CredentialList items={resume.awards} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Certifications</h3>
        <CredentialList items={resume.certifications} />
      </div>
    </ResumeSection>
  );
}

export function SelectedProjects({ projects }: { projects: Entry<Project>[] }) {
  if (projects.length === 0) return null;
  return (
    <ResumeSection title="Selected projects">
      {projects.map((project) => (
        <article key={project.slug} className="resume-entry">
          <h3 className="font-medium leading-snug">
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex items-center gap-1 hover:underline"
            >
              {project.data.title}
              <ArrowUpRightIcon
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 print:hidden"
                aria-hidden
              />
            </Link>
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.data.summary}</p>
          <Chips items={project.data.stack.slice(0, 6)} className="mt-3" />
        </article>
      ))}
    </ResumeSection>
  );
}
