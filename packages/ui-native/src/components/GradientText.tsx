import { Text, type TextProps } from 'react-native';
import { colors } from '@lockin90/tokens';

export interface GradientTextProps extends TextProps {
  gradient?: 'flux' | 'cta' | 'violet';
}

/**
 * Native gradient-clipped text is not available without a masking layer, so v1
 * renders a solid brand color from the chosen gradient. Wrap in MaskedView +
 * expo-linear-gradient for a true gradient when needed.
 */
export function GradientText({ gradient = 'flux', style, ...rest }: GradientTextProps) {
  const color = gradient === 'violet' ? colors.violet : gradient === 'cta' ? colors.accent2 : colors.mint;
  return <Text style={[{ color }, style]} {...rest} />;
}
