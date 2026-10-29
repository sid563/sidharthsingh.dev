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
        "Building the order-fulfilment backend in Python (FastAPI), PostgreSQL and Kafka: purchase order to shipment to customs workflows with DHL carrier API integration, AI parsing of trade documents (packing lists, Bills of Entry) via Claude, and event-driven cross-department messaging.",
        "Designed the inbound-mail pipeline: cheapest-first anchoring of every email to its order or shipment, a two-stage classify-then-act flow over a plug-in registry of 16 LLM handlers, per-step model routing, and dispatch through a transactional outbox, with deterministic no-network tests.",
        "Design and build end-to-end backend services on a TypeScript, NestJS and MongoDB stack with hexagonal architecture, on an ultra-small engineering team.",
        "Engineered MongoDB aggregation pipelines and compound-indexing strategies over 100M+ pricing documents to power real-time component discovery.",
        "Rewrote the background job scheduler in Rust on Tokio: Arc<Semaphore>-bounded worker pools, atomic job claims and cancellation-safe tasks for concurrent, multi-instance processing without thread contention.",
        "Wrote shared pricing and formula logic once in Rust and compiled it to WebAssembly with wasm-bindgen, passing batches across a columnar Float64Array boundary, so the TypeScript and Rust codebases share one source of truth with parity tests on both sides.",
        "Developed automated RFQ ingestion pipelines and multi-currency calculation engines with Decimal128 precision, integrating LLM APIs into sourcing workflows.",
      ],
      stack: [
        "Python",
        "FastAPI",
        "PostgreSQL",
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
        "Designed and owned the B2B Bulk Orders and Purchase Requisition flows in the Order Management System: bulk upload and validation, multi-seller shipment creation, approval workflows and order orchestration at scale.",
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
