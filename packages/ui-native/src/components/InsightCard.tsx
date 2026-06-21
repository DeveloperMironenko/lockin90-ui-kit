import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';
import { Chip } from './Chip';
import { Card } from './Card';

export interface InsightChips {
  /** sample size, e.g. 24 */
  n?: number;
  /** p-value label, e.g. 'p < 0.01' */
  p?: string;
  /** confidence percent 0..100, e.g. 86 */
  confidence?: number;
}

export interface InsightCardProps extends ViewProps {
  /** headline of the finding */
  title?: string;
  /** plain-language body */
  body?: string;
  /** status pill text, e.g. 'CONFIRMED' (omit to hide) */
  status?: string;
  /** signed effect size shown large, e.g. '−9.2' */
  effect?: string;
  /** sign of the effect — drives the effect color (high/low) */
  effectSign?: 'pos' | 'neg';
  /** evidence sparkline points (y values, any scale) */
  spark?: number[];
  /** p · n · confidence chips */
  chips?: InsightChips;
}

const SPARK_W = 150;
const SPARK_H = 64;
const PAD_X = 2;
const PAD_TOP = 16;
const PAD_BOTTOM = 14;

function sparkPoints(values: number[]): { x: number; y: number }[] {
  const n = values.length;
  if (n === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const usableW = SPARK_W - PAD_X * 2;
  const usableH = SPARK_H - PAD_TOP - PAD_BOTTOM;
  return values.map((v, i) => ({
    x: PAD_X + (n === 1 ? usableW / 2 : (usableW * i) / (n - 1)),
    y: PAD_TOP + usableH * (1 - (v - min) / range),
  }));
}

const DEFAULT_BODY =
  'Caffeine after 2pm costs you ~9 energy points on the same evening. Across 24 logged afternoons your ' +
  'wind-down score dropped from a typical 71 to 62 whenever coffee landed past 14:00.';

/** AI insight surface — headline + prose, effect size, evidence sparkline,
 *  and p · n · confidence stat chips. Renders the showcase example by default. */
export function InsightCard({
  title = 'Late caffeine is draining your evenings',
  body = DEFAULT_BODY,
  status = 'CONFIRMED',
  effect = '−9.2',
  effectSign = 'neg',
  spark = [42, 46, 38, 43, 30, 23, 26, 14],
  chips = { n: 24, p: 'p < 0.01', confidence: 86 },
  style,
  ...rest
}: InsightCardProps) {
  const pts = sparkPoints(spark);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  const fill = pts.length
    ? `${line} L${(SPARK_W - PAD_X).toFixed(1)} ${(SPARK_H - PAD_BOTTOM).toFixed(1)} L${PAD_X.toFixed(1)} ${(
        SPARK_H - PAD_BOTTOM
      ).toFixed(1)} Z`
    : '';
  const effColor = effectSign === 'pos' ? colors.zoneHigh : colors.zoneLow;

  return (
    <Card style={[styles.card, style]} {...rest}>
      <View style={styles.main}>
        <View style={styles.head}>
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
              d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1v.2h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z"
              stroke={colors.accent}
              strokeWidth={1.6}
              fill="none"
            />
          </Svg>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.meta}>
          {!!status && <Chip tone="accent" dot label={status} />}
          {!!chips?.p && <Chip tone="default" label={chips.p} />}
          {chips?.n != null && <Chip tone="default" label={`n = ${chips.n}`} />}
          {chips?.confidence != null && <Chip tone="high" label={`${chips.confidence}% conf`} />}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.eff, { color: effColor }]}>{effect}</Text>
        <Svg width={150} height={64} viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}>
          <Defs>
            <LinearGradient id="lkInsFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.accent2} stopOpacity={0.28} />
              <Stop offset="1" stopColor={colors.accent2} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {!!fill && <Path d={fill} fill="url(#lkInsFill)" />}
          {!!line && (
            <Path d={line} fill="none" stroke={colors.accent2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          )}
          {!!last && <Circle cx={last.x} cy={last.y} r={3} fill={colors.accent2} />}
        </Svg>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  main: { flex: 1, minWidth: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 7 },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.17,
    color: colors.text,
  },
  body: { fontSize: 13.5, color: colors.textDim, lineHeight: 21 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, alignItems: 'center' },
  right: { alignItems: 'flex-end', gap: 8 },
  eff: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: -0.44,
    lineHeight: 22,
  },
});
