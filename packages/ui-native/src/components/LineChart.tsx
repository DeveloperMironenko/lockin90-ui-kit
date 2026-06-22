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

const DEFAULT_DATA = [52, 40, 30, 28, 38, 56, 80, 104, 116, 118, 108, 90, 76, 66, 60, 58];
const DEFAULT_AXIS = ['9am', '12pm', '3pm', '6pm', '9pm'];

/** Map data values to viewBox points. Auto-scales y into [PAD_Y, height−PAD_Y]
 *  (inverted, since SVG y grows downward) and spreads x evenly across the padded
 *  inner width [PAD_X, VB_W−PAD_X] so endpoints/markers don't clip at the edges. */
function toPoints(data: number[], height: number): Array<[number, number]> {
  const n = data.length;
  if (n === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1; // avoid /0 when flat
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const innerW = VB_W - PAD_X * 2;
  return data.map((v, i) => {
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
  style,
}: LineChartProps) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const pts = toPoints(data, height);
  const line = smooth ? smoothPath(pts) : linePath(pts);
  // close the line down to the floor for the area fill — drop straight down from
  // the last/first points (which are inset by PAD_X) so the fill stays aligned.
  const firstX = pts.length ? r(pts[0][0]) : 0;
  const lastX = pts.length ? r(pts[pts.length - 1][0]) : 0;
  const areaPath = line ? `${line} L${lastX},${height} L${firstX},${height} Z` : '';

  const useGradient = Array.isArray(gradient) && gradient.length >= 2;
  const stroke = useGradient ? 'url(#lk-lc-stroke)' : color;

  // interior gridline y-positions
  const gridYs: number[] = [];
  if (grid) {
    for (let i = 1; i <= GRID_LINES; i++) {
      gridYs.push((height / (GRID_LINES + 1)) * i);
    }
  }

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.plot, { height }]} onLayout={onLayout}>
        {width > 0 && (
          <Svg
            width={width}
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

            {/* area fill under the line */}
            {area && areaPath ? <Path d={areaPath} fill="url(#lk-lc-fill)" /> : null}

            {/* the line itself */}
            {line ? (
              <Path
                d={line}
                fill="none"
                stroke={stroke}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
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

      {axis && axis.length > 0 && (
        <View style={styles.axis}>
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
  plot: { position: 'relative', width: '100%' },
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
