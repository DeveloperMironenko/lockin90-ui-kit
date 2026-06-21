import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type DimensionValue } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip } from './Chip';

/** A point on the concentration curve, in normalized chart space. */
export interface PkSample {
  /** position across the day, 0 (chart start) .. 1 (chart end) */
  x: number;
  /** concentration height, 0 (baseline / bottom) .. 1 (peak / top) */
  y: number;
}

/** A labeled caffeine dose, marked with a dot on the curve. */
export interface PkDose {
  /** position across the day, 0 .. 1 */
  x: number;
  /** concentration height at the dose, 0 .. 1 */
  y: number;
  /** mg label above the dot, e.g. "☕ 130mg" */
  label: string;
  /** time label below the dot, e.g. "7a" */
  time: string;
  /** render the dot in the warning color */
  warn?: boolean;
}

export interface CaffeineDecayCurveProps {
  /** substance name shown in the header */
  name?: string;
  /** half-life sub-line, e.g. "5h" */
  halfLife?: string;
  /** dose-count sub-line, e.g. "2 doses today" */
  dosesNote?: string;
  /** header status pill text (omit to hide) */
  status?: string;
  /** the concentration-over-day curve, left→right */
  samples?: PkSample[];
  /** labeled dose markers placed on the curve */
  doses?: PkDose[];
  /** sleep-cutoff vertical line position, 0 .. 1 (omit to hide) */
  cutoff?: number;
  /** label pinned to the cutoff line, e.g. "sleep 11pm" */
  cutoffLabel?: string;
  /** height of the dashed "threshold" horizontal line, 0 .. 1 (omit to hide) */
  threshold?: number;
  /** x-axis time ticks under the chart */
  axis?: string[];
  /** "active at bedtime" amount shown large, e.g. "~48 mg" */
  activeMg?: string;
  /** trailing readout prose after the amount; ReactNode for emphasis */
  readout?: ReactNode;
  /** warn chip at the end of the readout strip, e.g. "−6 sleep pts" */
  warnChip?: string;
  /** accessible description of the chart */
  ariaLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** chart viewBox + the inset the curve is plotted into (matches the design) */
const VB_W = 720;
const VB_H = 168;
/** the curve starts at x=30 and runs to x=720; full height 0..168 */
const PLOT_X0 = 30;
const PLOT_X1 = 720;
/** rendered chart height (px); the SVG scales to fill the card width */
const CHART_H = 168;
/** the three faint horizontal gridlines (as a share of height) */
const GRID_Y = [34 / VB_H, 74 / VB_H, 114 / VB_H];

const SOFT_FILL = 'rgba(255,176,32,0.22)';
const SOFT_FILL_FADE = 'rgba(255,176,32,0)';

/** Faithful reproduction of the design's caffeine example.
 *  y values are the design's pixel y mapped to 0 (top) .. 1 (bottom) via 1 - py/168,
 *  i.e. higher concentration = larger y here. */
const DEFAULT_SAMPLES: PkSample[] = [
  { x: 0, y: 1 - 118 / VB_H },
  { x: (70 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 42 / VB_H },
  { x: (110 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 56 / VB_H },
  { x: (150 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 68 / VB_H },
  { x: (190 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 80 / VB_H },
  { x: (230 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 90 / VB_H },
  { x: (270 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 100 / VB_H },
  { x: (310 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 86 / VB_H },
  { x: (350 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 72 / VB_H },
  { x: (390 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 82 / VB_H },
  { x: (430 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 92 / VB_H },
  { x: (470 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 100 / VB_H },
  { x: (510 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 107 / VB_H },
  { x: (550 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 112 / VB_H },
  { x: (590 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 116 / VB_H },
  { x: (630 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 119 / VB_H },
  { x: (660 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 121 / VB_H },
  { x: (690 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 123 / VB_H },
  { x: 1, y: 1 - 124 / VB_H },
];

const DEFAULT_DOSES: PkDose[] = [
  { x: (70 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 42 / VB_H, label: '☕ 130mg', time: '7a' },
  { x: (350 - PLOT_X0) / (PLOT_X1 - PLOT_X0), y: 1 - 72 / VB_H, label: '☕ 95mg', time: '1p' },
];

const DEFAULT_AXIS = ['6a', '12p', '6p', '12a'];

/** style for the emphasized clause in the default readout node (declared before
 *  DEFAULT_READOUT, which references it at module init) */
const READOUT_OVER = { color: colors.warn, fontWeight: '600' as const };

const DEFAULT_READOUT = (
  <Text>
    {' '}active at bedtime · <Text style={READOUT_OVER}>above your 30 mg threshold</Text>
  </Text>
);

const DEFAULT_ARIA = 'Caffeine decay across the day, ~48mg active at the 11pm sleep cutoff.';

/** Map a normalized sample to absolute SVG coordinates within the plot inset. */
function toXY(s: PkSample): { x: number; y: number } {
  return {
    x: PLOT_X0 + s.x * (PLOT_X1 - PLOT_X0),
    y: (1 - s.y) * VB_H,
  };
}

/** Caffeine decay (PK) curve — a pharmacokinetic concentration-over-day chart.
 *  Renders an SVG decay curve (gradient stroke + soft fill), labeled dose dots
 *  positioned over the chart, a dashed sleep-cutoff line + label, a faint
 *  threshold line, x-axis time ticks, a legend, and an "active at bedtime"
 *  readout with a warning chip. Same prop API as the web component. */
export function CaffeineDecayCurve({
  name = 'Caffeine',
  halfLife = '5h',
  dosesNote = '2 doses today',
  status = 'above threshold',
  samples = DEFAULT_SAMPLES,
  doses = DEFAULT_DOSES,
  cutoff = (630 - PLOT_X0) / (PLOT_X1 - PLOT_X0),
  cutoffLabel = 'sleep 11pm',
  threshold = 1 - 118 / VB_H,
  axis = DEFAULT_AXIS,
  activeMg = '~48 mg',
  readout = DEFAULT_READOUT,
  warnChip = '−6 sleep pts',
  ariaLabel = DEFAULT_ARIA,
  style,
}: CaffeineDecayCurveProps) {
  const pts = samples.map(toXY);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const first = pts[0];
  const last = pts[pts.length - 1];
  const fill = pts.length ? `${line} L${last.x.toFixed(1)},${VB_H} L${first.x.toFixed(1)},${VB_H} Z` : '';

  const threshY = threshold != null ? (1 - threshold) * VB_H : null;
  const cutX = cutoff != null ? PLOT_X0 + cutoff * (PLOT_X1 - PLOT_X0) : null;
  /** the cutoff line's left offset as a fraction of the whole chart width */
  const cutFrac = cutX != null ? cutX / VB_W : null;
  /** concentration y at the cutoff (for the small marker dot) */
  const cutY = threshY ?? VB_H * 0.71;

  return (
    <Card style={[styles.pk, style]}>
      {/* accent rail */}
      <View style={styles.rail} pointerEvents="none" />

      {/* header */}
      <View style={styles.head}>
        <View style={styles.title}>
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
              d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3"
              stroke={colors.zoneMid}
              strokeWidth={1.6}
              fill="none"
            />
          </Svg>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.half}>
              half-life <Text style={styles.halfStrong}>{halfLife}</Text> · {dosesNote}
            </Text>
          </View>
        </View>
        {status ? <Chip tone="mid" dot label={status} /> : null}
      </View>

      {/* chart */}
      <View style={styles.wrap}>
        <View
          style={{ height: CHART_H }}
          accessibilityRole="image"
          accessibilityLabel={ariaLabel}
        >
          <Svg width="100%" height={CHART_H} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="lkPkLine" x1="0" y1="0" x2={VB_W} y2="0" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={colors.zoneMid} />
                <Stop offset="1" stopColor={colors.zoneLow} />
              </LinearGradient>
              <LinearGradient id="lkPkFill" x1="0" y1="0" x2="0" y2={VB_H} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={SOFT_FILL} />
                <Stop offset="1" stopColor={SOFT_FILL_FADE} />
              </LinearGradient>
            </Defs>

            {/* faint horizontal gridlines */}
            {GRID_Y.map((g, i) => (
              <Line key={i} x1={0} y1={g * VB_H} x2={VB_W} y2={g * VB_H} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
            ))}

            {/* dashed threshold line */}
            {threshY != null && (
              <Line x1={0} y1={threshY} x2={VB_W} y2={threshY} stroke={colors.border2} strokeWidth={1} strokeDasharray="2 5" />
            )}

            {/* concentration fill + curve */}
            {fill ? <Path d={fill} fill="url(#lkPkFill)" opacity={0.85} /> : null}
            {line ? (
              <Path
                d={line}
                fill="none"
                stroke="url(#lkPkLine)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {/* dose marker dots on the curve */}
            {doses.map((d, i) => {
              const p = toXY(d);
              return (
                <Circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={d.warn ? colors.warn : colors.zoneMid}
                  stroke="#0c0f1a"
                  strokeWidth={2}
                />
              );
            })}

            {/* sleep-cutoff vertical line + the marker where it meets the curve */}
            {cutX != null && (
              <>
                <Line x1={cutX} y1={2} x2={cutX} y2={156} stroke={colors.zoneLow} strokeWidth={1.5} strokeDasharray="3 4" opacity={0.7} />
                <Circle cx={cutX} cy={cutY} r={3.5} fill={colors.zoneLow} stroke="#0c0f1a" strokeWidth={2} />
              </>
            )}
          </Svg>

          {/* cutoff label */}
          {cutFrac != null && cutoffLabel ? (
            <Text style={[styles.cutlabel, { left: `${(cutFrac * 100).toFixed(1)}%` as DimensionValue }]}>{cutoffLabel}</Text>
          ) : null}

          {/* labeled dose markers positioned over the chart */}
          {doses.map((d, i) => (
            <View
              key={i}
              style={[
                styles.dose,
                {
                  left: `${(((PLOT_X0 + d.x * (PLOT_X1 - PLOT_X0)) / VB_W) * 100).toFixed(1)}%` as DimensionValue,
                  top: (1 - d.y) * CHART_H,
                },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.dmg}>{d.label}</Text>
              <View style={[styles.doseDot, d.warn ? styles.doseDotWarn : null]} />
              <Text style={styles.dtime}>{d.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* x-axis time ticks */}
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
          <View style={[styles.legendSwatch, { backgroundColor: colors.zoneMid }]} />
          <Text style={styles.legendText}>concentration</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: colors.zoneMid }]} />
          <Text style={styles.legendText}>dose</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: colors.zoneLow }]} />
          <Text style={styles.legendText}>sleep cutoff</Text>
        </View>
      </View>

      {/* "active at bedtime" readout */}
      <View style={styles.readout}>
        <Text style={styles.active}>
          <Text style={styles.mg}>{activeMg}</Text>
          {readout}
        </Text>
        {warnChip ? <Chip tone="mid" dot label={warnChip} /> : null}
      </View>
    </Card>
  );
}

export type { PkSample as CaffeineSample, PkDose as CaffeineDose };

const styles = StyleSheet.create({
  pk: { padding: 16, overflow: 'hidden' },
  rail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.warn,
  },

  head: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 },
  title: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 },
  name: { fontFamily: fonts.display, fontWeight: '700', fontSize: 16, letterSpacing: -0.16, color: colors.text },
  half: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginTop: 2 },
  halfStrong: { color: colors.textDim, fontWeight: '500' },

  wrap: { position: 'relative', marginTop: 12 },

  cutlabel: {
    position: 'absolute',
    top: 4,
    marginLeft: -28,
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.zoneLow,
  },

  dose: { position: 'absolute', alignItems: 'center', marginLeft: -8, marginTop: -8 },
  dmg: { position: 'absolute', bottom: 22, fontFamily: fonts.mono, fontSize: 10, color: colors.textDim },
  doseDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.zoneMid,
    borderWidth: 2,
    borderColor: '#0c0f1a',
  },
  doseDotWarn: { backgroundColor: colors.warn },
  dtime: { position: 'absolute', top: 22, fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint },

  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  axisTick: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 11 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendSwatch: { width: 14, height: 3, borderRadius: 3 },
  legendText: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textDim },

  readout: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 13,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.glass2,
  },
  active: { fontSize: 13, color: colors.textDim, lineHeight: 19 },
  mg: { fontFamily: fonts.display, fontWeight: '700', fontSize: 19, letterSpacing: -0.38, color: colors.warn },
});
