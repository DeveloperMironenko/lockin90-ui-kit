import { View, Text, StyleSheet, Pressable, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Card } from './Card';

/** A single run of prose text with an optional highlight tone. */
export interface ProseSegment {
  text: string;
  tone?: 'pos' | 'caution' | 'bad';
}

/** A paragraph = an ordered list of segments. */
export type ProseParagraph = ProseSegment[];

export interface InsightOfDayProps extends ViewProps {
  /** small label in the eyebrow, before the date */
  eyebrow?: string;
  /** dated eyebrow, e.g. 'Jun 15' */
  date?: string;
  /** editorial headline */
  headline?: string;
  /** prose body — array of paragraphs, each an array of colour-coded segments */
  prose?: ProseParagraph[];
  /** big gradient pull-stat, e.g. '+18%' */
  pullStat?: string;
  /** caption beside the pull-stat */
  pullLabel?: string;
  /** primary CTA label */
  ctaLabel?: string;
  /** dismiss-action label */
  dismissLabel?: string;
  /** primary CTA press */
  onCta?: () => void;
  /** dismiss press */
  onDismiss?: () => void;
}

const DEFAULT_PROSE: ProseParagraph[] = [
  [
    { text: 'Across the last 3 weeks, your energy in the ' },
    { text: '9–11am window', tone: 'pos' },
    {
      text:
        " averaged 18% higher than your afternoons. The pattern holds on 14 of the last 21 days, so it's a real signal — not noise.",
    },
  ],
  [
    { text: "It's strongest after nights you " },
    { text: 'slept before 11pm', tone: 'pos' },
    { text: ', and it collapses on days with ' },
    { text: 'screen time past midnight', tone: 'caution' },
    { text: '. Front-load your hardest work and protect that window.' },
  ],
];

const TONE_COLOR: Record<NonNullable<ProseSegment['tone']>, string> = {
  pos: colors.zoneHigh,
  caution: colors.zoneMid,
  bad: colors.zoneLow,
};

/** Editorial "Insight of the day" card — dated eyebrow + headline, colour-coded
 *  prose, a gradient pull-stat, and a CTA row. Renders the showcase example by default. */
export function InsightOfDay({
  eyebrow = 'Insight of the day',
  date = 'Jun 15',
  headline = 'Your mornings are your superpower',
  prose = DEFAULT_PROSE,
  pullStat = '+18%',
  pullLabel = 'morning energy\nvs afternoon, 21-day avg',
  ctaLabel = 'Protect your mornings',
  dismissLabel = 'Got it',
  onCta,
  onDismiss,
  style,
  ...rest
}: InsightOfDayProps) {
  return (
    <Card style={[styles.card, style]} {...rest}>
      <View style={styles.eyebrow}>
        <View style={styles.dot} />
        <Text style={styles.lbl}>{eyebrow.toUpperCase()}</Text>
        {!!date && (
          <>
            <Text style={styles.sep}>·</Text>
            <Text style={styles.date}>{date}</Text>
          </>
        )}
      </View>

      <Text style={styles.headline}>{headline}</Text>

      <View style={styles.prose}>
        {prose.map((para, i) => (
          <Text key={i} style={[styles.paragraph, i < prose.length - 1 && styles.paragraphGap]}>
            {para.map((seg, j) => (
              <Text key={j} style={seg.tone ? { color: TONE_COLOR[seg.tone], fontWeight: '600' } : undefined}>
                {seg.text}
              </Text>
            ))}
          </Text>
        ))}
      </View>

      <View style={styles.pull}>
        {/* Native renders the flux gradient as its solid brand color (mint), matching GradientText. */}
        <Text style={styles.pullNum}>{pullStat}</Text>
        <Text style={styles.pullLbl}>{pullLabel}</Text>
      </View>

      <View style={styles.cta}>
        <Pressable onPress={onCta}>
          {({ pressed }) => (
            <LinearGradient
              colors={gradients.cta.stops as unknown as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.act, pressed && styles.pressed]}
            >
              <Text style={styles.actLabel}>{ctaLabel}</Text>
            </LinearGradient>
          )}
        </Pressable>
        <Pressable onPress={onDismiss}>
          {({ pressed }) => (
            <View style={[styles.dismiss, pressed && styles.pressed]}>
              <Text style={styles.dismissLabel}>{dismissLabel}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 26, maxWidth: 560 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  lbl: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1.7, color: colors.textFaint },
  sep: { color: colors.textFaint, fontSize: 11 },
  date: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 0.8, color: colors.accent },
  headline: {
    fontFamily: fonts.display,
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.5,
    color: colors.text,
    marginBottom: 16,
  },
  prose: {},
  paragraph: { fontFamily: fonts.ui, fontSize: 15.5, lineHeight: 27, color: colors.textDim },
  paragraphGap: { marginBottom: 12 },
  pull: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  pullNum: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 38,
    lineHeight: 38,
    letterSpacing: -1.14,
    color: colors.mint,
  },
  pullLbl: { flex: 1, fontFamily: fonts.ui, fontSize: 13, lineHeight: 18, color: colors.textFaint },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexWrap: 'wrap',
  },
  act: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: radii.pill },
  actLabel: { fontFamily: fonts.ui, fontSize: 13.5, fontWeight: '600', color: '#0A0A12' },
  dismiss: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  dismissLabel: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '500', color: colors.textFaint },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
