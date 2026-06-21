import { type MouseEvent } from 'react';
import { cn } from '../cn';

/** One guided-prompt chip in the prompt row. */
export interface JournalPrompt {
  /** chip label, e.g. "Wins today" */
  label: string;
  /** whether the prompt is already applied (shows a check + lit gradient pill) */
  selected?: boolean;
}

/** One mood option in the mood-face row. */
export interface JournalMood {
  /** accessible label, e.g. "Good" */
  label: string;
  /** the face glyph (emoji) shown in the circle — defaults per the design set */
  emoji?: string;
  /** whether this is the currently chosen mood (exactly one expected) */
  selected?: boolean;
}

export interface JournalComposerProps {
  /** card title, top-left (e.g. "New entry") */
  title?: string;
  /** mono timestamp, top-right (e.g. "Wed Jun 11") */
  time?: string;
  /** textarea placeholder */
  placeholder?: string;
  /** initial textarea value */
  value?: string;
  /** label above the prompt-chip row */
  promptsLabel?: string;
  /** the guided-prompt chips */
  prompts?: JournalPrompt[];
  /** label before the mood-face row */
  moodLabel?: string;
  /** the mood faces (one selected) */
  moods?: JournalMood[];
  /** the Save button label */
  saveLabel?: string;
  /** fired when a prompt chip is pressed (index + prompt) */
  onPromptToggle?: (prompt: JournalPrompt, index: number) => void;
  /** fired when a mood face is pressed (index + mood) */
  onMoodSelect?: (mood: JournalMood, index: number) => void;
  /** fired when the Save button is pressed */
  onSave?: () => void;
  className?: string;
}

/** The design example's guided prompts, in order (first one applied). */
export const JOURNAL_PROMPTS: JournalPrompt[] = [
  { label: 'Wins today', selected: true },
  { label: 'What drained me' },
  { label: 'Sleep notes' },
  { label: "Tomorrow's focus" },
];

/** The design example's five mood faces (the "Good" face selected). */
export const JOURNAL_MOODS: JournalMood[] = [
  { label: 'Drained', emoji: '😩' },
  { label: 'Low', emoji: '😕' },
  { label: 'Neutral', emoji: '😐' },
  { label: 'Good', emoji: '🙂', selected: true },
  { label: 'Charged', emoji: '😄' },
];

/** Journal composer — the "new entry" surface: a titled prompt + a free-text
 *  area, a row of guided-prompt chips, a mood-face selector row, and a gradient
 *  Save button. Static surface (selection is driven by the props). */
export function JournalComposer({
  title = 'New entry',
  time = 'Wed Jun 11',
  placeholder = 'What shaped your energy today?',
  value = '',
  promptsLabel = 'Guided prompts',
  prompts = JOURNAL_PROMPTS,
  moodLabel = 'Mood',
  moods = JOURNAL_MOODS,
  saveLabel = 'Save entry',
  onPromptToggle,
  onMoodSelect,
  onSave,
  className,
}: JournalComposerProps) {
  return (
    <div className={cn('lk-jc-card', className)}>
      <div className="lk-jc-head">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        <span className="lk-jc-title lk-display">{title}</span>
        <span className="lk-jc-time lk-mono">{time}</span>
      </div>

      <textarea
        className="lk-jc-textarea"
        placeholder={placeholder}
        defaultValue={value}
        rows={4}
      />

      <div className="lk-jc-promptlabel lk-mono">{promptsLabel}</div>
      <div className="lk-jc-prompts">
        {prompts.map((p, i) => (
          <button
            key={p.label}
            type="button"
            className="lk-jc-chip"
            aria-pressed={!!p.selected}
            onClick={(_e: MouseEvent<HTMLButtonElement>) => onPromptToggle?.(p, i)}
          >
            <span className="lk-jc-added">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="lk-jc-plus lk-mono" aria-hidden="true">
              +
            </span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="lk-jc-mood">
        <span className="lk-jc-mood-lbl lk-mono">{moodLabel}</span>
        <div className="lk-jc-faces">
          {moods.map((m, i) => (
            <button
              key={m.label}
              type="button"
              className="lk-jc-face"
              aria-pressed={!!m.selected}
              aria-label={m.label}
              onClick={(_e: MouseEvent<HTMLButtonElement>) => onMoodSelect?.(m, i)}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="lk-jc-foot">
        <button type="button" className="lk-jc-save" onClick={() => onSave?.()}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
            <path d="M17 21v-8H7v8M7 3v5h8" />
          </svg>
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
