'use client';

import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface OptionCardProps {
  /** Primary label (display/ui font). */
  title: string;
  /** Optional supporting line under the title (muted). */
  description?: string;
  /** Selected state — accent border + glow + a check affordance. */
  selected?: boolean;
  /** Dims the tile and blocks interaction. */
  disabled?: boolean;
  /** Leading slot — an icon or small visual. */
  icon?: ReactNode;
  /** Trailing slot — a status badge, connect button, etc. */
  trailing?: ReactNode;
  /** Tap/click handler. Rendered as a real `<button>`. */
  onSelect?: () => void;
  className?: string;
}

/**
 * Aurora selectable / actionable glass tile. Two uses:
 *  (a) a selectable choice — tap toggles `selected` (device pick);
 *  (b) an actionable row — `trailing` holds a connect button / status.
 * Reuses the Card glass look via `lk-optioncard`; `lk-selected` adds the accent
 * border + glow + check, `lk-disabled` dims and blocks interaction.
 */
export default function OptionCard({
  title,
  description,
  selected = false,
  disabled = false,
  icon,
  trailing,
  onSelect,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={cn('lk-optioncard', selected && 'lk-selected', disabled && 'lk-disabled', className)}
      onClick={onSelect}
      disabled={disabled || undefined}
      aria-pressed={selected}
    >
      {icon != null && <span className="lk-optioncard-icon">{icon}</span>}
      <span className="lk-optioncard-body">
        <span className="lk-optioncard-title">{title}</span>
        {description != null && <span className="lk-optioncard-desc">{description}</span>}
      </span>
      {trailing != null && <span className="lk-optioncard-trailing">{trailing}</span>}
      {selected && (
        <span className="lk-optioncard-check" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
