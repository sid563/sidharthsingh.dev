"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export type Route = { href: string; label: string };

/** Dice coefficient over character bigrams: cheap, decent for short slugs. */
function similarity(a: string, b: string) {
  const grams = (s: string) => {
    const out = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      out.set(g, (out.get(g) ?? 0) + 1);
    }
    return out;
  };
  const ga = grams(a);
  const gb = grams(b);
  if (ga.size === 0 || gb.size === 0) return 0;
  let hits = 0;
  for (const [g, n] of ga) hits += Math.min(n, gb.get(g) ?? 0);
  return (2 * hits) / (a.length - 1 + (b.length - 1));
}

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Reads the missing path from the address bar and offers the closest real
 * pages. Server renders nothing dynamic, so the 404 stays fully static.
 */
export function NotFoundSuggestions({ routes }: { routes: Route[] }) {
  // Read the address bar through a store: null on the server, the real path
  // on the client, with no state update inside an effect.
  const path = React.useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => null,
  );

  const matches = React.useMemo(() => {
    if (!path) return [];
    const needle = normalise(path.split("/").filter(Boolean).join(" "));
    if (!needle) return [];
    return routes
      .map((route) => ({
        route,
        score: Math.max(
          similarity(needle, normalise(route.href.split("/").filter(Boolean).join(" "))),
          similarity(needle, normalise(route.label)),
        ),
      }))
      .filter(({ score }) => score >= 0.28)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [path, routes]);

  return (
    <div className="not-found-log">
      <pre aria-label="Error details">
        <span className="text-destructive">ERROR</span>  route_not_found
        {"\n"}
        <span className="text-muted-foreground">path </span>  <span suppressHydrationWarning>{path ?? "…"}</span>
        {"\n"}
        <span className="text-muted-foreground">hint </span>  {matches.length > 0 ? "did you mean:" : "no close match; try the pages below"}
      </pre>
      {matches.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {matches.map(({ route }) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className="group inline-flex items-center gap-2 font-mono text-sm text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-brand"
              >
                {route.href}
                <span className="text-muted-foreground no-underline">{route.label}</span>
                <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
