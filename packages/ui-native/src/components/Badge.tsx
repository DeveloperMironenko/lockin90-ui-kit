import { Text, StyleSheet } from 'react-native';
import type { TextStyle, StyleProp } from 'react-native';
import { colors, fonts, fontSizes } from '@lockin90/tokens';

export interface BadgeProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function Badge({ children, style }: BadgeProps) {
  return <Text style={[styles.badge, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
