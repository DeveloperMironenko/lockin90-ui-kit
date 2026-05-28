import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@p90/tokens';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  slashWidth?: number;
}

export function PageHeader({ eyebrow, title, slashWidth = 60 }: PageHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.slash, { width: slashWidth }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:    { marginBottom: 24 },
  eyebrow: { fontFamily: fonts.displayBold, fontSize: 11, letterSpacing: 1.8, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 4 },
  title:   { fontFamily: fonts.displayItalic, fontSize: 28, color: colors.textPrimary, textTransform: 'uppercase' },
  slash:   { marginTop: 8, height: 2, backgroundColor: colors.accent, transform: [{ rotate: '-8deg' }] },
});
