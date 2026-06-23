import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

export interface LeaderboardRowProps extends ViewProps {
  /** Position in the ranking (1-based). Ranks 1/2/3 show a gold/silver/bronze crown. */
  rank: number;
  /** Display name shown beside the avatar. */
  name: string;
  /** Avatar image URL; falls back to a monogram derived from `name`. */
  avatar?: string;
  /** The ranked stat, e.g. `'1,240 pts'`. */
  value: string;
  /** Optional dimmer second line under the name. */
  sublabel?: string;
  /** Emphasize the current user's row with an accent tint + border. */
  highlight?: boolean;
  /**
   * Draw a hairline top border (separates adjacent rows). Defaults to `true`;
   * set `divider={false}` on the FIRST row of a stack so it has no top border.
   * (Web draws this between rows via `.lk-lbrow + .lk-lbrow`; native has no
   * sibling selectors, so the divider is opt-out per row instead.)
   */
  divider?: boolean;
}

/** Podium tint per medal rank: gold (1) · silver (2) · bronze (3). */
const MEDAL_COLOR: Record<number, string> = {
  1: colors.warn, // gold #FFB020
  2: colors.textDim, // silver
  3: '#C77B3A', // bronze amber
};

/**
 * LeaderboardRow — one ranked entry in a standings list: rank (display font) +
 * avatar + name (+ optional sublabel) on the left, the ranked value on the
 * right. Ranks 1–3 swap the number for a gold/silver/bronze crown glyph.
 * `highlight` accent-tints the row to mark the current user ("you"). Mirrors
 * the web `@lockin90/ui` `LeaderboardRow`. Composed from `Avatar` + `Icon`.
 */
export function LeaderboardRow({
  rank,
  name,
  avatar,
  value,
  sublabel,
  highlight,
  divider = true,
  style,
  ...rest
}: LeaderboardRowProps) {
  const medalColor = MEDAL_COLOR[rank];

  return (
    <View
      style={[
        styles.row,
        divider && styles.divider,
        highlight && styles.highlight,
        style,
      ]}
      {...rest}
    >
      <View style={styles.rank}>
        {medalColor ? (
          <Icon name="star" size={20} color={medalColor} />
        ) : (
          <Text style={[styles.rankNum, highlight && styles.rankNumHighlight]}>{rank}</Text>
        )}
      </View>

      <Avatar name={name} src={avatar} size={40} />

      <View style={styles.main}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {sublabel != null && (
          <Text style={styles.sub} numberOfLines={1}>
            {sublabel}
          </Text>
        )}
      </View>

      <Text style={[styles.value, highlight && styles.valueHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radii.md,
  },
  divider: {
    borderTopColor: colors.border,
  },
  highlight: {
    // accent tint ~12% + ~45% border — RN has no color-mix; use translucent accent.
    backgroundColor: 'rgba(124,92,255,0.12)',
    borderColor: 'rgba(124,92,255,0.45)',
  },
  rank: {
    width: 28,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: -0.3,
    color: colors.textDim,
  },
  rankNumHighlight: {
    color: colors.accent,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.ui,
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text,
  },
  sub: {
    marginTop: 1,
    fontFamily: fonts.ui,
    fontSize: 12.5,
    lineHeight: 16,
    color: colors.textFaint,
  },
  value: {
    marginLeft: 'auto',
    flexShrink: 0,
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.3,
    color: colors.text,
  },
  valueHighlight: {
    color: colors.accent,
  },
});
