import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';
import { Chip } from './Chip';
import { Card } from './Card';
import { GradientText } from './GradientText';

/** One change-type bucket. Bullets are plain strings on native. */
export interface ChangelogGroups {
  /** brand-new capabilities (mint) */
  new?: string[];
  /** refinements to existing behavior (cyan) */
  improved?: string[];
  /** bug fixes (amber) */
  fixed?: string[];
}

export interface ChangelogEntryProps extends ViewProps {
  /** release version, e.g. '1.8.0' */
  version?: string;
  /** human-readable release date, e.g. 'Jun 18, 2026' */
  date?: string;
  /** affected platform/service shown as a chip, e.g. 'Frontend' */
  platform?: string;
  /** optional release codename, e.g. 'Aurora' */
  codename?: string;
  /** grouped bullets under New / Improved / Fixed */
  groups?: ChangelogGroups;
}

type GroupKey = 'new' | 'improved' | 'fixed';

const GROUP_META: Record<GroupKey, { label: string; color: string; tint: string; border: string; path: string }> = {
  new: {
    label: 'New',
    color: colors.zoneHigh,
    tint: 'rgba(52,245,197,0.12)',
    border: 'rgba(52,245,197,0.3)',
    path: 'M12 5v14M5 12h14',
  },
  improved: {
    label: 'Improved',
    color: colors.accent2,
    tint: 'rgba(34,211,238,0.12)',
    border: 'rgba(34,211,238,0.3)',
    path: 'M12 3l2.2 6.6H21l-5.4 4 2.1 6.6L12 16l-5.7 4.2 2.1-6.6L3 9.6h6.8z',
  },
  fixed: {
    label: 'Fixed',
    color: colors.zoneMid,
    tint: 'rgba(255,176,32,0.12)',
    border: 'rgba(255,176,32,0.3)',
    path: 'M5 13l4 4L19 7',
  },
};

const GROUP_ORDER: GroupKey[] = ['new', 'improved', 'fixed'];

const DEFAULT_GROUPS: ChangelogGroups = {
  new: [
    'Energy forecast projects your next 7 days from logged events.',
    'Snap & log meals from a photo with one tap.',
  ],
  improved: [
    'Dashboard loads 40% faster on first paint.',
    'Smoother score-ring animation on the home screen.',
  ],
  fixed: ['Calendar no longer skips DST transition days.'],
};

/** Changelog entry — a "what's new" release card: gradient version, platform
 *  chip + codename, date, and grouped New / Improved / Fixed bullet lists.
 *  Renders the showcase release by default. */
export function ChangelogEntry({
  version = '1.8.0',
  date = 'Jun 18, 2026',
  platform = 'Frontend',
  codename = 'Aurora',
  groups = DEFAULT_GROUPS,
  style,
  ...rest
}: ChangelogEntryProps) {
  return (
    <Card style={[styles.card, style]} {...rest}>
      <View style={styles.top}>
        <GradientText gradient="flux" style={styles.ver}>
          {version}
        </GradientText>
        <View style={styles.headmeta}>
          {!!platform && (
            <View style={styles.tags}>
              <Chip tone="accent" label={platform} />
            </View>
          )}
          {!!codename && (
            <Text style={styles.codename}>
              Codename <Text style={styles.codenameStrong}>{codename}</Text>
            </Text>
          )}
        </View>
        {!!date && <Text style={styles.date}>{date}</Text>}
      </View>

      <View style={styles.changes}>
        {GROUP_ORDER.map((key) => {
          const items = groups?.[key];
          if (!items || items.length === 0) return null;
          const meta = GROUP_META[key];
          return (
            <View key={key} style={styles.group}>
              <View style={styles.groupHead}>
                <View style={[styles.groupIco, { backgroundColor: meta.tint, borderColor: meta.border }]}>
                  <Svg width={13} height={13} viewBox="0 0 24 24">
                    <Path
                      d={meta.path}
                      stroke={meta.color}
                      strokeWidth={2}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <Text style={[styles.groupName, { color: meta.color }]}>{meta.label.toUpperCase()}</Text>
                <Text style={styles.groupCount}>{items.length}</Text>
              </View>
              <View style={styles.list}>
                {items.map((item, i) => (
                  <View key={i} style={styles.listRow}>
                    <View style={[styles.dot, { backgroundColor: meta.color, shadowColor: meta.color }]} />
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 22 },
  top: { flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 },
  ver: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 30,
    letterSpacing: -0.9,
    lineHeight: 30,
  },
  headmeta: { gap: 7 },
  tags: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  codename: { fontSize: 14, color: colors.textDim },
  codenameStrong: { color: colors.text, fontWeight: '600' },
  date: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.textFaint,
    marginLeft: 'auto',
    paddingTop: 4,
  },
  changes: { marginTop: 20, gap: 16 },
  group: { gap: 9 },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  groupIco: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupName: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  groupCount: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },
  list: { paddingLeft: 31, gap: 7 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 2,
    marginTop: 7,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  listText: { flex: 1, fontSize: 13.5, color: colors.textDim, lineHeight: 20 },
});
