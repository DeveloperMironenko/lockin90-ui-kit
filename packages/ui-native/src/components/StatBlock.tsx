import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

interface StatBlockProps {
  label: string;
  value: string | number;
  unit?: string;
}

export function StatBlock({ label, value, unit }: StatBlockProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block:    { flex: 1, backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 12 },
  label:    { fontFamily: fonts.displayBold, fontSize: 10, letterSpacing: 1.8, color: colors.textSecondary, textTransform: 'uppercase' },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  value:    { fontFamily: fonts.displayItalic, fontSize: 30, color: colors.textPrimary, lineHeight: 30 },
  unit:     { fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, marginLeft: 4, marginBottom: 4 },
});
