import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* BiomarkerRange — the shared catalog biomarker family (BR-01…BR-05,
   lockin90-design/charts/biomarker-charts.html): lab results the readable way —
   a value dot inside its reference range, drawn in a fixed 320×150 viewBox with
   mono catalog labels. Panel rows, a labeled single-marker anatomy view, rows
   with last-4-tests sparks, a 2×3 tile grid, and a one-marker range-history
   journey. SUPERSEDES the web-only ADMIN ReferenceRangeBar (`@lockin90/ui/admin`,
   `.lk-refrangebar-*`) for product surfaces — the admin bar stays admin-only.
   This one (`.lk-bmr-*`) is the cross-platform product-surface family. */

export type BiomarkerRangeVariant =
  | 'panel-rows' /* BR-01 — marker rows: faint scale + mint band + value dot + LOW/HIGH flags */
  | 'single-marker' /* BR-02 — one large labeled row: zones, range numbers, pulsing dot + result */
  | 'marker-trend' /* BR-03 — rows + last-4-tests spark + direction arrow per marker */
  | 'panel-grid' /* BR-04 — 2×3 tiles: name + OK/LOW/HIGH verdict + mini row + value */
  | 'range-history'; /* BR-05 — one marker over test dates, line crossing into the band */

/** Trend verdict for `marker-trend` — normally derived from `history`. */
export type BiomarkerTrend = 'improving' | 'worsening' | 'flat';

/** One lab marker: a measured value on a display scale with a reference range. */
export interface BiomarkerMarker {
  /** Short marker name, drawn in mono (e.g. 'VIT D'). */
  name: string;
  /** Latest measured value (same units as the scale). */
  value: number;
  /** Scale floor — the left edge of the drawn track. */
  min: number;
  /** Scale ceiling — the right edge of the drawn track. */
  max: number;
  /** Reference-range lower bound (start of the mint band). */
  low: number;
  /** Reference-range upper bound (end of the mint band). */
  high: number;
  /** Unit appended to the readout (e.g. 'NG/ML' → '48 NG/ML'). */
  unit?: string;
  /** Preformatted readout override when `value + unit` doesn't cut it ('5.2%'). */
  display?: string;
  /** Past test values, oldest → newest (last ≈ `value`). `marker-trend` sparks
   *  the last 4; `range-history` plots them all. */
  history?: number[];
  /** Per-test date labels for `range-history`'s x-axis (pairs with `history`). */
  dates?: string[];
  /** Explicit trend override for `marker-trend` (else derived from `history`:
   *  moved toward the range = improving, away = worsening, else flat). */
  trend?: BiomarkerTrend;
}

export interface BiomarkerRangeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** The lab markers. `single-marker` / `range-history` use the first one. */
  markers?: BiomarkerMarker[];
  /** Catalog variant (BR-01 / BR-02 / BR-03 / BR-04 / BR-05). */
  variant?: BiomarkerRangeVariant;
  /** Top-left mono caption (e.g. 'BLOOD PANEL · JUN'). */
  title?: string;
  /** Bottom faint legend line. Defaults to the catalog teaching caption per
   *  variant ('BAND = REFERENCE RANGE · DOT = YOUR VALUE', 'SPARK = LAST 4
   *  TESTS', `single-marker`'s derived 'NAME · OPTIMAL low–high'); '' hides it. */
  caption?: string;
  /** `range-history` context pill, top-right, mint ('SUPPLEMENTED SINCE FEB'). */
  note?: string;
  /** `range-history` state pill anchored at the first test, coral ('DEFICIENT'). */
  flag?: string;
  /** Soft color glow on the value dots (the catalog glow modifier). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_H = H - PAD.t - PAD.b; // 120

/** `marker-trend` sparks the LAST 4 tests (the catalog's spark window). */
const SPARK_TESTS = 4;

