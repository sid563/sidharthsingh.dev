import { ImageResponse } from "next/og";
import { getProject, getProjects } from "@/lib/content";
import { formatMonth } from "@/lib/format";
import { statusLabel } from "@/lib/status";
import { clip, OgFrame, OgSketch, ogSize } from "@/lib/og";

export const alt = "Project card";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const data = project?.data;
  const eyebrow = data
    ? [data.org ?? data.kind, formatMonth(data.date), statusLabel[data.status]].join("  ·  ")
    : "Project";

  return new ImageResponse(
    (
      <OgFrame
        eyebrow={eyebrow}
        title={data?.title ?? "Project"}
        summary={data ? clip(data.summary, data.diagram ? 120 : 180) : undefined}
        chips={data?.stack.slice(0, 5) ?? []}
        aside={data?.diagram ? <OgSketch spec={data.diagram} /> : undefined}
      />
    ),
    { ...size },
  );
}
