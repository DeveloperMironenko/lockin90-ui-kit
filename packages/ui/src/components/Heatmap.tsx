import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** One cell in the heatmap. */
export interface HeatmapCell {
  /** the cell's intensity — color scales with `value / max` (0..1 after normalization) */
  value: number;
  /** optional label (e.g. a day-of-month number) shown inside the cell, and used for a11y */
  label?: string;
  /** mark this cell — draws a low-zone ring + dot (e.g. a flagged low-energy day) */
  flag?: boolean;
  /** mark this cell as "today"/"now" — draws an accent (or `todayColor`) ring */
  today?: boolean;
  /** missing-data slot — renders as a dashed empty cell, never a fake zero (HM-08) */
  missing?: boolean;
  /** explicit in-cell text when `showValues` is on (overrides the computed value) */
  display?: string;
}

export interface HeatmapProps extends HTMLAttributes<HTMLDivElement> {
  /** the cells, laid out left → right, top → bottom */
  cells?: HeatmapCell[];
  /** number of columns; 7 reads as a calendar week, ~30 as a wrapping contribution strip */
  columns?: number;
  /** cell edge length in px (square cells in `grid`, fixed-height in `strip`) */
  cellSize?: number;
  /** gap between cells in px */
  gap?: number;
  /** cell corner radius in px */
  radius?: number;
  /** low-intensity end of the color ramp (hex) — legacy ramp, ignored when `scale` is set */
  colorFrom?: string;
  /** high-intensity end of the color ramp (hex) — legacy ramp, ignored when `scale` is set */
  colorTo?: string;
  /** override the ramp entirely: map a normalized value (0..1) → any CSS color */
  colorScale?: (value: number) => string;
  /** `grid` = square calendar cells; `strip` = a denser contribution strip */
  variant?: 'grid' | 'strip';
  /** the value that maps to full intensity (1.0); values normalize as `value / max` */
  max?: number;
  /** Catalog color scale — token color + value-driven opacity (HM-01 SELECT):
   *  - `'zone'` — zone verdict tokens (≥0.62 high · ≥0.38 mid · low)
   *  - `'spectrum'` — indigo → violet → cyan → mint by quartile (HM-09)
   *  - `'diverge'` — above 0.5 mint / below coral, opacity = |Δ| (HM-11/12)
   *  - any color string — single hue, opacity = value (e.g. `'var(--mint)'`, HM-03)
   *  When set, the legacy `colorFrom/To` ramp is ignored. */
  scale?: 'zone' | 'spectrum' | 'diverge' | (string & {});
  /** row captions at the left, one per row (e.g. MON…SUN) */
  rowLabels?: string[];
  /** column captions above the grid at specific column indices (HM-09 hour marks) */
  colLabels?: { at: number; label: string }[];
  /** weekday letters under the columns — `true` = 'MTWTFSS', or a custom string */
  dayLetters?: boolean | string;
  /** HM-06 dot-matrix — circles sized AND opacified by value (double encoding) */
  dots?: boolean;
  /** HM-07 glass-grid — glass cells; the border's color opacity carries the value */
  glass?: boolean;
  /** HM-13 focus-row — this row index at full strength, others dimmed to 22% */
  focusRow?: number;
  /** in-cell mono values (HM-11/14): `'pct'` → `round(t·100)`; `true` → diverging
   *  scales show a signed `(t−0.5)·2` coefficient, others `t` to 1 decimal;
   *  per-cell `display` overrides */
  showValues?: boolean | 'pct';
  /** glow underlay on hot cells (t > 0.78) — soft box-shadow in the cell color */
  shine?: boolean;
  /** the `today` ring color (default `var(--accent)`; HM-15 uses `var(--text)`) */
  todayColor?: string;
  /** HM-15 today-ring — adds a pulsing dot above the `today` cell (reduced-motion safe) */
  todayPulse?: boolean;
  /** in-cell label placement: `center` (legacy) or `corner` (HM-04 month-cal numerals) */
  labelPosition?: 'center' | 'corner';
}

/** low-intensity ramp end — dark violet, clearly visible and distinct from the bg */
const DEFAULT_FROM = '#2B1F5C';
/** high-intensity ramp end — mint (the brand "high" zone) */
const DEFAULT_TO = '#34F5C5';

