import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';

export interface NotificationRowProps {
  /** Primary line — the notification headline. */
  title: string;
  /** Right-aligned relative timestamp (e.g. `"2h"`, `"just now"`). */
  time: string;
  /** Optional second line — the notification body / detail. */
  body?: string;
  /** When set, shows the unread accent dot and emphasizes the title. */
  unread?: boolean;
  /** Optional typed leading glyph (e.g. `"bell"`, `"heart"`, `"medal"`). */
  icon?: IconName;
  /** When set, the row becomes a `Pressable` (opens the notification). */
  onPress?: () => void;
  /** Optional container style (margins/spacing). */
  style?: StyleProp<ViewStyle>;
}

/**
 * NotificationRow — a single notification list item: an optional unread accent
 * dot + optional typed leading icon, the `title`, a right-aligned relative
 * `time`, and an optional `body` second line. Shared cross-platform contract
 * with the web `@lockin90/ui` `NotificationRow`. With `onPress` it renders a
 * `Pressable` that highlights while pressed; otherwise a static `View`.
 */
export function NotificationRow({
  title,
  time,
  body,
  unread,
  icon,
  onPress,
  style,
}: NotificationRowProps) {
  const content = (
    <>
      <View style={styles.leading}>
        {unread ? <View style={styles.dot} /> : <View style={styles.dotSpacer} />}
        {icon != null && (
          <Icon name={icon} size={18} color={unread ? colors.text : colors.textDim} />
        )}
      </View>
      <View style={styles.main}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            style={[styles.title, unread ? styles.titleUnread : styles.titleRead]}
          >
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.time}>
            {time}
          </Text>
        </View>
        {body != null && (
          <Text numberOfLines={2} style={styles.body}>
            {body}
          </Text>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.row, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
  },
  pressed: {
    backgroundColor: colors.glass,
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    // nudge down so the dot/icon aligns with the title cap-height
    paddingTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    // subtle accent glow (mirrors StatusDot's dot glow)
    shadowColor: colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  // keeps the text column aligned whether or not the unread dot is present
  dotSpacer: {
    width: 8,
    height: 8,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.ui,
    fontSize: 14.5,
    lineHeight: 18,
  },
  titleUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  titleRead: {
    color: colors.textDim,
    fontWeight: '500',
  },
  time: {
    flexShrink: 0,
    fontFamily: fonts.ui,
    fontSize: 12,
    color: colors.textFaint,
  },
  body: {
    marginTop: 2,
    fontFamily: fonts.ui,
    fontSize: 12.5,
    lineHeight: 16,
    color: colors.textDim,
  },
});
