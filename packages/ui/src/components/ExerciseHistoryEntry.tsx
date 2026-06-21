import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** One logged set within a past session. `label` is 'W' for a warm-up or a
 *  work-set number ('1', '2', …). `top` flags the session's top set so its 1RM
 *  reads bold/highlighted. */
export interface HistorySet {
  /** set label — 'W' (warm-up) or a work-set number ('1', '2', …) */
  label: string;
  /** load lifted, in `unit` */
  weight: number;
  /** repetitions performed */
  reps: number;
  /** estimated one-rep max for this set (in `unit`) */
  oneRM?: number;
  /** whether this is the session's top set (bold/highlighted 1RM) */
  top?: boolean;
}

export interface ExerciseHistoryEntryProps extends HTMLAttributes<HTMLDivElement> {
  /** session date, e.g. "Friday, April 17" */
  date?: string;
  /** relative "ago" label, e.g. "2M" */
  ago?: string;
  /** logged sets, in order */
  sets?: HistorySet[];
  /** weight unit shown in the column header */
  unit?: string;
  className?: string;
}

const DEFAULT_SETS: HistorySet[] = [
  { label: 'W', weight: 135, reps: 3, oneRM: 143 },
  { label: 'W', weight: 225, reps: 3, oneRM: 238 },
  { label: '1', weight: 280, reps: 1, oneRM: 280, top: true },
];

/** Exercise history entry — a read-only past-session card for an exercise's
 *  History tab: a date header with a relative "ago" label, then a compact
 *  SET · {UNIT} · REPS · 1RM column table. Warm-up rows ('W') read muted;
 *  the top set's 1RM is bold/highlighted. Static/presentational. */
export function ExerciseHistoryEntry({
  date = 'Friday, April 17',
  ago = '2M',
  sets = DEFAULT_SETS,
  unit = 'lb',
  className,
  ...rest
}: ExerciseHistoryEntryProps) {
  return (
    <div className={cn('lk-hist lk-card', className)} {...rest}>
      <div className="lk-hist-head">
        <span className="lk-hist-date">{date}</span>
        <span className="lk-hist-ago">{ago}</span>
      </div>

      <div className="lk-hist-cols" aria-hidden="true">
        <span className="lk-hist-c-set">Set</span>
        <span>{unit}</span>
        <span>Reps</span>
        <span>1RM</span>
      </div>

      <div className="lk-hist-rows">
        {sets.map((s, i) => {
          const warmup = s.label.toUpperCase() === 'W';
          return (
            <div className="lk-hist-row" key={i}>
              <span className={cn('lk-hist-set', warmup && 'is-warmup')}>{s.label}</span>
              <span className="lk-hist-wt">{s.weight}</span>
              <span className="lk-hist-reps">{s.reps}</span>
              <span className={cn('lk-hist-orm', s.top && 'is-top')}>
                {s.oneRM ?? '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