/** A small calendar-week sample covering the full intensity range so the scale reads. */
const DEFAULT_CELLS: HeatmapCell[] = [
  { value: 0.15, label: '1' },
  { value: 0.3, label: '2' },
  { value: 0.85, label: '3' },
  { value: 0.55, label: '4' },
  { value: 0.08, label: '5', flag: true },
  { value: 0.72, label: '6' },
  { value: 0.92, label: '7' },
  { value: 0.38, label: '8' },
  { value: 0.61, label: '9' },
  { value: 0.78, label: '10' },
  { value: 0.95, label: '11', today: true },
];

/** Clamp to [0, 1]. */
function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Parse `#rgb` / `#rrggbb` into an [r, g, b] triplet (0..255). */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h[0]! + h[0]! + h[1]! + h[1]! + h[2]! + h[2]!;
  const int = parseInt(h, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** Linearly interpolate between two hex colors by `t` (0..1) → an `rgb(...)` string. */
export function lerpColor(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const k = clamp01(t);
  const r = Math.round(a[0] + (b[0] - a[0]) * k);
  const g = Math.round(a[1] + (b[1] - a[1]) * k);
  const bl = Math.round(a[2] + (b[2] - a[2]) * k);
  return `rgb(${r}, ${g}, ${bl})`;
}

/** A token color at a value-driven opacity (CSS `color-mix` keeps it tokens-only). */
function mix(color: string, op: number): string {
  return `color-mix(in srgb, ${color} ${Math.round(clamp01(op) * 100)}%, transparent)`;
}

/** The catalog `heatFill` scales: color token + opacity per normalized value. */
function heatFill(scale: string, t: number): { color: string; op: number } {
  if (scale === 'zone') {
    const color = t >= 0.62 ? 'var(--zone-high)' : t >= 0.38 ? 'var(--zone-mid)' : 'var(--zone-low)';
    return { color, op: 0.25 + t * 0.75 };
  }
  if (scale === 'spectrum') {
    const color =
      t < 0.25 ? 'var(--indigo)' : t < 0.5 ? 'var(--violet)' : t < 0.75 ? 'var(--cyan)' : 'var(--mint)';
    return { color, op: 0.35 + t * 0.65 };
  }
  if (scale === 'diverge') {
    const d = t - 0.5;
    return { color: d >= 0 ? 'var(--mint)' : 'var(--zone-low)', op: Math.min(1, 0.1 + Math.abs(d) * 1.7) };
  }
  return { color: scale, op: 0.08 + t * 0.92 }; /* single hue */
}

/**
 * Heatmap — a compact grid/strip of small intensity-colored cells. One primitive
 * covers the calendar-month grid, the contribution strip, and the catalog
 * heatmap family (HM-01…HM-15): token `scale`s (zone / spectrum / diverge /
 * single-hue), row/column captions + day letters, dot-matrix and glass cells,
 * gap-aware missing slots, a focus row, in-cell mono values, and the
 * today-ring + pulse. Legacy behavior (colorFrom→colorTo ramp) is unchanged
 * when `scale` is not set. Tokens-driven, no Tailwind.
 */
export function Heatmap({
  cells = DEFAULT_CELLS,
  columns = 7,
  cellSize = 28,
  gap = 4,
  radius,
  colorFrom = DEFAULT_FROM,
  colorTo = DEFAULT_TO,
  colorScale,
  variant = 'grid',
  max = 1,
  scale,
  rowLabels,
  colLabels,
  dayLetters,
  dots = false,
  glass = false,
  focusRow,
  showValues,
  shine = false,
  todayColor,
  todayPulse = false,
  labelPosition = 'center',
  className,
  style,
  ...rest
}: HeatmapProps) {
  const denom = max > 0 ? max : 1;
  const r = radius ?? (variant === 'strip' ? 4 : undefined);
  const rows = Math.max(1, Math.ceil(cells.length / columns));
  const letters = dayLetters === true ? 'MTWTFSS' : dayLetters || '';
  const hasFrame = Boolean(rowLabels?.length || colLabels?.length || letters);

  const rootVars = {
    '--hm-cols': columns,
    '--hm-size': `${cellSize}px`,
    '--hm-gap': `${gap}px`,
    ...(r != null ? { '--hm-radius': `${r}px` } : {}),
    ...(todayColor ? { '--lk-hm-today': todayColor } : {}),
    ...style,
  } as CSSProperties;

  const cellNodes = cells.map((c, i) => {
        const t = clamp01(c.value / denom);
        const row = Math.floor(i / columns);

    if (c.missing) {
      return <div key={i} className="lk-heatmap-cell lk-heatmap-cell--missing" title={c.label} />;
    }

        // resolve the fill: catalog scale (token + opacity) or legacy ramp
        let color: string;
        let op = 1;
        if (scale != null) {
          const hf = heatFill(scale, t);
          color = hf.color;
          op = hf.op;
        } else {
          color = colorScale ? colorScale(t) : lerpColor(colorFrom, colorTo, t);
        }
        if (focusRow != null) op = row === focusRow ? op : op * 0.22;
        const fill = scale != null ? mix(color, op) : focusRow != null && row !== focusRow ? mix(color, op) : color;

        const cellStyle: CSSProperties = dots
          ? {}
          : glass
            ? { background: 'var(--glass)', borderColor: mix(color, 0.25 + t * 0.75) }
            : { background: fill };
        if (shine && t > 0.78 && !dots && !glass) {
          cellStyle.boxShadow = `0 0 8px ${mix(color, op * 0.6)}`;
        }

        // in-cell text: computed value (HM-11/14) or the day label
        const valueText = showValues
          ? (c.display ??
            (scale === 'diverge'
              ? `${t >= 0.5 ? '+' : '−'}${Math.abs((t - 0.5) * 2).toFixed(1)}`
              : showValues === 'pct'
                ? String(Math.round(t * 100))
                : String(Math.round(t * 10) / 10)))
          : undefined;
        const text = variant === 'grid' && !dots ? (valueText ?? c.label) : undefined;
        const darkText = scale != null && t > 0.55;

        return (
          <div
            key={i}
            className={cn(
              'lk-heatmap-cell',
              dots && 'lk-heatmap-cell--dot',
              c.flag && 'lk-heatmap-cell--flag',
              c.today && 'lk-heatmap-cell--today',
            )}
            style={cellStyle}
            title={c.label}
          >
            {dots && (
              <span
                className="lk-heatmap-dot"
                style={{
                  width: cellSize * (0.35 + t * 0.65),
                  height: cellSize * (0.35 + t * 0.65),
                  background: scale != null ? mix(color, op) : color,
                }}
                aria-hidden="true"
              />
            )}
            {c.flag && <span className="lk-heatmap-flag" aria-hidden="true" />}
            {c.today && todayPulse && <span className="lk-heatmap-pulse" aria-hidden="true" />}
            {text != null && (
              <span
                className={cn(
                  'lk-heatmap-label lk-mono',
                  labelPosition === 'corner' && 'lk-heatmap-label--corner',
                  darkText && 'lk-heatmap-label--dark',
                )}
              >
                {text}
              </span>
            )}
          </div>
        );
  });

  if (!hasFrame) {
    return (
      <div
        className={cn('lk-heatmap', `lk-heatmap--${variant}`, className)}
        style={rootVars}
        role="img"
        {...rest}
      >
        {cellNodes}
      </div>
    );
  }

  return (
    <div className={cn('lk-heatmap-frame', className)} style={rootVars} role="img" {...rest}>
      {colLabels?.length ? (
        <div className="lk-heatmap-collabels" aria-hidden="true">
          {colLabels.map((cl, i) => (
            <span key={i} style={{ left: cl.at * (cellSize + gap) + cellSize / 2 }}>
              {cl.label}
            </span>
          ))}
        </div>
      ) : null}
      {rowLabels?.length ? (
        <div className="lk-heatmap-rowlabels" aria-hidden="true">
          {rowLabels.slice(0, rows).map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      ) : null}
      <div className={cn('lk-heatmap', `lk-heatmap--${variant}`)}>{cellNodes}</div>
      {letters ? (
        <div className="lk-heatmap-letters" aria-hidden="true">
          {Array.from(letters.slice(0, columns)).map((ch, i) => (
            <span key={i} style={{ left: i * (cellSize + gap) + cellSize / 2 }}>
              {ch}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
