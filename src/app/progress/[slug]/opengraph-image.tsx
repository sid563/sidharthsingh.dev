import { ImageResponse } from "next/og";
import { getProgress, getProgressItem } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { clip, og, OgFrame, ogSize } from "@/lib/og";

export const alt = "Learning journey card";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getProgress().map((journey) => ({ slug: journey.slug }));
}

export default async function ProgressOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const journey = getProgressItem(slug);
  const data = journey?.data;
  const done = data?.milestones.filter((m) => m.done).length ?? 0;
  const total = data?.milestones.length ?? 0;
  const pct = Math.max(0, Math.min(100, Math.round(data?.percent ?? 0)));

  return new ImageResponse(
    (
      <OgFrame
        eyebrow={data ? `Learning in public  ·  Updated ${formatDate(data.updated)}` : "Progress"}
        title={data?.title ?? "Learning journey"}
        summary={data ? clip(data.summary, 150) : undefined}
        aside={
          data ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 320 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: og.muted }}>
                <div style={{ display: "flex" }}>Progress</div>
                <div style={{ display: "flex", color: og.fg }}>{pct}%</div>
              </div>
              <div style={{ display: "flex", width: "100%", height: 14, borderRadius: 99, background: "#262626" }}>
                <div style={{ display: "flex", width: `${pct}%`, height: 14, borderRadius: 99, background: og.brand }} />
              </div>
              <div style={{ display: "flex", fontSize: 22, color: og.muted }}>
                {done} of {total} milestones
              </div>
            </div>
          ) : undefined
        }
      />
    ),
    { ...size },
  );
}
