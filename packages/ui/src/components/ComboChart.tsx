import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* ComboChart — the shared catalog combo family (CB-01/04/05,
   lockin90-design/charts/combo-charts.html): two metrics on one canvas —
   bars for one, a line for the other — drawn in a fixed 320×150 viewBox with
   mono catalog labels and stacked legend pills. The metric pair and its
   tokens are the SELECT: workouts×energy, sleep×HRV, kcal×weight …
   Key: `.lk-combo-*` (partner CSS packages/ui/src/styles/components/combo.css). */

export type ComboChartVariant =
  | 'bars-line' /* CB-01 — bars metric + smooth line metric + stacked legend pills */
  | 'area-line' /* CB-04 — filled area metric + companion line — load vs capacity */
  | 'bars-plan'; /* CB-05 — volume bars + dashed stepped plan line (overload ramp) */

/** One combo metric: a named series with its own token + scale. */
export interface ComboMetric {
  /** Legend name — the pill reads '<GEOMETRY> · <label>' ('TRAIN MIN'). */
  label: string;
  /** Raw values, one per step (rest days ≤ 0 skip their bar). */
  data: number[];
  /** Color token override (e.g. 'var(--lime)'); defaults per variant. */
  color?: string;
  /** The value that maps to the plot top. Default `max(data)/0.94`
   *  (catalog headroom) — pass `1` for ready-made 0–1 fractions. */
  max?: number;
  /** Bars fill opacity (bars metric only). */
  opacity?: number;
}

export interface ComboChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Catalog variant (CB-01 / CB-04 / CB-05). */
  variant?: ComboChartVariant;
  /** The bars metric — drawn as the filled area on `area-line`. */
  bars?: ComboMetric;
  /** The line metric — drawn as dashed plan steps on `bars-plan`. */
  line?: ComboMetric;
  /** Top-left mono caption ('TRAINING × ENERGY'). */
  title?: string;
  /** Dashed goal rule, in the LINE metric's units (the kcal×weight card). */
  goal?: number;
  /** Goal rule pill ('GOAL 78KG'); '' hides the pill (the rule stays). */
  goalLabel?: string;
  /** Bottom-left faint label ('14 DAYS' — the catalog default card); '' hides. */
  caption?: string;
  /** Chip-pill annotation near the baseline ('PROGRESSIVE OVERLOAD'); '' hides. */
  note?: string;
  /** Stacked legend pills, top-right ('BARS · TRAIN MIN' / 'LINE · ENERGY'). */
  legend?: boolean;
  /** Interior gridlines + baseline (the catalog grid). */
  grid?: boolean;
  /** Soft glow underlay along the smooth line (the catalog glow modifier). */
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
/** default scale headroom: max(data) sits at 94% of the plot height */
const HEADROOM = 0.94;
/** interior gridline rows, as fractions of the plot height */
const GRID_ROWS = [0.25, 0.5, 0.75] as const;

/** legend-pill geometry prefixes per variant (bars first, line second) */
const PREFIXES: Record<ComboChartVariant, [string, string]> = {
  'bars-line': ['BARS', 'LINE'],
  'area-line': ['AREA', 'LINE'],
  'bars-plan': ['BARS', 'STEPS'],
};

/* the catalog demo pairs (combo-charts.html) — stories reproduce the cards */
const DEFAULT_BARS: Record<ComboChartVariant, ComboMetric> = {
  'bars-line': {
    label: 'TRAIN MIN',
    data: [0.5, 0, 0.7, 0.4, 0, 0.8, 0.3, 0, 0.6, 0.5, 0, 0.9, 0.4, 0.6],
    color: 'var(--violet)',
    max: 1,
  },
  'area-line': {
    label: 'ENERGY',
    data: [0.5, 0.55, 0.48, 0.6, 0.63, 0.52, 0.66, 0.68, 0.58, 0.63, 0.67, 0.55, 0.7, 0.74],
    color: 'var(--mint)',
    max: 1,
  },
  'bars-plan': {
    label: 'LIFTED',
    data: [0.42, 0.38, 0.47, 0.44, 0.52, 0.49, 0.57, 0.53, 0.62, 0.58, 0.66, 0.64, 0.72, 0.69],
    color: 'var(--mint)',
    max: 1,
  },
};
const DEFAULT_LINE: Record<ComboChartVariant, ComboMetric> = {
  'bars-line': {
    label: 'ENERGY',
    data: [0.5, 0.55, 0.48, 0.6, 0.63, 0.52, 0.66, 0.68, 0.58, 0.63, 0.67, 0.55, 0.7, 0.74],
    color: 'var(--mint)',
    max: 1,
  },
  'area-line': {
    label: 'STRAIN',
    data: [0.4, 0.35, 0.55, 0.3, 0.28, 0.6, 0.25, 0.22, 0.45, 0.35, 0.25, 0.62, 0.3, 0.24],
    color: 'var(--zone-mid)',
    max: 1,
  },
  'bars-plan': {
    label: 'PLAN',
    data: [0.4, 0.4, 0.45, 0.45, 0.5, 0.5, 0.55, 0.55, 0.6, 0.6, 0.65, 0.65, 0.7, 0.7],
    max: 1,
  },
};

