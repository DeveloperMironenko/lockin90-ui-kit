import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* FunnelChart — the shared catalog conversion-funnel family (FN-01/03/04/05,
   lockin90-design/charts/funnel-charts.html): centered trapezoid bands or
   left-aligned stage bars drawn in a fixed 320×150 viewBox, mono labels,
   coral per-stage drop-off, optional previous-period ghost bars.
   SEPARATE from the admin operator funnel (`@lockin90/ui/admin` FunnelChart,
   `.lk-funnel-*`) which keeps its richer per-step meta for admin surfaces —
   this one (`.lk-fnl-*`) is the product-surface, cross-platform family. */

export type FunnelChartVariant =
  | 'band-funnel' /* FN-01 — centered symmetric trapezoid bands + stage labels */
  | 'bar-funnel' /* FN-03 — left-aligned stage bars + % + coral drop labels */
  | 'zone-funnel' /* FN-04 — bar funnel, stage color = conversion zone */
  | 'compare-funnel'; /* FN-05 — thin bars over previous-period ghost bars */

/** FN-01 band fill SELECT: solid spectrum tokens vs faint glass fill. */
export type FunnelChartFill = 'tokens' | 'glass';

/** One funnel stage, top (widest) → bottom. */
export interface FunnelStage {
  /** Stage name, drawn in mono (e.g. "SIGNED UP"). */
  label: string;
  /** Stage size — raw count or 0–1 fraction; geometry + the printed % are
   *  normalized against the FIRST stage's value (the funnel top = 100%). */
  value: number;
  /** Previous-period value (same units) — the ghost bar in `compare-funnel`. */
  prev?: number;
  /** Color token override for this stage (e.g. 'var(--violet)'). Ignored by
   *  `zone-funnel`, where the conversion zone owns the color. */
  color?: string;
}

export interface FunnelChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Ordered stages, funnel top first. */
  stages?: FunnelStage[];
  /** Catalog variant (FN-01 / FN-03 / FN-04 / FN-05). */
  variant?: FunnelChartVariant;
  /** Band fill for `band-funnel` — solid spectrum tokens vs faint glass. */
  fill?: FunnelChartFill;
  /** Top-left mono caption (e.g. 'ONBOARDING · THIS MONTH'). */
  title?: string;
  /** Soft color glow behind the bands/bars (the catalog glow modifier). */
  shine?: boolean;
  /** Footer caption for `compare-funnel`'s ghost bars. */
  ghostLabel?: string;
  /** Accessible description of the chart. */
  ariaLabel?: string;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_W = W - PAD.l - PAD.r; // 298
const PLOT_H = H - PAD.t - PAD.b; // 120
/** widest band = 78% of the plot width, centered */
const BAND_MAX_W = PLOT_W * 0.78;
/** bar variants reserve a 96px label gutter left + % / drop labels right */
const BAR_X = PAD.l + 102;
const BAR_MAX_W = PLOT_W - 118; // 180

/* catalog stage palette (funnel-charts.html STAGES), wraps for longer funnels */
const STAGE_COLORS = ['var(--cyan)', 'var(--mint)', 'var(--lime)', 'var(--zone-mid)'] as const;

/* previous-period ghost fill — the catalog's white-14%. No token equivalent:
   --glass-2 (.075) is half as bright, --border-2 (.16) is a border token. */
const GHOST_FILL = 'rgba(255, 255, 255, 0.14)';

const DEFAULT_STAGES: FunnelStage[] = [
  { label: 'SIGNED UP', value: 1 },
  { label: 'CONNECTED DEVICE', value: 0.72 },
  { label: 'FIRST SYNC', value: 0.58 },
  { label: 'DAY-7 ACTIVE', value: 0.34 },
];

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** Conversion-zone color — the funnel catalog's thresholds (>0.6 / >0.4). */
const zoneColor = (frac: number): string =>
  frac > 0.6 ? 'var(--zone-high)' : frac > 0.4 ? 'var(--zone-mid)' : 'var(--zone-low)';

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in funnelchart.css. */
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
    <text className="lk-fnl-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
      {children}
    </text>
  );
}

/**
 * FunnelChart — conversion-funnel chart for product surfaces (catalog family
 * FN-01…FN-05). `band-funnel` draws the classic centered trapezoid bands
 * (solid spectrum tokens or faint `glass` fill); the bar variants draw
 * left-aligned stage bars with the conversion % after each bar and the coral
 * per-stage drop-off at the right — `zone-funnel` colors each bar by its
 * conversion zone, `compare-funnel` layers thin bars over previous-period
 * ghost bars. Values are normalized against the first stage.
 */
