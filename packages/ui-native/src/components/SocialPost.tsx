import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type ViewProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Avatar } from './Avatar';

export interface SocialPostAuthor {
  /** Display name. */
  name: string;
  /** Optional @handle (rendered in mono, without the leading @). */
  handle?: string;
  /** Optional avatar image URL — falls back to a monogram of `name`. */
  avatar?: string;
}

export interface SocialPostProps extends ViewProps {
  /** The post author — name, optional handle, optional avatar. */
  author: SocialPostAuthor;
  /** Relative timestamp, e.g. `'2h'`. Shown after the handle with a `·`. */
  time?: string;
  /** The post body / prose. Strings render as styled <Text>; nodes pass through. */
  body?: ReactNode;
  /** Optional attached media slot — a card, image, or progress card (rendered as-is). */
  media?: ReactNode;
  /** Optional engagement-footer slot — consumer passes `<EngagementBar/>` (rendered as-is, separated by a hairline). */
  footer?: ReactNode;
  /** Optional small tag, e.g. `'PR'` or `'Streak'`. */
  badge?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * SocialPost — a community-feed post on the glass surface: an Avatar + name +
 * @handle · time header (with an optional badge tag), the body prose, an
 * optional attached `media` slot, and an optional engagement `footer` slot
 * separated by a hairline. Composes from Card + Avatar. Mirrors the web
 * `@lockin90/ui` `SocialPost`. The footer is a slot so consumers pass the
 * separate `<EngagementBar/>` primitive.
 */
export function SocialPost({
  author,
  time,
  body,
  media,
  footer,
  badge,
  style,
  ...rest
}: SocialPostProps) {
  return (
    <Card style={style} {...rest}>
      <View style={styles.head}>
        <Avatar name={author.name} src={author.avatar} size={42} />
        <View style={styles.id}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {author.name}
            </Text>
            {badge != null && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
          {(author.handle != null || time != null) && (
            <View style={styles.meta}>
              {author.handle != null && (
                <Text style={styles.handle} numberOfLines={1}>
                  @{author.handle}
                </Text>
              )}
              {time != null && <Text style={styles.time}>{author.handle != null ? `  ·  ${time}` : time}</Text>}
            </View>
          )}
        </View>
      </View>

      {body != null &&
        (typeof body === 'string' || typeof body === 'number' ? (
          <Text style={styles.body}>{body}</Text>
        ) : (
          <View style={styles.bodySlot}>{body}</View>
        ))}

      {media != null && <View style={styles.media}>{media}</View>}

      {footer != null && <View style={styles.foot}>{footer}</View>}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  id: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontFamily: fonts.display,
    fontWeight: '600',
    fontSize: 14.5,
    lineHeight: 17,
    color: colors.text,
    flexShrink: 1,
  },
  badge: {
    flexShrink: 0,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.45)',
    backgroundColor: 'rgba(124,92,255,0.10)',
  },
  badgeText: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: '#cbbcff',
    textTransform: 'uppercase',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  handle: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.textFaint,
    flexShrink: 1,
  },
  time: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.textFaint,
  },
  body: {
    marginTop: 13,
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
  },
  bodySlot: {
    marginTop: 13,
  },
  media: {
    marginTop: 14,
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
