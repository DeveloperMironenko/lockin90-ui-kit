import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Icon, type IconName } from './Icon';
import { Sparkline } from './Sparkline';
import { Chip } from './Chip';

export type InsightTone = 'default' | 'positive' | 'negative' | 'accent';

export interface InsightCardProps {
  /** optional heading */
  title?: string;
  /** the insight prose */
  body: ReactNode;
  /** optional Sparkline series, oldest → newest */
  data?: number[];
  /** chips: p-value / n / confidence (e.g. `{ label: 'p', value: '0.02' }`) */
  stats?: { label: string; value: string }[];
  /** accent color of the icon/sparkline */
  tone?: InsightTone;
  /** explicit accent color for the icon + sparkline — overrides `tone`'s color
   *  (e.g. `colors.lime`). Lets each card carry its own trend hue. */
  accentColor?: string;
  /** fill the area under the sparkline (default true). Set false for a clean
   *  line-only trend, matching the design's per-pattern sparklines. */
  sparkFill?: boolean;
  /** leading glyph */
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

/** Tone → accent color for the icon + sparkline (matches the mockup). */
const TONE_COLOR: Record<InsightTone, string> = {
  default: colors.textDim,
  positive: colors.ok,
  negative: colors.bad,
  accent: colors.accent,
};

/**
 * InsightCard — a glass panel surfacing a detected pattern: a leading icon +
 * title row, the insight prose, a row of small stat Chips (p-value / n /
 * confidence), and an optional tone-tinted Sparkline. Composed from Card + Icon
 * + Sparkline + Chip; `tone` drives the icon and sparkline accent. Mirrors the
 * web `@lockin90/ui` InsightCard and the `.insight` cards in the design mockup.
 */
export function InsightCard({
  title,
  body,
  data,
  stats,
  tone = 'default',
  accentColor,
  sparkFill = true,
  icon = 'sparkle',
  style,
}: InsightCardProps) {
  const color = accentColor ?? TONE_COLOR[tone];

  return (
    <Card style={style}>
      <View style={styles.row}>
        <View style={styles.main}>
          <View style={styles.head}>
            <Icon name={icon} size={18} color={color} />
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>

          {typeof body === 'string' ? <Text style={styles.body}>{body}</Text> : body}

          {stats && stats.length > 0 ? (
            <View style={styles.meta}>
              {stats.map((s, i) => (
                <Chip key={`${s.label}-${i}`} label={`${s.label} = ${s.value}`} />
              ))}
            </View>
          ) : null}
        </View>

        {data && data.length > 0 ? (
          <View style={styles.right}>
            <Sparkline data={data} color={color} width={120} height={56} fill={sparkFill} />
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 7,
  },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.text,
  },
  body: {
    fontSize: 13.5,
    lineHeight: 21,
    color: colors.textDim,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  right: {
    alignItems: 'flex-end',
  },
});
