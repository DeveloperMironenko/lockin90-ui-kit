import { useState } from 'react';
import { View, Text, StyleSheet, type DimensionValue, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** A round overlay dot pinned over a data point (kept circular by rendering it as
 *  an absolutely-positioned View over the stretched Svg), with an optional
 *  floating label tag. */
export interface LineMarker {
  /** index into `data` to anchor the dot on */
  index: number;
  /** dot color (hex); defaults to the line `color` */
  color?: string;
  /** optional small floating tag above the dot */
  label?: string;
}

export interface LineChartProps {
  /** y-values, auto-scaled to fit the plot height */
  data?: number[];
  /** x labels under the chart (optional) */
  axis?: string[];
  /** line color (hex) */
  color?: string;
  /** optional multi-stop horizontal line gradient; overrides `color` for the stroke */
  gradient?: string[];
  /** faint area fill under the line in `color` */
  area?: boolean;
  /** Catmull-Rom smoothing; when false, straight segments */
  smooth?: boolean;
  /** plot height in px (also the viewBox height) */
  height?: number;
  /** round overlay dots at data indices, with optional label tags */
  markers?: LineMarker[];
  /** faint horizontal gridlines */
  grid?: boolean;
  /** show value labels down the right edge, on the data's y-scale */
  yAxis?: boolean;
  /** explicit y-axis tick values; if omitted (and `yAxis`), ~4 evenly-spaced
   *  ticks are derived from the data min..max */
  yTicks?: number[];
  /** filled uncertainty ribbon drawn behind the line, on the SAME y-scale as data */
  band?: { upper: number[]; lower: number[]; color?: string };
  /** from this data index onward the main line renders dashed (forecast continuation) */
  dashedFromIndex?: number;
  /** optional container style */
  style?: StyleProp<ViewStyle>;
}

const VB_W = 560;
/** vertical inset (viewBox units) so the line never touches the top/bottom edge */
const PAD_Y = 14;
/** horizontal inset (viewBox units) so the first/last points, the round line caps
 *  and the overlay marker dots stay fully inside the plot instead of clipping at
 *  the left/right edges. */
const PAD_X = 14;
/** number of interior horizontal gridlines */
const GRID_LINES = 3;
/** width (px) of the right gutter reserved for y-axis value labels */
const Y_GUTTER = 36;
/** number of derived y-axis ticks when `yTicks` is omitted */
const Y_TICKS = 4;

/** Map a value to its y position (viewBox units) using the same inverted,
 *  auto-scaled mapping as `toPoints` (max → top, min → bottom). */
function valueToY(v: number, min: number, span: number, height: number): number {
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const t = (v - min) / span;
  return bottom - t * (bottom - top);
}

/** Derive ~`Y_TICKS` evenly-spaced tick values across [min, max]. */
function deriveTicks(min: number, max: number): number[] {
  if (max === min) return [min];
  const ticks: number[] = [];
  for (let i = 0; i < Y_TICKS; i++) {
    ticks.push(min + ((max - min) * i) / (Y_TICKS - 1));
  }
  return ticks;
}

/** Compact label for a tick value: integers as-is, else 1 decimal. */
const tickLabel = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

const DEFAULT_DATA = [52, 40, 30, 28, 38, 56, 80, 104, 116, 118, 108, 90, 76, 66, 60, 58];
const DEFAULT_AXIS = ['9am', '12pm', '3pm', '6pm', '9pm'];

/** Map a series to viewBox points on an EXPLICIT y-scale (min/span), spreading x
 *  evenly across the padded inner width [PAD_X, VB_W−PAD_X]. `n` is the index span
 *  used for x positioning — pass the primary data length so a band's points align
 *  column-for-column with the data. Inverted (max → top, min → bottom). */
function mapPoints(
  values: number[],
  n: number,
  height: number,
  min: number,
  span: number,
): Array<[number, number]> {
  if (values.length === 0) return [];
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const innerW = VB_W - PAD_X * 2;
  return values.map((v, i) => {
    const x = n === 1 ? VB_W / 2 : PAD_X + (i / (n - 1)) * innerW;
    const t = (v - min) / span; // 0 at min, 1 at max
    const y = bottom - t * (bottom - top); // max → top, min → bottom
    return [x, y];
  });
}

/** Round a number for compact path strings. */
const r = (n: number) => Math.round(n * 100) / 100;

/** Straight polyline through the points. */
function linePath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r(x)},${r(y)}`).join(' ');
}

/** Catmull-Rom spline expressed as cubic béziers — a smooth curve passing
 *  through every point (endpoints duplicated so the ends stay anchored). */
function smoothPath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n < 3) return linePath(pts);
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    // Catmull-Rom → Bézier control points (tension = 1/6)
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${r(c1x)},${r(c1y)} ${r(c2x)},${r(c2y)} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

/** LineChart — a generic line/area chart primitive: a smooth (Catmull-Rom) or
 *  straight gradient/solid line over a faint area fill and horizontal grid, with
 *  optional round overlay marker dots + label tags and an x-axis row. The Svg
 *  stretches to the measured container width via a fixed viewBox + non-uniform
 *  scaling; markers are absolutely-positioned Views placed by percentage so they
 *  stay perfectly round. */
export function LineChart({
  data = DEFAULT_DATA,
  axis = DEFAULT_AXIS,
  color = colors.mint,
  gradient,
  area = true,
  smooth = true,
  height = 180,
  markers,
  grid = true,
  yAxis = false,
  yTicks,
  band,
  dashedFromIndex,
  style,
}: LineChartProps) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  // y-scale: by default spans the data's own min..max (byte-for-byte unchanged).
  // When a band is present, expand the scale to span data ∪ band.upper ∪ band.lower
  // so the ribbon never clips — and share that one scale across line/band/ticks.
  const hasBand = !!band && band.upper.length > 0 && band.lower.length > 0;
  const scaleVals = hasBand ? [...data, ...band!.upper, ...band!.lower] : data;
  const dMin = scaleVals.length ? Math.min(...scaleVals) : 0;
  const dMax = scaleVals.length ? Math.max(...scaleVals) : 0;
  const dSpan = dMax - dMin || 1;

  const pts = mapPoints(data, data.length, height, dMin, dSpan);
  const line = smooth ? smoothPath(pts) : linePath(pts);
  // close the line down to the floor for the area fill — drop straight down from
  // the last/first points (which are inset by PAD_X) so the fill stays aligned.
  const firstX = pts.length ? r(pts[0][0]) : 0;
  const lastX = pts.length ? r(pts[pts.length - 1][0]) : 0;
  const areaPath = line ? `${line} L${lastX},${height} L${firstX},${height} Z` : '';

  // split the line into a solid head + dashed forecast tail at dashedFromIndex
  // (the boundary point is included in BOTH segments so they join seamlessly).
  const splitAt =
    dashedFromIndex != null && dashedFromIndex > 0 && dashedFromIndex < pts.length - 1
      ? dashedFromIndex
      : null;
  const solidPts = splitAt != null ? pts.slice(0, splitAt + 1) : pts;
  const dashPts = splitAt != null ? pts.slice(splitAt) : [];
  const solidLine = splitAt != null ? (smooth ? smoothPath(solidPts) : linePath(solidPts)) : line;
  const dashLine = splitAt != null ? (smooth ? smoothPath(dashPts) : linePath(dashPts)) : '';

  // uncertainty ribbon: upper series left→right then lower series right→left,
  // closed into a filled area — mapped through the SAME shared scale as the line.
  const bandUpperPts = hasBand ? mapPoints(band!.upper, data.length, height, dMin, dSpan) : [];
  const bandLowerPts = hasBand ? mapPoints(band!.lower, data.length, height, dMin, dSpan) : [];
  const bandPath =
    hasBand && bandUpperPts.length > 0 && bandLowerPts.length > 0
      ? `${linePath(bandUpperPts)} ${bandLowerPts
          .slice()
          .reverse()
          .map(([x, y]) => `L${r(x)},${r(y)}`)
          .join(' ')} Z`
      : '';
  const bandFill = band?.color ?? color;

  const useGradient = Array.isArray(gradient) && gradient.length >= 2;
  const stroke = useGradient ? 'url(#lk-lc-stroke)' : color;
  const ticks = yAxis ? (yTicks && yTicks.length > 0 ? yTicks : deriveTicks(dMin, dMax)) : [];
  const tickRows = ticks.map((v) => ({ v, y: valueToY(v, dMin, dSpan, height) }));

  // the drawing area shrinks by the gutter width when the y-axis is on, so the
  // line/markers stay in lock-step with the value labels (the line still uses
  // the full data range — only the rendered width changes).
  const canvasW = yAxis ? Math.max(0, width - Y_GUTTER) : width;

  // interior gridline y-positions — align with the ticks when the y-axis is on,
  // otherwise the evenly-spaced default interior lines.
  let gridYs: number[] = [];
  if (grid) {
    if (yAxis && tickRows.length > 0) {
      gridYs = tickRows.map((t) => t.y);
    } else {
      for (let i = 1; i <= GRID_LINES; i++) {
        gridYs.push((height / (GRID_LINES + 1)) * i);
      }
    }
  }

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.plot, { height }]} onLayout={onLayout}>
        <View style={[styles.canvas, { width: canvasW }]}>
        {canvasW > 0 && (
          <Svg
            width={canvasW}
            height={height}
            viewBox={`0 0 ${VB_W} ${height}`}
            preserveAspectRatio="none"
          >
            <Defs>
              {useGradient && (
                <LinearGradient id="lk-lc-stroke" x1="0" y1="0" x2={VB_W} y2="0" gradientUnits="userSpaceOnUse">
                  {gradient!.map((stop, i) => (
                    <Stop key={i} offset={gradient!.length === 1 ? 0 : i / (gradient!.length - 1)} stopColor={stop} />
                  ))}
                </LinearGradient>
              )}
              <LinearGradient id="lk-lc-fill" x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={color} stopOpacity={0.26} />
                <Stop offset="1" stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {/* faint horizontal gridlines */}
            {gridYs.map((gy) => (
              <Line key={gy} x1={0} y1={r(gy)} x2={VB_W} y2={r(gy)} stroke={colors.border} strokeWidth={1} opacity={0.6} />
            ))}

            {/* uncertainty ribbon — drawn BEHIND the area fill, line and markers */}
            {bandPath ? (
              <Path d={bandPath} fill={bandFill} fillOpacity={0.14} stroke="none" />
            ) : null}

            {/* area fill under the line */}
            {area && areaPath ? <Path d={areaPath} fill="url(#lk-lc-fill)" /> : null}

            {/* the line itself — split into a solid head + dashed forecast tail
                when dashedFromIndex is set; one continuous path otherwise */}
            {solidLine ? (
              <Path
                d={solidLine}
                fill="none"
                stroke={stroke}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
            {dashLine ? (
              <Path
                d={dashLine}
                fill="none"
                stroke={stroke}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 6"
                opacity={0.85}
              />
            ) : null}
          </Svg>
        )}

        {/* round marker overlays — positioned by % so they stay circular */}
        {markers?.map((m, i) => {
          const pt = pts[m.index];
          if (!pt) return null;
          const left = `${(pt[0] / VB_W) * 100}%` as DimensionValue;
          const top = `${(pt[1] / height) * 100}%` as DimensionValue;
          const dot = m.color ?? color;
          return (
            <View key={i} style={[styles.marker, { left, top }]} pointerEvents="none">
              {m.label ? (
                <View style={[styles.tag, { borderColor: dot }]}>
                  <Text style={[styles.tagText, { color: dot }]}>{m.label}</Text>
                </View>
              ) : null}
              <View style={[styles.dot, { backgroundColor: dot }]} />
            </View>
          );
        })}
        </View>

        {/* y-axis value labels, pinned in the right gutter at each tick's y */}
        {yAxis && tickRows.length > 0 ? (
          <View style={styles.yaxis} pointerEvents="none">
            {tickRows.map((t, i) => (
              <Text
                key={i}
                style={[styles.ytick, { top: `${(t.y / height) * 100}%` as DimensionValue }]}
                numberOfLines={1}
              >
                {tickLabel(t.v)}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      {axis && axis.length > 0 && (
        <View style={[styles.axis, yAxis ? { paddingRight: Y_GUTTER } : null]}>
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
  // drawing area: holds the Svg + marker overlays; markers anchor against it
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
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: colors.glass2,
  },
  tagText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0.36,
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
