import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { colors, fonts, gradientStops } from '@lockin90/tokens';

export type AvatarGradient = 'flux' | 'cta' | 'mint' | 'violet' | 'warm';

export interface AvatarProps {
  name?: string;
  size?: number;
  /**
   * Gradient fill behind the initials. Matches the web @lockin90/ui Avatar default
   * of 'flux'. When unset, falls back to the brand 'flux' gradient (web parity);
   * pass an explicit family to change it. Painted via react-native-svg, the same
   * technique BrandMark/GradientText use, so web and native render identically.
   */
  gradient?: AvatarGradient;
  style?: StyleProp<ViewStyle>;
}

// Module-scoped counter for unique <LinearGradient> ids (Math.random is unavailable
// in RN's JSC by default; each mounted instance gets a stable, distinct id so
// multiple gradient avatars on one screen don't share a gradient def).
let gradSeq = 0;

// Up-to-2-letter initials — first letter of up to two words. Kept byte-identical to
// the web @lockin90/ui Avatar (`initialsFrom`) so the shared AppHeader renders the
// SAME letters on both platforms for every name shape (web↔native parity).
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ name = '', size = 38, gradient = 'flux', style }: AvatarProps) {
  const gradId = useMemo(() => `lk-avatar-grad-${(gradSeq += 1)}`, []);
  const stops = gradientStops[gradient];
  const r = size / 2;

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: r },
        style,
      ]}
    >
      {/* Brand gradient fill, painted under the initials (web parity: initials
          sit over var(--grad-flux)). */}
      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={size}
            y2={size}
          >
            {stops.map((color, i) => (
              <Stop key={`${color}-${i}`} offset={i / (stops.length - 1)} stopColor={color} />
            ))}
          </LinearGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#${gradId})`} />
      </Svg>
      <Text style={[styles.initials, { fontSize: Math.round(size * 0.36) }]}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    // Solid fallback under the SVG gradient (first frame + safety net).
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontFamily: fonts.display,
    color: '#07080d',
  },
});
