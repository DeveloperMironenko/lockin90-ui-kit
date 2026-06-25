import { useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cn } from '../cn';

/* ============================================================================
   TagInput — CMS-style multi-value tag entry. A glassy field shell holds the
   current tags as small removable pills followed by a borderless text input.
   Enter adds the typed value; Backspace on the empty input removes the last tag.
   ========================================================================== */

export interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** current tags (seeds internal state) */
  tags?: string[];
  /** called with the full tag list whenever it changes */
  onChange?: (tags: string[]) => void;
  /** placeholder for the text input */
  placeholder?: string;
  /** error state — red border + glow (e.g. a duplicate / invalid tag) */
  invalid?: boolean;
}

/** Cross/× glyph used to remove a tag. */
function RemoveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/** Multi-value tag entry — removable mono pills + borderless input. */
export function TagInput({
  tags: tagsProp = ['sleep', 'recovery'],
  onChange,
  placeholder = 'Add a tag…',
  invalid = false,
  className,
  ...rest
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(tagsProp);
  const [draft, setDraft] = useState('');

  const commit = (next: string[]) => {
    setTags(next);
    onChange?.(next);
  };

  const addTag = (raw: string) => {
    const value = raw.trim();
    if (!value || tags.includes(value)) {
      setDraft('');
      return;
    }
    commit([...tags, value]);
    setDraft('');
  };

  const removeAt = (index: number) => {
    commit(tags.filter((_, i) => i !== index));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      e.preventDefault();
      removeAt(tags.length - 1);
    }
  };

  return (
    <div
      className={cn('lk-taginput', invalid && 'lk-taginput--invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    >
      {tags.map((tag, i) => (
        <span key={`${tag}-${i}`} className="lk-taginput-tag">
          {tag}
          <button
            type="button"
            className="lk-taginput-x"
            aria-label={`Remove ${tag}`}
            onClick={() => removeAt(i)}
          >
            <RemoveIcon />
          </button>
        </span>
      ))}
      <input
        className="lk-taginput-input"
        value={draft}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

/* ============================================================================
   CodeInput — segmented OTP / verification-code entry. A row of single-char
   boxes (mono, centered). Typing advances focus; Backspace moves back; paste
   fills across boxes. Focused box gets accent border + glow; filled box a tint.
   ========================================================================== */

export interface CodeInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** number of code boxes */
  length?: number;
  /** controlled code value */
  value?: string;
  /** called with the joined code whenever it changes */
  onChange?: (code: string) => void;
  /** error state — red boxes (e.g. an incorrect / expired code) */
  invalid?: boolean;
}

/** Segmented N-digit verification code — auto-advance, backspace, paste. */
export function CodeInput({
  length = 6,
  value = '',
  onChange,
  invalid = false,
  className,
  ...rest
}: CodeInputProps) {
  const [code, setCode] = useState<string>(value.slice(0, length));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const chars = Array.from({ length }, (_, i) => code[i] ?? '');

  const commit = (next: string) => {
    const clamped = next.slice(0, length);
    setCode(clamped);
    onChange?.(clamped);
  };

  const focusBox = (index: number) => {
    refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  const onBoxChange = (index: number, raw: string) => {
    const ch = raw.slice(-1);
    const next = chars.slice();
    next[index] = ch;
    commit(next.join(''));
    if (ch) focusBox(index + 1);
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (chars[index]) {
        const next = chars.slice();
        next[index] = '';
        commit(next.join(''));
      } else if (index > 0) {
        e.preventDefault();
        const next = chars.slice();
        next[index - 1] = '';
        commit(next.join(''));
        focusBox(index - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  const onPaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\s/g, '');
    if (!pasted) return;
    const next = chars.slice();
    for (let i = 0; i < pasted.length && index + i < length; i++) {
      next[index + i] = pasted[i];
    }
    commit(next.join(''));
    focusBox(Math.min(index + pasted.length, length - 1));
  };

  return (
    <div
      className={cn('lk-code', invalid && 'lk-code--invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    >
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={cn('lk-code-box', ch && 'lk-code-filled')}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={ch}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => onBoxChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={(e) => onPaste(i, e)}
        />
      ))}
    </div>
  );
}
