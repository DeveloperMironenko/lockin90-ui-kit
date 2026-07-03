import type { SVGProps } from 'react';
import { cn } from '../cn';

/* StatTile — the catalog stat-tile (chartlet) family (ST-01/06/07/10,
   lockin90-design/charts/stat-tiles.html): KPI chartlets — big number + delta
   + micro-chart, the workhorse widgets, drawn in the fixed 320×150 catalog
   viewBox. ST-01's spark/bars/ring/progress cards and the verdict glow-dot
   are SELECT accessories, not separate variants. */

/** Catalog variant names (`lockin90-design/charts/stat-tiles.html`). */
export type StatTileVariant =
  | 'stat-tile' /* ST-01 — big number + delta · SELECT accessory */
  | 'hero-number' /* ST-06 — centered 52px number + delta + insight line */
  | 'duo-tile' /* ST-07 — two stats split by a hairline */
  | 'stat-list'; /* ST-10 — 3 rows: label + bold value + mini-spark */

/** ST-01 SELECT accessory — the micro-chart next to the number. */
export type StatTileAccessory = 'none' | 'spark' | 'bars' | 'ring' | 'progress';

/** One half of the `duo-tile` (ST-07). */
export interface StatTileStat {
  /** bold 26px value (e.g. '7:42') */
  value: string;
  /** faint label under the value (e.g. 'SLEEP') */
  label: string;
  /** delta line under the label (e.g. '+22 MIN'; omit to hide) */
  delta?: string;
  /** delta direction — up = mint chevron, down = coral (default true) */
  deltaUp?: boolean;
}

/** One row of the `stat-list` (ST-10). */
export interface StatTileRow {
  /** faint row label (e.g. 'ENERGY') */
  label: string;
  /** bold 16px value (e.g. '74') */
  value: string;
  /** mini-spark hue (token; default mint) */
  color?: string;
  /** mini-spark series (auto-normalized; default: a catalog wave) */
  data?: number[];
}

export interface StatTileProps
  extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'children' | 'color'> {
  /** tile form (default `'stat-tile'`, ST-01) */
  variant?: StatTileVariant;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** the big number (default '74'; hero renders it at 52px) */
  value?: string;
  /** delta text next to the chevron (e.g. '+6 VS YESTERDAY'; `''` hides) */
  delta?: string;
  /** delta direction — up = mint chevron, down = coral (default true) */
  deltaUp?: boolean;
  /** dim line under the number (e.g. 'ENERGY · UPDATED 14:36') */
  label?: string;
  /** ST-01 SELECT accessory: none / 16-pt spark / micro bars / goal ring /
   *  progress bar (default `'none'`) */
  accessory?: StatTileAccessory;
  /** `spark` (16 pts) / `bars` (8 pts) series, auto-normalized to the box */
  data?: number[];
  /** accessory hue (defaults: spark cyan · bars/ring/progress mint) */
  accessoryColor?: string;
  /** `ring` fill / `progress` fill, 0–1 (default 0.72) */
  progress?: number;
  /** `ring` center readout (default `${round(progress·100)}%`) */
  ringLabel?: string;
  /** verdict glow-dot color (e.g. `var(--zone-mid)`) — draws the dot and
   *  colors the number; the zone verdict at a glance */
  verdictColor?: string;
  /** chip-pill (verdict tag / trend note, e.g. 'RECOVERY DAY'; `''` hides) */
  pill?: string;
  /** pill tint (default `accessoryColor` → mint) */
  pillColor?: string;
  /** number color override (hero: `shine` turns it mint like the catalog) */
  color?: string;
  /** `duo-tile` — the two stats (default: the catalog's SLEEP + HRV pair) */
  stats?: [StatTileStat, StatTileStat];
  /** `stat-list` — the rows (default: the catalog's 3) */
  rows?: StatTileRow[];
  /** hero glow — a soft blurred duplicate behind the 52px number */
  shine?: boolean;
  /** rendered width in px — the 320×150 viewBox scales to fit */
  width?: number;
  /** rendered height in px */
  height?: number;
}

/* --------------------------------------------------------------- geometry
 * The catalog canvas: 320×150, pad l10 r12 t16 b14 (catalog.js). */
const W = 320;
const H = 150;
const P = { l: 10, r: 12, t: 16, b: 14 };

const MONO = 'var(--font-mono)';
const DISPLAY = 'var(--font-display)';

/* ------------------------------------------- catalog deterministic data
 * mulberry32 + genData ported from catalog.js so the default accessories
 * reproduce the catalog cards exactly (seeds: spark 21 · bars 31 · list
 * rows 11/12/13). */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp01 = (v: number) => Math.max(0.03, Math.min(0.97, v));

