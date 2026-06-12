import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, spacing } from '@lockin90/tokens';

export interface FormRowProps {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FormRow({ label, hint, error, children, style }: FormRowProps) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
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
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
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
