import { TextInput, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '@lockin90/tokens';

export interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  invalid?: boolean;
  secureTextEntry?: boolean;
  /** Keyboard variant (e.g. 'numeric' / 'number-pad' / 'decimal-pad' / 'email-address'). */
  keyboardType?: TextInputProps['keyboardType'];
  /** Semantic input mode (web parity; e.g. 'numeric' / 'decimal'). */
  inputMode?: TextInputProps['inputMode'];
  maxLength?: number;
  style?: StyleProp<TextStyle>;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  invalid,
  secureTextEntry,
  keyboardType,
  inputMode,
  maxLength,
  style,
}: InputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textFaint}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      inputMode={inputMode}
      maxLength={maxLength}
      style={[styles.input, invalid && styles.invalid, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
    fontFamily: fonts.ui,
    fontSize: fontSizes.base,
  } as ViewStyle & TextStyle,
  invalid: {
    borderColor: colors.bad,
  },
});
