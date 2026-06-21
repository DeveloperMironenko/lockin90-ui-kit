import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/** Built-in tone keys — drive the tile's icon color (mirrors the design example). */
export type VitalTone = 'hr' | 'hrv' | 'spo2' | 'resp' | 'temp' | 'bp';

/** Trend direction → arrow glyph + color band. */
export type VitalTrendKind = 'good' | 'bad' | 'warn' | 'flat';

/** A tiny trend line under the value, e.g. "▼ 2 · recovered". */
export interface VitalTrend {
  /** Arrow glyph, e.g. "▲" / "▼" / "–". Defaults per `kind`. */
  arrow?: string;
  /** Trend copy, e.g. "2 · recovered". */
  text: string;
  /** Color band of the trend. */
  kind?: VitalTrendKind;
}

/** A single biometric tile. */
export interface Vital {
  /** Mono uppercase label, e.g. "Resting HR". */
  label: string;
  /** Big display value, e.g. "52" or "118/76". */
  value: string;
  /** Mono unit suffix, e.g. "bpm". Hidden when omitted. */
  unit?: string;
  /** Tone key — tints the icon. Falls back to a neutral dim stroke. */
  tone?: VitalTone;
  /** Tile icon. Defaults to the per-tone glyph (or a generic dot). */
  icon?: ReactNode;
  /** Trend line under the value. Hidden when omitted. */
  trend?: VitalTrend;
}

export interface VitalsGridProps {
  /** Mono eyebrow over the grid, e.g. "Vitals · this morning". Hidden when empty. */
  title?: string;
  /** Biometric tiles. */
  vitals?: Vital[];
  style?: StyleProp<ViewStyle>;
}

/** Default arrow glyph per trend kind. */
const TREND_ARROW: Record<VitalTrendKind, string> = {
  good: '▲',
  bad: '▼',
  warn: '▲',
  flat: '–',
};

/** Tone → icon stroke color, mirrors the web `var(--token)` mapping. */
const TONE_COLOR: Record<VitalTone, string> = {
  hr: colors.accent,
  hrv: colors.accent3,
  spo2: colors.accent2,
  resp: colors.accent2,
  temp: colors.zoneMid,
  bp: colors.accent,
};

/** Trend kind → text color, mirrors `.is-good / .is-bad / .is-warn / .is-flat`. */
const TREND_COLOR: Record<VitalTrendKind, string> = {
  good: colors.zoneHigh,
  bad: colors.zoneLow,
  warn: colors.zoneMid,
  flat: colors.textFaint,
};

const ICON_PROPS = { strokeWidth: 1.7, fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function VitalIcon({ tone, color }: { tone?: VitalTone; color: string }) {
  switch (tone) {
    case 'hr':
      return (
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" stroke={color} {...ICON_PROPS} />
        </Svg>
      );
    case 'hrv':
      return (
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path d="M2 12h4l2-7 4 14 2-7h8" stroke={color} {...ICON_PROPS} />
        </Svg>
      );
    case 'spo2':
      return (
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path d="M12 2.7s7 6.4 7 11.3a7 7 0 0 1-14 0c0-4.9 7-11.3 7-11.3z" stroke={color} {...ICON_PROPS} />
        </Svg>
      );
    case 'resp':
      return (
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path d="M12 21c-4-3-7-6-7-10a7 7 0 0 1 7-7 7 7 0 0 1 7 7c0 4-3 7-7 10z" stroke={color} {...ICON_PROPS} />
          <Path d="M9 11h6M12 8v6" stroke={color} {...ICON_PROPS} />
        </Svg>
      );
    case 'temp':
      return (
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" stroke={color} {...ICON_PROPS} />
        </Svg>
      );
    case 'bp':
      return (
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={9} stroke={color} {...ICON_PROPS} />
          <Path d="M12 7v5l3 2" stroke={color} {...ICON_PROPS} />
        </Svg>
      );
    default:
      return (
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={9} stroke={color} {...ICON_PROPS} />
        </Svg>
      );
  }
}

const DEFAULT_VITALS: Vital[] = [
  { label: 'Resting HR', value: '52', unit: 'bpm', tone: 'hr', trend: { arrow: '▼', text: '2 · recovered', kind: 'good' } },
  { label: 'HRV', value: '68', unit: 'ms', tone: 'hrv', trend: { arrow: '▲', text: '5 · trending up', kind: 'good' } },
  { label: 'SpO₂', value: '98', unit: '%', tone: 'spo2', trend: { arrow: '–', text: 'steady', kind: 'flat' } },
  { label: 'Resp rate', value: '14', unit: '/min', tone: 'resp', trend: { arrow: '–', text: 'steady', kind: 'flat' } },
  { label: 'Skin temp', value: '+0.2', unit: '°C', tone: 'temp', trend: { arrow: '▲', text: 'slightly warm', kind: 'warn' } },
  { label: 'Blood pressure', value: '118/76', unit: 'mmHg', tone: 'bp', trend: { arrow: '–', text: 'normal', kind: 'flat' } },
];

/** Vitals grid — a compact wrapping grid of biometric tiles (resting HR, HRV,
 *  SpO₂, resp rate, skin temp, blood pressure). Each tile carries a mono label,
 *  a tone-tinted icon, a big display value + mono unit, and a tiny color-coded
 *  trend arrow with delta copy. Native counterpart of the web `VitalsGrid`. */
export function VitalsGrid({ title = 'Vitals · this morning', vitals = DEFAULT_VITALS, style }: VitalsGridProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <View style={styles.head}>
          <Text style={styles.eyebrow}>{title}</Text>
          <View style={styles.ln} />
        </View>
      ) : null}

      <View style={styles.grid}>
        {vitals.map((v, i) => {
          const kind = v.trend?.kind ?? 'flat';
          const arrow = v.trend?.arrow ?? TREND_ARROW[kind];
          const iconColor = v.tone ? TONE_COLOR[v.tone] : colors.textDim;
          return (
            <View key={`${v.label}-${i}`} style={styles.tile}>
              <View style={styles.top}>
                <Text style={styles.label}>{v.label}</Text>
                {v.icon ?? <VitalIcon tone={v.tone} color={iconColor} />}
              </View>
              <View style={styles.valRow}>
                <Text style={styles.val}>{v.value}</Text>
                {v.unit ? <Text style={styles.unit}>{v.unit}</Text> : null}
              </View>
              {v.trend ? (
                <Text style={[styles.trend, { color: TREND_COLOR[kind] }]}>
                  {arrow} {v.trend.text}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** ~150px min tile width; `flexWrap` rebuilds the web auto-fill grid. */
const TILE_MIN_WIDTH = 150;

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.glass,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  eyebrow: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.textFaint },
  ln: { flex: 1, height: 1, backgroundColor: colors.border },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    flexGrow: 1,
    flexBasis: TILE_MIN_WIDTH,
    minWidth: TILE_MIN_WIDTH,
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.glass,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  label: { fontFamily: fonts.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: colors.textFaint },
  valRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  val: { fontFamily: fonts.display, fontSize: 27, fontWeight: '700', letterSpacing: -0.5, lineHeight: 28, color: colors.text },
  unit: { fontFamily: fonts.mono, fontSize: 12, fontWeight: '400', color: colors.textFaint },
  trend: { marginTop: 5, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.1, color: colors.textFaint },
});
