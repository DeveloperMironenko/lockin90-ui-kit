import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export type ChipTone = 'default' | 'high' | 'mid' | 'low' | 'accent';

export interface ChipProps extends ViewProps {
  tone?: ChipTone;
  dot?: boolean;
  label: string;
}

const TONE: Record<ChipTone, { color: string; border: string; bg: string }> = {
  default: { color: colors.textDim, border: colors.border, bg: colors.glass },
  high: { color: colors.zoneHigh, border: 'rgba(52,245,197,0.35)', bg: 'rgba(52,245,197,0.08)' },
  mid: { color: colors.zoneMid, border: 'rgba(255,176,32,0.35)', bg: 'rgba(255,176,32,0.08)' },
  low: { color: colors.zoneLow, border: 'rgba(255,77,109,0.35)', bg: 'rgba(255,77,109,0.08)' },
  accent: { color: '#cbbcff', border: 'rgba(124,92,255,0.4)', bg: 'rgba(124,92,255,0.10)' },
};

/** Status pill. */
export function Chip({ tone = 'default', dot, label, style, ...rest }: ChipProps) {
  const t = TONE[tone];
  return (
    <View style={[styles.chip, { borderColor: t.border, backgroundColor: t.bg }, style]} {...rest}>
      {dot && <View style={[styles.dot, { backgroundColor: t.color, shadowColor: t.color }]} />}
      <Text style={[styles.label, { color: t.color }]}>{label}</Text>
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
  dot: { width: 6, height: 6, borderRadius: 3, shadowOpacity: 0.9, shadowRadius: 6 },
  label: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '500', letterSpacing: 0.4 },
});
