import { View, Text, StyleSheet, Pressable, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Chip } from './Chip';
import { Card } from './Card';

export interface PendingPatternChips {
  /** sample size, e.g. 24 */
  n?: number;
  /** p-value label, e.g. 'p < 0.01' */
  p?: string;
  /** confidence percent 0..100, e.g. 86 */
  confidence?: number;
}

export interface PendingPatternCardProps extends ViewProps {
  /** headline of the detected pattern */
  title?: string;
  /** mono detail line under the title, e.g. 'pattern detected · caffeine_window' */
  detail?: string;
  /** plain-language interpretation */
  interpretation?: string;
  /** signed effect-attribution magnitude shown large, e.g. '−9' */
  effect?: string;
  /** unit suffix for the effect, e.g. 'pts' */
  effectUnit?: string;
  /** sign of the effect — drives the effect color (high/low) */
  effectSign?: 'pos' | 'neg';
  /** mono label describing what the effect is attributed to */
  effectLabel?: string;
  /** p · n · confidence stat chips */
  chips?: PendingPatternChips;
  /** Accept button label */
  acceptLabel?: string;
  /** Dismiss button label */
  dismissLabel?: string;
  /** fired when the pattern is confirmed */
  onAccept?: () => void;
  /** fired when the pattern is dismissed */
  onDismiss?: () => void;
}

const MINT = gradients.mint.stops as unknown as [string, string];

const DEFAULT_INTERP =
  'On days with coffee after 14:00, your wind-down score drops and evening energy fades. Confirm if it matches you.';

/** Pending-pattern card — an AI-detected pattern awaiting confirmation: headline +
 *  interpretation, a large signed effect-attribution line, supporting stat chips
 *  (n · p · confidence), and Accept / Dismiss actions. Native counterpart of the web
 *  PendingPatternCard (same prop API). Renders the showcase example by default. */
export function PendingPatternCard({
  title = 'Late caffeine drains your evenings',
  detail = 'pattern detected · caffeine_window',
  interpretation = DEFAULT_INTERP,
  effect = '−9',
  effectUnit = 'pts',
  effectSign = 'neg',
  effectLabel = 'evening energy / late-caffeine day',
  chips = { n: 24, p: 'p < 0.01', confidence: 86 },
  acceptLabel = 'Accept',
  dismissLabel = 'Dismiss',
  onAccept,
  onDismiss,
  style,
  ...rest
}: PendingPatternCardProps) {
  const effColor = effectSign === 'pos' ? colors.zoneHigh : colors.zoneLow;

  return (
    <Card style={[styles.card, style]} {...rest}>
      <View style={styles.head}>
        <View style={styles.ico}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3"
              stroke={colors.zoneLow}
              strokeWidth={1.6}
            />
          </Svg>
        </View>
        <View style={styles.headText}>
          <Text style={styles.title}>{title}</Text>
          {!!detail && <Text style={styles.detail}>{detail}</Text>}
        </View>
      </View>

      <Text style={styles.interp}>{interpretation}</Text>

      <View style={styles.effect}>
        <Text style={[styles.effNum, { color: effColor }]}>
          {effect}
          {!!effectUnit && <Text style={styles.effUnit}>{effectUnit}</Text>}
        </Text>
        {!!effectLabel && <Text style={styles.effLabel}>{effectLabel}</Text>}
      </View>

      <View style={styles.stats}>
        {!!chips?.p && <Chip tone="high" dot label={chips.p} />}
        {chips?.n != null && <Chip tone="default" label={`n = ${chips.n}`} />}
        {chips?.confidence != null && <Chip tone="accent" label={`${chips.confidence}% conf`} />}
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={acceptLabel}
          onPress={onAccept}
          style={({ pressed }) => [styles.btnWrap, pressed && styles.pressed]}
        >
          <LinearGradient colors={MINT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.accept}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M20 6 9 17l-5-5" stroke="#06120c" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.acceptText}>{acceptLabel}</Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={dismissLabel}
          onPress={onDismiss}
          style={({ pressed }) => [styles.btnWrap, styles.dismiss, pressed && styles.pressed]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6 6 18M6 6l12 12" stroke={colors.textDim} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.dismissText}>{dismissLabel}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  ico: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  headText: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: fonts.display,
    fontSize: 13.5,
    fontWeight: '700',
    lineHeight: 16,
    color: colors.text,
  },
  detail: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.textFaint,
    letterSpacing: 0.48,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  interp: { fontSize: 11.5, color: colors.textDim, lineHeight: 17, marginTop: 10 },
  effect: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 10,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass2,
  },
  effNum: { fontFamily: fonts.display, fontWeight: '700', fontSize: 21, letterSpacing: -0.42 },
  effUnit: { fontSize: 11, color: colors.textFaint, fontWeight: '400' },
  effLabel: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 8.5,
    textTransform: 'uppercase',
    letterSpacing: 0.85,
    color: colors.textFaint,
    lineHeight: 11,
  },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 11 },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btnWrap: {
    flex: 1,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.85 },
  accept: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  acceptText: { fontFamily: fonts.ui, fontSize: 12, fontWeight: '600', color: '#06120c' },
  dismiss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass,
  },
  dismissText: { fontFamily: fonts.ui, fontSize: 12, fontWeight: '600', color: colors.textDim },
});
