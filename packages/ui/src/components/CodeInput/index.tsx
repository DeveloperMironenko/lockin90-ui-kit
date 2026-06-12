'use client';

import { useEffect, useRef } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';
import { cn } from '../../cn';

export interface CodeInputProps {
  /** Full code string (controlled), e.g. "1234". Cells render from this. */
  value: string;
  /** Emits the new full string, capped at `length`, digits only. */
  onChange: (next: string) => void;
  /** Number of single-character cells. Default 6. */
  length?: number;
  /** Focus the first cell on mount. */
  autoFocus?: boolean;
  disabled?: boolean;
  /** Renders the error/invalid styling (`lk-invalid`) on every cell. */
  invalid?: boolean;
}

const onlyDigits = (s: string) => s.replace(/\D/g, '');

/**
 * Aurora segmented OTP entry: `length` numeric cells with auto-advance,
 * backspace-to-clear-and-go-back, and full-code paste. Controlled via
 * `value` (the whole string) + `onChange` (the whole string).
 */
export default function CodeInput({
  value,
  onChange,
  length = 6,
  autoFocus,
  disabled,
  invalid,
}: CodeInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = onlyDigits(value).slice(0, length);
  const cells = Array.from({ length }, (_, i) => digits[i] ?? '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setAt = (index: number, char: string) => {
    const next = cells.slice();
    next[index] = char;
    onChange(next.join('').slice(0, length));
  };

  const handleInput = (index: number, raw: string) => {
    const d = onlyDigits(raw);
    if (!d) {
      setAt(index, '');
      return;
    }
    // Take the last typed digit so retyping over a filled cell works.
    setAt(index, d[d.length - 1]);
    if (index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (cells[index]) {
        setAt(index, '');
      } else if (index > 0) {
        e.preventDefault();
        setAt(index - 1, '');
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = onlyDigits(e.clipboardData.getData('text'));
    if (!pasted) return;
    e.preventDefault();
    const next = cells.slice();
    for (let i = 0; i < pasted.length && index + i < length; i += 1) {
      next[index + i] = pasted[i];
    }
    onChange(next.join('').slice(0, length));
    const focusAt = Math.min(index + pasted.length, length - 1);
    refs.current[focusAt]?.focus();
  };

  return (
    <div className={cn('lk-code')} role="group" aria-label="Verification code">
      {cells.map((char, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={cn('lk-input', 'lk-code-cell', invalid && 'lk-invalid')}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={char}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
        />
      ))}
    </div>
  );
}
