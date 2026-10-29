/**
 * Expertise matrix for the About page. Depth is an honest self-rating, not a
 * marketing one. Tweak freely; the UI only reads this file.
 */
export type Depth = "expert" | "production" | "working" | "learning";

export const depthLabel: Record<Depth, string> = {
  expert: "Daily driver",
  production: "Shipped in production",
  working: "Working knowledge",
  learning: "Actively learning",
};

export const depthOrder: Depth[] = ["expert", "production", "working", "learning"];

export type Skill = {
  name: string;
  depth: Depth;
  note?: string;
  /** Optional short bullets shown under the row, for skills that deserve nuance. */
  points?: string[];
};
export type SkillGroup = { name: string; blurb: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    blurb: "Rust and TypeScript for most of what I ship; Python and Go when the job calls for them.",
    skills: [
      {
        name: "Rust",
        depth: "expert",
        note: "Actix Web, Tokio, serde, rdkafka, wasm-bindgen",
        points: [
          "Async services on Tokio and Actix Web: backpressure-aware worker pools, serde-typed domain models, and handlers that hold up under peak shipping loads.",
          "Let the type system carry the invariants: serde-typed domain models, Result-based error handling, Send + Sync discipline for multi-instance safety.",
          "Rust as the single source of truth: shared crates compiled natively for services and to WebAssembly for TypeScript, with parity tests on both sides.",
        ],
      },
      { name: "TypeScript", depth: "expert", note: "NestJS, Node, React" },
      { name: "Python", depth: "production", note: "FastAPI, SQLAlchemy 2 async, asyncpg" },
      { name: "Java", depth: "production", note: "Spring Boot" },
      { name: "SQL", depth: "production" },
      {
        name: "Go",
        depth: "production",
        note: "Job handlers on 1buy.ai's scheduler: goroutine pools, channel semaphores, context deadlines",
      },
    ],
  },
  {
    name: "Backend & architecture",
    blurb: "Event-driven services with clean boundaries, built to survive more than one instance.",
    skills: [
      { name: "Actix Web", depth: "expert" },
      { name: "NestJS", depth: "expert" },
      { name: "Hexagonal architecture", depth: "expert" },
      { name: "Event-driven design", depth: "expert" },
      {
        name: "Modular monoliths",
        depth: "production",
        note: "One image, three roles; bounded contexts enforced in CI; Postgres as the queue",
      },
      { name: "FastAPI", depth: "production" },
      { name: "Concurrency & async runtimes", depth: "production", note: "Tokio at RapidShyp; goroutine pools and channel semaphores in Go" },
      { name: "gRPC", depth: "production", note: "service-to-service APIs with protobuf contracts" },
      { name: "WebSockets", depth: "production", note: "real-time updates to clients" },
      { name: "Spring Boot", depth: "working" },
    ],
  },
  {
    name: "Data & messaging",
    blurb: "MongoDB at 100M+ documents, Kafka for everything asynchronous, and Postgres as the current deep dive.",
    skills: [
      { name: "MongoDB", depth: "expert", note: "Aggregation pipelines, compound indexes, Decimal128" },
      { name: "Apache Kafka", depth: "production", note: "Plus a self-directed deep dive in Rust" },
      { name: "Redis", depth: "production" },
      { name: "MySQL", depth: "production" },
      {
        name: "PostgreSQL",
        depth: "production",
        note: "Daily driver at work; internals deep dive in progress",
        points: [
          "In production every day: schema design, SQLAlchemy 2 async with Alembic migrations, pgvector similarity search, append-only event tables.",
          "Fluent at the usage layer: query design, EXPLAIN ANALYZE, compound and partial indexes, lock-aware DDL on hot tables.",
          "Postgres as infrastructure: a job queue claimed with SELECT … FOR UPDATE SKIP LOCKED and a stale-lease reclaim, leader election on a session advisory lock, SET LOCAL lock_timeout so a stuck request fails fast instead of committing late.",
          "Going below the surface: an eight-week internals course on the planner, storage layout, MVCC, WAL and buffer management, tracked on the progress page.",
        ],
      },
      { name: "etcd / TiKV", depth: "working" },
    ],
  },
  {
    name: "Infra & cloud",
    blurb: "Comfortable shipping containers; levelling up on provisioning infrastructure from scratch.",
    skills: [
      { name: "Docker", depth: "production" },
      { name: "Linux", depth: "production" },
      { name: "CI/CD", depth: "production" },
      { name: "AWS", depth: "working", note: "EC2, S3, Lambda; SAA-C03 on the roadmap" },
      { name: "Kubernetes", depth: "learning" },
      { name: "Terraform", depth: "learning" },
    ],
  },
  {
    name: "AI & search",
    blurb: "LLMs as components inside real workflows, not demos.",
    skills: [
      { name: "LLM integration (Claude)", depth: "production", note: "RFQ and trade-document parsing" },
      { name: "RAG pipelines", depth: "working" },
      { name: "Vector search", depth: "working", note: "Atlas Vector Search, pgvector" },
      { name: "HNSW indexing", depth: "learning" },
    ],
  },
  {
    name: "Frontend",
    blurb: "Enough to ship the internal tools the backend needs.",
    skills: [
      { name: "React", depth: "production" },
      { name: "Next.js", depth: "production" },
    ],
  },
];
