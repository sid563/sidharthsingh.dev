import { SystemSketch } from "@/components/sketch/system-sketch";
import type { SketchSpec } from "@/lib/diagram";
import { cn } from "@/lib/utils";

/**
 * The signature visual: one living diagram of the kind of system described
 * in the hero copy. Two inputs, two pipelines, bounded workers, two
 * databases that have to agree. Every node is something that exists in the
 * project pages below; nothing here is decorative except the packets.
 * The dashed claim edge is the fulfilment backend's SKIP LOCKED queue.
 */
const spec: SketchSpec = {
  nodes: [
    { id: "orders", label: "Orders", kind: "client", note: "marketplace · 20k per upload" },
    { id: "mail", label: "Supplier mail", kind: "client", note: "every inbound email" },
    { id: "kafka", label: "Kafka", kind: "queue", note: "order.events" },
    { id: "agents", label: "Mail agents", kind: "model", note: "anchor · classify · act" },
    { id: "workers", label: "Rust workers", kind: "worker", note: "Arc<Semaphore> permits" },
    { id: "api", label: "Fulfilment service", kind: "service", note: "FastAPI · 3 roles" },
    { id: "mongo", label: "MongoDB", kind: "db", note: "100M+ documents" },
    { id: "pg", label: "PostgreSQL", kind: "db", note: "truth + task queue" },
  ],
  edges: [
    { from: "orders", to: "kafka" },
    { from: "mail", to: "agents" },
    { from: "kafka", to: "workers", label: "consume" },
    { from: "agents", to: "api", label: "dispatch" },
    { from: "workers", to: "mongo" },
    { from: "api", to: "pg" },
    { from: "pg", to: "workers", label: "claim", dashed: true },
  ],
};

export { spec as heroSpec };

export function HeroSketch({ className }: { className?: string }) {
  return (
    <figure className={cn("hero-sketch", className)}>
      <div className="hero-sketch-frame">
        {/* Phones get the same system stacked top to bottom; wider screens get the band. */}
        <div className="sm:hidden">
          <SystemSketch
            spec={spec}
            title="The shape of the systems I build"
            size="card"
            direction="down"
            packets={1}
            speed={3.2}
          />
        </div>
        <div className="hidden sm:block">
          <SystemSketch spec={spec} title="The shape of the systems I build" size="hero" packets={2} speed={3.2} />
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground">
        The shape of the work: orders and mail in, events through Kafka, work claimed from Postgres, workers
        bounded by permits, two databases kept in agreement.
      </figcaption>
    </figure>
  );
}
