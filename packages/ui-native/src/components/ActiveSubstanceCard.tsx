import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';

/** Radius of the ring gauge in the 56×56 viewBox (matches the web design). */
const RING_R = 23;
/** Circumference 2πr ≈ 144.5 — the full dash length of the gauge arc. */
const RING_C = 2 * Math.PI * RING_R;

/** Clearance/effect readout chip shown on the right of a substance row. */
export interface ActiveSubstanceChip {
  /** Signal tone — drives the pill color. */
  tone?: ChipTone;
  /** Pill label, e.g. "−6 sleep pts" or "on track". */
  label: string;
}

/** One run of the meta line — `bold` emphasizes the value (e.g. "95mg"). */
export interface MetaSegment {
  text: string;
  bold?: boolean;
}

/** One live substance currently in the user's system. */
export interface ActiveSubstance {
  /** Substance name, e.g. "Caffeine". */
  name: string;
  /** Per-substance glow color (hex / any color string). */
  color: string;
  /** Current level as a % of peak still remaining (0–100) — the ring fill. */
  remainingPct: number;
  /** Amount still active, the big number, e.g. "48". */
  mgActive: string;
  /** Mono meta line under the number — runs of text with optional bold. */
  meta?: MetaSegment[];
  /** Clearance/effect readout chip. */
  chip?: ActiveSubstanceChip;
  /** Time-since-dose label, e.g. "4h 02m". Hidden when empty. */
  since?: string;
  /** Unit label after the big number (defaults to "mg active"). */
  unit?: string;
  /** Leading glyph (defaults to a generic capsule icon, tinted to `color`). */
  icon?: ReactNode;
  /** Whether to show the "live" dot next to the name (default true). */
  live?: boolean;
}

export interface ActiveSubstanceCardProps {
  /** Substances currently active — one card per entry. */
  substances?: ActiveSubstance[];
  style?: StyleProp<ViewStyle>;
}

/** Generic capsule glyph, tinted to the substance color. */
function DefaultIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7zM8 6l8 8"
        stroke={color}
        strokeWidth={1.6}
        fill="none"
      />
    </Svg>
  );
}

/** Mini ring gauge — a track circle + a colored progress arc, % in the center. */
function RingGauge({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const dashoffset = RING_C * (1 - clamped / 100);
  return (
    <View style={styles.gauge}>
      <Svg width={60} height={60} viewBox="0 0 56 56" style={styles.gaugeSvg}>
        <Circle cx={28} cy={28} r={RING_R} fill="none" strokeWidth={4} stroke={colors.border2} />
        <Circle
          cx={28}
          cy={28}
          r={RING_R}
          fill="none"
          strokeWidth={4}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={dashoffset}
        />
      </Svg>
      <View style={styles.pctWrap} pointerEvents="none">
        <Text style={styles.pct}>
          {Math.round(clamped)}
          <Text style={styles.pctUnit}>%</Text>
        </Text>
      </View>
    </View>
  );
}

/** A single substance row. */
function Row({
  name,
  color,
  remainingPct,
  mgActive,
  meta,
  chip,
  since,
  unit = 'mg active',
  icon,
  live = true,
}: ActiveSubstance) {
  return (
    <View style={styles.card}>
      {/* colored left border + soft glow */}
      <View style={[styles.glowBorder, { backgroundColor: color, shadowColor: color }]} pointerEvents="none" />

      <RingGauge pct={remainingPct} color={color} />

      <View style={styles.body}>
        <View style={styles.head}>
          {icon ?? <DefaultIcon color={color} />}
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {live ? <View style={[styles.liveDot, { backgroundColor: color, shadowColor: color }]} /> : null}
        </View>
        <Text style={styles.big}>
          <Text style={styles.bigNum}>{mgActive}</Text>
          <Text style={styles.bigUnit}> {unit}</Text>
        </Text>
        {meta && meta.length ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta.map((seg, i) => (
              <Text key={i} style={seg.bold ? styles.metaBold : undefined}>
                {seg.text}
              </Text>
            ))}
          </Text>
        ) : null}
      </View>

      <View style={styles.side}>
        {since ? (
          <Text style={styles.since}>
            SINCE <Text style={styles.sinceBold}>{since}</Text>
          </Text>
        ) : null}
        {chip ? <Chip tone={chip.tone ?? 'default'} dot label={chip.label} /> : null}
      </View>
    </View>
  );
}

/** Default substances mirror the design example (caffeine + magnesium). */
const DEFAULT_SUBSTANCES: ActiveSubstance[] = [
  {
    name: 'Caffeine',
    color: '#FFB020',
    remainingPct: 37,
    mgActive: '48',
    meta: [
      { text: 'from ' },
      { text: '95mg', bold: true },
      { text: ' · ' },
      { text: '4h ago', bold: true },
      { text: ' · clears ' },
      { text: '~11pm', bold: true },
    ],
    since: '4h 02m',
    chip: { tone: 'mid', label: '−6 sleep pts' },
  },
  {
    name: 'Magnesium',
    color: '#34F5C5',
    remainingPct: 70,
    mgActive: '280',
    meta: [
      { text: 'evening dose · ' },
      { text: '1h ago', bold: true },
      { text: ' · supports sleep' },
    ],
    since: '1h 06m',
    chip: { tone: 'low', label: 'on track' },
  },
];

/** Active-substance card list — live "in your system now" rows. Each row glows
 *  in its substance color (left border + soft shadow), shows a mini ring gauge
 *  of the current level, the amount still active, a meta line, the time since
 *  the dose, and a clearance/effect chip. Mirrors the web `ActiveSubstanceCard`. */
export function ActiveSubstanceCard({ substances = DEFAULT_SUBSTANCES, style }: ActiveSubstanceCardProps) {
  return (
    <View style={[styles.list, style]}>
      {substances.map((s, i) => (
        <Row key={`${s.name}-${i}`} {...s} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  card: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  glowBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  gauge: { width: 60, height: 60 },
  gaugeSvg: { transform: [{ rotate: '-90deg' }] },
  pctWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  pct: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '600', color: colors.text, letterSpacing: -0.2 },
  pctUnit: { fontSize: 7, color: colors.textFaint },
  body: { flex: 1, minWidth: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontWeight: '600', fontSize: 14, color: colors.text },
  liveDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 1, shadowOpacity: 0.9, shadowRadius: 5, shadowOffset: { width: 0, height: 0 } },
  big: { marginTop: 3, marginBottom: 1 },
  bigNum: { fontFamily: fonts.display, fontWeight: '700', fontSize: 19, letterSpacing: -0.4, color: colors.text },
  bigUnit: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '500', color: colors.textFaint },
  meta: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginTop: 1 },
  metaBold: { color: colors.textDim, fontWeight: '500' },
  side: { alignItems: 'flex-end', gap: 7 },
  since: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textFaint, letterSpacing: 0.4 },
  sinceBold: { color: colors.textDim, fontWeight: '500' },
});
