import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface TypingIndicatorProps {
  /** Optional leading text, e.g. "Sofia is typing" (default: none — just the dots). */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

const DOT_COUNT = 3;

/**
 * TypingIndicator — a small left-aligned glass bubble (an incoming-message
 * look) holding three dots that bounce/pulse in a staggered loop to signal
 * someone composing. Mirrors the web `@lockin90/ui` `TypingIndicator` and the
 * `DotsLoader` animation convention (1.2s-ish cycle, 0.16s stagger, -4px
 * bounce + 0.7→1 scale + 0.5→1 opacity) using Animated loops. An optional
 * `label` renders as small dim text before the dots.
 */
export function TypingIndicator({ label, style }: TypingIndicatorProps) {
  // one driver per dot; 0 = resting (down/dim), 1 = peak (up/bright)
  const valsRef = useRef<Animated.Value[]>([]);
  if (valsRef.current.length !== DOT_COUNT) {
    valsRef.current = Array.from({ length: DOT_COUNT }, () => new Animated.Value(0));
  }
  const vals = valsRef.current;

  useEffect(() => {
    const loops = vals.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160), // staggered start (matches web 0/.16/.32s)
          Animated.timing(v, { toValue: 1, duration: 360, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 480, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.delay(Math.max(0, (DOT_COUNT - 1 - i) * 160)), // pad so cycles realign
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [vals]);

  return (
    <View
      style={[styles.bubble, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={label ? `${label}…` : 'Typing…'}
    >
      {label != null && <Text style={styles.label}>{label}</Text>}
      <View style={styles.dots}>
        {vals.map((v, i) => (
          <Animated.View
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.textDim,
              opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
              transform: [
                { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) },
                { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
              ],
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '82%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  label: {
    fontFamily: fonts.ui,
    fontSize: 12,
    lineHeight: 14,
    color: colors.textDim,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
