import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/** A single ranked competitor in the cohort. */
export interface LeaderboardRow {
  /** Rank position (1-based). 1/2/3 get the gold/silver/bronze treatment. */
  rank: number;
  /** Display name. */
  name: string;
  /** Avatar monogram, e.g. "MK". */
  initials: string;
  /** Secondary line under the name, e.g. "21-day streak". */
  meta?: string;
  /** Primary score value. */
  score: number | string;
  /** Score unit label, e.g. "avg". */
  unit?: string;
  /**
   * Medal badge text on the avatar (top-3 only), e.g. "1". When omitted but the
   * row is in the top 3, the rank is used.
   */
  medal?: string;
  /** Marks this as the current user's row — highlight + "you" tag. */
  you?: boolean;
}

export interface LeaderboardProps {
  /** Header title. */
  title?: string;
  /** Header subtitle (mono, uppercase). */
  sub?: string;
  /** Header metric chip, e.g. "28 in cohort". Hidden when empty. */
  metric?: string;
  /** Ranked rows, best-first. */
  rows?: LeaderboardRow[];
  /** Total cohort size for the footer's "of N"; defaults to the row count. */
  total?: number;
  /** Footer lead-in before the bolded rank; the bolded "#N of M" follows. */
  footerLead?: string;
  /** Footer trailing text after the bolded rank. */
  footerTail?: string;
  /** Footer CTA text. Hidden when empty. */
  footerCta?: string;
  style?: StyleProp<ViewStyle>;
}

/** The design's example cohort. */
const DEFAULT_ROWS: LeaderboardRow[] = [
  { rank: 1, name: 'Mara K', initials: 'MK', meta: '21-day streak', score: '6.9', unit: 'avg' },
  { rank: 2, name: 'Leo P', initials: 'LP', meta: '18-day streak', score: '6.7', unit: 'avg' },
  { rank: 3, name: 'Ava R', initials: 'AR', meta: '15-day streak', score: '6.5', unit: 'avg' },
  { rank: 4, name: 'Sam T', initials: 'ST', meta: '9-day streak', score: '6.2', unit: 'avg' },
  { rank: 5, name: 'You', initials: 'YO', meta: '7-day streak', score: '6.0', unit: 'avg', you: true },
];

/** Literal gold/silver/bronze avatar + medal tints for the top 3. */
const TOP: Record<1 | 2 | 3, { av: string; medal: string }> = {
  1: { av: '#F4B731', medal: '#F4B731' },
  2: { av: '#C7CEDB', medal: '#C7CEDB' },
  3: { av: '#C97B3C', medal: '#C97B3C' },
};

/** Crown drawn over the #1 rank. */
function Crown() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" style={styles.crown}>
      <Path
        d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4z"
        stroke="#FFD36B"
        strokeWidth={1.7}
        fill="rgba(255,211,107,0.16)"
      />
    </Svg>
  );
}

/**
 * Leaderboard — a ranked cohort list. The top 3 wear gold/silver/bronze
 * avatars (with a crown on #1), every row shows avatar + name + meta + score,
 * and the current user's row is highlighted with a "you" tag. A header labels
 * the metric and a footer summarizes the viewer's standing ("you're #N of M").
 * Mirrors the web `Leaderboard` prop API and defaults to the design's set.
 */
