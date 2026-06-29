import { Pressable, Text, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';
import { Icon } from './Icon';

export interface BackLinkProps extends Omit<PressableProps, 'children' | 'style' | 'onPress'> {
  /** Visible label after the chevron. @default 'Back' */
  label?: string;
  /** Mirrors the web `onClick`; fired on press. */
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * Visual variant.
   * - `'default'` — flat accent text link (the original look).
   * - `'pill'` — glass-chip mono affordance (bordered glass surface, dim mono
   *   label). Mirrors the web `variant="pill"`; hover is web-only, press
   *   feedback is preserved.
   * @default 'default'
   */
  variant?: 'default' | 'pill';
}

/** "‹ Back" navigation affordance — chevron-left glyph + label, in accent. */
export function BackLink({ label = 'Back', onClick, style, variant = 'default', ...rest }: BackLinkProps) {
  const isPill = variant === 'pill';
  const iconColor = isPill ? colors.textDim : colors.accent;
  const iconSize = isPill ? 14 : 18;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onClick}
      style={({ pressed }) => [
        isPill ? pillStyles.row : styles.row,
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      <Icon name="back" size={iconSize} color={iconColor} />
      <Text style={isPill ? pillStyles.label : styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 2 },
  pressed: { opacity: 0.7 },
  label: { color: colors.accent, fontFamily: fonts.ui, fontSize: 14.5, fontWeight: '600' },
});

const pillStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  label: { color: colors.textDim, fontFamily: fonts.mono, fontSize: 11.5, fontWeight: '400' },
});
