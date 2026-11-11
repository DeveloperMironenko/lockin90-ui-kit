import { StyleSheet, type TextProps } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { useContrastColors } from '../internal/useHighContrast';
import { FitText } from './FitText';

export type EyebrowProps = TextProps;

/** Eyebrow — a mono, uppercase, letter-spaced overline label for section headers.
 *  The native twin of the web `Eyebrow` (always renders a `<Text>`; the web-only
 *  `as` prop has no native equivalent). */
export function Eyebrow({ style, ...rest }: EyebrowProps) {
  // Increase Contrast steps the faint label up
  const c = useContrastColors();
  // a word wider than its room shrinks to fit, never splits
  return <FitText style={[styles.eyebrow, { color: c.textFaint }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.textFaint,
  },
});
