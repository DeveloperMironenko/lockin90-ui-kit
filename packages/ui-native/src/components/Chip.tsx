import { View, Text, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors, radius, spacing, fonts, fontSizes } from '@lockin90/tokens';

export type ChipTone = 'neutral' | 'high' | 'mid' | 'low' | 'accent';

export interface ChipProps {
  children: React.ReactNode;
  tone?: ChipTone;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface ToneSpec {
  color: string;
  bg: string;
  border: string;
}

const TONES: Record<ChipTone, ToneSpec> = {
  high: { color: colors.zoneHigh, bg: 'rgba(52,245,197,0.12)', border: 'rgba(52,245,197,0.30)' },
  mid: { color: colors.zoneMid, bg: 'rgba(255,176,32,0.12)', border: 'rgba(255,176,32,0.30)' },
  low: { color: colors.zoneLow, bg: 'rgba(255,77,109,0.12)', border: 'rgba(255,77,109,0.30)' },
  accent: { color: '#cbbcff', bg: 'rgba(124,92,255,0.14)', border: 'rgba(124,92,255,0.32)' },
  neutral: { color: colors.textDim, bg: 'rgba(170,178,198,0.10)', border: 'rgba(170,178,198,0.24)' },
};

export function Chip({ children, tone = 'neutral', dot, style }: ChipProps) {
  const spec = TONES[tone];
  return (
    <View style={[styles.chip, { backgroundColor: spec.bg, borderColor: spec.border }, style]}>
      {dot ? <View style={[styles.dot, { backgroundColor: spec.color }]} /> : null}
      <Text style={[styles.label, { color: spec.color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginRight: spacing.xs,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
  },
});
