'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

export interface MessageComposerProps {
  /** called with the trimmed, non-empty text; the field clears afterwards */
  onSend: (text: string) => void;
  /** placeholder shown in the empty field */
  placeholder?: string;
  /** show a leading lock glyph marking the thread end-to-end encrypted */
  e2ee?: boolean;
  /** disable the whole bar (input + buttons) */
  disabled?: boolean;
}

/**
 * MessageComposer — the DM/chat input bar: a glassy pill containing an
 * optional E2EE lock, an attach button, a growing multiline text field, an
 * emoji button and an accent-filled send button. Mirrors `.composer` from the
 * coach/chat design. Enter (no shift) or pressing send fires `onSend` + clears.
 */
export function MessageComposer({
  onSend,
  placeholder = 'Message…',
  e2ee = false,
  disabled = false,
}: MessageComposerProps) {
  const [value, setValue] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);
  const canSend = !disabled && value.trim().length > 0;

  function autoGrow() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    // grow up to ~5 lines, then scroll
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }

  function send() {
    const text = value.trim();
    if (disabled || text.length === 0) return;
    onSend(text);
    setValue('');
    // reset the grown height after clearing
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (ta) ta.style.height = 'auto';
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className={cn('lk-composer', disabled && 'lk-composer-disabled')}>
      {e2ee ? (
        <span className="lk-composer-lock" aria-label="End-to-end encrypted" title="End-to-end encrypted">
          <Icon name="lock" size={16} />
        </span>
      ) : null}

      <button
        type="button"
        className="lk-composer-btn"
        aria-label="Attach"
        title="Attach"
        disabled={disabled}
      >
        <Icon name="plus" size={18} />
      </button>

      <textarea
        ref={taRef}
        className="lk-composer-input"
        rows={1}
        placeholder={placeholder}
        aria-label="Message text"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          setValue(e.target.value);
          autoGrow();
        }}
        onKeyDown={onKeyDown}
      />

      <button
        type="button"
        className="lk-composer-btn"
        aria-label="Emoji"
        title="Emoji"
        disabled={disabled}
      >
        <Icon name="sparkle" size={18} />
      </button>

      <button
        type="button"
        className="lk-composer-send"
        aria-label="Send message"
        onClick={send}
        disabled={!canSend}
      >
        <Icon name="share" size={18} />
      </button>
    </div>
  );
}
