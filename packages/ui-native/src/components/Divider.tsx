import { View, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors } from '@lockin90/tokens';

export interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

export function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.border,
  },
});
