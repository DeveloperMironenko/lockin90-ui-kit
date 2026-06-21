import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type DimensionValue } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

/** Tone of a distribution zone — drives dot color + bar fill/glow. */
export type ZoneTone = 'high' | 'mid' | 'low';

/** One row in the zone-distribution list. */
export interface ConfidenceZone {
  /** zone label, e.g. "High" */
  name: string;
  /** share of time spent in this zone, 0..100 */
  pct: number;
  /** mono sub-line, e.g. "13 / 34 slots" */
  sub?: string;
  /** color/glow tone */
  tone: ZoneTone;
}

/** The labelled model-confidence meter. */
export interface ConfidenceMeter {
  /** confidence percentage, 0..100 */
  pct: number;
  /** sample size, rendered as "n = <n> events" */
  n: number;
}

export interface ConfidenceZonesProps {
  /** model-confidence meter (fill + % + low→high labels) */
  confidence?: ConfidenceMeter;
  /** label above the confidence meter */
  confidenceLabel?: string;
  /** label above the zone-distribution list */
  zonesLabel?: string;
  /** mono count shown beside the zone-distribution label */
  zonesCount?: string;
  /** zone-distribution rows */
  zones?: ConfidenceZone[];
  style?: StyleProp<ViewStyle>;
}

/** map a tone to its resolved color (dots + row % + bar fill) */
const TONE_COLOR: Record<ZoneTone, string> = {
  high: colors.zoneHigh,
  mid: colors.zoneMid,
  low: colors.zoneLow,
};

/** Faithful reproduction of the design's "Confidence & zones" example. */
const DEFAULT_CONFIDENCE: ConfidenceMeter = { pct: 84, n: 412 };
const DEFAULT_ZONES: ConfidenceZone[] = [
  { name: 'High', pct: 38, sub: '13 / 34 slots', tone: 'high' },
  { name: 'Moderate', pct: 44, sub: '15 / 34 slots', tone: 'mid' },
  { name: 'Low', pct: 18, sub: '6 / 34 slots', tone: 'low' },
];

/** clamp a 0..100 percentage to a 0..100 width string */
function widthPct(pct: number): DimensionValue {
  return `${Math.max(0, Math.min(100, pct))}%` as DimensionValue;
}

/** Confidence & zones — two stacked intelligence widgets in one card: a labelled
 *  model-confidence meter and a zone-distribution list over thin per-tone bars.
 *  Same prop API as the web component. */
export function ConfidenceZones({
  confidence = DEFAULT_CONFIDENCE,
  confidenceLabel = 'Model confidence',
  zonesLabel = 'Time in zone',
  zonesCount = 'last 30d',
  zones = DEFAULT_ZONES,
  style,
}: ConfidenceZonesProps) {
  return (
    <View style={[styles.card, style]}>
      {/* model-confidence meter */}
      <View style={styles.block}>
        <View style={styles.head}>
          <Text style={styles.ttl}>{confidenceLabel}</Text>
          <Text style={styles.cnt}>n = {confidence.n} events</Text>
        </View>
        <View style={styles.meter}>
          <View style={styles.meterTrack}>
            <View style={[styles.meterFill, { width: widthPct(confidence.pct) }]} />
          </View>
          <Text style={styles.pct}>
            {Math.round(confidence.pct)}
            <Text style={styles.pctUnit}>%</Text>
          </Text>
        </View>
        <View style={styles.ends}>
          <Text style={styles.endLabel}>low</Text>
          <Text style={[styles.endLabel, styles.endHi]}>high</Text>
        </View>
      </View>

      {/* zone-distribution list + bars */}
      <View style={[styles.block, styles.blockDivided]}>
        <View style={styles.head}>
          <Text style={styles.ttl}>{zonesLabel}</Text>
          <Text style={styles.cnt}>{zonesCount}</Text>
        </View>

        <View style={styles.list}>
          {zones.map((zone, i) => (
            <View style={styles.row} key={`${zone.name}-${i}`}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: TONE_COLOR[zone.tone], shadowColor: TONE_COLOR[zone.tone] },
                ]}
              />
              <View style={styles.rowText}>
                <Text style={styles.name}>{zone.name}</Text>
                {zone.sub ? <Text style={styles.sub}>{zone.sub}</Text> : null}
              </View>
              <Text style={[styles.rpct, { color: TONE_COLOR[zone.tone] }]}>{Math.round(zone.pct)}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.bars}>
          {zones.map((zone, i) => (
            <View style={styles.barTrack} key={`${zone.name}-bar-${i}`}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: widthPct(zone.pct),
                    backgroundColor: TONE_COLOR[zone.tone],
                    shadowColor: TONE_COLOR[zone.tone],
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 22,
  },

  block: { paddingVertical: 13 },
  blockDivided: { borderTopWidth: 1, borderTopColor: colors.border },

  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 10 },
  ttl: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.95, textTransform: 'uppercase', color: colors.textDim },
  cnt: { fontFamily: fonts.mono, fontSize: 8.5, color: colors.textFaint },

  // confidence meter
  meter: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  meterTrack: {
    flex: 1,
    height: 9,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.zoneHigh,
    shadowColor: colors.zoneHigh,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  pct: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 19,
    letterSpacing: -0.38,
    color: colors.zoneHigh,
    minWidth: 44,
    textAlign: 'right',
  },
  pctUnit: { fontSize: 11, color: colors.textFaint, fontFamily: fonts.mono, fontWeight: '400' },

  ends: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  endLabel: { fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.96, textTransform: 'uppercase', color: colors.textFaint },
  endHi: { color: colors.zoneHigh },

  // zone-distribution list
  list: { flexDirection: 'column', gap: 11 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 4,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  rowText: { flex: 1 },
  name: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 12, color: colors.text },
  sub: { fontFamily: fonts.mono, fontSize: 8.5, color: colors.textFaint, marginTop: 1 },
  rpct: { fontFamily: fonts.display, fontWeight: '700', fontSize: 17, textAlign: 'right' },

  // thin per-tone bars
  bars: { flexDirection: 'column', gap: 7, marginTop: 11 },
  barTrack: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radii.pill,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
});
