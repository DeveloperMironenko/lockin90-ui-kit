import { useState, type ReactNode } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, type TextInputProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Icon } from './Icon';

export interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  /** small mono uppercase label rendered above the field */
  label?: string;
  /** red border to signal an invalid value */
  invalid?: boolean;
  /** field density */
  inputSize?: 'sm' | 'md';
  /** optional leading icon inside the field shell */
  leading?: ReactNode;
  /** start with the password revealed @default false */
  defaultVisible?: boolean;
  /** accessibility label for the show/hide toggle
   *  (default "Show password" / "Hide password") */
  toggleLabel?: string;
}

/**
 * PasswordInput — a password TextInput with a built-in show/hide eye toggle.
 * Mirrors `Input` (same `label` / `leading` / `invalid` / `inputSize` + glass
 * shell); `secureTextEntry` is owned internally and flipped by the eye button.
 */
export function PasswordInput({
  label,
  invalid = false,
  inputSize = 'md',
  leading,
  defaultVisible = false,
  toggleLabel,
  style,
  onFocus,
  onBlur,
  ...rest
}: PasswordInputProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(defaultVisible);
  const sm = inputSize === 'sm';
  const borderColor = invalid ? colors.zoneLow : focused ? colors.accent : colors.border2;
  const aria = toggleLabel ?? (visible ? 'Hide password' : 'Show password');

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label.toUpperCase()}</Text> : null}
      <View style={[styles.field, sm && styles.fieldSm, { borderColor }]}>
        {leading ? <View style={styles.lead}>{leading}</View> : null}
        <TextInput
          style={[styles.input, sm && styles.inputSm, style]}
          placeholderTextColor={colors.textFaint}
          secureTextEntry={!visible}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={aria}
          hitSlop={8}
          onPress={() => setVisible((v) => !v)}
          style={styles.trail}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} size={18} color={colors.textFaint} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, minWidth: 0 },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    borderWidth: 1,
    backgroundColor: colors.glass2,
  },
  fieldSm: { paddingVertical: 6, paddingHorizontal: 10 },
  lead: { flexShrink: 0 },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.text,
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 20,
  },
  inputSm: { fontSize: 12.5 },
  trail: { flexShrink: 0 },
});
