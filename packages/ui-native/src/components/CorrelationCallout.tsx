import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip, type ChipTone } from './Chip';

export interface CorrelationItem {
  /** leading factor, e.g. 'Sleep' */
  from?: string;
  /** trailing factor, e.g. 'Next-day energy' */
  to?: string;
  /** R value in [−1, +1] — sign drives positive (mint/cyan) vs negative (warm) styling */
  r: number;
  /** plain-language read of the relationship */
  read?: string;
  /** confidence percent 0..100 shown as a tone-coded chip */
  confidence?: number;
  /** number of days the relationship was observed across */
  days?: number;
  /** two normalized spark series (each 0..1, low→high), drawn as the dual line */
  series?: { a?: number[]; b?: number[] };
}

export interface CorrelationCalloutProps extends ViewProps {
  /** one or more discovered relationships, stacked vertically */
  items?: CorrelationItem[];
}

const SW = 78;
const SH = 36;
const TRACK_W = 220; // logical gauge track width for marker geometry

function strengthLabel(abs: number): string {
  if (abs >= 0.7) return 'strong';
  if (abs >= 0.4) return 'moderate';
  if (abs >= 0.2) return 'weak';
  return 'negligible';
}

function formatR(r: number): string {
  const sign = r < 0 ? '−' : '+';
  return `${sign}${Math.abs(r).toFixed(2)}`;
}

function confTone(c: number): ChipTone {
  if (c >= 85) return 'high';
  if (c >= 65) return 'mid';
  return 'low';
}

function sparkPoints(series: number[]): { x: number; y: number }[] {
  const stepX = SW / (series.length - 1 || 1);
  const pad = 8;
  return series.map((v, i) => ({
    x: i * stepX,
    y: SH - pad - Math.max(0, Math.min(1, v)) * (SH - pad * 2),
  }));
}

