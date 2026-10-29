/**
 * Typed content collections.
 *
 * Every folder under /content is a collection of Markdown/MDX files with YAML
 * frontmatter. Each collection has a Zod schema; a file that fails validation
 * fails the build with a readable error, which is exactly what we want.
 *
 * Reads are synchronous on purpose: pages are prerendered at build time.
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { statuses, statusOrder } from "@/lib/status";
import { postTypes } from "@/lib/writing";

// Re-exported so existing imports keep working; client code should import from "@/lib/status".
export { statuses, statusLabel, statusOrder, type Status } from "@/lib/status";
export { postTypes, postTypeLabel, type PostType } from "@/lib/writing";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** YAML turns unquoted 2026-10-27 into a Date; normalise back to YYYY-MM-DD. */
const dateString = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v))
  .pipe(z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "Use YYYY-MM-DD or YYYY-MM"));

export const statusSchema = z.enum(statuses);

const linkSchema = z.object({ label: z.string(), href: z.string() });
export type ContentLink = z.infer<typeof linkSchema>;

/**
 * A system sketch: the small declarative diagram drawn on project cards and
 * project pages (see src/lib/diagram.ts). Nodes are laid out left to right
 * by following the edges, so only ids, labels and kinds are needed.
 */
export const diagramNodeKinds = [
  "client",
  "service",
  "worker",
  "queue",
  "db",
  "cache",
  "external",
  "model",
  "file",
] as const;

export const diagramSchema = z.object({
  nodes: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        kind: z.enum(diagramNodeKinds).default("service"),
        /** One short line under the label, e.g. "SET NX PX". */
        note: z.string().optional(),
      }),
    )
    .min(2),
  edges: z
    .array(
      z.object({
        from: z.string(),
        to: z.string(),
        label: z.string().optional(),
        /** Dashed edge for "sometimes" paths (retries, fallbacks). */
        dashed: z.boolean().default(false),
      }),
    )
    .min(1),
});

export type Diagram = z.infer<typeof diagramSchema>;
export type DiagramNodeKind = (typeof diagramNodeKinds)[number];

export const projectSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: dateString,
  status: statusSchema.default("shipped"),
  featured: z.boolean().default(false),
  kind: z.enum(["work", "personal", "academic"]).default("work"),
  org: z.string().optional(),
  role: z.string().optional(),
  stack: z.array(z.string()).default([]),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  links: z.array(linkSchema).default([]),
  /** Optional system sketch shown on the card and at the top of the page. */
  diagram: diagramSchema.optional(),
  order: z.number().default(100),
  draft: z.boolean().default(false),
});

export const postSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: dateString,
  /** Shown as "Updated …" when it differs from `date`. */
  updated: dateString.optional(),
  type: z.enum(postTypes).default("article"),
  tags: z.array(z.string()).default([]),
  /** Multi-part writing: every post with the same series name is linked. */
  series: z.object({ name: z.string(), part: z.number().int().min(1) }).optional(),
  draft: z.boolean().default(false),
});

export const roadmapSchema = z.object({
  title: z.string(),
  summary: z.string(),
  status: statusSchema,
  /** Grouping label, e.g. "Databases", "Distributed systems", "Cloud". */
  theme: z.string(),
  /** Human timeframe, never an exact date: "Q4 2026", "2027", "Someday". */
  timeframe: z.string(),
  updated: dateString,
  order: z.number().default(100),
  links: z.array(linkSchema).default([]),
  /** Slug of a progress journey that tracks this item, if any. */
  progress: z.string().optional(),
  /** Slug of a project page once the item ships. */
  project: z.string().optional(),
});

export const progressSchema = z.object({
  title: z.string(),
  summary: z.string(),
  status: statusSchema,
  started: dateString,
  updated: dateString,
  percent: z.number().min(0).max(100),
  /** What "done" means, in one line. */
  target: z.string().optional(),
  repo: z.string().optional(),
  milestones: z
    .array(
      z.object({
        title: z.string(),
        done: z.boolean().default(false),
        date: dateString.optional(),
      }),
    )
    .default([]),
  log: z.array(z.object({ date: dateString, note: z.string() })).default([]),
  order: z.number().default(100),
});

export const pageSchema = z.object({
  title: z.string(),
  updated: dateString,
});

