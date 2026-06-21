import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

export interface ContributionStripProps extends HTMLAttributes<HTMLDivElement> {
  /** 30 intensity levels (0..4), one per day, oldest→today. */
  cells?: number[];
  /** current logging-streak length, in days. */
  streak?: number;
  /** days logged out of the window, e.g. "26 / 30". */
  days?: string;
  /** longest streak ever, in days. */
  longest?: number;
  /** section title. */
  label?: string;
}

/** Faithful reproduction of the design's 30-day logging-streak example. */
const DEFAULT_CELLS: number[] = [
  3, 4, 2, 4, 3, 1, 0, 3, 4, 4, 2, 0, 3, 4, 3, 4, 2, 4, 3, 4, 4, 3, 2, 4, 3, 4, 4, 3, 4, 4,
];

/** clamp an arbitrary value into the 0..4 level range for the `lN` class. */
function levelClass(v: number): string {
  const n = Math.max(0, Math.min(4, Math.round(v)));
  return `l${n}`;
}

/** Contribution heat strip — a fixed 30-day logging-streak strip: 30 cells
 *  tinted by intensity (5 levels l0–l4), a current-streak readout and a
 *  less→more legend. */
export function ContributionStrip({
  cells = DEFAULT_CELLS,
  streak = 18,
  days = '26 / 30',
  longest = 23,
  label = 'Logging streak',
  className,
  ...rest
}: ContributionStripProps) {
  return (
    <div className={cn('lk-strip', 'lk-card', className)} {...rest}>
      <div className="lk-strip-head">
        <span className="lk-strip-title">{label}</span>
        <Chip tone="high" dot>
          {days} days
        </Chip>
        <span className="lk-strip-sub">last 30 days</span>
      </div>

      <div
        className="lk-strip-grid"
        role="img"
        aria-label={`30-day logging heat strip, current run of ${streak} days`}
      >
        {cells.map((c, i) => (
          <span key={i} className={cn('lk-strip-cell', levelClass(c))} />
        ))}
      </div>

      <div className="lk-strip-axis">
        <span>30d ago</span>
        <span>today</span>
      </div>

      <div className="lk-strip-foot">
        <span className="lk-strip-streak">
          <span className="flame" aria-hidden="true">
            🔥
          </span>
          <span className="n lk-tnum">{streak}</span>-day current streak
        </span>
        <span className="lk-strip-meta">
          <b className="lk-mono">{days}</b> days logged · longest <b className="lk-mono">{longest}</b>
        </span>
        <span className="lk-strip-legend">
          less <i className="l0" />
          <i className="l1" />
          <i className="l2" />
          <i className="l3" />
          <i className="l4" /> more
        </span>
      </div>
    </div>
  );
}
