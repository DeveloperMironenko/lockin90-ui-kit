import { View, Text, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors, spacing, fonts, fontSizes } from '@lockin90/tokens';

export type StatusTone = 'ok' | 'warn' | 'bad';

export interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: StatusTone;
  style?: StyleProp<ViewStyle>;
}

const TONE_COLORS: Record<StatusTone, string> = {
  ok: colors.ok,
  warn: colors.warn,
  bad: colors.bad,
};

export function StatusBadge({ children, tone = 'ok', style }: StatusBadgeProps) {
  const color = TONE_COLORS[tone];
  return (
    <View style={[styles.row, style]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginRight: spacing.xs,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
  },
});
