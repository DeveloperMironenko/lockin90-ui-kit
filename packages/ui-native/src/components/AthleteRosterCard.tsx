import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';

/** Zone tint for a metric tile / sparkline color. */
export type AthleteZone = 'high' | 'mid' | 'low';

/** One tile in the 4-up metric grid. */
export interface AthleteMetric {
  /** mono uppercase label, e.g. "Energy" */
  label: string;
  /** big value, e.g. "78" or "7.4" */
  value: string;
  /** small mono unit suffix, e.g. "h" or "%" */
  unit?: string;
  /** zone tint for the left rail */
  zone?: AthleteZone;
}

/** One athlete shown as a roster card. */
export interface Athlete {
  /** display name, e.g. "Leo P" */
  name: string;
  /** avatar initials, e.g. "LP" */
  initials: string;
  /** status chip text, e.g. "on track" / "needs attention" */
  status: string;
  /** chip tone for the status pill (defaults: high if online, low if not) */
  statusTone?: ChipTone;
  /** last-sync line, e.g. "Synced 12m ago · Garmin" */
  sync: string;
  /** true → online (mint dot + cta avatar); false → offline (red dot + violet avatar) */
  online?: boolean;
  /** the 4 metric tiles (energy / sleep / readiness / compliance) */
  metrics: AthleteMetric[];
  /** 7 trend values (any scale) drawn as the footer sparkline, oldest → newest */
  trend: number[];
  /** zone color for the sparkline stroke (defaults to the worst metric zone) */
  trendZone?: AthleteZone;
  /** optional amber attention flag → highlights the card + shows an alert chip */
  flag?: string;
}

export interface AthleteRosterCardProps {
  /** athletes to render as a stacked roster (matches the phone-width web view) */
  athletes?: Athlete[];
  style?: StyleProp<ViewStyle>;
}

const ZONE_COLOR: Record<AthleteZone, string> = {
  high: colors.zoneHigh,
  mid: colors.zoneMid,
  low: colors.zoneLow,
};

/** Faithful reproduction of the design's "Athlete roster" example. */
const DEFAULT_ATHLETES: Athlete[] = [
  {
    name: 'Leo P',
    initials: 'LP',
    status: 'on track',
    statusTone: 'high',
    sync: 'Synced 12m ago · Garmin',
    online: true,
    metrics: [
      { label: 'Energy', value: '78', zone: 'high' },
      { label: 'Sleep', value: '7.4', unit: 'h', zone: 'high' },
      { label: 'Readiness', value: '81', zone: 'high' },
      { label: 'Compliance', value: '92', unit: '%', zone: 'high' },
    ],
    trend: [20, 19, 21, 13, 11, 9, 6],
    trendZone: 'high',
  },
  {
    name: 'Ava R',
    initials: 'AR',
    status: 'needs attention',
    statusTone: 'low',
    sync: 'Synced 2h ago · Whoop',
    online: false,
    metrics: [
      { label: 'Energy', value: '54', zone: 'mid' },
      { label: 'Sleep', value: '5.9', unit: 'h', zone: 'low' },
      { label: 'Readiness', value: '47', zone: 'low' },
      { label: 'Compliance', value: '61', unit: '%', zone: 'low' },
    ],
    trend: [7, 11, 10, 17, 19, 21, 23],
    trendZone: 'low',
    flag: '⚠ recovery dropping',
  },
];

/** the sparkline viewBox — points are normalized into this box */
const SPARK_W = 84;
const SPARK_H = 26;
const SPARK_PAD = 6;

/** build the `points` string for a trend series, normalized into the spark viewBox */
function sparkPoints(trend: number[]): string {
  const n = trend.length;
  if (n === 0) return '';
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const span = max - min || 1;
  return trend
    .map((v, i) => {
      const x = n <= 1 ? 0 : +((i / (n - 1)) * SPARK_W).toFixed(2);
      const frac = (v - min) / span;
      const y = +(SPARK_PAD + (1 - frac) * (SPARK_H - SPARK_PAD * 2)).toFixed(2);
      return `${x},${y}`;
    })
    .join(' ');
}

/** 135deg gradient → top-left → bottom-right */
const GRAD_START = { x: 0, y: 0 };
const GRAD_END = { x: 1, y: 1 };

/**
 * Athlete roster card — a coach-side card (or stacked list) for athletes: a
 * gradient avatar with an online/offline status dot, name + status chip + last
 * sync, a 4-tile zone-tinted metric grid (energy / sleep / readiness /
 * compliance), an optional amber attention flag + alert chip, and a 7-day trend
 * sparkline. Same prop API as the web component; defaults reproduce the design.
 */
