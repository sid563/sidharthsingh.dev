import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getPosts, getProgress, getProjects } from "@/lib/content";

const staticRoutes = ["", "/about", "/resume", "/projects", "/writing", "/roadmap", "/progress", "/now", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...getProjects().map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      lastModified: new Date(project.data.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getPosts().map((post) => ({
      url: `${site.url}/writing/${post.slug}`,
      lastModified: new Date(post.data.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getProgress().map((journey) => ({
      url: `${site.url}/progress/${journey.slug}`,
      lastModified: new Date(journey.data.updated),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
