import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

/** Avatar gradient token — paints the rounded avatar tile background. */
export type ConvAvatar = 'violet' | 'cta';

export interface ConvThread {
  /** Display name, e.g. 'Coach Mara'. */
  name: string;
  /** Avatar initials, e.g. 'CM'. Omit on group threads to show the group glyph. */
  initials?: string;
  /** Last-message preview line. */
  preview: string;
  /** Sender prefix on group previews, e.g. 'Ava:'. */
  from?: string;
  /** Relative time, e.g. '14m'. */
  time: string;
  /** Unread count → gradient pill; bolds the preview too. */
  unread?: number;
  /** Online → glowing teal presence dot (else a faint idle dot). */
  online?: boolean;
  /** E2EE thread → lock badge on the avatar + inline "Encrypted" chip. */
  encrypted?: boolean;
  /** Verified contact → accent tick beside the name. */
  verified?: boolean;
  /** Group thread → renders the group-people glyph instead of initials. */
  group?: boolean;
  /** Highlight the row as the currently-open thread. */
  active?: boolean;
  /** Avatar gradient (default 'violet'). */
  avatar?: ConvAvatar;
}

export interface ConvFollow {
  /** Button label, e.g. 'Follow' / 'Following ✓'. */
  label: string;
  /** Following state → glass + teal toggle styling. */
  following?: boolean;
}

export interface ConversationListProps {
  /** Thread rows. */
  threads?: ConvThread[];
  /** Follow / Following toggle button pair under the list. */
  follows?: ConvFollow[];
  style?: StyleProp<ViewStyle>;
}

const AVATAR_GRAD: Record<ConvAvatar, readonly [string, string]> = {
  violet: gradients.violet.stops as readonly [string, string],
  cta: gradients.cta.stops as readonly [string, string],
};

const DEFAULT_THREADS: ConvThread[] = [
  {
    name: 'Coach Mara',
    initials: 'CM',
    preview: "Let's push the morning walk",
    time: '14m',
    unread: 2,
    online: true,
    encrypted: true,
    verified: true,
    active: true,
    avatar: 'violet',
  },
  {
    name: 'Leo P',
    initials: 'LP',
    preview: 'Nice streak!',
    time: '1h',
    avatar: 'cta',
  },
  {
    name: 'Recovery Squad',
    preview: "who's plunging?",
    from: 'Ava:',
    time: '3h',
    unread: 5,
    group: true,
    avatar: 'violet',
  },
];

const DEFAULT_FOLLOWS: ConvFollow[] = [
  { label: 'Follow' },
  { label: 'Following ✓', following: true },
];

function LockGlyph({ size, stroke }: { size: number; stroke: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={4} y={11} width={16} height={9} rx={2} stroke={stroke} strokeWidth={2.2} fill="none" />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={stroke} strokeWidth={2.2} fill="none" />
    </Svg>
  );
}

function GroupGlyph() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Circle cx={9} cy={9} r={3} stroke="#07080d" strokeWidth={1.8} fill="none" />
      <Path d="M3 20a6 6 0 0 1 12 0" stroke="#07080d" strokeWidth={1.8} fill="none" />
      <Path d="M16 7a3 3 0 0 1 0 6M21 20a6 6 0 0 0-5-5.9" stroke="#07080d" strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

function Avatar({ thread }: { thread: ConvThread }) {
  return (
    <View style={styles.av}>
      <LinearGradient
        colors={AVATAR_GRAD[thread.avatar ?? 'violet']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avFill}
      >
        {thread.group ? <GroupGlyph /> : <Text style={styles.avInitials}>{thread.initials}</Text>}
      </LinearGradient>
      <View style={[styles.presence, thread.online ? styles.presenceOnline : styles.presenceIdle]} />
      {thread.encrypted && (
        <View style={styles.lockBadge}>
          <LockGlyph size={9} stroke={colors.zoneHigh} />
        </View>
      )}
    </View>
  );
}

