import type { NextConfig } from "next";
import { documentRedirects } from "./src/data/links";

const nextConfig: NextConfig = {
  // Cache Components stays off for the pilot: every page is prerendered from
  // files in /content at build time, so the classic static model is enough.
  cacheComponents: false,
  // Clean paths (/cv, /certificates/...) that redirect to externally hosted
  // documents. See src/data/links.ts.
  async redirects() {
    return documentRedirects();
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