export function AthleteRosterCard({ athletes = DEFAULT_ATHLETES, style }: AthleteRosterCardProps) {
  return (
    <View style={[styles.grid, style]}>
      {athletes.map((a, ai) => {
        const online = a.online ?? true;
        const statusTone: ChipTone = a.statusTone ?? (online ? 'high' : 'low');
        const trendZone: AthleteZone = a.trendZone ?? (a.flag ? 'low' : 'high');
        return (
          <View key={ai} style={[styles.card, a.flag && styles.cardFlag]}>
            {/* header */}
            <View style={styles.top}>
              <View style={styles.avWrap}>
                <LinearGradient colors={online ? gradients.cta.stops : gradients.violet.stops} start={GRAD_START} end={GRAD_END} style={styles.av}>
                  <Text style={styles.avText}>{a.initials}</Text>
                </LinearGradient>
                <View style={styles.st}>
                  <View style={[styles.dot, { backgroundColor: online ? colors.zoneHigh : colors.zoneLow, shadowColor: online ? colors.zoneHigh : colors.zoneLow }]} />
                </View>
              </View>
              <View style={styles.id}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {a.name}
                  </Text>
                  <Chip tone={statusTone} dot label={a.status} style={styles.statusChip} />
                </View>
                <Text style={styles.spec} numberOfLines={1}>
                  {a.sync}
                </Text>
              </View>
              <Svg width={18} height={18} viewBox="0 0 24 24" style={styles.chev}>
                <Path d="M9 6l6 6-6 6" fill="none" stroke={colors.textFaint} strokeWidth={1.8} />
              </Svg>
            </View>

            {/* metric grid */}
            <View style={styles.metrics}>
              {a.metrics.map((m, mi) => (
                <View key={mi} style={styles.tile}>
                  <View style={[styles.tileRail, { backgroundColor: ZONE_COLOR[m.zone ?? 'high'] }]} />
                  <Text style={styles.k}>{m.label.toUpperCase()}</Text>
                  <View style={styles.vRow}>
                    <Text style={styles.v}>{m.value}</Text>
                    {m.unit ? <Text style={styles.u}>{m.unit}</Text> : null}
                  </View>
                </View>
              ))}
            </View>

            {/* footer — optional alert chip, 7-day trend + sparkline */}
            <View style={styles.foot}>
              {a.flag ? (
                <View style={styles.alertWrap}>
                  <Chip tone="low" dot label={a.flag} />
                </View>
              ) : null}
              <View style={styles.footRow}>
                <View style={styles.syncWrap}>
                  <Svg width={12} height={12} viewBox="0 0 24 24">
                    <Path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8" fill="none" stroke={colors.textFaint} strokeWidth={1.7} />
                  </Svg>
                  <Text style={styles.syncText}>7-day trend</Text>
                </View>
                <Svg width={84} height={26} viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} style={styles.spark}>
                  <Polyline
                    points={sparkPoints(a.trend)}
                    fill="none"
                    stroke={ZONE_COLOR[trendZone]}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 16 },

  card: {
    padding: 18,
    paddingHorizontal: 20,
    gap: 14,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  cardFlag: {
    borderColor: 'rgba(255,176,32,0.55)',
    shadowColor: colors.zoneMid,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  // header
  top: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avWrap: { width: 50, height: 50, position: 'relative' },
  av: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avText: { fontFamily: fonts.display, fontWeight: '700', fontSize: 17, color: '#07080d' },
  st: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg1,
    borderWidth: 2,
    borderColor: colors.bg1,
  },
  dot: { width: 8, height: 8, borderRadius: 4, shadowOpacity: 0.9, shadowRadius: 6 },
  id: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontFamily: fonts.display, fontWeight: '700', fontSize: 16, letterSpacing: -0.16, color: colors.text, flexShrink: 1 },
  statusChip: { paddingVertical: 2, paddingHorizontal: 7 },
  spec: { fontSize: 12, color: colors.textDim, marginTop: 1 },
  chev: { flexShrink: 0 },

  // metric grid
  metrics: { flexDirection: 'row', gap: 8 },
  tile: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tileRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  k: { fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.9 },
  vRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3, marginTop: 2 },
  v: { fontFamily: fonts.display, fontWeight: '700', fontSize: 17, letterSpacing: -0.17, color: colors.text },
  u: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, fontWeight: '400' },

  // footer
  foot: { gap: 9, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  alertWrap: { alignSelf: 'flex-start' },
  footRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  syncWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  syncText: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint },
  spark: { marginLeft: 'auto' },
});
