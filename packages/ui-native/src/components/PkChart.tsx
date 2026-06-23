import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  type DimensionValue,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path, Line, Rect, Defs, LinearGradient, Stop, ClipPath } from 'react-native-svg';
import { colors, fonts, radii } from '@lockin90/tokens';

/** A single dose taken at `at` hours from t0, of `mg` of substance. */
export interface PkDose {
  /** time the dose is taken, in hours from t0 */
  at: number;
  /** dose amount (drives the per-dose peak height, in `unit`) */
  mg: number;
  /** optional label shown on the dose marker tag */
  label?: string;
}

/** A horizontal reference line at `value` (same y-scale as the curve). */
export interface PkThreshold {
  /** y-value of the reference line, in the chart's `unit` */
  value: number;
  /** optional label shown in the right-aligned tag */
  label?: string;
}

export interface PkChartProps {
  /** raw concentration samples, evenly spaced across `hours` (wins over `doses`) */
  samples?: number[];
  /** doses; each becomes a Bateman absorption/elimination curve, summed */
  doses?: PkDose[];
  /** total timespan in hours */
  hours?: number;
  /** elimination half-life in hours (caffeine ≈ 5) */
  halfLifeH?: number;
  /** time-to-peak in hours */
  tMaxH?: number;
  /** horizontal dashed reference line + label */
  threshold?: PkThreshold;
  /** y unit suffix shown in tags */
  unit?: string;
  /** curve color (hex) */
  color?: string;
  /** plot height in px (also the viewBox height) */
  height?: number;
  /** x-axis labels under the chart */
  axis?: string[];
  /** vertical line + mg tag at each dose.at */
  showDoseMarkers?: boolean;
  /** optional container style */
  style?: StyleProp<ViewStyle>;
}

const VB_W = 560;
/** vertical inset (viewBox units) so the curve never touches the top/bottom edge */
const PAD_Y = 14;
/** width (px) of the right gutter reserved for y-axis value labels */
const Y_GUTTER = 36;
/** number of derived y-axis ticks */
const Y_TICKS = 4;
/** number of samples synthesized when building from doses */
const SAMPLE_N = 121;

const DEFAULT_DOSES: PkDose[] = [
  { at: 7, mg: 120, label: 'Coffee' },
  { at: 10, mg: 80, label: 'Espresso' },
  { at: 13.5, mg: 60, label: 'Tea' },
];
const DEFAULT_THRESHOLD: PkThreshold = { value: 50, label: 'Sleep-disruption' };
const DEFAULT_AXIS = ['6a', '10a', '2p', '6p', '10p'];

/* ── Bateman one-compartment PK model (IDENTICAL on web + native) ───────────
   ke = ln2/halfLife ; ka = ln2/(tMax/2). Bateman shape s(τ)=e^-keτ − e^-kaτ
   for τ≥0. Normalize so a single dose's peak == 1, so `mg` is the peak height
   ("mg in system"). Doses sum. */
export function batemanShapeNorm(halfLifeH: number, tMaxH: number) {
  const ke = Math.LN2 / halfLifeH;
  const ka = Math.LN2 / (tMaxH / 2);
  const s = (tau: number) => (tau < 0 ? 0 : Math.exp(-ke * tau) - Math.exp(-ka * tau));
  // closed-form peak time; guard ka ≈ ke (degenerate → tiny offset peak)
  const tauPeak = Math.abs(ka - ke) < 1e-9 ? tMaxH : Math.log(ka / ke) / (ka - ke);
  const peakShape = s(tauPeak) || 1;
  return (tau: number) => s(tau) / peakShape;
}

/** Build `SAMPLE_N` concentration samples over [0, hours] by summing each
 *  dose's normalized Bateman curve. (IDENTICAL on web + native.) */
export function buildPkSamples(
  doses: PkDose[],
  hours: number,
  halfLifeH: number,
  tMaxH: number,
): number[] {
  const shapeNorm = batemanShapeNorm(halfLifeH, tMaxH);
  const out: number[] = [];
  for (let i = 0; i < SAMPLE_N; i++) {
    const t = (i / (SAMPLE_N - 1)) * hours;
    let c = 0;
    for (const d of doses) c += d.mg * shapeNorm(t - d.at);
    out.push(c);
  }
  return out;
}

/** Derive ~`Y_TICKS` evenly-spaced tick values across [0, max]. */
function deriveTicks(max: number): number[] {
  if (max <= 0) return [0];
  const ticks: number[] = [];
  for (let i = 0; i < Y_TICKS; i++) ticks.push((max * i) / (Y_TICKS - 1));
  return ticks;
}

