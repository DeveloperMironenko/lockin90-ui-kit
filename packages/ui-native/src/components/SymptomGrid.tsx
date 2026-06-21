import { type ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';

/** A symptom tile in the quick-log grid. */
export interface SymptomTile {
  /** Symptom name, e.g. "Headache". */
  name: string;
  /** Tile icon. Defaults to a generic dot glyph when omitted. */
  icon?: ReactNode;
  /** Frequency / recency line, e.g. "4 this mo · 3d ago". */
  freq: string;
  /** Count tag shown top-right, e.g. "4×". Hidden when omitted. */
  count?: string;
  /** Whether the symptom is logged today (tints the tile + shows severity dot). */
  logged?: boolean;
  /** Severity-dot color. Shown only when `logged`. */
  severityColor?: string;
  /** Log-button label override (defaults to "Log" / "Logged"). */
  logLabel?: string;
}

/** A recent symptom entry in the list below the grid. */
export interface SymptomRecent {
  /** Symptom title, e.g. "Brain fog". */
  title: string;
  /** Severity badge label, e.g. "mild". Hidden when empty. */
  severity?: string;
  /** Tone of the severity badge + leading dot. */
  severityTone?: ChipTone;
  /** Leading dot color. Defaults to the tone color. */
  dotColor?: string;
  /** Context line, e.g. "Morning · no breakfast before 11am". */
  sub: string;
  /** Timestamp, e.g. "9:10am". */
  time: string;
}

export interface SymptomGridProps {
  /** Eyebrow over the grid. */
  eyebrow?: string;
  /** Manage-link label. Hidden when empty. */
  manageLabel?: string;
  /** Called when the manage link is pressed. */
  onManage?: () => void;
  /** Quick-log tiles. */
  tiles?: SymptomTile[];
  /** Eyebrow over the recent list. */
  recentEyebrow?: string;
  /** Window tag shown on the recent header, e.g. "6 days". Hidden when empty. */
  recentTag?: string;
  /** Recent symptom entries. */
  recent?: SymptomRecent[];
  /** Called with a tile when its Log button is pressed. */
  onLog?: (tile: SymptomTile) => void;
  style?: StyleProp<ViewStyle>;
}

/** Tone → leading-dot color, mirrors the web `var(--token)` mapping. */
const TONE_COLOR: Record<ChipTone, string> = {
  default: colors.textFaint,
  high: colors.zoneHigh,
  mid: colors.zoneMid,
  low: colors.zoneLow,
  accent: colors.accent,
};

const PlusIcon = () => (
  <Svg width={11} height={11} viewBox="0 0 24 24">
    <Path d="M12 5v14M5 12h14" stroke={colors.textDim} strokeWidth={2} fill="none" />
  </Svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <Svg width={11} height={11} viewBox="0 0 24 24">
    <Path d="M20 6 9 17l-5-5" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const DefaultTileIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9} stroke={colors.textDim} strokeWidth={1.8} fill="none" />
  </Svg>
);

