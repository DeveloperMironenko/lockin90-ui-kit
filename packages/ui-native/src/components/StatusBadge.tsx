import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@p90/tokens';

export type StatusTone = 'green' | 'amber' | 'red' | 'neutral' | 'info';

const TONE: Record<StatusTone, string> = {
  green: colors.statusGreen,
  amber: colors.statusAmber,
  red: colors.statusRed,
  neutral: colors.textSecondary,
  info: colors.textPrimary,
};

export function StatusBadge({ tone, dot = true, children }: { tone: StatusTone; dot?: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      {dot && <View style={[styles.dot, { backgroundColor: TONE[tone] }]} />}
      <Text style={[styles.text, { color: TONE[tone] }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
});
