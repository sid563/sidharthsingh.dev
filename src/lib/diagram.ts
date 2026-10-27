/**
 * System sketches: a tiny declarative diagram language and a deterministic
 * left-to-right layout for it. Dependency-free so both server and client
 * components can render the result (see src/components/sketch/system-sketch.tsx).
 *
 * A spec lists nodes and directed edges. Each node's column is the longest
 * path from any source node, so "a -> b -> c" lands in three columns and a
 * fan-out shares one. Back edges (to an earlier column) are drawn as a loop
 * underneath. Nothing here is clever on purpose: the diagrams are small.
 */

export type SketchNodeKind =
  | "client"
  | "service"
  | "worker"
  | "queue"
  | "db"
  | "cache"
  | "external"
  | "model"
  | "file";

export type SketchNode = {
  id: string;
  label: string;
  kind?: SketchNodeKind;
  note?: string;
};

export type SketchEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
};

export type SketchSpec = {
  nodes: SketchNode[];
  edges: SketchEdge[];
};

export type SketchSize = "card" | "full" | "hero";

export type Geometry = {
  /** Minimum node width; nodes grow to fit their label and note. */
  nodeW: number;
  nodeH: number;
  colGap: number;
  rowGap: number;
  pad: number;
  /** Extra room under the diagram for edge labels and back-edge loops. */
  loopDrop: number;
  /** Font sizes the renderer uses, needed here to size boxes to text. */
  labelFont: number;
  noteFont: number;
  glyph: number;
};

export const geometries: Record<SketchSize, Geometry> = {
  card: { nodeW: 112, nodeH: 42, colGap: 44, rowGap: 16, pad: 6, loopDrop: 32, labelFont: 12, noteFont: 10, glyph: 14 },
  full: { nodeW: 140, nodeH: 54, colGap: 64, rowGap: 22, pad: 8, loopDrop: 42, labelFont: 15, noteFont: 12, glyph: 16 },
  hero: { nodeW: 150, nodeH: 58, colGap: 88, rowGap: 26, pad: 8, loopDrop: 46, labelFont: 15, noteFont: 12, glyph: 16 },
};

/** Monospace glyphs are ~0.6em wide; Geist Mono is a touch wider. */
const CHAR = 0.62;

export type LayoutOptions = {
  /** Thumbnails hide notes and edge labels, so boxes size to labels only. */
  compact?: boolean;
};

function nodeWidth(node: SketchNode, g: Geometry, compact: boolean): number {
  const label = node.label.length * g.labelFont * CHAR;
  const note = compact ? 0 : (node.note?.length ?? 0) * g.noteFont * CHAR;
  const text = Math.max(label, note);
  // 12px inset + glyph + 8px gap + text + 14px right inset
  return Math.max(g.nodeW, Math.ceil(12 + g.glyph + 8 + text + 14));
}

export type LaidOutNode = SketchNode & { x: number; y: number; w: number; h: number; column: number };

export type LaidOutEdge = SketchEdge & {
  /** SVG path data, also used as the motion path for packets. */
  d: string;
  /** Where to put the label. */
  mid: { x: number; y: number };
  /** Rough path length, used to keep packet speed uniform across edges. */
  length: number;
  back: boolean;
};

export type SketchLayout = {
  width: number;
  height: number;
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
  geometry: Geometry;
};

/** Longest-path layering. Cycles are broken at the edge that closes them. */
function columnsFor(spec: SketchSpec): { column: Map<string, number>; backEdges: Set<number> } {
  const ids = spec.nodes.map((n) => n.id);
  const index = new Map(ids.map((id, i) => [id, i]));
  const out = new Map<string, number[]>(ids.map((id) => [id, []]));
  // Dashed edges are secondary paths (retries, publishes back into a queue):
  // they are drawn but never decide a node's column.
  for (const [i, e] of spec.edges.entries()) {
    if (e.dashed) continue;
    if (index.has(e.from) && index.has(e.to) && e.from !== e.to) out.get(e.from)!.push(i);
  }

  // Depth-first search in declaration order; an edge to a node on the current
  // stack closes a cycle and becomes a back edge.
  const backEdges = new Set<number>();
  const state = new Map<string, "open" | "done">();
  const visit = (id: string) => {
    state.set(id, "open");
    for (const ei of out.get(id) ?? []) {
      const to = spec.edges[ei].to;
      const s = state.get(to);
      if (s === "open") backEdges.add(ei);
      else if (s === undefined) visit(to);
    }
    state.set(id, "done");
  };
  for (const id of ids) if (!state.has(id)) visit(id);

  const column = new Map<string, number>();
  const longest = (id: string): number => {
    const cached = column.get(id);
    if (cached !== undefined) return cached;
    let best = 0;
    for (const [ei, e] of spec.edges.entries()) {
      if (e.to !== id || e.dashed || backEdges.has(ei) || !index.has(e.from) || e.from === e.to) continue;
      best = Math.max(best, longest(e.from) + 1);
    }
    column.set(id, best);
    return best;
  };
  for (const id of ids) longest(id);
  return { column, backEdges };
}

