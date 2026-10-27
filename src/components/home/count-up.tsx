"use client";

import { useEffect, useRef } from "react";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** seconds */
  duration?: number;
  /** seconds before the count starts */
  delay?: number;
};

/**
 * Renders the final value on the server, then counts up from zero once the
 * page is interactive. Reduced-motion users just see the final value.
 */
export function CountUp({ value, prefix = "", suffix = "", duration = 1.4, delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const render = (n: number) => {
      el.textContent = `${prefix}${Math.round(n)}${suffix}`;
    };
    let raf = 0;
    let start: number | null = null;
    render(0);
    const timer = window.setTimeout(() => {
      const step = (t: number) => {
        if (start === null) start = t;
        const p = Math.min(1, (t - start) / (duration * 1000));
        const eased = 1 - Math.pow(1 - p, 3);
        render(value * eased);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay * 1000);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, prefix, suffix, duration, delay]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
