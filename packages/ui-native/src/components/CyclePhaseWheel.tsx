import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip } from './Chip';

export interface CyclePhase {
  /** phase name, e.g. "Ovulation" */
  name: string;
  /** number of days this phase spans */
  days: number;
  /** arc + swatch color (hex) */
  color: string;
}

export interface CyclePhaseWheelProps {
  /** the four (or more) cycle phases, in order */
  phases?: CyclePhase[];
  /** the current day of the cycle, 1-based */
  currentDay?: number;
  /** total length of the cycle in days */
  cycleLength?: number;
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of the design's 28-day example. */
const DEFAULT_PHASES: CyclePhase[] = [
  { name: 'Menstrual', days: 5, color: '#FF4D6D' },
  { name: 'Follicular', days: 9, color: '#34F5C5' },
  { name: 'Ovulation', days: 5, color: '#A8FF35' },
  { name: 'Luteal', days: 9, color: '#7C5CFF' },
];

/* wheel geometry (300x300 viewBox, stroke ring at r=120) */
const CX = 150;
const CY = 150;
const R = 120;
const STROKE = 22;
const CIRC = 2 * Math.PI * R; // 753.98
const ARC_GAP = 4;
/** on-screen render size of the square wheel */
const WHEEL = 232;
/** gutter between the two legend columns/rows */
const LEGEND_GAP = 9;

interface ArcSpec {
  phase: CyclePhase;
  dash: string;
  offset: number;
}

/** lay each phase out as a proportional arc, sweeping clockwise from 12 o'clock */
function buildArcs(phases: CyclePhase[], total: number): ArcSpec[] {
  const out: ArcSpec[] = [];
  let cursor = 0;
  for (const phase of phases) {
    const span = (phase.days / total) * CIRC;
    const dash = Math.max(span - ARC_GAP, 1);
    out.push({
      phase,
      dash: `${dash.toFixed(1)} ${(CIRC - dash).toFixed(1)}`,
      offset: -Number(cursor.toFixed(1)),
    });
    cursor += span;
  }
  return out;
}

/** point on the ring for a 0..1 fraction (angle 0 = +x; the G rotation moves it to top) */
function ringPoint(fraction: number): { x: number; y: number } {
  const a = fraction * 2 * Math.PI;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
}

/** which phase contains a given 1-based day */
function phaseOfDay(phases: CyclePhase[], day: number): CyclePhase {
  let acc = 0;
  for (const phase of phases) {
    acc += phase.days;
    if (day <= acc) return phase;
  }
  return phases[phases.length - 1];
}

/** Cycle phase wheel — a circular SVG of the menstrual-cycle phases as colored
 *  arcs, a glowing current-day marker, a center day/phase readout and a legend.
 *  Same prop API as the web component. */
export function CyclePhaseWheel({
  phases = DEFAULT_PHASES,
  currentDay = 16,
  cycleLength = 28,
  style,
}: CyclePhaseWheelProps) {
  const arcs = buildArcs(phases, cycleLength);
  const current = phaseOfDay(phases, currentDay);
  const marker = ringPoint((currentDay - 0.5) / cycleLength);

  let dayCursor = 0;
  const legend = phases.map((p) => {
    const from = dayCursor + 1;
    const to = dayCursor + p.days;
    dayCursor = to;
    return { ...p, from, to };
  });

  return (
    <View style={[styles.cyc, style]}>
      {/* top chip */}
      <View style={styles.head}>
        <Chip label={`Cycle · Day ${currentDay} of ${cycleLength}`} />
      </View>

      {/* wheel */}
      <View style={styles.wrap}>
        <View style={styles.wheel}>
          <Svg width={WHEEL} height={WHEEL} viewBox="0 0 300 300">
            {/* rotate -90 so the arc sweep starts at 12 o'clock */}
            <G rotation={-90} originX={CX} originY={CY}>
              {/* track */}
              <Circle cx={CX} cy={CY} r={R} fill="none" stroke={colors.border2} strokeWidth={STROKE} />
              {/* phase arcs */}
              {arcs.map((arc, i) => (
                <Circle
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={arc.phase.color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={arc.dash}
                  strokeDashoffset={arc.offset}
                />
              ))}
              {/* current-day marker (shares the rotated frame) */}
              <Circle
                cx={marker.x}
                cy={marker.y}
                r={9}
                fill={colors.bg1}
                stroke={current.color}
                strokeWidth={3}
              />
              <Circle cx={marker.x} cy={marker.y} r={3.5} fill={current.color} />
            </G>
          </Svg>

          {/* center readout */}
          <View style={styles.center} pointerEvents="none">
            <Text style={styles.day}>
              Day <Text style={styles.dayNum}>{currentDay}</Text>
            </Text>
            <Text style={styles.phase}>{current.name.toUpperCase()}</Text>
            <Text style={styles.of}>of a {cycleLength}-day cycle</Text>
          </View>
        </View>
      </View>

      {/* legend */}
      <View style={styles.legend}>
        {legend.map((p) => (
          <View style={styles.lgWrap} key={p.name}>
            <View style={styles.lg}>
              <View style={[styles.swatch, { backgroundColor: p.color, shadowColor: p.color }]} />
              <View style={styles.lgText}>
                <Text style={styles.ln1}>{p.name}</Text>
                <Text style={styles.ln2}>
                  Days {p.from}–{p.to}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export type { CyclePhase as CyclePhaseWheelPhase };

const styles = StyleSheet.create({
  cyc: { flexDirection: 'column' },

  head: { alignItems: 'center', marginBottom: 6 },

  wrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 8, paddingBottom: 4 },
  wheel: { width: WHEEL, height: WHEEL, alignItems: 'center', justifyContent: 'center' },

  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  day: { fontFamily: fonts.display, fontWeight: '700', fontSize: 38, letterSpacing: -1, color: colors.text },
  dayNum: { fontFamily: fonts.display, fontWeight: '700', fontSize: 38, color: colors.text },
  phase: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.mint,
    marginTop: 7,
  },
  of: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, marginTop: 4 },

  legend: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 18, marginHorizontal: -LEGEND_GAP / 2, marginVertical: -LEGEND_GAP / 2 },
  /** half-gap padding wrapper so the two columns get a real 9px gutter */
  lgWrap: { width: '50%', padding: LEGEND_GAP / 2 },
  lg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  lgText: { flexShrink: 1 },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginTop: 3,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 3,
  },
  ln1: { fontWeight: '600', fontSize: 13, color: colors.text },
  ln2: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginTop: 1 },
});
