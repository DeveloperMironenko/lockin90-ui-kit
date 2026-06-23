import { type ReactNode } from 'react';
import { View, Text, Image, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii, gradients } from '@lockin90/tokens';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

export interface ProfileStat {
  /** Small uppercase caption beneath the value (e.g. `'Followers'`). */
  label: string;
  /** Big display value (e.g. `'2.4k'`). */
  value: string;
}

export interface ProfileHeaderProps {
  /** Display name, shown in the display face. */
  name: string;
  /** Optional @handle (rendered in mono, with a leading `@`). */
  handle?: string;
  /** Avatar image URL — falls back to a monogram of `name`. */
  avatar?: string;
  /** Cover banner image URL; when absent a brand flux gradient is painted. */
  cover?: string;
  /** Optional bio prose. */
  bio?: ReactNode;
  /** Stat grid (e.g. Followers / Following / Streak), evenly spaced. */
  stats?: ProfileStat[];
  /** Show a verified check beside the name. */
  verified?: boolean;
  /** Top-right action slot — consumer passes a FollowButton / Edit button. */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * ProfileHeader — a social profile hero: a cover banner (image or brand flux
 * gradient fallback) with an overlapping circular Avatar at its bottom-left,
 * a name row (display name + optional verified check + @handle) with an action
 * slot top-right, the bio prose, and an evenly-spaced stat grid. Composed from
 * the kit Avatar + Icon. Mirrors `.pf-cover / .pf-body` from the design mockup.
 */
export function ProfileHeader({
  name,
  handle,
  avatar,
  cover,
  bio,
  stats,
  verified,
  action,
  style,
}: ProfileHeaderProps) {
  return (
    <View style={[styles.pf, style]}>
      <View style={styles.cover}>
        {cover ? (
          <Image source={{ uri: cover }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={gradients.flux.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {/* darken toward the bottom so the overlapping avatar reads */}
        <LinearGradient
          colors={['transparent', 'rgba(8,10,18,0.7)']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.top}>
          <Avatar style={styles.avatar} name={name} src={avatar} size={84} />
          {action != null && <View style={styles.action}>{action}</View>}
        </View>

        <View style={styles.id}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {verified && <Icon name="checkCircle" size={18} color={colors.cyan} />}
          </View>
          {handle != null && <Text style={styles.handle}>@{handle}</Text>}
        </View>

        {bio != null &&
          (typeof bio === 'string' || typeof bio === 'number' ? (
            <Text style={styles.bio}>{bio}</Text>
          ) : (
            <View>{bio}</View>
          ))}

        {stats != null && stats.length > 0 && (
          <View style={styles.stats}>
            {stats.map((s, i) => (
              <View style={styles.stat} key={`${s.label}-${i}`}>
                <Text style={styles.statV}>{s.value}</Text>
                <Text style={styles.statL}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pf: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
    overflow: 'hidden',
  },
  cover: {
    height: 132,
    backgroundColor: colors.bg2,
    position: 'relative',
  },
  body: {
    marginTop: -42,
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 14,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  avatar: {
    borderWidth: 3,
    borderColor: colors.bg1,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 4,
  },
  id: { gap: 3 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.2,
    color: colors.text,
  },
  handle: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textDim,
  },
  bio: {
    fontFamily: fonts.ui,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textDim,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  statV: {
    fontFamily: fonts.display,
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.text,
  },
  statL: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    textTransform: 'uppercase',
    letterSpacing: 0.85,
    color: colors.textFaint,
  },
});
