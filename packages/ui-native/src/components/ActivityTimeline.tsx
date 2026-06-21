import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';

export type TimelineTone = 'high' | 'mid' | 'low';

export interface TimelineItem {
  /** mono timestamp, e.g. "8:30am" */
  time: string;
  /** row heading */
  title: string;
  /** one-line supporting detail */
  desc: string;
  /** tints the node + impact pill (high = positive/mint, low = negative/red) */
  tone?: TimelineTone;
  /** small uppercase category label under the description */
  cat?: string;
  /** mono impact pill on the right, e.g. "+4 focus" / "−12" */
  impact?: string;
  /** inline chip after the title, e.g. "+caffeine" or a "now" badge */
  badge?: { label: string; tone?: ChipTone };
  /** highlight as the live/current row (accent ring + glow) */
  active?: boolean;
}

export interface ActivityTimelineProps {
  items?: TimelineItem[];
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of the design's example entries (icon glyphs are
 *  web-only SVG paths, so native renders the same data without the icon tile). */
const DEFAULT_ITEMS: TimelineItem[] = [
  {
    time: '8:30am',
    title: 'Morning coffee',
    desc: 'Double espresso · 130mg · inside window',
    tone: 'high',
    cat: 'Substance',
    impact: '+4 focus',
    badge: { label: '+caffeine' },
  },
  {
    time: '12:15pm',
    title: 'Lunch logged',
    desc: 'Chicken, rice & greens · 52g protein · 740 kcal',
    tone: 'high',
    cat: 'Meal',
    impact: '+5 baseline',
  },
  {
    time: '3:00pm',
    title: 'Energy dip',
    desc: 'Self-report · felt 4/10 · post-lunch crash',
    tone: 'low',
    cat: 'Mood',
    impact: '−12',
  },
  {
    time: '6:00pm',
    title: 'Gym · strength',
    desc: 'Squat 4×3 @ 180kg · RPE 8.5 · 38 min',
    tone: 'low',
    cat: 'Workout',
    impact: '−4 residual',
    badge: { label: 'now', tone: 'accent' },
    active: true,
  },
];

const NODE: Record<TimelineTone, string> = { high: colors.zoneHigh, mid: colors.zoneMid, low: colors.zoneLow };

function impactColors(active?: boolean, tone?: TimelineTone) {
  if (tone === 'high') return { color: colors.zoneHigh, borderColor: 'rgba(52,245,197,0.35)', backgroundColor: 'rgba(52,245,197,0.08)' };
  if (tone === 'low') return { color: colors.zoneLow, borderColor: 'rgba(255,77,109,0.35)', backgroundColor: 'rgba(255,77,109,0.08)' };
  return { color: colors.textDim, borderColor: colors.border, backgroundColor: colors.glass };
}

/** Vertical activity timeline — a connected rail of dotted nodes, each row a
 *  time + title + short description, tinted by energy zone. Same prop API as web. */
export function ActivityTimeline({ items = DEFAULT_ITEMS, style }: ActivityTimelineProps) {
  return (
    <View style={[styles.tl, style]}>
      {/* the connecting line behind the nodes */}
      <View style={styles.rail} pointerEvents="none" />
      {items.map((it, i) => {
        const nodeColor = it.active ? colors.accent : it.tone ? NODE[it.tone] : colors.border2;
        const dotColor = it.active ? colors.accent : it.tone ? NODE[it.tone] : colors.textFaint;
        const imp = impactColors(it.active, it.tone);
        return (
          <View key={i} style={styles.row}>
            <Text style={styles.time}>{it.time}</Text>
            <View style={styles.nodeCol}>
              <View
                style={[
                  styles.node,
                  { borderColor: nodeColor },
                  it.active && { shadowColor: colors.accent, shadowOpacity: 0.6, shadowRadius: 7, elevation: 6 },
                ]}
              >
                <View style={[styles.nodeDot, { backgroundColor: dotColor }]} />
              </View>
            </View>
            <View style={styles.body}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{it.title}</Text>
                {it.badge && <Chip label={it.badge.label} tone={it.badge.tone ?? 'default'} style={styles.badge} />}
              </View>
              <Text style={styles.sub}>{it.desc}</Text>
              {it.cat ? <Text style={styles.cat}>{it.cat.toUpperCase()}</Text> : null}
            </View>
            {it.impact ? (
              <View style={[styles.impact, { borderColor: imp.borderColor, backgroundColor: imp.backgroundColor }]}>
                <Text style={[styles.impactText, { color: imp.color }]}>{it.impact}</Text>
              </View>
            ) : (
              <View style={styles.impactSpacer} />
            )}
          </View>
        );
      })}
    </View>
  );
}

export type { TimelineItem as ActivityTimelineItem };

const RAIL_LEFT = 44 + 13 + 24 / 2 - 0.75; // align with center of the 24px node column

const styles = StyleSheet.create({
  tl: { position: 'relative', paddingLeft: 2 },
  rail: {
    position: 'absolute',
    left: RAIL_LEFT,
    top: 18,
    bottom: 18,
    width: 1.5,
    backgroundColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, paddingHorizontal: 4, gap: 13 },
  time: {
    width: 44,
    fontFamily: fonts.mono,
    fontSize: 10.5,
    color: colors.textFaint,
    textAlign: 'right',
    paddingTop: 5,
  },
  nodeCol: { width: 24, alignItems: 'center' },
  node: {
    zIndex: 1,
    width: 16,
    height: 16,
    marginTop: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    backgroundColor: colors.glass2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDot: { width: 6, height: 6, borderRadius: 3 },
  body: { flex: 1, minWidth: 0, paddingTop: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  title: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 14, color: colors.text },
  badge: { paddingVertical: 1, paddingHorizontal: 7 },
  sub: { fontFamily: fonts.ui, fontSize: 12.5, color: colors.textDim, marginTop: 4, lineHeight: 18 },
  cat: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.3, color: colors.textFaint, marginTop: 6 },
  impact: {
    alignSelf: 'center',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  impactText: { fontFamily: fonts.mono, fontSize: 10.5, fontWeight: '600' },
  impactSpacer: { width: 0 },
});
