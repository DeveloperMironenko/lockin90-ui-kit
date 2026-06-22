import { useRef, useState } from 'react';
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
    <View style={[styles.taginput, style]} {...rest}>
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

export interface CodeInputProps extends ViewProps {
  /** number of code boxes */
  length?: number;
  /** controlled code value */
  value?: string;
  /** called with the joined code whenever it changes */
  onChange?: (code: string) => void;
}

/** Segmented N-digit verification code — auto-advance + backspace. */
export function CodeInput({ length = 6, value = '', onChange, style, ...rest }: CodeInputProps) {
  const [code, setCode] = useState<string>(value.slice(0, length));
  const [focused, setFocused] = useState<number | null>(null);
  const refs = useRef<Array<TextInput | null>>([]);

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
    // Paste or iOS SMS autofill can deliver the whole code into one box — spread
    // it across the remaining boxes from here (mirrors the web `onPaste`).
    const digits = raw.replace(/\s/g, '');
    if (digits.length > 1) {
      const next = chars.slice();
      for (let i = 0; i < digits.length && index + i < length; i++) {
        next[index + i] = digits[i];
      }
      commit(next.join(''));
      focusBox(Math.min(index + digits.length, length - 1));
      return;
    }
    const ch = digits.slice(-1);
    const next = chars.slice();
    next[index] = ch;
    commit(next.join(''));
    if (ch) focusBox(index + 1);
  };

  const onKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key !== 'Backspace') return;
    if (chars[index]) {
      const next = chars.slice();
      next[index] = '';
      commit(next.join(''));
    } else if (index > 0) {
      const next = chars.slice();
      next[index - 1] = '';
      commit(next.join(''));
      focusBox(index - 1);
    }
  };

  return (
    <View style={[styles.code, style]} {...rest}>
      {chars.map((ch, i) => {
        const filled = !!ch;
        const isFocused = focused === i;
        const borderColor = isFocused
          ? colors.accent
          : filled
            ? 'rgba(34,211,238,0.45)'
            : colors.border2;
        const backgroundColor = isFocused
          ? 'rgba(124,92,255,0.06)'
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
            accessibilityLabel={`Digit ${i + 1}`}
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
}

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
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
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
  code: {
    flexDirection: 'row',
    gap: 10,
  },
  codeBox: {
    width: 44,
    height: 52,
    textAlign: 'center',
    fontFamily: fonts.mono,
    fontWeight: '700',
    fontSize: 22,
    color: colors.text,
    borderWidth: 1,
    borderRadius: radii.sm,
    padding: 0,
  },
});
