import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@lockin90/tokens';

export interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

/** Hairline divider. */
export function Divider({ style }: DividerProps) {
  return <View style={[{ height: 1, backgroundColor: colors.border }, style]} />;
}
