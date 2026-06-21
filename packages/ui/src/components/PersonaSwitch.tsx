import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** Which app persona is active. */
export type Persona = 'personal' | 'coach';

/** One persona segment in the toggle. */
export interface PersonaOption {
  /** the persona key this segment selects */
  key: Persona;
  /** segment label, e.g. "Personal" */
  label: string;
}

export interface PersonaSwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  /** the active persona — drives the sliding gradient pill (`data-active`) */
  active?: Persona;
  /** the two segments (icon is derived from `key`); defaults to Personal/Coach */
  options?: [PersonaOption, PersonaOption];
  /** accessible label for the toggle group */
  groupLabel?: string;
  /** current-context line — bold lead + dimmed trailer (e.g. "viewing as coach") */
  contextLine?: ReactNode;
  /** trailing dimmed part of the context line, separated by " · " */
  contextTrailer?: ReactNode;
  /** copy before the keycap in the switch-back hint */
  hintLabel?: string;
  /** the keycap text in the switch-back hint (the persona you'd switch back to) */
  hintKey?: string;
  /** fired with the persona key when a segment is pressed */
  onSelect?: (persona: Persona) => void;
}

/** person glyph (Personal) / two-figure glyph (Coach). */
function PersonaIcon({ persona }: { persona: Persona }) {
  if (persona === 'coach') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.2 3.2 0 0 1 0 6.2M17 20a6.5 6.5 0 0 0-3-5.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

const DEFAULT_OPTIONS: [PersonaOption, PersonaOption] = [
  { key: 'personal', label: 'Personal' },
  { key: 'coach', label: 'Coach' },
];

/** Persona / mode switch — a segmented app-chrome toggle that swaps the app
 *  between Personal and Coach modes. A sliding gradient pill marks the active
 *  persona, with a current-context line and a switch-back hint. */
export function PersonaSwitch({
  active = 'coach',
  options = DEFAULT_OPTIONS,
  groupLabel = 'App mode',
  contextLine = 'Coaching 8 athletes',
  contextTrailer = 'viewing as coach',
  hintLabel = 'Switch back to',
  hintKey = 'Personal',
  onSelect,
  className,
  ...rest
}: PersonaSwitchProps) {
  return (
    <div className={cn('lk-persona', className)} {...rest}>
      <div className="lk-persona-track" data-active={active} role="group" aria-label={groupLabel}>
        <span className="lk-persona-pill" aria-hidden="true" />
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className="lk-persona-seg"
            data-persona={opt.key}
            aria-pressed={active === opt.key}
            onClick={() => onSelect?.(opt.key)}
          >
            <PersonaIcon persona={opt.key} /> {opt.label}
          </button>
        ))}
      </div>

      <div className="lk-persona-ctx">
        <span className="lk-persona-cdot" aria-hidden="true" />
        <span>
          <b>{contextLine}</b>
          {contextTrailer ? (
            <>
              <span className="lk-persona-ctx-sep"> · </span>
              {contextTrailer}
            </>
          ) : null}
        </span>
      </div>

      <span className="lk-persona-hint lk-mono">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h11a5 5 0 0 1 5 5v1" />
        </svg>
        {hintLabel} <kbd>{hintKey}</kbd> anytime
      </span>
    </div>
  );
}

export type { Persona as PersonaSwitchPersona, PersonaOption as PersonaSwitchOption };
