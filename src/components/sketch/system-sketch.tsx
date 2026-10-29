import {
  layoutSketch,
  sketchHash,
  type SketchDirection,
  type SketchNodeKind,
  type SketchSize,
  type SketchSpec,
} from "@/lib/diagram";
import { cn } from "@/lib/utils";

/**
 * Renders a system sketch (src/lib/diagram.ts) as inline SVG.
 *
 * Hook-free and dependency-free so it works in server components, inside
 * client trees (project cards) and in MDX. Packets travel along each edge
 * with SMIL animateMotion, which every modern browser supports without
 * JavaScript; `.sketch-packets` is hidden for reduced-motion users (CSS).
 */
type SystemSketchProps = {
  spec: SketchSpec;
  /** Accessible name. Also seeds the per-instance SVG ids. */
  title: string;
  size?: SketchSize;
  /** Packets per edge; 0 disables motion entirely. */
  packets?: number;
  className?: string;
  /** Seconds for one packet to cross a typical edge. */
  speed?: number;
  /** "down" stacks the columns as rows; use it for narrow screens. */
  direction?: SketchDirection;
};

export function SystemSketch({
  spec,
  title,
  size = "full",
  packets = 2,
  className,
  speed = 2.8,
  direction = "right",
}: SystemSketchProps) {
  // Card thumbnails drop notes and edge labels: at thumbnail scale they are noise.
  const compact = size === "card";
  const layout = layoutSketch(spec, size, { compact, direction });
  const uid = `sk-${sketchHash(title + size + direction)}`;
  const { geometry: g } = layout;
  const font = g.labelFont;
  const noteFont = g.noteFont;
  const glyph = g.glyph;
  // Never shrink a full-size sketch below ~78% of natural size (it scrolls
  // sideways instead, see .mdx-diagram) and never enlarge any sketch past
  // ~110%: a three-box diagram in a wide frame should not become a poster.
  const minWidth = size === "full" ? `${Math.round(layout.width * 0.78)}px` : undefined;
  const maxWidth = `${Math.round(layout.width * 1.1)}px`;

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className={cn("sketch", `sketch-${size}`, className)}
      role="img"
      aria-labelledby={`${uid}-title`}
      preserveAspectRatio="xMidYMid meet"
      style={{ minWidth, maxWidth }}
    >
      <title id={`${uid}-title`}>{title}</title>
      <defs>
        <marker
          id={`${uid}-arrow`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 1 1 L 9 5 L 1 9" className="sketch-arrow" />
        </marker>
      </defs>

      <g className="sketch-edges">
        {layout.edges.map((edge, i) => (
          <g key={`${edge.from}-${edge.to}-${i}`}>
            <path
              d={edge.d}
              className={cn("sketch-edge", edge.dashed && "sketch-edge-dashed")}
              markerEnd={`url(#${uid}-arrow)`}
            />
            {edge.label && !compact ? (
              <text
                x={edge.mid.x}
                y={edge.mid.y}
                textAnchor="middle"
                className="sketch-edge-label"
                fontSize={noteFont}
              >
                {edge.label}
              </text>
            ) : null}
          </g>
        ))}
      </g>

      {packets > 0 ? (
        <g className="sketch-packets" aria-hidden>
          {layout.edges.flatMap((edge, i) =>
            Array.from({ length: packets }, (_, p) => {
              const dur = (speed * edge.length) / (g.nodeW + g.colGap);
              const begin = -((dur * (p + 0.37 * i)) / packets);
              return (
                <circle key={`${i}-${p}`} r={size === "card" ? 2.5 : 3} className="sketch-packet">
                  <animateMotion
                    dur={`${dur.toFixed(2)}s`}
                    begin={`${begin.toFixed(2)}s`}
                    repeatCount="indefinite"
                    path={edge.d}
                    calcMode="spline"
                    keySplines="0.4 0 0.6 1"
                    keyTimes="0;1"
                  />
                </circle>
              );
            }),
          )}
        </g>
      ) : null}

      <g className="sketch-nodes">
        {layout.nodes.map((node) => {
          const kind = node.kind ?? "service";
          const hasNote = Boolean(node.note) && !compact;
          const labelY = hasNote ? node.y + node.h / 2 - 4 : node.y + node.h / 2 + font * 0.36;
          return (
            <g key={node.id} className="sketch-node" data-kind={kind}>
              <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={10} className="sketch-node-box" />
              <Glyph kind={kind} x={node.x + 12} y={node.y + node.h / 2 - glyph / 2} size={glyph} />
              <text
                x={node.x + 12 + glyph + 8}
                y={labelY}
                fontSize={font}
                className="sketch-node-label"
              >
                {node.label}
              </text>
              {hasNote ? (
                <text
                  x={node.x + 12 + glyph + 8}
                  y={node.y + node.h / 2 + noteFont + 2}
                  fontSize={noteFont}
                  className="sketch-node-note"
                >
                  {node.note}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** 16x16 outline glyphs, one per node kind. Stroke colour comes from CSS. */
function Glyph({ kind, x, y, size }: { kind: SketchNodeKind; x: number; y: number; size: number }) {
  const s = size / 16;
  const common = { className: "sketch-glyph", transform: `translate(${x} ${y}) scale(${s})` };
  switch (kind) {
    case "db":
      return (
        <g {...common}>
          <ellipse cx="8" cy="3.5" rx="6" ry="2.5" />
          <path d="M2 3.5v9c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-9" />
          <path d="M2 8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5" />
        </g>
      );
    case "queue":
      return (
        <g {...common}>
          <rect x="1.5" y="4" width="13" height="8" rx="1.5" />
          <path d="M5 4v8M8.5 4v8M12 4v8" />
        </g>
      );
    case "worker":
      return (
        <g {...common}>
          <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
          <path d="M4.5 6.5h7M4.5 9.5h4.5" />
          <circle cx="11.5" cy="10.5" r="1" />
        </g>
      );
    case "cache":
      return (
        <g {...common}>
          <path d="M9 1.5 3 9h4.5l-.5 5.5 6-7.5H8.5z" />
        </g>
      );
    case "external":
      return (
        <g {...common}>
          <circle cx="8" cy="8" r="6.5" />
          <path d="M1.5 8h13M8 1.5c2.2 2 2.2 11 0 13M8 1.5c-2.2 2-2.2 11 0 13" />
        </g>
      );
    case "model":
      return (
        <g {...common}>
          <path d="M8 1.5c.6 3.5 2.9 5.8 6.5 6.5-3.6.7-5.9 3-6.5 6.5-.6-3.5-2.9-5.8-6.5-6.5C5.1 7.3 7.4 5 8 1.5z" />
        </g>
      );
    case "client":
      return (
        <g {...common}>
          <circle cx="8" cy="5" r="3" />
          <path d="M2.5 14.5c.6-3.2 2.8-4.8 5.5-4.8s4.9 1.6 5.5 4.8" />
        </g>
      );
    case "file":
      return (
        <g {...common}>
          <path d="M4 1.5h5.5L13 5v9.5H4z" />
          <path d="M9.5 1.5V5H13M6 8.5h4.5M6 11h4.5" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <rect x="1.5" y="3" width="13" height="10" rx="2" />
          <path d="M4.5 7h7M4.5 9.5h4" />
        </g>
      );
  }
}
