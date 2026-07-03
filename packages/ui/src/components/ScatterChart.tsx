import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* ScatterChart — the shared catalog scatter/bubble family (SC-01…SC-07,
   lockin90-design/charts/scatter-charts.html): a normalized 0–1 correlation
   cloud drawn in a fixed 320×150 viewBox with mono axis captions — plus the
   dashed --cyan least-squares fit + R² pill, third-variable bubbles with a
   size key, the quadrant decision map, zone-verdict dots, the TODAY lime
   pulse marker and the density-cloud centroid ring. */

export type ScatterChartVariant =
  | 'mint-scatter' /* SC-01 — 3px --mint dots · the basic correlation view */
  | 'trend-fit' /* SC-02 — dots + dashed --cyan least-squares line + R² pill */
  | 'bubble-dose' /* SC-03 — bubble r 2–8 = third variable + size key + dark rims */
  | 'quadrant-map' /* SC-04 — dashed midlines + 4 quadrant captions */
  | 'zone-dots' /* SC-05 — dot color = y-value zone (mint/amber/coral) */
  | 'today-marker' /* SC-06 — history dots 28% · TODAY lime pulse + pill */
  | 'density-cloud'; /* SC-07 — small dots 40% + dashed --cyan centroid ring */

/** One observation. `x`/`y` are normalized 0–1 (plot space); `z` 0–1 drives
 *  the `bubble-dose` radius (2–8 viewBox px, missing `z` → 0.5). */
export interface ScatterPoint {
  x: number;
  y: number;
  z?: number;
}

export interface ScatterChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Catalog variant (SC-01 … SC-07). */
  variant?: ScatterChartVariant;
  /** Observations, normalized 0–1. Defaults to the catalog SC-01 demo cloud. */
  points?: ScatterPoint[];
  /** X-axis caption, bottom-right (e.g. 'SLEEP HOURS →'); `''` hides it. */
  xLabel?: string;
  /** Y-axis caption, top-left (e.g. '↑ ENERGY'); `''` hides it. */
  yLabel?: string;
  /** Top-center mono caption (e.g. 'SLEEP → ENERGY · 26 NIGHTS'). */
  title?: string;
  /** Dot color token (ignored by `zone-dots`, where the zone owns the color). */
  color?: string;
  /** Dot radius in viewBox px. Defaults to 3 (`density-cloud` presets 2). */
  dotRadius?: number;
  /** `today-marker` — index into `points` drawn last as the lime pulse dot +
   *  chip; the other dots dim to opacity 0.28. Out-of-range is ignored. */
  highlight?: number;
  /** Chip text over the highlighted point. */
  todayLabel?: string;
  /** `trend-fit` chip text. Omit → computed from the data:
   *  `R² 0.64 · STRONG` (R² ≥ 0.5 STRONG / ≥ 0.25 MODERATE / else WEAK). */
  fitLabel?: string;
  /** `bubble-dose` size-key chip, top-right; `''` hides it. */
  sizeLabel?: string;
  /** `quadrant-map` captions, [TL, TR, BL, BR]. */
  quadrantLabels?: [string, string, string, string];
  /** `density-cloud` chip over the centroid ring; `''` hides it. */
  centroidLabel?: string;
  /** Soft per-dot glow in the dot color (the catalog glow modifier). */
  shine?: boolean;
  /** Horizontal grid lines + baseline (catalog grid()). */
  grid?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_W = W - PAD.l - PAD.r; // 298
const PLOT_H = H - PAD.t - PAD.b; // 120

/* quadrant midlines — the catalog's white-12%, tokenized as --text @ 12% */
const QUAD_LINE = 'color-mix(in srgb, var(--text) 12%, transparent)';
/* bubble dark rim — the catalog's rgba(8,10,18,0.6) = --bg-0 @ 60% */
const BUBBLE_RIM = 'color-mix(in srgb, var(--bg-0) 60%, transparent)';
/* chip-pill fill — the catalog tag()'s rgba(8,10,18,0.78) = --bg-0 @ 78% */
const TAG_FILL = 'color-mix(in srgb, var(--bg-0) 78%, transparent)';

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** Catalog clamp — keeps normalized values inside the drawable band. */
const clamp = (v: number) => Math.max(0.03, Math.min(0.97, v));

