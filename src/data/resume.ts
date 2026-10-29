/**
 * Structured resume. The /resume page and the printable version render from
 * this one object, so they can never drift apart.
 * Dates are YYYY-MM. `end: null` means present.
 */
export type Experience = {
  company: string;
  legalName?: string;
  url?: string;
  role: string;
  start: string;
  end: string | null;
  location: string;
  tagline?: string;
  bullets: string[];
  stack: string[];
};

export type Education = {
  school: string;
  degree: string;
  start: string;
  end: string;
  detail?: string;
  /** id of an entry in src/data/links.ts; renders a "View" link once that entry has a URL. */
  documentId?: string;
};

export type Credential = {
  title: string;
  issuer?: string;
  year: string;
  detail?: string;
  /** id of an entry in src/data/links.ts; renders a "View" link once that entry has a URL. */
  documentId?: string;
};

export const resume = {
  name: "Sidharth Singh",
  headline: "Backend engineer building high-throughput distributed systems and AI-powered platforms",
  summary:
    "Backend-leaning engineer with 2+ years of production experience building high-throughput microservices, event-driven pipelines and AI-assisted workflows for procurement, logistics and supply-chain platforms. Rust (Actix Web, Tokio) and TypeScript (NestJS) for services, Python (FastAPI) for data-heavy workflows, Kafka for everything asynchronous, PostgreSQL and MongoDB at 100M+ document scale. Owns a feature end to end, from marketplace or carrier integration through to production, and treats AI coding tools as part of design, implementation and review.",
  experience: [
    {
      company: "1buy.ai",
      legalName: "Sharpbuy Global Solutions Pvt. Ltd.",
      url: "https://1buy.ai",
      role: "Software Engineer",
      start: "2026-03",
      end: null,
      location: "Okhla, Delhi",
      tagline:
        "AI-powered B2B electronic component intelligence, sourcing and procurement platform.",
      bullets: [
        "Design and run the order-fulfilment backend's architecture, built from scratch: a feature-first modular monolith in Python (FastAPI) shipped as one image in three roles (a 4-process API, N background workers, a leader-elected scheduler) over PostgreSQL as both source of truth and job queue, with SELECT … FOR UPDATE SKIP LOCKED claims, a stale-lease reclaim, a transactional outbox between bounded contexts and import-linter contracts in CI.",
        "Build the fulfilment workflows on it: purchase order to lab testing, shipment, customs and escrow, with DHL booking and tracking, FedEx tracking, and Claude parsing trade documents (packing lists, Bills of Entry, provider invoices).",
        "Own the inbound-mail pipeline: cheapest-first anchoring of every email to its order or shipment, a two-stage classify-then-act flow over a plug-in registry of 17 LLM handlers, per-step model routing, and dispatch through the outbox, with deterministic no-network tests.",
        "Design and build end-to-end backend services on a TypeScript, NestJS and MongoDB stack with hexagonal architecture, on an ultra-small engineering team.",
        "Engineer MongoDB aggregation pipelines and compound-indexing strategies over 100M+ pricing documents to power real-time component discovery.",
        "Build background jobs on 1buy.ai's Go job scheduler (goroutine worker pool, per-job Redis lock, Kafka events): the alert scanner evaluating five rule types over MongoDB with semaphore-bounded checks and emails, per-rule cooldowns and idempotent write-backs, plus the handler registration and boot-time seeding later handlers follow, and the refactor that made it a generic plug-in scheduler.",
        "Share pricing and formula logic between TypeScript and Rust through one Rust crate compiled to WebAssembly with wasm-bindgen, batches crossing a columnar Float64Array boundary, with parity tests on both sides.",
        "Develop automated RFQ ingestion pipelines and multi-currency calculation engines with Decimal128 precision, integrating LLM APIs into sourcing workflows.",
      ],
      stack: [
        "Python",
        "FastAPI",
        "PostgreSQL",
        "Redis",
        "Kafka",
        "TypeScript",
        "NestJS",
        "MongoDB",
        "Go",
        "Rust",
        "WebAssembly",
        "Claude API",
      ],
    },
    {
      company: "RapidShyp",
      legalName: "Om Logistics Limited",
      role: "Software Engineer",
      start: "2025-04",
      end: "2026-02",
      location: "Gurugram",
      tagline: "B2B logistics and shipping platform.",
      bullets: [
        "Owned the order-processing hot path end to end: Rust (Actix Web on the Tokio runtime) microservices with async handlers, serde-typed domain models and backpressure-aware worker pools, raising API concurrency and throughput and cutting latency under peak shipping loads, with Java services alongside.",
        "Hardened the Bulk Orders pipeline to take 20,000 orders in a single upload call, with validation and shipment creation kept off the request path so one large upload never blocks the API for other sellers.",
        "Designed and ran the Kafka event pipelines between services for real-time order processing, shipment status synchronisation and multi-seller fulfilment across marketplace and storefront channels, so downstream systems react to events instead of polling.",
        "Led the carrier and logistics partner integrations: shipment creation, tracking and status updates behind one service boundary, so a new carrier is an adapter rather than a rewrite and sellers on every channel ship through one platform.",
        "Scaled the data layer for high-volume logistics traffic: schema and query tuning across MongoDB and MySQL, Redis for low-latency caching, and TiKV with etcd for distributed key-value storage, service coordination and configuration.",
        "Carried features from design through release and production support on a small team; recognised with the Customer Obsession Award (May 2025) for feature ownership, rapid execution and reliable production delivery.",
      ],
      stack: ["Rust", "Actix Web", "Java", "Kafka", "MongoDB", "MySQL", "Redis", "TiKV", "etcd"],
    },
    {
      company: "RapidShyp",
      legalName: "Om Logistics Limited",
      role: "Associate Software Engineer",
      start: "2024-07",
      end: "2025-03",
      location: "Gurugram",
      bullets: [
        "Joined straight out of university and took end-to-end ownership of the B2B Bulk Orders and Purchase Requisition flows in the Order Management System: bulk upload and validation, multi-seller shipment creation, approval workflows and order orchestration at scale.",
        "Learned Rust on the job: started on the React and Next.js order-lifecycle dashboards and the Warehouse Management System frontend used daily by operations, then moved onto the Actix Web and Java microservices and the third-party carrier integrations behind them.",
        "Brought marketplace and multi-channel seller orders into one fulfilment pipeline, so every sales channel flows through the same order lifecycle and logistics integrations.",
        "Went one layer deeper than each ticket required: async Rust and the Tokio runtime, Kafka's consumer model, MongoDB and MySQL indexing, and Docker for reproducible local environments, which set up the hot-path work of the following year.",
        "Won first place across all engineering teams in the RapidShyp internal hackathon (Mar 2025), for an innovative prototype built under tight time constraints, and was promoted to Software Engineer the following month.",
      ],
      stack: ["Rust", "Java", "React", "Next.js", "MongoDB", "MySQL", "Docker"],
    },
  ] satisfies Experience[],
  education: [
    {
      school: "Vellore Institute of Technology (VIT), Vellore",
      degree: "B.Tech, Computer Science & Engineering (Bioinformatics)",
      start: "2020-09",
      end: "2024-06",
      detail: "CGPA 8.22 / 10",
      documentId: "btech-degree",
    },
  ] satisfies Education[],
  awards: [
    {
      title: "First place, RapidShyp internal hackathon 2025",
      year: "2025",
      detail: "Across all engineering teams, for an innovative prototype built under tight time constraints (Mar 2025)",
      documentId: "rapidshyp-hackathon-2025",
    },
    {
      title: "Customer Obsession Award, RapidShyp",
      year: "2025",
      detail: "For exceptional feature ownership, rapid execution, going the extra mile and reliable production delivery (May 2025)",
      documentId: "customer-obsession-award",
    },
  ] satisfies Credential[],
  certifications: [
    {
      title: "Google Cloud Computing Foundations",
      issuer: "Google & VIT",
      year: "2023",
      documentId: "google-cloud-foundations",
    },
    {
      title: "Modern Application Development with Java Spring Boot",
      issuer: "VMware IT Academy",
      year: "2023",
      documentId: "vmware-spring-boot",
    },
    {
      title: "Core Technical Skills (Docker, Kubernetes, MongoDB)",
      issuer: "VMware IT Academy",
      year: "2023",
      documentId: "vmware-it-academy",
    },
  ] satisfies Credential[],
  skills: {
    Languages: ["Rust", "TypeScript", "JavaScript", "Python", "Java", "SQL", "Go"],
    "Backend & APIs": [
      "Actix Web",
      "Tokio",
      "NestJS",
      "FastAPI",
      "Spring Boot",
      "REST APIs",
      "gRPC",
      "WebSockets",
      "Hexagonal architecture",
      "Modular monoliths",
      "Microservices",
    ],
    "Data & messaging": ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Apache Kafka", "etcd", "TiKV"],
    "Infra & cloud": ["Docker", "Kubernetes", "AWS (EC2, S3, Lambda)", "CI/CD", "Linux"],
    "AI & search": ["LLM integration (Claude)", "RAG", "Atlas Vector Search", "pgvector", "AI document parsing"],
    Frontend: ["React", "Next.js"],
  } as Record<string, string[]>,
  /** Slugs under content/projects to list on the resume. */
  projectSlugs: ["dmpnn-drug-property-predictor", "personal-rag"],
};
