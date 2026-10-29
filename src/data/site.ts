/**
 * Single source of truth for who the site is about. Everything public-facing
 * (name, links, nav) lives here so pages never hard-code it.
 */
export const site = {
  name: "Sidharth Singh",
  firstName: "Sidharth",
  title: "Sidharth Singh · Backend Engineer",
  role: "Software Engineer at 1buy.ai",
  /** Second line of the hero headline; the name is the first line. */
  headline: "builds backends that stay correct under load.",
  /** One-line version for the footer, OG image and anywhere the name is already shown. */
  tagline: "Backends that stay correct under load.",
  eyebrow: "Backend Engineer · Rust · Kafka · PostgreSQL",
  description:
    "Event-driven services, Kafka pipelines and Rust on the hot paths, for platforms that move physical goods. Backend engineer at 1buy.ai in Delhi, learning PostgreSQL internals and Kafka from first principles, in public.",
  /** Hero stat tiles. Keep every number verifiable. */
  stats: [
    { value: 2, suffix: "+", label: "years in production", detail: "Rust, TypeScript, Python" },
    { value: 100, suffix: "M+", label: "documents indexed", detail: "MongoDB pipelines for real-time discovery" },
    { value: 16, label: "LLM mail agents", detail: "anchor, classify, act" },
    { value: 1, suffix: "st", label: "place, hackathon 2025", detail: "across all engineering teams" },
  ],
  location: "Delhi, India",
  email: "sidharthsingh7111@gmail.com",
  // Set NEXT_PUBLIC_SITE_URL once a domain is bought. Used for metadata and OG images.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sidharthsingh.dev",
  github: "https://github.com/sid563",
  githubUser: "sid563",
  /** Public source of this site; article pages link to their own file. */
  repo: "https://github.com/sid563/sidharthsingh.dev",
  linkedin: "https://www.linkedin.com/in/sidharthsingh-ss563",
  availability: "Open to conversations about distributed backends and hard infrastructure problems.",
  /** Short bio paragraphs for the About page. */
  about: [
    "I am a backend engineer with a little over two years of production experience. I have spent that time inside procurement, logistics and supply-chain platforms, where the interesting problems are throughput, correctness under concurrency, and keeping many services in agreement about what just happened.",
    "At 1buy.ai I work on an ultra-small team that owns core platform flows end to end. That has meant MongoDB aggregation pipelines over 100M+ pricing documents, a Rust job scheduler built on Tokio and semaphore-bounded worker pools, shared pricing logic compiled from Rust to WebAssembly, and an order-fulfilment backend on FastAPI, PostgreSQL and Kafka.",
    "Before that I was at RapidShyp, a B2B shipping platform for marketplace and multi-channel sellers, building Rust (Actix Web) microservices, Kafka pipelines and carrier integrations for bulk order processing and order lifecycle orchestration, with MongoDB, MySQL, Redis, TiKV and etcd in the mix.",
    "Outside work I like to go one layer deeper than the job requires: PostgreSQL query planners, async runtimes, HNSW vector indexing, and the ways distributed systems fail. This site is where I keep that learning honest and in public.",
  ],
  /** Home page "Working principles". Each line is quoted from a project write-up on this site. */
  principles: [
    "Correct under load first, then fast.",
    "Backpressure is a permit count, not a thread count.",
    "Facts we already have beat facts a model infers.",
    "Return nothing when unsure; the gap stays visible.",
    "Every number verifiable, every status honest.",
    "One layer deeper than the job requires.",
  ],
  nav: [
    { label: "Work", href: "/projects" },
    { label: "Writing", href: "/writing" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Progress", href: "/progress" },
    { label: "About", href: "/about" },
    { label: "Resume", href: "/resume" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/sid563", handle: "sid563" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sidharthsingh-ss563",
      handle: "sidharthsingh-ss563",
    },
    { label: "Email", href: "mailto:sidharthsingh7111@gmail.com", handle: "sidharthsingh7111@gmail.com" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
