import { View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@lockin90/tokens';

export interface DividerProps {
  /** fade-to-transparent gradient rule (mirrors the web `gradient` variant) */
  gradient?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Hairline divider. With `gradient`, the rule fades to transparent at both ends —
 *  the native analogue of web `linear-gradient(90deg, transparent, var(--border-2), transparent)`. */
export function Divider({ gradient, style }: DividerProps) {
  if (gradient) {
    return (
      <LinearGradient
        colors={['transparent', colors.border2, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[{ height: 1 }, style]}
      />
    );
  }
  return <View style={[{ height: 1, backgroundColor: colors.border }, style]} />;
}
