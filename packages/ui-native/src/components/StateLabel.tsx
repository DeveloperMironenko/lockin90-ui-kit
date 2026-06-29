import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';

export interface StateLabelProps extends ViewProps {
  /** Numeric or short alphanumeric badge, e.g. `"01"`. Rendered mono, accent-2 color. */
  num: string;
  /** Section name, e.g. `"Sign in"`. Rendered mono uppercase, faint. */
  label: string;
}

/** StateLabel — numbered section header: mono numeral chip + uppercase label +
 *  hairline rule (`01 ────── SIGN IN ──────`). Native twin of the web
 *  `StateLabel`. Used on auth screen sections. */
export function StateLabel({ num, label, style, ...rest }: StateLabelProps) {
  return (
    <View style={[styles.row, style]} {...rest}>
      <View style={styles.numWrap}>
        <Text style={styles.num}>{num}</Text>
      </View>
      <Text style={styles.lbl}>{label}</Text>
      <View style={styles.ln} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 2,
    marginBottom: 14,
  },
  numWrap: {
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.3)',
    backgroundColor: 'rgba(34,211,238,0.08)',
    borderRadius: radii.pill,
    paddingVertical: 2,
    paddingHorizontal: 9,
  },
  num: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 13,
    color: colors.accent2,
  },
  lbl: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  ln: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border2,
    opacity: 0.6,
  },
});
