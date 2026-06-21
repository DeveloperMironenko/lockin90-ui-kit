import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@lockin90/tokens';

export interface PulseProps {
  tone?: 'ok' | 'warn' | 'bad';
  style?: StyleProp<ViewStyle>;
}

/** Live status dot with a soft glow. */
export function Pulse({ tone = 'ok', style }: PulseProps) {
  const color = tone === 'warn' ? colors.warn : tone === 'bad' ? colors.bad : colors.ok;
  return <View style={[styles.dot, { backgroundColor: color, shadowColor: color }, style]} />;
}

const styles = StyleSheet.create({
  dot: { width: 9, height: 9, borderRadius: 5, shadowOpacity: 0.9, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
});