/** Compact label for a tick value: integers as-is, else 1 decimal. */
const tickLabel = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/** Round a number for compact path strings. */
const r = (n: number) => Math.round(n * 100) / 100;

/** Map a value in [0, max] to its y (viewBox units), max → top, 0 → bottom. */
function valueToY(v: number, max: number, height: number): number {
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const t = max > 0 ? v / max : 0;
  return bottom - t * (bottom - top);
}

/** Catmull-Rom spline expressed as cubic béziers — a smooth curve passing
 *  through every point (endpoints duplicated so the ends stay anchored). */
function smoothPath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n === 0) return '';
  if (n < 3) return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r(x)},${r(y)}`).join(' ');
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${r(c1x)},${r(c1y)} ${r(c2x)},${r(c2y)} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

/** PkChart — a pharmacokinetics concentration-over-time primitive. Plots a
 *  smooth area+line of substance "in system" (from raw `samples` or summed
 *  per-dose Bateman curves), with a dashed threshold reference line, vertical
 *  dose markers, a peak callout dot, a right y-axis and an x-axis row. The Svg
 *  stretches to the measured container width via a fixed viewBox + non-uniform
 *  scaling; overlay dots/tags are absolutely-positioned Views placed by % so
 *  they stay crisp/round. */
export function PkChart({
  samples,
  doses = DEFAULT_DOSES,
  hours = 24,
  halfLifeH = 5,
  tMaxH = 0.75,
  threshold = DEFAULT_THRESHOLD,
  unit = 'mg',
  color = colors.accent,
  height = 180,
  axis = DEFAULT_AXIS,
  showDoseMarkers = true,
  style,
}: PkChartProps) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const data = samples && samples.length > 0 ? samples : buildPkSamples(doses, hours, halfLifeH, tMaxH);
  const n = data.length;

  // y-scale spans [0, max(curveMax, threshold)] so the threshold line fits.
  const curveMax = n ? Math.max(...data) : 0;
  const yMax = Math.max(curveMax, threshold ? threshold.value : 0) || 1;

  // viewBox points (x spread evenly across full width; y on the [0, yMax] scale)
  const pts: Array<[number, number]> = data.map((v, i) => {
    const x = n === 1 ? VB_W / 2 : (i / (n - 1)) * VB_W;
    return [x, valueToY(v, yMax, height)];
  });
  const line = smoothPath(pts);
  const areaPath = line ? `${line} L${VB_W},${height} L0,${height} Z` : '';

  // peak (max) point for the callout
  let peakIdx = 0;
  for (let i = 1; i < n; i++) if (data[i] > data[peakIdx]) peakIdx = i;
  const peakPt = pts[peakIdx];
  const peakVal = n ? data[peakIdx] : 0;

  // threshold y (and danger-zone clip-rect above it)
  const thY = threshold ? valueToY(threshold.value, yMax, height) : 0;

  // y-axis ticks across [0, yMax]
  const tickRows = deriveTicks(yMax).map((v) => ({ v, y: valueToY(v, yMax, height) }));

  // dose marker x positions (hours → x across [0, hours])
  const markerDoses = showDoseMarkers && !samples ? doses : [];
  const doseX = (at: number) => (hours > 0 ? (at / hours) * VB_W : 0);

  // drawing area shrinks by the gutter so the curve/markers line up with labels
  const canvasW = Math.max(0, width - Y_GUTTER);

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.plot, { height }]} onLayout={onLayout}>
        <View style={[styles.canvas, { width: canvasW }]}>
          {canvasW > 0 && (
            <Svg width={canvasW} height={height} viewBox={`0 0 ${VB_W} ${height}`} preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="lk-pk-fill" x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={color} stopOpacity={0.26} />
                  <Stop offset="1" stopColor={color} stopOpacity={0} />
                </LinearGradient>
                <LinearGradient id="lk-pk-danger" x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={colors.bad} stopOpacity={0.22} />
                  <Stop offset="1" stopColor={colors.bad} stopOpacity={0.04} />
                </LinearGradient>
                {threshold ? (
                  <ClipPath id="lk-pk-clip">
                    <Rect x={0} y={0} width={VB_W} height={r(thY)} />
                  </ClipPath>
                ) : null}
              </Defs>

              {/* y-axis gridlines aligned with the ticks */}
              {tickRows.map((t) => (
                <Line key={t.v} x1={0} y1={r(t.y)} x2={VB_W} y2={r(t.y)} stroke={colors.border} strokeWidth={1} opacity={0.6} />
              ))}

              {/* area fill under the curve */}
              {areaPath ? <Path d={areaPath} fill="url(#lk-pk-fill)" /> : null}

              {/* danger-zone tint: the curve's area clipped above the threshold */}
              {threshold && areaPath ? <Path d={areaPath} fill="url(#lk-pk-danger)" clipPath="url(#lk-pk-clip)" /> : null}

              {/* dose markers: faint vertical lines at each dose time */}
              {markerDoses.map((d, i) => (
                <Line
                  key={i}
                  x1={r(doseX(d.at))}
                  y1={PAD_Y}
                  x2={r(doseX(d.at))}
                  y2={height - PAD_Y}
                  stroke={colors.border2}
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
              ))}

              {/* threshold dashed reference line */}
              {threshold ? (
                <Line x1={0} y1={r(thY)} x2={VB_W} y2={r(thY)} stroke={colors.bad} strokeWidth={1.5} strokeDasharray="5 4" opacity={0.85} />
              ) : null}

              {/* the concentration curve */}
              {line ? (
                <Path d={line} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              ) : null}
            </Svg>
          )}

          {/* dose marker tags — %-positioned overlays so they stay crisp */}
          {markerDoses.map((d, i) => (
            <View
              key={i}
              style={[styles.doseMarker, { left: `${(doseX(d.at) / VB_W) * 100}%` as DimensionValue }]}
              pointerEvents="none"
            >
              <View style={styles.doseTag}>
                <Text style={styles.doseTagText} numberOfLines={1}>
                  {`+${d.mg}${unit}${d.label ? ' · ' + d.label : ''}`}
                </Text>
              </View>
            </View>
          ))}

          {/* peak callout dot + tag */}
          {peakPt && peakVal > 0 ? (
            <View
              style={[
                styles.marker,
                {
                  left: `${(peakPt[0] / VB_W) * 100}%` as DimensionValue,
                  top: `${(peakPt[1] / height) * 100}%` as DimensionValue,
                },
              ]}
              pointerEvents="none"
            >
              <View style={[styles.tag, { borderColor: color }]}>
                <Text style={[styles.tagText, { color }]}>{`${tickLabel(peakVal)}${unit}`}</Text>
              </View>
              <View style={[styles.dot, { backgroundColor: color }]} />
            </View>
          ) : null}

          {/* threshold label, pinned right at the threshold y */}
          {threshold ? (
            <View style={[styles.thTagWrap, { top: `${(thY / height) * 100}%` as DimensionValue }]} pointerEvents="none">
              <View style={styles.thTag}>
                <Text style={styles.thTagText} numberOfLines={1}>
                  {`${threshold.label ? threshold.label + ' ' : ''}${tickLabel(threshold.value)}${unit}`}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* y-axis value labels, pinned in the right gutter at each tick's y */}
        <View style={styles.yaxis} pointerEvents="none">
          {tickRows.map((t, i) => (
            <Text key={i} style={[styles.ytick, { top: `${(t.y / height) * 100}%` as DimensionValue }]} numberOfLines={1}>
              {tickLabel(t.v)}
            </Text>
          ))}
        </View>
      </View>

      {axis && axis.length > 0 && (
        <View style={[styles.axis, { paddingRight: Y_GUTTER }]}>
          {axis.map((t, i) => (
            <Text key={i} style={styles.axisText}>{t}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'column', gap: 8, width: '100%' },
  plot: { position: 'relative', flexDirection: 'row', width: '100%' },
  // drawing area: holds the Svg + overlays; overlays anchor against it
  canvas: { position: 'relative', height: '100%' },
  // right gutter holding the y-axis value labels
  yaxis: { width: Y_GUTTER, height: '100%' },
  ytick: {
    position: 'absolute',
    right: 0,
    marginTop: -5,
    paddingLeft: 6,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0.2,
    color: colors.textFaint,
    textAlign: 'right',
  },
  marker: {
    position: 'absolute',
    // translate(-50%, -50%) on an 11px dot
    marginLeft: -5.5,
    marginTop: -5.5,
    alignItems: 'center',
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 2,
    borderColor: colors.bg0,
    shadowColor: '#fff',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  tag: {
    position: 'absolute',
    bottom: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    borderWidth: 1,
    backgroundColor: colors.glass2,
  },
  tagText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0.36,
  },
  // dose marker: anchored to the top of the dose line, tag hangs just below
  doseMarker: {
    position: 'absolute',
    top: 2,
    marginLeft: -1,
    alignItems: 'center',
  },
  doseTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
  },
  doseTagText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0.36,
    color: colors.textDim,
  },
  // threshold label pinned to the right edge at the threshold y
  thTagWrap: {
    position: 'absolute',
    right: 4,
    marginTop: -8,
  },
  thTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.bad,
    backgroundColor: colors.glass2,
  },
  thTagText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0.36,
    color: colors.bad,
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
  },
  axisText: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.textFaint,
  },
});
