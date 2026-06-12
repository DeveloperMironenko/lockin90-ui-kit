import { View, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors, radius, spacing } from '@lockin90/tokens';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  lit?: boolean;
  padded?: boolean;
}

export function Card({ children, style, lit, padded = true }: CardProps) {
  return (
    <View style={[styles.card, padded && styles.padded, lit && styles.lit, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  padded: {
    padding: spacing.lg,
  },
  lit: {
    borderColor: colors.border2,
  },
});
