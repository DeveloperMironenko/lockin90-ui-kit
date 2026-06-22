import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@lockin90/tokens';

export interface DotsLoaderProps {
  /** dot diameter */
  size?: number;
  /** dot color */
  color?: string;
  /** number of dots */
  count?: number;
  /** gap between dots */
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * N small dots that bounce/pulse in a staggered sequence — typing indicator
 * (the AI coach composing) and generic inline loading state. Mirrors the web
 * `DotsLoader` (same prop API + staggered 0.16s wave) using Animated loops.
 */
export function DotsLoader({ size = 7, color = colors.accent, count = 3, gap = 6, style }: DotsLoaderProps) {
  const n = Math.max(1, Math.floor(count));
  // one driver per dot; 0 = resting (down/dim), 1 = peak (up/bright)
  const valsRef = useRef<Animated.Value[]>([]);
  if (valsRef.current.length !== n) {
    valsRef.current = Array.from({ length: n }, () => new Animated.Value(0));
  }
  const vals = valsRef.current;

  useEffect(() => {
    const loops = vals.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160), // staggered start (matches web 0/.16/.32s)
          Animated.timing(v, { toValue: 1, duration: 360, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 480, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.delay(Math.max(0, (n - 1 - i) * 160)), // pad so cycles realign
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [vals, n]);

  return (
    <View style={[styles.row, { gap }, style]} accessibilityRole="progressbar" accessibilityLabel="Loading">
      {vals.map((v, i) => (
        <Animated.View
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            shadowColor: color,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 0 },
            opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
            transform: [
              { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) },
              { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
            ],
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
