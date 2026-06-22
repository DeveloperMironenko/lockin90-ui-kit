import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

export type BadgeTone = 'accent' | 'high' | 'mid' | 'low' | 'neutral';

export interface BadgeProps extends ViewProps {
  /** count or short status text (ignored when `dot`) */
  children?: string | number;
  tone?: BadgeTone;
  /** render as a bare glowing dot, no text */
  dot?: boolean;
}

const TONE: Record<BadgeTone, { color: string; bg: string; border: string; glow: string }> = {
  accent: { color: '#0A0A12', bg: colors.accent, border: 'transparent', glow: colors.accent },
  high: { color: colors.zoneHigh, bg: 'rgba(52,245,197,0.10)', border: 'rgba(52,245,197,0.35)', glow: colors.zoneHigh },
  mid: { color: colors.zoneMid, bg: 'rgba(255,176,32,0.10)', border: 'rgba(255,176,32,0.35)', glow: colors.zoneMid },
  low: { color: colors.zoneLow, bg: 'rgba(255,77,109,0.10)', border: 'rgba(255,77,109,0.35)', glow: colors.zoneLow },
  neutral: { color: colors.textDim, bg: colors.glass2, border: colors.border, glow: colors.textFaint },
};

/** Tiny count/status pill — smaller + simpler than Chip; or a `dot` indicator. */
export function Badge({ children = '3', tone = 'accent', dot, style, ...rest }: BadgeProps) {
  const t = TONE[tone];

  if (dot) {
    const noGlow = tone === 'neutral';
    return (
      <View
        style={[
          styles.dot,
          { backgroundColor: t.glow },
          !noGlow && { shadowColor: t.glow, shadowOpacity: 1, shadowRadius: 4 },
          style,
        ]}
        {...rest}
      />
    );
  }

  // accent fills with the CTA gradient
  if (tone === 'accent') {
    return (
      <View style={[styles.badge, { alignSelf: 'flex-start' }, style]} {...rest}>
        <LinearGradient
          colors={gradients.cta.stops as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={[styles.label, { color: t.color }]}>{children}</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.badge, { backgroundColor: t.bg, borderColor: t.border, borderWidth: 1 }, style]}
      {...rest}
    >
      <Text style={[styles.label, { color: t.color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 6,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    shadowOffset: { width: 0, height: 0 },
  },
});
