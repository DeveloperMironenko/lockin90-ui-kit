import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '@lockin90/tokens';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({ title, description, icon, action, style }: EmptyStateProps) {
  return (
    <View style={[styles.wrap, style]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  icon: {
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontFamily: fonts.ui,
    fontSize: fontSizes.sm,
    color: colors.textDim,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.sm,
  },
});
