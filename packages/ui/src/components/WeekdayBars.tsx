import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** One bar in the weekday chart. */
export interface WeekdayBar {
  /** short day label, e.g. "Mon" */
  day: string;
  /** the value shown above the bar, e.g. 71 */
  value: number;
  /** bar height as a 0–100 percentage of the chart height */
  h: number;
  /** highlight as the best (mint) day */
  best?: boolean;
  /** highlight as the worst (rose) day */
  worst?: boolean;
}

/** A chip shown under the bars. */
export interface WeekdayChip {
  label: string;
  tone?: ChipTone;
  dot?: boolean;
}

export interface WeekdayBarsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** display title, e.g. "Energy by weekday" */
  title?: ReactNode;
  /** mono sub-eyebrow under the title, e.g. "8-week avg" */
  sub?: ReactNode;
  /** the 7 weekday bars, Mon → Sun */
  days?: WeekdayBar[];
  /** best/worst callout copy (rich node, may include <strong>/<em>) */
  callout?: ReactNode;
  /** chips between the bars and the callout */
  chips?: WeekdayChip[];
  /** accessible description of the chart */
  ariaLabel?: string;
}

/** Faithful reproduction of the design's "Energy by weekday" example. */
const DEFAULT_DAYS: WeekdayBar[] = [
  { day: 'Mon', value: 71, h: 78 },
  { day: 'Tue', value: 76, h: 88 },
  { day: 'Wed', value: 79, h: 94, best: true },
  { day: 'Thu', value: 74, h: 84 },
  { day: 'Fri', value: 68, h: 72 },
  { day: 'Sat', value: 61, h: 58, worst: true },
  { day: 'Sun', value: 70, h: 76 },
];

const DEFAULT_CHIPS: WeekdayChip[] = [
  { label: 'best · Wed 79', tone: 'high', dot: true },
  { label: 'worst · Sat 61', tone: 'low', dot: true },
];

const DEFAULT_ARIA =
  'Avg energy by weekday: Mon 71, Tue 76, Wed 79 best, Thu 74, Fri 68, Sat 61 worst, Sun 70.';

/**
 * Weekday bars — a 7-bar chart of average energy per weekday (Mon–Sun) with the
 * best day highlighted in mint and the worst in rose, value labels above and day
 * labels below, plus a best/worst callout and chips. Bars grow via the inline
 * `--h` custom property and render at full height immediately (always-on, no JS
 * toggle). Defaults reproduce the design example.
 */
export function WeekdayBars({
  title = 'Energy by weekday',
  sub = '8-week avg',
  days = DEFAULT_DAYS,
  callout = (
    <>
      You peak on <strong>Wednesdays</strong>, dip on <em>Saturdays</em>.
    </>
  ),
  chips = DEFAULT_CHIPS,
  ariaLabel = DEFAULT_ARIA,
  className,
  ...rest
}: WeekdayBarsProps) {
  return (
    <div className={cn('lk-wk', 'lk-card', className)} {...rest}>
      {/* header: title + mono sub */}
      <div className="lk-wk-head">
        <h3 className="lk-display">{title}</h3>
        <span className="lk-wk-sub lk-mono">{sub}</span>
      </div>

      {/* bars */}
      <div className="lk-wk-bars" role="img" aria-label={ariaLabel}>
        {days.map((d, i) => (
          <div
            key={i}
            className={cn('lk-wk-bar', 'lk-wk-on', d.best && 'lk-wk-best', d.worst && 'lk-wk-worst')}
            style={{ '--h': d.h } as CSSProperties}
          >
            <div className="lk-wk-col" />
            <span className="lk-wk-val lk-mono lk-tnum">{d.value}</span>
            <span className="lk-wk-day">{d.day}</span>
          </div>
        ))}
      </div>

      {/* chips */}
      {chips.length > 0 && (
        <div className="lk-wk-chips">
          {chips.map((c, i) => (
            <Chip key={i} tone={c.tone} dot={c.dot}>
              {c.label}
            </Chip>
          ))}
        </div>
      )}

      {/* best/worst callout */}
      {callout && <div className="lk-wk-callout">{callout}</div>}
    </div>
  );
}
