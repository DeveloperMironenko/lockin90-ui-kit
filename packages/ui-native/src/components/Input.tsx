import { useState, type ReactNode } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface InputProps extends TextInputProps {
  /** small mono uppercase label rendered above the field */
  label?: string;
  /** faint suffix inside the field, right side (e.g. "kg") */
  unit?: string;
  /** red border to signal an invalid value */
  invalid?: boolean;
  /** field density */
  inputSize?: 'sm' | 'md';
  /** optional leading icon inside the field shell */
  leading?: ReactNode;
}

/** Dark glassy text input — mono label, faint unit suffix, accent focus border. */
export function Input({
  label,
  unit,
  invalid = false,
  inputSize = 'md',
  leading,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const sm = inputSize === 'sm';

  const borderColor = invalid ? colors.zoneLow : focused ? colors.accent : colors.border2;

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label.toUpperCase()}</Text> : null}
      <View style={[styles.field, sm && styles.fieldSm, { borderColor }]}>
        {leading ? <View style={styles.lead}>{leading}</View> : null}
        <TextInput
          style={[styles.input, sm && styles.inputSm, style]}
          placeholderTextColor={colors.textFaint}
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
        {unit ? <Text style={[styles.unit, sm && styles.unitSm]}>{unit}</Text> : null}
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
    // Center the value/placeholder: drop the explicit lineHeight (it top/bottom-biases
    // the glyph in a single-line TextInput) + Android font-padding/vertical-align props.
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  inputSm: { fontSize: 12.5 },
  unit: { flexShrink: 0, fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint },
  unitSm: { fontSize: 10 },
});
