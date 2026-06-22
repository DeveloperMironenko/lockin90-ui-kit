import { Pressable, Text, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { Icon } from './Icon';

export interface BackLinkProps extends Omit<PressableProps, 'children' | 'style' | 'onPress'> {
  /** Visible label after the chevron. @default 'Back' */
  label?: string;
  /** Mirrors the web `onClick`; fired on press. */
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** "‹ Back" navigation affordance — chevron-left glyph + label, in accent. */
export function BackLink({ label = 'Back', onClick, style, ...rest }: BackLinkProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onClick}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}
      {...rest}
    >
      <Icon name="back" size={18} color={colors.accent} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 2 },
  pressed: { opacity: 0.7 },
  label: { color: colors.accent, fontFamily: fonts.ui, fontSize: 14.5, fontWeight: '600' },
});
