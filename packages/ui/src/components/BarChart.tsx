import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** One bar in the chart. */
export interface BarItem {
  /** the bar's value — its height is `value / max` of the chart area */
  value: number;
  /** label shown below the bar (mono, uppercase, faint) */
  label?: string;
  /** override fill — a token var() or any CSS background; defaults to `gradient` */
  color?: string;
  /** highlight this bar (brighter mint gradient + glow) */
  highlight?: boolean;
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  /** the bars, drawn left → right */
  bars?: BarItem[];
  /** the value that maps to full chart height (100%); defaults to the max bar value */
  max?: number;
  /** chart area height in px */
  height?: number;
  /** show the value above each bar */
  showValues?: boolean;
  /** default bar fill when an item has no `color` */
  gradient?: string;
}

/** Faithful reproduction of the design's weekday-style bars. */
const DEFAULT_BARS: BarItem[] = [
  { value: 71, label: 'M' },
  { value: 76, label: 'T' },
  { value: 79, label: 'W', highlight: true },
  { value: 74, label: 'T' },
  { value: 68, label: 'F' },
  { value: 61, label: 'S', color: 'var(--zone-mid)' },
  { value: 70, label: 'S' },
];

const DEFAULT_GRADIENT = 'linear-gradient(180deg, var(--cyan), var(--accent))';

/** brighter mint gradient used for highlighted bars (when they have no `color`) */
const HIGHLIGHT_GRADIENT = 'var(--grad-mint)';

/**
 * Generic vertical bar chart — a flex row of columns, each a gradient-filled bar
 * sized by `value / max` of the chart area, with an optional value label above
 * and a mono/uppercase label below. Highlighted bars get a brighter mint
 * gradient + glow. Per-bar `color` overrides the shared `gradient`. Tokens-driven,
 * no Tailwind. Defaults reproduce the weekday example.
 */
export function BarChart({
  bars = DEFAULT_BARS,
  max,
  height = 150,
  showValues = true,
  gradient = DEFAULT_GRADIENT,
  className,
  style,
  ...rest
}: BarChartProps) {
  const ref = max ?? Math.max(0, ...bars.map((b) => b.value));
  const denom = ref > 0 ? ref : 1;

  return (
    <div
      className={cn('lk-bc', className)}
      style={{ ['--bc-h']: `${height}px`, ...style } as CSSProperties}
      {...rest}
    >
      {bars.map((b, i) => {
        const pct = Math.max(0, Math.min(1, b.value / denom));
        const fill = b.color ?? (b.highlight ? HIGHLIGHT_GRADIENT : gradient);
        return (
          <div key={i} className={cn('lk-bc-col', b.highlight && 'lk-bc-hl')}>
            {showValues && (
              <span className="lk-bc-val lk-mono lk-tnum">{b.value}</span>
            )}
            <div
              className="lk-bc-bar"
              style={
                {
                  '--bc-pct': pct,
                  background: fill,
                } as CSSProperties
              }
            />
            {b.label != null && <span className="lk-bc-label lk-mono">{b.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