export type Project = z.infer<typeof projectSchema>;
export type Post = z.infer<typeof postSchema>;
export type RoadmapItem = z.infer<typeof roadmapSchema>;
export type ProgressJourney = z.infer<typeof progressSchema>;
export type ContentPage = z.infer<typeof pageSchema>;

export type Entry<T> = { slug: string; data: T; body: string };

function readEntry<S extends z.ZodType>(file: string, schema: S, label: string): Entry<z.infer<S>> {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in ${label}:\n${z.prettifyError(parsed.error)}`);
  }
  return {
    slug: path.basename(file).replace(/\.mdx?$/, ""),
    data: parsed.data,
    body: content,
  };
}

function loadCollection<S extends z.ZodType>(dir: string, schema: S): Entry<z.infer<S>>[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => readEntry(path.join(full, f), schema, `content/${dir}/${f}`));
}

/** Drafts are visible in development so you can preview them, hidden in production builds. */
const showDrafts = process.env.NODE_ENV !== "production";

// --- Projects ---------------------------------------------------------------

export function getProjects(): Entry<Project>[] {
  return loadCollection("projects", projectSchema)
    .filter((p) => showDrafts || !p.data.draft)
    .sort((a, b) => a.data.order - b.data.order || b.data.date.localeCompare(a.data.date));
}

export function getFeaturedProjects(): Entry<Project>[] {
  return getProjects().filter((p) => p.data.featured);
}

export function getProject(slug: string): Entry<Project> | null {
  return getProjects().find((p) => p.slug === slug) ?? null;
}

// --- Writing ----------------------------------------------------------------

export function getPosts(): Entry<Post>[] {
  return loadCollection("writing", postSchema)
    .filter((p) => showDrafts || !p.data.draft)
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export function getPost(slug: string): Entry<Post> | null {
  return getPosts().find((p) => p.slug === slug) ?? null;
}

/** Other parts of the same series, in part order (includes the given post). */
export function getSeries(name: string): Entry<Post>[] {
  return getPosts()
    .filter((p) => p.data.series?.name === name)
    .sort((a, b) => (a.data.series?.part ?? 0) - (b.data.series?.part ?? 0));
}

/** Up to `limit` other posts sharing the most tags, newest first on ties. */
export function getRelatedPosts(slug: string, limit = 3): Entry<Post>[] {
  const all = getPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  const tags = new Set(current.data.tags);
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: p.data.tags.filter((t) => tags.has(t)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.date.localeCompare(a.p.data.date))
    .slice(0, limit)
    .map(({ p }) => p);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getPosts()) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// --- Roadmap ----------------------------------------------------------------

export function getRoadmap(): Entry<RoadmapItem>[] {
  return loadCollection("roadmap", roadmapSchema).sort(
    (a, b) =>
      statusOrder.indexOf(a.data.status) - statusOrder.indexOf(b.data.status) ||
      a.data.order - b.data.order ||
      b.data.updated.localeCompare(a.data.updated),
  );
}

export function getRoadmapThemes(): string[] {
  return [...new Set(getRoadmap().map((r) => r.data.theme))];
}

// --- Progress ---------------------------------------------------------------

export function getProgress(): Entry<ProgressJourney>[] {
  return loadCollection("progress", progressSchema).sort(
    (a, b) =>
      statusOrder.indexOf(a.data.status) - statusOrder.indexOf(b.data.status) ||
      a.data.order - b.data.order ||
      b.data.updated.localeCompare(a.data.updated),
  );
}

export function getProgressItem(slug: string): Entry<ProgressJourney> | null {
  return getProgress().find((p) => p.slug === slug) ?? null;
}

// --- Single pages (content/now.mdx etc.) -------------------------------------

export function getPage(name: string): Entry<ContentPage> | null {
  const file = path.join(CONTENT_DIR, `${name}.mdx`);
  if (!fs.existsSync(file)) return null;
  return readEntry(file, pageSchema, `content/${name}.mdx`);
}

/** The most recent `updated`/`date` across all content, for "last updated" footers. */
export function getLastUpdated(): string {
  const dates = [
    ...getProjects().map((p) => p.data.date),
    ...getPosts()
      .filter((p) => !p.data.draft)
      .map((p) => p.data.date),
    ...getRoadmap().map((r) => r.data.updated),
    ...getProgress().map((p) => p.data.updated),
  ];
  return dates.sort().at(-1) ?? new Date().toISOString().slice(0, 10);
}
