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

/** The meter's own screen-reader props are set by the kit (on the segment row, not the root): name it with
 *  `accessibleLabel`; the hint is its accessibilityHint. */
type ReservedA11yProps = 'accessibilityLabel' | 'accessibilityHint' | 'accessibilityRole' | 'accessibilityValue';

interface PasswordStrengthMeterBaseProps extends Omit<ViewProps, 'children' | 'style' | ReservedA11yProps> {
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
 * an optional rule checklist (rows of two, as the mobile design draws it).
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
  const level = <Text style={[styles.label, styles.shrink, { color: s === 0 ? colors.textFaint : color }]}>{text}</Text>;

  return (
    <View style={[styles.root, style]} {...rest}>
      {/* the segment row is the meter, so the label row and the rules beside it stay their own
          screen-reader stops; the hint describes it */}
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
      {/* what it shows is already the meter's label and hint: hidden from screen readers, read once */}
      <View style={styles.meta} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
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
          {pairs(rules).map((row) => (
            <View key={row[0].id} style={styles.rulesRow}>
              {row.map((rule) => (
                <View
                  key={rule.id}
                  style={styles.rule}
                  accessible
                  accessibilityLabel={`${rule.label}${rule.met ? metLabel : unmetLabel}`}
                >
                  <View style={[styles.tick, rule.met && styles.tickMet]}>
                    <Svg
                      width={9}
                      height={9}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={colors.bg0}
                      strokeWidth={3}
                      opacity={rule.met ? 1 : 0}
                    >
                      <Path d="M5 12l5 5L20 6" />
                    </Svg>
                  </View>
                  <Text style={[styles.ruleText, rule.met && styles.ruleTextMet]}>{rule.label}</Text>
                </View>
              ))}
              {/* an odd last rule keeps its column width */}
              {row.length === 1 && <View style={styles.rule} />}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** Rules in rows of two (the mobile design always draws 2 columns). */
function pairs(rules: PasswordRule[]): PasswordRule[][] {
  const rows: PasswordRule[][] = [];
  for (let i = 0; i < rules.length; i += 2) rows.push(rules.slice(i, i + 2));
  return rows;
}

const styles = StyleSheet.create({
  root: { width: '100%' },
  bars: { flexDirection: 'row', gap: 6 },
  seg: {
    flex: 1,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  meta: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '600',
  },
  // long translations wrap inside the meter's width
  shrink: { flexShrink: 1 },
  prefix: {
    flexShrink: 1,
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textFaint,
  },
  hint: {
    flexShrink: 1,
    textAlign: 'right',
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textFaint,
  },
  rules: { marginTop: 11, rowGap: 6 },
  rulesRow: { flexDirection: 'row', columnGap: 12 },
  rule: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 },
  tick: {
    width: 15,
    height: 15,
    flexShrink: 0,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickMet: { backgroundColor: colors.zoneHigh, borderColor: colors.zoneHigh },
  ruleText: { flexShrink: 1, fontFamily: fonts.ui, fontSize: 10.5, color: colors.textFaint },
  ruleTextMet: { color: colors.text },
});
