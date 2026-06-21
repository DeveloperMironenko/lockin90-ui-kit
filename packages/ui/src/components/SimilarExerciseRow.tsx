import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface SimilarExerciseRowProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Exercise name (bold) — e.g. "Incline Dumbbell Press". */
  name?: string;
  /** Muscle list shown muted under the name. */
  muscles?: string;
  /** Short duration label on the far right — e.g. "2M". */
  duration?: string;
  /** CSS background for the thumbnail (ignored when `src` is set). */
  thumb?: string;
  /** Optional thumbnail image source (overrides `thumb`). */
  src?: string;
  /** Row click handler. */
  onClick?: () => void;
  className?: string;
}

/** Similar-exercise row — a square thumbnail, the exercise name with a muted
 *  muscles line under it, and a small mono duration label on the far right.
 *  Used in Guide-tab "similar exercises" lists. Renders as a full-width button. */
export function SimilarExerciseRow({
  name = 'Incline Dumbbell Press',
  muscles = 'Pectoralis Major, Front Delts, Triceps, Side Delts',
  duration = '2M',
  thumb = 'linear-gradient(135deg,#2b3348,#171c2b)',
  src,
  onClick,
  className,
  ...rest
}: SimilarExerciseRowProps) {
  return (
    <button
      type="button"
      className={cn('lk-simex', className)}
      onClick={onClick}
      {...rest}
    >
      <span
        className="lk-simex-thumb"
        style={src ? undefined : { background: thumb }}
        aria-hidden="true"
      >
        {src ? <img src={src} alt="" /> : null}
      </span>
      <span className="lk-simex-main">
        <span className="lk-simex-name">{name}</span>
        {muscles ? <span className="lk-simex-musc">{muscles}</span> : null}
      </span>
      {duration ? <span className="lk-simex-dur lk-mono">{duration}</span> : null}
    </button>
  );
}
