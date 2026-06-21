import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

/** Identity rendered over the cover banner. */
export interface ProfileUser {
  /** Display name, e.g. "Maya Kane". */
  name?: string;
  /** Handle / sub-line shown under the name, e.g. "@maya_k · 🏃 Marathoner". */
  handle?: string;
  /** Initials for the avatar (falls back to the first two letters of `name`). */
  initials?: string;
  /** Short bio paragraph. `b` segments render emphasized. */
  bio?: string;
  /** Whether to show the verified tick beside the name. */
  verified?: boolean;
}

/** One cell of the 4-up stat grid. */
export interface ProfileStat {
  /** Numeric / display value, e.g. "142" or "1.2". */
  value: string;
  /** Mono caption beneath the value, e.g. "🔥 Streak". */
  label: string;
  /** Small trailing unit rendered inside the value, e.g. "k" → "1.2k". */
  suffix?: string;
  /** Render the value with the brand gradient color (used for the streak). */
  gradient?: boolean;
}

export interface ProfileHeaderProps {
  /** Identity shown over the cover. */
  user?: ProfileUser;
  /** The 4-up stat grid (streak / followers / following / avg score). */
  stats?: ProfileStat[];
  /** Follow button label. */
  followLabel?: string;
  /** Follow button handler. */
  onFollow?: () => void;
  /** Message button handler — omit to hide the message action. */
  onMessage?: () => void;
}

const DEFAULT_USER: ProfileUser = {
  name: 'Maya Kane',
  handle: '@maya_k · 🏃 Marathoner',
  initials: 'MK',
  bio: 'Optimizing recovery between long runs. Early sleeper, caffeine-cutter, <b>forecast believer</b>. 90-day club, week 11.',
  verified: true,
};

const DEFAULT_STATS: ProfileStat[] = [
  { value: '142', label: '🔥 Streak', gradient: true },
  { value: '1.2', label: 'Followers', suffix: 'k' },
  { value: '312', label: 'Following' },
  { value: '7.4', label: 'Avg score' },
];

/** Resolve the avatar initials from explicit prop or the name. */
function initialsFor(user: ProfileUser): string {
  if (user.initials) return user.initials;
  return (user.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

/** Split a bio on `<b>…</b>` markers into plain + emphasized runs. */
function bioRuns(bio: string): { text: string; bold: boolean }[] {
  return bio
    .split(/(<b>.*?<\/b>)/g)
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^<b>(.*?)<\/b>$/);
      return m ? { text: m[1]!, bold: true } : { text: part, bold: false };
    });
}

/**
 * Profile header: a gradient cover banner with an overlapping initials avatar,
 * identity (name + verified tick + @handle), follow/message actions, a bio
 * paragraph, and a 4-up stat grid (streak / followers / following / avg score).
 * Mirrors the web `ProfileHeader` 1:1.
 */
export function ProfileHeader({
  user = DEFAULT_USER,
  stats = DEFAULT_STATS,
  followLabel = 'Follow',
  onFollow,
  onMessage,
}: ProfileHeaderProps) {
  return (
    <View style={styles.pf}>
      {/* cover banner */}
      <LinearGradient
        colors={gradients.flux.stops as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.4 }}
        style={styles.cover}
      >
        <LinearGradient
          colors={['transparent', 'rgba(8,10,18,0.72)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.id}>
            {/* overlapping avatar */}
            <LinearGradient
              colors={gradients.violet.stops as unknown as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarTxt}>{initialsFor(user)}</Text>
            </LinearGradient>

            <View style={styles.who}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {user.name}
                </Text>
                {user.verified ? (
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Circle cx={12} cy={12} r={9} stroke={colors.accent} strokeWidth={2.2} fill="none" />
                    <Path
                      d="M9 12l2 2 4-4"
                      stroke={colors.accent}
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </Svg>
                ) : null}
              </View>
              {user.handle ? (
                <Text style={styles.handle} numberOfLines={1}>
                  {user.handle}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onFollow}>
              <LinearGradient
                colors={gradients.cta.stops as unknown as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.follow}
              >
                <Svg width={14} height={14} viewBox="0 0 24 24">
                  <Path
                    d="M12 5v14M5 12h14"
                    stroke="#0A0A12"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </Svg>
                <Text style={styles.followTxt}>{followLabel}</Text>
              </LinearGradient>
            </Pressable>
            {onMessage ? (
              <Pressable
                style={styles.msg}
                onPress={onMessage}
                accessibilityLabel={`Message ${user.name ?? ''}`.trim()}
                accessibilityRole="button"
              >
                <Svg width={15} height={15} viewBox="0 0 24 24">
                  <Path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke={colors.textDim}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </Svg>
              </Pressable>
            ) : null}
          </View>
        </View>

        {user.bio ? (
          <Text style={styles.bio}>
            {bioRuns(user.bio).map((run, i) => (
              <Text key={i} style={run.bold ? styles.bioBold : undefined}>
                {run.text}
              </Text>
            ))}
          </Text>
        ) : null}

        <View style={styles.stats}>
          {stats.map((stat, i) => (
            <View style={styles.stat} key={i}>
              <View style={styles.statV}>
                <Text style={[styles.statValue, stat.gradient && styles.statValueGradient]}>{stat.value}</Text>
                {stat.suffix ? <Text style={styles.statSuffix}>{stat.suffix}</Text> : null}
              </View>
              <Text style={styles.statL}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pf: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },

  cover: { height: 120 },

  body: { paddingHorizontal: 16, paddingBottom: 16, marginTop: -42, gap: 13 },
  top: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  id: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, flex: 1, minWidth: 0 },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.bg0,
  },
  avatarTxt: { fontFamily: fonts.display, fontWeight: '700', fontSize: 26, letterSpacing: -0.5, color: '#0A0A12' },

  who: { paddingBottom: 5, flexShrink: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { fontFamily: fonts.display, fontSize: 20, fontWeight: '700', letterSpacing: -0.4, color: colors.text, flexShrink: 1 },
  handle: { fontFamily: fonts.mono, fontSize: 11.5, color: colors.textFaint, marginTop: 4 },

  actions: { flexDirection: 'row', gap: 8 },
  follow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
  },
  followTxt: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '700', color: '#0A0A12' },
  msg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass,
  },

  bio: { fontFamily: fonts.ui, fontSize: 12.5, lineHeight: 19, color: colors.textDim },
  bioBold: { color: colors.text, fontWeight: '600' },

  stats: { flexDirection: 'row', gap: 8 },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass2,
  },
  statV: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 3 },
  statValue: { fontFamily: fonts.display, fontWeight: '700', fontSize: 18, letterSpacing: -0.4, color: colors.text },
  statValueGradient: { color: colors.mint },
  statSuffix: { fontFamily: fonts.mono, fontSize: 9, fontWeight: '500', color: colors.textFaint, letterSpacing: 0.4 },
  statL: { fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.8, color: colors.textFaint, marginTop: 5, textTransform: 'uppercase' },
});
