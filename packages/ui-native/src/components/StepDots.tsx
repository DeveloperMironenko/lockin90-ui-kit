import { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { colors, radius, gradientStops } from '@lockin90/tokens';

// Module-scoped counter for unique <LinearGradient> ids (Math.random is unavailable),
// so multiple StepDots on one screen don't share a gradient def.
let gradSeq = 0;

export interface StepDotsProps {
  /** Active step, 1-based. Steps before it read as completed; after, as track. */
  current: number;
  /** Total number of steps. */
  total: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Aurora segmented "step N of M" progress indicator — a compact row of thin
 * rounded segments, all the SAME width. Steps `< current` are completed (accent
 * fill), `=== current` is active (the brand flux gradient + glow, like the logo),
 * `> current` is an inactive track. Mirrors the web `StepDots` 1:1 (web animates
 * the active gradient; native paints it statically).
 */
export function StepDots({ current, total, style }: StepDotsProps) {
  const count = Math.max(0, Math.floor(total));
  return (
    <View
      style={[styles.row, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: count, now: Math.min(Math.max(current, 1), count) }}
    >
      {Array.from({ length: count }, (_, i) => {
        const step = i + 1;
        if (step === current) {
          // Active: brand flux gradient fill (rounded via the SVG Rect) + glow.
          return <ActiveSegment key={step} />;
        }
        const segStyle = step < current ? styles.done : styles.todo;
        return <View key={step} style={[styles.dot, segStyle]} />;
      })}
    </View>
  );
}

/**
 * The active segment paints the brand flux gradient with react-native-svg. Percentage
 * SVG dimensions ('100%') can mis-measure before flex layout resolves, leaving the
 * gradient blank on the first Android paint. Mirroring `GradientText`, we measure the
 * segment's pixel size via onLayout and size both the Svg and its Rect in px, painting
 * only once a width is known. Keeps equal-width (flex:1), the rounded corners, and glow.
 */
function ActiveSegment() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const gradId = useMemo(() => `lk-stepdot-grad-${(gradSeq += 1)}`, []);
  const flux = gradientStops.flux;
  return (
    <View
      style={[styles.dot, styles.active]}
      onLayout={(e) =>
        setSize({
          width: Math.ceil(e.nativeEvent.layout.width),
          height: Math.ceil(e.nativeEvent.layout.height),
        })
      }
    >
      {size.width > 0 ? (
        <Svg width={size.width} height={size.height}>
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              {flux.map((color, j) => (
                <Stop key={`${color}-${j}`} offset={j / (flux.length - 1)} stopColor={color} />
              ))}
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={size.width}
            height={size.height}
            rx={2}
            ry={2}
            fill={`url(#${gradId})`}
          />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 4,
    flex: 1,
    borderRadius: radius.pill,
  },
  done: {
    backgroundColor: colors.accent,
  },
  active: {
    // brand-gradient active step (painted by the SVG) + subtle accent glow
    shadowColor: colors.accent,
    shadowOpacity: 0.55,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  todo: {
    backgroundColor: colors.glass2,
  },
});