/* the catalog card's teaching captions — overridable / hideable via `caption` */
const DEFAULT_CAPTIONS: Partial<Record<BiomarkerRangeVariant, string>> = {
  'panel-rows': 'BAND = REFERENCE RANGE · DOT = YOUR VALUE',
  'marker-trend': 'SPARK = LAST 4 TESTS',
};

/* the catalog PANEL, on real-ish scales (fractions match biomarker-charts.html) */
const DEFAULT_MARKERS: BiomarkerMarker[] = [
  {
    name: 'VIT D',
    value: 48,
    min: 0,
    max: 86,
    low: 30,
    high: 60,
    unit: 'NG/ML',
    history: [17, 26, 38, 45, 48],
    dates: ['JAN', 'MAR', 'MAY', 'JUL', 'NOW'],
  },
  { name: 'FERRITIN', value: 22, min: 0, max: 120, low: 36, high: 90, unit: 'UG/L', history: [48, 38, 30, 22] },
  { name: 'HBA1C', value: 5.2, min: 3, max: 8.5, low: 4.1, high: 6, display: '5.2%', history: [5.3, 5.2, 5.25, 5.2] },
  { name: 'LDL', value: 4.4, min: 0, max: 5.6, low: 0.8, high: 3.4, unit: 'MMOL', history: [3.0, 3.6, 4.1, 4.4] },
];

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** A value's 0–1 position on the marker's display scale, clamped. */
const fracOf = (m: BiomarkerMarker, v: number) =>
  Math.max(0, Math.min(1, (v - m.min) / (m.max - m.min || 1)));

/** Out-of-range state — the LOW/HIGH flag text, or null when in range. */
const stateOf = (m: BiomarkerMarker) =>
  m.value < m.low ? 'LOW' : m.value > m.high ? 'HIGH' : null;

/** The readout string: explicit `display`, else `value` (+ unit). */
const readoutOf = (m: BiomarkerMarker) => m.display ?? `${m.value}${m.unit ? ` ${m.unit}` : ''}`;

/** Compact readout for the trend column — the number only ('48', '5.2%'). */
const shortReadoutOf = (m: BiomarkerMarker) => readoutOf(m).split(' ')[0];

/** Distance outside the reference range (0 while inside). */
const offRange = (m: BiomarkerMarker, v: number) =>
  v < m.low ? m.low - v : v > m.high ? v - m.high : 0;

/** Derive the trend verdict from the spark window: moved toward the reference
 *  range = improving, away = worsening, else flat (in-range drift is neutral). */
function trendOf(m: BiomarkerMarker): BiomarkerTrend {
  if (m.trend) return m.trend;
  const hist = (m.history ?? []).slice(-SPARK_TESTS);
  if (hist.length < 2) return 'flat';
  const d = offRange(m, hist[hist.length - 1]) - offRange(m, hist[0]);
  return d < 0 ? 'improving' : d > 0 ? 'worsening' : 'flat';
}

/** Direction arrow: raw spark delta sign; flat is always '→'. */
function arrowOf(m: BiomarkerMarker, trend: BiomarkerTrend): string {
  if (trend === 'flat') return '→';
  const hist = (m.history ?? []).slice(-SPARK_TESTS);
  if (hist.length >= 2) return hist[hist.length - 1] >= hist[0] ? '↑' : '↓';
  return trend === 'improving' ? '↑' : '↓';
}

const TREND_COLORS: Record<BiomarkerTrend, string> = {
  improving: 'var(--mint)',
  worsening: 'var(--zone-low)',
  flat: 'var(--text-dim)',
};

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in biomarker.css. */
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
    <text className="lk-bmr-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
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
      <text className="lk-bmr-tag" x={rd(xa + w / 2)} y={rd(y + 2.8)} fill={color} textAnchor="middle">
        {children}
      </text>
    </g>
  );
}

