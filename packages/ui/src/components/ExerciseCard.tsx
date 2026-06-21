import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** Difficulty rung: 1 = beginner, 2 = intermediate, 3 = advanced. */
export type ExerciseLevel = 1 | 2 | 3;

/** Default difficulty labels per level (mono uppercase footer label). */
const LEVEL_LABEL: Record<ExerciseLevel, string> = {
  1: 'Beginner',
  2: 'Inter',
  3: 'Advanced',
};

export interface ExerciseCardProps extends HTMLAttributes<HTMLElement> {
  /** Exercise name, e.g. "Barbell Back Squat". */
  name?: string;
  /** Target muscle groups — first is the primary (accent + dot), rest plain. */
  muscles?: string[];
  /** 16:9 thumbnail gradient (any CSS background value). */
  gradient?: string;
  /** Path data for the waveline overlay drawn on the thumb (160×90 viewBox). */
  wavePath?: string;
  /** Duration badge, e.g. "4:12". Hidden when empty. */
  duration?: string;
  /** Difficulty rung 1–3. */
  level?: ExerciseLevel;
  /** Difficulty label. Defaults to a label derived from the level. */
  levelLabel?: string;
  /** Custom play-button glyph (defaults to a triangle). */
  playIcon?: ReactNode;
  className?: string;
}

const DEFAULT_PLAY_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 4l14 8-14 8z" />
  </svg>
);

/** Exercise-library card — a 16:9 video-style thumb (gradient + waveline +
 *  centered play button + duration badge), the exercise name, muscle-group
 *  chips (first is the accent primary), and a level-dot difficulty footer. */
export function ExerciseCard({
  name = 'Barbell Back Squat',
  muscles = ['Quads', 'Glutes', 'Core'],
  gradient = 'linear-gradient(135deg, #7C5CFF, #22D3EE)',
  wavePath = 'M0,64 C30,40 50,72 80,52 C110,32 130,60 160,44',
  duration = '4:12',
  level = 3,
  levelLabel,
  playIcon,
  className,
  ...rest
}: ExerciseCardProps) {
  const lbl = levelLabel ?? LEVEL_LABEL[level];
  return (
    <article className={cn('lk-ex', className)} {...rest}>
      <div className="lk-ex-thumb">
        <div className="lk-ex-grad" style={{ background: gradient }} />
        <svg className="lk-ex-wavelines" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true">
          <path d={wavePath} fill="none" stroke="#fff" strokeWidth={2} />
        </svg>
        {duration ? <span className="lk-ex-dur">{duration}</span> : null}
        <span className="lk-ex-play" aria-hidden="true">
          {playIcon ?? DEFAULT_PLAY_ICON}
        </span>
      </div>
      <div className="lk-ex-body">
        <div className="lk-ex-name">{name}</div>
        <div className="lk-ex-tags">
          {muscles.map((m, i) =>
            i === 0 ? (
              <Chip key={m} tone="accent" dot>
                {m}
              </Chip>
            ) : (
              <Chip key={m}>{m}</Chip>
            ),
          )}
        </div>
        <div className="lk-ex-foot">
          <span
            className={cn('lk-ex-diff', `lvl${level}`)}
            aria-label={`Difficulty ${level} of 3`}
          >
            {([1, 2, 3] as const).map((n) => (
              <i key={n} className={n <= level ? 'on' : undefined} />
            ))}
            <span className="lk-ex-difflbl">{lbl}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
