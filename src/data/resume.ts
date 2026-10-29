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
        "Run the background job scheduler I rewrote in Rust on Tokio: Arc<Semaphore>-bounded worker pools, atomic job claims and cancellation-safe tasks for concurrent, multi-instance processing without thread contention.",
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
        "Rust",
        "Tokio",
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
        "Engineered core backend microservices in Rust (Actix Web on the Tokio runtime) and Java: async handlers, serde-typed domain models and backpressure-aware worker pools, improving API concurrency and throughput while reducing latency under peak shipping loads.",
        "Built event-driven pipelines on Apache Kafka for real-time order processing, shipment status synchronisation and multi-seller fulfilment across marketplace and storefront sales channels.",
        "Integrated carrier and logistics partner APIs for shipment creation, tracking and status updates, so sellers on multiple sales channels ship through one platform.",
        "Integrated Redis for low-latency caching alongside TiKV and etcd for distributed key-value storage, service coordination and configuration management.",
        "Optimised schema design and query execution across MongoDB and MySQL for high-volume logistics read and write paths.",
        "Won first place across all engineering teams in the RapidShyp internal hackathon (Mar 2025) and the Customer Obsession Award (May 2025) for feature ownership, rapid execution and reliable production delivery.",
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
        "Designed and owned the B2B Bulk Orders and Purchase Requisition flows in the Order Management System: bulk upload and validation of 20,000 orders in a single call, multi-seller shipment creation, approval workflows and order orchestration at scale.",
        "Brought marketplace and multi-channel seller orders into one fulfilment pipeline, so every sales channel flows through the same order lifecycle and logistics integrations.",
        "Developed order-lifecycle dashboards and the internal Warehouse Management System frontend in React and Next.js, used daily by operations teams.",
        "Contributed to RESTful microservices in Rust (Actix Web) and Java, integrating third-party logistics carrier APIs.",
        "Containerised local development environments with Docker and optimised query patterns across MongoDB and MySQL.",
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
