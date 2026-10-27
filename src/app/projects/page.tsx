import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ProjectFilters } from "@/components/project-filters";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Backends I have shipped: schedulers, pipelines, fulfilment flows and the occasional model, each with its constraints and outcome.",
};

export default function ProjectsPage() {
  // Strip the MDX body so only frontmatter crosses to the client filter.
  const projects = getProjects().map(({ slug, data }) => ({ slug, data }));

  return (
    <Container>
      <PageHeader
        eyebrow="Work"
        title="Projects"
        description="Backends I have shipped: schedulers, pipelines, fulfilment flows and the occasional model. Each one lists the constraints, what I built, and what came of it."
      />
      <ProjectFilters projects={projects} />
    </Container>
  );
}
