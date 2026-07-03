import { useId, type SVGProps } from 'react';
import { cn } from '../cn';

/** Catalog variant names (`lockin90-design/charts/sankey-charts.html`, SK-01…SK-13). */
export type SankeyVariant =
  | 'duo-flow'
  | 'source-split'
  | 'merge-flow'
  | 'zone-outcomes'
  | 'three-stage'
  | 'highlight-path'
  | 'labeled-nodes'
  | 'thin-streams'
  | 'chord-factors';

/** SK-01 ribbon-style SELECT: `solid` src-colored 40% (default) · `spectrum`
 *  hue-by-link-index · `glass` frosted white 14% · `gradient` src→dst 55%. */
export type SankeyRibbonStyle = 'solid' | 'spectrum' | 'glass' | 'gradient';

/** One node of a sankey column. Column heights are normalized: each node fills
 *  `value / Σvalues` of the column (8px gaps between nodes). */
export interface SankeyNode {
  /** node weight — relative share of its column */
  value: number;
  /** node + default ribbon color (token `var()`/hex). Column fallback: mint/cyan/violet trio */
  color?: string;
  /** chip-pill label beside the node (left + right columns; catalog defaults when omitted) */
  label?: string;
}

/** One ribbon. `fromSize`/`toSize` are fractions (0–1) of the source/target
 *  node heights — ribbons stack down each node face in array order (the
 *  catalog's `usedIn`/`usedOut` offset bookkeeping). */
export interface SankeyLink {
  /** source node index (left column — or middle column when `stages` are set) */
  from: number;
  /** target node index (right column) */
  to: number;
  /** fraction of the SOURCE node's height this ribbon leaves from */
  fromSize: number;
  /** fraction of the TARGET node's height this ribbon lands on */
  toSize: number;
  /** ribbon color override (default: source node color) */
  color?: string;
}

/** A factor node on the `chord-factors` circle. */
export interface SankeyFactor {
  label: string;
  color?: string;
}

/** A chord between two factors — `strength` drives the stroke width (×0.9). */
export interface SankeyChord {
  from: number;
  to: number;
  strength: number;
}

export interface SankeyChartProps
  extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'children' | 'color' | 'opacity'> {
  /** chart form (default `'duo-flow'`, SK-01) */
  variant?: SankeyVariant;
  /** left column nodes (flow variants) */
  sources?: SankeyNode[];
  /** right column nodes (flow variants) */
  targets?: SankeyNode[];
  /** middle column nodes — `three-stage` (SK-06) only */
  stages?: SankeyNode[];
  /** main ribbons: sources→targets, or stages→targets when `stages` are set */
  links?: SankeyLink[];
  /** `three-stage` pre-ribbons: sources→stages, drawn first so the middle
   *  column's in/out offsets line up */
  preLinks?: SankeyLink[];
  /** `chord-factors` circle nodes */
  factors?: SankeyFactor[];
  /** `chord-factors` links through the center */
  chords?: SankeyChord[];
  /** SK-01 SELECT — ribbon paint style (default `'solid'`) */
  ribbonStyle?: SankeyRibbonStyle;
  /** link index drawn at 85% while the rest dim to 14% (SK-09; defaults to `1`
   *  for `variant="highlight-path"`, otherwise off). Pass `null` to disable. */
  highlight?: number | null;
  /** ribbon opacity override (default 0.4 links / 0.35 preLinks) */
  ribbonOpacity?: number;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** chip-pill node labels on the left/right columns (default true) */
  showLabels?: boolean;
  /** glow underlay behind the ribbons / chords (the catalog blur modifier) */
  shine?: boolean;
  /** rendered width in px — the 320×150 viewBox scales to fit */
  width?: number;
  /** rendered height in px */
  height?: number;
  /** web `aria-label` / native `accessibilityLabel` (default: generated from
   *  the variant + node labels) */
  ariaLabel?: string;
}

