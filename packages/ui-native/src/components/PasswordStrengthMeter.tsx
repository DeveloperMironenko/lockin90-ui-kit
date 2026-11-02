import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, radii } from '@lockin90/tokens';

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4;

/** One line of the checklist under the meter; the app decides the rules and whether each is met. */
export interface PasswordRule {
  id: string;
  label: string;
  met: boolean;
}

interface PasswordStrengthMeterBaseProps extends Omit<ViewProps, 'children' | 'style'> {
  /** 0 = empty/weakest .. 4 = strongest */
  score: PasswordStrengthScore;
  /** override the derived label (default: 0/1='Weak', 2='Fair', 3='Good', 4='Strong') */
  label?: string;
  /** optional helper line shown under the meter */
  hint?: string;
  /** faint text before the tinted label (e.g. "Strength:") */
  labelPrefix?: string;
  /** the meter's screen-reader name (default: `Password strength: <label>`); pass a translated one */
  accessibleLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** With `rules`, the met/unmet words read after each rule are required (no kit default is ever heard). */
type PasswordStrengthRulesProps =
  | {
      /** the checklist under the meter */
      rules: PasswordRule[];
      /** read right after a met rule's label, as given: include the leading punctuation and space
       *  (", done" / "，已满足") */
      metLabel: string;
      /** read right after an unmet rule's label, as given (", not yet") */
      unmetLabel: string;
    }
  | { rules?: undefined; metLabel?: string; unmetLabel?: string };

export type PasswordStrengthMeterProps = PasswordStrengthMeterBaseProps & PasswordStrengthRulesProps;

/** Number of equal segments rendered (the 4-segment model is shared web↔native). */
const SEGMENTS = 4;

/** Default label per score — 0 and 1 both read 'Weak'. */
const LABELS = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;

/**
 * Color of the filled segments + label, keyed by score:
 * 1 = bad/red, 2 = warn/amber, 3 = cyan, 4 = mint/ok (score 0 falls back to bad;
 * its label is faint instead: nothing typed yet is not "weak").
 */
const SCORE_COLOR = [colors.bad, colors.bad, colors.warn, colors.cyan, colors.ok] as const;

/**
 * PasswordStrengthMeter — a row of 4 equal segments that fill left→right up to
 * `score`, colored by strength (red → amber → cyan → mint), with a small label
 * (derived or overridden) tinted in the score color, an optional hint line and
 * an optional rule checklist (one column, as the web at phone width).
 */
export function PasswordStrengthMeter({
  score,
  label,
  hint,
  labelPrefix,
  accessibleLabel,
  rules,
  metLabel,
  unmetLabel,
  style,
  ...rest
}: PasswordStrengthMeterProps) {
  const s = Math.max(0, Math.min(SEGMENTS, score)) as PasswordStrengthScore;
  const color = SCORE_COLOR[s];
  const text = label ?? LABELS[s];
  const level = <Text style={[styles.label, { color: s === 0 ? colors.textFaint : color }]}>{text}</Text>;

  return (
    <View style={[styles.root, style]} {...rest}>
      {/* the segment row is the meter; the hint describes it */}
      <View
        style={styles.bars}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={accessibleLabel ?? `Password strength: ${text}`}
        accessibilityHint={hint}
        accessibilityValue={{ min: 0, max: SEGMENTS, now: s }}
      >
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
      {/* the meter already says this to screen readers */}
      <View style={styles.meta} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        {labelPrefix != null ? (
          <Text style={styles.prefix}>
            {labelPrefix} {level}
          </Text>
        ) : (
          level
        )}
        {hint != null && <Text style={styles.hint}>{hint}</Text>}
      </View>
      {rules?.length ? (
        <View style={styles.rules}>
          {rules.map((rule) => (
            <View
              key={rule.id}
              style={styles.rule}
              accessible
              accessibilityLabel={`${rule.label}${rule.met ? metLabel : unmetLabel}`}
            >
              <View style={[styles.tick, rule.met && styles.tickMet]}>
                {rule.met ? (
                  <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={colors.bg0} strokeWidth={3}>
                    <Path d="M5 12l5 5L20 6" />
                  </Svg>
                ) : null}
              </View>
              <Text style={[styles.ruleText, rule.met && styles.ruleTextMet]}>{rule.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
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
  prefix: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textFaint,
  },
  hint: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textFaint,
  },
  // the web `.lk-pwstrength-rules` at phone width: one column, 6px apart, 12px under the meta row
  // (the root's 8px gap + 4)
  rules: { gap: 6, marginTop: 4 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tick: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickMet: { backgroundColor: colors.zoneHigh, borderColor: colors.zoneHigh },
  ruleText: {
    flexShrink: 1,
    fontFamily: fonts.ui,
    fontSize: 12,
    lineHeight: 12 * 1.55,
    color: colors.textFaint,
  },
  ruleTextMet: { color: colors.text },
});
