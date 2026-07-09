import { useId, type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Line, Circle, Defs, FeGaussianBlur, Filter, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** Zone verdict color for a normalized 0..1 value (catalog thresholds). */
function zoneColor01(t: number): string {
  return t >= 0.62 ? colors.zoneHigh : t >= 0.38 ? colors.zoneMid : colors.zoneLow;
}

/** A colored band on the [min,max] scale, filled up to its `to` value. Bands
 *  are stacked low→high; each paints from the previous band's `to` up to its
 *  own. */
export interface GaugeZone {
  /** upper bound of this band on the [min,max] scale */
  to: number;
  /** the band color — a hex/rgb color string */
  color: string;
}

export interface GaugeProps {
  /** the current value, clamped to [min,max] */
  value: number;
  /** scale floor (default 0) */
  min?: number;
  /** scale ceiling (default 100) */
  max?: number;
  /** overall square box size in px (default 140) */
  size?: number;
  /** arc stroke width in px (default 12) */
  thickness?: number;
  /** total sweep in degrees, opening at bottom-center (default 270) */
  sweep?: number;
  /** colored zone bands up to each `to` on the [min,max] scale. When omitted a
   *  single accent progress arc to `value` is drawn over the track. */
  zones?: GaugeZone[];
  /** value-arc color (default `colors.accent`). Ignored when a `gradient`
   *  array is given or `zone` is on. */
  color?: string;
  /** value-arc gradient along the sweep (left → right). An array (≥2) paints N
   *  evenly-spaced gradient stops — e.g. `[colors.zoneLow, colors.zoneMid,
   *  colors.zoneHigh]` is the DN-13 red→amber→green strain gauge; a single
   *  string is treated like a solid `color`. */
  gradient?: string | string[];
  /** color the value arc + readout by the value's zone verdict on the
   *  [min,max] scale (≥62% → high, ≥38% → mid, else low). */
  zone?: boolean;
  /** glow underlay — a Gaussian-blurred duplicate of the value arc (the
   *  catalog's shine modifier; off by default). */
  shine?: boolean;
  /** number of tick marks along the arc (default 0 = off) */
  ticks?: number;
  /** tick placement: `span` straddles the arc (default, legacy) · `out` sits
   *  just outside it (DN-13 gauge-270 look). `out` shrinks the arc radius by
   *  8px so the outer ticks fit the viewBox (native SVG clips). */
  tickPosition?: 'span' | 'out';
  /** draw the end-cap dot at the current value (default true) */
  cap?: boolean;
  /** small caption under the value */
  label?: string;
  /** show the numeric value readout (default true) */
  showValue?: boolean;
  /** override the centered content (replaces value + label) */
  children?: ReactNode;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/** point on a circle at `cx,cy` radius `r` for screen-angle `deg`
 *  (0° = 3 o'clock, growing clockwise). */
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** SVG arc path from `startDeg` to `endDeg` (clockwise) on a circle. */
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/**
 * Gauge — an arc/dial primitive: a partial-circle track (default 270° sweep,
 * open at the bottom-center) showing a `value` on a [min,max] scale. Supports
 * colored `zones` bands (low/mid/high), a progress arc + round end cap to the
 * current value, optional `ticks`, and a centered value/label readout. Covers
 * the catalog gauges: DN-13 `gauge-270` (`gradient` + `ticks` +
 * `tickPosition="out"`) and DN-14 `half-gauge` (`sweep={180}`). Distinct
 * from `Ring` (a full-circle 0–100 single-color progress); Gauge adds an
 * arbitrary sweep, a min/max scale, multi-zone bands and ticks.
 */
export function Gauge({
  value,
  min = 0,
  max = 100,
  size = 140,
  thickness = 12,
  sweep = 270,
  zones,
  color,
  gradient,
  zone = false,
  shine = false,
  ticks = 0,
  tickPosition = 'span',
  cap = true,
  label,
  showValue = true,
  children,
  style,
}: GaugeProps) {
  const uid = useId();
  const gradId = `lk-gauge-grad-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;

  const span = max - min || 1;
  const sw = Math.max(0, Math.min(360, sweep));
  const v = Math.max(min, Math.min(max, value));

  const cx = size / 2;
  const cy = size / 2;
  // reserve room for outside ticks — native SVG clips at the viewBox
  const outPad = tickPosition === 'out' ? 8 : 0;
  const r = (size - thickness) / 2 - outPad;

  // value-arc paint: zone verdict > N-stop gradient > single color > accent
  const t01 = (v - min) / span;
  const useGradient = Array.isArray(gradient) && !zone;
  const solid = zone
    ? zoneColor01(t01)
    : typeof gradient === 'string'
      ? gradient
      : (color ?? colors.accent);
  const arcStroke = useGradient ? `url(#${gradId})` : solid;
  // cap tint follows the arc (gradient → its last stop, where the arc ends)
  const capColor = useGradient ? gradient[gradient.length - 1]! : solid;

  // The gap is centered at the bottom (screen-angle 90°). The arc starts to the
  // left of bottom and sweeps clockwise over the top to the right of bottom.
  const startDeg = 90 + (360 - sw) / 2;
  const endDeg = startDeg + sw;
  /** map a [min,max] value to its screen-angle along the sweep */
  const toAngle = (val: number) => startDeg + ((val - min) / span) * sw;

  const hasZones = Array.isArray(zones) && zones.length > 0;

  // zone band arcs, stacked low→high from `min`
  const bands = hasZones
    ? zones!
        .slice()
        .sort((a, b) => a.to - b.to)
        .reduce<{ from: number; to: number; color: string }[]>((acc, z) => {
          const prev = acc.length ? acc[acc.length - 1]!.to : min;
          const to = Math.max(min, Math.min(max, z.to));
          if (to > prev) acc.push({ from: prev, to, color: z.color });
          return acc;
        }, [])
    : [];

  // tick angles evenly spaced across the sweep (inclusive of both ends)
  const tickMarks: number[] = [];
  if (ticks > 0) {
    const n = ticks;
    for (let i = 0; i < n; i++) {
      tickMarks.push(startDeg + (n === 1 ? 0 : (i / (n - 1)) * sw));
    }
  }
  // `span` straddles the arc (legacy); `out` sits just past its outer edge (DN-13)
  const tickOuter = r + thickness / 2 + (tickPosition === 'out' ? 7.5 : 2);
  const tickInner = tickPosition === 'out' ? r + thickness / 2 + 2.5 : r - thickness / 2 - 2;

  const valueAngle = toAngle(v);
  const capPt = polar(cx, cy, r, valueAngle);

  return (
    <View style={[styles.root, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {useGradient ? (
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              {gradient.map((stopColor, i) => (
                <Stop
                  key={i}
                  offset={i / Math.max(1, gradient.length - 1)}
                  stopColor={stopColor}
                />
              ))}
            </LinearGradient>
          </Defs>
        ) : null}
        {shine && !hasZones ? (
          /* real Gaussian blur for the shine (Fabric-native in react-native-svg 15) —
             the native twin of the web value arc's `blur(6px)` underlay. Region in
             user space so short/flat arcs never clip the blur to their bbox. */
          <Defs>
            <Filter
              id={`${gradId}-blur`}
              filterUnits="userSpaceOnUse"
              x={-12}
              y={-12}
              width={size + 24}
              height={size + 24}
            >
              <FeGaussianBlur stdDeviation={3} />
            </Filter>
          </Defs>
        ) : null}

        {/* track — the full sweep, faint */}
        <Path
          d={arcPath(cx, cy, r, startDeg, endDeg)}
          fill="none"
          stroke={colors.border}
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        {/* zone bands (when provided) */}
        {bands.map((b, i) => (
          <Path
            key={`band-${i}`}
            d={arcPath(cx, cy, r, toAngle(b.from), toAngle(b.to))}
            fill="none"
            stroke={b.color}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        ))}

        {/* shine — a Gaussian-blurred duplicate of the value arc behind it: the
            same soft glow the web arc gets from its `blur(6px)` underlay.
            (Discrete "feather" copies read as banded outlines on device.) */}
        {shine && !hasZones && v > min ? (
          <Path
            d={arcPath(cx, cy, r, startDeg, valueAngle)}
            fill="none"
            stroke={arcStroke}
            strokeWidth={thickness + 5}
            strokeOpacity={0.5}
            strokeLinecap="round"
            filter={`url(#${gradId}-blur)`}
          />
        ) : null}

        {/* progress arc to value — only when there are no zones */}
        {!hasZones && v > min ? (
          <Path
            d={arcPath(cx, cy, r, startDeg, valueAngle)}
            fill="none"
            stroke={arcStroke}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        ) : null}

        {/* ticks */}
        {tickMarks.map((deg, i) => {
          const a = polar(cx, cy, tickOuter, deg);
          const b = polar(cx, cy, tickInner, deg);
          return (
            <Line
              key={`tick-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={colors.textFaint}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* end cap — a dot marking the current value on the arc */}
        {cap && v > min ? (
          <Circle
            cx={capPt.x}
            cy={capPt.y}
            r={thickness / 2 + 1}
            fill={colors.text}
            stroke={capColor}
            strokeWidth={2}
          />
        ) : null}
      </Svg>

      <View style={styles.center} pointerEvents="none">
        {children ?? (
          <>
            {showValue ? (
              <Text style={[styles.value, zone ? { color: solid } : null]}>
                {Math.round(v)}
              </Text>
            ) : null}
            {label ? <Text style={styles.label}>{label}</Text> : null}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  value: {
    fontFamily: fonts.display,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 34,
    fontSize: 34,
    color: colors.text,
    textAlign: 'center',
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textFaint,
    textAlign: 'center',
  },
});
