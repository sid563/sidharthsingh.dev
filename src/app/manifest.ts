import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Web app manifest: gives Android, Windows and search engines larger PNG
 * icons than the favicon carries. `display: "browser"` keeps it from
 * prompting anyone to install the site as an app.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
