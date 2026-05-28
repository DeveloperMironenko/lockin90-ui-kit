import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@p90/tokens';
import { Eyebrow } from './Typography';

export function FormRow({ label, last = false, danger = false, children }: { label: string; last?: boolean; danger?: boolean; children?: React.ReactNode }) {
  return (
    <View style={[styles.row, !last && styles.divider]}>
      <Text style={[styles.label, { color: danger ? colors.accent : colors.textSecondary, marginBottom: children ? 6 : 0 }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

export function FormSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View>
      {title && <View style={styles.titleWrap}><Eyebrow>{title}</Eyebrow></View>}
      <View style={styles.topBorder}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 16 },
  divider: { borderBottomWidth: 1, borderColor: colors.border },
  label: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  titleWrap: { marginBottom: 10 },
  topBorder: { borderTopWidth: 1, borderColor: colors.border },
});
