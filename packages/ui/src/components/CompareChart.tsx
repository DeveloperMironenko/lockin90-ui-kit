import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* CompareChart — the shared catalog before/after compare family (CP-01…CP-07,
   lockin90-design/charts/compare-charts.html): the 90-day payoff drawn in a
   fixed 320×150 viewBox — metric slopes between two day columns, dumbbell
   rows, bump rank lanes, signed delta arrows, mirrored bars, a hero slope
   over faint cohort ghost slopes, and the program-milestone ladder. Mono
   catalog labels + chip-pill tags; tokens only. */

export type CompareChartVariant =
  | 'slope-panel' /* CP-01 — 2 columns · one slope per metric · deltas right */
  | 'dumbbell-rows' /* CP-02 — dot-pairs (dim start → solid end) + connector */
  | 'bump-ranks' /* CP-03 — rank lanes · smooth rank lines + #rank labels */
  | 'delta-arrows' /* CP-04 — center zero-line · arrow bars, length = change */
  | 'mirror-bars' /* CP-05 — mirrored bars around a center spine */
  | 'cohort-slopes' /* CP-06 — hero slope over faint cohort ghost slopes */
  | 'ladder-steps'; /* CP-07 — milestone dots climbing · NOW pulse */

/** One before/after metric on the shared 0–1 normalized scale. The printed
 *  delta = `round((after − before) * 100)`, signed. */
export interface CompareMetric {
  /** Metric name, drawn in mono (e.g. "ENERGY"). */
  name: string;
  /** Day-1 value, 0–1. */
  before: number;
  /** Day-90 value, 0–1. */
  after: number;
  /** Color token override (e.g. 'var(--violet)'). Down-moves still render
   *  `--zone-low` in slope-panel / dumbbell-rows / delta-arrows (catalog). */
  color?: string;
}

/** One bump-ranks series — rank 1 = the top lane. */
export interface RankSeries {
  /** Series name, drawn in mono left of the first point. */
  name: string;
  /** Rank per column (1 = top); lanes span to the max rank across series. */
  ranks: number[];
  /** Color token override (e.g. 'var(--violet)'). */
  color?: string;
}

/** One ladder-steps milestone — `value` is the 0–1 dot height. */
export interface LadderStep {
  /** Milestone name, drawn in a chip-pill above the dot. */
  label: string;
  /** Dot height, 0–1. */
  value: number;
  /** done = mint-60% · now = solid mint + pulse · ahead = faint + dashed link. */
  state: 'done' | 'now' | 'ahead';
}

export interface CompareChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Catalog variant (CP-01 … CP-07). */
  variant?: CompareChartVariant;
  /** Before/after metrics — slope-panel (first 4) / dumbbell-rows /
   *  delta-arrows / mirror-bars / cohort-slopes (hero = `metrics[0]`). */
  metrics?: CompareMetric[];
  /** Rank series for `bump-ranks`. */
  series?: RankSeries[];
  /** Milestones for `ladder-steps`. */
  steps?: LadderStep[];
  /** Faint ghost slopes behind the `cohort-slopes` hero. */
  cohort?: Array<{ before: number; after: number }>;
  /** Top-left mono caption (e.g. 'DAY 1 → DAY 90'). */
  title?: string;
  /** Left column caption (slope variants) / left mirror caption. */
  startLabel?: string;
  /** Right column caption (slope variants) / right mirror caption. */
  endLabel?: string;
  /** Hero chip-pill for `cohort-slopes` (e.g. 'ENERGY +26 IN 90 DAYS'),
   *  drawn top-center. */
  badge?: string;
  /** `bump-ranks` x captions; defaults to W1…Wn. */
  columns?: string[];
  /** `dumbbell-rows` footer caption; `''` hides it. */
  legend?: string;
  /** Blurred glow duplicate under the slope lines (catalog glow modifier). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_W = W - PAD.l - PAD.r; // 298
const PLOT_H = H - PAD.t - PAD.b; // 120

/** y position for a 0–1 value (catalog `Y`). */
const Y = (v: number) => PAD.t + (1 - v) * PLOT_H;
/** slope/dumbbell/arrows column x for a 0–1 fraction — 46px gutters each side. */
const colX = (f: number) => PAD.l + 46 + (PLOT_W - 92) * f;