function genWave(seed: number, n: number): number[] {
  const r = mulberry32(seed);
  const ph = r() * 6;
  const f = 1.15 + r() * 0.5;
  const amp = 0.2 + r() * 0.08;
  const base = 0.48 + r() * 0.12;
  const v: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    v.push(clamp01(base + Math.sin(t * Math.PI * 2 * f + ph) * amp + (r() - 0.5) * 0.08));
  }
  return v;
}

function genNoisy(seed: number, n: number): number[] {
  const r = mulberry32(seed);
  const b = 0.5 + (r() - 0.5) * 0.1;
  const v: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    v.push(clamp01(b + Math.sin(t * Math.PI * 2.2 + r()) * 0.12 + (r() - 0.5) * 0.3));
  }
  return v;
}

const DEFAULT_SPARK = genWave(21, 16);
const DEFAULT_BARS = genNoisy(31, 8);

const DEFAULT_STATS: [StatTileStat, StatTileStat] = [
  { value: '7:42', label: 'SLEEP', delta: '+22 MIN', deltaUp: true },
  { value: '58', label: 'HRV MS', delta: '−4', deltaUp: false },
];

const DEFAULT_ROWS: StatTileRow[] = [
  { label: 'ENERGY', value: '74', color: 'var(--mint)', data: genWave(11, 16) },
  { label: 'SLEEP', value: '7:42', color: 'var(--violet)', data: genWave(12, 16) },
  { label: 'STRAIN', value: '14.2', color: 'var(--zone-mid)', data: genWave(13, 16) },
];

const DEFAULT_TITLES: Record<StatTileVariant, string> = {
  'stat-tile': 'ENERGY',
  'hero-number': 'ENERGY · NOW',
  'duo-tile': 'LAST NIGHT',
  'stat-list': 'TODAY · GLANCE',
};

