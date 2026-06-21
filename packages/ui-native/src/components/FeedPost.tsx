import { type ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';
import { Card } from './Card';

export interface FeedPostAuthor {
  /** Display name, e.g. 'Jordan D'. */
  name: string;
  /** Handle, e.g. '@jordan_d'. */
  handle: string;
  /** Two-letter avatar initials, e.g. 'JD'. */
  initials: string;
  /** Show the verified check beside the name. */
  verified?: boolean;
}

export interface FeedPostAttach {
  /** Chip label, e.g. '🔥 14-day streak'. */
  label: string;
  /** Chip tone — defaults to 'mid' (the streak look). */
  tone?: ChipTone;
  /** Leading glowing dot on the chip. */
  dot?: boolean;
}

export interface FeedPostEngagement {
  /** Like count. */
  likes: number;
  /** Comment count. */
  comments: number;
  /** Like shown active (filled heart, low tone). */
  liked?: boolean;
}

export interface FeedPostProps extends ViewProps {
  /** Post author — avatar, name, handle. */
  author?: FeedPostAuthor;
  /** Relative time, e.g. '2h'. */
  time?: string;
  /** Post body; ReactNode of <Text> so consumers can color hashtags. */
  body?: ReactNode;
  /** Optional attached chip under the body (e.g. a streak). */
  attach?: FeedPostAttach;
  /** Like / comment counts + liked state. */
  engagement?: FeedPostEngagement;
}

const DEFAULT_AUTHOR: FeedPostAuthor = {
  name: 'Jordan D',
  handle: '@jordan_d',
  initials: 'JD',
  verified: true,
};

/** Default body is a factory (not a constant) so it reads `styles` lazily at
 *  render time — referencing `styles` at module load would hit its TDZ. */
function defaultBody(): ReactNode {
  return (
    <>
      Hit a <Text style={styles.tag}>#sleepstreak</Text> 😴 — energy’s up 18% this week. The 10pm wind-down
      alarm changed everything.
    </>
  );
}

const DEFAULT_ATTACH: FeedPostAttach = { label: '🔥 14-day streak', tone: 'mid', dot: true };

const DEFAULT_ENGAGEMENT: FeedPostEngagement = { likes: 42, comments: 8, liked: true };

/** Community feed post — gradient-avatar header (name, handle, time), body with an
 *  attached streak chip, and a like / comment / share / save engagement footer.
 *  Renders the showcase example by default. */
export function FeedPost({
  author = DEFAULT_AUTHOR,
  time = '2h',
  body,
  attach = DEFAULT_ATTACH,
  engagement = DEFAULT_ENGAGEMENT,
  style,
  ...rest
}: FeedPostProps) {
  const likeColor = engagement.liked ? colors.zoneLow : colors.textDim;

  return (
    <Card style={[styles.card, style]} {...rest}>
      <View style={styles.head}>
        <LinearGradient
          colors={gradients.cta.stops}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.av}
        >
          <Text style={styles.avText}>{author.initials}</Text>
        </LinearGradient>
        <View style={styles.id}>
          <View style={styles.pn}>
            <Text style={styles.name}>{author.name}</Text>
            {author.verified && (
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Circle cx={12} cy={12} r={9} stroke={colors.accent2} strokeWidth={2} fill="none" />
                <Path d="M9 12l2 2 4-4" stroke={colors.accent2} strokeWidth={2} fill="none" />
              </Svg>
            )}
          </View>
          <Text style={styles.ph}>
            {author.handle}
            <Text style={styles.dot}> · </Text>
            {time}
          </Text>
        </View>
      </View>

      <Text style={styles.text}>{body ?? defaultBody()}</Text>

      {attach && (
        <View style={styles.attach}>
          <Chip tone={attach.tone ?? 'mid'} dot={attach.dot} label={attach.label} />
        </View>
      )}

      <View style={styles.foot}>
        <Pressable style={styles.react}>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path
              d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"
              stroke={likeColor}
              strokeWidth={1.7}
              fill={engagement.liked ? colors.zoneLow : 'none'}
            />
          </Svg>
          <Text style={[styles.cnt, { color: likeColor }]}>{engagement.likes}</Text>
        </Pressable>

        <Pressable style={styles.react}>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path
              d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5z"
              stroke={colors.textDim}
              strokeWidth={1.7}
              fill="none"
            />
          </Svg>
          <Text style={styles.cnt}>{engagement.comments}</Text>
        </Pressable>

        <Pressable style={styles.react}>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path
              d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"
              stroke={colors.textDim}
              strokeWidth={1.7}
              fill="none"
            />
          </Svg>
          <Text style={styles.cnt}>Share</Text>
        </Pressable>

        <Pressable style={[styles.react, styles.save]} accessibilityLabel="Save">
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path
              d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
              stroke={colors.textDim}
              strokeWidth={1.7}
              fill="none"
            />
          </Svg>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, paddingHorizontal: 20 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  av: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avText: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, color: '#07080d' },
  id: { flex: 1, minWidth: 0 },
  pn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontWeight: '600', fontSize: 14.5, lineHeight: 17, color: colors.text },
  ph: { fontFamily: fonts.mono, fontSize: 11.5, color: colors.textFaint, marginTop: 2 },
  dot: { color: colors.border2 },
  text: { marginTop: 13, fontSize: 14, color: colors.text, lineHeight: 22 },
  tag: { color: colors.accent2, fontWeight: '500' },
  attach: { marginTop: 13, flexDirection: 'row' },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  react: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
  },
  cnt: { fontFamily: fonts.mono, fontSize: 12, color: colors.textDim },
  save: { marginLeft: 'auto' },
});
