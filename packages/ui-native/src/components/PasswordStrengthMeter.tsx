import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type ViewProps } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrengthMeterProps extends Omit<ViewProps, 'children' | 'style'> {
  /** 0 = empty/weakest .. 4 = strongest */
  score: PasswordStrengthScore;
  /** override the derived label (default: 0/1='Weak', 2='Fair', 3='Good', 4='Strong') */
  label?: string;
  /** optional helper line shown under the meter */
  hint?: string;
  style?: StyleProp<ViewStyle>;
}

/** Number of equal segments rendered (the 4-segment model is shared web↔native). */
const SEGMENTS = 4;

/** Default label per score — 0 and 1 both read 'Weak'. */
const LABELS = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;

/**
 * Color of the filled segments + label, keyed by score:
 * 1 = bad/red, 2 = warn/amber, 3 = cyan, 4 = mint/ok (score 0 falls back to bad).
 */
const SCORE_COLOR = [colors.bad, colors.bad, colors.warn, colors.cyan, colors.ok] as const;

/**
 * PasswordStrengthMeter — a row of 4 equal segments that fill left→right up to
 * `score`, colored by strength (red → amber → cyan → mint), with a small label
 * (derived or overridden) tinted in the score color and an optional hint line.
 */
export function PasswordStrengthMeter({
  score,
  label,
  hint,
  style,
  ...rest
}: PasswordStrengthMeterProps) {
  const s = Math.max(0, Math.min(SEGMENTS, score)) as PasswordStrengthScore;
  const color = SCORE_COLOR[s];
  const text = label ?? LABELS[s];

  return (
    <View
      style={[styles.root, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Password strength: ${text}`}
      accessibilityValue={{ min: 0, max: SEGMENTS, now: s }}
      {...rest}
    >
      <View style={styles.bars}>
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const on = i < s;
          return (
            <View
              key={i}
              style={[
                styles.seg,
                on && {
                  backgroundColor: color,
                  shadowColor: color,
                  shadowOpacity: 0.55,
                  shadowRadius: 5,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.meta}>
        <Text style={[styles.label, { color }]}>{text}</Text>
        {hint != null && <Text style={styles.hint}>{hint}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%', gap: 8 },
  bars: { flexDirection: 'row', gap: 6 },
  seg: {
    flex: 1,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '600',
  },
  hint: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textFaint,
  },
});