export function Leaderboard({
  title = 'Consistency',
  sub = 'This week · avg energy',
  metric = '28 in cohort',
  rows = DEFAULT_ROWS,
  total = 28,
  footerLead = "You're",
  footerTail = 'this week',
  footerCta = 'View full ranking →',
  style,
}: LeaderboardProps) {
  const you = rows.find((r) => r.you);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.title}>{title}</Text>
          {sub ? <Text style={styles.sub}>{sub}</Text> : null}
        </View>
        {metric ? (
          <View style={styles.metric}>
            <View style={styles.metricDot} />
            <Text style={styles.metricLabel}>{metric}</Text>
          </View>
        ) : null}
      </View>

      {rows.map((r, i) => {
        const top = (r.rank >= 1 && r.rank <= 3 ? r.rank : 0) as 0 | 1 | 2 | 3;
        const tint = top ? TOP[top] : undefined;
        const medal = r.medal ?? (top ? String(top) : undefined);
        const scoreStyle: StyleProp<TextStyle> = [styles.scoreV, top ? styles.scoreVTop : null];
        return (
          <View
            key={`${r.rank}-${r.name}`}
            style={[
              styles.row,
              i > 0 && styles.rowDivider,
              r.you && styles.rowYou,
            ]}
          >
            {r.you ? <View style={styles.youBar} /> : null}

            <View style={styles.rank}>
              {top === 1 ? <Crown /> : null}
              <Text style={[styles.rankNum, top ? styles.rankNumTop : null]}>{r.rank}</Text>
            </View>

            <View style={[styles.av, tint ? { backgroundColor: tint.av } : null]}>
              <Text style={styles.avText}>{r.initials}</Text>
              {top > 0 && medal != null ? (
                <View style={[styles.medal, { backgroundColor: tint!.medal }]}>
                  <Text style={styles.medalText}>{medal}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.id}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {r.name}
                </Text>
                {r.you ? <Text style={styles.tag}>you</Text> : null}
              </View>
              {r.meta ? <Text style={styles.meta}>{r.meta}</Text> : null}
            </View>

            <View style={styles.score}>
              <Text style={scoreStyle}>{r.score}</Text>
              {r.unit ? <Text style={styles.scoreU}>{r.unit}</Text> : null}
            </View>
          </View>
        );
      })}

      {(footerLead != null && you) || footerCta ? (
        <View style={styles.foot}>
          {footerLead != null && you ? (
            <Text style={styles.footText}>
              {footerLead} <Text style={styles.footBold}>#{you.rank} of {total}</Text>
              {footerTail ? ` ${footerTail}` : ''}
            </Text>
          ) : null}
          {footerCta ? <Text style={styles.footCta}>{footerCta}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },

  // header
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headText: { flex: 1, minWidth: 0 },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, letterSpacing: -0.15, color: colors.text },
  sub: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.textFaint, marginTop: 3 },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.4)',
    backgroundColor: 'rgba(124,92,255,0.10)',
  },
  metricDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#cbbcff', shadowColor: '#cbbcff', shadowOpacity: 0.9, shadowRadius: 6 },
  metricLabel: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '500', letterSpacing: 0.4, color: '#cbbcff' },

  // rows
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12, paddingHorizontal: 18 },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  rowYou: { backgroundColor: 'rgba(124,92,255,0.10)' },
  youBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.accent },

  // rank
  rank: { width: 26, alignItems: 'center', justifyContent: 'center' },
  rankNum: { fontFamily: fonts.mono, fontWeight: '600', fontSize: 13, color: colors.textFaint },
  rankNumTop: { color: colors.text },
  crown: { position: 'absolute', top: -13 },

  // avatar
  av: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violet,
  },
  avText: { fontFamily: fonts.display, fontWeight: '700', fontSize: 13, color: '#07080d' },
  medal: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0A0C14',
  },
  medalText: { fontFamily: fonts.mono, fontSize: 9, fontWeight: '800', color: '#07080d' },

  // identity
  id: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 13.5, color: colors.text, flexShrink: 1 },
  tag: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.9, textTransform: 'uppercase', color: colors.accent2 },
  meta: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, marginTop: 2 },

  // score
  score: { alignItems: 'flex-end' },
  scoreV: { fontFamily: fonts.display, fontWeight: '700', fontSize: 18, letterSpacing: -0.36, color: colors.text },
  scoreVTop: { color: colors.accent2 },
  scoreU: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.9, textTransform: 'uppercase', color: colors.textFaint, marginTop: 4 },

  // footer
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.glass,
  },
  footText: { fontFamily: fonts.ui, fontSize: 12, color: colors.textDim, flex: 1 },
  footBold: { fontFamily: fonts.mono, fontWeight: '600', color: colors.accent3 },
  footCta: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.accent2 },
});