export function FunnelChart({
  stages = DEFAULT_STAGES,
  variant = 'band-funnel',
  fill = 'tokens',
  title,
  shine = false,
  ghostLabel = 'GHOST = LAST MONTH',
  ariaLabel = 'Conversion funnel',
  className,
  ...rest
}: FunnelChartProps) {
  const isZone = variant === 'zone-funnel';
  const isCompare = variant === 'compare-funnel';
  const isBars = variant !== 'band-funnel';
  const glass = fill === 'glass';

  // normalize against the funnel top (first stage = 100%), clamped 0–1
  const base = stages.length > 0 && stages[0].value > 0 ? stages[0].value : 1;
  const frac = stages.map((s) => Math.max(0, Math.min(1, s.value / base)));
  const n = stages.length || 1;

  const colorOf = (i: number): string =>
    isZone ? zoneColor(frac[i]) : (stages[i].color ?? STAGE_COLORS[i % STAGE_COLORS.length]);

  const glow = (color: string): CSSProperties | undefined =>
    shine ? ({ ['--lk-fnl-glow']: color } as CSSProperties) : undefined;

  return (
    <div className={cn('lk-fnl', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-fnl-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {title ? (
          <Label x={PAD.l + 2} y={11} fill="var(--text-faint)" anchor="start">
            {title}
          </Label>
        ) : null}

        {isBars
          ? /* ---- FN-03/04/05 · left-aligned stage bars ---- */
            stages.map((stage, i) => {
              const rh = PLOT_H / n;
              const y = PAD.t + 6 + i * rh;
              const cy = y + rh / 2;
              const col = colorOf(i);
              const barW = Math.max(8, BAR_MAX_W * frac[i]);
              const prevFrac =
                isCompare && stage.prev != null
                  ? Math.max(0, Math.min(1, stage.prev / base))
                  : null;
              const drop =
                i > 0 && frac[i - 1] > 0
                  ? Math.max(0, Math.round((1 - frac[i] / frac[i - 1]) * 100))
                  : null;

              return (
                <g key={i}>
                  <Label x={PAD.l + 96} y={cy + 3} fill="var(--text-dim)" anchor="end">
                    {stage.label}
                  </Label>
                  {prevFrac != null ? (
                    <rect
                      x={BAR_X}
                      y={rd(cy - 8)}
                      width={rd(BAR_MAX_W * prevFrac)}
                      height={5}
                      rx={2.5}
                      fill={GHOST_FILL}
                    />
                  ) : null}
                  <rect
                    className={shine ? 'lk-fnl-shine' : undefined}
                    style={glow(col)}
                    x={BAR_X}
                    y={rd(cy - (isCompare ? 1 : 6))}
                    width={rd(barW)}
                    height={isCompare ? 7 : 12}
                    rx={isCompare ? 3.5 : 6}
                    fill={col}
                    opacity={0.92}
                  />
                  <Label x={PAD.l + 108 + barW} y={cy + 3.5} fill={col} anchor="start">
                    {`${Math.round(frac[i] * 100)}%`}
                  </Label>
                  {drop != null ? (
                    <Label x={W - PAD.r - 2} y={y + 3} fill="var(--zone-low)" anchor="end">
                      {`−${drop}%`}
                    </Label>
                  ) : null}
                </g>
              );
            })
          : /* ---- FN-01 · centered trapezoid bands ---- */
            stages.map((stage, i) => {
              const bh = (PLOT_H - 18) / n;
              const y0 = PAD.t + 8 + i * (bh + 4);
              const y1 = y0 + bh;
              const cx = W / 2;
              const wTop = BAND_MAX_W * (i === 0 ? frac[0] : frac[i - 1]);
              const wBot = BAND_MAX_W * frac[i];
              const col = colorOf(i);
              const d = `M${rd(cx - wTop / 2)} ${rd(y0)}L${rd(cx + wTop / 2)} ${rd(
                y0,
              )}L${rd(cx + wBot / 2)} ${rd(y1)}L${rd(cx - wBot / 2)} ${rd(y1)}Z`;

              return (
                <g key={i}>
                  <path
                    className={shine ? 'lk-fnl-shine' : undefined}
                    style={glow(col)}
                    d={d}
                    fill={col}
                    fillOpacity={glass ? 0.14 : 0.4}
                    stroke={col}
                    strokeWidth={glass ? 1.4 : 1}
                    strokeOpacity={0.8}
                  />
                  <Label x={cx} y={(y0 + y1) / 2 + 3} fill={glass ? col : 'var(--text)'}>
                    {`${stage.label} · ${Math.round(frac[i] * 100)}%`}
                  </Label>
                </g>
              );
            })}

        {isCompare && ghostLabel ? (
          <Label x={W - PAD.r - 2} y={H - 2} fill="var(--text-faint)" anchor="end">
            {ghostLabel}
          </Label>
        ) : null}
      </svg>
    </div>
  );
}
