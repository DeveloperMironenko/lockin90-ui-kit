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

/** The boxes at another `length`: each keeps its place (a gap stays a gap), the extra ones dropped. */
export function resizeBoxes(boxes: readonly string[], length: number): string[] {
  return Array.from({ length }, (_, i) => boxes[i] ?? '');
}

/** The boxes for a code string: one digit each, non-digits dropped, padded with '' to `length`. */
export function codeToBoxes(value: string, length: number): string[] {
  return resizeBoxes(value.replace(/\D/g, '').split(''), length);
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

/** What a box's new text does (its digit is always selected, so typing replaces it): one digit fills
 *  the box; more digits (paste, autofill) spread; no digit at all (a letter) is ignored (`null`);
 *  empty clears the box. Focus moves on after a written digit. */
export function typeIntoBox(
  boxes: readonly string[],
  index: number,
  raw: string,
): { boxes: string[]; focusIndex: number } | null {
  const digits = raw.replace(/\D/g, '');
  if (raw && !digits) return null;
  if (digits.length > 1) return spreadDigits(boxes, index, raw);
  const next = boxes.slice();
  next[index] = digits;
  return { boxes: next, focusIndex: digits ? Math.min(index + 1, next.length - 1) : index };
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
  // back what `onChange` gave it doesn't (it would close up a gap the user left). Another `length`
  // re-draws the boxes, each digit in its place; a `value` changed with it wins.
  const [prev, setPrev] = useState({ value, length });
  if (value !== prev.value || length !== prev.length) {
    setPrev({ value, length });
    if (value !== prev.value && value !== boxes.join('')) setBoxes(codeToBoxes(value, length));
    else if (length !== prev.length) setBoxes(resizeBoxes(boxes, length));
  }
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  // Whether the box under the mouse already had focus: only then does a click need re-selecting.
  const hadFocus = useRef(false);

  const commit = (next: string[]) => {
    setBoxes(next);
    onChange?.(next.join(''));
  };

  // Focus a box with its digit selected, so the next key replaces it. After the re-render: setting the
  // value moves the caret to the end.
  const focusBox = (index: number) => {
    const box = refs.current[Math.max(0, Math.min(length - 1, index))];
    box?.focus();
    // Only if the user is still there (fast typing may have moved on).
    requestAnimationFrame(() => {
      if (box && document.activeElement === box) box.select();
    });
  };

  // Typing replaces the box's digit (its text is selected on focus); box 0 also takes a whole
  // autofilled code (`one-time-code`), spread like a paste.
  const onBoxChange = (index: number, raw: string) => {
    const typed = typeIntoBox(boxes, index, raw);
    if (!typed) return; // a letter: ignored
    commit(typed.boxes);
    focusBox(typed.focusIndex);
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
          // A click on a box that already had focus would put the caret beside the digit: keep it selected.
          onMouseDown={(e) => {
            hadFocus.current = document.activeElement === e.currentTarget;
          }}
          onMouseUp={(e) => {
            if (!hadFocus.current) return;
            e.preventDefault();
            e.currentTarget.select();
          }}
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
