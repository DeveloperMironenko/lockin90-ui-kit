import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** A single category block on the 24h rail, positioned by percent of the day. */
export interface DayBlock {
  /** left edge as a percent of the 24h rail (0–100) */
  left: number;
  /** width as a percent of the 24h rail (0–100) */
  width: number;
  /** fill color — a token reference like 'var(--violet)' or any CSS color */
  color: string;
  /** hover tooltip text, e.g. "Sleep · 11:00pm–6:30am · 7h 30m" (web-only) */
  tip?: string;
  /** accessible label for the block */
  label?: string;
}

/** A legend swatch + label pairing a color to a category name. */
export interface DayLegendItem {
  color: string;
  label: string;
}

export interface DayTimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** card heading, e.g. "Today · 24h" */
  title?: string;
  /** mono chip on the right of the head, e.g. "14h 12m tracked" */
  trackedLabel?: string;
  /** the colored category blocks across the day */
  blocks?: DayBlock[];
  /** position of the live "now" marker as a percent of the day (0–100); null to hide */
  now?: number | null;
  /** label rendered above the now marker (default "now") */
  nowLabel?: string;
  /** hour-tick labels under the rail */
  axis?: string[];
  /** category legend swatches */
  legend?: DayLegendItem[];
  /** screen-reader description of the whole rail */
  trackLabel?: string;
}

/** Faithful reproduction of the design's example day. */
const DEFAULT_BLOCKS: DayBlock[] = [
  { left: 0, width: 27.1, color: 'var(--violet)', tip: 'Sleep · 11:00pm–6:30am · 7h 30m' },
  { left: 27.1, width: 3.1, color: 'var(--lime)', tip: 'Morning routine · 6:30–7:15 · 45m' },
  { left: 37.5, width: 12.5, color: 'var(--cyan)', tip: 'Deep work · 9:00am–12:00pm · 3h' },
  { left: 50, width: 3.1, color: 'var(--warn)', tip: 'Lunch · 12:00–12:45 · 45m' },
  { left: 70.8, width: 4.2, color: 'var(--magenta)', tip: 'Training · 5:00–6:00pm · 1h' },
  { left: 89.6, width: 4.2, color: 'var(--mint)', tip: 'Wind-down · 9:30–10:30pm · 1h' },
];

const DEFAULT_AXIS = ['12a', '6a', '12p', '6p', '12a'];

const DEFAULT_LEGEND: DayLegendItem[] = [
  { color: 'var(--violet)', label: 'Sleep' },
  { color: 'var(--lime)', label: 'Routine' },
  { color: 'var(--cyan)', label: 'Deep work' },
  { color: 'var(--magenta)', label: 'Training' },
  { color: 'var(--mint)', label: 'Wind-down' },
  { color: 'var(--warn)', label: 'Meal / break' },
];

const DEFAULT_TRACK_LABEL =
  '24-hour timeline: sleep 11pm–6:30am, deep work 9am–12pm, training 5–6pm, now at 3pm.';

/** 24h day timeline — a horizontal 24-hour rail with time-positioned, colored
 *  category blocks (sleep, work, training, meals…), hour ticks, a live "now"
 *  marker, hover tooltips, and a category legend. */
export function DayTimeline({
  title = 'Today · 24h',
  trackedLabel = '14h 12m tracked',
  blocks = DEFAULT_BLOCKS,
  now = 62.5,
  nowLabel = 'now',
  axis = DEFAULT_AXIS,
  legend = DEFAULT_LEGEND,
  trackLabel = DEFAULT_TRACK_LABEL,
  className,
  ...rest
}: DayTimelineProps) {
  return (
    <div className={cn('lk-tt lk-card', className)} {...rest}>
      <div className="lk-tt-head">
        <span className="lk-tt-title">{title}</span>
        {trackedLabel && (
          <Chip className="lk-mono">{trackedLabel}</Chip>
        )}
      </div>

      <div className="lk-tt-track" role="img" aria-label={trackLabel}>
        {blocks.map((b, i) => (
          <div
            key={i}
            className="lk-tt-block"
            style={{ left: `${b.left}%`, width: `${b.width}%`, background: b.color }}
            aria-label={b.label ?? b.tip}
          >
            {b.tip && <span className="lk-tt-tip">{b.tip}</span>}
          </div>
        ))}

        {now != null && (
          <div className="lk-tt-now" style={{ left: `${now}%` }}>
            <span className="lk-tt-now-lbl">{nowLabel}</span>
          </div>
        )}
      </div>

      {axis.length > 0 && (
        <div className="lk-tt-axis">
          {axis.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      )}

      {legend.length > 0 && (
        <div className="lk-tt-legend">
          {legend.map((l, i) => (
            <span key={i}>
              <i style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export type {
  DayBlock as DayTimelineBlock,
  DayLegendItem as DayTimelineLegendItem,
};