const DEFAULT_TILES: SymptomTile[] = [
  {
    name: 'Headache',
    freq: '4 this mo · 3d ago',
    count: '4×',
    icon: (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={9} stroke={colors.accent2} strokeWidth={1.8} fill="none" />
        <Path d="M8 9l2 2M16 9l-2 2M9 16h6" stroke={colors.accent2} strokeWidth={1.8} fill="none" />
      </Svg>
    ),
  },
  {
    name: 'Bloating',
    freq: '7 this mo · 4d ago',
    count: '7×',
    icon: (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M7 11a5 5 0 0 1 10 0c0 3-1.5 4.5-1.5 7h-7C8.5 15.5 7 14 7 11z"
          stroke={colors.zoneMid}
          strokeWidth={1.8}
          fill="none"
        />
        <Path d="M9 21h6" stroke={colors.zoneMid} strokeWidth={1.8} fill="none" />
      </Svg>
    ),
  },
  {
    name: 'Brain fog',
    freq: '6 this mo · today',
    count: '6×',
    logged: true,
    severityColor: colors.accent,
    logLabel: 'Logged · mild',
    icon: (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M9.5 2a2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0-1 4.5 2.5 2.5 0 0 0 2 4.5 2.5 2.5 0 0 0 5 0V4.5A2.5 2.5 0 0 0 9.5 2z"
          stroke={colors.accent}
          strokeWidth={1.8}
          fill="none"
        />
        <Path
          d="M14.5 2a2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1 1 4.5"
          stroke={colors.accent}
          strokeWidth={1.8}
          fill="none"
        />
      </Svg>
    ),
  },
  {
    name: 'Sore',
    freq: '9 this mo · today',
    count: '9×',
    logged: true,
    severityColor: colors.zoneMid,
    logLabel: 'Logged · mod',
    icon: (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M6 4l2 6m0 0l-2 10m2-10h8m0 0l2-6m-2 6l2 10"
          stroke={colors.zoneMid}
          strokeWidth={1.8}
          fill="none"
        />
        <Circle cx={12} cy={6} r={2.4} stroke={colors.zoneMid} strokeWidth={1.8} fill="none" />
      </Svg>
    ),
  },
  {
    name: 'Anxious',
    freq: '3 this mo · 1d ago',
    count: '3×',
    icon: (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M12 3v3m0 12v3m9-9h-3M6 12H3m13.5-6.5-2 2m-7 7-2 2m11 0-2-2m-7-7-2-2"
          stroke={colors.accent3}
          strokeWidth={1.8}
          fill="none"
        />
      </Svg>
    ),
  },
  {
    name: 'Low mood',
    freq: '5 this mo · 2d ago',
    count: '5×',
    icon: (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={9} stroke={colors.zoneLow} strokeWidth={1.8} fill="none" />
        <Path
          d="M8 15.5c1-1.2 2.4-1.8 4-1.8s3 .6 4 1.8M9 10h.01M15 10h.01"
          stroke={colors.zoneLow}
          strokeWidth={1.8}
          fill="none"
        />
      </Svg>
    ),
  },
  {
    name: 'Nausea',
    freq: '2 this mo · 5d ago',
    count: '2×',
    icon: (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10z"
          stroke={colors.accent2}
          strokeWidth={1.8}
          fill="none"
        />
      </Svg>
    ),
  },
  {
    name: 'Congested',
    freq: '4 this mo · 6d ago',
    count: '4×',
    icon: (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M12 4v6m0 0c-2 0-4 1.5-4 4.5S10 20 12 20s4-2.5 4-5-2-4.5-4-4.5z"
          stroke={colors.accent3}
          strokeWidth={1.8}
          fill="none"
        />
        <Path d="M9 7l-2-2m10 2 2-2" stroke={colors.accent3} strokeWidth={1.8} fill="none" />
      </Svg>
    ),
  },
];

const DEFAULT_RECENT: SymptomRecent[] = [
  {
    title: 'Brain fog',
    severity: 'mild',
    severityTone: 'accent',
    dotColor: colors.accent,
    sub: 'Morning · no breakfast before 11am',
    time: '9:10am',
  },
  {
    title: 'Sore legs',
    severity: 'moderate',
    severityTone: 'mid',
    dotColor: colors.zoneMid,
    sub: 'Post-workout · heavy squat session',
    time: 'Today 2:40p',
  },
  {
    title: 'Headache',
    severity: 'severe',
    severityTone: 'low',
    dotColor: colors.zoneLow,
    sub: '2 days after poor sleep + 8.4h screen',
    time: 'Jun 8',
  },
];

/** Symptom log grid — a quick-log grid of common symptoms (selectable tiles
 *  with icon, frequency and a Log button; logged-today tiles tint mint and
 *  carry a severity dot) plus a recent-entries list below. Mirrors the web
 *  `SymptomGrid` 1:1. */
