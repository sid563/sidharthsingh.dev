"use client";

import * as React from "react";
import type { TocHeading } from "@/lib/toc";
import { cn } from "@/lib/utils";

type TocProps = {
  headings: TocHeading[];
  className?: string;
  /** Rendered as a sticky rail (default) or an inline collapsible list. */
  variant?: "rail" | "inline";
};

/**
 * "On this page" navigation. The active heading is whichever one most
 * recently crossed the top quarter of the viewport, tracked with a single
 * IntersectionObserver; there is no scroll listener.
 */
export function Toc({ headings, className, variant = "rail" }: TocProps) {
  const [active, setActive] = React.useState<string | null>(headings[0]?.id ?? null);

  React.useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        }
        if (visible.size > 0) {
          // The topmost visible heading wins.
          const [id] = [...visible.entries()].sort((a, b) => a[1] - b[1])[0];
          setActive(id);
          return;
        }
        // Nothing in the band: pick the last heading above the viewport.
        const above = elements.filter((el) => el.getBoundingClientRect().top < 120);
        if (above.length > 0) setActive(above[above.length - 1].id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: [0, 1] },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const list = (
    <ol className={cn("toc-list", variant === "inline" && "toc-list-inline")}>
      {headings.map((heading) => (
        <li key={heading.id} data-depth={heading.depth}>
          <a
            href={`#${heading.id}`}
            aria-current={active === heading.id ? "location" : undefined}
            className="toc-link"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === "inline") {
    return (
      <details className={cn("toc-inline group/toc", className)}>
        <summary className="toc-summary">On this page</summary>
        {list}
      </details>
    );
  }

  return (
    <nav aria-label="On this page" className={cn("toc-rail", className)}>
      <p className="toc-title">On this page</p>
      {list}
    </nav>
  );
}
