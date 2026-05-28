import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors, fonts, radius } from '@p90/tokens';

type Padding = 'tight' | 'normal' | 'loose' | 'none';
const PAD: Record<Padding, number> = { tight: 12, normal: 20, loose: 24, none: 0 };

interface SectionCardProps {
  eyebrow?: string;
  title?: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  padding?: Padding;
  bodyStyle?: ViewStyle;
  style?: ViewStyle;
}

export function SectionCard({ eyebrow, title, subtitle, action, children, footer, padding = 'normal', bodyStyle, style }: SectionCardProps) {
  const hasHeader = !!(eyebrow || title || subtitle || action);
  return (
    <View style={[styles.card, style]}>
      {hasHeader && (
        <View style={styles.header}>
          <View style={styles.headerMain}>
            {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && (typeof subtitle === 'string' ? <Text style={styles.subtitle}>{subtitle}</Text> : subtitle)}
          </View>
          {action}
        </View>
      )}
      <View style={[{ padding: PAD[padding] }, bodyStyle]}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden' },
  header:     { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: colors.border, gap: 12 },
  headerMain: { flex: 1, minWidth: 0 },
  eyebrow:    { fontFamily: fonts.displayBold, fontSize: 11, letterSpacing: 1.8, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 2 },
  title:      { fontFamily: fonts.displayBoldItalic, fontSize: 16, color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.4 },
  subtitle:   { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  footer:     { paddingHorizontal: 20, paddingVertical: 8, borderTopWidth: 1, borderColor: colors.border },
});