export function SymptomGrid({
  eyebrow = 'Log a symptom',
  manageLabel = 'Manage →',
  onManage,
  tiles = DEFAULT_TILES,
  recentEyebrow = 'Recent entries',
  recentTag = '6 days',
  recent = DEFAULT_RECENT,
  onLog,
  style,
}: SymptomGridProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.head}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <View style={styles.ln} />
        {manageLabel ? (
          <Pressable onPress={onManage} hitSlop={6}>
            <Text style={styles.manage}>{manageLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.grid}>
        {tiles.map((tile, i) => {
          const logged = !!tile.logged;
          const label = tile.logLabel ?? (logged ? 'Logged' : 'Log');
          const sev = tile.severityColor ?? colors.zoneHigh;
          return (
            <View key={`${tile.name}-${i}`} style={[styles.tile, logged && styles.tileLogged]}>
              <View style={styles.tileTop}>
                <View style={styles.ico}>
                  {tile.icon ?? <DefaultTileIcon />}
                  {logged ? (
                    <View style={[styles.sev, { backgroundColor: sev, shadowColor: sev }]} />
                  ) : null}
                </View>
                {tile.count ? <Chip label={tile.count} style={styles.tag} /> : null}
              </View>
              <Text style={styles.name}>{tile.name}</Text>
              <Text style={styles.freq}>{tile.freq}</Text>
              <Pressable
                onPress={() => onLog?.(tile)}
                style={[styles.log, logged && styles.logLogged]}
                hitSlop={4}
              >
                {logged ? <CheckIcon color={colors.zoneHigh} /> : <PlusIcon />}
                <Text style={[styles.logLabel, logged && styles.logLabelLogged]}>{label}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {recent.length ? (
        <>
          <View style={[styles.head, styles.recentHead]}>
            <Text style={styles.eyebrow}>{recentEyebrow}</Text>
            <View style={styles.ln} />
            {recentTag ? <Chip label={recentTag} style={styles.tag} /> : null}
          </View>
          <View style={styles.recent}>
            {recent.map((r, i) => {
              const tone = r.severityTone ?? 'default';
              const dot = r.dotColor ?? TONE_COLOR[tone];
              const last = i === recent.length - 1;
              return (
                <View key={`${r.title}-${i}`} style={[styles.item, last && styles.itemLast]}>
                  <View style={[styles.dot, { backgroundColor: dot, shadowColor: dot }]} />
                  <View style={styles.main}>
                    <View style={styles.titleRow}>
                      <Text style={styles.title}>{r.title}</Text>
                      {r.severity ? <Chip tone={tone} label={r.severity} style={styles.tag} /> : null}
                    </View>
                    <Text style={styles.sub}>{r.sub}</Text>
                  </View>
                  <Text style={styles.time}>{r.time}</Text>
                </View>
              );
            })}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 14,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 11 },
  recentHead: { marginTop: 13 },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  ln: { flex: 1, height: 1, backgroundColor: colors.border },
  manage: { fontFamily: fonts.mono, fontSize: 9, color: colors.accent },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    flexGrow: 1,
    flexBasis: 132,
    padding: 11,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  tileLogged: { borderColor: 'rgba(52,245,197,0.32)', backgroundColor: 'rgba(52,245,197,0.06)' },
  tileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ico: {
    position: 'relative',
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  sev: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.bg1,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  name: { fontWeight: '600', fontSize: 12, color: colors.text, marginTop: 7 },
  freq: { fontFamily: fonts.mono, fontSize: 8.5, color: colors.textFaint, marginTop: 2 },
  log: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    marginTop: 9,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  logLogged: { borderColor: 'rgba(52,245,197,0.4)', backgroundColor: 'rgba(52,245,197,0.08)' },
  logLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.textDim },
  logLabelLogged: { color: colors.zoneHigh },

  recent: {
    marginTop: 11,
    paddingHorizontal: 13,
    paddingVertical: 11,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemLast: { borderBottomWidth: 0 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  main: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  title: { fontWeight: '600', fontSize: 11.5, color: colors.text },
  sub: { fontSize: 10, color: colors.textDim, marginTop: 1, lineHeight: 14 },
  time: { fontFamily: fonts.mono, fontSize: 8.5, color: colors.textFaint },

  tag: { paddingVertical: 1, paddingHorizontal: 6 },
});
