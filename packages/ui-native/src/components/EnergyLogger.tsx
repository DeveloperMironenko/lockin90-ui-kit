import { useId } from 'react';
import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { LinearGradient as ExpoGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Card } from './Card';

/** Which of the 5 mood faces to draw — controls the eyes + mouth geometry. */
export type MoodFace = 'awful' | 'low' | 'okay' | 'good' | 'great';

/** A single quick-mood option in the 5-face row. */
export interface EnergyLoggerMood {
  /** which face to render (eyes + mouth shape) */
  face: MoodFace;
  /** uppercase mono caption under the face, e.g. "Good" */
  label: string;
  /** stroke/accent color for the face glyph */
  color: string;
  /** whether this face is the currently selected mood (exactly one expected) */
  selected?: boolean;
}

export interface EnergyLoggerProps {
  /** display question, top-left */
  question?: string;
  /** mono uppercase timestamp, top-right */
  timestamp?: string;
  /** big ring readout value, 0–100 */
  score?: number;
  /** zone label under the score, e.g. "High" */
  zone?: string;
  /** slider position 0–100 (drives the gradient fill + thumb) */
  sliderValue?: number;
  /** low-end scale caption, e.g. "drained" */
  lowLabel?: string;
  /** high-end scale caption, e.g. "charged" */
  highLabel?: string;
  /** the two numeric scale ticks between the captions, e.g. [34, 67] */
  scaleTicks?: [number, number];
  /** the 5 mood faces (one selected) */
  moods?: EnergyLoggerMood[];
  /** CTA button label */
  ctaLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Ring geometry — matches the design's 108×108 viewBox, r=48. */
const RING_R = 48;
const RING_C = 2 * Math.PI * RING_R; // 301.59…

/** Faithful reproduction of the design example's five mood faces. */
const DEFAULT_MOODS: EnergyLoggerMood[] = [
  { face: 'awful', label: 'Awful', color: colors.zoneLow },
  { face: 'low', label: 'Low', color: colors.zoneMid },
  { face: 'okay', label: 'Okay', color: colors.cyan },
  { face: 'good', label: 'Good', color: colors.accent3, selected: true },
  { face: 'great', label: 'Great', color: colors.lime },
];

/** Draw the eyes + mouth (and brows on "great") for a given face color. */
function FaceGlyph({ face, color }: { face: MoodFace; color: string }) {
  const eyes = (
    <>
      <Circle cx={12.5} cy={15} r={1.6} fill={color} />
      <Circle cx={23.5} cy={15} r={1.6} fill={color} />
    </>
  );
  switch (face) {
    case 'awful':
      return (
        <Svg width={26} height={26} viewBox="0 0 36 36" fill="none">
          <Circle cx={18} cy={18} r={15} stroke={color} strokeWidth={2} />
          {eyes}
          <Path d="M12 25c1.6-3 4-4.2 6-4.2S22.4 22 24 25" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'low':
      return (
        <Svg width={26} height={26} viewBox="0 0 36 36" fill="none">
          <Circle cx={18} cy={18} r={15} stroke={color} strokeWidth={2} />
          {eyes}
          <Path d="M12.5 24h11" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'okay':
      return (
        <Svg width={26} height={26} viewBox="0 0 36 36" fill="none">
          <Circle cx={18} cy={18} r={15} stroke={color} strokeWidth={2} />
          {eyes}
          <Path d="M13 22.5c1.4 1.4 8.6 1.4 10 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'good':
      return (
        <Svg width={26} height={26} viewBox="0 0 36 36" fill="none">
          <Circle cx={18} cy={18} r={15} stroke={color} strokeWidth={2} />
          {eyes}
          <Path d="M12 21c1.6 3 4 4.2 6 4.2s4.4-1.2 6-4.2" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'great':
      return (
        <Svg width={26} height={26} viewBox="0 0 36 36" fill="none">
          <Circle cx={18} cy={18} r={15} stroke={color} strokeWidth={2} />
          <Path d="M10 14.5c1-1.4 3-1.4 4 0M22 14.5c1-1.4 3-1.4 4 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Path
            d="M11 20c1.8 3.6 4.4 5 7 5s5.2-1.4 7-5z"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            fill="rgba(168,255,53,0.12)"
          />
        </Svg>
      );
  }
}

/** Inline energy logger — the signature quick-log surface: a big energy ring /
 *  readout on the left, an energy slider + a 5-face mood row (one selected) on
 *  the right, and a gradient "Log now" CTA. Same prop API as the web component.
 *  Static surface (the slider fill and ring fill are derived from the values). */
export function EnergyLogger({
  question = "How's your energy?",
  timestamp = '9:42am · Wed',
  score = 72,
  zone = 'High',
  sliderValue = 72,
  lowLabel = 'drained',
  highLabel = 'charged',
  scaleTicks = [34, 67],
  moods = DEFAULT_MOODS,
  ctaLabel = 'Log now',
  style,
}: EnergyLoggerProps) {
  const uid = useId();
  const gradId = `lk-elog-grad-${uid}`;
  // progress fraction of the ring (0–1), drawn as a dash offset on a -90° rotated circle
  const frac = Math.max(0, Math.min(1, score / 100));
  const dashOffset = RING_C * (1 - frac);
  const fillPct = Math.max(0, Math.min(100, sliderValue));

  return (
    <Card style={[styles.elog, style]}>
      <View style={styles.head}>
        <Text style={styles.q}>{question}</Text>
        <Text style={styles.ts}>{timestamp.toUpperCase()}</Text>
      </View>

      <View style={styles.body}>
        {/* big energy ring + centered readout */}
        <View style={styles.ring}>
          <Svg width={108} height={108} viewBox="0 0 108 108">
            <Defs>
              <LinearGradient id={gradId} x1="0" y1="0" x2="108" y2="108" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={colors.accent} />
                <Stop offset="0.55" stopColor={colors.cyan} />
                <Stop offset="1" stopColor={colors.lime} />
              </LinearGradient>
            </Defs>
            <Circle cx={54} cy={54} r={RING_R} fill="none" stroke={colors.border} strokeWidth={7} />
            <G rotation={-90} origin="54, 54">
              <Circle
                cx={54}
                cy={54}
                r={RING_R}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={dashOffset}
              />
            </G>
          </Svg>
          <View style={styles.ringCenter} pointerEvents="none">
            <Text style={styles.ringNum}>{score}</Text>
            <Text style={styles.ringZone}>{zone.toUpperCase()}</Text>
          </View>
        </View>

        {/* right column: slider + mood faces + CTA */}
        <View style={styles.ctl}>
          <View style={styles.sliderWrap}>
            <ExpoGradient
              colors={[colors.zoneLow, colors.zoneLow, colors.zoneMid, colors.zoneMid, colors.zoneHigh, colors.zoneHigh]}
              locations={[0, 0.28, 0.4, 0.6, 0.74, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sliderTrack}
            />
            <ExpoGradient
              colors={gradients.cta.stops as unknown as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.sliderFill, { width: `${fillPct}%` }]}
            />
            <View style={[styles.thumb, { left: `${fillPct}%` }]} />
          </View>
          <View style={styles.scale}>
            <Text style={styles.scaleEnd}>{lowLabel}</Text>
            <Text style={styles.scaleEnd}>{scaleTicks[0]}</Text>
            <Text style={styles.scaleEnd}>{scaleTicks[1]}</Text>
            <Text style={styles.scaleEnd}>{highLabel}</Text>
          </View>

          <View style={styles.faces}>
            {moods.map((m, i) => (
              <Pressable
                key={i}
                style={[styles.face, m.selected && styles.faceSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected: !!m.selected }}
                accessibilityLabel={m.label}
              >
                <FaceGlyph face={m.face} color={m.color} />
                <Text style={[styles.faceName, m.selected && styles.faceNameSelected]}>{m.label.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable accessibilityRole="button" accessibilityLabel={ctaLabel}>
            {({ pressed }) => (
              <ExpoGradient
                colors={gradients.cta.stops as unknown as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.cta, pressed && styles.ctaPressed]}
              >
                <Svg width={15} height={15} viewBox="0 0 24 24">
                  <Path d="M5 12l5 5L20 6" fill="none" stroke="#0A0A12" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.ctaLabel}>{ctaLabel}</Text>
              </ExpoGradient>
            )}
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  elog: { padding: 16, gap: 14 },

  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  q: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, letterSpacing: -0.15, color: colors.text },
  ts: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.9, color: colors.textFaint },

  body: { flexDirection: 'row', alignItems: 'center', gap: 18 },

  ring: { position: 'relative', width: 108, height: 108 },
  ringCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: 1 },
  ringNum: { fontFamily: fonts.display, fontWeight: '700', fontSize: 38, lineHeight: 38, letterSpacing: -1.14, color: colors.zoneHigh },
  ringZone: { fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 1.36, color: colors.zoneHigh },

  ctl: { flex: 1, minWidth: 0 },

  sliderWrap: { position: 'relative', height: 20, justifyContent: 'center', marginVertical: 2 },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    borderRadius: radii.pill,
    opacity: 0.55,
  },
  sliderFill: { position: 'absolute', left: 0, height: 10, borderRadius: radii.pill },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -10,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: colors.accent,
  },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  scaleEnd: { fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 0.34, color: colors.textFaint },

  faces: { flexDirection: 'row', justifyContent: 'space-between', gap: 5, marginVertical: 11 },
  face: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  faceSelected: {
    backgroundColor: 'rgba(124,92,255,0.12)',
    borderColor: 'rgba(124,92,255,0.4)',
    transform: [{ scale: 1.08 }],
  },
  faceName: { fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.32, color: colors.textDim },
  faceNameSelected: { color: colors.text },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 11,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
  },
  ctaPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  ctaLabel: { fontFamily: fonts.ui, fontWeight: '700', fontSize: 12.5, letterSpacing: 0.13, color: '#0A0A12' },
});
