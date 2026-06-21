import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';
import { BarFill } from './BarFill';

/** Volume status of a muscle group this week. */
export type MuscleTone = 'opt' | 'high' | 'low';

export interface MuscleGroup {
  /** group name, e.g. "Chest" */
  name: string;
  /** weekly working-set count */
  sets: number;
  /** volume status — drives the status chip and leading dot */
  tone: MuscleTone;
  /** bar fill fraction (0..1) */
  fill: number;
  /** leading dot / accent color (hex); defaults from the tone */
  dot?: string;
}

export interface MuscleMapProps {
  /** muscle groups, in display order */
  groups?: MuscleGroup[];
  /** caption side label, e.g. "front" */
  side?: string;
  /** caption period label, e.g. "this week" */
  period?: string;
  style?: StyleProp<ViewStyle>;
}

/** tone → status chip tone + label */
const STATUS: Record<MuscleTone, { chip: ChipTone; label: string }> = {
  opt: { chip: 'high', label: 'optimal' },
  high: { chip: 'mid', label: 'high' },
  low: { chip: 'low', label: 'low' },
};

/** tone → default leading-dot color (hex resolved from tokens) */
const DOT: Record<MuscleTone, string> = {
  opt: colors.zoneHigh,
  high: colors.zoneMid,
  low: 'rgba(255,255,255,0.28)',
};

/** Faithful reproduction of the design's front-body example. */
const DEFAULT_GROUPS: MuscleGroup[] = [
  { name: 'Chest', sets: 14, tone: 'opt', fill: 0.7, dot: colors.zoneHigh },
  { name: 'Shoulders', sets: 11, tone: 'opt', fill: 0.55, dot: colors.accent2 },
  { name: 'Back', sets: 8, tone: 'low', fill: 0.4, dot: 'rgba(255,255,255,0.28)' },
  { name: 'Quads', sets: 16, tone: 'high', fill: 0.92, dot: colors.zoneMid },
  { name: 'Arms', sets: 6, tone: 'low', fill: 0.3, dot: 'rgba(255,255,255,0.28)' },
];

/* region tint fills/strokes, mirroring the web .lk-musc-reg.* rules */
const BASE_FILL = 'rgba(255,255,255,0.05)';
const BASE_STROKE = 'rgba(255,255,255,0.13)';
const OPT2_FILL = 'rgba(34,211,238,0.42)';
const OPT_FILL = 'rgba(52,245,197,0.5)';
const FAINT_FILL = 'rgba(255,255,255,0.07)';
const FAINT_STROKE = 'rgba(255,255,255,0.16)';
const HIGH_FILL = 'rgba(255,176,32,0.5)';

const SVG_W = 148;
const SVG_H = (SVG_W * 220) / 110;

/** Muscle activation map — a front-body silhouette tinted by weekly training
 *  volume beside per-group weekly-sets bars and status chips. Same prop API as
 *  the web component. */
export function MuscleMap({
  groups = DEFAULT_GROUPS,
  side = 'front',
  period = 'this week',
  style,
}: MuscleMapProps) {
  return (
    <View style={[styles.musc, style]}>
      <View style={styles.fig}>
        <Svg
          width={SVG_W}
          height={SVG_H}
          viewBox="0 0 110 220"
          accessibilityLabel="Front body: chest and shoulders optimal, quads over-volume"
        >
          {/* untinted body outline */}
          <G fill={BASE_FILL} stroke={BASE_STROKE} strokeWidth={1}>
            <Circle cx={55} cy={20} r={13} />
            <Path d="M40 36 H70 L76 60 L70 100 H40 L34 60 Z" />
            <Path d="M30 42 L22 86 L28 90 L38 56 Z" />
            <Path d="M80 42 L88 86 L82 90 L72 56 Z" />
            <Path d="M41 100 L40 160 L48 200 L54 200 L54 120 Z" />
            <Path d="M69 100 L70 160 L62 200 L56 200 L56 120 Z" />
          </G>
          {/* volume-tinted regions */}
          <Path d="M38 42 L31 50 L36 60 L44 50 Z" fill={OPT2_FILL} stroke={colors.accent2} strokeWidth={1} />
          <Path d="M72 42 L79 50 L74 60 L66 50 Z" fill={OPT2_FILL} stroke={colors.accent2} strokeWidth={1} />
          <Path d="M42 44 L54 44 L54 64 L44 62 Z" fill={OPT_FILL} stroke={colors.zoneHigh} strokeWidth={1} />
          <Path d="M56 44 L68 44 L66 62 L56 64 Z" fill={OPT_FILL} stroke={colors.zoneHigh} strokeWidth={1} />
          <Path d="M47 68 L63 68 L62 94 L48 94 Z" fill={FAINT_FILL} stroke={FAINT_STROKE} strokeWidth={1} />
          <Path d="M41 112 L40 152 L48 156 L52 124 Z" fill={HIGH_FILL} stroke={colors.zoneMid} strokeWidth={1} />
          <Path d="M69 112 L70 152 L62 156 L58 124 Z" fill={HIGH_FILL} stroke={colors.zoneMid} strokeWidth={1} />
        </Svg>
        <Text style={styles.cap}>
          <Text style={styles.capStrong}>{side.toUpperCase()}</Text>
          {`  ·  ${period.toUpperCase()}`}
        </Text>
      </View>

      <View style={styles.list}>
        {groups.map((g) => {
          const status = STATUS[g.tone];
          return (
            <View style={styles.row} key={g.name}>
              <View style={styles.nameCell}>
                <View style={[styles.dot, { backgroundColor: g.dot ?? DOT[g.tone], shadowColor: g.dot ?? DOT[g.tone] }]} />
                <Text style={styles.name} numberOfLines={1}>
                  {g.name}
                </Text>
              </View>
              <View style={styles.barCell}>
                <BarFill value={g.fill} style={styles.bar} />
                <Text style={styles.sets}>
                  {g.sets}
                  <Text style={styles.setsUnit}> sets</Text>
                </Text>
              </View>
              <View style={styles.statusCell}>
                <Chip tone={status.chip} dot label={status.label} style={styles.statusChip} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export type { MuscleGroup as MuscleMapGroup };

const styles = StyleSheet.create({
  musc: { flexDirection: 'column', gap: 22, alignItems: 'center' },

  fig: { flexDirection: 'column', alignItems: 'center', gap: 11 },
  cap: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    letterSpacing: 1.1,
    color: colors.textFaint,
  },
  capStrong: { color: colors.textDim, fontWeight: '600' },

  list: { flexDirection: 'column', gap: 11, alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11 },

  nameCell: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 88 },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 3,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 2,
  },
  name: { fontSize: 13.5, fontWeight: '600', color: colors.text, flexShrink: 1 },

  barCell: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  // fixed-width status cell so the flex bar stays the same width on every row
  statusCell: { width: 108 },
  // chip fills the cell + centers its content → all chips same width, centered
  statusChip: { width: '100%', justifyContent: 'center' },
  bar: { flex: 1 },
  sets: { fontFamily: fonts.mono, fontSize: 12.5, fontWeight: '600', color: colors.textDim, minWidth: 52 },
  setsUnit: { color: colors.textFaint, fontWeight: '400', fontSize: 10 },
});