type Pt = [number, number];

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** x position of data index `i` across `n` columns. */
const xAt = (i: number, n: number) => PAD.l + (i * PLOT_W) / (n - 1 || 1);
/** y position of a plot-height fraction `v` (0 = baseline, 1 = plot top). */
const yAt = (v: number) => PAD.t + (1 - v) * PLOT_H;

/** The metric's plot-top value (catalog headroom when `max` is omitted). */
function maxOf(m: ComboMetric): number {
  if (m.max != null && m.max > 0) return m.max;
  const top = Math.max(...m.data, 0);
  return top > 0 ? top / HEADROOM : 1;
}

/** Straight polyline through the points. */
function linePath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${rd(x)},${rd(y)}`).join(' ');
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (no overshoot).
 *  Faithful port; module-private copy (AreaChart/LineChart keep their own). */
function monotonePath(pts: Pt[]): string {
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

/** The metric's smooth-line points. */
function ptsOf(m: ComboMetric): Pt[] {
  const top = maxOf(m);
  return m.data.map((v, i) => [xAt(i, m.data.length), yAt(v / top)]);
}

/** The catalog `steps()` — stepped plan path (dashed by the caller). */
function stepsPath(m: ComboMetric): string {
  const n = m.data.length;
  const top = maxOf(m);
  const bw = PLOT_W / n;
  let d = '';
  m.data.forEach((v, i) => {
    const x = xAt(i, n);
    const y = yAt(v / top);
    d +=
      (i ? `L${rd(x - bw / 2)} ${rd(y)}` : `M${rd(x - bw / 2)} ${rd(y)}`) + `L${rd(x + bw / 2)} ${rd(y)}`;
  });
  return d;
}

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in combo.css. */
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
    <text className="lk-combo-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
      {children}
    </text>
  );
}

/** Chip-pill annotation (dark rounded rect + tinted hairline + mono text). */
function Tag({
  x,
  y,
  color,
  anchor = 'middle',
  children,
}: {
  x: number;
  y: number;
  color: string;
  anchor?: 'start' | 'middle' | 'end';
  children: string;
}) {
  const w = children.length * 5.35 + 12;
  let xa = anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2;
  xa = Math.max(PAD.l - 4, Math.min(xa, W - PAD.r - w + 4));
  return (
    <g>
      <rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(w)}
        height={13}
        rx={6.5}
        fill="var(--bg-0)"
        fillOpacity={0.78}
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <text className="lk-combo-tag" x={rd(xa + w / 2)} y={rd(y + 2.8)} fill={color} textAnchor="middle">
        {children}
      </text>
    </g>
  );
}

/**
 * ComboChart — dual-metric chart for product surfaces (catalog family
 * CB-01/04/05): two metrics, one canvas. `bars-line` (default) is THE
 * dual-metric dashboard chart — bars for one metric, a smooth line for the
 * other, stacked legend pills naming both; the metric pair + tokens are the
 * SELECT (workouts×energy, sleep×HRV, kcal×weight + goal rule …).
 * `area-line` fills the first metric as an area under the companion line
 * (load vs capacity); `bars-plan` draws volume bars against a dashed white
 * stepped plan line (the progressive-overload ramp).
 */
export function ComboChart({
  variant = 'bars-line',
  bars,
  line,
  title,
  goal,
  goalLabel = 'GOAL',
  caption,
  note,
  legend = true,
  grid = true,
  shine = false,
  ariaLabel = 'Combo chart',
  className,
  ...rest
}: ComboChartProps) {
  const usingDefaults = bars === undefined && line === undefined;
  const barsM = bars ?? DEFAULT_BARS[variant];
  const lineM = line ?? DEFAULT_LINE[variant];
  const [pref1, pref2] = PREFIXES[variant];

  const barsColor = barsM.color ?? (variant === 'bars-line' ? 'var(--violet)' : 'var(--mint)');
  /* the plan steps are the catalog's white-70% unless a token is passed */
  const planDefault = variant === 'bars-plan' && lineM.color == null;
  const lineColor = lineM.color ?? (variant === 'area-line' ? 'var(--zone-mid)' : planDefault ? 'var(--text)' : 'var(--mint)');
  const linePill = planDefault ? 'var(--text-dim)' : lineColor;

  const resolvedCaption = caption ?? (variant === 'bars-line' && usingDefaults ? '14 DAYS' : undefined);
  const resolvedNote = note ?? (variant === 'bars-plan' && usingDefaults ? 'PROGRESSIVE OVERLOAD' : undefined);

  /* ---- bars / area (the first metric) ---- */
  const barsTop = maxOf(barsM);
  const nBars = barsM.data.length;
  const bw = (PLOT_W / Math.max(1, nBars)) * 0.5;
  const barRects =
    variant === 'area-line'
      ? null
      : barsM.data.map((v, i) => {
          if (v <= 0) return null;
          const x = xAt(i, nBars) - bw / 2;
          const y = yAt(v / barsTop);
          return (
            <rect
              key={i}
              x={rd(x)}
              y={rd(y)}
              width={rd(bw)}
              height={rd(H - PAD.b - y)}
              rx={Math.min(3, bw / 2)}
              fill={barsColor}
              opacity={barsM.opacity ?? 0.55}
            />
          );
        });
  const areaD =
    variant === 'area-line' && barsM.data.length
      ? `${monotonePath(ptsOf(barsM))}L${W - PAD.r} ${H - PAD.b}L${PAD.l} ${H - PAD.b}Z`
      : null;

  /* ---- the companion line / steps (the second metric) ---- */
  const lineD = lineM.data.length ? (variant === 'bars-plan' ? stepsPath(lineM) : monotonePath(ptsOf(lineM))) : null;

  /* ---- goal rule (in the line metric's units) ---- */
  const goalY = goal != null ? yAt(goal / maxOf(lineM)) : null;

  return (
    <div className={cn('lk-combo', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-combo-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {/* catalog grid: 3 interior rows + solid baseline */}
        {grid ? (
          <g>
            {GRID_ROWS.map((f) => (
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
            <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="var(--border)" strokeWidth={1} />
          </g>
        ) : null}

        {title ? (
          <Label x={PAD.l + 2} y={11} fill="var(--text-faint)" anchor="start">
            {title}
          </Label>
        ) : null}

        {barRects}
        {areaD ? <path d={areaD} fill={barsColor} opacity={0.14} /> : null}
        {areaD && barsM.data.length ? (
          <path d={monotonePath(ptsOf(barsM))} fill="none" stroke={barsColor} strokeWidth={2.2} strokeLinecap="round" />
        ) : null}

        {lineD && variant === 'bars-plan' ? (
          <path
            d={lineD}
            fill="none"
            stroke={lineColor}
            strokeOpacity={planDefault ? 0.7 : 1}
            strokeWidth={1.6}
            strokeDasharray="4 3"
          />
        ) : lineD ? (
          <>
            {shine ? (
              <path
                className="lk-combo-shine"
                d={lineD}
                fill="none"
                stroke={lineColor}
                strokeWidth={7}
                opacity={0.45}
                strokeLinecap="round"
              />
            ) : null}
            <path d={lineD} fill="none" stroke={lineColor} strokeWidth={2.2} strokeLinecap="round" />
          </>
        ) : null}

        {goalY != null ? (
          <>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={rd(goalY)}
              y2={rd(goalY)}
              stroke="var(--zone-mid)"
              strokeWidth={1.2}
              strokeDasharray="4 4"
            />
            {goalLabel ? (
              <Tag x={PAD.l + 8} y={goalY - 10} color="var(--zone-mid)" anchor="start">
                {goalLabel}
              </Tag>
            ) : null}
          </>
        ) : null}

        {legend ? (
          <>
            <Tag x={W - PAD.r - 4} y={24} color={barsColor} anchor="end">
              {`${pref1} · ${barsM.label}`}
            </Tag>
            <Tag x={W - PAD.r - 4} y={40} color={linePill} anchor="end">
              {`${pref2} · ${lineM.label}`}
            </Tag>
          </>
        ) : null}

        {resolvedNote ? (
          <Tag x={PAD.l + 66} y={H - 22} color="var(--text-dim)">
            {resolvedNote}
          </Tag>
        ) : null}
        {resolvedCaption ? (
          <Label x={PAD.l + 2} y={H - 3} fill="var(--text-faint)" anchor="start">
            {resolvedCaption}
          </Label>
        ) : null}
      </svg>
    </div>
  );
}
