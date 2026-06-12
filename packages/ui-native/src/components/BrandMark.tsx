import { Text, StyleSheet } from 'react-native';
import type { TextStyle, StyleProp } from 'react-native';
import { colors, fonts, fontSizes } from '@lockin90/tokens';

export interface BrandMarkProps {
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function BrandMark({ size = fontSizes.lg, color = colors.text, style }: BrandMarkProps) {
  return (
    <Text style={[styles.wordmark, { fontSize: size, color }, style]}>
      LockIn<Text style={styles.accent}>90</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    fontFamily: fonts.display,
  },
  accent: {
    color: colors.accent3,
  },
});
