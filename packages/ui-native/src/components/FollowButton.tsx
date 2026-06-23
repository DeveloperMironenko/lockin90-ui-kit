import { Pressable, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Icon } from './Icon';

export interface FollowButtonProps {
  /** Controlled follow state. */
  following: boolean;
  /** Fired when the pill is pressed — flip `following` in the parent. */
  onToggle: () => void;
  size?: 'sm' | 'md';
  /** Label shown when not following. @default 'Follow' */
  followLabel?: string;
  /** Label shown when following. @default 'Following' */
  followingLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pill follow toggle — native twin of the web `FollowButton`. Not-following =
 * accent-filled "＋ Follow"; following = glass/outlined "✓ Following" (dim).
 * Controlled via `following` + `onToggle`.
 */
export function FollowButton({
  following,
  onToggle,
  size = 'md',
  followLabel = 'Follow',
  followingLabel = 'Following',
  disabled,
  style,
}: FollowButtonProps) {
  const glyph = size === 'sm' ? 12 : 13;
  const pad = size === 'sm' ? styles.padSm : styles.padMd;
  const labelSize = size === 'sm' ? 12 : 12.5;

  const tone = following
    ? { color: colors.textDim, border: colors.border, bg: colors.glass }
    : { color: '#cbbcff', border: 'rgba(124,92,255,0.45)', bg: 'rgba(124,92,255,0.10)' };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: following, disabled }}
      disabled={disabled}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.base,
        pad,
        { borderColor: tone.border, backgroundColor: tone.bg },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Icon name={following ? 'check' : 'plus'} size={glyph} color={tone.color} />
      <Text style={[styles.label, { fontSize: labelSize, color: tone.color }]}>
        {following ? followingLabel : followLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  padMd: { paddingVertical: 7, paddingHorizontal: 15 },
  padSm: { paddingVertical: 6, paddingHorizontal: 13 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  label: { fontFamily: fonts.ui, fontWeight: '600' },
});
