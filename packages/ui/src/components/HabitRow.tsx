import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

export interface HabitRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Habit name. */
  name?: string;
  /** Schedule / cadence line under the name (e.g. "By 9:00pm · daily"). */
  when?: string;
  /** Current streak length, shown next to the flame. */
  streak?: number;
  /** Last 7 days: true = done, false = missed/skipped. Oldest → newest. */
  days?: boolean[];
  /** 30-day compliance, as a percentage 0–100. */
  compliancePct?: number;
  /** Chip tone for the compliance pill. Defaults to auto from compliancePct. */
  tone?: ChipTone;
}

/** Auto-tone the compliance chip from the percentage when not given. */
function toneFor(pct: number): ChipTone {
  if (pct >= 80) return 'high';
  if (pct >= 50) return 'mid';
  return 'low';
}

/** Habit list row: name + streak flame + 7-day done/missed strip + compliance %. */
export function HabitRow({
  name = '10k steps',
  when = 'By 9:00pm · daily',
  streak = 9,
  days = [true, true, false, true, true, true, true],
  compliancePct = 83,
  tone,
  className,
  ...rest
}: HabitRowProps) {
  const pct = Math.max(0, Math.min(100, compliancePct));
  return (
    <div className={cn('lk-hab-row', className)} {...rest}>
      <div className="lk-hab-main">
        <div className="lk-hab-name">{name}</div>
        <div className="lk-hab-meta">
          {when && <span className="lk-hab-when">{when}</span>}
          <span className="lk-hab-flame" aria-label={`${streak} day streak`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2c1 4-2 5-2 8a2 2 0 0 0 4 0c2 2 3 4 3 6a5 5 0 0 1-10 0c0-4 5-6 5-14z" />
            </svg>
            <span className="lk-tnum">{streak}</span>
          </span>
          <span
            className="lk-hab-strip"
            role="img"
            aria-label={`Last 7 days: ${days.map((d) => (d ? 'done' : 'missed')).join(', ')}`}
          >
            {days.map((done, i) => (
              <span
                key={i}
                className={cn('lk-hab-cell', done ? 'lk-hab-done' : 'lk-hab-missed')}
              />
            ))}
          </span>
        </div>
      </div>
      <Chip tone={tone ?? toneFor(pct)} dot>
        <span className="lk-tnum">{pct}%</span>
      </Chip>
    </div>
  );
}