/* catalog metric palette (compare-charts.html METRICS), wraps for longer lists */
const METRIC_COLORS = [
  'var(--mint)',
  'var(--violet)',
  'var(--cyan)',
  'var(--zone-mid)',
  'var(--indigo)',
] as const;
/* catalog bump-series palette */
const SERIES_COLORS = ['var(--violet)', 'var(--cyan)', 'var(--lime)', 'var(--zone-mid)'] as const;

/* the catalog METRICS — ENERGY/SLEEP/HRV/STRAIN/WEIGHT before→after */
const DEFAULT_METRICS: CompareMetric[] = [
  { name: 'ENERGY', before: 0.48, after: 0.74, color: 'var(--mint)' },
  { name: 'SLEEP', before: 0.55, after: 0.68, color: 'var(--violet)' },
  { name: 'HRV', before: 0.4, after: 0.62, color: 'var(--cyan)' },
  { name: 'STRAIN', before: 0.7, after: 0.52, color: 'var(--zone-mid)' },
  { name: 'WEIGHT', before: 0.62, after: 0.58, color: 'var(--indigo)' },
];

/* the catalog bump series (CP-03) */
const DEFAULT_SERIES: RankSeries[] = [
  { name: 'SLEEP', ranks: [1, 1, 2, 1], color: 'var(--violet)' },
  { name: 'TRAINING', ranks: [2, 3, 1, 2], color: 'var(--cyan)' },
  { name: 'NUTRITION', ranks: [3, 2, 3, 4], color: 'var(--lime)' },
  { name: 'STRESS', ranks: [4, 4, 4, 3], color: 'var(--zone-mid)' },
];

/* the catalog ladder steps (CP-07) */
const DEFAULT_STEPS: LadderStep[] = [
  { label: 'BASELINE', value: 0.25, state: 'done' },
  { label: 'CALIBRATED', value: 0.45, state: 'done' },
  { label: 'OPTIMIZING', value: 0.68, state: 'now' },
  { label: 'LOCKED IN', value: 0.9, state: 'ahead' },
];

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** Signed printed delta — `+26` / `−18` (catalog ×100 rounding, U+2212 minus). */
const deltaText = (m: CompareMetric, suffix = '') =>
  `${m.after >= m.before ? '+' : '−'}${Math.abs(Math.round((m.after - m.before) * 100))}${suffix}`;

