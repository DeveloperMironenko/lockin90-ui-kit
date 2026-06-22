import { useId, type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

export interface RingProps {
  /** Arc fill, 0–100 (clamped). */
  value?: number;
  /** Outer diameter in px (the SVG viewBox is square at this size). */
  size?: number;
  /** Stroke width of both the track and the arc, in px. */
  thickness?: number;
  /** Arc color — any color. Ignored when a two-stop `gradient` is given. */
  color?: string;
  /** Track (unfilled) color. */
  trackColor?: string;
  /** Optional arc gradient. A `[from, to]` tuple paints a two-stop gradient; a
   *  single string is treated like a solid `color`. */
  gradient?: [string, string] | string;
  /** Soft color glow behind the arc (on by default). */
  glow?: boolean;
  /** Centered content. When omitted the rounded `value` is shown as the number. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Ring — a generic, prop-driven circular-progress primitive: an SVG track +
 * colored progress arc (rotated −90° so it starts at 12 o'clock, round
 * linecap, soft color glow) with absolutely-centered readout content. Solid by
 * default; pass a `[from, to]` `gradient` for a two-stop arc. Matches the
 * Aurora Flux ring look (energy/goal/substance gauges).
 */
export function Ring({
  value = 72,
  size = 108,
  thickness = 7,
  color = colors.mint,
  trackColor = colors.border,
  gradient,
  glow = true,
  children,
  style,
}: RingProps) {
  const uid = useId();
  const gradId = `lk-ring-grad-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;

  const v = Math.max(0, Math.min(100, value));
  // radius leaves a half-stroke of breathing room so the arc never clips
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - v / 100);

  const useGradient = Array.isArray(gradient);
  // resolved solid arc color: explicit single-string gradient > color
  const solid = typeof gradient === 'string' ? gradient : color;
  const stroke = useGradient ? `url(#${gradId})` : solid;
  // glow tints to the arc color (gradient → its first stop)
  const glowColor = useGradient ? gradient[0] : solid;

  const half = size / 2;

  return (
    <View style={[styles.root, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {useGradient ? (
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={gradient[0]} />
              <Stop offset="1" stopColor={gradient[1]} />
            </LinearGradient>
          </Defs>
        ) : null}
        {/* track */}
        <Circle cx={half} cy={half} r={r} fill="none" stroke={trackColor} strokeWidth={thickness} />
        {/* progress arc — rotated −90° to start at 12 o'clock */}
        <Circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dashOffset}
          rotation={-90}
          originX={half}
          originY={half}
        />
      </Svg>
      <View
        style={[
          styles.center,
          glow && {
            shadowColor: glowColor,
            shadowOpacity: 0.55,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
        pointerEvents="none"
      >
        {children ?? <Text style={styles.num}>{Math.round(v)}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {
    fontFamily: fonts.display,
    fontWeight: '700',
    letterSpacing: -0.9,
    lineHeight: 32,
    fontSize: 32,
    color: colors.text,
    textAlign: 'center',
  },
});
