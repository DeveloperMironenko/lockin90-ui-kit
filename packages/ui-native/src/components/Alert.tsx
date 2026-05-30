import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors, fonts, radius } from '@lockin90/tokens';

type AlertVariant = 'error' | 'success' | 'info';

const VARIANT: Record<AlertVariant, { bg: string; border: string; fg: string }> = {
  error:   { bg: 'rgba(255,31,31,0.08)', border: 'rgba(255,31,31,0.3)', fg: colors.accent },
  success: { bg: 'rgba(255,255,255,0.05)', border: colors.borderStrong, fg: colors.textPrimary },
  info:    { bg: colors.bgElevated, border: colors.border, fg: colors.textSecondary },
};

export function Alert({ variant, children, style }: { variant: AlertVariant; children: React.ReactNode; style?: ViewStyle }) {
  const v = VARIANT[variant];
  return (
    <View style={[styles.alert, { backgroundColor: v.bg, borderColor: v.border }, style]}>
      <Text style={[styles.text, { color: v.fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: { paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderRadius: radius.sm },
  text:  { fontFamily: fonts.mono, fontSize: 11 },
});