/* ------------------------------------------------------------------ geometry
 * The catalog canvas (lockin90-design/charts/catalog.js): 320×150, padding
 * l10 r12 t16 b14. Node stacks fill SPAN with 8px gaps; ribbons are cubic
 * beziers with the control x at the midpoint. */
const W = 320;
const H = 150;
const P = { l: 10, r: 12, t: 16, b: 14 };
const TOP = P.t + 4;
const BOT = H - P.b - 4;
const SPAN = BOT - TOP;
const NW = 8; // node width
const GAP = 8; // vertical gap between stacked nodes

const TRIO = ['var(--mint)', 'var(--cyan)', 'var(--violet)'];
const SPECTRUM = [
  'var(--lime)',
  'var(--mint)',
  'var(--cyan)',
  'var(--indigo)',
  'var(--violet)',
  'var(--magenta)',
];

const MONO = "var(--font-mono)";

/* chip-pill fill — the catalog tag()'s rgba(8,10,18,0.78) = --bg-0 @ 78% */
const TAG_FILL = 'color-mix(in srgb, var(--bg-0) 78%, transparent)';
/* SK-13 circle guide — the catalog's rgba(255,255,255,0.07) = --text @ 7% */
const CHORD_RING = 'color-mix(in srgb, var(--text) 7%, transparent)';
/* SK-11 "LOST" sink — the catalog's rgba(255,255,255,0.25) = --text @ 25% */
const FAINT_NODE = 'color-mix(in srgb, var(--text) 25%, transparent)';

/** catalog default column labels (left / right; single-node columns read TODAY / ENERGY) */
const DEFAULT_LEFT_LABELS = ['SLEEP', 'TRAINING', 'NUTRITION', 'LIGHT'];
const DEFAULT_RIGHT_LABELS = ['ENERGY', 'STRAIN', 'FOCUS'];

interface FlowDefaults {
  sources: SankeyNode[];
  targets: SankeyNode[];
  stages?: SankeyNode[];
  links: SankeyLink[];
  preLinks?: SankeyLink[];
}

const lk = (from: number, to: number, fromSize: number, toSize: number, color?: string): SankeyLink =>
  color === undefined ? { from, to, fromSize, toSize } : { from, to, fromSize, toSize, color };

/** Per-variant catalog demo data (the CFG entries) so a bare
 *  `<SankeyChart variant="…"/>` reproduces its catalog card. */
