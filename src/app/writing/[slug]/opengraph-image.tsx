import { ImageResponse } from "next/og";
import { getPost, getPosts } from "@/lib/content";
import { formatDate, readingTime } from "@/lib/format";
import { postTypeLabel } from "@/lib/writing";
import { clip, OgFrame, ogSize } from "@/lib/og";

export const alt = "Article card";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const data = post?.data;
  const eyebrow = data
    ? [postTypeLabel[data.type], formatDate(data.date), readingTime(post.body)].join("  ·  ")
    : "Writing";

  return new ImageResponse(
    (
      <OgFrame
        eyebrow={eyebrow}
        title={data?.title ?? "Writing"}
        summary={data ? clip(data.summary, 190) : undefined}
        chips={data?.tags.map((t) => `#${t}`) ?? []}
        footerRight={data?.series ? `${data.series.name}, part ${data.series.part}` : undefined}
      />
    ),
    { ...size },
  );
}