function ThreadRow({ thread }: { thread: ConvThread }) {
  const unread = (thread.unread ?? 0) > 0;
  return (
    <Pressable style={[styles.row, thread.active && styles.rowActive]}>
      <Avatar thread={thread} />
      <View style={styles.meta}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {thread.name}
          </Text>
          {thread.verified && (
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path d="M9 12l2 2 4-4" stroke={colors.accent2} strokeWidth={1.8} fill="none" />
              <Path
                d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5z"
                stroke={colors.accent2}
                strokeWidth={1.8}
                fill="none"
              />
            </Svg>
          )}
        </View>
        <View style={styles.line}>
          <Text style={[styles.preview, unread && styles.previewUnread]} numberOfLines={1}>
            {thread.from && <Text style={styles.from}>{thread.from} </Text>}
            {thread.preview}
          </Text>
          {thread.encrypted && (
            <View style={styles.e2ee}>
              <LockGlyph size={9} stroke={colors.zoneHigh} />
              <Text style={styles.e2eeText}>Encrypted</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{thread.time}</Text>
        {unread && (
          <LinearGradient
            colors={gradients.cta.stops as readonly [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{thread.unread}</Text>
          </LinearGradient>
        )}
      </View>
    </Pressable>
  );
}

function FollowButton({ follow }: { follow: ConvFollow }) {
  if (follow.following) {
    return (
      <Pressable style={[styles.follow, styles.followFollowing]}>
        <Text style={[styles.followLabel, styles.followLabelFollowing]}>{follow.label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable style={styles.followWrap}>
      <LinearGradient
        colors={gradients.cta.stops as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.follow}
      >
        <Svg width={11} height={11} viewBox="0 0 24 24">
          <Path d="M12 5v14M5 12h14" stroke="#08090f" strokeWidth={2.6} fill="none" />
        </Svg>
        <Text style={styles.followLabel}>{follow.label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** Conversation list — DM/thread rows with a gradient avatar (online presence dot + E2EE
 *  lock badge), name (+ verified tick), last-message preview, time + unread count pill, an
 *  inline "Encrypted" chip on encrypted threads, plus a Follow / Following toggle pair.
 *  Renders the showcase example by default. */
export function ConversationList({
  threads = DEFAULT_THREADS,
  follows = DEFAULT_FOLLOWS,
  style,
}: ConversationListProps) {
  return (
    <View style={[styles.wrap, style]}>
      {threads.map((t, i) => (
        <ThreadRow key={i} thread={t} />
      ))}
      {follows.length > 0 && (
        <View style={styles.follows}>
          {follows.map((f, i) => (
            <FollowButton key={i} follow={f} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 11,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowActive: { backgroundColor: 'rgba(124,92,255,0.10)', borderColor: 'rgba(124,92,255,0.26)' },

  av: { width: 46, height: 46, position: 'relative' },
  avFill: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avInitials: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, color: '#07080d' },
  presence: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#07080d',
  },
  presenceOnline: {
    backgroundColor: colors.zoneHigh,
    shadowColor: colors.zoneHigh,
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  presenceIdle: { backgroundColor: colors.textFaint },
  lockBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#07080d',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52,245,197,0.4)',
  },

  meta: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 13.5, color: colors.text, flexShrink: 1 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 2 },
  preview: { fontSize: 12.5, color: colors.textDim, flexShrink: 1 },
  previewUnread: { color: colors.text, fontWeight: '500' },
  from: { color: colors.textDim, fontWeight: '600' },

  e2ee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(52,245,197,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(52,245,197,0.28)',
  },
  e2eeText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.36,
    color: colors.zoneHigh,
  },

  right: { alignItems: 'center', gap: 6 },
  time: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },
  badge: {
    minWidth: 19,
    height: 19,
    paddingHorizontal: 5,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  badgeText: { fontFamily: fonts.mono, fontSize: 10, fontWeight: '600', color: '#08090f' },

  follows: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 14, paddingHorizontal: 2, paddingBottom: 2 },
  followWrap: { borderRadius: radii.pill },
  follow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  followFollowing: { backgroundColor: colors.glass, borderColor: 'rgba(52,245,197,0.4)' },
  followLabel: { fontFamily: fonts.ui, fontSize: 11, fontWeight: '700', color: '#08090f' },
  followLabelFollowing: { color: colors.zoneHigh },
});
