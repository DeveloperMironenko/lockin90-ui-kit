import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/** Where the measured value sits relative to its optimal band. */
export type BiomarkerStatus = 'optimal' | 'warn' | 'out';
/** Direction of the recent trend. */
export type BiomarkerTrend = 'up' | 'down' | 'flat';

export interface BiomarkerRowProps {
  /** Biomarker name, e.g. "HDL cholesterol". */
  name?: string;
  /** Mono subtitle under the name, e.g. "Lipid panel · cardio". */
  subtitle?: string;
  /** Measured value (drives the value text and the marker position). */
  value?: number;
  /** Unit label, e.g. "mg/dL". */
  unit?: string;
  /** Status of the value — colors the value text and the range marker. */
  status?: BiomarkerStatus;
  /** Scale minimum (left edge of the range track). */
  min?: number;
  /** Scale maximum (right edge of the range track). */
  max?: number;
  /** Low end of the optimal band, in value units. */
  optimalLow?: number;
  /** High end of the optimal band, in value units. */
  optimalHigh?: number;
  /** Trend direction — colors and shapes the trend spark + delta. */
  trend?: BiomarkerTrend;
  /** Trend delta label, e.g. "+7". */
  delta?: string;
  style?: StyleProp<ViewStyle>;
}

/** Map a value across [min,max] to a clamped 0..100 percentage number. */
function pct(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  const frac = (value - min) / (max - min);
  return Math.max(0, Math.min(1, frac)) * 100;
}

const TREND: Record<BiomarkerTrend, { path: string; stroke: string; color: string; glyph: string }> = {
  up: { path: 'M0,18 L19,16 L39,12 L58,9 L78,6', stroke: colors.zoneHigh, color: colors.zoneHigh, glyph: '▲' },
  down: { path: 'M0,8 L19,11 L39,10 L58,13 L78,15', stroke: colors.zoneLow, color: colors.zoneLow, glyph: '▼' },
  flat: { path: 'M0,13 L19,12 L39,13 L58,12 L78,13', stroke: colors.textFaint, color: colors.textFaint, glyph: '—' },
};

const STATUS_COLOR: Record<BiomarkerStatus, string> = {
  optimal: colors.text,
  warn: colors.zoneMid,
  out: colors.zoneLow,
};
const MARKER_COLOR: Record<BiomarkerStatus, string> = {
  optimal: colors.zoneHigh,
  warn: colors.zoneMid,
  out: colors.zoneLow,
};

/**
 * Lab biomarker row: name + status-colored value/unit, a low/optimal/high
 * reference band with a positioned value marker, and a trend spark + delta.
 * Mirrors the web `BiomarkerRow` 1:1.
 */
export function BiomarkerRow({
  name = 'HDL cholesterol',
  subtitle = 'Lipid panel · cardio',
  value = 62,
  unit = 'mg/dL',
  status = 'optimal',
  min = 30,
  max = 100,
  optimalLow = 40,
  optimalHigh = 90,
  trend = 'up',
  delta = '+7',
  style,
}: BiomarkerRowProps) {
  const t = TREND[trend];
  const low = pct(optimalLow, min, max);
  const high = pct(optimalHigh, min, max);
  const pos = pct(value, min, max);

  return (
    <View style={[styles.row, style]}>
      <View style={styles.head}>
        <View style={styles.nameCol}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {subtitle ? <Text style={styles.bsub}>{subtitle}</Text> : null}
        </View>
        <View style={styles.valCol}>
          <Text style={[styles.v, { color: STATUS_COLOR[status] }]}>{value}</Text>
          <Text style={styles.u}>{unit}</Text>
        </View>
      </View>

      <View style={styles.range}>
        {/* track — red base with an optimal band overlaid */}
        <View style={styles.track}>
          <View style={styles.trackRed} />
          <View
            style={[styles.band, { left: `${low}%`, right: `${100 - high}%` }]}
          />
          <View
            style={[
              styles.marker,
              { left: `${pos}%`, backgroundColor: MARKER_COLOR[status], shadowColor: MARKER_COLOR[status] },
            ]}
          />
        </View>
        <View style={styles.scale}>
          <Text style={styles.scaleTxt}>{min}</Text>
          <Text style={[styles.scaleTxt, styles.opt]}>optimal</Text>
          <Text style={styles.scaleTxt}>{max}</Text>
        </View>
      </View>

      <View style={styles.trend}>
        <Svg width={78} height={26} viewBox="0 0 78 26">
          <Path d={t.path} fill="none" stroke={t.stroke} strokeWidth={2} strokeLinecap="round" />
        </Svg>
        {delta ? (
          <Text style={[styles.td, { color: t.color }]}>
            {t.glyph} {delta}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 18 },
  nameCol: { flex: 1, minWidth: 0 },
  name: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 14, color: colors.text },
  bsub: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginTop: 2 },
  valCol: { flexDirection: 'row', alignItems: 'baseline' },
  v: { fontFamily: fonts.display, fontWeight: '700', fontSize: 21, letterSpacing: -0.4 },
  u: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint, marginLeft: 3 },

  range: { position: 'relative' },
  track: {
    position: 'relative',
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  trackRed: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,77,109,0.30)' },
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: 'rgba(52,245,197,0.42)',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
    marginTop: -7,
    borderWidth: 2.5,
    borderColor: '#0A0C14',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
    zIndex: 3,
  },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  scaleTxt: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textFaint },
  opt: { color: colors.zoneHigh },

  trend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  td: { fontFamily: fonts.mono, fontSize: 10 },
});

export interface BiomarkerGroupHeadProps {
  /** Panel / group title, e.g. "Metabolic". */
  title?: string;
  /** Mono count summary, e.g. "4 markers · 2 flagged". */
  count?: string;
  style?: StyleProp<ViewStyle>;
}

/** Optional header above a set of `BiomarkerRow`s — pulse icon + title + count. */
export function BiomarkerGroupHead({
  title = 'Metabolic',
  count = '4 markers · 2 flagged',
  style,
}: BiomarkerGroupHeadProps) {
  return (
    <View style={[headStyles.head, style]}>
      <Svg width={17} height={17} viewBox="0 0 24 24">
        <Path d="M3 12h4l3 8 4-16 3 8h4" stroke={colors.accent} strokeWidth={1.7} fill="none" />
      </Svg>
      <Text style={headStyles.title}>{title}</Text>
      {count ? <Text style={headStyles.count}>{count}</Text> : null}
    </View>
  );
}

const headStyles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 4 },
  title: { fontFamily: fonts.display, fontSize: 15, fontWeight: '700', color: colors.text },
  count: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginLeft: 'auto' },
});
