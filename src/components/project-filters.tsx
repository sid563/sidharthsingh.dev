"use client";

import * as React from "react";
import type { Entry, Project } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { FadeInItem, FadeInStagger } from "@/components/fade-in";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** Slug + frontmatter only; the MDX body never reaches the client. */
export type ProjectSummary = Pick<Entry<Project>, "slug" | "data">;

type Kind = "all" | Project["kind"];

const kinds: { value: Kind; label: string }[] = [
  { value: "all", label: "All" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "academic", label: "Academic" },
];

export function ProjectFilters({ projects }: { projects: ProjectSummary[] }) {
  const [kind, setKind] = React.useState<Kind>("all");

  const counts = React.useMemo(() => {
    const map = new Map<Kind, number>([["all", projects.length]]);
    for (const project of projects) {
      map.set(project.data.kind, (map.get(project.data.kind) ?? 0) + 1);
    }
    return map;
  }, [projects]);

  const visible =
    kind === "all" ? projects : projects.filter((project) => project.data.kind === kind);

  return (
    <div className="space-y-6">
      <Tabs value={kind} onValueChange={(value) => setKind(value as Kind)}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList aria-label="Filter projects by kind">
            {kinds.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className="px-2.5">
                {item.label}
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {counts.get(item.value) ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          <p className="font-mono text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {visible.length} {visible.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </Tabs>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </p>
      ) : (
        <FadeInStagger key={kind} faster className="grid gap-4 sm:grid-cols-2">
          {visible.map((project) => (
            <FadeInItem key={project.slug} className="h-full">
              <ProjectCard
                project={project}
                featured={project.data.featured}
                className="h-full"
              />
            </FadeInItem>
          ))}
        </FadeInStagger>
      )}
    </div>
  );
}
