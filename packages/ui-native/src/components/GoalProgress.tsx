import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { BarFill } from './BarFill';
import { Chip, type ChipTone } from './Chip';

/** Domain accent for the leading icon tile (drives color + default glyph). */
export type GoalDomain = 'energy' | 'sleep';
/** Progress-bar gradient — mint (on track) or warm (at risk). */
export type GoalProgressTone = 'mint' | 'warm';

export interface GoalProgressProps {
  /** Eyebrow above the name, e.g. "Energy" or "Sleep · duration". */
  domain?: string;
  /** Which icon tile / glyph to show. */
  icon?: GoalDomain;
  /** Goal title, e.g. "Avg energy ≥ 80". */
  name?: string;
  /** Big current value. */
  current?: ReactNode;
  /** Small suffix after the current value, e.g. " /100" or " h avg". */
  unit?: string;
  /** Target value text, e.g. "80" or "7.5 h". */
  target?: string;
  /** Percentage 0..100 — drives the mini ring + the progress bar fill. */
  pct?: number;
  /** Progress-bar gradient tone. */
  progressTone?: GoalProgressTone;
  /** Footer date / window string, e.g. "Aug 31 · 12 days left". */
  date?: string;
  /** Footer date glyph. */
  dateIcon?: 'calendar' | 'clock';
  /** Pace chip tone (high = on track, mid = at risk, low = off). */
  paceTone?: ChipTone;
  /** Pace chip text, e.g. "+3 / 14d · on track". */
  paceLabel?: string;
  /** Whether the pace chip shows a leading dot. */
  paceDot?: boolean;
  style?: StyleProp<ViewStyle>;
}

const DOM: Record<GoalDomain, { color: string; border: string; bg: string }> = {
  energy: { color: colors.zoneHigh, border: 'rgba(52,245,197,0.32)', bg: 'rgba(52,245,197,0.10)' },
  sleep: { color: colors.info, border: 'rgba(110,123,255,0.32)', bg: 'rgba(110,123,255,0.10)' },
};

function DomainGlyph({ icon, color }: { icon: GoalDomain; color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      {icon === 'energy' ? (
        <Path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      ) : (
        <Path
          d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
          fill="none"
          stroke={color}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

function DateGlyph({ icon }: { icon: 'calendar' | 'clock' }) {
  const stroke = colors.textFaint;
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24">
      {icon === 'calendar' ? (
        <>
          <Path d="M3 4h18v17H3z" fill="none" stroke={stroke} strokeWidth={1.6} />
          <Path d="M3 9h18M8 2v4M16 2v4" fill="none" stroke={stroke} strokeWidth={1.6} />
        </>
      ) : (
        <>
          <Circle cx={12} cy={12} r={9} fill="none" stroke={stroke} strokeWidth={1.6} />
          <Path d="M12 6v6l4 2" fill="none" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}

/** Mini progress ring — track + arc, matching the web conic-gradient ring. */
function MiniRing({ pct }: { pct: number }) {
  const size = 50;
  const r = 23;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, pct)) / 100) * c;
  const cx = size / 2;
  return (
    <View style={styles.mini}>
      <Svg width={size} height={size} style={styles.miniSvg}>
        <Circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={4} />
        <Circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={colors.accent2}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </Svg>
      <View style={styles.miniHole} />
      <Text style={styles.miniLabel}>{Math.round(pct)}%</Text>
    </View>
  );
}

/**
 * Goal progress card — name + mini progress ring + current/target values +
 * gradient progress bar + a pace/status chip. Defaults to the design example
 * ("Avg energy ≥ 80"). Mirrors the web `GoalProgress` prop API.
 */
export function GoalProgress({
  domain = 'Energy',
  icon = 'energy',
  name = 'Avg energy ≥ 80',
  current = 76,
  unit = ' /100',
  target = '80',
  pct = 95,
  progressTone = 'mint',
  date = 'Aug 31 · 12 days left',
  dateIcon = 'calendar',
  paceTone = 'high',
  paceLabel = '+3 / 14d · on track',
  paceDot = true,
  style,
}: GoalProgressProps) {
  const clamped = Math.max(0, Math.min(100, pct));
  const dom = DOM[icon];
  return (
    <View style={[styles.card, style]}>
      <View style={styles.top}>
        <View style={[styles.ico, { backgroundColor: dom.bg, borderColor: dom.border }]}>
          <DomainGlyph icon={icon} color={dom.color} />
        </View>
        <View style={styles.head}>
          <Text style={styles.dom}>{domain}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <MiniRing pct={clamped} />
      </View>

      <View style={styles.vals}>
        <Text style={styles.cur}>
          {current}
          {unit != null && <Text style={styles.curSmall}>{unit}</Text>}
        </Text>
        <Text style={styles.tgt}>
          target <Text style={styles.tgtVal}>{target}</Text>
        </Text>
      </View>

      <View style={styles.prog}>
        <View style={styles.progBar}>
          <BarFill value={clamped / 100} height={8} />
        </View>
        <Text style={styles.pct}>{Math.round(clamped)}%</Text>
      </View>

      <View style={styles.foot}>
        <View style={styles.dateRow}>
          <DateGlyph icon={dateIcon} />
          <Text style={styles.date}>{date}</Text>
        </View>
        <Chip tone={paceTone} dot={paceDot} label={paceLabel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    gap: 13,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ico: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  head: { minWidth: 0, flex: 1 },
  dom: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.textFaint },
  name: { fontFamily: fonts.display, fontSize: 16, fontWeight: '700', letterSpacing: -0.16, marginTop: 3, lineHeight: 19, color: colors.text },
  mini: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
  miniSvg: { position: 'absolute' },
  miniHole: { position: 'absolute', width: 38, height: 38, borderRadius: 19, backgroundColor: colors.glass2 },
  miniLabel: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '700', color: colors.text },
  vals: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  cur: { fontFamily: fonts.display, fontWeight: '700', fontSize: 26, letterSpacing: -0.52, lineHeight: 26, color: colors.text },
  curSmall: { fontFamily: fonts.mono, fontSize: 14, fontWeight: '400', color: colors.textFaint },
  tgt: { fontFamily: fonts.mono, fontSize: 12, color: colors.textFaint },
  tgtVal: { color: colors.textDim, fontWeight: '500' },
  prog: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  progBar: { flex: 1 },
  pct: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 9, flexWrap: 'wrap', paddingTop: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 'auto' },
  date: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint },
});