/** Deterministic PRNG (catalog mulberry32) — the demo cloud is stable. */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The scatter page's correlated cloud generator (y = corr·x + noise). */
function genPoints(seed: number, n: number, corr: number): ScatterPoint[] {
  const r = mulberry32(seed);
  const out: ScatterPoint[] = [];
  for (let i = 0; i < n; i++) {
    const x = 0.08 + r() * 0.84;
    const y = clamp(
      0.15 + corr * x * 0.8 + (r() - 0.5) * (1 - corr) * 0.7 + (r() - 0.5) * 0.12,
    );
    out.push({ x, y, z: r() });
  }
  return out;
}

/* SC-01 demo cloud — the catalog card's exact data (seed 11 · n 26 · corr .75) */
const DEFAULT_POINTS = genPoints(11, 26, 0.75);

/** Normalized point → viewBox px (the page's PX(), 8/6px inner inset). */
const toPx = (p: { x: number; y: number }) => ({
  x: PAD.l + 8 + (PLOT_W - 16) * p.x,
  y: PAD.t + 6 + (PLOT_H - 12) * (1 - p.y),
});

/** Zone verdict color for a normalized y (catalog zoneOf, ≥0.62 / ≥0.38). */
const zoneOf = (v: number): string =>
  v >= 0.62 ? 'var(--zone-high)' : v >= 0.38 ? 'var(--zone-mid)' : 'var(--zone-low)';

/** Least-squares fit (catalog fitLine) + R² = square of Pearson r. */
function fitStats(pts: ScatterPoint[]): { a: number; b: number; r2: number } {
  const n = pts.length;
  let sx = 0;
  let sy = 0;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (const p of pts) {
    sx += p.x;
    sy += p.y;
    sxy += p.x * p.y;
    sxx += p.x * p.x;
    syy += p.y * p.y;
  }
  const vx = n * sxx - sx * sx;
  const vy = n * syy - sy * sy;
  const b = vx !== 0 ? (n * sxy - sx * sy) / vx : 0;
  const a = n > 0 ? (sy - b * sx) / n : 0;
  const r = vx > 0 && vy > 0 ? (n * sxy - sx * sy) / Math.sqrt(vx * vy) : 0;
  return { a, b, r2: r * r };
}

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in scatter.css. */
function Label({
  x,
  y,
  fill,
  anchor = 'middle',
  children,
}: {
  x: number;
  y: number;
  fill: string;
  anchor?: 'start' | 'middle' | 'end';
  children: string;
}) {
  return (
    <text className="lk-sct-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
      {children}
    </text>
  );
}

/** Chip-pill annotation (catalog tag()) — dark pill + tinted hairline +
 *  centered 8px mono text; `y` is the pill center, x clamps into the box. */
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
  const raw = anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2;
  const xa = Math.max(PAD.l - 4, Math.min(raw, W - PAD.r - w + 4));
  return (
    <g>
      <rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(w)}
        height={13}
        rx={6.5}
        fill={TAG_FILL}
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <text className="lk-sct-tag" x={rd(xa + w / 2)} y={rd(y + 2.8)} fill={color} textAnchor="middle">
        {text}
      </text>
    </g>
  );
}

/**
 * ScatterChart — correlation scatter/bubble chart for product surfaces
 * (catalog family SC-01…SC-07). Points are normalized 0–1 and drawn as dots
 * in the fixed 320×150 catalog canvas; variants add the dashed least-squares
 * fit with a computed R² pill (`trend-fit`), third-variable bubbles with dark
 * rims + size key (`bubble-dose`), the dashed quadrant decision map
 * (`quadrant-map`), zone-verdict dot colors (`zone-dots`), the dimmed-history
 * TODAY pulse (`today-marker`) and the dense 40%-opacity cloud with a dashed
 * centroid ring (`density-cloud`).
 */