function sparkPath(series: number[]): string {
  if (series.length === 0) return '';
  return sparkPoints(series)
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(0)},${p.y.toFixed(0)}`)
    .join(' ');
}

const DEFAULT_ITEMS: CorrelationItem[] = [
  {
    from: 'Sleep',
    to: 'Next-day energy',
    r: 0.82,
    read: 'When sleep runs longer and deeper, next-day energy reliably climbs with it — a strong positive link worth protecting.',
    confidence: 92,
    days: 38,
    series: { a: [0.28, 0.39, 0.33, 0.58, 0.69, 0.78], b: [0.22, 0.31, 0.28, 0.5, 0.64, 0.69] },
  },
  {
    from: 'Late caffeine',
    to: 'Deep sleep',
    r: -0.64,
    read: 'The later you take caffeine, the less deep sleep you bank that night — a moderate negative link to watch after 2pm.',
    confidence: 78,
    days: 31,
    series: { a: [0.72, 0.64, 0.75, 0.5, 0.33, 0.22], b: [0.28, 0.39, 0.25, 0.58, 0.69, 0.75] },
  },
];

/** CorrelationCallout — discovered-relationship cards. Each item shows the factor
 *  pair, an R-strength gauge (−1→+1 with a marker), a plain-language read, a
 *  dual-line spark of the two series, and a confidence note. Native counterpart of
 *  the web CorrelationCallout (same prop API). Renders the showcase pair by default. */
export function CorrelationCallout({ items = DEFAULT_ITEMS, style, ...rest }: CorrelationCalloutProps) {
  return (
    <View style={[styles.grid, style]} {...rest}>
      {items.map((it, idx) => {
        const neg = it.r < 0;
        const abs = Math.min(1, Math.abs(it.r));
        const markerFrac = (it.r + 1) / 2; // 0..1 across the track
        const markerLeft = markerFrac * TRACK_W;
        const center = TRACK_W / 2;
        const fillLeft = neg ? markerLeft : center;
        const fillWidth = Math.abs(markerLeft - center);

        const posLine = neg ? colors.zoneMid : colors.accent2;
        const negLine = neg ? colors.cyan : colors.mint;
        const rColor = neg ? colors.zoneMid : colors.accent2;
        const seriesA = it.series?.a ?? [];
        const seriesB = it.series?.b ?? [];

        const bodyTint = neg
          ? { borderColor: 'rgba(255,176,32,0.22)', backgroundColor: 'rgba(255,176,32,0.06)' }
          : { borderColor: 'rgba(124,92,255,0.22)', backgroundColor: 'rgba(124,92,255,0.06)' };

        return (
          <Card key={idx} style={styles.card}>
            <View style={styles.top}>
              <View style={styles.pair}>
                {!!it.from && <Text style={styles.factor}>{it.from}</Text>}
                <View style={styles.link}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path
                      d={neg ? 'M7 7l10 10M9 17h8V9' : 'M7 17l10-10M9 7h8v8'}
                      stroke={colors.textDim}
                      strokeWidth={2}
                    />
                  </Svg>
                </View>
                {!!it.to && <Text style={styles.factor}>{it.to}</Text>}
              </View>
              {it.confidence != null && <Chip tone={confTone(it.confidence)} dot label={`${it.confidence}% conf.`} />}
            </View>

            <View style={[styles.body, bodyTint]}>
              <Text style={[styles.rval, { color: rColor }]}>{formatR(it.r)}</Text>
              {!!it.read && <Text style={styles.interp}>{it.read}</Text>}
            </View>

            <View style={styles.gauge}>
              <View style={styles.glabel}>
                <Text style={styles.gname}>CORRELATION STRENGTH</Text>
                <Text style={[styles.gstrength, { color: rColor }]}>
                  R = {formatR(it.r)} · {strengthLabel(abs)}
                </Text>
              </View>
              <View style={styles.track}>
                <View style={styles.tick} />
                <View
                  style={[
                    styles.fill,
                    {
                      left: fillLeft,
                      width: fillWidth,
                      backgroundColor: neg ? colors.zoneMid : colors.mint,
                    },
                  ]}
                />
                <View
                  style={[styles.marker, { left: markerLeft, borderColor: neg ? colors.zoneMid : colors.mint }]}
                />
              </View>
              <View style={styles.scale}>
                <Text style={styles.scaleTxt}>{'−'}1.0</Text>
                <Text style={styles.scaleTxt}>0</Text>
                <Text style={styles.scaleTxt}>+1.0</Text>
              </View>
            </View>

            <View style={styles.foot}>
              <View style={styles.viz}>
                <Svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`}>
                  <Line x1={0} y1={SH / 2} x2={SW} y2={SH / 2} stroke={colors.border} strokeWidth={1} />
                  {seriesA.length > 0 && (
                    <Path d={sparkPath(seriesA)} fill="none" stroke={posLine} strokeWidth={2} strokeLinecap="round" />
                  )}
                  {seriesB.length > 0 && (
                    <Path
                      d={sparkPath(seriesB)}
                      fill="none"
                      stroke={negLine}
                      strokeWidth={2}
                      strokeLinecap="round"
                      opacity={0.85}
                    />
                  )}
                  {seriesA.length > 0 &&
                    (() => {
                      const last = sparkPoints(seriesA)[seriesA.length - 1];
                      return <Circle cx={last.x} cy={last.y} r={1.8} fill={posLine} />;
                    })()}
                </Svg>
                <View style={styles.legend}>
                  {!!it.from && (
                    <View style={styles.leg}>
                      <View style={[styles.legDot, { backgroundColor: posLine }]} />
                      <Text style={styles.legTxt}>{it.from}</Text>
                    </View>
                  )}
                  {!!it.to && (
                    <View style={styles.leg}>
                      <View style={[styles.legDot, { backgroundColor: negLine }]} />
                      <Text style={styles.legTxt}>{it.to}</Text>
                    </View>
                  )}
                </View>
              </View>
              {it.days != null && (
                <Text style={styles.span}>
                  across <Text style={styles.spanNum}>{it.days}</Text> days
                </Text>
              )}
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 14 },
  card: { padding: 16 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 11 },
  pair: { flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 1, flexWrap: 'wrap', minWidth: 0 },
  factor: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 12.5, color: colors.text },
  link: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  rval: { fontFamily: fonts.display, fontWeight: '700', fontSize: 30, lineHeight: 30, letterSpacing: -0.6 },
  interp: { flex: 1, fontFamily: fonts.ui, fontSize: 11, color: colors.textDim, lineHeight: 16 },
  gauge: { marginTop: 13 },
  glabel: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 },
  gname: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.54, color: colors.textFaint },
  gstrength: { fontFamily: fonts.mono, fontSize: 9.5, fontWeight: '600' },
  track: {
    position: 'relative',
    height: 8,
    width: TRACK_W,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tick: { position: 'absolute', left: TRACK_W / 2, top: -3, bottom: -3, width: 1, backgroundColor: colors.border2 },
  fill: { position: 'absolute', top: 0, bottom: 0, borderRadius: 999 },
  marker: {
    position: 'absolute',
    top: '50%',
    width: 13,
    height: 13,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 3,
    marginLeft: -6.5,
    marginTop: -6.5,
  },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, width: TRACK_W },
  scaleTxt: { fontFamily: fonts.mono, fontSize: 8, color: colors.textFaint },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viz: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1, minWidth: 0 },
  legend: { gap: 3, minWidth: 0 },
  leg: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legDot: { width: 9, height: 2, borderRadius: 999 },
  legTxt: { fontFamily: fonts.mono, fontSize: 8.5, color: colors.textFaint },
  span: { fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint },
  spanNum: { color: colors.textDim },
});
