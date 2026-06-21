import { useId } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip, type ChipTone } from './Chip';

/** One of the three readout stats under the curve. */
export interface GlycemicStat {
  /** mono uppercase label, e.g. "Peak" */
  label: string;
  /** big display value, e.g. "+42" */
  value: string;
  /** optional small unit appended to the value, e.g. "mg/dL" */
  unit?: string;
  /** mono caption under the value, e.g. "over baseline" */
  detail?: string;
  /** tones the caption: mid = amber, low = red (= "good"/clean return here) */
  detailTone?: 'mid' | 'low';
}

export interface GlycemicCurveProps {
  /** display title, e.g. the meal name */
  title?: string;
  /** mono uppercase eyebrow under the title */
  subtitle?: string;
  /** trailing tone chip label, e.g. "moderate" */
  chipLabel?: string;
  /** tone of the trailing chip */
  chipTone?: ChipTone;
  /**
   * Glucose curve as an SVG path string in the 280×120 viewBox (baseline at
   * y=88). The matching area fill is derived by closing this path to the floor.
   */
  linePath?: string;
  /** y of the dashed baseline line, in viewBox units (default 88) */
  baselineY?: number;
  /** peak marker position in viewBox units */
  peak?: { x: number; y: number; label: string };
  /** time-axis ticks under the chart */
  axis?: string[];
  /** the three readout stats */
  stats?: GlycemicStat[];
  /** accessible description of the chart shape */
  ariaLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const VB_W = 280;
const VB_H = 120;

/** Faithful reproduction of the design's "Chicken & rice bowl" example. */
const DEFAULT_LINE = 'M0,88 L26,84 L52,58 L78,30 L104,40 L132,54 L160,70 L190,82 L222,87 L280,88';
const DEFAULT_PEAK = { x: 78, y: 30, label: '+42' };
const DEFAULT_AXIS = ['0', '+30m', '+1h', '+2h'];
const DEFAULT_STATS: GlycemicStat[] = [
  { label: 'Peak', value: '+42', unit: 'mg/dL', detail: 'over baseline', detailTone: 'mid' },
  { label: 'Glycemic load', value: '21', detail: 'moderate', detailTone: 'mid' },
  { label: 'To baseline', value: '1h 50m', detail: 'clean return', detailTone: 'low' },
];
const DEFAULT_ARIA = 'Glucose response: +42 peak ~45min, back to baseline by 1h50m.';

/** Vertical guide lines inside the chart (in viewBox x units). */
const GUIDES = [70, 140, 210];

/** Glycemic curve — a post-meal blood-glucose response area chart (rise to a
 *  peak then back to baseline) with a dashed baseline, a peak marker, a time
 *  axis and a 3-stat readout row (peak / glycemic load / time-to-baseline)
 *  plus a tone chip. Same prop API as the web component. */
export function GlycemicCurve({
  title = 'Chicken & rice bowl',
  subtitle = 'glucose response · 2h',
  chipLabel = 'moderate',
  chipTone = 'mid',
  linePath = DEFAULT_LINE,
  baselineY = 88,
  peak = DEFAULT_PEAK,
  axis = DEFAULT_AXIS,
  stats = DEFAULT_STATS,
  ariaLabel = DEFAULT_ARIA,
  style,
}: GlycemicCurveProps) {
  const uid = useId();
  const strokeId = `lk-gl-stroke-${uid}`;
  const fillId = `lk-gl-fill-${uid}`;
  // close the line down to the floor for the gradient area fill
  const areaPath = `${linePath} L${VB_W},${VB_H} L0,${VB_H} Z`;

  return (
    <Card style={[styles.gl, style]}>
      <View style={styles.top}>
        <View style={styles.head}>
          <Text style={styles.ttl}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle.toUpperCase()}</Text> : null}
        </View>
        {chipLabel ? <Chip tone={chipTone} label={chipLabel} /> : null}
      </View>

