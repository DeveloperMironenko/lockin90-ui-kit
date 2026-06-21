import { type HTMLAttributes, type CSSProperties } from 'react';
import { cn } from '../cn';

export type CalendarZone = 'high' | 'mid' | 'low';

export interface CalendarDay {
  /** day-of-month number, e.g. 1..31 */
  day: number;
  /** the day's score, shown in the cell, e.g. 0..100 */
  value: number;
  /** intensity of the tint wash, 0..1 (radial glow opacity) */
  level: number;
  /** energy zone — tints the wash + (low) flag. Defaults derived from value. */
  zone?: CalendarZone;
  /** mark as the current day (accent ring) */
  today?: boolean;
  /** force the low-day flag dot (defaults to true when zone is "low") */
  flagged?: boolean;
}

export interface CalendarHeatmapProps extends HTMLAttributes<HTMLDivElement> {
  /** big display title, e.g. "June 2026" */
  title?: string;
  /** mono month label between the nav arrows, e.g. "Jun 2026" */
  monthLabel?: string;
  /** day cells in calendar order */
  days?: CalendarDay[];
  /** blank cells before day 1 (0..6 — weekday offset, Mon-first) */
  leadingBlanks?: number;
  /** blank cells after the last day (pads the final week) */
  trailingBlanks?: number;
  /** weekday header labels (Mon-first) */
  weekdays?: string[];
  /** show the High/Moderate/Low/Flagged legend */
  legend?: boolean;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

const ZONE_CLASS: Record<CalendarZone, string> = { high: 'lk-cal-hi', mid: 'lk-cal-mid', low: 'lk-cal-lo' };

/** Faithful reproduction of the design's June 2026 example. */
const DEFAULT_DAYS: CalendarDay[] = [
  { day: 1, value: 63, level: 0.4, zone: 'mid' },
  { day: 2, value: 77, level: 0.66, zone: 'high' },
  { day: 3, value: 91, level: 0.95, zone: 'high' },
  { day: 4, value: 71, level: 0.58, zone: 'high' },
  { day: 5, value: 41, level: 0.85, zone: 'low' },
  { day: 6, value: 66, level: 0.46, zone: 'mid' },
  { day: 7, value: 79, level: 0.7, zone: 'high' },
  { day: 8, value: 83, level: 0.78, zone: 'high' },
  { day: 9, value: 70, level: 0.56, zone: 'high' },
  { day: 10, value: 75, level: 0.62, zone: 'high' },
  { day: 11, value: 78, level: 0.68, zone: 'high', today: true },
  { day: 12, value: 60, level: 0.34, zone: 'mid' },
  { day: 13, value: 47, level: 0.78, zone: 'low' },
  { day: 14, value: 65, level: 0.44, zone: 'mid' },
  { day: 15, value: 76, level: 0.64, zone: 'high' },
  { day: 16, value: 80, level: 0.72, zone: 'high' },
  { day: 17, value: 87, level: 0.88, zone: 'high' },
  { day: 18, value: 73, level: 0.6, zone: 'high' },
  { day: 19, value: 62, level: 0.38, zone: 'mid' },
  { day: 20, value: 67, level: 0.48, zone: 'mid' },
  { day: 21, value: 85, level: 0.82, zone: 'high' },
  { day: 22, value: 38, level: 0.9, zone: 'low' },
  { day: 23, value: 64, level: 0.42, zone: 'mid' },
  { day: 24, value: 77, level: 0.66, zone: 'high' },
  { day: 25, value: 81, level: 0.74, zone: 'high' },
  { day: 26, value: 89, level: 0.92, zone: 'high' },
  { day: 27, value: 61, level: 0.36, zone: 'mid' },
  { day: 28, value: 69, level: 0.54, zone: 'high' },
  { day: 29, value: 82, level: 0.78, zone: 'high' },
  { day: 30, value: 68, level: 0.5, zone: 'mid' },
];

const DEFAULT_WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const CHEVRON_LEFT = 'M15 6l-6 6 6 6';
const CHEVRON_RIGHT = 'M9 6l6 6-6 6';

/** derive a zone from the score when not given explicitly */
function zoneOf(d: CalendarDay): CalendarZone {
  if (d.zone) return d.zone;
  if (d.value < 50) return 'low';
  if (d.value < 70) return 'mid';
  return 'high';
}

/** Calendar heatmap — a month grid where each day is a mini cell tinted by its
 *  energy score, with low-day flags, a today cell, weekday header and legend. */
export function CalendarHeatmap({
  title = 'June 2026',
  monthLabel = 'Jun 2026',
  days = DEFAULT_DAYS,
  leadingBlanks = 6,
  trailingBlanks = 5,
  weekdays = DEFAULT_WEEKDAYS,
  legend = true,
  onPrevMonth,
  onNextMonth,
  className,
  ...rest
}: CalendarHeatmapProps) {
  return (
    <div className={cn('lk-cal', 'lk-card', className)} {...rest}>
      <div className="lk-cal-top">
        <h3 className="lk-display">{title}</h3>
        <div className="lk-cal-nav">
          <button type="button" aria-label="Previous month" onClick={onPrevMonth}>
            <svg viewBox="0 0 24 24">
              <path d={CHEVRON_LEFT} />
            </svg>
          </button>
          <span className="lk-cal-mlabel lk-mono">{monthLabel}</span>
          <button type="button" aria-label="Next month" onClick={onNextMonth}>
            <svg viewBox="0 0 24 24">
              <path d={CHEVRON_RIGHT} />
            </svg>
          </button>
        </div>
      </div>

      <div className="lk-cal-dow" aria-hidden="true">
        {weekdays.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <div className="lk-cal-grid" role="grid" aria-label={`${title} daily energy scores`}>
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`lead-${i}`} className="lk-cal-cell lk-cal-empty" aria-hidden="true" />
        ))}
        {days.map((d) => {
          const zone = zoneOf(d);
          const flagged = d.flagged ?? zone === 'low';
          return (
            <div
              key={d.day}
              className={cn('lk-cal-cell', ZONE_CLASS[zone], d.today && 'lk-cal-today')}
              style={{ '--lvl': d.level } as CSSProperties}
              {...(d.today ? { 'aria-current': 'date' as const } : {})}
            >
              {flagged && <span className="lk-cal-flag" aria-hidden="true" />}
              <span className="lk-cal-num lk-tnum">{d.day}</span>
              <span className="lk-cal-val lk-tnum">{d.value}</span>
            </div>
          );
        })}
        {Array.from({ length: trailingBlanks }).map((_, i) => (
          <div key={`trail-${i}`} className="lk-cal-cell lk-cal-empty" aria-hidden="true" />
        ))}
      </div>

      {legend && (
        <div className="lk-cal-legend">
          <span>
            <i className="lk-cal-lg-hi" /> High
          </span>
          <span>
            <i className="lk-cal-lg-mid" /> Moderate
          </span>
          <span>
            <i className="lk-cal-lg-lo" /> Low
          </span>
          <span>
            <i className="lk-cal-lg-flag" /> Flagged day
          </span>
        </div>
      )}
    </div>
  );
}

export type { CalendarDay as CalendarHeatmapDay };
