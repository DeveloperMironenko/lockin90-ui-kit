import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';

/** Size tier of a tag — drives font size and tint (xl is the most frequent). */
export type TagSize = 'xl' | 'lg' | 'md' | 'sm';

export interface TagCloudItem {
  /** the tag text, e.g. '#sleep' */
  label: string;
  /** optional frequency count shown after the label */
  count?: number;
  /** weight tier (xl = biggest/most frequent) */
  size: TagSize;
  /** xl tags only: render the label with the bright highlight */
  grad?: boolean;
}

export interface TagCloudProps extends ViewProps {
  /** weighted tags, ordered most-frequent first */
  tags?: TagCloudItem[];
  /** card heading */
  title?: string;
  /** mono sub-label, e.g. a time window */
  sub?: string;
  /** filter hint shown below the cloud (omit to hide) */
  hint?: string;
}

const DEFAULT_TAGS: TagCloudItem[] = [
  { label: '#sleep', count: 42, size: 'xl', grad: true },
  { label: '#focus', count: 31, size: 'lg' },
  { label: '#caffeine', count: 28, size: 'lg' },
  { label: '#workout', count: 24, size: 'md' },
  { label: '#stress', size: 'md' },
  { label: '#travel', size: 'sm' },
  { label: '#cold-plunge', size: 'md' },
  { label: '#fasting', size: 'sm' },
  { label: '#mood', size: 'md' },
  { label: '#recovery', size: 'lg' },
  { label: '#walk', size: 'sm' },
  { label: '#hydration', size: 'sm' },
  { label: '#calm', size: 'md' },
  { label: '#sunlight', size: 'sm' },
];

const FONT_SIZE: Record<TagSize, number> = { xl: 17, lg: 14.5, md: 12.5, sm: 11 };

/** Per-tier label tint + pill border/fill, mirroring the web cloud. */
const TIER: Record<TagSize, { color: string; border: string; bg: string }> = {
  xl: { color: '#cbbcff', border: 'rgba(124,92,255,0.4)', bg: 'rgba(124,92,255,0.08)' },
  lg: { color: colors.accent2, border: 'rgba(34,211,238,0.3)', bg: colors.glass },
  md: { color: colors.textDim, border: colors.border, bg: colors.glass },
  sm: { color: colors.textDim, border: colors.border, bg: colors.glass },
};

/** Weighted tag cloud — journal/log tags sized & tinted by frequency, the most
 *  frequent rendered with a bright highlight + count, in a wrapped flow with a
 *  filter hint. Renders the showcase example by default. */
export function TagCloud({
  tags = DEFAULT_TAGS,
  title = 'Your tags',
  sub = 'last 90 days',
  hint = 'Tap a tag to filter your journal',
  style,
  ...rest
}: TagCloudProps) {
  return (
    <Card style={[styles.card, style]} {...rest}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        {!!sub && <Text style={styles.sub}>{sub}</Text>}
      </View>
      <View style={styles.cloud}>
        {tags.map((tag, i) => {
          const tier = TIER[tag.size];
          const isGrad = tag.size === 'xl' && tag.grad;
          // Gradient-clipped text isn't available on native — use the brightest
          // flux tint as a solid color so the most-frequent tag still pops.
          const labelColor = isGrad ? colors.lime : tier.color;
          const countColor = tag.size === 'xl' ? '#a98cff' : tag.size === 'lg' ? colors.accent2 : colors.textFaint;
          return (
            <View
              key={`${tag.label}-${i}`}
              style={[
                styles.pill,
                tag.size === 'xl' && styles.pillXl,
                { borderColor: tier.border, backgroundColor: tier.bg },
                isGrad && { borderColor: 'rgba(124,92,255,0.5)', backgroundColor: 'rgba(124,92,255,0.1)' },
              ]}
            >
              <Text style={[styles.label, { fontSize: FONT_SIZE[tag.size], color: labelColor }, isGrad && styles.labelGrad]}>
                {tag.label}
              </Text>
              {tag.count != null && (
                <Text style={[styles.count, { fontSize: FONT_SIZE[tag.size] * 0.78, color: countColor }]}>{tag.count}</Text>
              )}
            </View>
          );
        })}
      </View>
      {!!hint && (
        <View style={styles.hintRow}>
          <View style={styles.hintBox} />
          <Text style={styles.hint}>{hint}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, paddingBottom: 20 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 },
  title: { fontFamily: fonts.display, fontSize: 14, fontWeight: '600', color: colors.text, letterSpacing: -0.14 },
  sub: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint },
  cloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  pillXl: { paddingVertical: 5, paddingHorizontal: 13 },
  label: { fontFamily: fonts.mono },
  labelGrad: { fontWeight: '600' },
  count: { fontFamily: fonts.mono },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 16 },
  hintBox: { width: 13, height: 13, borderRadius: 4, borderWidth: 1, borderColor: colors.border2, backgroundColor: colors.glass2 },
  hint: { fontFamily: fonts.ui, fontSize: 11, color: colors.textFaint },
});
