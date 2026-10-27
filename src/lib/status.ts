/**
 * Status vocabulary shared by projects, roadmap items and progress journeys.
 * Dependency-free on purpose: safe to import from client components.
 */
export const statuses = ["idea", "planned", "in-progress", "paused", "shipped"] as const;
export type Status = (typeof statuses)[number];

export const statusLabel: Record<Status, string> = {
  idea: "Idea",
  planned: "Planned",
  "in-progress": "In progress",
  paused: "Paused",
  shipped: "Shipped",
};

/** Display order for boards and sorting: active work first, archives last. */
export const statusOrder: Status[] = ["in-progress", "planned", "idea", "paused", "shipped"];
