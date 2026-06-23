import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** One time block on the day rail. */
export interface DayBlock {
  /** block start, in hours on the [startHour, endHour] rail (e.g. 9, 12.5) */
  start: number;
  /** block end, in hours on the [startHour, endHour] rail */
  end: number;
  /** optional label shown inside the block if it fits */
  label?: string;
  /** fill color (any CSS color / token var); defaults to the accent */
  color?: string;
}

export interface DayTimelineBlocksProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** the colored time blocks laid across the rail */
  blocks?: DayBlock[];
  /** current hour → a bright vertical "now" marker line + dot; omit to hide */
  now?: number;
  /** rail start hour (default 0) */
  startHour?: number;
  /** rail end hour (default 24) */
  endHour?: number;
  /** rail height in px (default 44) */
  height?: number;
  /** faint hour gridlines + mono labels (every 6h labeled); default true */
  hourTicks?: boolean;
}

/** default block fill when a block has no `color` */
const DEFAULT_COLOR = 'var(--accent)';

/** A sample work-day so `<DayTimelineBlocks />` renders something on its own. */
const DEFAULT_BLOCKS: DayBlock[] = [
  { start: 7.75, end: 8.6, label: 'Commute', color: 'var(--indigo)' },
  { start: 9, end: 10.5, label: 'Deep work', color: 'var(--mint)' },
  { start: 10.5, end: 12, label: 'Meetings', color: 'var(--violet)' },
  { start: 12, end: 12.75, label: 'Break', color: 'var(--warn)' },
  { start: 13.25, end: 15, label: 'Deep work', color: 'var(--mint)' },
];

/** Clamp x into [lo, hi]. */
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Format an hour (0..24) as a short clock label, e.g. 0→12am, 13→1pm, 18→6pm. */
function hourLabel(h: number): string {
  const hh = ((Math.round(h) % 24) + 24) % 24;
  if (hh === 0) return '12am';
  if (hh === 12) return '12pm';
  return hh < 12 ? `${hh}am` : `${hh - 12}pm`;
}

/** The hour tick stops: every 6h across the span, always including the end. */
function tickHours(startHour: number, endHour: number): number[] {
  const out: number[] = [];
  for (let h = Math.ceil(startHour / 6) * 6; h < endHour; h += 6) out.push(h);
  if (out[0] !== startHour) out.unshift(startHour);
  if (out[out.length - 1] !== endHour) out.push(endHour);
  return out;
}

/**
 * DayTimelineBlocks — a horizontal 24-hour activity rail.
 *
 * A glass track spanning `startHour..endHour` carrying absolutely-positioned
 * rounded color blocks (each placed by its start/end hour as left% + width% of
 * the rail span), optional faint hour gridlines with mono clock labels (every
 * 6h), and an optional bright "now" marker line + dot. Ports the design's
 * .tl-track / .tl-block / .tl-now / .tl-axis day-timeline visual. Tokens-driven,
 * no Tailwind; positions are pure inline percentages (no client JS).
 *
 * Per-instance vars: --tl-h (rail height).
 */
export function DayTimelineBlocks({
  blocks = DEFAULT_BLOCKS,
  now,
  startHour = 0,
  endHour = 24,
  height = 44,
  hourTicks = true,
  className,
  style,
  ...rest
}: DayTimelineBlocksProps) {
  const span = endHour - startHour || 1;
  const pct = (h: number) => (clamp(h, startHour, endHour) - startHour) / span;

  const ticks = hourTicks ? tickHours(startHour, endHour) : [];
  const nowFrac = now != null ? pct(now) : null;

  return (
    <div
      className={cn('lk-daytl', className)}
      role="img"
      aria-label={`Activity timeline from ${hourLabel(startHour)} to ${hourLabel(
        endHour,
      )}, ${blocks.length} block${blocks.length === 1 ? '' : 's'}`}
      style={{ ['--tl-h']: `${height}px`, ...style } as CSSProperties}
      {...rest}
    >
      <div className="lk-daytl-track">
        {/* faint hour gridlines */}
        {ticks.map((h) =>
          h > startHour && h < endHour ? (
            <i
              key={`g${h}`}
              className="lk-daytl-grid"
              aria-hidden="true"
              style={{ left: `${pct(h) * 100}%` }}
            />
          ) : null,
        )}

        {/* the colored time blocks */}
        {blocks.map((b, i) => {
          const left = pct(b.start);
          const width = Math.max(0, pct(b.end) - left);
          if (width <= 0) return null;
          return (
            <div
              key={i}
              className="lk-daytl-block"
              title={b.label}
              style={
                {
                  left: `${left * 100}%`,
                  width: `${width * 100}%`,
                  background: b.color ?? DEFAULT_COLOR,
                } as CSSProperties
              }
            >
              {b.label != null && (
                <span className="lk-daytl-block-label">{b.label}</span>
              )}
            </div>
          );
        })}

        {/* the "now" marker line + dot */}
        {nowFrac != null && (
          <span
            className="lk-daytl-now"
            aria-hidden="true"
            style={{ left: `${nowFrac * 100}%` }}
          />
        )}
      </div>

      {/* hour axis labels (every 6h) under the rail */}
      {hourTicks && (
        <div className="lk-daytl-axis">
          {ticks.map((h) => (
            <span
              key={`a${h}`}
              className="lk-daytl-tick lk-mono"
              style={{ left: `${pct(h) * 100}%` }}
            >
              {hourLabel(h)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
