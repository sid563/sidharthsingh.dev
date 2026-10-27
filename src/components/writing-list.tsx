"use client";

import * as React from "react";
import type { Entry, Post } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { cn } from "@/lib/utils";

type Tag = { tag: string; count: number };

function chipClass(active: boolean) {
  return cn(
    "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 font-mono text-xs transition-colors",
    "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
  );
}

/** Posts grouped by year, with a client-side tag filter. Posts arrive newest first. */
export function WritingList({ posts, tags }: { posts: Entry<Post>[]; tags: Tag[] }) {
  const [active, setActive] = React.useState<string | null>(null);

  const visible = active ? posts.filter((post) => post.data.tags.includes(active)) : posts;

  const byYear = React.useMemo(() => {
    const groups = new Map<string, Entry<Post>[]>();
    for (const post of visible) {
      const year = post.data.date.slice(0, 4);
      groups.set(year, [...(groups.get(year) ?? []), post]);
    }
    return [...groups.entries()];
  }, [visible]);

  return (
    <div className="space-y-10">
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => setActive(null)}
            className={chipClass(active === null)}
          >
            All
            <span className="tabular-nums opacity-70">{posts.length}</span>
          </button>
          {tags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              aria-pressed={active === tag}
              onClick={() => setActive(active === tag ? null : tag)}
              className={chipClass(active === tag)}
            >
              #{tag}
              <span className="tabular-nums opacity-70">{count}</span>
            </button>
          ))}
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nothing tagged #{active} yet.
        </p>
      ) : null}

      {byYear.map(([year, items]) => (
        <section key={year} aria-labelledby={`year-${year}`} className="grid gap-2 sm:grid-cols-[5rem_1fr] sm:gap-6">
          <h2
            id={`year-${year}`}
            className="font-mono text-sm text-muted-foreground tabular-nums sm:pt-4"
          >
            {year}
          </h2>
          <div className="divide-y divide-border/60">
            {items.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
