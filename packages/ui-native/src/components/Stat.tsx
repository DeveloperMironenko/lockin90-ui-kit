import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

export interface StatProps {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: 'up' | 'down';
  style?: StyleProp<ViewStyle>;
}

/** Label + big display value + optional signed delta. */
export function Stat({ label, value, delta, deltaDir, style }: StatProps) {
  return (
    <View style={[styles.stat, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {delta != null && (
        <Text style={[styles.delta, { color: deltaDir === 'down' ? colors.zoneLow : colors.zoneHigh }]}>{delta}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stat: { gap: 6 },
  label: { fontFamily: fonts.mono, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 1.6, color: colors.textFaint },
  value: { fontFamily: fonts.display, fontWeight: '700', fontSize: 30, letterSpacing: -0.6, color: colors.text },
  delta: { fontFamily: fonts.mono, fontSize: 12 },
});
