import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

/** A single rep-max row: an estimated 1RM (possibly locked behind a paywall)
 *  and the best value actually achieved at that rep count, with its date. */
export interface RepMaxRow {
  /** rep count this row is for (1RM, 2RM, …) */
  reps: number;
  /** projected max for this rep count, e.g. '280 lbs'; null/undefined → dash */
  estimated?: string | null;
  /** when true the estimate is paywalled — render a padlock instead */
  estimatedLocked?: boolean;
  /** best value actually hit at this rep count, e.g. '330 lbs' */
  achieved?: string;
  /** date the achieved value was logged, e.g. '12/13/25' */
  achievedDate?: string;
}

export interface RepMaxTableProps extends HTMLAttributes<HTMLDivElement> {
  /** rows to render, top → bottom (defaults to the reference data) */
  rows?: RepMaxRow[];
  /** unit suffix shown in the header (purely a label) */
  unit?: string;
  /** card heading; pass null/'' to hide it */
  title?: string;
}

/** Reference data mirroring a Strength-app Stats tab. */
const DEFAULT_ROWS: RepMaxRow[] = [
  { reps: 1, estimated: '280 lbs', achieved: '330 lbs', achievedDate: '12/13/25' },
  { reps: 2, estimated: '272.2 lbs', achieved: '290 lbs', achievedDate: '2/7' },
  { reps: 3, estimated: '264.4 lbs', achieved: '275 lbs', achievedDate: '1/5' },
  { reps: 4, estimatedLocked: true, achieved: '265 lbs', achievedDate: '4/28/25' },
  { reps: 5, estimatedLocked: true, achieved: '255 lbs', achievedDate: '5/29/25' },
  { reps: 6, estimatedLocked: true, achieved: '245 lbs', achievedDate: '9/8/25' },
  { reps: 7, estimatedLocked: true, achieved: '225 lbs', achievedDate: '6/25/25' },
];

/** Rep Maxes — a per-rep-count table of estimated vs. achieved one-rep maxes.
 *  Estimates can be locked behind a padlock; achievements glow green with the
 *  date they were set underneath. */
export function RepMaxTable({
  rows = DEFAULT_ROWS,
  unit = 'lbs',
  title = 'Rep Maxes',
  className,
  ...rest
}: RepMaxTableProps) {
  return (
    <div className={cn('lk-rmt', className)} {...rest}>
      {title ? <div className="lk-rmt-title">{title}</div> : null}

      <div className="lk-rmt-table" role="table" aria-label={title || undefined}>
        <div className="lk-rmt-head" role="row">
          <span className="lk-rmt-h lk-rmt-reps" role="columnheader">
            Reps
          </span>
          <span className="lk-rmt-h lk-rmt-est" role="columnheader">
            Estimated
          </span>
          <span className="lk-rmt-h lk-rmt-ach" role="columnheader">
            Achieved
          </span>
        </div>

        {rows.map((row, i) => (
          <div className="lk-rmt-row" role="row" key={`${row.reps}-${i}`}>
            <span className="lk-rmt-cell lk-rmt-reps" role="cell">
              {row.reps}
            </span>

            <span className="lk-rmt-cell lk-rmt-est" role="cell">
              {row.estimatedLocked ? (
                <Icon className="lk-rmt-lock" name="lock" size={14} aria-label="locked" />
              ) : row.estimated != null ? (
                <span className="lk-rmt-est-val">{row.estimated}</span>
              ) : (
                <span className="lk-rmt-dash" aria-hidden="true">
                  —
                </span>
              )}
            </span>

            <span className="lk-rmt-cell lk-rmt-ach" role="cell">
              {row.achieved ? (
                <span className="lk-rmt-ach-val">{row.achieved}</span>
              ) : (
                <span className="lk-rmt-dash" aria-hidden="true">
                  —
                </span>
              )}
              {row.achievedDate ? <span className="lk-rmt-ach-date">{row.achievedDate}</span> : null}
            </span>
          </div>
        ))}
      </div>

      <span className="lk-rmt-unit" hidden>
        {unit}
      </span>
    </div>
  );
}