      <View style={styles.chart} accessibilityRole="image" accessibilityLabel={ariaLabel}>
        <Svg width="100%" height={130} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={strokeId} x1="0" y1="0" x2={VB_W} y2="0" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#22D3EE" />
              <Stop offset="0.4" stopColor="#FFB020" />
              <Stop offset="0.62" stopColor="#FFB020" />
              <Stop offset="1" stopColor="#34F5C5" />
            </LinearGradient>
            <LinearGradient id={fillId} x1="0" y1="0" x2="0" y2={VB_H} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#FFB020" stopOpacity={0.3} />
              <Stop offset="0.55" stopColor="#22D3EE" stopOpacity={0.12} />
              <Stop offset="1" stopColor="#22D3EE" stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* dashed baseline */}
          <Line x1={0} y1={baselineY} x2={VB_W} y2={baselineY} stroke="rgba(52,245,197,0.30)" strokeWidth={1} strokeDasharray="4 5" />
          {/* vertical guides */}
          {GUIDES.map((gx) => (
            <Line key={gx} x1={gx} y1={8} x2={gx} y2={100} stroke={colors.border} strokeWidth={1} strokeDasharray="2 5" />
          ))}

          {/* gradient area + glowing line */}
          <Path d={areaPath} fill={`url(#${fillId})`} opacity={0.9} />
          <Path
            d={linePath}
            fill="none"
            stroke={`url(#${strokeId})`}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* peak marker: guide line + dot */}
          {peak ? (
            <>
              <Line x1={peak.x} y1={peak.y - 8} x2={peak.x} y2={100} stroke="rgba(255,176,32,0.4)" strokeWidth={1.1} strokeDasharray="2 4" />
              <Circle cx={peak.x} cy={peak.y} r={3.8} fill="#FFB020" stroke={colors.bg1} strokeWidth={2} />
            </>
          ) : null}
        </Svg>

        {/* peak label (overlaid; SVG text glyph metrics differ on RN) */}
        {peak ? (
          <Text style={styles.peakLbl}>{peak.label}</Text>
        ) : null}

        <View style={styles.axis}>
          {axis.map((t, i) => (
            <Text key={i} style={styles.axisTick}>
              {t}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.stats}>
        {stats.map((s, i) => (
          <View style={styles.stat} key={i}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={[styles.statValue, i === 0 && styles.statValuePeak]}>
              {s.value}
              {s.unit ? <Text style={styles.statUnit}>{s.unit}</Text> : null}
            </Text>
            {s.detail ? (
              <Text style={[styles.statDetail, s.detailTone === 'low' ? styles.detailLow : styles.detailMid]}>
                {s.detail}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  gl: { padding: 16, paddingHorizontal: 17 },

  top: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 11 },
  head: { flex: 1 },
  ttl: { fontFamily: fonts.display, fontWeight: '700', fontSize: 14, color: colors.text, lineHeight: 17.5 },
  sub: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.36, color: colors.textFaint, marginTop: 2 },

  chart: { position: 'relative' },
  peakLbl: {
    position: 'absolute',
    // peak dot sits ~28% across the 280-wide viewBox; nudge the label past it
    left: '30%',
    top: 8,
    fontFamily: fonts.mono,
    fontSize: 8.5,
    fontWeight: '600',
    color: colors.warn,
  },

  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingHorizontal: 1 },
  axisTick: { fontFamily: fonts.mono, fontSize: 8, color: colors.textFaint },

  stats: {
    flexDirection: 'row',
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 0.48,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  statValue: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 19.8,
    marginTop: 3,
    marginBottom: 2,
    color: colors.text,
  },
  statValuePeak: { color: colors.warn },
  statUnit: { fontFamily: fonts.mono, fontSize: 9, fontWeight: '500', color: colors.textDim },
  statDetail: { fontFamily: fonts.mono, fontSize: 8 },
  detailMid: { color: colors.zoneMid },
  detailLow: { color: colors.zoneLow },
});
