import { View, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors, radius } from '@lockin90/tokens';

export interface StepDotsProps {
  /** Active step, 1-based. Steps before it read as completed; after, as track. */
  current: number;
  /** Total number of steps. */
  total: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Aurora segmented "step N of M" progress indicator — a compact row of thin
 * rounded segments. Steps `< current` are completed (accent fill), `=== current`
 * is active (accent + subtle glow, slightly wider), `> current` is an inactive
 * track. Mirrors the web `StepDots` 1:1.
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
        const segStyle =
          step < current ? styles.done : step === current ? styles.active : styles.todo;
        return <View key={step} style={[styles.dot, segStyle]} />;
      })}
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
    // emphasized active step: brighter accent + glow (same width as the others)
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.55,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  todo: {
    backgroundColor: colors.glass2,
  },
});
