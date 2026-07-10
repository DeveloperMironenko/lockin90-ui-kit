import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';

/** Tint of the leading icon tile — the design's `.n-ico.t-*` category tones. */
export type NotificationTone =
  | 'insight'
  | 'coach'
  | 'achieve'
  | 'announce'
  | 'sync'
  | 'billing';

export interface NotificationRowProps {
  /** Primary line — the notification headline. */
  title: string;
  /** Right-aligned relative timestamp (e.g. `"2h"`, `"just now"`). */
  time: string;
  /** Optional second line — the notification body / detail. Accepts a node so
   *  hosts can render rich text (links/bold) via `RichText`. */
  body?: string | ReactNode;
  /** When set, shows the unread cyan dot, tints the card and draws the
   *  gradient left-edge bar (design `.notif.unread`). Read rows dim to 66%. */
  unread?: boolean;
  /** Typed glyph shown inside the 34px tinted tile (e.g. `"bell"`, `"heart"`). */
  icon?: IconName;
  /** Tile tint per notification category (design `.n-ico.t-*`). @default 'announce' */
  tone?: NotificationTone;
  /** When set, the row becomes a `Pressable` (opens the notification). */
  onPress?: () => void;
  /** Optional container style (margins/spacing). */
  style?: StyleProp<ViewStyle>;
}

// Design `.n-ico.t-*` paired literals — glyph color + 10% fill + 32% border
// (sync's border is 34%, per the mock).
const TONES: Record<NotificationTone, { color: string; bg: string; border: string }> = {
  insight: { color: '#22D3EE', bg: 'rgba(34,211,238,0.10)', border: 'rgba(34,211,238,0.32)' },
  coach: { color: '#A855F7', bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.32)' },
  achieve: { color: '#A8FF35', bg: 'rgba(168,255,53,0.10)', border: 'rgba(168,255,53,0.32)' },
  announce: { color: '#7C5CFF', bg: 'rgba(124,92,255,0.10)', border: 'rgba(124,92,255,0.32)' },
  sync: { color: '#FFB020', bg: 'rgba(255,176,32,0.10)', border: 'rgba(255,176,32,0.34)' },
  billing: { color: '#34F5C5', bg: 'rgba(52,245,197,0.10)', border: 'rgba(52,245,197,0.32)' },
};

/**
 * NotificationRow — one inbox card (design extras.html `.card.notif`): a 34px
 * tinted icon tile, headline + right-aligned mono time (unread rows lead with
 * a glowing cyan dot), and an optional snippet below. Unread cards tint
 * violet and draw a 3px gradient bar down the left edge; read cards dim to
 * 66%. Shared cross-platform contract with the web `@lockin90/ui`
 * `NotificationRow`. With `onPress` it renders a `Pressable` that highlights
 * while pressed; otherwise a static `View`.
 */
export function NotificationRow({
  title,
  time,
  body,
  unread,
  icon,
  tone = 'announce',
  onPress,
  style,
}: NotificationRowProps) {
  const tint = TONES[tone];

  const content = (
    <>
      {/* design `.notif.unread::after` — 3px grad-cta edge bar, inset 11 top/bottom */}
      {unread ? (
        <LinearGradient
          colors={gradients.cta.stops as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.edge}
        />
      ) : null}
      {icon != null && (
        <View
          style={[
            styles.tile,
            { backgroundColor: tint.bg, borderColor: tint.border },
          ]}
        >
          <Icon name={icon} size={17} color={tint.color} />
        </View>
      )}
      <View style={styles.main}>
        <View style={styles.titleRow}>
          {unread ? <View style={styles.dot} /> : null}
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

  const card = [styles.row, unread ? styles.rowUnread : styles.rowRead, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [...card, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={card}>{content}</View>;
}

const styles = StyleSheet.create({
  // design `.card.notif` — glass card, radius 15, padding 11×12, tile+body gap 10
  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  // `.notif.unread` — violet tint + stronger border
  rowUnread: {
    backgroundColor: 'rgba(124,92,255,0.055)',
    borderColor: 'rgba(124,92,255,0.22)',
  },
  // `.notif.read { opacity: .66 }`
  rowRead: {
    opacity: 0.66,
  },
  pressed: {
    backgroundColor: colors.glass2,
  },
  // `.notif.unread::after` — left edge bar
  edge: {
    position: 'absolute',
    left: 0,
    top: 11,
    bottom: 11,
    width: 3,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  // `.n-ico` — 34px tinted tile, radius 10
  tile: {
    width: 34,
    height: 34,
    flexShrink: 0,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  // `.n-top` — dot + title + time
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  // `.n-udot` — 7px cyan glow dot
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent2,
    shadowColor: colors.accent2,
    shadowOpacity: 0.9,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  // `.n-title` — display 12/700, tight
  title: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.display,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.12,
    lineHeight: 14,
  },
  titleUnread: {
    color: colors.text,
  },
  titleRead: {
    color: colors.textDim,
  },
  // `.n-time` — mono 8.5 faint
  time: {
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.textFaint,
  },
  // `.n-snippet` — 10.5 dim
  body: {
    marginTop: 2,
    fontFamily: fonts.ui,
    fontSize: 10.5,
    lineHeight: 14.7,
    color: colors.textDim,
  },
});
