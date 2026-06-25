import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';
import { Ring } from './Ring';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface AchievementBadgeProps {
  /** Badge name. */
  title: string;
  /** Short criteria / description line. */
  description?: string;
  /** Medal glyph — defaults to a star. */
  icon?: IconName;
  /** Locked = desaturated + dimmed + lock overlay. */
  locked?: boolean;
  /** Medal tier color: bronze / silver / gold / platinum. */
  tier?: AchievementTier;
  /** 0..1 → a progress Ring is drawn around the medal (in-progress badges). */
  progress?: number;
  /** Small date label shown when unlocked. */
  unlockedAt?: string;
  style?: StyleProp<ViewStyle>;
}

/** Per-tier medal accent color (raw tokens, mirrors the web token vars). */
const TIER_COLOR: Record<AchievementTier, string> = {
  bronze: colors.warn, // amber/bronze
  silver: colors.textDim, // cool silver
  gold: colors.zoneMid, // warm gold
  platinum: colors.cyan, // cool platinum sheen
};

/**
 * AchievementBadge — a centered medal: a circular tier-colored medallion
 * holding the icon, optionally wrapped by a progress Ring (for in-progress
 * achievements), with the title, description and an optional unlock date below.
 * Unlocked badges read tier-tinted; locked ones are desaturated, dimmed and
 * carry a small lock overlay. Mirrors the web `@lockin90/ui` `AchievementBadge`.
 */
export function AchievementBadge({
  title,
  description,
  icon = 'star',
  locked = false,
  tier = 'gold',
  progress,
  unlockedAt,
  style,
}: AchievementBadgeProps) {
  const accent = TIER_COLOR[tier];
  const hasProgress = typeof progress === 'number';
  const pct = hasProgress ? Math.max(0, Math.min(1, progress)) * 100 : 0;
  const medalSize = hasProgress ? 56 : 64;

  const medal = (
    <View
      style={[
        styles.medal,
        { width: medalSize, height: medalSize, borderRadius: medalSize / 2 },
        { backgroundColor: tint(accent, locked ? 0.06 : 0.22), borderColor: tint(accent, locked ? 0.2 : 0.5) },
        !locked && {
          shadowColor: accent,
          shadowOpacity: 0.45,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
          elevation: 6,
        },
      ]}
    >
      <Icon name={icon} size={30} color={accent} />
    </View>
  );

  return (
    <View
      style={[
        styles.badge,
        locked ? styles.badgeLocked : styles.badgeUnlocked,
        !locked && { borderColor: tint(accent, 0.4) },
        style,
      ]}
    >
      {locked ? (
        <View style={styles.lock}>
          <Icon name="lock" size={14} color={colors.textFaint} />
        </View>
      ) : null}

      <View style={styles.crest}>
        {hasProgress ? (
          <Ring value={pct} size={84} thickness={6} color={accent} glow={!locked}>
            {medal}
          </Ring>
        ) : (
          medal
        )}
      </View>

      <Text style={styles.name}>{title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}

      {hasProgress ? (
        <Text style={styles.prog}>{Math.round(pct)}%</Text>
      ) : unlockedAt ? (
        <View style={styles.dateRow}>
          <Icon name="check" size={12} color={colors.zoneHigh} />
          <Text style={styles.date}>{unlockedAt}</Text>
        </View>
      ) : null}
    </View>
  );
}

/** rgba tint of a hex token at a given alpha (native has no color-mix). */
function tint(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  badge: {
    padding: 22,
    width: 160,
    minHeight: 200,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  badgeUnlocked: {
    borderColor: colors.border2,
    backgroundColor: colors.bg1,
  },
  badgeLocked: {
    borderColor: colors.border,
    backgroundColor: colors.glass,
    opacity: 0.62,
  },
  lock: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  /* fixed height so regular (64px medal) and in-progress (84px ring) cards match */
  crest: {
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  medal: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  name: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 14.5,
    letterSpacing: -0.15,
    color: colors.text,
    textAlign: 'center',
  },
  desc: {
    fontSize: 11.5,
    color: colors.textDim,
    marginTop: 5,
    lineHeight: 16,
    textAlign: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 11,
  },
  date: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.zoneHigh,
  },
  prog: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textDim,
    marginTop: 11,
    letterSpacing: 0.4,
  },
});
