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
  /**
   * `'default'` (default) is the standard left-aligned UI-font field.
   * `'numeral'` is the design's large-readout variant (edit-set weight/reps,
   * design `.strow .sv`): 20px bold display-font, centered, tabular-nums,
   * with the field + its `unit` suffix hugging the value as one centered
   * group instead of the unit pinning to the field's far edge.
   */
  variant?: 'default' | 'numeral';
}

/** Dark glassy text input — mono label, faint unit suffix, accent focus border. */
export function Input({
  label,
  unit,
  invalid = false,
  inputSize = 'md',
  leading,
  variant = 'default',
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const sm = inputSize === 'sm';
  const numeral = variant === 'numeral';

  const borderColor = invalid ? colors.zoneLow : focused ? colors.accent : colors.border2;

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label.toUpperCase()}</Text> : null}
      <View style={[styles.field, sm && styles.fieldSm, numeral && styles.fieldNumeral, { borderColor }]}>
        {leading ? <View style={styles.lead}>{leading}</View> : null}
        <TextInput
          style={[styles.input, sm && styles.inputSm, numeral && styles.inputNumeral, style]}
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
        {unit ? (
          <Text style={[styles.unit, sm && styles.unitSm, numeral && styles.unitNumeral]}>{unit}</Text>
        ) : null}
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
  // design `.strow .sv` — glass-2 fill (already the field default), border-2
  // (already default), 9px radius, roomier centered padding.
  fieldNumeral: { justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 9 },
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
  // design `.strow .sv` — 20px bold display-font numeral, centered, tabular.
  // Content-hugging (not flex:1) so it groups tightly with the unit suffix
  // instead of stretching to the field's full width.
  inputNumeral: {
    flex: 0,
    minWidth: 20,
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  unit: { flexShrink: 0, fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint },
  unitSm: { fontSize: 10 },
  // design `.strow .sv small` — dim, sits right after the numeral
  unitNumeral: { fontFamily: fonts.ui, fontSize: 11, fontWeight: '400', color: colors.textDim, marginLeft: 1 },
});
