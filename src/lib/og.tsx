/**
 * Building blocks for the per-page Open Graph images, rendered by Satori
 * through next/og. Satori supports a flexbox subset and basic SVG shapes,
 * so the system sketch is drawn as SVG paths for edges plus absolutely
 * positioned boxes for nodes, with no CSS classes or SMIL.
 */
import { layoutSketch, type SketchNodeKind, type SketchSpec } from "@/lib/diagram";
import { site } from "@/data/site";

export const ogSize = { width: 1200, height: 630 };

export const og = {
  bg: "#0a0a0a",
  fg: "#fafafa",
  muted: "#a3a3a3",
  faint: "#737373",
  border: "#2a2a2a",
  card: "#141414",
  brand: "#f0a35e",
};

/** Cut text to a length that fits the card without ellipsis mid-word. */
export function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 20)).trimEnd()}…`;
}

type FrameProps = {
  eyebrow: string;
  title: string;
  summary?: string;
  chips?: string[];
  /** Rendered on the right; the text column shrinks to make room. */
  aside?: React.ReactNode;
  footerRight?: string;
};

/** Shared card: brand mark, eyebrow, title, summary, chips, host line. */
export function OgFrame({ eyebrow, title, summary, chips = [], aside, footerRight }: FrameProps) {
  const host = new URL(site.url).host;
  const titleSize = title.length > 60 ? 48 : title.length > 40 ? 56 : 64;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: og.bg,
        color: og.fg,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: og.fg,
            color: og.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          SS
        </div>
        <div style={{ display: "flex", fontSize: 22, color: og.brand, letterSpacing: 2, textTransform: "uppercase" }}>
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", gap: 48, alignItems: "center", flex: 1, marginTop: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, letterSpacing: -2, lineHeight: 1.08 }}>
            {title}
          </div>
          {summary ? (
            <div style={{ display: "flex", fontSize: 26, color: og.muted, lineHeight: 1.35 }}>{summary}</div>
          ) : null}
          {chips.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: `1px solid ${og.border}`,
                    background: og.card,
                    color: og.muted,
                    fontSize: 18,
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {aside ? <div style={{ display: "flex", flexShrink: 0 }}>{aside}</div> : null}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          color: og.faint,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: og.brand }} />
          {host}
        </div>
        <div style={{ display: "flex" }}>{footerRight ?? site.name}</div>
      </div>
    </div>
  );
}

const glyphPath: Record<SketchNodeKind, string> = {
  db: "M2 3.5a6 2.5 0 1 0 12 0a6 2.5 0 1 0 -12 0M2 3.5v9c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-9M2 8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5",
  queue: "M1.5 4h13v8h-13zM5 4v8M8.5 4v8M12 4v8",
  worker: "M1.5 2.5h13v11h-13zM4.5 6.5h7M4.5 9.5h4.5",
  cache: "M9 1.5 3 9h4.5l-.5 5.5 6-7.5H8.5z",
  external: "M8 1.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0 -13M1.5 8h13M8 1.5c2.2 2 2.2 11 0 13M8 1.5c-2.2 2-2.2 11 0 13",
  model: "M8 1.5c.6 3.5 2.9 5.8 6.5 6.5-3.6.7-5.9 3-6.5 6.5-.6-3.5-2.9-5.8-6.5-6.5C5.1 7.3 7.4 5 8 1.5z",
  client: "M8 2a3 3 0 1 0 0 6a3 3 0 1 0 0 -6M2.5 14.5c.6-3.2 2.8-4.8 5.5-4.8s4.9 1.6 5.5 4.8",
  file: "M4 1.5h5.5L13 5v9.5H4zM9.5 1.5V5H13M6 8.5h4.5M6 11h4.5",
  service: "M1.5 3h13v10h-13zM4.5 7h7M4.5 9.5h4",
};

/** The system sketch as Satori can draw it: SVG edges, HTML boxes, static packets. */
export function OgSketch({ spec, maxWidth = 440, maxHeight = 320 }: { spec: SketchSpec; maxWidth?: number; maxHeight?: number }) {
  const layout = layoutSketch(spec, "full", { compact: true });
  const scale = Math.min(maxWidth / layout.width, maxHeight / layout.height, 1.25);
  const w = Math.round(layout.width * scale);
  const h = Math.round(layout.height * scale);
  const font = Math.round(15 * scale);
  const glyph = Math.round(16 * scale);

  return (
    <div style={{ display: "flex", position: "relative", width: w, height: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${layout.width} ${layout.height}`} style={{ position: "absolute", top: 0, left: 0 }}>
        {layout.edges.map((edge, i) => (
          <path
            key={i}
            d={edge.d}
            fill="none"
            stroke="#5a5a5a"
            strokeWidth={1.5}
            strokeDasharray={edge.dashed ? "4 4" : undefined}
          />
        ))}
        {layout.edges.map((edge, i) => (
          <circle key={`p${i}`} cx={edge.mid.x} cy={edge.mid.y + (edge.back ? -6 : 9)} r={3.5} fill={og.brand} />
        ))}
      </svg>
      {layout.nodes.map((node) => (
        <div
          key={node.id}
          style={{
            position: "absolute",
            left: Math.round(node.x * scale),
            top: Math.round(node.y * scale),
            width: Math.round(node.w * scale),
            height: Math.round(node.h * scale),
            display: "flex",
            alignItems: "center",
            gap: Math.round(8 * scale),
            padding: `0 ${Math.round(12 * scale)}px`,
            borderRadius: Math.round(10 * scale),
            border: `1px solid #3a3a3a`,
            background: "#161616",
            color: og.fg,
            fontSize: font,
            fontWeight: 500,
          }}
        >
          <svg width={glyph} height={glyph} viewBox="0 0 16 16">
            <path d={glyphPath[node.kind ?? "service"]} fill="none" stroke={og.brand} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {node.label}
        </div>
      ))}
    </div>
  );
}
