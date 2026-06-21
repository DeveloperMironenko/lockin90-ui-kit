import { type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { Chip } from './Chip';

/** One frequency option in the pill group; exactly one should be `active`. */
export interface GoalFrequency {
  /** Pill label, e.g. "Every day". */
  label: string;
  /** Whether this option is the selected one. */
  active?: boolean;
}

export interface GoalSettingCardProps {
  /** Card heading. */
  title?: string;
  /** Trailing status chip text (omit to hide). */
  badge?: string;
  /** Eyebrow above the metric name. */
  metricLabel?: string;
  /** The thing being targeted, e.g. "Sleep duration". */
  metric?: string;
  /** Big target value shown in the stepper readout. */
  value?: string;
  /** Small unit suffix after the value, e.g. "h". */
  unit?: string;
  /** Mono caption under the readout, e.g. "target · per night". */
  range?: string;
  /** Eyebrow above the frequency pills. */
  frequencyLabel?: string;
  /** Frequency pill options (one active). */
  frequencies?: GoalFrequency[];
  /** "Why it matters" hint body. */
  hint?: ReactNode;
  /** Submit button label. */
  submitLabel?: string;
  /** Skip link label (omit to hide). */
  skipLabel?: string;
  /** Decrement the target value. */
  onDecrement?: () => void;
  /** Increment the target value. */
  onIncrement?: () => void;
  /** Disable the decrement step (e.g. at the minimum). */
  decrementDisabled?: boolean;
  /** Disable the increment step (e.g. at the maximum). */
  incrementDisabled?: boolean;
  /** Fired with the pill index when a frequency is chosen. */
  onSelectFrequency?: (index: number, freq: GoalFrequency) => void;
  /** Fired when "Set goal" is pressed. */
  onSubmit?: () => void;
  /** Fired when the skip link is pressed. */
  onSkip?: () => void;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_FREQUENCIES: GoalFrequency[] = [
  { label: 'Every day', active: true },
  { label: 'Weekdays' },
  { label: 'Custom' },
];

/** Default "why it matters" hint. A function so it reads `styles` at render
 *  time (after the StyleSheet below is assigned). */
function DefaultHint(): ReactNode {
  return (
    <Text style={styles.hintText}>
      Most people feel best at <Text style={styles.hintStrong}>7–9h</Text>. We&apos;ll nudge you at
      wind-down and track it against your logged sleep.
    </Text>
  );
}

/**
 * Goal-setting card (native) — set a target: title + a −/value/+ stepper, a
 * one-active frequency pill group, a "why it matters" hint, a gradient
 * "Set goal" button and a skip link. Native counterpart of the web
 * GoalSettingCard (same prop API). Defaults to the design example.
 */
export function GoalSettingCard({
  title = 'New goal',
  badge = 'tracked',
  metricLabel = 'Goal · target value',
  metric = 'Sleep duration',
  value = '7.5',
  unit = 'h',
  range = 'target · per night',
  frequencyLabel = 'Frequency',
  frequencies = DEFAULT_FREQUENCIES,
  hint,
  submitLabel = 'Set goal',
  skipLabel = 'Skip for now',
  onDecrement,
  onIncrement,
  decrementDisabled,
  incrementDisabled,
  onSelectFrequency,
  onSubmit,
  onSkip,
  style,
}: GoalSettingCardProps) {
  // `undefined` → design default; pass `null` to hide the hint.
  const hintNode = hint === undefined ? <DefaultHint /> : hint;
  return (
    <View style={[styles.card, style]} accessibilityLabel="Create a new goal">
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        {badge != null && <Chip tone="accent" dot label={badge} style={styles.badge} />}
      </View>

      <Text style={styles.label}>{metricLabel}</Text>
      <Text style={styles.metric}>{metric}</Text>

      <View style={styles.stepper} accessibilityRole="adjustable">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrease"
          disabled={decrementDisabled}
          onPress={onDecrement}
          style={({ pressed }) => [
            styles.step,
            decrementDisabled && styles.stepDisabled,
            pressed && styles.stepPressed,
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12h14" stroke={colors.text} strokeWidth={2.4} />
          </Svg>
        </Pressable>

        <View style={styles.readout}>
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.valueWrap}
          >
            <Text style={styles.value}>
              {value}
              {unit != null && <Text style={styles.unit}>{unit}</Text>}
            </Text>
          </LinearGradient>
          {range != null && <Text style={styles.range}>{range}</Text>}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increase"
          disabled={incrementDisabled}
          onPress={onIncrement}
          style={({ pressed }) => [
            styles.step,
            incrementDisabled && styles.stepDisabled,
            pressed && styles.stepPressed,
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M12 5v14M5 12h14" stroke={colors.text} strokeWidth={2.4} />
          </Svg>
        </Pressable>
      </View>

      <Text style={styles.label}>{frequencyLabel}</Text>
      <View style={styles.freq} accessibilityRole="radiogroup">
        {frequencies.map((freq, i) => {
          const active = freq.active ?? false;
          return (
            <Pressable
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => onSelectFrequency?.(i, freq)}
              style={styles.pill}
            >
              {active ? (
                <LinearGradient
                  colors={gradients.cta.stops as unknown as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.pillFill, styles.pillActive]}
                >
                  <Text style={[styles.pillLabel, styles.pillLabelActive]}>{freq.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.pillFill}>
                  <Text style={styles.pillLabel}>{freq.label}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {hintNode != null && (
        <View style={styles.hint}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.hintIcon}>
            <Circle cx={12} cy={12} r={9} stroke={colors.accent} strokeWidth={1.7} />
            <Path d="M12 8h.01M11 12h1v4h1" stroke={colors.accent} strokeWidth={1.7} />
          </Svg>
          <View style={styles.hintBody}>{hintNode}</View>
        </View>
      )}

      <View style={styles.foot}>
        <Pressable
          accessibilityRole="button"
          onPress={onSubmit}
          style={({ pressed }) => [styles.submitWrap, pressed && styles.submitPressed]}
        >
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submit}
          >
            <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
              <Path d="M5 13l4 4L19 7" stroke="#0A0A12" strokeWidth={2.2} />
            </Svg>
            <Text style={styles.submitLabel}>{submitLabel}</Text>
          </LinearGradient>
        </Pressable>
        {skipLabel != null && (
          <Pressable accessibilityRole="button" onPress={onSkip}>
            <Text style={styles.skip}>{skipLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    maxWidth: 440,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.bg1,
    ...nativeShadows.elev1,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.19,
    color: colors.text,
  },
  badge: { marginLeft: 'auto' },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    textTransform: 'uppercase',
    letterSpacing: 1.47,
    color: colors.textFaint,
    marginTop: 18,
    marginBottom: 10,
  },
  metric: { fontFamily: fonts.display, fontSize: 16, fontWeight: '700', color: colors.text },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 4,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  step: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  stepDisabled: { opacity: 0.4 },
  stepPressed: { transform: [{ scale: 0.94 }], borderColor: 'rgba(124,92,255,0.5)' },

  readout: { alignItems: 'center' },
  valueWrap: { borderRadius: radii.sm },
  value: {
    fontFamily: fonts.mono,
    fontSize: 38,
    fontWeight: '600',
    letterSpacing: -0.76,
    // The LinearGradient backing supplies the energy gradient; the glyphs sit
    // on the void surface so the brightest stop reads through on dark.
    color: colors.void,
    opacity: 0.92,
  },
  unit: { fontFamily: fonts.mono, fontSize: 19, fontWeight: '500', color: colors.void },
  range: {
    marginTop: 7,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },

  freq: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    borderRadius: radii.pill,
  },
  pill: { flex: 1 },
  pillFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  pillActive: { ...nativeShadows.glowAccent },
  pillLabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.textDim },
  pillLabelActive: { color: '#0A0A12', fontWeight: '600' },

  hint: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.22)',
    backgroundColor: 'rgba(124,92,255,0.06)',
  },
  hintIcon: { marginTop: 1 },
  hintBody: { flex: 1 },
  hintText: { fontSize: 12.5, lineHeight: 19, color: colors.textDim },
  hintStrong: { color: '#cbbcff', fontWeight: '600' },

  foot: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 20 },
  submitWrap: { flex: 1, borderRadius: radii.pill },
  submitPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    ...nativeShadows.glowAccent,
  },
  submitLabel: { fontFamily: fonts.ui, fontSize: 14, fontWeight: '600', color: '#0A0A12' },
  skip: { fontFamily: fonts.mono, fontSize: 12, color: colors.textFaint },
});