/** Straight polyline through the points. */
function linePath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${rd(x)},${rd(y)}`).join(' ');
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (no overshoot),
 *  copied module-private from LineChart.tsx (not exported there). */
function monotonePath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n < 3) return linePath(pts);
  const dx: number[] = [];
  const m: number[] = [];
  const tg: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  tg[0] = m[0];
  tg[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) tg[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      tg[i] = 0;
      tg[i + 1] = 0;
    } else {
      const a = tg[i] / m[i];
      const b = tg[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        tg[i] = tau * a * m[i];
        tg[i + 1] = tau * b * m[i];
      }
    }
  }
  let d = `M${rd(pts[0][0])},${rd(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${rd(pts[i][0] + h)},${rd(pts[i][1] + h * tg[i])} ${rd(pts[i + 1][0] - h)},${rd(
      pts[i + 1][1] - h * tg[i + 1],
    )} ${rd(pts[i + 1][0])},${rd(pts[i + 1][1])}`;
  }
  return d;
}

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in compare.css. */
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
    <text className="lk-cmp-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
      {children}
    </text>
  );
}

/** Chip-pill tag (catalog `tag()`) — dark rect + tinted hairline, centered 8px
 *  mono text, x clamped inside the padded box. */
function Tag({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  const wpx = text.length * 5.35 + 12;
  const xa = Math.max(PAD.l - 4, Math.min(x - wpx / 2, W - PAD.r - wpx + 4));
  return (
    <g>
      <rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(wpx)}
        height={13}
        rx={6.5}
        fill="color-mix(in srgb, var(--bg-0) 78%, transparent)"
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <text className="lk-cmp-tag" x={rd(xa + wpx / 2)} y={rd(y + 2.8)} fill={color} textAnchor="middle">
        {text}
      </text>
    </g>
  );
}

/**
 * CompareChart — before/after compare chart for product surfaces (catalog
 * family CP-01…CP-07). `slope-panel` draws one slope per metric between the
 * DAY 1 / DAY 90 columns (up = own hue, down = coral); `dumbbell-rows` draws
 * dim-start → solid-end dot pairs; `bump-ranks` draws smooth rank lines over
 * lanes; `delta-arrows` draws signed arrow bars off a center zero-line;
 * `mirror-bars` mirrors before/after bars around a center spine;
 * `cohort-slopes` puts the hero metric's slope over faint cohort ghosts;
 * `ladder-steps` climbs milestone dots with a pulsing NOW. Values are 0–1.
 */
export function CompareChart({
  variant = 'slope-panel',
  metrics = DEFAULT_METRICS,
  series = DEFAULT_SERIES,
  steps = DEFAULT_STEPS,
  cohort,
  title,
  startLabel = 'DAY 1',
  endLabel = 'DAY 90',
  badge,
  columns,
  legend = 'DIM = DAY 1 · SOLID = DAY 90',
  shine = false,
  ariaLabel = 'Before / after comparison',
  className,
  ...rest
}: CompareChartProps) {
  const isSlope = variant === 'slope-panel' || variant === 'cohort-slopes';
  const hero = variant === 'cohort-slopes';

  const colorOf = (m: CompareMetric, i: number): string =>
    m.color ?? METRIC_COLORS[i % METRIC_COLORS.length];

  /* shared slope/rows geometry */
  const x0 = colX(0);
  const x1 = colX(1);
  const mid = colX(0.5);
  const nMetrics = metrics.length || 1;
  const rh = PLOT_H / nMetrics;

  /* bump geometry — lanes span to the max rank, columns to the longest series */
  const cols = Math.max(0, columns?.length ?? 0, ...series.map((s) => s.ranks.length));
  const laneMax = Math.max(1, ...series.flatMap((s) => s.ranks));
  const rowY = (rk: number) => PAD.t + 14 + ((rk - 1) * (PLOT_H - 22)) / Math.max(1, laneMax - 1);
  const colXX = (i: number) => PAD.l + 50 + ((PLOT_W - 60) * i) / Math.max(1, cols - 1);

  /* ladder geometry */
  const stepX = (si: number) => PAD.l + 24 + (si * (PLOT_W - 60)) / Math.max(1, steps.length - 1);

  return (
    <div className={cn('lk-cmp', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-cmp-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {title ? (
          <Label x={PAD.l + 2} y={11} fill="var(--text-faint)" anchor="start">
            {title}
          </Label>
        ) : null}

        {/* ---- CP-01 slope-panel · CP-06 cohort-slopes ---- */}
        {isSlope && (
          <g>
            {[x0, x1].map((x) => (
              <line
                key={x}
                x1={rd(x)}
                x2={rd(x)}
                y1={PAD.t + 4}
                y2={H - PAD.b}
                stroke="var(--text)"
                strokeOpacity={0.1}
                strokeWidth={1}
              />
            ))}
            <Label x={x0} y={H - 2} fill="var(--text-faint)">
              {startLabel}
            </Label>
            <Label x={x1} y={H - 2} fill="var(--text-faint)">
              {endLabel}
            </Label>
            {hero &&
              cohort?.map((c, ci) => (
                <line
                  key={ci}
                  x1={rd(x0)}
                  y1={rd(Y(c.before))}
                  x2={rd(x1)}
                  y2={rd(Y(c.after))}
                  stroke="var(--text)"
                  strokeOpacity={0.1}
                  strokeWidth={1.2}
                />
              ))}
            {metrics.slice(0, hero ? 1 : 4).map((m, i) => {
              const up = m.after >= m.before;
              const col = hero ? (m.color ?? 'var(--mint)') : up ? colorOf(m, i) : 'var(--zone-low)';
              const wpx = hero ? 3.5 : 2;
              const ya = rd(Y(m.before));
              const yb = rd(Y(m.after));
              return (
                <g key={i}>
                  {shine && (
                    <line
                      className="lk-cmp-shine"
                      x1={rd(x0)}
                      y1={ya}
                      x2={rd(x1)}
                      y2={yb}
                      stroke={col}
                      strokeWidth={wpx + 5}
                      strokeLinecap="round"
                      opacity={0.45}
                    />
                  )}
                  <line
                    x1={rd(x0)}
                    y1={ya}
                    x2={rd(x1)}
                    y2={yb}
                    stroke={col}
                    strokeWidth={wpx}
                    strokeLinecap="round"
                  />
                  <circle cx={rd(x0)} cy={ya} r={3.2} fill={col} />
                  <circle cx={rd(x1)} cy={yb} r={3.2} fill={col} />
                  <Label x={x0 - 8} y={Y(m.before) + 3} fill={col} anchor="end">
                    {m.name}
                  </Label>
                  <Label x={x1 + 8} y={Y(m.after) + 3} fill={col} anchor="start">
                    {deltaText(m)}
                  </Label>
                </g>
              );
            })}
            {hero && badge ? (
              <Tag x={W / 2} y={PAD.t + 12} text={badge} color={metrics[0]?.color ?? 'var(--mint)'} />
            ) : null}
          </g>
        )}

        {/* ---- CP-02 dumbbell-rows ---- */}
        {variant === 'dumbbell-rows' && (
          <g>
            {metrics.map((m, ri) => {
              const y = rd(PAD.t + 10 + ri * rh);
              const xa = rd(colX(m.before));
              const xb = rd(colX(m.after));
              const up = m.after >= m.before;
              const col = up ? 'var(--mint)' : 'var(--zone-low)';
              return (
                <g key={ri}>
                  <Label x={PAD.l + 40} y={y + 3} fill="var(--text-dim)" anchor="end">
                    {m.name}
                  </Label>
                  <line x1={xa} x2={xb} y1={y} y2={y} stroke={col} strokeWidth={2.4} opacity={0.55} />
                  <circle cx={xa} cy={y} r={4} fill="var(--text)" fillOpacity={0.35} />
                  <circle cx={xb} cy={y} r={4.6} fill={col} />
                  <Label x={xb + (up ? 10 : -10)} y={y + 3} fill={col} anchor={up ? 'start' : 'end'}>
                    {deltaText(m)}
                  </Label>
                </g>
              );
            })}
            {legend ? (
              <Label x={colX(0.5)} y={H - 2} fill="var(--text-faint)">
                {legend}
              </Label>
            ) : null}
          </g>
        )}

        {/* ---- CP-03 bump-ranks ---- */}
        {variant === 'bump-ranks' && (
          <g>
            {Array.from({ length: cols }, (_, wi) => (
              <Label key={wi} x={colXX(wi)} y={H - 2} fill="var(--text-faint)">
                {columns?.[wi] ?? `W${wi + 1}`}
              </Label>
            ))}
            {series.map((s, si) => {
              if (s.ranks.length === 0) return null;
              const col = s.color ?? SERIES_COLORS[si % SERIES_COLORS.length];
              const pts: Array<[number, number]> = s.ranks.map((rk, i) => [colXX(i), rowY(rk)]);
              const last = pts.length - 1;
              return (
                <g key={si}>
                  <path
                    d={monotonePath(pts)}
                    fill="none"
                    stroke={col}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                  {pts.map(([px, py], pi) => (
                    <circle key={pi} cx={rd(px)} cy={rd(py)} r={pi === last ? 4.5 : 3} fill={col} />
                  ))}
                  <Label x={PAD.l + 44} y={pts[0][1] + 3} fill={col} anchor="end">
                    {s.name}
                  </Label>
                  <Label x={pts[last][0] + 10} y={pts[last][1] + 3} fill={col} anchor="start">
                    {`#${s.ranks[last]}`}
                  </Label>
                </g>
              );
            })}
          </g>
        )}

        {/* ---- CP-04 delta-arrows ---- */}
        {variant === 'delta-arrows' && (
          <g>
            <line
              x1={rd(mid)}
              x2={rd(mid)}
              y1={PAD.t + 2}
              y2={H - PAD.b}
              stroke="var(--text)"
              strokeOpacity={0.14}
              strokeWidth={1}
            />
            {metrics.map((m, ri) => {
              const y = rd(PAD.t + 10 + ri * rh);
              const dv = m.after - m.before;
              const up = dv >= 0;
              const xe = rd(mid + dv * (PLOT_W - 92));
              const col = up ? 'var(--mint)' : 'var(--zone-low)';
              return (
                <g key={ri}>
                  <Label x={PAD.l + 40} y={y + 3} fill="var(--text-dim)" anchor="end">
                    {m.name}
                  </Label>
                  <line
                    x1={rd(mid)}
                    x2={xe}
                    y1={y}
                    y2={y}
                    stroke={col}
                    strokeWidth={5}
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                  <path
                    d={`M${xe} ${rd(y - 5)}L${rd(xe + (up ? 7 : -7))} ${y}L${xe} ${rd(y + 5)}Z`}
                    fill={col}
                  />
                  <Label x={xe + (up ? 14 : -14)} y={y + 3} fill={col} anchor={up ? 'start' : 'end'}>
                    {deltaText(m, '%')}
                  </Label>
                </g>
              );
            })}
          </g>
        )}

        {/* ---- CP-05 mirror-bars ---- */}
        {variant === 'mirror-bars' && (
          <g>
            <line
              x1={W / 2}
              x2={W / 2}
              y1={PAD.t + 2}
              y2={H - PAD.b}
              stroke="var(--text)"
              strokeOpacity={0.18}
              strokeWidth={1.4}
            />
            <Label x={W / 2 - 12} y={PAD.t + 8} fill="var(--text-faint)" anchor="end">
              {`← ${startLabel}`}
            </Label>
            <Label x={W / 2 + 12} y={PAD.t + 8} fill="var(--text-faint)" anchor="start">
              {`${endLabel} →`}
            </Label>
            {metrics.map((m, ri) => {
              const y = PAD.t + 20 + ri * rh;
              const col = colorOf(m, ri);
              return (
                <g key={ri}>
                  <rect
                    x={rd(W / 2 - m.before * 118)}
                    y={rd(y - 5.5)}
                    width={rd(m.before * 118)}
                    height={11}
                    rx={5.5}
                    fill="var(--text)"
                    fillOpacity={0.22}
                  />
                  <rect
                    x={W / 2}
                    y={rd(y - 5.5)}
                    width={rd(m.after * 118)}
                    height={11}
                    rx={5.5}
                    fill={col}
                    opacity={0.9}
                  />
                  <Label x={W / 2} y={y - 9} fill="var(--text-faint)">
                    {m.name}
                  </Label>
                </g>
              );
            })}
          </g>
        )}

        {/* ---- CP-07 ladder-steps ---- */}
        {variant === 'ladder-steps' && (
          <g>
            {steps.map((s, si) => {
              const x = rd(stepX(si));
              const y = rd(Y(s.value));
              const next = si < steps.length - 1 ? steps[si + 1] : null;
              const aheadLink = next ? s.state === 'ahead' || next.state === 'ahead' : false;
              return (
                <g key={si}>
                  {next ? (
                    <line
                      x1={x}
                      y1={y}
                      x2={rd(stepX(si + 1))}
                      y2={rd(Y(next.value))}
                      stroke={aheadLink ? 'var(--text)' : 'var(--mint)'}
                      strokeOpacity={aheadLink ? 0.2 : undefined}
                      strokeWidth={2}
                      strokeDasharray={next.state === 'ahead' ? '4 4' : undefined}
                    />
                  ) : null}
                  {s.state === 'ahead' ? (
                    <circle cx={x} cy={y} r={4.5} fill="var(--text)" fillOpacity={0.25} />
                  ) : (
                    <circle
                      cx={x}
                      cy={y}
                      r={s.state === 'now' ? 6 : 4.5}
                      fill="var(--mint)"
                      fillOpacity={s.state === 'done' ? 0.6 : undefined}
                    />
                  )}
                  {s.state === 'now' ? (
                    <>
                      {/* catalog pulseDot: glowing core + expanding ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={3.6}
                        fill="var(--mint)"
                        style={{ filter: 'drop-shadow(0 0 5px var(--mint))' }}
                      />
                      <circle
                        className="lk-cmp-pulse"
                        cx={x}
                        cy={y}
                        r={3.6}
                        fill="none"
                        stroke="var(--mint)"
                        strokeWidth={1.4}
                      />
                    </>
                  ) : null}
                  <Tag
                    x={x}
                    y={y - 15}
                    text={s.label}
                    color={s.state === 'ahead' ? 'var(--text-faint)' : 'var(--mint)'}
                  />
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
