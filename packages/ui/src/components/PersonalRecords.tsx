import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** A tiny rising progress spark: a polyline of points + colors for line and dot. */
export interface PersonalRecordSpark {
  /** Spark vertices in a 120×26 viewBox (preserveAspectRatio="none"). */
  points: Array<[number, number]>;
  /** Line stroke color (CSS color or token, e.g. `var(--accent)`). */
  line?: string;
  /** Trailing glow-dot color. Defaults to the line color. */
  dot?: string;
}

export interface PersonalRecord {
  /** Lift / exercise name, e.g. "Back Squat 1RM". */
  name: ReactNode;
  /** Record value, e.g. 180. */
  value: ReactNode;
  /** Unit suffix, e.g. "kg". */
  unit?: ReactNode;
  /** Date the record was set, e.g. "Jun 14". */
  date?: ReactNode;
  /** Improvement over the previous best, e.g. "+5 kg". */
  delta?: ReactNode;
  /** How long ago it was set, e.g. "11d" — shown top-right when not a new PR. */
  age?: ReactNode;
  /** Tiny progress spark. */
  spark?: PersonalRecordSpark;
  /** Freshly-set PR — lights the card + shows the trophy. */
  isNew?: boolean;
}

export interface PersonalRecordsProps extends HTMLAttributes<HTMLDivElement> {
  /** PR cards to render. Defaults to the design's example set. */
  records?: PersonalRecord[];
}

/** Trophy glyph (24×24, stroked via CSS color). */
const TROPHY = (
  <svg
    className="lk-pr-trophy"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M6 2h12v7a6 6 0 0 1-12 0V2Z" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 15v3" />
  </svg>
);

/** The design's example PR set: one new PR (lit) + two older records. */
const DEFAULT_RECORDS: PersonalRecord[] = [
  {
    name: 'Back Squat 1RM',
    value: 180,
    unit: 'kg',
    date: 'Jun 14',
    delta: '+5 kg',
    isNew: true,
    spark: { points: [[0, 22], [24, 19], [48, 15], [72, 12], [96, 7], [120, 3]], line: 'var(--accent)', dot: 'var(--accent-3)' },
  },
  {
    name: 'Bench Press 1RM',
    value: 110,
    unit: 'kg',
    date: 'Jun 9',
    delta: '+2.5 kg',
    age: '11d',
    spark: { points: [[0, 21], [24, 17], [48, 18], [72, 12], [96, 11], [120, 8]], line: 'var(--accent-3)', dot: 'var(--accent-2)' },
  },
  {
    name: 'Deadlift 1RM',
    value: 220,
    unit: 'kg',
    date: 'May 30',
    delta: '+10 kg',
    age: '21d',
    spark: { points: [[0, 23], [24, 20], [48, 15], [72, 14], [96, 8], [120, 2]], line: 'var(--magenta)', dot: 'var(--magenta)' },
  },
];

/**
 * Personal records — a grid of PR cards. Each card is a lift/exercise name, the
 * record value (gradient 1RM number + unit), a date with a "new PR" delta chip,
 * and a tiny rising progress spark. New PRs light the card and show a trophy;
 * older records show their age top-right. Defaults to the design's example set.
 * The grid collapses to a single column on narrow widths.
 */
export function PersonalRecords({ records = DEFAULT_RECORDS, className, ...rest }: PersonalRecordsProps) {
  return (
    <div className={cn('lk-pr-grid', className)} {...rest}>
      {records.map((r, i) => {
        const isNew = r.isNew ?? false;
        const spark = r.spark;
        return (
          <article key={i} className={cn('lk-card', 'lk-pr-card', isNew && 'lk-lit')}>
            <div className="lk-pr-top">
              <span className="lk-pr-lift">{r.name}</span>
              {isNew ? TROPHY : r.age != null && <span className="lk-pr-age lk-mono">{r.age}</span>}
            </div>

            <div className="lk-pr-val">
              <span className="lk-pr-num lk-display lk-tnum">{r.value}</span>
              {r.unit != null && <span className="lk-pr-unit lk-mono">{r.unit}</span>}
            </div>

            {(r.date != null || r.delta != null) && (
              <div className="lk-pr-meta">
                {r.date != null && <span className="lk-pr-date lk-mono">{r.date}</span>}
                {r.delta != null && (
                  <Chip tone="high" dot className="lk-pr-delta lk-tnum">
                    <span className="lk-pr-arrow" aria-hidden="true">▲</span> {r.delta}
                  </Chip>
                )}
              </div>
            )}

            {spark && (
              <svg
                className="lk-pr-spark"
                viewBox="0 0 120 26"
                preserveAspectRatio="none"
                aria-label={`${typeof r.name === 'string' ? r.name : 'Record'} rising`}
              >
                <polyline
                  points={spark.points.map(([x, y]) => `${x},${y}`).join(' ')}
                  fill="none"
                  stroke={spark.line ?? 'var(--accent)'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {spark.points.length > 0 && (
                  <circle
                    className="lk-pr-dot"
                    cx={spark.points[spark.points.length - 1]![0]}
                    cy={spark.points[spark.points.length - 1]![1]}
                    r={3}
                    fill={spark.dot ?? spark.line ?? 'var(--accent-3)'}
                  />
                )}
              </svg>
            )}
          </article>
        );
      })}
    </div>
  );
}
