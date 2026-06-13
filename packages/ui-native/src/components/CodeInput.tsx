import { useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '@lockin90/tokens';

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
  /** Renders the error/invalid styling on every cell. */
  invalid?: boolean;
}

const onlyDigits = (s: string) => s.replace(/\D/g, '');

/**
 * Aurora segmented OTP entry: `length` numeric cells with auto-advance,
 * backspace-to-clear-and-go-back, and full-string paste (the OS paste lands in
 * one cell as the whole code; it is distributed across the cells). Controlled
 * via `value` (whole string) + `onChange` (whole string).
 */
export function CodeInput({
  value,
  onChange,
  length = 6,
  autoFocus,
  disabled,
  invalid,
}: CodeInputProps) {
  const refs = useRef<Array<TextInput | null>>([]);
  const digits = onlyDigits(value).slice(0, length);
  const cells = Array.from({ length }, (_, i) => digits[i] ?? '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const handleChange = (index: number, raw: string) => {
    const d = onlyDigits(raw);
    const next = cells.slice();
    if (d.length > 1) {
      // Full-string paste landed in one cell — distribute from here.
      for (let i = 0; i < d.length && index + i < length; i += 1) {
        next[index + i] = d[i];
      }
      onChange(next.join('').slice(0, length));
      const focusAt = Math.min(index + d.length, length - 1);
      refs.current[focusAt]?.focus();
      return;
    }
    if (!d) {
      next[index] = '';
      onChange(next.join('').slice(0, length));
      return;
    }
    next[index] = d[d.length - 1];
    onChange(next.join('').slice(0, length));
    if (index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !cells[index] && index > 0) {
      const next = cells.slice();
      next[index - 1] = '';
      onChange(next.join('').slice(0, length));
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {cells.map((char, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={char}
          editable={!disabled}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          accessibilityLabel={`Digit ${i + 1}`}
          placeholderTextColor={colors.textFaint}
          onChangeText={(t) => handleChange(i, t)}
          onKeyPress={(e) => handleKeyPress(i, e)}
          style={[styles.cell, invalid && styles.invalid, disabled && styles.disabled]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  cell: {
    width: 44,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: fontSizes.lg,
    textAlign: 'center',
  } as ViewStyle & TextStyle,
  invalid: {
    borderColor: colors.bad,
  },
  disabled: {
    opacity: 0.55,
  },
});
