import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* BulletChart — the shared catalog bullet family (BL-01/02/05,
   lockin90-design/charts/bullet-charts.html): actual vs target vs range in
   one compact bar — the KPI-row workhorse — drawn in a fixed 320×150 viewBox
   with mono catalog labels. Range bands + slim value bar + white target tick;
   over-target overflows magenta PAST the scale end.
   Key: `.lk-bullet-*` (partner CSS packages/ui/src/styles/components/bullet.css). */

export type BulletChartVariant =
  | 'bullets' /* BL-01 — bullet rows · SELECT: rows, density, zone coloring */
  | 'single-bullet' /* BL-02 — one large bullet with the anatomy labeled + TARGET pill */
  | 'over-bullets'; /* BL-05 — the over-limit story: magenta overflow + OVER pills */

/** One bullet row: actual vs target vs range on a 0..max scale. */
export interface BulletRow {
  /** Left mono label ('PROTEIN'). */
  label: string;
  /** The actual value — may exceed `max` (the magenta overflow). */
  value: number;
  /** Scale end (the bar box spans 0..max). Default `1` — pass real units
   *  ('150' grams) to feed real data. */
  max?: number;
  /** Target — the white tick (same units as `value`). */
  target?: number;
  /** Band boundaries `[low, ok]` (same units). Default `[0.45, 0.75]·max`. */
  ranges?: [number, number];
  /** Value-bar color. Defaults cycle mint / cyan / violet / indigo. */
  color?: string;
  /** Right value text ('132/150G'). */
  display?: string;
  /** Right value color. Default `--text-dim`. */
  displayColor?: string;
  /** `over-bullets` OVER pill ('OVER +180 KCAL'). */
  note?: string;
}

export interface BulletChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Catalog variant (BL-01 / BL-02 / BL-05). */
  variant?: BulletChartVariant;
  /** The bullet rows (`single-bullet` draws the first row only). */
  rows?: BulletRow[];
  /** BL-01 SELECT — row height 16px (`default`) or 13px (`compact`). */
  density?: 'default' | 'compact';
  /** BL-01 SELECT — color bars by attainment zone (value/target: ≥1.3 over →
   *  zone-low · ≥0.85 on → zone-high · else under → zone-mid) instead of
   *  the metric tokens. */
  zoneColoring?: boolean;
  /** `single-bullet` anatomy band words. */
  bandLabels?: [string, string, string];
  /** `single-bullet` TARGET pill ('TARGET 160G' with the default row); '' hides. */
  note?: string;
  /** Bottom explainer line — derived per variant/mode; '' hides. */
  caption?: string;
  /** Top-left mono caption ('MACROS · TODAY'). */
  title?: string;
  /** Soft glow underlay under each value bar (the catalog glow modifier). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
}

/* ---- catalog geometry (viewBox units — charts/bullet-charts.html) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
/** bar box: left edge + width (labels left, values right — the page's BX/BW) */
const BX = 78;
const BW = 174;
/** overflow segment caps at 11% of the scale, drawn 2px past the box end */
const OVER_CAP = 0.11;
/** per-variant/density row layout: bar height, first row y, row spacing */
const LAYOUTS = {
  default: { h: 16, y0: 40, dy: 34 },
  compact: { h: 13, y0: 34, dy: 28 },
  single: { h: 22, y0: 66, dy: 0 },
  over: { h: 20, y0: 56, dy: 48 },
} as const;

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;

/* default hue cycle (the catalog rows) */
const ROW_COLORS = ['var(--mint)', 'var(--cyan)', 'var(--violet)', 'var(--indigo)'];
/* default band boundaries, as fractions of the scale (the catalog bullet()) */
const DEFAULT_RANGES: [number, number] = [0.45, 0.75];

/* the catalog demo data (bullet-charts.html) — stories reproduce the cards */
const DEFAULT_MACROS: BulletRow[] = [
  { label: 'PROTEIN', value: 0.88, target: 0.8, ranges: [0.5, 0.8], color: 'var(--mint)', display: '132/150G' },
  { label: 'CARBS', value: 0.62, target: 0.8, ranges: [0.5, 0.8], color: 'var(--cyan)', display: '155/250G' },
  { label: 'FAT', value: 1.12, target: 0.8, ranges: [0.5, 0.8], color: 'var(--violet)', display: '78/70G' },
];
const DEFAULT_SINGLE: BulletRow[] = [
  {
    label: 'PROTEIN',
    value: 0.86,
    target: 0.8,
    ranges: [0.45, 0.75],
    color: 'var(--mint)',
    display: '138G',
    displayColor: 'var(--mint)',
  },
];
const DEFAULT_OVER: BulletRow[] = [
  {
    label: 'KCAL',
    value: 1.09,
    target: 0.82,
    ranges: [0.5, 0.82],
    color: 'var(--cyan)',
    display: '2380',
    note: 'OVER +180 KCAL',
  },
  {
    label: 'SODIUM',
    value: 1.18,
    target: 0.7,
    ranges: [0.4, 0.7],
    color: 'var(--lime)',
    display: '2.8G',
    note: 'OVER +0.5G',
  },
];

