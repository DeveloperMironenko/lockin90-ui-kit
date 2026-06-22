import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { Avatar, type AvatarProps } from './Avatar';

/** Per-avatar props forwarded to the composed {@link Avatar}. */
export type AvatarStackItem = Pick<AvatarProps, 'name' | 'initials' | 'src' | 'gradient'>;

export interface AvatarStackProps extends ViewProps {
  /** Roster entries — each forwarded to a composed `Avatar`. */
  avatars: AvatarStackItem[];
  /** Cap of visible avatars; the remainder collapse into a trailing "+N" chip. @default 4 */
  max?: number;
  /** Pixel diameter of each avatar. @default 32 */
  size?: number;
  /**
   * Ring/gap color drawn between overlapping avatars so they read as separate.
   * @default colors.bg1
   */
  ring?: string;
}

/**
 * AvatarStack — a row of overlapping circular avatars with a trailing "+N"
 * overflow chip; social proof / multi-author / roster. Composes {@link Avatar}
 * for each entry, overlaps them with a negative `marginLeft` + descending
 * `zIndex`, and draws a border in the surrounding background color so each tile
 * reads as separate. Anything beyond `max` collapses into a same-size "+N" chip.
 */
export function AvatarStack({
  avatars,
  max = 4,
  size = 32,
  ring = colors.bg1,
  style,
  ...rest
}: AvatarStackProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;
  // Overlap ≈ a third of the diameter; border thickness scales gently with size.
  const overlap = -Math.round(size * 0.32);
  const borderWidth = Math.max(2, Math.round(size * 0.06));
  const ringStyle = { borderWidth, borderColor: ring };

  return (
    <View style={[styles.row, style]} {...rest}>
      {visible.map((a, i) => (
        <View
          key={i}
          style={{ marginLeft: i === 0 ? 0 : overlap, zIndex: visible.length - i }}
        >
          <Avatar
            {...a}
            size={size}
            style={[styles.ring, ringStyle, { width: size + borderWidth * 2, height: size + borderWidth * 2 }]}
          />
        </View>
      ))}
      {overflow > 0 && (
        <View style={{ marginLeft: overlap, zIndex: 0 }}>
          <View
            style={[
              styles.more,
              ringStyle,
              {
                width: size + borderWidth * 2,
                height: size + borderWidth * 2,
                borderRadius: (size + borderWidth * 2) / 2,
              },
            ]}
          >
            <Text style={[styles.moreText, { fontSize: Math.round(size * 0.36) }]}>+{overflow}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  ring: { borderRadius: 999 },
  more: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass2,
    borderColor: colors.border2,
  },
  moreText: {
    fontFamily: fonts.display,
    fontWeight: '700',
    color: colors.textDim,
    letterSpacing: -0.3,
  },
});
