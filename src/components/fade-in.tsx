import { cn } from "@/lib/utils";

/**
 * Entrance animations, CSS only (see "Reveal animations" in globals.css).
 *
 * Content is visible by default: the server-rendered HTML never carries
 * opacity 0, so printing, crawlers and slow scripts always see the page.
 * Browsers that support scroll-driven animations get a gentle fade-up as a
 * block enters the viewport; the hero uses `mode="load"` for a timed
 * entrance instead. Reduced-motion users get no animation at all.
 */
type FadeInProps = React.ComponentProps<"div"> & {
  /** Seconds, only meaningful with mode="load". */
  delay?: number;
  /** Pixels to travel upward while fading in. */
  y?: number;
  /** "view" = animate as it scrolls into view; "load" = animate on page load. */
  mode?: "view" | "load";
};

export function FadeIn({
  delay = 0,
  y = 12,
  mode = "view",
  className,
  style,
  children,
  ...rest
}: FadeInProps) {
  const vars = { "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as React.CSSProperties;
  return (
    <div
      className={cn(mode === "load" ? "reveal-load" : "reveal-view", className)}
      style={{ ...style, ...vars }}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Wrap a list in this and each child in FadeInItem to stagger them. */
export function FadeInStagger({
  children,
  className,
  faster = false,
}: {
  children: React.ReactNode;
  className?: string;
  faster?: boolean;
}) {
  return (
    <div className={cn("reveal-stagger", faster && "reveal-stagger-fast", className)}>
      {children}
    </div>
  );
}

export function FadeInItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("reveal-item", className)}>{children}</div>;
}