export function layoutSketch(
  spec: SketchSpec,
  size: SketchSize = "full",
  options: LayoutOptions = {},
): SketchLayout {
  const g = geometries[size];
  const compact = options.compact ?? size === "card";
  const { column, backEdges } = columnsFor(spec);

  const byColumn = new Map<number, SketchNode[]>();
  for (const node of spec.nodes) {
    const c = column.get(node.id) ?? 0;
    byColumn.set(c, [...(byColumn.get(c) ?? []), node]);
  }
  const columnCount = Math.max(...byColumn.keys()) + 1;
  const tallest = Math.max(...[...byColumn.values()].map((nodes) => nodes.length));
  const innerH = tallest * g.nodeH + (tallest - 1) * g.rowGap;

  // Each column is as wide as its widest node; x positions accumulate.
  const widths = new Map<string, number>(spec.nodes.map((n) => [n.id, nodeWidth(n, g, compact)]));
  const columnW: number[] = [];
  for (let c = 0; c < columnCount; c++) {
    columnW[c] = Math.max(g.nodeW, ...(byColumn.get(c) ?? []).map((n) => widths.get(n.id) ?? g.nodeW));
  }
  const columnX: number[] = [];
  for (let c = 0; c < columnCount; c++) {
    columnX[c] = c === 0 ? g.pad : columnX[c - 1] + columnW[c - 1] + g.colGap;
  }

  const placed = new Map<string, LaidOutNode>();
  for (let c = 0; c < columnCount; c++) {
    const nodes = byColumn.get(c) ?? [];
    const colH = nodes.length * g.nodeH + (nodes.length - 1) * g.rowGap;
    const top = g.pad + (innerH - colH) / 2;
    nodes.forEach((node, r) => {
      placed.set(node.id, {
        ...node,
        column: c,
        w: widths.get(node.id) ?? g.nodeW,
        h: g.nodeH,
        x: columnX[c],
        y: top + r * (g.nodeH + g.rowGap),
      });
    });
  }

  let hasBack = false;
  const edges: LaidOutEdge[] = [];
  spec.edges.forEach((edge, i) => {
    const a = placed.get(edge.from);
    const b = placed.get(edge.to);
    if (!a || !b || a === b) return;
    const back = backEdges.has(i) || b.column <= a.column;
    if (back) {
      hasBack = true;
      const x1 = a.x + a.w / 2;
      const y1 = a.y + a.h;
      const x2 = b.x + b.w / 2;
      const y2 = b.y + b.h;
      const drop = Math.max(y1, y2) + g.loopDrop;
      const d = `M ${x1} ${y1} C ${x1} ${drop}, ${x2} ${drop}, ${x2} ${y2}`;
      // Lowest point of this cubic is 0.75·drop + 0.125·(y1 + y2); label sits under it.
      const bottom = 0.75 * drop + 0.125 * (y1 + y2);
      edges.push({
        ...edge,
        d,
        back,
        mid: { x: (x1 + x2) / 2, y: bottom + g.noteFont + 4 },
        length: Math.abs(x1 - x2) + g.loopDrop * 1.6,
      });
      return;
    }
    const x1 = a.x + a.w;
    const y1 = a.y + a.h / 2;
    const x2 = b.x;
    const y2 = b.y + b.h / 2;
    const bend = Math.max(24, (x2 - x1) / 2);
    const d = `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
    edges.push({
      ...edge,
      d,
      back,
      mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 9 },
      length: Math.hypot(x2 - x1, y2 - y1) * 1.05,
    });
  });

  const width = columnX[columnCount - 1] + columnW[columnCount - 1] + g.pad;
  const height = g.pad * 2 + innerH + (hasBack ? Math.ceil(g.loopDrop * 0.75 + g.noteFont + 14) : 0);

  return { width, height, nodes: [...placed.values()], edges, geometry: g };
}

/** Stable short id from a string, for SVG marker ids that must be unique per instance. */
export function sketchHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