/** Attainment-zone color (BL-01 SELECT): value/target ratio → zone token. */
const attainmentColor = (att: number) =>
  att >= 1.3 ? 'var(--zone-low)' : att >= 0.85 ? 'var(--zone-high)' : 'var(--zone-mid)';

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in bullet.css. */
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
    <text className="lk-bullet-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
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
      <text className="lk-bullet-tag" x={rd(xa + w / 2)} y={rd(y + 2.8)} fill={color} textAnchor="middle">
        {children}
      </text>
    </g>
  );
}

/** One bullet row (the catalog `bullet()`): stacked range bands + slim value
 *  bar + white target tick + labels; over-scale overflows magenta past the end. */
function Bullet({
  y,
  h,
  row,
  color,
  shine,
}: {
  y: number;
  h: number;
  row: BulletRow;
  color: string;
  shine: boolean;
}) {
  const max = row.max != null && row.max > 0 ? row.max : 1;
  const frac = Math.max(0, row.value / max);
  const [r1, r2] = (row.ranges ? row.ranges.map((r) => r / max) : DEFAULT_RANGES) as [number, number];
  const tFrac = row.target != null ? row.target / max : null;
  const vw = Math.min(frac, 1) * BW;
  const bh = h * 0.44;
  const over = frac > 1 ? Math.min(frac - 1, OVER_CAP) * BW : 0;
  const vx = BX + BW + 8 + (frac > 1 ? over + 2 : 0);
  return (
    <g>
      {/* stacked range bands: full scale + [0..ok] + [0..low], each a touch brighter */}
      {[
        [1, 0.045],
        [r2, 0.05],
        [r1, 0.06],
      ].map(([b, op], i) => (
        <rect
          key={i}
          x={BX}
          y={rd(y - h / 2)}
          width={rd(b * BW)}
          height={h}
          rx={h / 2}
          fill="var(--text)"
          fillOpacity={op}
        />
      ))}
      {shine ? (
        <rect
          className="lk-bullet-shine"
          x={BX}
          y={rd(y - bh / 2 - 2)}
          width={rd(vw)}
          height={rd(bh + 4)}
          rx={(bh + 4) / 2}
          fill={color}
          opacity={0.5}
        />
      ) : null}
      <rect x={BX} y={rd(y - bh / 2)} width={rd(vw)} height={rd(bh)} rx={bh / 2} fill={color} />
      {over > 0 ? (
        <rect x={BX + BW + 2} y={rd(y - bh / 2)} width={rd(over)} height={rd(bh)} rx={bh / 2} fill="var(--magenta)" />
      ) : null}
      {tFrac != null ? (
        <line
          x1={rd(BX + tFrac * BW)}
          x2={rd(BX + tFrac * BW)}
          y1={rd(y - h / 2 - 2.5)}
          y2={rd(y + h / 2 + 2.5)}
          stroke="var(--text)"
          strokeOpacity={0.85}
          strokeWidth={2}
        />
      ) : null}
      <Label x={BX - 8} y={y + 3} fill="var(--text-dim)" anchor="end">
        {row.label}
      </Label>
      {row.display ? (
        <Label x={vx} y={y + 3} fill={row.displayColor ?? 'var(--text-dim)'} anchor="start">
          {row.display}
        </Label>
      ) : null}
    </g>
  );
}

/**
 * BulletChart — actual-vs-target-vs-range KPI bars for product surfaces
 * (catalog family BL-01/02/05). `bullets` is THE macro-tracker row stack:
 * stacked range bands, a slim value bar, a white target tick — over-target
 * overflows magenta PAST the scale end; SELECT rows, density (16px/13px
 * compact) and metric-token vs attainment-zone coloring. `single-bullet`
 * teaches the anatomy (LOW/OK/GOOD band words + TARGET pill); `over-bullets`
 * tells the over-limit story with magenta OVER pills.
 */
