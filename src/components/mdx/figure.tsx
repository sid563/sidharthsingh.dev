import { cn } from "@/lib/utils";

type FigureProps = {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  /** Intrinsic size keeps layout stable while the image loads. */
  width?: number;
  height?: number;
  /** "wide" lets the figure spill past the text measure on large screens. */
  size?: "default" | "wide";
  className?: string;
};

/**
 * An image with a caption for articles. Plain <img> on purpose: content
 * images are few, local, and served from /public, and the lazy/async hints
 * do the work that matters.
 */
export function Figure({ src, alt, caption, width, height, size = "default", className }: FigureProps) {
  return (
    <figure className={cn("mdx-figure not-prose", size === "wide" && "mdx-figure-wide", className)}>
      <div className="mdx-figure-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