/** One range row: faint scale + mint reference band + state-colored value dot. */
function MarkerRow({
  m,
  y,
  x0,
  x1,
  shine,
  trackH = 5,
  showName = true,
  showVal = true,
  showFlag = true,
}: {
  m: BiomarkerMarker;
  y: number;
  x0: number;
  x1: number;
  shine: boolean;
  trackH?: number;
  showName?: boolean;
  showVal?: boolean;
  showFlag?: boolean;
}) {
  const w = x1 - x0;
  const bad = stateOf(m);
  const fLo = fracOf(m, m.low);
  const fHi = fracOf(m, m.high);
  const dx = x0 + fracOf(m, m.value) * w;
  const col = bad ? 'var(--zone-low)' : 'var(--mint)';
  return (
    <g>
      <rect x={x0} y={rd(y - trackH / 2)} width={w} height={trackH} rx={trackH / 2} fill="var(--glass-2)" />
      <rect
        x={rd(x0 + fLo * w)}
        y={rd(y - trackH / 2)}
        width={rd((fHi - fLo) * w)}
        height={trackH}
        rx={trackH / 2}
        fill="var(--mint)"
        opacity={0.22}
      />
      <circle
        className={cn('lk-bmr-dot', shine && 'lk-bmr-dot--shine')}
        cx={rd(dx)}
        cy={y}
        r={4}
        fill={col}
        stroke="var(--bg-0)"
        strokeOpacity={0.85}
        strokeWidth={1.2}
        style={{ color: col } as CSSProperties}
      />
      {bad && showFlag ? (
        <Label x={dx} y={y - 9} fill="var(--zone-low)">
          {bad}
        </Label>
      ) : null}
      {showName ? (
        <Label x={x0 - 8} y={y + 3} fill="var(--text-dim)" anchor="end">
          {m.name}
        </Label>
      ) : null}
      {showVal ? (
        <Label x={x1 + 8} y={y + 3} fill={bad ? 'var(--zone-low)' : 'var(--text-dim)'} anchor="start">
          {readoutOf(m)}
        </Label>
      ) : null}
    </g>
  );
}

/**
 * BiomarkerRange — lab-panel reference-range chart for product surfaces
 * (catalog family BR-01…BR-05). `panel-rows` is the signature lab-results
 * screen: one row per marker with the value dot mint in-range / coral out and
 * LOW/HIGH flags. `single-marker` teaches the anatomy (zones, range numbers,
 * pulsing dot + big result). `marker-trend` adds a last-4-tests spark and a
 * direction arrow per row. `panel-grid` packs markers into verdict tiles.
 * `range-history` follows one marker across test dates into its band.
 */
