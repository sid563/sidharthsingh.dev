"use client";

import * as React from "react";

/**
 * Cursor spotlight for a group of cards (see .spotlight-card in globals.css).
 *
 * One pointermove listener on the group writes the cursor position, relative
 * to each card, into CSS variables; the cards paint a soft radial highlight
 * and a brighter border glow from those variables. Pointer-driven only, so
 * touch devices and reduced-motion users simply get the plain cards.
 */
export function SpotlightGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const group = ref.current;
    if (!group || !window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let last: { x: number; y: number } | null = null;
    const paint = () => {
      frame = 0;
      if (!last) return;
      for (const card of group.querySelectorAll<HTMLElement>("[data-spotlight]")) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${last.x - rect.left}px`);
        card.style.setProperty("--my", `${last.y - rect.top}px`);
      }
    };
    const onMove = (event: PointerEvent) => {
      last = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };
    group.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      group.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} data-spotlight-group className={className}>
      {children}
    </div>
  );
}
