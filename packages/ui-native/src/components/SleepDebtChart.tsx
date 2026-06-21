import { useId, type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip, type ChipTone } from './Chip';

/** A chip shown in the pay-it-back footer. */
export interface SleepDebtChip {
  label: string;
  tone?: ChipTone;
}

export interface SleepDebtChartProps {
  /** display title, e.g. "Sleep · last 14 days" */
  title?: string;
  /** mono sub-eyebrow under the title, e.g. "hours slept vs need" */
  sub?: string;
  /** big cumulative-debt readout, e.g. "−4.2 h" */
  debt?: string;
  /** mono label under the readout, e.g. "cumulative debt" */
  debtLabel?: string;
  /** hours slept per night, oldest → newest (newest is "today") */
  nights?: number[];
  /** the nightly sleep target in hours (drives the dashed need line) */
  need?: number;
  /** weekday ticks under the chart (spread evenly) */
  axis?: string[];
  /** pay-it-back footer copy (rich node) */
  footer?: ReactNode;
  /** chips on the right of the footer */
  chips?: SleepDebtChip[];
  /** accessible description of the chart shape */
  ariaLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** chart viewBox + the hours window the y-axis spans (top = HOURS_MAX, bottom = HOURS_MIN) */
const VB_W = 620;
const VB_H = 156;
const PLOT_TOP = 21; // y of HOURS_MAX
const PLOT_BOTTOM = 138; // y of HOURS_MIN
const HOURS_MAX = 9;
const HOURS_MIN = 4.5;

/** y-axis gridlines + labels (hours → y is derived) */
const Y_TICKS = [9, 7.5, 6, 4.5];

/** Faithful reproduction of the design's "Sleep · last 14 days" example. */
const DEFAULT_NIGHTS = [7.8, 7.2, 7.6, 6.7, 7.0, 6.3, 7.3, 6.1, 6.6, 5.9, 6.9, 5.6, 6.2, 5.3];
const DEFAULT_AXIS = ['Mon', 'Wed', 'Fri', 'Sun', 'Tue', 'Thu', 'Sat'];
const DEFAULT_CHIPS: SleepDebtChip[] = [
  { label: '−4.2 h debt', tone: 'mid' },
  { label: '▼ trending down', tone: 'low' },
];
const DEFAULT_ARIA = '14-night sleep trend below the 7.5h need line, −4.2h debt.';

/** map a sleep-hours value to its y in the chart viewBox */
function hoursToY(h: number): number {
  const frac = (h - HOURS_MIN) / (HOURS_MAX - HOURS_MIN);
  return +(PLOT_BOTTOM - frac * (PLOT_BOTTOM - PLOT_TOP)).toFixed(2);
}

/** evenly spaced x for the i-th of n points across the full width */
function xAt(i: number, n: number): number {
  if (n <= 1) return 0;
  return +((i / (n - 1)) * VB_W).toFixed(2);
}

/**
 * Sleep-debt trend — a 14-night sleep-hours gradient area chart drawn in SVG
 * against a dashed "need 7.5h" target line, with a cumulative-debt readout, a
 * today divider on the newest night, weekday x labels, a legend and a
 * pay-it-back footer with chips. Same prop API as the web component.
 */
export function SleepDebtChart({
  title = 'Sleep · last 14 days',
  sub = 'hours slept vs need',
  debt = '−4.2 h',
  debtLabel = 'cumulative debt',
  nights = DEFAULT_NIGHTS,
  need = 7.5,
  axis = DEFAULT_AXIS,
  footer = (
    <Text>
      <Text style={styles.footStrong}>Pay it back:</Text> +35m for 4 nights clears it. Debt over{' '}
      <Text style={styles.footStrong}>4h</Text> is when energy reliably drops.
    </Text>
  ),
  chips = DEFAULT_CHIPS,
  ariaLabel = DEFAULT_ARIA,
  style,
}: SleepDebtChartProps) {
  const fillId = useId();
  const strokeId = useId();

  const n = nights.length;
  const points = nights.map((h, i) => ({ x: xAt(i, n), y: hoursToY(h) }));
  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${lineD} L${VB_W},${VB_H} L0,${VB_H} Z`;
  const needY = hoursToY(need);
  const last = points[n - 1];

  return (
    <Card style={[styles.debt, style]}>
      {/* header: title + sub, cumulative-debt readout */}
      <View style={styles.head}>
        <View style={styles.headLeft}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>{sub}</Text>
        </View>
        <View style={styles.readout}>
          {/* native has no gradient text; the design's violet→amber gradient reads as accent */}
          <Text style={styles.num}>{debt}</Text>
          <Text style={styles.numlbl}>{debtLabel}</Text>
        </View>
      </View>

      {/* chart */}
      <View accessibilityRole="image" accessibilityLabel={ariaLabel}>
        <Svg width="100%" height={156} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={fillId} x1="0" y1="0" x2="0" y2={VB_H} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={colors.cyan} stopOpacity={0.26} />
              <Stop offset="1" stopColor={colors.cyan} stopOpacity={0} />
            </LinearGradient>
            <LinearGradient id={strokeId} x1="0" y1="0" x2={VB_W} y2="0" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#7C5CFF" />
              <Stop offset="0.5" stopColor="#22D3EE" />
              <Stop offset="1" stopColor="#34F5C5" />
            </LinearGradient>
          </Defs>

          {/* faint horizontal gridlines (skip the need-line row, drawn separately) */}
          {Y_TICKS.filter((h) => h !== need).map((h) => (
            <Line key={`g${h}`} x1={0} y1={hoursToY(h)} x2={VB_W} y2={hoursToY(h)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          ))}

          {/* y-axis hour labels */}
          {Y_TICKS.map((h) => (
            <SvgText key={`y${h}`} x={2} y={hoursToY(h) - 2} fontFamily={fonts.mono} fontSize={8} fill={colors.textFaint}>
              {`${h}h`}
            </SvgText>
          ))}

          {/* dashed need line */}
          <Line x1={0} y1={needY} x2={VB_W} y2={needY} stroke={colors.mint} strokeWidth={1.5} strokeDasharray="5 5" opacity={0.7} />
          <SvgText x={VB_W - 2} y={needY - 4} textAnchor="end" fontFamily={fonts.mono} fontSize={8} fill={colors.mint}>
            {`NEED ${need}h`}
          </SvgText>

          {/* gradient area + gradient stroke line */}
          <Path d={areaD} fill={`url(#${fillId})`} opacity={0.9} />
          <Path
            d={lineD}
            fill="none"
            stroke={`url(#${strokeId})`}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* today divider + dot on the newest night */}
          <Line x1={last.x} y1={6} x2={last.x} y2={VB_H - 10} stroke={colors.violet} strokeWidth={1.5} strokeDasharray="3 4" opacity={0.6} />
          <SvgText x={last.x - 4} y={14} textAnchor="end" fontFamily={fonts.mono} fontSize={8} fill={colors.textDim} letterSpacing={1}>
            TODAY
          </SvgText>
          <Circle cx={last.x} cy={last.y} r={4} fill={colors.accent} stroke={colors.bg1} strokeWidth={2} />
        </Svg>
      </View>

      {/* weekday x axis */}
      <View style={styles.axis}>
        {axis.map((t, i) => (
          <Text key={i} style={styles.axisTick}>
            {t}
          </Text>
        ))}
      </View>

      {/* legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: colors.accent }]} />
          <Text style={styles.legendText}>Hours slept</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDash}>
            <View style={[styles.legendDashSeg, { backgroundColor: colors.mint }]} />
            <View style={[styles.legendDashSeg, { backgroundColor: colors.mint }]} />
          </View>
          <Text style={styles.legendText}>Need · {need}h</Text>
        </View>
      </View>

      {/* pay-it-back footer with chips */}
      <View style={styles.foot}>
        <View style={styles.footTextWrap}>
          <Text style={styles.footText}>{footer}</Text>
        </View>
        <View style={styles.chips}>
          {chips.map((c, i) => (
            <Chip key={i} tone={c.tone} label={c.label} />
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  debt: { padding: 20 },

  head: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 },
  headLeft: { flexShrink: 1 },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 16, letterSpacing: -0.32, color: colors.text },
  sub: {
    fontFamily: fonts.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    color: colors.textFaint,
    marginTop: 5,
  },
  readout: { alignItems: 'flex-end', gap: 8 },
  num: { fontFamily: fonts.display, fontWeight: '700', fontSize: 34, letterSpacing: -1.02, lineHeight: 34, color: colors.accent },
  numlbl: { fontFamily: fonts.mono, fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 1.33, color: colors.textFaint },

  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  axisTick: { flex: 1, textAlign: 'center', fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendSwatch: { width: 14, height: 3, borderRadius: 2 },
  legendDash: { width: 14, height: 3, flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden' },
  legendDashSeg: { width: 4, height: 3, borderRadius: 2 },
  legendText: { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim },

  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  footTextWrap: { flexShrink: 1 },
  footText: { fontSize: 12.5, color: colors.textDim, lineHeight: 18 },
  footStrong: { color: colors.text, fontWeight: '600' },
  chips: { flexDirection: 'row', gap: 8, flexShrink: 0 },
});
