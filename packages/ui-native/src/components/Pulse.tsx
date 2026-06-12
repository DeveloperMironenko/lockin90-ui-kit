import { View, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors } from '@lockin90/tokens';

export type PulseTone = 'ok' | 'warn' | 'bad';

export interface PulseProps {
  tone?: PulseTone;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const TONE_COLORS: Record<PulseTone, string> = {
  ok: colors.ok,
  warn: colors.warn,
  bad: colors.bad,
};

export function Pulse({ tone = 'ok', size = 10, style }: PulseProps) {
  const color = TONE_COLORS[tone];
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 6,
  },
});