export function ScatterChart({
  variant = 'mint-scatter',
  points = DEFAULT_POINTS,
  xLabel = 'SLEEP HOURS →',
  yLabel = '↑ ENERGY',
  title,
  color = 'var(--mint)',
  dotRadius,
  highlight,
  todayLabel = 'TODAY',
  fitLabel,
  sizeLabel = 'SIZE = CAFFEINE MG',
  quadrantLabels = ['LOW X · HIGH Y', 'SWEET SPOT', 'DANGER', 'HIGH X · LOW Y'],
  centroidLabel = 'TYPICAL YOU',
  shine = false,
  grid = true,
  ariaLabel = 'Correlation scatter plot',
  className,
  ...rest
}: ScatterChartProps) {
  const isFit = variant === 'trend-fit';
  const isBubble = variant === 'bubble-dose';
  const isQuadrant = variant === 'quadrant-map';
  const isZone = variant === 'zone-dots';
  const isToday = variant === 'today-marker';
  const isCloud = variant === 'density-cloud';

  const dotR = dotRadius ?? (isCloud ? 2 : 3);

  // valid highlight index only — out-of-range / fractional is ignored
  const hl =
    highlight != null && Number.isInteger(highlight) && highlight >= 0 && highlight < points.length
      ? highlight
      : null;
  const hlPx = hl != null ? toPx(points[hl]) : null;

  // trend-fit — least-squares over the (normalized) points, R² for the label
  const fit = isFit && points.length >= 2 ? fitStats(points) : null;
  const fitSeg = fit
    ? {
        q0: toPx({ x: 0.06, y: clamp(fit.a + fit.b * 0.06) }),
        q1: toPx({ x: 0.94, y: clamp(fit.a + fit.b * 0.94) }),
      }
    : null;
  const fitText =
    fitLabel ??
    (fit
      ? `R² ${fit.r2.toFixed(2)} · ${fit.r2 >= 0.5 ? 'STRONG' : fit.r2 >= 0.25 ? 'MODERATE' : 'WEAK'}`
      : '');

  // density-cloud — centroid = mean of the points, in plot space
  const centroid =
    isCloud && points.length > 0
      ? toPx({
          x: points.reduce((s, p) => s + p.x, 0) / points.length,
          y: points.reduce((s, p) => s + p.y, 0) / points.length,
        })
      : null;

  // quadrant midlines cross at the plot center
  const mx = PAD.l + PLOT_W / 2;
  const my = PAD.t + PLOT_H / 2;

  const glow = (c: string): CSSProperties | undefined =>
    shine ? ({ ['--lk-sct-glow']: c } as CSSProperties) : undefined;

  return (
    <div className={cn('lk-sct', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-sct-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {/* ---- grid: 3 interior lines at 25/50/75% + baseline (catalog grid()) ---- */}
        {grid ? (
          <g>
            {[0.25, 0.5, 0.75].map((f) => (
              <line
                key={f}
                x1={PAD.l}
                x2={W - PAD.r}
                y1={rd(PAD.t + PLOT_H * f)}
                y2={rd(PAD.t + PLOT_H * f)}
                stroke="var(--border)"
                strokeOpacity={0.55}
                strokeWidth={1}
              />
            ))}
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={H - PAD.b}
              y2={H - PAD.b}
              stroke="var(--border)"
              strokeWidth={1}
            />
          </g>
        ) : null}

        {/* ---- axis captions + title ---- */}
        {xLabel ? (
          <Label x={W - PAD.r - 2} y={H - 2} fill="var(--text-faint)" anchor="end">
            {xLabel}
          </Label>
        ) : null}
        {yLabel ? (
          <Label x={PAD.l + 2} y={PAD.t + 8} fill="var(--text-faint)" anchor="start">
            {yLabel}
          </Label>
        ) : null}
        {title ? (
          <Label x={W / 2} y={11} fill="var(--text-faint)">
            {title}
          </Label>
        ) : null}

        {/* ---- SC-04 · dashed midlines + quadrant captions ---- */}
        {isQuadrant ? (
          <g>
            <line
              x1={mx}
              x2={mx}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke={QUAD_LINE}
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={my}
              y2={my}
              stroke={QUAD_LINE}
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <Label x={PAD.l + PLOT_W * 0.25} y={PAD.t + 14} fill="var(--text-faint)">
              {quadrantLabels[0]}
            </Label>
            <Label x={PAD.l + PLOT_W * 0.75} y={PAD.t + 14} fill="var(--mint)">
              {quadrantLabels[1]}
            </Label>
            <Label x={PAD.l + PLOT_W * 0.25} y={H - PAD.b - 6} fill="var(--zone-low)">
              {quadrantLabels[2]}
            </Label>
            <Label x={PAD.l + PLOT_W * 0.75} y={H - PAD.b - 6} fill="var(--text-faint)">
              {quadrantLabels[3]}
            </Label>
          </g>
        ) : null}

        {/* ---- SC-07 · dashed centroid ring + chip (under the dots) ---- */}
        {centroid ? (
          <g>
            <circle
              cx={rd(centroid.x)}
              cy={rd(centroid.y)}
              r={16}
              fill="none"
              stroke="var(--cyan)"
              strokeWidth={1.2}
              strokeDasharray="3 3"
            />
            {centroidLabel ? (
              <Tag x={centroid.x} y={centroid.y - 24} text={centroidLabel} color="var(--cyan)" />
            ) : null}
          </g>
        ) : null}

        {/* ---- dots ---- */}
        {points.map((p, i) => {
          if (i === hl) return null; /* the highlighted point is drawn last */
          const q = toPx(p);
          const col = isZone ? zoneOf(p.y) : color;
          const r = isBubble ? 2 + (p.z ?? 0.5) * 6 : dotR;
          const op = isToday ? 0.28 : isCloud ? 0.4 : 0.85;
          return (
            <circle
              key={i}
              className={shine ? 'lk-sct-shine' : undefined}
              style={glow(col)}
              cx={rd(q.x)}
              cy={rd(q.y)}
              r={rd(r)}
              fill={col}
              opacity={op}
              stroke={isBubble ? BUBBLE_RIM : undefined}
              strokeWidth={isBubble ? 1 : undefined}
            />
          );
        })}

        {/* ---- SC-06 · TODAY lime pulse dot + chip (catalog pulseDot) ---- */}
        {hlPx ? (
          <g>
            <circle className="lk-sct-pulse-dot" cx={rd(hlPx.x)} cy={rd(hlPx.y)} r={3.6} fill="var(--lime)" />
            <circle
              className="lk-sct-pulse"
              cx={rd(hlPx.x)}
              cy={rd(hlPx.y)}
              r={3.6}
              fill="none"
              stroke="var(--lime)"
              strokeWidth={1.4}
            />
            {todayLabel ? <Tag x={hlPx.x} y={hlPx.y - 16} text={todayLabel} color="var(--lime)" /> : null}
          </g>
        ) : null}

        {/* ---- SC-02 · dashed least-squares line + R² pill ---- */}
        {fitSeg ? (
          <g>
            <line
              x1={rd(fitSeg.q0.x)}
              y1={rd(fitSeg.q0.y)}
              x2={rd(fitSeg.q1.x)}
              y2={rd(fitSeg.q1.y)}
              stroke="var(--cyan)"
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={0.9}
            />
            {fitText ? (
              <Tag x={fitSeg.q1.x - 4} y={fitSeg.q1.y - 12} text={fitText} color="var(--cyan)" anchor="end" />
            ) : null}
          </g>
        ) : null}

        {/* ---- SC-03 · bubble size key, top-right ---- */}
        {isBubble && sizeLabel ? (
          <Tag x={W - PAD.r - 4} y={PAD.t + 10} text={sizeLabel} color="var(--text-dim)" anchor="end" />
        ) : null}
      </svg>
    </div>
  );
}
