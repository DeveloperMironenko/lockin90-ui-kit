import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { Chip } from './Chip';
import { Pulse } from './Pulse';

export type TimelineStatus = 'done' | 'now' | 'next';

export interface TimelineItem {
  title: string;
  /** Optional time/date label, e.g. "Today", "In 2 months", "Q3 2026". */
  date?: string;
  description?: ReactNode;
  status?: TimelineStatus;
  statusLabel?: string;
}

export interface TimelineProps extends ViewProps {
  items?: TimelineItem[];
}

const CHIP_TONE = { done: 'high', now: 'accent', next: 'mid' } as const;
const DEFAULT_LABEL = { done: 'Done', now: 'In progress', next: 'Next' } as const;

const DEFAULT_ITEMS: TimelineItem[] = [
  { status: 'done', title: 'Model calibrated', date: 'Shipped', description: 'Energy & recovery model trained and validated against real wearable data.' },
  { status: 'done', title: 'Wearables connected', date: 'Shipped', description: 'Oura, WHOOP, Apple Health and Garmin sync built end-to-end.' },
  { status: 'now', title: 'Closed beta', date: 'Today', description: 'Polishing the experience with founding athletes right now.' },
  { status: 'next', title: 'Public launch', date: 'In 2 months', description: 'Doors open to the waitlist first.' },
];

function Dot({ status }: { status: TimelineStatus }) {
  if (status === 'done') {
    return (
      <LinearGradient
        colors={gradients.mint.stops as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.dot, styles.dotDone]}
      >
        <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#0A0A12" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M20 6 9 17l-5-5" />
        </Svg>
      </LinearGradient>
    );
  }
  if (status === 'now') {
    return (
      <View style={[styles.dot, styles.dotNow]}>
        <Pulse />
      </View>
    );
  }
  return <View style={[styles.dot, styles.dotNext]} />;
}

/** Vertical milestone timeline — done → now → next, each with a time/date label
 *  and a status chip. Native twin of the web Timeline (the "coming soon" component). */
export function Timeline({ items = DEFAULT_ITEMS, style, ...rest }: TimelineProps) {
  return (
    <View style={style} {...rest}>
      {items.map((it, i) => {
        const status = it.status ?? 'next';
        const last = i === items.length - 1;
        return (
          <View key={i} style={[styles.item, last && styles.itemLast]}>
            <View style={styles.gutter}>
              <Dot status={status} />
              {!last ? <View style={[styles.line, status === 'done' && styles.lineDone]} /> : null}
            </View>
            <View style={[styles.body, status === 'next' && styles.bodyNext]}>
              <View style={styles.top}>
                <Text style={styles.title}>{it.title}</Text>
                {it.date ? <Text style={styles.date}>{it.date.toUpperCase()}</Text> : null}
                <Chip tone={CHIP_TONE[status]} dot label={it.statusLabel ?? DEFAULT_LABEL[status]} />
              </View>
              {it.description ? <Text style={styles.desc}>{it.description}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', paddingBottom: 22 },
  itemLast: { paddingBottom: 0 },
  gutter: { width: 28, alignItems: 'center' },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
  },
  dotDone: { borderColor: 'transparent', ...nativeShadows.glowMint },
  dotNow: { backgroundColor: 'rgba(124,92,255,0.14)', borderColor: 'rgba(124,92,255,0.5)' },
  dotNext: { backgroundColor: 'rgba(255,176,32,0.12)', borderColor: 'rgba(255,176,32,0.4)' },
  line: { width: 2, flex: 1, marginTop: 2, backgroundColor: colors.border2 },
  lineDone: { backgroundColor: colors.mint },
  body: { flex: 1, paddingLeft: 16, paddingTop: 1 },
  bodyNext: { opacity: 0.82 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 5 },
  title: { fontFamily: fonts.display, fontSize: 16, fontWeight: '600', color: colors.text },
  date: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.7, color: colors.textFaint },
  desc: { color: colors.textDim, fontSize: 13.5, lineHeight: 21, marginTop: 4 },
});
