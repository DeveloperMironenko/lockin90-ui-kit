import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

export function Divider({ strength = 'default' }: { strength?: 'default' | 'strong' }) {
  return <View style={{ height: 1, backgroundColor: strength === 'strong' ? colors.borderStrong : colors.border }} />;
}

export function OrDivider({ label = 'OR' }: { label?: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line:  { flex: 1, height: 1, backgroundColor: colors.border },
  label: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.4, color: colors.textMuted },
});