const FLOW_DEFAULTS: Record<Exclude<SankeyVariant, 'chord-factors'>, FlowDefaults> = {
  'duo-flow': {
    sources: [{ value: 0.6 }, { value: 0.4 }],
    targets: [{ value: 0.55 }, { value: 0.45 }],
    links: [lk(0, 0, 0.7, 0.75), lk(0, 1, 0.3, 0.35), lk(1, 0, 0.35, 0.25), lk(1, 1, 0.65, 0.65)],
  },
  'source-split': {
    sources: [{ value: 1, color: 'var(--accent)' }],
    targets: [{ value: 0.45 }, { value: 0.33 }, { value: 0.22 }],
    links: [lk(0, 0, 0.45, 1), lk(0, 1, 0.33, 1), lk(0, 2, 0.22, 1)],
  },
  'merge-flow': {
    sources: [{ value: 0.45 }, { value: 0.33 }, { value: 0.22 }],
    targets: [{ value: 1, color: 'var(--mint)' }],
    links: [lk(0, 0, 1, 0.45), lk(1, 0, 1, 0.33), lk(2, 0, 1, 0.22)],
  },
  'zone-outcomes': {
    sources: [
      { value: 0.5, color: 'var(--cyan)', label: 'HABITS' },
      { value: 0.5, color: 'var(--violet)', label: 'SLEEP' },
    ],
    targets: [
      { value: 0.45, color: 'var(--zone-high)', label: 'GOOD' },
      { value: 0.35, color: 'var(--zone-mid)', label: 'OK' },
      { value: 0.2, color: 'var(--zone-low)', label: 'ROUGH' },
    ],
    links: [
      lk(0, 0, 0.6, 0.6),
      lk(0, 1, 0.3, 0.4),
      lk(0, 2, 0.1, 0.25),
      lk(1, 0, 0.35, 0.4),
      lk(1, 1, 0.35, 0.6),
      lk(1, 2, 0.3, 0.75),
    ],
  },
  'three-stage': {
    sources: [{ value: 0.55 }, { value: 0.45 }],
    stages: [
      { value: 0.4, color: 'var(--cyan)' },
      { value: 0.35, color: 'var(--indigo)' },
      { value: 0.25, color: 'var(--violet)' },
    ],
    targets: [
      { value: 0.6, color: 'var(--mint)' },
      { value: 0.4, color: 'var(--zone-low)' },
    ],
    preLinks: [lk(0, 0, 0.6, 0.8), lk(0, 1, 0.4, 0.6), lk(1, 1, 0.35, 0.4), lk(1, 2, 0.65, 1)],
    // explicit link colors reproduce the catalog card (its mid→right ribbons
    // reuse the left trio by source index)
    links: [
      lk(0, 0, 1, 0.55, 'var(--mint)'),
      lk(1, 0, 0.6, 0.45, 'var(--cyan)'),
      lk(1, 1, 0.4, 0.35, 'var(--cyan)'),
      lk(2, 1, 1, 0.65, 'var(--violet)'),
    ],
  },
  'highlight-path': {
    sources: [{ value: 0.5 }, { value: 0.5 }],
    targets: [{ value: 0.45 }, { value: 0.55 }],
    links: [lk(0, 0, 0.6, 0.6), lk(0, 1, 0.4, 0.35), lk(1, 0, 0.3, 0.4), lk(1, 1, 0.7, 0.65)],
  },
  'labeled-nodes': {
    sources: [
      { value: 0.6, label: 'SLEEP' },
      { value: 0.4, label: 'TRAINING' },
    ],
    targets: [
      { value: 0.55, label: 'ENERGY' },
      { value: 0.45, label: 'STRAIN' },
    ],
    links: [lk(0, 0, 0.75, 0.7), lk(0, 1, 0.25, 0.3), lk(1, 0, 0.3, 0.3), lk(1, 1, 0.7, 0.7)],
  },
  'thin-streams': {
    sources: [
      { value: 0.28, color: 'var(--lime)', label: 'SLEEP' },
      { value: 0.26, color: 'var(--mint)', label: 'FOOD' },
      { value: 0.24, color: 'var(--cyan)', label: 'TRAIN' },
      { value: 0.22, color: 'var(--violet)', label: 'SUN' },
    ],
    targets: [
      { value: 0.55, color: 'var(--mint)', label: 'ENERGY' },
      { value: 0.45, color: FAINT_NODE, label: 'LOST' },
    ],
    links: [
      lk(0, 0, 1, 0.3),
      lk(1, 0, 0.8, 0.25),
      lk(1, 1, 0.2, 0.15),
      lk(2, 0, 0.6, 0.25),
      lk(2, 1, 0.4, 0.3),
      lk(3, 0, 0.4, 0.2),
      lk(3, 1, 0.6, 0.55),
    ],
  },
};

/** SK-13 catalog demo factors + links. */
const DEFAULT_FACTORS: SankeyFactor[] = [
  { label: 'SLEEP', color: 'var(--mint)' },
  { label: 'HRV', color: 'var(--cyan)' },
  { label: 'TRAIN', color: 'var(--violet)' },
  { label: 'FOOD', color: 'var(--lime)' },
  { label: 'MOOD', color: 'var(--zone-mid)' },
];
const DEFAULT_CHORDS: SankeyChord[] = [
  { from: 0, to: 1, strength: 8 },
  { from: 0, to: 4, strength: 6 },
  { from: 1, to: 4, strength: 5 },
  { from: 2, to: 1, strength: 4 },
  { from: 3, to: 0, strength: 5 },
  { from: 2, to: 3, strength: 3 },
  { from: 3, to: 4, strength: 4 },
];

