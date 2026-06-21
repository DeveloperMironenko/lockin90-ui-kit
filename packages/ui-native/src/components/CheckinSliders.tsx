import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

/** A fill paint: a single color, or a list of stops for a left→right gradient. */
export type SliderFill = string | string[];

export interface CheckinSlider {
  /** metric name, e.g. "Energy" */
  label: string;
  /** current value, 0..max (default max 100) */
  value: number;
  /** short zone label shown beside the value, e.g. "High" */
  zone: string;
  /** zone color (hex) — drives the value/zone text + thumb ring */
  color: string;
  /** the fill paint — a solid color or gradient stops (left→right) */
  fill: SliderFill;
}

export interface CheckinComposite {
  /** big composite number */
  value: number;
  /** trailing tag, e.g. "· High" */
  tag: string;
  /** ring + number color (hex) */
  color: string;
}

export interface CheckinSlidersProps {
  /** card title */
  title?: string;
  /** small timestamp / context line */
  timestamp?: string;
  /** the stacked sliders */
  sliders?: CheckinSlider[];
  /** the composite readout */
  composite?: CheckinComposite;
  /** scale maximum (value/max → fill %) */
  max?: number;
  /** CTA label */
  ctaLabel?: string;
  /** fired when "Log check-in" is pressed */
  onLog?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of the design's check-in example (token-resolved). */
const DEFAULT_SLIDERS: CheckinSlider[] = [
  { label: 'Energy', value: 72, zone: 'High', color: colors.zoneHigh, fill: [...gradients.mint.stops] },
  { label: 'Mood', value: 64, zone: 'Good', color: colors.cyan, fill: [colors.accent, colors.cyan] },
  { label: 'Focus', value: 81, zone: 'Sharp', color: colors.accent, fill: [colors.magenta, colors.accent] },
];

const DEFAULT_COMPOSITE: CheckinComposite = { value: 72, tag: '· High', color: colors.zoneHigh };

/* track zone-gradient stops (low → mid → high), matching the web track */
const TRACK_STOPS = [
  colors.zoneLow,
  colors.zoneLow,
  colors.zoneMid,
  colors.zoneMid,
  colors.zoneHigh,
  colors.zoneHigh,
];
const TRACK_LOCATIONS = [0, 0.28, 0.4, 0.6, 0.74, 1];

/* composite ring geometry (46x46 viewBox, r=19) */
const RING_R = 19;
const RING_CIRC = 2 * Math.PI * RING_R; // 119.38

/** Render a fill as a 1- or 2+-stop horizontal gradient (a solid color becomes a flat gradient). */
function fillStops(fill: SliderFill): string[] {
  const arr = Array.isArray(fill) ? fill : [fill, fill];
  return arr.length === 1 ? [arr[0], arr[0]] : arr;
}

/** A single slider row: name + zone/value, then a zone-gradient track with a
 *  value-clamped gradient fill and a thumb pinned at value%. */
function SliderCell({ slider, max }: { slider: CheckinSlider; max: number }) {
  const pct = Math.max(0, Math.min(100, (slider.value / max) * 100));
  return (
    <View style={styles.cell}>
      <View style={styles.row}>
        <Text style={styles.name}>{slider.label}</Text>
        <View style={styles.meta}>
          <Text style={[styles.zone, { color: slider.color }]}>{slider.zone.toUpperCase()}</Text>
          <Text style={[styles.val, { color: slider.color }]}>{slider.value}</Text>
        </View>
      </View>

      <View style={styles.wrap}>
        {/* zone-gradient track (dimmed) */}
        <LinearGradient
          colors={TRACK_STOPS as unknown as [string, string, ...string[]]}
          locations={TRACK_LOCATIONS as unknown as [number, number, ...number[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.track}
        />
        {/* fill up to value%, with a soft glow */}
        <LinearGradient
          colors={fillStops(slider.fill) as unknown as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${pct}%`, shadowColor: slider.color }]}
        />
        {/* thumb pinned at value% */}
        <View style={[styles.thumb, { left: `${pct}%`, borderColor: slider.color, shadowColor: slider.color }]} />
      </View>
    </View>
  );
}

/** Check-in sliders — a daily self-report card of stacked zone-gradient sliders,
 *  a composite readout with a mini ring, and a gradient "Log check-in" CTA.
 *  Same prop API as the web component. */
export function CheckinSliders({
  title = 'How are you right now?',
  timestamp = 'Wed · 9:42am',
  sliders = DEFAULT_SLIDERS,
  composite = DEFAULT_COMPOSITE,
  max = 100,
  ctaLabel = 'Log check-in',
  onLog,
  style,
}: CheckinSlidersProps) {
  const ringOffset = RING_CIRC * (1 - Math.max(0, Math.min(1, composite.value / max)));

  return (
    <View style={[styles.card, style]}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{timestamp.toUpperCase()}</Text>
      </View>

      <View style={styles.trio}>
        {sliders.map((s) => (
          <SliderCell key={s.label} slider={s} max={max} />
        ))}
      </View>

      <View style={styles.comp}>
        <View style={styles.compL}>
          <Text style={styles.compK}>TODAY&apos;S COMPOSITE</Text>
          <View style={styles.compV}>
            <Text style={[styles.compNum, { color: composite.color }]}>{composite.value}</Text>
            <Text style={[styles.compTag, { color: composite.color }]}>{composite.tag}</Text>
          </View>
        </View>
        <Svg width={46} height={46} viewBox="0 0 46 46">
          <G rotation={-90} originX={23} originY={23}>
            <Circle cx={23} cy={23} r={RING_R} fill="none" stroke={colors.border2} strokeWidth={5} />
            <Circle
              cx={23}
              cy={23}
              r={RING_R}
              fill="none"
              stroke={composite.color}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={ringOffset}
            />
          </G>
        </Svg>
      </View>

      <Pressable onPress={onLog}>
        {({ pressed }) => (
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.btn, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnLabel}>{ctaLabel}</Text>
          </LinearGradient>
        )}
      </Pressable>
    </View>
  );
}

export type { CheckinSlider as CheckinSlidersSlider, CheckinComposite as CheckinSlidersComposite };

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    gap: 14,
    padding: 16,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },

  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 16, letterSpacing: -0.16, color: colors.text },
  sub: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.3, color: colors.textFaint },

  trio: { flexDirection: 'column', gap: 16 },
  cell: { flexDirection: 'column', gap: 7 },

  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  name: { fontSize: 11.5, color: colors.textDim, letterSpacing: 0.1 },
  meta: { flexDirection: 'row', alignItems: 'baseline', gap: 7 },
  zone: { fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 1 },
  val: { fontFamily: fonts.mono, fontWeight: '700', fontSize: 15, lineHeight: 15 },

  wrap: { position: 'relative', height: 10, marginVertical: 2, justifyContent: 'center' },
  track: { ...StyleSheet.absoluteFillObject, height: 10, borderRadius: 999, opacity: 0.5 },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 10,
    borderRadius: 999,
    shadowOpacity: 0.7,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    width: 18,
    height: 18,
    marginTop: -9,
    marginLeft: -9,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 4,
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },

  comp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compL: { flexDirection: 'column', gap: 3 },
  compK: { fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 1.2, color: colors.textFaint },
  compV: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  compNum: { fontFamily: fonts.display, fontWeight: '700', fontSize: 34, lineHeight: 34, letterSpacing: -1 },
  compTag: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1 },

  btn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  btnLabel: { fontFamily: fonts.ui, fontWeight: '700', fontSize: 13.5, letterSpacing: 0.13, color: '#0a0c14' },
});
