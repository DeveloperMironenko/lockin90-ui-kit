import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip, type ChipTone } from './Chip';
import { BarFill } from './BarFill';

export type AdherenceTone = 'high' | 'mid' | 'low';

export interface SupplementCardProps {
  /** Supplement name, e.g. "Magnesium glycinate". */
  name?: string;
  /** Dose + cadence line, e.g. "400mg · daily". */
  dose?: string;
  /** Purpose / benefit line under the header. */
  purpose?: string;
  /** Timing status chip label, e.g. "PM · evening". Hidden when empty. */
  timing?: string;
  /** Custom timing-chip icon (defaults to a moon glyph). */
  timingIcon?: ReactNode;
  /** Leading icon (defaults to a sun/energy glyph). */
  icon?: ReactNode;
  /** Days taken in the adherence window. */
  taken?: number;
  /** Length of the adherence window in days. */
  days?: number;
  /** Adherence value tone. Defaults to auto from the taken/days ratio. */
  tone?: AdherenceTone;
  /** Status chip label. Defaults to a short label derived from the tone. */
  status?: string;
  style?: StyleProp<ViewStyle>;
}

/** Short status label that mirrors the adherence tone. */
const STATUS_LABEL: Record<AdherenceTone, string> = {
  high: 'On track',
  mid: 'Building',
  low: 'Spotty',
};

/** Zone color per adherence tone — mirrors the web .lk-supp-adh-val.lk-{tone}. */
const VAL_COLOR: Record<AdherenceTone, string> = {
  high: colors.zoneHigh,
  mid: colors.zoneMid,
  low: colors.zoneLow,
};

/** Auto-tone the adherence value from the fraction when not given. */
function toneFor(frac: number): AdherenceTone {
  if (frac >= 0.8) return 'high';
  if (frac >= 0.5) return 'mid';
  return 'low';
}

const DefaultIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M12 2v6M5.6 5.6l4.2 4.2M2 12h6M5.6 18.4l4.2-4.2M12 22v-6M18.4 18.4l-4.2-4.2M22 12h-6M18.4 5.6l-4.2 4.2"
      stroke={colors.accent3}
      strokeWidth={1.6}
      fill="none"
    />
  </Svg>
);

const DefaultTimingIcon = () => (
  <Svg width={11} height={11} viewBox="0 0 24 24">
    <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" stroke={colors.accent2} strokeWidth={1.8} fill="none" />
  </Svg>
);

/** Supplement-stack card — icon, name + dose, timing chip, purpose, and a
 *  taken-X/7-days adherence bar with a zone-colored value + status chip. */
export function SupplementCard({
  name = 'Magnesium glycinate',
  dose = '400mg · daily',
  purpose = 'Sleep onset & muscle recovery. Glycinate form for gentle absorption, taken with dinner.',
  timing = 'PM · evening',
  timingIcon,
  icon,
  taken = 6,
  days = 7,
  tone,
  status,
  style,
}: SupplementCardProps) {
  const total = Math.max(1, days);
  const done = Math.max(0, Math.min(total, taken));
  const frac = done / total;
  const valTone = tone ?? toneFor(frac);
  const statusLabel = status ?? STATUS_LABEL[valTone];
  const statusTone: ChipTone = valTone;
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.head}>
        <View style={styles.ico}>{icon ?? <DefaultIcon />}</View>
        <View style={styles.headText}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.dose}>{dose}</Text>
        </View>
        {timing ? (
          <View style={styles.timing}>
            {timingIcon ?? <DefaultTimingIcon />}
            <Text style={styles.timingLabel}>{timing}</Text>
          </View>
        ) : null}
      </View>
      {purpose ? <Text style={styles.purpose}>{purpose}</Text> : null}
      <View style={styles.adh}>
        <Text style={styles.adhLbl}>ADHERENCE</Text>
        <View style={styles.adhBar}>
          <BarFill value={frac} height={8} />
        </View>
        <Text style={[styles.adhVal, { color: VAL_COLOR[valTone] }]}>
          {done}/{total}
        </Text>
      </View>
      {statusLabel ? <Chip tone={statusTone} dot label={statusLabel} style={styles.statusChip} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 17 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  ico: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  headText: { flexShrink: 1, minWidth: 0 },
  name: { fontWeight: '600', fontSize: 14.5, color: colors.text },
  dose: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint, marginTop: 1 },
  timing: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.28)',
    backgroundColor: 'rgba(34,211,238,0.07)',
  },
  timingLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.accent2 },
  purpose: { fontSize: 12.5, color: colors.textDim, lineHeight: 18, marginTop: 11, marginBottom: 12 },
  adh: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  adhLbl: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    letterSpacing: 1.1,
    color: colors.textFaint,
  },
  adhBar: { flex: 1 },
  adhVal: { fontFamily: fonts.mono, fontSize: 12.5, fontWeight: '600' },
  statusChip: { marginTop: 12 },
});
