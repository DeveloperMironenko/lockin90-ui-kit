import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
  type ViewProps,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/* ============================================================================
   TagInput — CMS-style multi-value tag entry. A glassy field shell flex-wraps
   the current tags as small removable mono pills, followed by a borderless
   TextInput. onSubmitEditing adds the typed value; Backspace on the empty
   input removes the last tag. Mirrors the web `@lockin90/ui` TagInput.
   ========================================================================== */

export interface TagInputProps extends ViewProps {
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
function RemoveIcon({ color }: { color: string }) {
  return (
    <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

/** Multi-value tag entry — removable mono pills + borderless input. */
export function TagInput({
  tags: tagsProp = ['sleep', 'recovery'],
  onChange,
  placeholder = 'Add a tag…',
  invalid = false,
  style,
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

  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && draft === '' && tags.length > 0) {
      removeAt(tags.length - 1);
    }
  };

  return (
    <View style={[styles.taginput, invalid && styles.taginputInvalid, style]} {...rest}>
      {tags.map((tag, i) => (
        <View key={`${tag}-${i}`} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${tag}`}
            onPress={() => removeAt(i)}
            style={styles.tagX}
            hitSlop={6}
          >
            <RemoveIcon color={colors.accent2} />
          </Pressable>
        </View>
      ))}
      <TextInput
        style={styles.input}
        value={draft}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        accessibilityLabel={placeholder}
        onChangeText={setDraft}
        onSubmitEditing={() => addTag(draft)}
        onKeyPress={onKeyPress}
        blurOnSubmit={false}
        returnKeyType="done"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

/* ============================================================================
   CodeInput — segmented OTP / verification-code entry. A row of single-char
   boxes (mono, centered). Typing advances focus; Backspace moves back. Focused
   box gets an accent border; a filled box gets a cyan tint. Mirrors the web
   `@lockin90/ui` CodeInput.
   ========================================================================== */

/** A CodeInput's ref: `focus()` puts the caret in the first empty box (the last when all are filled),
 *  so Return in the field before it can move into the code. */
export interface CodeInputHandle {
  focus(): void;
}

export interface CodeInputProps extends ViewProps {
  /** number of code boxes */
  length?: number;
  /** controlled code value */
  value?: string;
  /** called with the joined code whenever it changes */
  onChange?: (code: string) => void;
  /** error state — red border + tint (e.g. wrong code) */
  error?: boolean;
  /** Web-parity alias of `error` — the web `CodeInput` names this `invalid`, so
   *  the same prop works on both platforms. Either prop turns the boxes red. */
  invalid?: boolean;
  /** each box's a11y label, `position` from 1 — pass a translated one (the default is English, for stories).
   *  Box 0 also takes a pasted / autofilled whole code but keeps `digitLabel(1, length)`. */
  digitLabel?: (position: number, length: number) => string;
}

const defaultDigitLabel = (position: number, length: number) => `Digit ${position} of ${length}`;

/** The boxes for a code string: one digit each, non-digits dropped, padded with '' to `length`. */
export function codeToBoxes(value: string, length: number): string[] {
  const digits = value.replace(/\D/g, '');
  return Array.from({ length }, (_, i) => digits[i] ?? '');
}

/** Spread a multi-char entry (paste / iOS SMS autofill delivered into one box) across the boxes from
 *  `index` on: digits only, the ones past the last box dropped, earlier boxes kept. Focus lands after
 *  the last digit written (clamped). (Pure, so the paste math is unit-testable; mirrors the web.) */
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
  if (digits.length > 1) return spreadDigits(boxes, index, digits);
  const next = boxes.slice();
  next[index] = digits;
  return { boxes: next, focusIndex: digits ? Math.min(index + 1, next.length - 1) : index };
}

/** The boxes at another `length`: each keeps its place (a gap stays a gap), the extra ones dropped. */
export function resizeBoxes(boxes: readonly string[], length: number): string[] {
  return Array.from({ length }, (_, i) => boxes[i] ?? '');
}

/** Segmented N-digit verification code — auto-advance + backspace + paste / autofill into box 0. */
export const CodeInput = forwardRef<CodeInputHandle, CodeInputProps>(function CodeInput(
  {
    length = 6,
    value = '',
    onChange,
    error = false,
    invalid = false,
    digitLabel = defaultDigitLabel,
    style,
    ...rest
  },
  ref,
) {
  const isInvalid = invalid || error;
  // One entry per box, so clearing a middle box leaves a gap instead of shifting later digits.
  const [boxes, setBoxes] = useState<string[]>(() => codeToBoxes(value, length));
  // A new `value` from the app (e.g. cleared after a wrong code) replaces what's shown; the app echoing
  // back what `onChange` gave it doesn't (it would close up a gap the user left).
  // Another `length` (another kind of code) re-draws the boxes, each digit in its place; an app that
  // changes it passes the matching `value` too, which wins.
  const [prev, setPrev] = useState({ value, length });
  if (value !== prev.value || length !== prev.length) {
    setPrev({ value, length });
    if (value !== prev.value && value !== boxes.join('')) setBoxes(codeToBoxes(value, length));
    else if (length !== prev.length) setBoxes(resizeBoxes(boxes, length));
  }
  const [focused, setFocused] = useState<number | null>(null);
  const refs = useRef<Array<TextInput | null>>([]);

  const commit = (next: string[]) => {
    setBoxes(next);
    onChange?.(next.join(''));
  };

  const focusBox = (index: number) => {
    refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        const empty = boxes.findIndex((b) => !b);
        focusBox(empty === -1 ? length - 1 : empty);
      },
    }),
    [boxes, length],
  );

  const onBoxChange = (index: number, raw: string) => {
    const typed = typeIntoBox(boxes, index, raw);
    // A letter: re-render, so the native field drops it and shows the box's digit again.
    if (!typed) return setBoxes((current) => current.slice());
    commit(typed.boxes);
    if (typed.focusIndex !== index) focusBox(typed.focusIndex);
  };

  const onKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key !== 'Backspace') return;
    if (boxes[index]) {
      const next = boxes.slice();
      next[index] = '';
      commit(next);
    } else if (index > 0) {
      const next = boxes.slice();
      next[index - 1] = '';
      commit(next);
      focusBox(index - 1);
    }
  };

  return (
    <View style={[styles.code, style]} {...rest}>
      {boxes.map((ch, i) => {
        const filled = !!ch;
        const isFocused = focused === i;
        const borderColor = isFocused
          ? colors.accent
          : isInvalid
            ? colors.zoneLow
            : filled
              ? 'rgba(34,211,238,0.45)'
              : colors.borderControl;
        const backgroundColor = isFocused
          ? 'rgba(124,92,255,0.06)'
          : isInvalid
            ? 'rgba(255,77,109,0.06)'
            : filled
              ? 'rgba(34,211,238,0.05)'
              : colors.glass2;
        return (
          <TextInput
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={[styles.codeBox, { borderColor, backgroundColor }]}
            keyboardType="number-pad"
            textContentType={i === 0 ? 'oneTimeCode' : 'none'}
            // box 0 accepts the full code so paste / iOS SMS autofill lands and
            // spreads across boxes; the rest stay single-char for clean typing.
            maxLength={i === 0 ? length : 1}
            value={ch}
            // The digit stays selected, so typing replaces it (also after a tap on a focused box).
            selectTextOnFocus
            selection={{ start: 0, end: ch.length }}
            accessibilityLabel={digitLabel(i + 1, length)}
            selectionColor={colors.accent}
            onChangeText={(t) => onBoxChange(i, t)}
            onKeyPress={(e) => onKeyPress(i, e)}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused((cur) => (cur === i ? null : cur))}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  /* ---- TagInput ---- */
  taginput: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 7,
    padding: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    // a field's edge at 3:1 on the card (CONVENTIONS "Accessibility")
    borderColor: colors.borderControl,
    backgroundColor: colors.glass2,
  },
  // invalid: red border + soft red glow standing in for the web's 3px ring
  // (`.lk-taginput--invalid`: border var(--bad) + 0 0 0 3px rgba(255,77,109,.16))
  taginputInvalid: {
    borderColor: colors.zoneLow,
    shadowColor: colors.zoneLow,
    shadowOpacity: 0.16,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 9,
    paddingRight: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.3)',
    backgroundColor: 'rgba(34,211,238,0.1)',
  },
  tagText: {
    color: colors.accent2,
    fontFamily: fonts.mono,
    fontSize: 10.5,
    lineHeight: 15,
  },
  tagX: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 90,
    paddingVertical: 3,
    paddingHorizontal: 2,
    color: colors.text,
    fontFamily: fonts.ui,
    fontSize: 12,
  },
  /* ---- CodeInput ---- */
  // fluid boxes (mobile design .code-row / .code-box): they share the row, so an 8-digit code fits a phone.
  // gap 6 (the design's 7, as web at ≤ 540px): 8 × 28 + 7 × 6 = 266 fits a 272pt row on the smallest phones;
  // maxWidth 60 (as web above 540px) keeps them boxes on a tablet or in landscape
  code: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  codeBox: {
    flex: 1,
    minWidth: 28,
    maxWidth: 60,
    aspectRatio: 1 / 1.18,
    textAlign: 'center',
    // vertical-center the digit: textAlignVertical (Android) + includeFontPadding:false
    // (drops Android's extra font padding that pushes the glyph up).
    textAlignVertical: 'center',
    includeFontPadding: false,
    fontFamily: fonts.mono,
    fontWeight: '700',
    fontSize: 20, // as the web at phone width (≤ 540px): mobile auth screens match it
    color: colors.text,
    borderWidth: 1,
    borderRadius: radii.sm,
    padding: 0,
  },
});
