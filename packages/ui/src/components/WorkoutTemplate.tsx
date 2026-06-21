import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** A single saved workout template shown as a card. */
export interface WorkoutTemplateItem {
  /** Template name, e.g. "Push Day A". */
  name: string;
  /** Short focus / target line, e.g. "Strength · upper push". */
  focus: string;
  /** Tiny meta footer, e.g. "6 ex · ~52 min · last 4d ago". */
  meta: string;
  /** Ordered exercise names (the short preview list). */
  exercises: string[];
  /** CTA label, e.g. "Start" or "Apply". */
  applyLabel: string;
  /** Optional focus-muscle chips (first is the accent primary). */
  focusTags?: string[];
  /** Optional custom card glyph (defaults to a barbell). */
  icon?: ReactNode;
  /** Accent color for the icon stroke (any CSS color). */
  iconColor?: string;
}

export interface WorkoutTemplateProps extends HTMLAttributes<HTMLDivElement> {
  /** The templates to render (laid out in a collapsing grid). */
  templates?: WorkoutTemplateItem[];
  /** Cap the previewed exercises per card; extras roll into a "+N more" row. */
  maxExercises?: number;
  /** Fired when a card's apply / start button is pressed. */
  onApply?: (template: WorkoutTemplateItem, index: number) => void;
  className?: string;
}

const BARBELL_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.5 6.5h11M6.5 17.5h11M4 9v6M20 9v6M9 7v10M15 7v10" />
  </svg>
);

const SHIELD_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const PLAY_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const DEFAULT_TEMPLATES: WorkoutTemplateItem[] = [
  {
    name: 'Push Day A',
    focus: 'Strength · upper push',
    meta: '6 ex · ~52 min · last 4d ago',
    focusTags: ['Chest', 'Shoulders', 'Triceps'],
    exercises: ['Bench Press', 'Overhead Press', 'Incline DB Press', 'Lateral Raise', 'Cable Fly', 'Triceps Pushdown'],
    applyLabel: 'Start',
  },
  {
    name: 'Lower Power',
    focus: 'Power · lower body',
    meta: '5 ex · ~48 min · last 6d ago',
    focusTags: ['Quads', 'Hamstrings', 'Glutes'],
    exercises: ['Back Squat', 'Romanian Deadlift', 'Leg Press', 'Walking Lunge', 'Calf Raise'],
    applyLabel: 'Start',
    icon: SHIELD_ICON,
    iconColor: 'var(--accent-3)',
  },
];

/** Saved-workout templates — a collapsing grid of cards: an icon + the template
 *  name and focus line, focus-muscle chips, a short exercise preview list, and
 *  an apply / start CTA. Renders the design's `.uik-tpl` pair by default. */
export function WorkoutTemplate({
  templates = DEFAULT_TEMPLATES,
  maxExercises = 4,
  onApply,
  className,
  ...rest
}: WorkoutTemplateProps) {
  return (
    <div className={cn('lk-tpl-grid', className)} {...rest}>
      {templates.map((t, ti) => {
        const shown = t.exercises.slice(0, maxExercises);
        const extra = t.exercises.length - shown.length;
        return (
          <div className="lk-card lk-tpl-card" key={`${t.name}-${ti}`}>
            <div className="lk-tpl-head">
              <span className="lk-tpl-ico" style={t.iconColor ? { color: t.iconColor } : undefined}>
                {t.icon ?? BARBELL_ICON}
              </span>
              <div>
                <div className="lk-tpl-title">{t.name}</div>
                <div className="lk-tpl-target">{t.focus}</div>
              </div>
            </div>

            {t.focusTags && t.focusTags.length > 0 ? (
              <div className="lk-tpl-focus">
                {t.focusTags.map((m, i) =>
                  i === 0 ? (
                    <Chip key={m} tone="accent">
                      {m}
                    </Chip>
                  ) : (
                    <Chip key={m}>{m}</Chip>
                  ),
                )}
              </div>
            ) : null}

            <div className="lk-tpl-list">
              {shown.map((ex, i) => (
                <span className="lk-tpl-ex" key={`${ex}-${i}`}>
                  {ex}
                </span>
              ))}
              {extra > 0 ? <span className="lk-tpl-more">+{extra} more</span> : null}
            </div>

            <div className="lk-tpl-foot">
              <span className="lk-tpl-meta lk-mono lk-tnum">{t.meta}</span>
              <button
                type="button"
                className="lk-btn lk-btn-primary lk-btn-sm lk-tpl-go"
                onClick={() => onApply?.(t, ti)}
              >
                {PLAY_ICON}
                {t.applyLabel}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