interface StackNode {
  x: number;
  y: number;
  h: number;
  usedIn: number;
  usedOut: number;
  color: string;
  label?: string;
}

/** Stack a column's nodes down SPAN: 8px gaps, heights ∝ values. */
function stack(nodes: SankeyNode[], x: number): StackNode[] {
  const gaps = (nodes.length - 1) * GAP;
  const avail = SPAN - gaps;
  const sum = nodes.reduce((a, nd) => a + nd.value, 0) || 1;
  let y = TOP;
  return nodes.map((nd, i) => {
    const h = (avail * nd.value) / sum;
    const out: StackNode = {
      x,
      y,
      h,
      usedIn: 0,
      usedOut: 0,
      color: nd.color ?? TRIO[i % TRIO.length]!,
    };
    if (nd.label !== undefined) out.label = nd.label;
    y += h + GAP;
    return out;
  });
}

/** Cubic-bezier ribbon between a source face slot and a target face slot —
 *  advances each node's in/out offset so parallel ribbons stack cleanly. */
function ribbonPath(a: StackNode, b: StackNode, fa: number, fb: number): string {
  const y1 = a.y + a.usedOut;
  const h1 = a.h * fa;
  a.usedOut += h1;
  const y2 = b.y + b.usedIn;
  const h2 = b.h * fb;
  b.usedIn += h2;
  const x1 = a.x + NW;
  const x2 = b.x;
  const mx = (x1 + x2) / 2;
  return (
    `M${x1} ${y1.toFixed(1)}` +
    `C${mx} ${y1.toFixed(1)} ${mx} ${y2.toFixed(1)} ${x2} ${y2.toFixed(1)}` +
    `L${x2} ${(y2 + h2).toFixed(1)}` +
    `C${mx} ${(y2 + h2).toFixed(1)} ${mx} ${(y1 + h1).toFixed(1)} ${x1} ${(y1 + h1).toFixed(1)}Z`
  );
}

