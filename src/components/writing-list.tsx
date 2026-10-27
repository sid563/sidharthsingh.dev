"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import type { Entry, Post } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { cn } from "@/lib/utils";

type Tag = { tag: string; count: number };
type TypeFilter = "all" | Post["type"];

const typeFilters: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "article", label: "Articles" },
  { value: "note", label: "Notes" },
  { value: "essay", label: "Essays" },
];

function chipClass(active: boolean) {
  return cn(
    "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 font-mono text-xs transition-colors",
    "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
  );
}

/**
 * Posts grouped by year with two client-side filters: the shape of the
 * writing (article, note, essay) and a tag. `?tag=` in the URL preselects a
 * tag so tag badges on an article can link here. Posts arrive newest first.
 */
export function WritingList({ posts, tags }: { posts: Entry<Post>[]; tags: Tag[] }) {
  const params = useSearchParams();
  const initialTag = params.get("tag");
  const [tag, setTag] = React.useState<string | null>(
    initialTag && tags.some((t) => t.tag === initialTag) ? initialTag : null,
  );
  const [type, setType] = React.useState<TypeFilter>("all");

  const typeCounts = React.useMemo(() => {
    const map = new Map<TypeFilter, number>([["all", posts.length]]);
    for (const post of posts) map.set(post.data.type, (map.get(post.data.type) ?? 0) + 1);
    return map;
  }, [posts]);

  const visible = posts.filter(
    (post) => (type === "all" || post.data.type === type) && (tag === null || post.data.tags.includes(tag)),
  );

  const byYear = React.useMemo(() => {
    const groups = new Map<string, Entry<Post>[]>();
    for (const post of visible) {
      const year = post.data.date.slice(0, 4);
      groups.set(year, [...(groups.get(year) ?? []), post]);
    }
    return [...groups.entries()];
  }, [visible]);

  const presentTypes = typeFilters.filter((t) => t.value === "all" || (typeCounts.get(t.value) ?? 0) > 0);

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        {presentTypes.length > 2 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
            {presentTypes.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={type === item.value}
                onClick={() => setType(item.value)}
                className={chipClass(type === item.value)}
              >
                {item.label}
                <span className="tabular-nums opacity-70">{typeCounts.get(item.value) ?? 0}</span>
              </button>
            ))}
          </div>
        ) : null}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
            {tags.map(({ tag: t, count }) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(tag === t ? null : t)}
                className={chipClass(tag === t)}
              >
                #{t}
                <span className="tabular-nums opacity-70">{count}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nothing here yet.
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