export function BiomarkerRange({
  markers = DEFAULT_MARKERS,
  variant = 'panel-rows',
  title,
  caption,
  note,
  flag,
  shine = false,
  ariaLabel = 'Biomarker reference ranges',
  className,
  ...rest
}: BiomarkerRangeProps) {
  const m0 = markers[0];
  const resolvedCaption =
    caption ??
    (variant === 'single-marker' && m0
      ? `${m0.name} · OPTIMAL ${m0.low}–${m0.high}`
      : DEFAULT_CAPTIONS[variant]);

  return (
    <div className={cn('lk-bmr', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-bmr-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {title ? (
          <Label x={PAD.l + 2} y={11} fill="var(--text-faint)" anchor="start">
            {title}
          </Label>
        ) : null}

        {variant === 'panel-rows' ? (
          /* ---- BR-01 · marker rows (the signature lab panel) ---- */
          <>
            {markers.map((m, i) => (
              <MarkerRow key={i} m={m} y={38 + i * 27} x0={96} x1={244} shine={shine} />
            ))}
            {resolvedCaption ? (
              <Label x={170} y={144} fill="var(--text-faint)">
                {resolvedCaption}
              </Label>
            ) : null}
          </>
        ) : variant === 'single-marker' && m0 ? (
          /* ---- BR-02 · one large row with the anatomy labeled ---- */
          (() => {
            const x0 = 60;
            const w = 200;
            const fLo = fracOf(m0, m0.low);
            const fHi = fracOf(m0, m0.high);
            const dx = x0 + fracOf(m0, m0.value) * w;
            const col = stateOf(m0) ? 'var(--zone-low)' : 'var(--mint)';
            return (
              <>
                <rect x={x0} y={58} width={w} height={10} rx={5} fill="var(--glass-2)" />
                <rect
                  x={rd(x0 + fLo * w)}
                  y={58}
                  width={rd((fHi - fLo) * w)}
                  height={10}
                  rx={5}
                  fill="var(--mint)"
                  opacity={0.25}
                />
                {/* pulsing value dot: glowing core + expanding fading ring */}
                <circle
                  className="lk-bmr-pulsecore"
                  cx={rd(dx)}
                  cy={63}
                  r={3.6}
                  fill={col}
                  style={{ color: col } as CSSProperties}
                />
                <circle
                  className="lk-bmr-pulsering"
                  cx={rd(dx)}
                  cy={63}
                  r={3.6}
                  fill="none"
                  stroke={col}
                  strokeWidth={1.4}
                />
                <Label x={x0 + (fLo * w) / 2} y={84} fill="var(--zone-low)">
                  LOW
                </Label>
                <Label x={x0 + ((fLo + fHi) / 2) * w} y={84} fill="var(--mint)">
                  OPTIMAL
                </Label>
                <Label x={x0 + ((fHi + 1) / 2) * w} y={84} fill="var(--zone-mid)">
                  HIGH
                </Label>
                <Label x={x0 + fLo * w} y={50} fill="var(--text-faint)">
                  {String(m0.low)}
                </Label>
                <Label x={x0 + fHi * w} y={50} fill="var(--text-faint)">
                  {String(m0.high)}
                </Label>
                <text className="lk-bmr-result" x={160} y={118} fill={col} textAnchor="middle">
                  {readoutOf(m0)}
                </text>
                {resolvedCaption ? (
                  <Label x={160} y={134} fill="var(--text-faint)">
                    {resolvedCaption}
                  </Label>
                ) : null}
              </>
            );
          })()
        ) : variant === 'marker-trend' ? (
          /* ---- BR-03 · rows + last-4-tests spark + direction arrow ---- */
          <>
            {markers.map((m, i) => {
              const y = 42 + i * 34;
              const trend = trendOf(m);
              const tcol = TREND_COLORS[trend];
              const spark = (m.history ?? []).slice(-SPARK_TESTS);
              const d = spark
                .map((v, j) => `${j ? 'L' : 'M'}${216 + j * 9} ${rd(y + 6 - fracOf(m, v) * 14)}`)
                .join('');
              return (
                <g key={i}>
                  <MarkerRow m={m} y={y} x0={84} x1={204} shine={shine} showFlag={false} showVal={false} />
                  {spark.length >= 2 ? <path d={d} fill="none" stroke={tcol} strokeWidth={1.4} /> : null}
                  <text className="lk-bmr-arrow" x={254} y={y + 4} fill={tcol} textAnchor="start">
                    {arrowOf(m, trend)}
                  </text>
                  <Label x={268} y={y + 3} fill={tcol} anchor="start">
                    {shortReadoutOf(m)}
                  </Label>
                </g>
              );
            })}
            {resolvedCaption ? (
              <Label x={160} y={140} fill="var(--text-faint)">
                {resolvedCaption}
              </Label>
            ) : null}
          </>
        ) : variant === 'panel-grid' ? (
          /* ---- BR-04 · 2×3 verdict tiles ---- */
          <>
            {markers.map((m, i) => {
              const gx = 16 + (i % 3) * 99;
              const gy = 28 + Math.floor(i / 3) * 56;
              const bad = stateOf(m);
              return (
                <g key={i}>
                  <rect
                    x={gx}
                    y={gy}
                    width={90}
                    height={48}
                    rx={10}
                    fill="var(--glass)"
                    stroke={bad ? 'var(--zone-low)' : 'var(--border)'}
                    strokeOpacity={bad ? 0.5 : 1}
                    strokeWidth={1}
                  />
                  <Label x={gx + 8} y={gy + 13} fill="var(--text-dim)" anchor="start">
                    {m.name}
                  </Label>
                  <Label x={gx + 82} y={gy + 13} fill={bad ? 'var(--zone-low)' : 'var(--mint)'} anchor="end">
                    {bad ?? 'OK'}
                  </Label>
                  <MarkerRow
                    m={m}
                    y={gy + 26}
                    x0={gx + 8}
                    x1={gx + 82}
                    shine={shine}
                    showName={false}
                    showVal={false}
                    showFlag={false}
                  />
                  <Label x={gx + 8} y={gy + 42} fill={bad ? 'var(--zone-low)' : 'var(--text-faint)'} anchor="start">
                    {readoutOf(m)}
                  </Label>
                </g>
              );
            })}
          </>
        ) : variant === 'range-history' && m0 ? (
          /* ---- BR-05 · one marker's journey into the band ---- */
          (() => {
            const x0 = 40;
            const x1 = 296;
            const yOf = (f: number) => PAD.t + (1 - f) * PLOT_H;
            const yLo = yOf(fracOf(m0, m0.low));
            const yHi = yOf(fracOf(m0, m0.high));
            const hist = m0.history?.length ? m0.history : [m0.value];
            const pp = hist.map((v, i) => ({
              x: hist.length <= 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (hist.length - 1),
              y: yOf(fracOf(m0, v)),
              inRange: v >= m0.low && v <= m0.high,
            }));
            const d = pp.map((q, i) => `${i ? 'L' : 'M'}${rd(q.x)} ${rd(q.y)}`).join('');
            return (
              <>
                {[0.25, 0.5, 0.75].map((f) => (
                  <line
                    key={f}
                    x1={PAD.l}
                    x2={W - PAD.r}
                    y1={rd(PAD.t + PLOT_H * f)}
                    y2={rd(PAD.t + PLOT_H * f)}
                    stroke="var(--glass)"
                    strokeWidth={1}
                  />
                ))}
                <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="var(--border)" strokeWidth={1} />
                <rect x={x0 - 6} y={rd(yHi)} width={x1 - x0 + 12} height={rd(yLo - yHi)} fill="var(--mint)" opacity={0.09} />
                <Label x={x1 + 2} y={yHi + 4} fill="var(--text-faint)" anchor="start">
                  {String(m0.high)}
                </Label>
                <Label x={x1 + 2} y={yLo + 4} fill="var(--text-faint)" anchor="start">
                  {String(m0.low)}
                </Label>
                <path d={d} fill="none" stroke="var(--mint)" strokeWidth={1.8} />
                {pp.map((q, i) => {
                  const col = q.inRange ? 'var(--mint)' : 'var(--zone-low)';
                  return (
                    <g key={i}>
                      <circle
                        className={cn('lk-bmr-dot', shine && 'lk-bmr-dot--shine')}
                        cx={rd(q.x)}
                        cy={rd(q.y)}
                        r={3.6}
                        fill={col}
                        stroke="var(--bg-0)"
                        strokeOpacity={0.85}
                        strokeWidth={1.2}
                        style={{ color: col } as CSSProperties}
                      />
                      {m0.dates?.[i] ? (
                        <Label x={q.x} y={H - 3} fill="var(--text-faint)">
                          {m0.dates[i]}
                        </Label>
                      ) : null}
                    </g>
                  );
                })}
                {flag && pp.length > 0 ? (
                  <Tag x={pp[0].x + 24} y={pp[0].y + 16} color="var(--zone-low)">
                    {flag}
                  </Tag>
                ) : null}
                {note ? (
                  <Tag x={W - PAD.r - 6} y={26} color="var(--mint)" anchor="end">
                    {note}
                  </Tag>
                ) : null}
              </>
            );
          })()
        ) : null}
      </svg>
    </div>
  );
}
