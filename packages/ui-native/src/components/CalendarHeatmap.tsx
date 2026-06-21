import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

export type CalendarZone = 'high' | 'mid' | 'low';

export interface CalendarDay {
  /** day-of-month number, e.g. 1..31 */
  day: number;
  /** the day's score, shown in the cell, e.g. 0..100 */
  value: number;
  /** intensity of the tint wash, 0..1 */
  level: number;
  /** energy zone — tints the wash + (low) flag. Defaults derived from value. */
  zone?: CalendarZone;
  /** mark as the current day (accent ring) */
  today?: boolean;
  /** force the low-day flag dot (defaults to true when zone is "low") */
  flagged?: boolean;
}

export interface CalendarHeatmapProps {
  /** big display title, e.g. "June 2026" */
  title?: string;
  /** mono month label between the nav arrows, e.g. "Jun 2026" */
  monthLabel?: string;
  /** day cells in calendar order */
  days?: CalendarDay[];
  /** blank cells before day 1 (0..6 — weekday offset, Mon-first) */
  leadingBlanks?: number;
  /** blank cells after the last day (pads the final week) */
  trailingBlanks?: number;
  /** weekday header labels (Mon-first) */
  weekdays?: string[];
  /** show the High/Moderate/Low/Flagged legend */
  legend?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ZONE_COLOR: Record<CalendarZone, string> = {
  high: colors.zoneHigh,
  mid: colors.zoneMid,
  low: colors.zoneLow,
};

/** Faithful reproduction of the design's June 2026 example. */
const DEFAULT_DAYS: CalendarDay[] = [
  { day: 1, value: 63, level: 0.4, zone: 'mid' },
  { day: 2, value: 77, level: 0.66, zone: 'high' },
  { day: 3, value: 91, level: 0.95, zone: 'high' },
  { day: 4, value: 71, level: 0.58, zone: 'high' },
  { day: 5, value: 41, level: 0.85, zone: 'low' },
  { day: 6, value: 66, level: 0.46, zone: 'mid' },
  { day: 7, value: 79, level: 0.7, zone: 'high' },
  { day: 8, value: 83, level: 0.78, zone: 'high' },
  { day: 9, value: 70, level: 0.56, zone: 'high' },
  { day: 10, value: 75, level: 0.62, zone: 'high' },
  { day: 11, value: 78, level: 0.68, zone: 'high', today: true },
  { day: 12, value: 60, level: 0.34, zone: 'mid' },
  { day: 13, value: 47, level: 0.78, zone: 'low' },
  { day: 14, value: 65, level: 0.44, zone: 'mid' },
  { day: 15, value: 76, level: 0.64, zone: 'high' },
  { day: 16, value: 80, level: 0.72, zone: 'high' },
  { day: 17, value: 87, level: 0.88, zone: 'high' },
  { day: 18, value: 73, level: 0.6, zone: 'high' },
  { day: 19, value: 62, level: 0.38, zone: 'mid' },
  { day: 20, value: 67, level: 0.48, zone: 'mid' },
  { day: 21, value: 85, level: 0.82, zone: 'high' },
  { day: 22, value: 38, level: 0.9, zone: 'low' },
  { day: 23, value: 64, level: 0.42, zone: 'mid' },
  { day: 24, value: 77, level: 0.66, zone: 'high' },
  { day: 25, value: 81, level: 0.74, zone: 'high' },
  { day: 26, value: 89, level: 0.92, zone: 'high' },
  { day: 27, value: 61, level: 0.36, zone: 'mid' },
  { day: 28, value: 69, level: 0.54, zone: 'high' },
  { day: 29, value: 82, level: 0.78, zone: 'high' },
  { day: 30, value: 68, level: 0.5, zone: 'mid' },
];

const DEFAULT_WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** convert a 0..1 level into a hex-alpha suffix for the tint fill */
function alphaHex(level: number): string {
  const a = Math.round(Math.max(0, Math.min(1, level)) * 255);
  return a.toString(16).padStart(2, '0');
}

/** derive a zone from the score when not given explicitly */
function zoneOf(d: CalendarDay): CalendarZone {
  if (d.zone) return d.zone;
  if (d.value < 50) return 'low';
  if (d.value < 70) return 'mid';
  return 'high';
}

function NavButton({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <View style={styles.navBtn}>
      <Svg viewBox="0 0 24 24" width={16} height={16}>
        <Path
          d={dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
          stroke={colors.textDim}
          strokeWidth={1.8}
          fill="none"
        />
      </Svg>
    </View>
  );
}

/** Calendar heatmap — a month grid where each day is a mini cell tinted by its
 *  energy score, with low-day flags, a today cell, weekday header and legend.
 *  Same prop API as the web component. */
export function CalendarHeatmap({
  title = 'June 2026',
  monthLabel = 'Jun 2026',
  days = DEFAULT_DAYS,
  leadingBlanks = 6,
  trailingBlanks = 5,
  weekdays = DEFAULT_WEEKDAYS,
  legend = true,
  style,
}: CalendarHeatmapProps) {
  return (
    <View style={[styles.cal, style]}>
      {/* header */}
      <View style={styles.top}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.nav}>
          <NavButton dir="prev" />
          <Text style={styles.mlabel}>{monthLabel}</Text>
          <NavButton dir="next" />
        </View>
      </View>

      {/* weekday header */}
      <View style={styles.dow}>
        {weekdays.map((w, i) => (
          <View key={i} style={styles.dowCell}>
            <Text style={styles.dowText}>{w}</Text>
          </View>
        ))}
      </View>

      {/* day grid */}
      <View style={styles.grid}>
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <View key={`lead-${i}`} style={styles.cellWrap}>
            <View style={styles.cellEmpty} />
          </View>
        ))}
        {days.map((d) => {
          const zone = zoneOf(d);
          const flagged = d.flagged ?? zone === 'low';
          const tint = ZONE_COLOR[zone] + alphaHex(d.level);
          const numColor = zone === 'low' ? colors.zoneLow : d.today ? colors.text : colors.textDim;
          const valColor = zone === 'low' ? colors.zoneLow : colors.text;
          return (
            <View key={d.day} style={styles.cellWrap}>
              <View style={[styles.cell, d.today && styles.cellToday]}>
                {/* flat tint wash (native equivalent of the radial intensity glow) */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: tint, borderRadius: radii.sm }]} pointerEvents="none" />
                {flagged && <View style={styles.flag} />}
                <Text style={[styles.num, { color: numColor }]}>{d.day}</Text>
                <Text style={[styles.val, { color: valColor }]}>{d.value}</Text>
              </View>
            </View>
          );
        })}
        {Array.from({ length: trailingBlanks }).map((_, i) => (
          <View key={`trail-${i}`} style={styles.cellWrap}>
            <View style={styles.cellEmpty} />
          </View>
        ))}
      </View>

      {/* legend */}
      {legend && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.zoneHigh }]} />
            <Text style={styles.legendText}>High</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.zoneMid }]} />
            <Text style={styles.legendText}>Moderate</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.zoneLow }]} />
            <Text style={styles.legendText}>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendFlag} />
            <Text style={styles.legendText}>Flagged day</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export type { CalendarDay as CalendarHeatmapDay };

