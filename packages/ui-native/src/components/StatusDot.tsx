import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

export type StatusDotTone = 'high' | 'mid' | 'low' | 'accent' | 'neutral';

export interface StatusDotProps extends ViewProps {
  /** Color of the dot. Defaults to 'high'. */
  tone?: StatusDotTone;
  /** Optional text rendered after the dot. */
  label?: string;
  /** Glow emphasis (web pulses; native shows a stronger static glow). */
  pulse?: boolean;
}

const TONE: Record<StatusDotTone, string> = {
  high: colors.mint,
  mid: colors.zoneMid,
  low: colors.zoneLow,
  accent: colors.accent,
  neutral: colors.textFaint,
};

/** Tiny colored status indicator dot with optional label and glow. */
export function StatusDot({ tone = 'high', label, pulse, style, ...rest }: StatusDotProps) {
  const c = TONE[tone];
  return (
    <View style={[styles.wrap, style]} {...rest}>
      <View
        style={[
          styles.dot,
          { backgroundColor: c, shadowColor: c, shadowRadius: pulse ? 12 : 7 },
        ]}
      />
      {label != null && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
  },
  label: {
    fontFamily: fonts.ui,
    fontSize: 12,
    color: colors.textDim,
  },
});
