import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { BarFill } from './BarFill';

/** Medal-tier tint for the medallion icon. */
export type AchievementTier = 'gold' | 'silver' | 'cyan';
/** Which medallion glyph to draw. */
export type AchievementIcon = 'streak' | 'sunrise' | 'droplet' | 'trophy' | 'bolt';

export interface Achievement {
  /** Badge title, e.g. "30-Day Streak". */
  name: string;
  /** One-line earn criteria, e.g. "Log every day for a month straight". */
  criteria?: string;
  /** Medallion glyph. */
  icon?: AchievementIcon;
  /** Medal tier tint for the icon. */
  tier?: AchievementTier;
  /** Earned vs locked. Earned shows the accent ring + earned date. */
  earned?: boolean;
  /** Earned date string (earned badges), e.g. "Earned Jun 18". */
  date?: string;
  /** Progress label (locked badges), e.g. "12 / 30 days". */
  progressLabel?: string;
  /** Progress fraction 0..1 (locked badges) — drives the bar fill. */
  progress?: number;
}

export interface AchievementBadgesProps {
  /** Badges to render. Defaults to the design's example set. */
  items?: Achievement[];
  style?: StyleProp<ViewStyle>;
}

const TIER_STROKE: Record<AchievementTier, string> = {
  gold: colors.zoneMid,
  silver: colors.accent2,
  cyan: colors.accent2,
};

/** Medallion glyph drawn inside a 24×24 viewBox, stroked per tier. */
function MedalGlyph({ icon, stroke }: { icon: AchievementIcon; stroke: string }) {
  const common = { fill: 'none', stroke, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24">
      {icon === 'streak' && (
        <Path d="M12 2c1.5 3 1 5-1 7-1.5 1.5-2 3.5-1 5.5C11 17 13 16 14 14c1.5 3 .5 6-2 8 4 0 7-3 7-7 0-5-3-8-7-13z" {...common} />
      )}
      {icon === 'sunrise' && (
        <>
          <Circle cx={12} cy={12} r={4} {...common} />
          <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" {...common} />
        </>
      )}
      {icon === 'droplet' && <Path d="M12 2.5S6 9 6 14a6 6 0 0 0 12 0c0-5-6-11.5-6-11.5z" {...common} />}
      {icon === 'trophy' && (
        <>
          <Path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" {...common} />
          <Path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" {...common} />
        </>
      )}
      {icon === 'bolt' && <Path d="M13 2 4 14h7l-1 8 9-12h-7z" {...common} />}
    </Svg>
  );
}

/** Top-right status mark — check (earned) or padlock (locked). */
function StatusMark({ earned }: { earned: boolean }) {
  const stroke = earned ? colors.accent2 : colors.textFaint;
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      {earned ? (
        <Path d="M20 6 9 17l-5-5" fill="none" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <Path d="M5 11h14v10H5z" fill="none" stroke={stroke} strokeWidth={1.7} />
          <Path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke={stroke} strokeWidth={1.7} />
        </>
      )}
    </Svg>
  );
}

/** Small check used in the earned-date row. */
function DateCheck() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path d="M20 6 9 17l-5-5" fill="none" stroke={colors.zoneHigh} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** The design's example badge set: two earned + one locked-in-progress. */
const DEFAULT_ITEMS: Achievement[] = [
  {
    name: '30-Day Streak',
    criteria: 'Log every day for a month straight',
    icon: 'streak',
    tier: 'gold',
    earned: true,
    date: 'Earned Jun 18',
  },
  {
    name: 'Early Riser',
    criteria: '50 mornings waking before 6:30am',
    icon: 'sunrise',
    tier: 'silver',
    earned: true,
    date: 'Earned Jun 12',
  },
  {
    name: 'Hydration Hero',
    criteria: 'Hit 3L water · 30 days running',
    icon: 'droplet',
    tier: 'cyan',
    earned: false,
    progressLabel: '12 / 30 days',
    progress: 0.4,
  },
];

/**
 * Achievement badges — a grid of medal cards. Each is a ringed medallion +
 * name + earn criteria; earned badges glow with an accent ring + earned date,
 * locked badges dim behind a padlock and show progress. Mirrors the web
 * `AchievementBadges` prop API and defaults to the design's example set.
 */
export function AchievementBadges({ items = DEFAULT_ITEMS, style }: AchievementBadgesProps) {
  return (
    <View style={[styles.grid, style]}>
      {items.map((a, i) => {
        const earned = a.earned ?? false;
        const stroke = TIER_STROKE[a.tier ?? 'cyan'];
        const showProg = !earned && (a.progressLabel != null || a.progress != null);
        return (
          <View key={i} style={[styles.badge, earned ? styles.earned : styles.locked]}>
            <View style={styles.lock}>
              <StatusMark earned={earned} />
            </View>

            <View style={[styles.medal, earned && styles.medalEarned]}>
              <MedalGlyph icon={a.icon ?? 'trophy'} stroke={stroke} />
            </View>

            <Text style={styles.name}>{a.name}</Text>
            {a.criteria != null && <Text style={styles.crit}>{a.criteria}</Text>}

            {earned && a.date != null && (
              <View style={styles.dateRow}>
                <DateCheck />
                <Text style={styles.date}>{a.date}</Text>
              </View>
            )}

            {showProg && (
              <View style={styles.prog}>
                <View style={styles.progHead}>
                  <Text style={styles.progLabel}>Progress</Text>
                  {a.progressLabel != null && <Text style={styles.progVal}>{a.progressLabel}</Text>}
                </View>
                <BarFill value={a.progress ?? 0} height={6} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  badge: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 130,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    alignItems: 'center',
  },
  earned: { borderColor: 'rgba(124,92,255,0.45)', backgroundColor: colors.glass2 },
  locked: { opacity: 0.62 },
  lock: { position: 'absolute', top: 12, right: 12 },
  medal: {
    width: 64,
    height: 64,
    marginBottom: 13,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalEarned: {
    borderColor: 'rgba(124,92,255,0.35)',
    backgroundColor: 'rgba(124,92,255,0.12)',
  },
  name: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 14.5,
    letterSpacing: -0.15,
    color: colors.text,
    textAlign: 'center',
  },
  crit: {
    fontSize: 11.5,
    color: colors.textDim,
    marginTop: 5,
    lineHeight: 16,
    textAlign: 'center',
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 11 },
  date: { fontFamily: fonts.mono, fontSize: 10, color: colors.zoneHigh },
  prog: { marginTop: 12, alignSelf: 'stretch' },
  progHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },
  progVal: { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim },
});
