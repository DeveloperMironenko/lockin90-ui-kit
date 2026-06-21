import { type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

export interface WorkoutSet {
  /** load lifted, in `unit` */
  weight: number;
  /** repetitions performed */
  reps: number;
  /** rate of perceived exertion (0–10); omit/empty for an unlogged set */
  rpe?: number | '';
  /** whether the set has been completed (mint check, tinted row) */
  done?: boolean;
}

export interface WorkoutSetLoggerProps {
  /** exercise name, e.g. "Barbell Squat" */
  name?: string;
  /** target/summary line under the name, e.g. "4 sets · Target 5 × 100 kg · RPE 8" */
  target?: ReactNode;
  /** logged sets, in order */
  sets?: WorkoutSet[];
  /** weight unit shown beside each load */
  unit?: string;
  /** custom leading icon (defaults to a barbell glyph) */
  icon?: ReactNode;
  className?: string;
}

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.5 6.5h11M6.5 17.5h11M4 9v6M20 9v6M9 7v10M15 7v10" />
  </svg>
);

const CHECK_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const PLUS_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const DEFAULT_SETS: WorkoutSet[] = [
  { weight: 100, reps: 5, rpe: 7.5, done: true },
  { weight: 100, reps: 5, rpe: 8, done: true },
  { weight: 100, reps: 5, rpe: 8.5 },
  { weight: 100, reps: 5, rpe: '' },
];

/** Index of the first not-yet-done set — the "current" working set. */
function currentIndex(sets: WorkoutSet[]): number {
  return sets.findIndex((s) => !s.done);
}

/** Workout set-logger — in-session strength table: exercise header, per-set
 *  weight/reps/RPE inputs with a mint completion toggle, an "add set" row, and
 *  a volume/PR readout. Static/presentational (inputs are uncontrolled). */
export function WorkoutSetLogger({
  name = 'Barbell Squat',
  target = (
    <>
      4 sets · Target <b>5 × 100 kg</b> · RPE 8
    </>
  ),
  sets = DEFAULT_SETS,
  unit = 'kg',
  icon,
  className,
}: WorkoutSetLoggerProps) {
  const current = currentIndex(sets);
  const doneSets = sets.filter((s) => s.done);
  const volume = doneSets.reduce((sum, s) => sum + s.weight * s.reps, 0);
  const topSet = doneSets.reduce<number>((max, s) => Math.max(max, s.weight), 0);

  return (
    <div className={cn('lk-set lk-card', className)}>
      <div className="lk-set-ex">
        <div className="lk-set-ex-ico">{icon ?? DEFAULT_ICON}</div>
        <div className="lk-set-ex-main">
          <div className="lk-set-ex-name lk-display">{name}</div>
          {target ? <div className="lk-set-ex-target">{target}</div> : null}
        </div>
      </div>

      <div className="lk-set-wrap">
        <table className="lk-set-table" aria-label={`Set logger for ${name}`}>
          <thead>
            <tr>
              <th className="lk-set-num">Set</th>
              <th>Weight</th>
              <th>Reps</th>
              <th>RPE</th>
              <th className="lk-set-done">✓</th>
            </tr>
          </thead>
          <tbody>
            {sets.map((s, i) => {
              const n = i + 1;
              const rpe = s.rpe === undefined ? '' : String(s.rpe);
              return (
                <tr
                  key={i}
                  className={cn('lk-set-row', s.done && 'is-done', !s.done && i === current && 'is-current')}
                >
                  <td className="lk-set-idx">{n}</td>
                  <td>
                    <input className="lk-set-inp" defaultValue={s.weight} aria-label={`Set ${n} weight`} />
                    <span className="lk-set-unit">{unit}</span>
                  </td>
                  <td>
                    <input className="lk-set-inp" defaultValue={s.reps} aria-label={`Set ${n} reps`} />
                  </td>
                  <td>
                    <input
                      className="lk-set-inp lk-set-rpe"
                      defaultValue={rpe}
                      placeholder="—"
                      aria-label={`Set ${n} RPE`}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="lk-set-check"
                      aria-pressed={s.done ? 'true' : 'false'}
                      aria-label={s.done ? `Set ${n} done` : `Mark set ${n} done`}
                    >
                      {CHECK_ICON}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button type="button" className="lk-set-add" aria-label="Add another set">
        {PLUS_ICON} Add set
      </button>

      <div className="lk-set-foot">
        <div className="lk-set-stat">
          <span className="lk-set-stat-lbl">Volume</span>
          <span className="lk-set-stat-val lk-mono lk-tnum">
            {volume.toLocaleString()}
            <span className="lk-set-stat-unit">{unit}</span>
          </span>
        </div>
        <div className="lk-set-stat">
          <span className="lk-set-stat-lbl">Top set</span>
          <span className="lk-set-stat-val lk-mono lk-tnum">
            {topSet}
            <span className="lk-set-stat-unit">{unit}</span>
          </span>
        </div>
        <Chip tone="high" dot>
          PR pace
        </Chip>
      </div>
    </div>
  );
}
