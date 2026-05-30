import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '@lockin90/tokens';
import { Eyebrow } from './Typography';

interface EmptyStateProps {
  icon?: React.ReactNode;
  eyebrow?: string;
  heading: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, eyebrow, heading, description, action }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      {icon && <View style={styles.iconBox}>{icon}</View>}
      <View style={styles.center}>
        {eyebrow && <Eyebrow style={{ marginBottom: 6 }}>{eyebrow}</Eyebrow>}
        <Text style={styles.heading}>{heading}</Text>
        <View style={styles.slash} />
        {description && <Text style={styles.desc}>{description}</Text>}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 60, paddingHorizontal: 24, alignItems: 'center', gap: 16 },
  iconBox: {
    width: 64, height: 64, borderRadius: radius.sm,
    backgroundColor: colors.bgElevated,
    borderWidth: 1, borderColor: colors.borderStrong, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  center: { alignItems: 'center' },
  heading: { fontFamily: fonts.displayItalic, fontSize: 24, color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: -0.5 },
  slash: { width: 80, height: 2, backgroundColor: colors.accent, marginVertical: 6, transform: [{ rotate: '-8deg' }] },
  desc: { fontFamily: fonts.ui, fontSize: 13, color: colors.textSecondary, marginTop: 12, textAlign: 'center' },
});
