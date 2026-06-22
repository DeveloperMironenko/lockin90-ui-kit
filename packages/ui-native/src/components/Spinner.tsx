import { useEffect, useId, useRef } from 'react';
import { Animated, Easing, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@lockin90/tokens';

export interface SpinnerProps {
  /** Outer diameter in px (the SVG viewBox is square at this size). */
  size?: number;
  /** Arc color — any color. Used as the gradient's leading stop and the glow
   *  tint; the trailing stop is always the cyan accent for the Aurora
   *  energy-sweep look. */
  color?: string;
  /** Stroke width of both the track and the sweeping arc, in px. */
  thickness?: number;
  /** Accessible label, announced to screen readers. */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Spinner — an indeterminate circular loading spinner in the Aurora Flux
 * "energy-ring" style: a faint track with a sweeping gradient arc (a partial
 * `strokeDasharray` arc, round linecap, soft color glow) that rotates
 * continuously. Mirrors the `.spin` ring spinner from the loaders showcase and
 * keeps parity with the web `Spinner`. The 360° loop runs on the native driver.
 */
export function Spinner({
  size = 24,
  color = colors.accent,
  thickness = 3,
  label = 'Loading',
  style,
}: SpinnerProps) {
  const uid = useId();
  const gradId = `lk-spinner-grad-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;

  // reserve the glow's overhang (a wider stroke than the arc) so neither the arc
  // nor its halo clips against the square SVG viewBox
  const r = (size - thickness) / 2 - 3;
  const c = 2 * Math.PI * r;
  // sweep ≈ 62% of the circumference (the rest is the gap) — matches the
  // showcase's ~0.6 dashoffset ratio for a confident partial arc.
  const dashOffset = c * 0.6;
  const half = size / 2;

  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View
      style={[styles.root, { width: size, height: size, transform: [{ rotate }] }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessible
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0" stopColor={color} />
            <Stop offset="1" stopColor={colors.cyan} />
          </LinearGradient>
        </Defs>
        {/* faint neutral track */}
        <Circle cx={half} cy={half} r={r} fill="none" stroke={colors.border2} strokeWidth={thickness} />
        {/* glow — a wider, faint copy of the arc behind it so the halo follows
            the ring (not a square box shadow); avoids <Filter>, patchy on device */}
        <Circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness + 4}
          strokeOpacity={0.3}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dashOffset}
        />
        {/* sweeping gradient arc */}
        <Circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dashOffset}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
});
