import { Text, StyleSheet } from 'react-native';
import type { TextStyle, StyleProp } from 'react-native';
import { colors, fonts, fontSizes } from '@lockin90/tokens';

export interface TypographyProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function Display({ children, style }: TypographyProps) {
  return <Text style={[styles.display, style]}>{children}</Text>;
}

export function Heading({ children, style }: TypographyProps) {
  return <Text style={[styles.heading, style]}>{children}</Text>;
}

export function Body({ children, style }: TypographyProps) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Muted({ children, style }: TypographyProps) {
  return <Text style={[styles.muted, style]}>{children}</Text>;
}

export function Mono({ children, style }: TypographyProps) {
  return <Text style={[styles.mono, style]}>{children}</Text>;
}

export function Eyebrow({ children, style }: TypographyProps) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  display: {
    fontFamily: fonts.display,
    fontSize: fontSizes.xxl,
    color: colors.text,
  },
  heading: {
    fontFamily: fonts.displaySemibold,
    fontSize: fontSizes.lg,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.ui,
    fontSize: fontSizes.base,
    color: colors.text,
  },
  muted: {
    fontFamily: fonts.ui,
    fontSize: fontSizes.base,
    color: colors.textDim,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.base,
    color: colors.text,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
