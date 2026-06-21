import { useId, type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type DimensionValue } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip, type ChipTone } from './Chip';

/** A peak/dip annotation: an SVG dot at (x,y) plus an overlaid tag label. */
export interface ForecastMarker {
  /** dot x in viewBox units (0–560) */
  x: number;
  /** dot y in viewBox units (0–180) */
  y: number;
  /** tag eyebrow, e.g. "PEAK" / "DIP" */
  kind: string;
  /** big display value, e.g. "88" */
  value: string | number;
  /** trailing time, e.g. "10am" */
  at: string;
  /** label left position, e.g. "20%" */
  left: DimensionValue;
  /** label top position, e.g. 8 or "62%" */
  top: DimensionValue;
}

/** A single legend swatch + label. */
export interface ForecastLegendItem {
  label: string;
  /** swatch color */
  color: string;
}

/** A driver chip behind the forecast. */
export interface ForecastDriver {
  label: string;
  tone: ChipTone;
}

export interface EnergyForecastProps {
  /** card title, e.g. "Today's outlook" */
  title?: string;
  /** mono uppercase eyebrow under the title */
  subtitle?: string;
  /** trailing tone chip label, e.g. "FORECAST" */
  chipLabel?: string;
  /** tone of the trailing chip */
  chipTone?: ChipTone;
  /**
   * Forecast curve as an SVG path string in the 560×180 viewBox. The matching
   * gradient area is derived by closing this path down to the floor.
   */
  linePath?: string;
  /** x of the vertical "now" marker line, in viewBox units (0–560) */
  nowX?: number;
  /** y of the dot on the "now" marker line, in viewBox units */
  nowY?: number;
  /** "now" pill text, e.g. "NOW 9:42am" */
  nowLabel?: string;
  /** "now" pill left position, e.g. "10%" */
  nowLeft?: DimensionValue;
  /** "now" pill top offset */
  nowTop?: DimensionValue;
  /** peak annotation (high zone) */
  peak?: ForecastMarker;
  /** dip annotation (low zone) */
  dip?: ForecastMarker;
  /** x-axis hour ticks */
  axis?: string[];
  /** legend swatches */
  legend?: ForecastLegendItem[];
  /** plain-language outlook line */
  outlook?: ReactNode;
  /** drivers chip row */
  drivers?: ForecastDriver[];
  /** mono uppercase label before the driver chips */
  driversLabel?: string;
  /** accessible description of the chart shape */
  ariaLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const VB_W = 560;
const VB_H = 180;
const CHART_H = 168;

/** Faithful reproduction of the design's "Today's outlook" example. */
const DEFAULT_LINE =
  'M0,52 L40,40 L80,30 L112,28 L152,38 L192,56 L232,80 L268,104 L300,116 L320,118 L352,108 L392,90 L432,76 L472,66 L512,60 L560,58';
const DEFAULT_AXIS = ['9am', '11am', '1pm', '3pm', '5pm', '7pm', '9pm'];
const DEFAULT_PEAK: ForecastMarker = { x: 112, y: 28, kind: 'PEAK', value: 88, at: '10am', left: '20%', top: 8 };
const DEFAULT_DIP: ForecastMarker = { x: 320, y: 118, kind: 'DIP', value: 58, at: '3pm', left: '57%', top: '62%' };
const DEFAULT_LEGEND: ForecastLegendItem[] = [
  { label: 'HIGH', color: colors.zoneHigh },
  { label: 'MODERATE', color: colors.zoneMid },
  { label: 'LOW', color: colors.zoneLow },
  { label: 'now', color: colors.accent },
];
const DEFAULT_DRIVERS: ForecastDriver[] = [
  { label: 'good sleep +', tone: 'high' },
  { label: 'late caffeine −', tone: 'low' },
];
const nativeStrong = { color: colors.text, fontWeight: '700' as const };
const DEFAULT_OUTLOOK = (
  <Text>
    <Text style={nativeStrong}>Strong morning</Text> — protect your <Text style={nativeStrong}>10am peak</Text>; expect a{' '}
    <Text style={nativeStrong}>3pm dip</Text> after lunch, recovering through the evening.
  </Text>
);
const DEFAULT_ARIA =
  'Energy forecast next 12h: morning peak ~88 at 10am, 3pm dip ~58, evening recovery. Now 9:42am.';

/** Horizontal gridlines inside the chart (in viewBox y units). */
const GRID = [45, 90, 135];

/** Energy forecast — a 12h prediction card with a forecast curve (gradient area
 *  + glowing line), a "now" marker line, peak/dip annotation dots with overlaid
 *  tag labels, an hour x-axis, a HIGH/MODERATE/LOW + now legend, a plain-language
 *  outlook line and a drivers chip row. Same prop API as the web component. */
export function EnergyForecast({
  title = "Today's outlook",
  subtitle = 'Next 12 hours',
  chipLabel = 'FORECAST',
  chipTone = 'accent',
  linePath = DEFAULT_LINE,
  nowX = 56,
  nowY = 35,
  nowLabel = 'NOW 9:42am',
  nowLeft = '10%',
  nowTop = -2,
  peak = DEFAULT_PEAK,
  dip = DEFAULT_DIP,
  axis = DEFAULT_AXIS,
  legend = DEFAULT_LEGEND,
  outlook = DEFAULT_OUTLOOK,
  drivers = DEFAULT_DRIVERS,
  driversLabel = 'Drivers',
  ariaLabel = DEFAULT_ARIA,
  style,
}: EnergyForecastProps) {
  const uid = useId();
  const strokeId = `lk-fc-stroke-${uid}`;
  const fillId = `lk-fc-fill-${uid}`;
  // close the line down to the floor for the gradient area fill
  const areaPath = `${linePath} L${VB_W},${VB_H} L0,${VB_H} Z`;

  return (
    <Card style={[styles.fc, style]}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle.toUpperCase()}</Text> : null}
        </View>
        {chipLabel ? <Chip tone={chipTone} dot label={chipLabel} /> : null}
      </View>