/** polar point — 0° at 12 o'clock, clockwise */
function polar(cx: number, cy: number, r: number, aDeg: number) {
  const a = ((aDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function Label({
  x,
  y,
  text,
  color = 'var(--text-faint)',
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={8.5}
      textAnchor={anchor}
      style={{ fontFamily: MONO, letterSpacing: '0.06em' }}
    >
      {text}
    </text>
  );
}

/** chip-pill series label (dark rect + tinted hairline) — `y` = pill center */
function Tag({
  x,
  y,
  text,
  color,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  const w = text.length * 5.35 + 12;
  let xa = anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2;
  xa = Math.max(P.l - 4, Math.min(xa, W - P.r - w + 4));
  return (
    <g>
      <rect
        x={xa.toFixed(1)}
        y={(y - 6.5).toFixed(1)}
        width={w.toFixed(1)}
        height={13}
        rx={6.5}
        fill={TAG_FILL}
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <text
        x={(xa + w / 2).toFixed(1)}
        y={(y + 2.8).toFixed(1)}
        fill={color}
        fontSize={8}
        textAnchor="middle"
        style={{ fontFamily: MONO, letterSpacing: '0.05em' }}
      >
        {text}
      </text>
    </g>
  );
}

/**
 * SankeyChart — the kit's flow-diagram chart (catalog family `sankey-charts`,
 * SK-01…SK-13). Two forms:
 *
 * - **Flow variants** — 2 (or 3 with `stages`) node columns joined by
 *   cubic-bezier ribbons whose end heights are fractions of the node faces.
 *   Variants differ in demo data + emphasis: `duo-flow` (SK-01, ribbon-style
 *   SELECT via `ribbonStyle`), `source-split` (SK-02), `merge-flow` (SK-03),
 *   `zone-outcomes` (SK-05), `three-stage` (SK-06, `stages` + `preLinks`),
 *   `highlight-path` (SK-09, one ribbon 85% / rest 14%), `labeled-nodes`
 *   (SK-10), `thin-streams` (SK-11).
 * - **`chord-factors`** (SK-13) — factor nodes on a circle with
 *   strength-weighted chords through the center + glow dots + chip labels.
 *
 * Geometry is the catalog's 320×150 canvas (scaled via `width`/`height`);
 * every color is a token. Real data goes in via `sources`/`targets`/`links`
 * (or `factors`/`chords`); each variant carries its catalog card as default.
 */
export function SankeyChart({
  variant = 'duo-flow',
  sources,
  targets,
  stages,
  links,
  preLinks,
  factors = DEFAULT_FACTORS,
  chords = DEFAULT_CHORDS,
  ribbonStyle = 'solid',
  highlight,
  ribbonOpacity,
  title,
  showLabels = true,
  shine = false,
  width = W,
  height = H,
  ariaLabel,
  className,
  ...rest
}: SankeyChartProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  /* ------------------------------------------------------- SK-13 · chord */
  if (variant === 'chord-factors') {
    const cx = W / 2;
    const cy = H / 2 + 8;
    const R = 46;
    const step = 360 / Math.max(1, factors.length);
    const colorOf = (i: number) => factors[i]?.color ?? SPECTRUM[i % SPECTRUM.length]!;
    return (
      <svg
        className={cn('lk-sankey', className)}
        width={width}
        height={height}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel ?? `Factor chord diagram: ${factors.map((f) => f.label).join(', ')}`}
        {...rest}
      >
        <Label x={P.l + 2} y={11} text={title ?? 'FACTOR LINKS · 30D'} anchor="start" />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={CHORD_RING} strokeWidth={1} />
        {chords.map((c, i) => {
          const p1 = polar(cx, cy, R, c.from * step);
          const p2 = polar(cx, cy, R, c.to * step);
          const d = `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)}Q${cx} ${cy} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
          const col = colorOf(c.from);
          return (
            <g key={i}>
              {shine ? (
                <path
                  d={d}
                  fill="none"
                  stroke={col}
                  strokeWidth={c.strength * 0.9 + 4}
                  strokeLinecap="round"
                  opacity={0.3}
                  style={{ filter: 'blur(5px)' }}
                />
              ) : null}
              <path
                d={d}
                fill="none"
                stroke={col}
                strokeWidth={c.strength * 0.9}
                strokeLinecap="round"
                opacity={0.3}
              />
            </g>
          );
        })}
        {factors.map((f, i) => {
          const pn = polar(cx, cy, R, i * step);
          const pl = polar(cx, cy, R + 13, i * step);
          const col = colorOf(i);
          return (
            <g key={f.label}>
              <circle
                cx={pn.x.toFixed(1)}
                cy={pn.y.toFixed(1)}
                r={5}
                fill={col}
                style={{ filter: `drop-shadow(0 0 4px ${col})` }}
              />
              {showLabels ? <Tag x={pl.x} y={pl.y} text={f.label} color={col} /> : null}
            </g>
          );
        })}
      </svg>
    );
  }

  /* ------------------------------------------------------- flow variants */
  const def = FLOW_DEFAULTS[variant];
  const src = sources ?? def.sources;
  const dst = targets ?? def.targets;
  const mid = stages ?? def.stages;
  const flows = links ?? def.links;
  const pre = preLinks ?? def.preLinks ?? [];
  const hl = highlight === undefined ? (variant === 'highlight-path' ? 1 : null) : highlight;

  const L = stack(src, P.l + 2);
  const Rr = stack(dst, W - P.r - NW - 2);
  const M = mid ? stack(mid, W / 2 - NW / 2) : null;

  // pre-ribbons FIRST so the middle column's in/out offsets line up (catalog order)
  const preRibbons = M
    ? pre.map((f) => {
        const a = L[f.from]!;
        const b = M[f.to]!;
        return {
          d: ribbonPath(a, b, f.fromSize, f.toSize),
          color: f.color ?? a.color,
          opacity: ribbonOpacity ?? 0.35,
        };
      })
    : [];

  const ribbons = flows.map((f, fi) => {
    const a = (M ?? L)[f.from]!;
    const b = Rr[f.to]!;
    const d = ribbonPath(a, b, f.fromSize, f.toSize);
    let color = f.color ?? a.color;
    let opacity = ribbonOpacity ?? 0.4;
    let gradient: { from: string; to: string } | null = null;
    if (ribbonStyle === 'spectrum') color = SPECTRUM[fi % SPECTRUM.length]!;
    else if (ribbonStyle === 'glass') {
      color = 'var(--text)';
      opacity = 0.14;
    } else if (ribbonStyle === 'gradient') {
      gradient = { from: color, to: b.color };
      opacity = 1;
    }
    // the catalog renderer lets a gradient fill win over the highlight dim
    if (hl != null && !gradient) opacity = fi === hl ? 0.85 : 0.14;
    return { d, color, opacity, gradient, dimmed: hl != null && fi !== hl };
  });

  const leftLabel = (i: number) =>
    L[i]?.label ?? (src.length === 1 ? 'TODAY' : DEFAULT_LEFT_LABELS[i] ?? '');
  const rightLabel = (i: number) =>
    Rr[i]?.label ?? (dst.length === 1 ? 'ENERGY' : DEFAULT_RIGHT_LABELS[i] ?? '');

  return (
    <svg
      className={cn('lk-sankey', className)}
      width={width}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={
        ariaLabel ??
        `${variant} flow: ${src.map((_, i) => leftLabel(i)).join(', ')} to ${dst
          .map((_, i) => rightLabel(i))
          .join(', ')}`
      }
      {...rest}
    >
      {ribbonStyle === 'gradient' ? (
        <defs>
          {ribbons.map((r, i) =>
            r.gradient ? (
              <linearGradient key={i} id={`lk-sk-${uid}-f${i}`} x1={0} y1={0} x2={1} y2={0}>
                <stop offset="0%" stopColor={r.gradient.from} stopOpacity={0.55} />
                <stop offset="100%" stopColor={r.gradient.to} stopOpacity={0.55} />
              </linearGradient>
            ) : null,
          )}
        </defs>
      ) : null}

      <Label x={P.l + 2} y={11} text={title ?? 'ENERGY FLOW · TODAY'} anchor="start" />

      {preRibbons.map((r, i) => (
        <path key={`pre-${i}`} d={r.d} fill={r.color} opacity={r.opacity} />
      ))}

      {ribbons.map((r, i) => {
        const fill = r.gradient ? `url(#lk-sk-${uid}-f${i})` : r.color;
        return (
          <g key={`f-${i}`}>
            {shine && !r.dimmed ? (
              <path d={r.d} fill={fill} opacity={0.35} style={{ filter: 'blur(6px)' }} />
            ) : null}
            <path d={r.d} fill={fill} opacity={r.opacity} />
          </g>
        );
      })}

      {[...L, ...(M ?? []), ...Rr].map((nd, i) => (
        <rect
          key={`n-${i}`}
          x={nd.x}
          y={nd.y.toFixed(1)}
          width={NW}
          height={nd.h.toFixed(1)}
          rx={3}
          fill={nd.color}
        />
      ))}

      {showLabels
        ? L.map((nd, i) => (
            <Tag
              key={`ll-${i}`}
              x={nd.x + NW + 6}
              y={nd.y + nd.h / 2}
              text={leftLabel(i)}
              color={nd.color}
              anchor="start"
            />
          ))
        : null}
      {showLabels
        ? Rr.map((nd, i) => (
            <Tag
              key={`rl-${i}`}
              x={nd.x - 6}
              y={nd.y + nd.h / 2}
              text={rightLabel(i)}
              color={nd.color}
              anchor="end"
            />
          ))
        : null}
    </svg>
  );
}