export function BulletChart({
  variant = 'bullets',
  rows,
  density = 'default',
  zoneColoring = false,
  bandLabels = ['LOW', 'OK', 'GOOD'],
  note,
  caption,
  title,
  shine = false,
  ariaLabel = 'Bullet chart',
  className,
  ...rest
}: BulletChartProps) {
  const usingDefaults = rows === undefined;
  const resolvedRows =
    rows ?? (variant === 'single-bullet' ? DEFAULT_SINGLE : variant === 'over-bullets' ? DEFAULT_OVER : DEFAULT_MACROS);
  const L =
    variant === 'single-bullet' ? LAYOUTS.single : variant === 'over-bullets' ? LAYOUTS.over : LAYOUTS[density];

  const colorOf = (row: BulletRow, i: number) => {
    if (zoneColoring && row.target != null && row.target > 0) return attainmentColor(row.value / row.target);
    return row.color ?? ROW_COLORS[i % ROW_COLORS.length];
  };

  const resolvedCaption =
    caption ??
    (variant === 'bullets' && density === 'default'
      ? shine
        ? 'GLOW UNDER EACH BAR'
        : zoneColoring
          ? 'BAR COLOR = ATTAINMENT ZONE (ON / UNDER / OVER)'
          : 'TICK = DAILY TARGET · MAGENTA = OVER'
      : variant === 'single-bullet'
        ? `BANDS = ${bandLabels[0]} / ${bandLabels[1]} / ${bandLabels[2]} RANGES · TICK = TARGET`
        : undefined);

  let body = null;
  if (variant === 'single-bullet') {
    /* ---- BL-02 · one large bullet, anatomy labeled ---- */
    const row = resolvedRows[0];
    const max = row && row.max != null && row.max > 0 ? row.max : 1;
    const [r1, r2] = (row?.ranges ? row.ranges.map((r) => r / max) : DEFAULT_RANGES) as [number, number];
    const tFrac = row?.target != null ? row.target / max : null;
    const resolvedNote = note ?? (usingDefaults ? 'TARGET 160G' : undefined);
    body = row ? (
      <>
        <Bullet y={L.y0} h={L.h} row={row} color={colorOf(row, 0)} shine={shine} />
        <Label x={BX + (r1 / 2) * BW} y={92} fill="var(--text-faint)">
          {bandLabels[0]}
        </Label>
        <Label x={BX + ((r1 + r2) / 2) * BW} y={92} fill="var(--text-faint)">
          {bandLabels[1]}
        </Label>
        <Label x={BX + ((r2 + 1) / 2) * BW} y={92} fill="var(--text-faint)">
          {bandLabels[2]}
        </Label>
        {resolvedNote && tFrac != null ? (
          <Tag x={BX + tFrac * BW} y={34} color="var(--text-dim)">
            {resolvedNote}
          </Tag>
        ) : null}
        {resolvedCaption ? (
          <Label x={BX + BW / 2} y={118} fill="var(--text-faint)">
            {resolvedCaption}
          </Label>
        ) : null}
      </>
    ) : null;
  } else if (variant === 'over-bullets') {
    /* ---- BL-05 · the over-limit story ---- */
    body = (
      <>
        {resolvedRows.map((row, i) => {
          const y = L.y0 + i * L.dy;
          return (
            <g key={i}>
              <Bullet y={y} h={L.h} row={row} color={colorOf(row, i)} shine={shine} />
              {row.note ? (
                <Tag x={BX + BW - 10} y={y + (i % 2 ? 26 : -26)} color="var(--magenta)">
                  {row.note}
                </Tag>
              ) : null}
            </g>
          );
        })}
      </>
    );
  } else {
    /* ---- BL-01 · the bullet rows (SELECT rows / density / coloring) ---- */
    body = (
      <>
        {resolvedRows.map((row, i) => (
          <Bullet key={i} y={L.y0 + i * L.dy} h={L.h} row={row} color={colorOf(row, i)} shine={shine} />
        ))}
        {resolvedCaption ? (
          <Label x={BX + BW / 2} y={136} fill="var(--text-faint)">
            {resolvedCaption}
          </Label>
        ) : null}
      </>
    );
  }

  return (
    <div className={cn('lk-bullet', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-bullet-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {title ? (
          <Label x={PAD.l + 2} y={11} fill="var(--text-faint)" anchor="start">
            {title}
          </Label>
        ) : null}
        {body}
      </svg>
    </div>
  );
}
