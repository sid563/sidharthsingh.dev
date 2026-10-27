/**
 * Writing vocabulary shared by server and client components.
 * Dependency-free on purpose, like src/lib/status.ts.
 */
export const postTypes = ["article", "note", "essay"] as const;
export type PostType = (typeof postTypes)[number];

export const postTypeLabel: Record<PostType, string> = {
  article: "Article",
  note: "Note",
  essay: "Essay",
};
