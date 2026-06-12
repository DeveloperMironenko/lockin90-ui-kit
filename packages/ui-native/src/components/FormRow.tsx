import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, spacing } from '@lockin90/tokens';

export interface FormRowProps {
  label?: string;
  /** Marks the field required — renders a `*` marker after the label. */
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FormRow({ label, required, hint, error, children, style }: FormRowProps) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required ? <Text style={styles.required}>*</Text> : null}
        </View>
      ) : null}
      {children}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  labelRow: { flexDirection: 'row', alignItems: 'flex-start' },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  // small star hugging the top-right corner of the label
  required: { color: colors.accent, fontSize: 9, marginLeft: 2, marginTop: -1 },
  error: {
    fontFamily: fonts.ui,
    fontSize: 12,
    color: colors.bad,
  },
  hint: {
    fontFamily: fonts.ui,
    fontSize: 12,
    color: colors.textFaint,
  },
});
