import { SystemSketch } from "@/components/sketch/system-sketch";
import type { SketchEdge, SketchNode } from "@/lib/diagram";
import { cn } from "@/lib/utils";

type DiagramProps = {
  title: string;
  nodes: SketchNode[];
  edges: SketchEdge[];
  caption?: React.ReactNode;
  /** Packets per edge; 0 for a still diagram. */
  packets?: number;
  className?: string;
};

/**
 * A system sketch inside an article. Declare nodes and edges; layout, theme
 * colours and the animated packets are handled for you. Use <Figure> instead
 * once you have a real architecture image.
 */
export function Diagram({ title, nodes, edges, caption, packets = 1, className }: DiagramProps) {
  return (
    <figure className={cn("mdx-figure not-prose", className)}>
      <div className="mdx-figure-frame mdx-diagram">
        <SystemSketch spec={{ nodes, edges }} title={title} size="full" packets={packets} />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
