import { Text, StyleSheet, type TextProps } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

export type EyebrowProps = TextProps;

/** Eyebrow — a mono, uppercase, letter-spaced overline label for section headers.
 *  The native twin of the web `Eyebrow` (always renders a `<Text>`; the web-only
 *  `as` prop has no native equivalent). */
export function Eyebrow({ style, ...rest }: EyebrowProps) {
  return <Text style={[styles.eyebrow, style]} {...rest} />;
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.textFaint,
  },
});
