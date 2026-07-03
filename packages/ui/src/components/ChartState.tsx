import type { KeyboardEvent, SVGProps } from 'react';
import { cn } from '../cn';

/* ChartState — the catalog chart-states family (SV-01…SV-06,
   lockin90-design/charts/state-charts.html): the non-data states every chart
   card needs — loading, syncing, empty, locked, error and partial-sync —
   drawn at real chart geometry (fixed 320×150 viewBox) so data can land with
   no layout shift. Same on web and mobile (parity rule). */

/** Catalog variant names (`lockin90-design/charts/state-charts.html`). */
export type ChartStateVariant =
  | 'skeleton-chart' /* SV-01 — placeholder bars + title/legend stubs */
  | 'loading-ring' /* SV-02 — spinner arc + what is actually syncing */
  | 'empty-cta' /* SV-03 — ghost bars + reason + filled mint CTA pill */
  | 'locked-forecast' /* SV-04 — ghost curve + unlocks-at-N + progress dots */
  | 'error-retry' /* SV-05 — coral triangle + reason + RETRY pill */
  | 'partial-sync'; /* SV-06 — solid to last synced point, dashed after */

export interface ChartStateProps
  extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'children'> {
  /** state form (default `'skeleton-chart'`, SV-01) */
  variant?: ChartStateVariant;
  /** faint mono caption at the top-left (per-variant catalog default:
   *  LOADING / SYNCING / NO DATA / NOT ENOUGH DATA / ERROR / PARTIAL DATA) */
  title?: string;
  /** the main dim line — the plain-words reason (per-variant default, e.g.
   *  `'NO MEALS LOGGED YET'`, `"COULDN'T LOAD ENERGY DATA"`) */
  message?: string;
  /** `loading-ring` — the second, fainter line: what is actually syncing
   *  (default 'SYNCING WHOOP + OURA') */
  detail?: string;
  /** faint bottom note (skeleton + partial-sync catalog defaults; `''` hides) */
  caption?: string;
  /** CTA pill text — `empty-cta` (filled, default 'LOG YOUR FIRST MEAL') and
   *  `error-retry` (outline, default 'RETRY'); `''` hides the pill */
  cta?: string;
  /** pill tint (defaults: empty-cta mint · error-retry coral) */
  ctaColor?: string;
  /** press/click handler for the CTA/RETRY pill — makes it a focusable
   *  button (Enter/Space activate it on web) */
  onCtaPress?: () => void;
  /** `skeleton-chart` — placeholder bar heights 0–1 (default: the catalog 9) */
  bars?: number[];
  /** `empty-cta` — dashed ghost-bar heights 0–1 (default `[0.35, 0.55, 0.45]`) */
  ghostBars?: number[];
  /** `locked-forecast` ghost curve / `partial-sync` line — values 0–1
   *  (defaults: the catalog's seeded waves) */
  data?: number[];
  /** `locked-forecast` — days of data collected so far (default 3) */
  progress?: number;
  /** `locked-forecast` — days required to unlock (default 7) */
  total?: number;
  /** `partial-sync` — index of the last synced point (default 8); the line
   *  is solid through it, dashed ghost after */
  syncedIndex?: number;
  /** `partial-sync` — chip at the sync boundary (default 'SYNC PENDING') */
  pendingLabel?: string;
  /** glow underlay behind the accent mark (spinner arc / CTA pill / pulse) */
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
const plotW = W - P.l - P.r;
const plotH = H - P.t - P.b;

const MONO = 'var(--font-mono)';

/* ------------------------------------------- catalog deterministic data
 * mulberry32 + genData('wave') ported from catalog.js so the default curves
 * reproduce the catalog cards exactly (locked seed 5 ×12 · partial seed 9 ×14). */
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

const DEFAULT_SKELETON_BARS = [0.45, 0.6, 0.35, 0.7, 0.5, 0.65, 0.4, 0.75, 0.55];
const DEFAULT_GHOST_BARS = [0.35, 0.55, 0.45];
const DEFAULT_LOCKED_DATA = genWave(5, 12);
const DEFAULT_PARTIAL_DATA = genWave(9, 14);

const DEFAULT_TITLES: Record<ChartStateVariant, string> = {
  'skeleton-chart': 'LOADING',
  'loading-ring': 'SYNCING',
  'empty-cta': 'NO DATA',
  'locked-forecast': 'NOT ENOUGH DATA',
  'error-retry': 'ERROR',
  'partial-sync': 'PARTIAL DATA',
};

/** y for a 0–1 value in the plot box (catalog `Y`) */
function Y(v: number): number {
  return P.t + (1 - v) * plotH;
}

/** evenly-spread plot points for a 0–1 series (catalog `pts`) */
function seriesPts(data: number[]): { x: number; y: number }[] {
  return data.map((v, i) => ({
    x: P.l + (data.length <= 1 ? plotW / 2 : (i * plotW) / (data.length - 1)),
    y: Y(v),
  }));
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

/** the action pill (catalog `pill()`) — filled (CTA) or outline (RETRY);
 *  with `onPress` it becomes a focusable SVG button */
function Pill({
  cx,
  cy,
  text,
  color,
  filled,
  onPress,
  shine,
}: {
  cx: number;
  cy: number;
  text: string;
  color: string;
  filled: boolean;
  onPress?: () => void;
  shine?: boolean;
}) {
  const w = text.length * 5 + 58;
  const handleKey = onPress
    ? (e: KeyboardEvent<SVGGElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress();
        }
      }
    : undefined;
  return (
    <g
      className="lk-chartstate-cta"
      role={onPress ? 'button' : undefined}
      tabIndex={onPress ? 0 : undefined}
      aria-label={onPress ? text : undefined}
      onClick={onPress}
      onKeyDown={handleKey}
      style={onPress ? { cursor: 'pointer' } : undefined}
    >
      {shine ? (
        <rect x={cx - w / 2} y={cy - 12} width={w} height={24} rx={12} fill={color} opacity={0.35} style={{ filter: 'blur(6px)' }} />
      ) : null}
      <rect
        x={cx - w / 2}
        y={cy - 12}
        width={w}
        height={24}
        rx={12}
        fill={filled ? color : 'rgba(255,255,255,0.04)'}
        fillOpacity={filled ? 0.14 : 1}
        stroke={color}
        strokeOpacity={0.55}
        strokeWidth={1}
      />
      <text
        x={cx}
        y={cy + 3}
        fill={color}
        fontSize={9}
        textAnchor="middle"
        style={{ fontFamily: MONO, letterSpacing: '0.08em' }}
      >
        {text}
      </text>
    </g>
  );
}

function Grid() {
  return (
    <g>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={P.l} x2={W - P.r} y1={P.t + plotH * f} y2={P.t + plotH * f} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke="rgba(255,255,255,0.09)" strokeWidth={1} />
    </g>
  );
}

/**
 * ChartState — the kit's chart non-data state (catalog family `state-charts`,
 * SV-01…SV-06): loading, empty, locked, error and partial-sync rendered at
 * REAL chart geometry so the card doesn't shift when data lands. The states
 * are identical on web and mobile (parity rule).
 *
 * - `skeleton-chart` (SV-01, default) — gray placeholder bars + title/legend
 *   stubs (static — no shimmer, reduced-motion safe).
 * - `loading-ring` (SV-02) — small spinner arc + what is actually syncing.
 * - `empty-cta` (SV-03) — dashed ghost bars + one-line reason + filled mint
 *   CTA pill (`cta` + `onCtaPress`).
 * - `locked-forecast` (SV-04) — dashed ghost curve + "unlocks at N days" +
 *   `progress`/`total` dots.
 * - `error-retry` (SV-05) — coral warning triangle + plain-words reason +
 *   RETRY pill (`onCtaPress`).
 * - `partial-sync` (SV-06) — line solid to the last synced point, dashed
 *   ghost after + shaded pending region + amber SYNC PENDING pill.
 *
 * Geometry is the catalog's 320×150 canvas (scaled via `width`/`height`);
 * tokens only. With no props each variant renders its catalog card.
 */
export function ChartState({
  variant = 'skeleton-chart',
  title,
  message,
  detail,
  caption,
  cta,
  ctaColor,
  onCtaPress,
  bars = DEFAULT_SKELETON_BARS,
  ghostBars = DEFAULT_GHOST_BARS,
  data,
  progress = 3,
  total = 7,
  syncedIndex = 8,
  pendingLabel = 'SYNC PENDING',
  shine = false,
  width = W,
  height = H,
  className,
  ...rest
}: ChartStateProps) {
  const heading = title ?? DEFAULT_TITLES[variant];
  const svgProps = {
    className: cn('lk-chartstate', className),
    width,
    height,
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    ...rest,
  };
  const head = <Label x={P.l + 2} y={11} text={heading} anchor="start" />;

  /* ------------------------------------------------- SV-01 skeleton-chart */
  if (variant === 'skeleton-chart') {
    const note = caption ?? 'SKELETON · NO SHIMMER IN REDUCED MOTION';
    return (
      <svg {...svgProps} aria-label={`${heading}: chart loading placeholder`} aria-busy="true">
        {head}
        <Grid />
        <rect x={P.l + 2} y={22} width={64} height={8} rx={4} fill="rgba(255,255,255,0.07)" />
        <rect x={W - P.r - 54} y={22} width={54} height={8} rx={4} fill="rgba(255,255,255,0.05)" />
        {bars.map((v, i) => {
          const x = P.l + 14 + i * 32;
          const y = Y(v * 0.8);
          return (
            <rect
              key={i}
              x={x}
              y={y.toFixed(1)}
              width={20}
              height={(H - P.b - y).toFixed(1)}
              rx={3}
              fill={`rgba(255,255,255,${i === 4 ? 0.1 : 0.065})`}
            />
          );
        })}
        {note ? <Label x={160} y={142} text={note} /> : null}
      </svg>
    );
  }

  /* --------------------------------------------------- SV-02 loading-ring */
  if (variant === 'loading-ring') {
    return (
      <svg {...svgProps} aria-label={`${heading}: ${message ?? 'loading data'}`} aria-busy="true">
        {head}
        {shine ? (
          <path d={arcPath(160, 70, 22, 0, 70)} fill="none" stroke="var(--mint)" strokeWidth={8} strokeLinecap="round" opacity={0.3} style={{ filter: 'blur(4px)' }} />
        ) : null}
        <path d={arcPath(160, 70, 22, 0, 300)} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={3.5} strokeLinecap="round" />
        <path d={arcPath(160, 70, 22, 0, 70)} fill="none" stroke="var(--mint)" strokeWidth={3.5} strokeLinecap="round" />
        <Label x={160} y={112} text={message ?? 'LOADING DATA…'} color="var(--text-dim)" />
        {(detail ?? 'SYNCING WHOOP + OURA') ? <Label x={160} y={128} text={detail ?? 'SYNCING WHOOP + OURA'} /> : null}
      </svg>
    );
  }

  /* ------------------------------------------------------ SV-03 empty-cta */
  if (variant === 'empty-cta') {
    const ctaText = cta ?? 'LOG YOUR FIRST MEAL';
    return (
      <svg {...svgProps} aria-label={`${heading}: ${message ?? 'no data yet'}`}>
        {head}
        {ghostBars.map((v, i) => {
          const y = 76 - v * 42;
          return (
            <rect
              key={i}
              x={138 + i * 16}
              y={y.toFixed(1)}
              width={11}
              height={(76 - y).toFixed(1)}
              rx={2.5}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth={1.2}
              strokeDasharray="3 3"
            />
          );
        })}
        <Label x={160} y={96} text={message ?? 'NO MEALS LOGGED YET'} color="var(--text-dim)" />
        {ctaText ? (
          <Pill cx={160} cy={120} text={ctaText} color={ctaColor ?? 'var(--mint)'} filled onPress={onCtaPress} shine={shine} />
        ) : null}
      </svg>
    );
  }

  /* ------------------------------------------------ SV-04 locked-forecast */
  if (variant === 'locked-forecast') {
    const vals = data ?? DEFAULT_LOCKED_DATA;
    const pts = seriesPts(vals);
    const done = Math.max(0, Math.min(total, progress));
    const dotsX0 = 160 - (total - 1) * 5;
    return (
      <svg {...svgProps} aria-label={`${heading}: ${done} of ${total} days collected`}>
        {head}
        <Grid />
        {pts.length > 0 ? (
          <path d={smoothPath(pts)} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={2} strokeDasharray="4 5" />
        ) : null}
        <Label x={160} y={58} text={message ?? `FORECAST UNLOCKS AT ${total} DAYS OF DATA`} color="var(--text-dim)" />
        {Array.from({ length: total }, (_, i) => (
          <circle key={i} cx={dotsX0 + i * 10} cy={74} r={3} fill={i < done ? 'var(--mint)' : 'rgba(255,255,255,0.12)'} />
        ))}
        <Label x={160 + (total - 1) * 5 + 12} y={77} text={`${done}/${total}`} color="var(--mint)" anchor="start" />
      </svg>
    );
  }

  /* -------------------------------------------------- SV-05 error-retry */
  if (variant === 'error-retry') {
    const ctaText = cta ?? 'RETRY';
    return (
      <svg {...svgProps} aria-label={`${heading}: ${message ?? "couldn't load data"}`}>
        {head}
        {shine ? (
          <path d="M160 44l16 27h-32z" fill="var(--zone-low)" opacity={0.3} style={{ filter: 'blur(5px)' }} />
        ) : null}
        <path d="M160 44l16 27h-32z" fill="none" stroke="var(--zone-low)" strokeWidth={1.6} strokeLinejoin="round" />
        <line x1={160} x2={160} y1={54} y2={62} stroke="var(--zone-low)" strokeWidth={1.6} />
        <circle cx={160} cy={66.5} r={0.9} fill="var(--zone-low)" />
        <Label x={160} y={92} text={message ?? "COULDN'T LOAD ENERGY DATA"} color="var(--text-dim)" />
        {ctaText ? (
          <Pill cx={160} cy={116} text={ctaText} color={ctaColor ?? 'var(--zone-low)'} filled={false} onPress={onCtaPress} shine={shine} />
        ) : null}
      </svg>
    );
  }

  /* -------------------------------------------------- SV-06 partial-sync */
  const vals = data ?? DEFAULT_PARTIAL_DATA;
  const pts = seriesPts(vals);
  const cut = Math.max(0, Math.min(pts.length - 1, syncedIndex));
  const cp = pts[cut];
  const note = caption ?? 'SOLID = SYNCED · DASHED = AWAITING DEVICE';
  return (
    <svg {...svgProps} aria-label={`${heading}: synced through point ${cut + 1} of ${pts.length}`}>
      {head}
      <Grid />
      {pts.length > 0 ? (
        <path d={smoothPath(pts.slice(0, cut + 1))} fill="none" stroke="var(--mint)" strokeWidth={2.2} strokeLinecap="round" />
      ) : null}
      {cut < pts.length - 1 ? (
        <path d={smoothPath(pts.slice(cut))} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.6} strokeDasharray="3 4" />
      ) : null}
      {cp ? (
        <g>
          <rect x={cp.x.toFixed(1)} y={P.t + 4} width={(W - P.r - cp.x).toFixed(1)} height={plotH - 8} fill="rgba(255,255,255,0.03)" />
          {shine ? (
            <circle cx={cp.x.toFixed(1)} cy={cp.y.toFixed(1)} r={8} fill="var(--zone-mid)" opacity={0.35} style={{ filter: 'blur(3px)' }} />
          ) : null}
          <circle cx={cp.x.toFixed(1)} cy={cp.y.toFixed(1)} r={3.6} fill="var(--zone-mid)" style={{ filter: 'drop-shadow(0 0 5px var(--zone-mid))' }} />
          <circle cx={cp.x.toFixed(1)} cy={cp.y.toFixed(1)} r={3.6} fill="none" stroke="var(--zone-mid)" strokeWidth={1.4}>
            <animate attributeName="r" values="3.6;11" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".8;0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          {pendingLabel ? <Tag x={cp.x + 10} y={P.t + 14} text={pendingLabel} color="var(--zone-mid)" anchor="start" /> : null}
        </g>
      ) : null}
      {note ? <Label x={160} y={144} text={note} /> : null}
    </svg>
  );
}