      <View style={styles.curve} accessibilityRole="image" accessibilityLabel={ariaLabel}>
        <Svg width="100%" height={CHART_H} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={strokeId} x1="0" y1="0" x2={VB_W} y2="0" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#A8FF35" />
              <Stop offset="0.30" stopColor="#34F5C5" />
              <Stop offset="0.52" stopColor="#FFB020" />
              <Stop offset="0.70" stopColor="#34F5C5" />
              <Stop offset="1" stopColor="#22D3EE" />
            </LinearGradient>
            <LinearGradient id={fillId} x1="0" y1="0" x2="0" y2={VB_H} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={colors.accent} stopOpacity={0.3} />
              <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* horizontal gridlines */}
          {GRID.map((gy) => (
            <Line key={gy} x1={0} y1={gy} x2={VB_W} y2={gy} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          ))}

          {/* gradient area */}
          <Path d={areaPath} fill={`url(#${fillId})`} opacity={0.9} />
          {/* soft glow under the line (RN has no SVG drop-shadow filter) */}
          <Path
            d={linePath}
            fill="none"
            stroke={colors.accent3}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.18}
          />
          {/* glowing line */}
          <Path
            d={linePath}
            fill="none"
            stroke={`url(#${strokeId})`}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* "now" marker: vertical line + dot */}
          <Line x1={nowX} y1={10} x2={nowX} y2={170} stroke="rgba(124,92,255,0.5)" strokeWidth={1.5} strokeDasharray="3 4" />
          <Circle cx={nowX} cy={nowY} r={4.5} fill={colors.accent} stroke={colors.bg1} strokeWidth={2} />

          {/* peak + dip dots */}
          {peak ? <Circle cx={peak.x} cy={peak.y} r={4} fill={colors.zoneHigh} stroke={colors.bg1} strokeWidth={2} /> : null}
          {dip ? <Circle cx={dip.x} cy={dip.y} r={4} fill={colors.zoneLow} stroke={colors.bg1} strokeWidth={2} /> : null}
        </Svg>

        {/* overlaid tag labels */}
        <View style={[styles.nowTag, { left: nowLeft, top: nowTop }]}>
          <Text style={styles.nowTagText}>{nowLabel}</Text>
        </View>
        {peak ? (
          <View style={[styles.dotTag, styles.dotTagPeak, { left: peak.left, top: peak.top }]}>
            <Text style={styles.dotTagText}>
              <Text style={styles.dotTagPeakText}>{peak.kind} </Text>
              <Text style={styles.dotTagValue}>{peak.value}</Text>
              <Text style={styles.dotTagPeakText}> · {peak.at}</Text>
            </Text>
          </View>
        ) : null}
        {dip ? (
          <View style={[styles.dotTag, styles.dotTagDip, { left: dip.left, top: dip.top }]}>
            <Text style={styles.dotTagText}>
              <Text style={styles.dotTagDipText}>{dip.kind} </Text>
              <Text style={styles.dotTagValue}>{dip.value}</Text>
              <Text style={styles.dotTagDipText}> · {dip.at}</Text>
            </Text>
          </View>
        ) : null}

        <View style={styles.axis}>
          {axis.map((t, i) => (
            <Text key={i} style={styles.axisTick}>
              {t}
            </Text>
          ))}
        </View>

        <View style={styles.legend}>
          {legend.map((l, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: l.color }]} />
              <Text style={styles.legendLabel}>{l.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.pred}>
        <Svg width={16} height={16} viewBox="0 0 24 24" style={styles.predIcon}>
          <Path
            d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"
            fill="none"
            stroke={colors.accent}
            strokeWidth={1.6}
          />
        </Svg>
        <Text style={styles.predText}>{outlook}</Text>
      </View>

      <View style={styles.drivers}>
        {driversLabel ? <Text style={styles.driversLabel}>{driversLabel}</Text> : null}
        {drivers.map((d, i) => (
          <Chip key={i} tone={d.tone} dot label={d.label} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  fc: { padding: 17, gap: 14 },

  head: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  headText: { flex: 1 },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 16, color: colors.text, letterSpacing: -0.16 },
  sub: { marginTop: 3, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2, color: colors.textFaint },

  curve: { position: 'relative' },

  nowTag: {
    position: 'absolute',
    transform: [{ translateX: '-50%' }],
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(124,92,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.4)',
  },
  nowTagText: { fontFamily: fonts.mono, fontSize: 9.5, color: '#cbbcff' },

  dotTag: {
    position: 'absolute',
    transform: [{ translateX: '-50%' }],
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 6,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotTagPeak: { borderColor: 'rgba(52,245,197,0.35)' },
  dotTagDip: { borderColor: 'rgba(255,77,109,0.35)' },
  dotTagText: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.36 },
  dotTagValue: { fontFamily: fonts.display, fontWeight: '700' },
  dotTagPeakText: { color: colors.zoneHigh },
  dotTagDipText: { color: colors.zoneLow },

  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  axisTick: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textFaint },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 9, height: 9, borderRadius: 3 },
  legendLabel: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textDim },

  pred: {
    flexDirection: 'row',
    gap: 9,
    alignItems: 'flex-start',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  predIcon: { marginTop: 1 },
  predText: { flex: 1, fontSize: 11.5, color: colors.textDim, lineHeight: 16.7 },

  drivers: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 7 },
  driversLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.08,
    color: colors.textFaint,
    marginRight: 2,
  },
});
