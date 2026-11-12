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
  /** The control size of the `pill` surface (CONVENTIONS "Control sizes"): `md` 44 tall (a screen's back
   *  control), `sm` 36 with a 44 target (a compact header). As web. @default 'md' */
  size?: 'md' | 'sm';
}

// the default row is 26pt tall and the sm pill 36: the slop reaches the 44pt touch target, same look
const SLOP = { default: { top: 9, bottom: 9, left: 4, right: 4 }, sm: { top: 4, bottom: 4 } } as const;

/** "‹ Back" navigation affordance — chevron-left glyph + label, in accent. */
export function BackLink({ label = 'Back', onClick, style, variant = 'default', size = 'md', ...rest }: BackLinkProps) {
  const isPill = variant === 'pill';
  const sm = isPill && size === 'sm';
  const iconColor = isPill ? colors.textDim : colors.accent;
  const iconSize = isPill ? (sm ? 14 : 16) : 18;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onClick}
      hitSlop={isPill ? (sm ? SLOP.sm : undefined) : SLOP.default}
      style={({ pressed }) => [
        isPill ? pillStyles.row : styles.row,
        sm && pillStyles.rowSm,
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
    // md 44 tall, as web (CONVENTIONS "Control sizes")
    minHeight: 44,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border2,
    // a control's fill (V19)
    backgroundColor: colors.field,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  rowSm: { minHeight: 36, paddingHorizontal: 12 },
  label: { color: colors.textDim, fontFamily: fonts.mono, fontSize: 11.5, fontWeight: '400' },
});