/** approximate Space Grotesk 700 advance for the delta-x heuristic */
function numWidth(text: string, size: number): number {
  let w = 0;
  for (const ch of text) w += /[.,:'’]/.test(ch) ? 0.32 : 0.62;
  return w * size;
}

/** normalize a series to 0–1 (already-normalized data passes through) */
function normalize(data: number[]): number[] {
  if (data.length === 0) return data;
  const min = Math.min(...data);
  const max = Math.max(...data);
  if (min >= 0 && max <= 1) return data;
  const span = max - min || 1;
  return data.map((v) => (v - min) / span);
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (no overshoot). */
function smoothPath(p: { x: number; y: number }[]): string {
  const n = p.length;
  if (n < 3) return p.map((q, i) => `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join('');
  const dx: number[] = [];
  const m: number[] = [];
  const tg: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = p[i + 1]!.x - p[i]!.x;
    m[i] = (p[i + 1]!.y - p[i]!.y) / dx[i]!;
  }
  tg[0] = m[0]!;
  tg[n - 1] = m[n - 2]!;
  for (let i = 1; i < n - 1; i++) tg[i] = m[i - 1]! * m[i]! <= 0 ? 0 : (m[i - 1]! + m[i]!) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      tg[i] = 0;
      tg[i + 1] = 0;
    } else {
      const a = tg[i]! / m[i]!;
      const b = tg[i + 1]! / m[i]!;
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        tg[i] = tau * a * m[i]!;
        tg[i + 1] = tau * b * m[i]!;
      }
    }
  }
  let d = `M${p[0]!.x.toFixed(1)} ${p[0]!.y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i]! / 3;
    d += `C${(p[i]!.x + h).toFixed(1)} ${(p[i]!.y + h * tg[i]!).toFixed(1)} ${(p[i + 1]!.x - h).toFixed(1)} ${(p[i + 1]!.y - h * tg[i + 1]!).toFixed(1)} ${p[i + 1]!.x.toFixed(1)} ${p[i + 1]!.y.toFixed(1)}`;
  }
  return d;
}

/** open arc — 0° at 12 o'clock, clockwise (catalog `arcPath`) */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const pol = (aDeg: number) => {
    const a = ((aDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const p0 = pol(a0);
  const p1 = pol(a1);
  const lg = (a1 - a0) % 360 > 180 ? 1 : 0;
  return `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}A${r} ${r} 0 ${lg} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
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

/** chip-pill label (dark rect + tinted hairline) — `y` = pill center */
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
        fill="rgba(8,10,18,0.78)"
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

/** the big display number (catalog `bigNum`) */
function BigNum({
  x,
  y,
  text,
  size = 34,
  color = 'var(--text)',
  anchor = 'start',
}: {
  x: number;
  y: number;
  text: string;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight={700}
      textAnchor={anchor}
      style={{ fontFamily: DISPLAY, letterSpacing: '-0.03em' }}
    >
      {text}
    </text>
  );
}

/** delta chevron + mono label — up = mint, down = coral (catalog `delta`) */
function Delta({ x, y, text, up }: { x: number; y: number; text: string; up: boolean }) {
  const col = up ? 'var(--zone-high)' : 'var(--zone-low)';
  return (
    <g>
      <path
        d={`M${x} ${up ? y : y - 6}l4 ${up ? -6 : 6}l4 ${up ? 6 : -6}`}
        fill="none"
        stroke={col}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Label x={x + 12} y={y - 1} text={text} color={col} anchor="start" />
    </g>
  );
}

/** 16-pt micro sparkline + end dot (catalog `microSpark`) */
function MicroSpark({
  x,
  y,
  w,
  h,
  data,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  data: number[];
  color: string;
}) {
  const vals = normalize(data);
  if (vals.length === 0) return null;
  const pts = vals.map((v, i) => ({
    x: x + (vals.length <= 1 ? w / 2 : (w * i) / (vals.length - 1)),
    y: y + h - v * h,
  }));
  const last = pts[pts.length - 1]!;
  return (
    <g>
      <path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} r={2.4} fill={color} />
    </g>
  );
}

/**
 * StatTile — the kit's KPI chartlet (catalog family `stat-tiles`,
 * ST-01/06/07/10): the big-number widgets that carry every dashboard.
 *
 * - `stat-tile` (ST-01, default) — big 34px number + delta chevron + dim
 *   caption; SELECT `accessory`: `none` / 16-pt `spark` / micro `bars` /
 *   goal `ring` / `progress` bar, plus an optional `verdictColor` glow-dot
 *   that colors the number (the readiness verdict at a glance).
 * - `hero-number` (ST-06) — the one big number: centered 52px + delta +
 *   insight line; `shine` glows it mint.
 * - `duo-tile` (ST-07) — two stats split by a hairline, each with own delta.
 * - `stat-list` (ST-10) — 3 rows of label + bold value + colored mini-spark.
 *
 * Accessory series are auto-normalized to the box. Geometry is the catalog's
 * 320×150 canvas (scaled via `width`/`height`); tokens only. With no data
 * props each variant renders its catalog card.
 */
export function StatTile({
  variant = 'stat-tile',
  title,
  value,
  delta,
  deltaUp = true,
  label,
  accessory = 'none',
  data,
  accessoryColor,
  progress = 0.72,
  ringLabel,
  verdictColor,
  pill,
  pillColor,
  color,
  stats = DEFAULT_STATS,
  rows = DEFAULT_ROWS,
  shine = false,
  width = W,
  height = H,
  className,
  ...rest
}: StatTileProps) {
  const heading = title ?? DEFAULT_TITLES[variant];
  const svgProps = {
    className: cn('lk-stattile', className),
    width,
    height,
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    ...rest,
  };
  const head = <Label x={P.l + 8} y={26} text={heading} anchor="start" />;

  /* ----------------------------------------------------- ST-06 hero-number */
  if (variant === 'hero-number') {
    const val = value ?? '74';
    const col = color ?? (shine ? 'var(--mint)' : 'var(--text)');
    const deltaText = delta ?? '+6';
    return (
      <svg {...svgProps} aria-label={`${heading}: ${val}${deltaText ? `, ${deltaText}` : ''}`}>
        {head}
        {shine ? (
          <text
            x={W / 2}
            y={82}
            fill="var(--mint)"
            fontSize={52}
            fontWeight={700}
            textAnchor="middle"
            opacity={0.5}
            style={{ fontFamily: DISPLAY, letterSpacing: '-0.03em', filter: 'blur(8px)' }}
          >
            {val}
          </text>
        ) : null}
        <BigNum x={W / 2} y={82} text={val} size={52} color={col} anchor="middle" />
        {deltaText ? <Delta x={W / 2 + 40} y={60} text={deltaText} up={deltaUp} /> : null}
        <Label x={W / 2} y={102} text={label ?? 'ENERGY · PEAK IN 40 MIN'} color="var(--text-dim)" />
      </svg>
    );
  }

  /* -------------------------------------------------------- ST-07 duo-tile */
  if (variant === 'duo-tile') {
    const [a, b] = stats;
    return (
      <svg {...svgProps} aria-label={`${heading}: ${a.label} ${a.value}, ${b.label} ${b.value}`}>
        {head}
        <BigNum x={P.l + 8} y={70} text={a.value} size={26} />
        <Label x={P.l + 8} y={88} text={a.label} anchor="start" />
        {a.delta ? <Delta x={P.l + 8} y={106} text={a.delta} up={a.deltaUp ?? true} /> : null}
        <line x1={W / 2} x2={W / 2} y1={38} y2={112} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <BigNum x={W / 2 + 16} y={70} text={b.value} size={26} />
        <Label x={W / 2 + 16} y={88} text={b.label} anchor="start" />
        {b.delta ? <Delta x={W / 2 + 16} y={106} text={b.delta} up={b.deltaUp ?? true} /> : null}
      </svg>
    );
  }

  /* ------------------------------------------------------- ST-10 stat-list */
  if (variant === 'stat-list') {
    return (
      <svg {...svgProps} aria-label={`${heading}: ${rows.map((r) => `${r.label} ${r.value}`).join(', ')}`}>
        {head}
        {rows.map((rw, i) => {
          const y = 44 + i * 30;
          return (
            <g key={i}>
              <Label x={P.l + 8} y={y + 4} text={rw.label} anchor="start" />
              <text
                x={P.l + 76}
                y={y + 7}
                fill="var(--text)"
                fontSize={16}
                fontWeight={700}
                style={{ fontFamily: DISPLAY }}
              >
                {rw.value}
              </text>
              <MicroSpark x={170} y={y - 8} w={122} h={20} data={rw.data ?? DEFAULT_SPARK} color={rw.color ?? 'var(--mint)'} />
            </g>
          );
        })}
      </svg>
    );
  }

  /* ------------------------------------------------------- ST-01 stat-tile */
  const val = value ?? '74';
  const numSize = accessory === 'progress' ? 30 : 34;
  const numY = accessory === 'progress' ? 70 : 76;
  const numX = verdictColor ? P.l + 30 : P.l + 8;
  const numColor = verdictColor ?? 'var(--text)';
  const labY = accessory === 'progress' ? 90 : 96;
  const deltaX = numX + numWidth(val, numSize) + 14;
  const aColor = accessoryColor ?? (accessory === 'spark' ? 'var(--cyan)' : 'var(--mint)');
  const frac = Math.max(0, Math.min(1, progress));
  const trackW = W - P.l - P.r - 16;
  return (
    <svg {...svgProps} aria-label={`${heading}: ${val}${delta ? `, ${delta}` : ''}`}>
      {head}
      {verdictColor ? (
        <circle
          cx={P.l + 14}
          cy={66}
          r={6}
          fill={verdictColor}
          style={{ filter: `drop-shadow(0 0 6px ${verdictColor})` }}
        />
      ) : null}
      <BigNum x={numX} y={numY} text={val} size={numSize} color={color ?? numColor} />
      {delta ? <Delta x={deltaX} y={numY - 4} text={delta} up={deltaUp} /> : null}
      {label ? <Label x={numX} y={labY} text={label} color="var(--text-dim)" anchor="start" /> : null}
      {accessory === 'spark' ? (
        <MicroSpark x={176} y={46} w={118} h={44} data={data ?? DEFAULT_SPARK} color={aColor} />
      ) : null}
      {accessory === 'bars'
        ? (() => {
            const vals = normalize(data ?? DEFAULT_BARS);
            const bw = (108 / vals.length) * 0.6;
            return vals.map((v, i) => (
              <rect
                key={i}
                x={(186 + (i * 108) / vals.length).toFixed(1)}
                y={(44 + 46 - v * 46).toFixed(1)}
                width={bw.toFixed(1)}
                height={(v * 46).toFixed(1)}
                rx={1.5}
                fill={aColor}
                opacity={0.5 + v * 0.5}
              />
            ));
          })()
        : null}
      {accessory === 'ring' ? (
        <g>
          <path d={arcPath(236, 70, 26, 0, 359.99)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
          {shine ? (
            <path d={arcPath(236, 70, 26, 0, frac * 360)} fill="none" stroke={aColor} strokeWidth={9} strokeLinecap="round" opacity={0.3} style={{ filter: 'blur(3px)' }} />
          ) : null}
          <path d={arcPath(236, 70, 26, 0, frac * 360)} fill="none" stroke={aColor} strokeWidth={5} strokeLinecap="round" />
          <text
            x={236}
            y={74}
            fill="var(--text)"
            fontSize={13}
            fontWeight={700}
            textAnchor="middle"
            style={{ fontFamily: DISPLAY }}
          >
            {ringLabel ?? `${Math.round(frac * 100)}%`}
          </text>
        </g>
      ) : null}
      {accessory === 'progress' ? (
        <g>
          <rect x={P.l + 8} y={100} width={trackW} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          <rect x={P.l + 8} y={100} width={(trackW * frac).toFixed(1)} height={8} rx={4} fill={aColor} />
        </g>
      ) : null}
      {pill ? (
        <Tag
          x={W - P.r - 8}
          y={verdictColor ? 66 : 104}
          text={pill}
          color={pillColor ?? verdictColor ?? aColor}
          anchor="end"
        />
      ) : null}
    </svg>
  );
}
