import { View, Text, StyleSheet, ScrollView, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

/** Notification kind — drives the leading icon's color + glyph. */
export type NotifType = 'insight' | 'coach' | 'sync';

export interface NotifFilter {
  /** Pill label, e.g. 'All'. */
  label: string;
  /** Count badge shown after the label. */
  count: number;
  /** Active pill paints the gradient. */
  active?: boolean;
}

export interface NotifAction {
  /** Button label, e.g. 'View insight'. */
  label: string;
  /** `primary` paints the gradient CTA; default is the glass button. */
  kind?: 'primary' | 'default';
}

export interface NotifItem {
  /** Notification kind, drives the leading icon. */
  type: NotifType;
  /** Headline. */
  title: string;
  /** One-line body. */
  snippet: string;
  /** Relative time, e.g. '2m'. */
  time: string;
  /** Unread → tinted bg, accent rail + leading dot. */
  unread?: boolean;
  /** Optional inline action button under the body. */
  action?: NotifAction;
}

export interface NotificationCenterProps {
  /** Filter pill row above the list. */
  filters?: NotifFilter[];
  /** Notification rows. */
  items?: NotifItem[];
  style?: StyleProp<ViewStyle>;
}

const ICON_TINT: Record<NotifType, { color: string; bg: string; border: string }> = {
  insight: { color: colors.accent2, bg: 'rgba(34,211,238,0.10)', border: 'rgba(34,211,238,0.32)' },
  coach: { color: colors.violet, bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.32)' },
  sync: { color: colors.zoneMid, bg: 'rgba(255,176,32,0.10)', border: 'rgba(255,176,32,0.34)' },
};

const ICON_PATH: Record<NotifType, string> = {
  insight: 'M9 18h6M10 21h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z',
  coach: 'M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-3.7-.8L3 21l1.3-4A8.5 8.5 0 1 1 21 11.5Z',
  sync: 'M21 12a9 9 0 1 1-3-6.7M21 4v4h-4',
};

const ACTION_PATH = {
  primary: 'M5 12h14M13 6l6 6-6 6',
  default: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z',
} as const;

const DEFAULT_FILTERS: NotifFilter[] = [
  { label: 'All', count: 6, active: true },
  { label: 'Insights', count: 3 },
  { label: 'Coach', count: 2 },
  { label: 'System', count: 1 },
];

const DEFAULT_ITEMS: NotifItem[] = [
  {
    type: 'insight',
    title: 'New insight',
    snippet: 'Late caffeine is costing you ~9 pts of recovery — try a 2pm cutoff.',
    time: '2m',
    unread: true,
    action: { label: 'View insight', kind: 'primary' },
  },
  {
    type: 'coach',
    title: 'Coach Mara replied',
    snippet: '"Nice work on the sleep streak — let’s push the morning walk next."',
    time: '14m',
    unread: true,
    action: { label: 'Reply' },
  },
  {
    type: 'sync',
    title: 'Oura synced',
    snippet: 'Recovery 81% · last night’s data is in and scored.',
    time: '1h',
  },
  {
    type: 'insight',
    title: 'Weekly report ready',
    snippet: 'Your Jun 9–15 summary is in — energy trended up 6%.',
    time: '3h',
  },
];

function FilterPill({ filter }: { filter: NotifFilter }) {
  if (filter.active) {
    return (
      <LinearGradient
        colors={gradients.cta.stops as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.pill}
      >
        <Text style={[styles.pillLabel, styles.pillLabelActive]}>{filter.label}</Text>
        <View style={styles.fcActive}>
          <Text style={styles.fcTextActive}>{filter.count}</Text>
        </View>
      </LinearGradient>
    );
  }
  return (
    <Pressable style={styles.pillIdle}>
      <Text style={styles.pillLabel}>{filter.label}</Text>
      <View style={styles.fc}>
        <Text style={styles.fcText}>{filter.count}</Text>
      </View>
    </Pressable>
  );
}

function ActionButton({ action }: { action: NotifAction }) {
  const path = action.kind === 'primary' ? ACTION_PATH.primary : ACTION_PATH.default;
  if (action.kind === 'primary') {
    return (
      <Pressable style={styles.actWrap}>
        <LinearGradient
          colors={gradients.cta.stops as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.act, styles.actPrimary]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24">
            <Path d={path} stroke="#07080d" strokeWidth={1.8} fill="none" />
          </Svg>
          <Text style={[styles.actLabel, styles.actLabelPrimary]}>{action.label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }
  return (
    <Pressable style={[styles.act, styles.actIdle]}>
      <Svg width={14} height={14} viewBox="0 0 24 24">
        <Path d={path} stroke={colors.text} strokeWidth={1.8} fill="none" />
      </Svg>
      <Text style={styles.actLabel}>{action.label}</Text>
    </Pressable>
  );
}

function NotifRow({ item }: { item: NotifItem }) {
  const tint = ICON_TINT[item.type];
  return (
    <View style={[styles.row, item.unread ? styles.rowUnread : styles.rowRead]}>
      {item.unread && (
        <LinearGradient
          colors={gradients.cta.stops as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.rail}
        />
      )}
      <View style={[styles.ico, { backgroundColor: tint.bg, borderColor: tint.border }]}>
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path d={ICON_PATH[item.type]} stroke={tint.color} strokeWidth={1.6} fill="none" />
        </Svg>
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          {item.unread && <View style={styles.dot} />}
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.snippet}>{item.snippet}</Text>
        {item.action && (
          <View style={styles.meta}>
            <ActionButton action={item.action} />
          </View>
        )}
      </View>
    </View>
  );
}

/** Notification center — scrollable filter pills with count badges (active = gradient)
 *  over notification rows. Unread rows get a tinted bg, accent rail + dot, optional inline
 *  action. Renders the showcase example by default. */
export function NotificationCenter({
  filters = DEFAULT_FILTERS,
  items = DEFAULT_ITEMS,
  style,
}: NotificationCenterProps) {
  return (
    <View style={[styles.wrap, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {filters.map((f, i) => (
          <FilterPill key={i} filter={f} />
        ))}
      </ScrollView>
      <View style={styles.list}>
        {items.map((it, i) => (
          <NotifRow key={i} item={it} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  filters: { flexDirection: 'row', gap: 6, paddingVertical: 2 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
  },
  pillIdle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  pillLabel: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '500', color: colors.textDim },
  pillLabelActive: { color: '#07080d' },
  fc: {
    paddingHorizontal: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass2,
  },
  fcText: { fontFamily: fonts.mono, fontSize: 9.5, lineHeight: 15, color: colors.textFaint },
  fcActive: { paddingHorizontal: 6, borderRadius: radii.pill, backgroundColor: 'rgba(0,0,0,0.18)' },
  fcTextActive: { fontFamily: fonts.mono, fontSize: 9.5, lineHeight: 15, color: '#07080d' },

  list: { gap: 10 },
  row: {
    position: 'relative',
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  rowUnread: { backgroundColor: 'rgba(124,92,255,0.055)', borderColor: 'rgba(124,92,255,0.22)' },
  rowRead: { opacity: 0.72 },
  rail: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 3,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  ico: {
    width: 46,
    height: 46,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  body: { flex: 1, minWidth: 0 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent2,
    shadowColor: colors.accent2,
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: -0.16,
    color: colors.text,
  },
  time: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint },
  snippet: { fontSize: 13.5, color: colors.textDim, lineHeight: 20 },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 9, marginTop: 12 },
  actWrap: { borderRadius: radii.pill },
  act: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
  },
  actIdle: { borderWidth: 1, borderColor: colors.border2, backgroundColor: colors.glass2 },
  actPrimary: {},
  actLabel: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 12.5, color: colors.text },
  actLabelPrimary: { color: '#07080d' },
});
