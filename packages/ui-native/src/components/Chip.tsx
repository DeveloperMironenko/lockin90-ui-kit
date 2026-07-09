import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

export type ChipTone = 'default' | 'neutral' | 'high' | 'mid' | 'low' | 'accent';
/** `md` (default) is the standard status pill; `sm` is the compact count/status
 *  badge — tighter box, 10px tabular mono, filled-gradient accent. With `dot`,
 *  `sm` collapses to a bare glowing circle. */
export type ChipSize = 'sm' | 'md';

export interface ChipProps extends ViewProps {
  tone?: ChipTone;
  /** leading glowing dot in the current color */
  dot?: boolean;
  /** `md` (default) status pill · `sm` compact count/status badge (see `ChipSize`). */
  size?: ChipSize;
  label: string;
}

const TONE: Record<ChipTone, { color: string; border: string; bg: string }> = {
  default: { color: colors.textDim, border: colors.border, bg: colors.glass },
  neutral: { color: colors.textFaint, border: colors.border2, bg: colors.glass2 },
  high: { color: colors.zoneHigh, border: 'rgba(52,245,197,0.35)', bg: 'rgba(52,245,197,0.08)' },
  mid: { color: colors.zoneMid, border: 'rgba(255,176,32,0.35)', bg: 'rgba(255,176,32,0.08)' },
  low: { color: colors.zoneLow, border: 'rgba(255,77,109,0.35)', bg: 'rgba(255,77,109,0.08)' },
  accent: { color: '#cbbcff', border: 'rgba(124,92,255,0.4)', bg: 'rgba(124,92,255,0.10)' },
};

/** `sm` tone overrides — the compact badge tweaks a few backgrounds vs the md
 *  pill (high/mid/low read slightly stronger; neutral reads dim on glass-2).
 *  The `accent` tone is handled specially (filled gradient). */
const TONE_SM: Partial<Record<ChipTone, Partial<{ color: string; border: string; bg: string }>>> = {
  neutral: { color: colors.textDim, border: colors.border, bg: colors.glass2 },
  high: { bg: 'rgba(52,245,197,0.10)' },
  mid: { bg: 'rgba(255,176,32,0.10)' },
  low: { bg: 'rgba(255,77,109,0.10)' },
};

/** Color of the bare glowing circle for `sm` + `dot`. */
const DOT_COLOR: Record<ChipTone, string> = {
  default: colors.textDim,
  neutral: colors.textFaint,
  high: colors.zoneHigh,
  mid: colors.zoneMid,
  low: colors.zoneLow,
  accent: colors.accent,
};

/** Status pill — mono label, signal-colored tones. `size="sm"` is the compact badge. */
export function Chip({ tone = 'default', dot, size = 'md', label, style, ...rest }: ChipProps) {
  const t = TONE[tone];

  // sm + dot → bare glowing circle, no text (the retired `Badge`'s dot mode)
  if (size === 'sm' && dot) {
    const dc = DOT_COLOR[tone];
    return (
      <View
        style={[styles.smDot, { backgroundColor: dc, shadowColor: dc }, tone === 'neutral' && styles.smDotNoGlow, style]}
        {...rest}
      />
    );
  }

  // sm accent → FILLED gradient count pill with dark text
  if (size === 'sm' && tone === 'accent') {
    return (
      <View style={[styles.chip, styles.chipSm, styles.chipSmAccent, style]} {...rest}>
        <LinearGradient
          colors={[...gradients.cta.stops] as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={[styles.label, styles.labelSm, styles.labelSmAccent]}>{label}</Text>
      </View>
    );
  }

  const sm = size === 'sm';
  const o = sm ? TONE_SM[tone] : undefined;
  const color = o?.color ?? t.color;
  const border = o?.border ?? t.border;
  const bg = o?.bg ?? t.bg;

  return (
    <View style={[styles.chip, sm && styles.chipSm, { borderColor: border, backgroundColor: bg }, style]} {...rest}>
      {dot && <View style={[styles.dot, { backgroundColor: color, shadowColor: color }]} />}
      <Text style={[styles.label, sm && styles.labelSm, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chipSm: {
    gap: 4,
    justifyContent: 'center',
    minWidth: 16,
    minHeight: 16,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  chipSmAccent: { borderColor: 'transparent', overflow: 'hidden' },
  dot: { width: 6, height: 6, borderRadius: 3, shadowOpacity: 0.9, shadowRadius: 6 },
  smDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  smDotNoGlow: { shadowOpacity: 0 },
  label: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '500', letterSpacing: 0.4 },
  labelSm: { fontSize: 10, fontWeight: '600', letterSpacing: 0, lineHeight: 10, fontVariant: ['tabular-nums'] },
  labelSmAccent: { color: '#0A0A12' },
});
