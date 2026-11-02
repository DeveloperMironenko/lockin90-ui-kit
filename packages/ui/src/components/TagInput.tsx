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
  /** each box's a11y label, `position` from 1 — pass a translated one (the default is English, for stories) */
  digitLabel?: (position: number, length: number) => string;
}

const defaultDigitLabel = (position: number, length: number) => `Digit ${position} of ${length}`;

/** The boxes for a code string: one digit each, non-digits dropped, padded with '' to `length`. */
export function codeToBoxes(value: string, length: number): string[] {
  const digits = value.replace(/\D/g, '');
  return Array.from({ length }, (_, i) => digits[i] ?? '');
}

/** Spread typed / pasted / autofilled text across the boxes from `index` on: digits only, the ones past
 *  the last box dropped, earlier boxes kept. Focus goes after the last digit written (clamped). */
export function spreadDigits(
  boxes: readonly string[],
  index: number,
  text: string,
): { boxes: string[]; focusIndex: number } {
  const digits = text.replace(/\D/g, '');
  const next = boxes.slice();
  for (let i = 0; i < digits.length && index + i < next.length; i++) next[index + i] = digits[i];
  return { boxes: next, focusIndex: Math.min(index + digits.length, next.length - 1) };
}

/** Segmented N-digit verification code — auto-advance, backspace, paste, one-time-code autofill. */
export function CodeInput({
  length = 6,
  value = '',
  onChange,
  invalid = false,
  digitLabel = defaultDigitLabel,
  className,
  ...rest
}: CodeInputProps) {
  // One entry per box, so clearing a middle box leaves a gap instead of shifting later digits.
  const [boxes, setBoxes] = useState<string[]>(() => codeToBoxes(value, length));
  // A new `value` from the app (e.g. cleared after a wrong code) replaces what's shown; the app echoing
  // back what `onChange` gave it doesn't (it would close up a gap the user left).
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== boxes.join('')) setBoxes(codeToBoxes(value, length));
  }
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const commit = (next: string[]) => {
    setBoxes(next);
    onChange?.(next.join(''));
  };

  const focusBox = (index: number) => {
    refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  // Typing replaces the box's digit (its text is selected on focus); box 0 also takes a whole
  // autofilled code (`one-time-code`), spread like a paste.
  const onBoxChange = (index: number, raw: string) => {
    if (raw.replace(/\D/g, '').length > 1) {
      const spread = spreadDigits(boxes, index, raw);
      commit(spread.boxes);
      focusBox(spread.focusIndex);
      return;
    }
    const ch = raw.replace(/\D/g, '');
    if (raw && !ch) return; // a letter: ignored
    const next = boxes.slice();
    next[index] = ch;
    commit(next);
    if (ch) focusBox(index + 1);
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (boxes[index]) {
        e.preventDefault();
        const next = boxes.slice();
        next[index] = '';
        commit(next);
      } else if (index > 0) {
        e.preventDefault();
        const next = boxes.slice();
        next[index - 1] = '';
        commit(next);
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
    const spread = spreadDigits(boxes, index, e.clipboardData.getData('text'));
    commit(spread.boxes);
    focusBox(spread.focusIndex);
  };

  return (
    // A group, so the aria-label / aria-labelledby an app passes names the code ("Reset code").
    <div role="group" className={cn('lk-code', invalid && 'lk-code--invalid', className)} {...rest}>
      {boxes.map((ch, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={cn('lk-code-box', ch && 'lk-code-filled')}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={i === 0 ? length : 1}
          value={ch}
          onFocus={(e) => e.target.select()}
          aria-label={digitLabel(i + 1, length)}
          // On every box: a role-less wrapper's aria-invalid isn't announced.
          aria-invalid={invalid || undefined}
          onChange={(e) => onBoxChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={(e) => onPaste(i, e)}
        />
      ))}
    </div>
  );
}
