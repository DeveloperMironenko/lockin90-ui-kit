import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '@lockin90/tokens';

export interface SectionCardProps {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SectionCard({ title, subtitle, right, children, style }: SectionCardProps) {
  const hasHeader = title || subtitle || right;
  return (
    <View style={[styles.card, style]}>
      {hasHeader ? (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {right ? <View style={styles.right}>{right}</View> : null}
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.displaySemibold,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.ui,
    fontSize: fontSizes.sm,
    color: colors.textDim,
  },
  right: {
    flexShrink: 0,
  },
  body: {
    gap: spacing.md,
  },
});
