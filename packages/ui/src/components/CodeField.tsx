'use client';

import {
  forwardRef,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../cn';

export interface CodeFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'wrap'> {
  /** Current code / embed string. */
  value: string;
  /** Fired with the next string on every edit. */
  onChange: (value: string) => void;
  /** Optional language label rendered as a chip in the header (e.g. 'html', 'json'). */
  language?: string;
  /** Placeholder shown when empty. */
  placeholder?: string;
  /** Visible rows of the textarea. Default 8. */
  rows?: number;
  /** Invalid state — red border + ring. */
  invalid?: boolean;
  /** Wrap long lines instead of horizontal scrolling. Default false. */
  wrap?: boolean;
}

/** Number of spaces a Tab inserts. */
const TAB = '  ';

/** Editable monospace code / embed input on the same dark inset surface as
 *  `CodeBlock` (distinct from `CodeBlock` display + `CodeInput` OTP). Pressing
 *  Tab inserts 2 spaces instead of moving focus; an optional `language` chip
 *  sits in the header. No syntax-highlight engine — dependency-free. */
export const CodeField = forwardRef<HTMLTextAreaElement, CodeFieldProps>(function CodeField(
  { value, onChange, language, placeholder, rows = 8, invalid = false, wrap = false, className, onKeyDown, ...rest },
  ref,
) {
  const hasHeader = language != null;

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart, selectionEnd } = el;
      const next = value.slice(0, selectionStart) + TAB + value.slice(selectionEnd);
      onChange(next);
      // Restore caret just after the inserted spaces.
      const caret = selectionStart + TAB.length;
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = caret;
      });
    }
  }

  return (
    <div className={cn('lk-codefield', invalid && 'lk-codefield-invalid', className)}>
      {hasHeader && (
        <div className="lk-codefield-head">
          <span className="lk-codefield-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {language != null && <span className="lk-codefield-lang">{language}</span>}
        </div>
      )}
      <textarea
        ref={ref}
        className={cn('lk-codefield-ta', wrap ? 'lk-codefield-wrap' : 'lk-codefield-nowrap')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        aria-invalid={invalid || undefined}
        {...rest}
      />
    </div>
  );
});
