import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type ComponentRef,
  type ReactNode,
} from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, type TextInputProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { useContrastColors } from '../internal/useHighContrast';

/** The field's ref: the TextInput instance (`ComponentRef`, so the type has `focus()` on RN 0.81 and 0.88).
 *  Exported so the emitted types keep the `ComponentRef` form instead of the kit's RN version's class. */
export type TextInputRef = ComponentRef<typeof TextInput>;

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
// annotated, so the emitted .d.ts keeps `TextInputRef` (TS would print the kit's RN 0.81 `TextInput` class)
export const Input: ForwardRefExoticComponent<InputProps & RefAttributes<TextInputRef>> = forwardRef<
  TextInputRef,
  InputProps
>(function Input(
  {
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
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInputRef>(null);
  // the app's ref is the TextInput itself (focus the next field on Return)
  useImperativeHandle(ref, () => inputRef.current as TextInputRef, []);
  const sm = inputSize === 'sm';
  const numeral = variant === 'numeral';

  // Increase Contrast steps the edge, placeholder and label up (CONVENTIONS "Accessibility")
  const c = useContrastColors();
  const borderColor = invalid ? colors.zoneLow : focused ? colors.accent : c.borderControl;

  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: c.textDim }]}>{label.toUpperCase()}</Text> : null}
      {/* a tap on the padding, the icon or the unit focuses the field (the whole box is its target) */}
      <Pressable
        accessible={false}
        onPress={() => inputRef.current?.focus()}
        style={[styles.field, sm && styles.fieldSm, numeral && styles.fieldNumeral, { borderColor }]}
      >
        {leading ? <View style={styles.lead}>{leading}</View> : null}
        <TextInput
          ref={inputRef}
          style={[styles.input, sm && styles.inputSm, numeral && styles.inputNumeral, style]}
          placeholderTextColor={c.textFaint}
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
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 6, minWidth: 0 },
  // the same caption as FormField's label (11px / 500, text-dim, line height 17), as the web shows
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '500',
    letterSpacing: 1.32,
    color: colors.textDim,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    minHeight: 44, // a 44pt target, as the web field at phone width (CONVENTIONS "Accessibility")
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    borderWidth: 1,
    backgroundColor: colors.field,
  },
  // the web box: 9 + 14 × 1.4 + 9 + 2 borders = 39.6 (sm: 6 + 12.5 × 1.4 + 6 + 2 = 31.5)
  fieldSm: { minHeight: 44, paddingVertical: 5, paddingHorizontal: 10 },
  // design `.strow .sv` — glass-2 fill (already the field default), border-2
  // (already default), 9px radius, roomier centered padding.
  fieldNumeral: { minHeight: 44, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 9 },
  lead: { flexShrink: 0 },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.text,
    fontFamily: fonts.ui,
    // 16, as the web field (no iOS zoom there); the box keeps its 39.6 height
    fontSize: 16,
    // Center the value/placeholder: drop the explicit lineHeight (it top/bottom-biases
    // the glyph in a single-line TextInput) + Android font-padding/vertical-align props.
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  inputSm: { fontSize: 16 },
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
  unitSm: { fontSize: 11 },
  // design `.strow .sv small` — dim, sits right after the numeral
  unitNumeral: { fontFamily: fonts.ui, fontSize: 11, fontWeight: '400', color: colors.textDim, marginLeft: 1 },
});
