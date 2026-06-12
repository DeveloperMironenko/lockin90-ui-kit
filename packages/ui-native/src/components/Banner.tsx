import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@lockin90/tokens';

export interface BannerProps {
  children: ReactNode;
  tone?: 'info' | 'warn' | 'bad' | 'ok';
  style?: StyleProp<ViewStyle>;
}

const TONE_COLOR: Record<NonNullable<BannerProps['tone']>, string> = {
  info: colors.info,
  warn: colors.warn,
  bad: colors.bad,
  ok: colors.ok,
};

// Tone-tinted translucent fills (~0.08 alpha of each tone color).
const TONE_BG: Record<NonNullable<BannerProps['tone']>, string> = {
  info: 'rgba(110,123,255,0.08)',
  warn: 'rgba(255,176,32,0.08)',
  bad: 'rgba(255,77,109,0.08)',
  ok: 'rgba(52,245,197,0.08)',
};

export function Banner({ children, tone = 'info', style }: BannerProps) {
  const accent = TONE_COLOR[tone];
  return (
    <View style={[styles.row, { backgroundColor: TONE_BG[tone], borderColor: accent }, style]}>
      <View style={[styles.bar, { backgroundColor: accent }]} />
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={styles.text}>{children}</Text>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  bar: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 999,
  },
  content: {
    flex: 1,
  },
  text: {
    flex: 1,
    color: colors.text,
  },
});