const GRID_GAP = 8;
/** seven columns share the row minus six 8px gaps */
const CELL_BASIS = `${100 / 7}%` as const;

const styles = StyleSheet.create({
  cal: { flexDirection: 'column' },

  top: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  title: { fontFamily: fonts.display, fontSize: 19, fontWeight: '700', letterSpacing: -0.2, color: colors.text },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 'auto' },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  mlabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.textDim, minWidth: 96, textAlign: 'center' },

  dow: { flexDirection: 'row', marginTop: 4, marginBottom: 8 },
  dowCell: { flexBasis: CELL_BASIS, alignItems: 'center' },
  dowText: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 1.1, color: colors.textFaint, textTransform: 'uppercase' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -GRID_GAP / 2, marginVertical: -GRID_GAP / 2 },
  cellWrap: { flexBasis: CELL_BASIS, padding: GRID_GAP / 2 },
  cell: {
    position: 'relative',
    minHeight: 56,
    paddingTop: 9,
    paddingBottom: 8,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  cellEmpty: { minHeight: 56 },
  cellToday: { backgroundColor: 'rgba(124,92,255,0.12)', borderColor: 'rgba(124,92,255,0.32)' },
  flag: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.zoneLow,
    shadowColor: colors.zoneLow,
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 3,
  },
  num: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  val: { fontFamily: fonts.mono, fontSize: 13, fontWeight: '600', color: colors.text, lineHeight: 13 },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 9, height: 9, borderRadius: 3 },
  legendFlag: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.zoneLow,
    shadowColor: colors.zoneLow,
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 3,
  },
  legendText: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textDim },
});
