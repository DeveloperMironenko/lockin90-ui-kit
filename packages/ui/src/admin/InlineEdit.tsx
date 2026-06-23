'use client';

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { cn } from '../cn';
import { Icon } from '../components/Icon';

/* InlineEdit (EditableCell) — the load-bearing operator primitive for
   in-place parameter editing in admin tables. Display mode shows the value
   (+ optional suffix) with a hover-revealed pencil; clicking enters edit mode
   with a focused, prefilled mono input; Enter or the ✓ commits via onCommit and
   returns to display; Escape or the ✕ cancels. Web-only (admin has no native
   surface). Matches the `.editable` cell from lockin90-design/admin/pipeline.html
   (parameters table). */

export interface InlineEditProps {
  /** Current committed value rendered in display mode. */
  value: string | number;
  /** Input mode while editing. @default 'text' */
  type?: 'text' | 'number';
  /** Faint suffix shown after the value, e.g. 'pts', 'ms'. */
  suffix?: string;
  /** Fired on Enter / ✓ with the new string value. */
  onCommit: (next: string) => void;
  /** Display + edit alignment within the cell. @default 'left' */
  align?: 'left' | 'right';
}

/**
 * In-place editable cell. Holds an internal draft while editing; commits the
 * string value on Enter or the confirm button, cancels (restoring the draft from
 * `value`) on Escape or the cancel button. Keyboard-accessible: the display
 * affordance is a real button (Enter/Space to begin editing).
 */
export function InlineEdit({
  value,
  type = 'text',
  suffix,
  onCommit,
  align = 'left',
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const begin = () => {
    setDraft(String(value));
    setEditing(true);
  };

  const commit = () => {
    setEditing(false);
    onCommit(draft);
  };

  const cancel = () => {
    setDraft(String(value));
    setEditing(false);
  };

  // Focus + select the field when entering edit mode.
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  const alignClass = align === 'right' ? 'lk-iedit-right' : undefined;

  if (editing) {
    return (
      <span className={cn('lk-iedit', 'lk-iedit-editing', alignClass)}>
        <input
          ref={inputRef}
          type={type}
          className="lk-iedit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          inputMode={type === 'number' ? 'decimal' : undefined}
          aria-label="Edit value"
        />
        <button
          type="button"
          className="lk-iedit-btn lk-iedit-confirm"
          onClick={commit}
          aria-label="Confirm"
          title="Confirm"
        >
          <Icon name="check" size={13} aria-hidden />
        </button>
        <button
          type="button"
          className="lk-iedit-btn lk-iedit-cancel"
          onClick={cancel}
          aria-label="Cancel"
          title="Cancel"
        >
          <Icon name="close" size={13} aria-hidden />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={cn('lk-iedit', 'lk-iedit-display', alignClass)}
      onClick={begin}
      aria-label={`Edit value${suffix ? ` (${suffix})` : ''}`}
    >
      <span className="lk-iedit-value">
        {value}
        {suffix ? <span className="lk-iedit-suffix"> {suffix}</span> : null}
      </span>
      <Icon name="edit" size={11} className="lk-iedit-pencil" aria-hidden />
    </button>
  );
}
