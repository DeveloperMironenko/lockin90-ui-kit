import { Pressable, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle, PressableStateCallbackType } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, fontSizes, spacing } from '@lockin90/tokens';

export interface BackLinkProps {
  /** Text after the chevron. Default "Back". */
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Back-navigation affordance — a left chevron + label, used at the top of pushed
 * sub-screens (account, changelog, …) so there's always a visible way back. The
 * native counterpart of the web `@lockin90/ui` BackLink (same chevron + label,
 * same muted tone). Wire it to `router.back()` at the call site.
 */
export function BackLink({ label = 'Back', onPress, style }: BackLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => [
        styles.row,
        state.pressed && styles.pressed,
        style,
      ]}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24">
        <Path
          d="M15 19l-7-7 7-7"
          stroke={colors.textDim}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  pressed: { opacity: 0.6 },
  label: {
    fontFamily: fonts.uiMedium,
    fontSize: fontSizes.sm,
    color: colors.textDim,
  },
});

export default BackLink;
