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
  /** Arc color — any color. Ignored when a `gradient` array is given. */
  color?: string;
  /** Track (unfilled) color. */
  trackColor?: string;
  /** Optional arc gradient. A `[from, to]` tuple paints a two-stop gradient; an
   *  N-length array (≥2, e.g. `gradients.flux.stops`) paints N evenly-spaced
   *  stops — the full flux spectrum arc; a single string is treated like a
   *  solid `color`. */
  gradient?: string | string[];
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
 * default; pass a `[from, to]` `gradient` for a two-stop arc, or an N-stop
 * array (e.g. `gradients.flux.stops`) for the full spectrum. Matches the
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
  // reserve the glow's overhang (a wider stroke than the arc) so neither the arc
  // nor its halo clips against the square SVG viewBox
  const glowPad = glow ? 5 : 0;
  const r = (size - thickness) / 2 - glowPad;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - v / 100);

  const useGradient = Array.isArray(gradient);
  // resolved solid arc color: explicit single-string gradient > color
  const solid = typeof gradient === 'string' ? gradient : color;
  const stroke = useGradient ? `url(#${gradId})` : solid;

  const half = size / 2;

  return (
    <View style={[styles.root, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {useGradient ? (
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              {gradient.map((stopColor, i) => (
                <Stop
                  key={i}
                  offset={i / Math.max(1, gradient.length - 1)}
                  stopColor={stopColor}
                />
              ))}
            </LinearGradient>
          </Defs>
        ) : null}
        {/* track */}
        <Circle cx={half} cy={half} r={r} fill="none" stroke={trackColor} strokeWidth={thickness} />
        {/* glow — a wider, faint copy of the progress arc behind it, so the
            halo follows the circular ring (not a square box shadow). Avoids
            <Filter>/<FeGaussianBlur>, which is patchy on device. */}
        {glow ? (
          <Circle
            cx={half}
            cy={half}
            r={r}
            fill="none"
            stroke={stroke}
            strokeWidth={thickness + 8}
            strokeOpacity={0.35}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={dashOffset}
            rotation={-90}
            originX={half}
            originY={half}
          />
        ) : null}
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
      <View style={styles.center} pointerEvents="none">
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
