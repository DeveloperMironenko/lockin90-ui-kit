import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** A colored phase band on the 24h ring, drawn CLOCKWISE from `from` to `to`
 *  (hours 0..24). When `from > to` the band wraps through midnight (e.g. 23→7). */
export interface PhaseArc {
  /** band start hour, 0..24 */
  from: number;
  /** band end hour, 0..24 (clockwise from `from`; wraps midnight when < `from`) */
  to: number;
  /** the band color — a hex/rgb color string */
  color: string;
  /** optional label (for accessibility / external legends) */
  label?: string;
}

/** A point marker sitting ON the ring at a given hour. */
export interface PhaseMarker {
  /** the hour, 0..24 */
  at: number;
  /** the dot color — a hex/rgb color string (default the accent token) */
  color?: string;
  /** optional tiny label, placed just outside the ring */
  label?: string;
}

export interface PhaseWheelProps {
  /** colored phase bands on the ring */
  arcs?: PhaseArc[];
  /** point markers on the ring */
  markers?: PhaseMarker[];
  /** the "now" hour, 0..24 → draws a hand from center to the ring + a tip dot.
   *  Pass `null` to hide the hand (omitting it keeps the default). */
  now?: number | null;
  /** overall diameter in px (default 200) */
  size?: number;
  /** ring stroke width in px (default 16) */
  thickness?: number;
  /** hour tick marks around the ring, longer + brighter at 0/6/12/18 (default true) */
  hourTicks?: boolean;
  /** center content — defaults to the formatted `now` clock, or '24h' when no `now` */
  children?: ReactNode;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/** Default circadian phases. */
const DEFAULT_ARCS: PhaseArc[] = [
  { from: 23, to: 7, color: '#6E7BFF', label: 'Sleep' }, // indigo, wraps midnight
  { from: 9, to: 12, color: '#34F5C5', label: 'Peak focus' }, // mint
  { from: 14, to: 16, color: '#FFB020', label: 'Afternoon dip' }, // warn
  { from: 21, to: 23, color: '#A855F7', label: 'Wind-down' }, // violet
];

const DEFAULT_MARKERS: PhaseMarker[] = [
  { at: 7, color: '#22D3EE', label: 'Wake' },
  { at: 21, color: '#A855F7', label: 'Melatonin' },
];

/** clockwise span of an arc in hours, wrap-aware (from > to wraps midnight). */
function arcSpanHours(from: number, to: number) {
  return ((to - from + 24) % 24) || 24;
}

/** point on a circle at center `c` radius `r` for hour `h` (0..24), with hour 0
 *  at the top (12 o'clock) and growing clockwise. */
function hourPoint(c: number, r: number, h: number) {
  const deg = (h / 24) * 360 - 90;
  const a = (deg * Math.PI) / 180;
  return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
}

/** Format an hour (0..24, may be fractional) as a 12h clock like '2:30p'
 *  (a/p suffix, drops ':00'). */
function formatHour(h: number): string {
  const norm = ((h % 24) + 24) % 24;
  const totalMin = Math.round(norm * 60) % (24 * 60);
  const hr = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  const suffix = hr >= 12 ? 'p' : 'a';
  let h12 = hr % 12;
  if (h12 === 0) h12 = 12;
  return min === 0 ? `${h12}${suffix}` : `${h12}:${String(min).padStart(2, '0')}${suffix}`;
}

/** The four cardinal hour labels at 0/6/12/18. */
const CARDINALS: { h: number; label: string }[] = [
  { h: 0, label: '12a' },
  { h: 6, label: '6a' },
  { h: 12, label: '12p' },
  { h: 18, label: '6p' },
];

/**
 * PhaseWheel — a circular 24-hour circadian clock: a faint full track ring with
 * colored phase bands (sleep / focus / dip / wind-down), hour ticks (longer +
 * brighter at the quarters with cardinal labels), point markers on the ring, an
 * optional "now" hand from center to the ring, and centered content (the
 * formatted current time or '24h'). Hour 0 (midnight) sits at the top and time
 * runs clockwise. Tokens-driven.
 */
export function PhaseWheel({
  arcs = DEFAULT_ARCS,
  markers = DEFAULT_MARKERS,
  now = 14.5,
  size = 200,
  thickness = 16,
  hourTicks = true,
  children,
  style,
}: PhaseWheelProps) {
  // RN SVG hard-clips at its bounds (no overflow:visible), so pad the canvas
  // out so cardinal + marker labels that sit OUTSIDE the ring aren't cut off.
  const PAD = 46;
  const canvas = size + PAD * 2;
  const c = canvas / 2;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;

  // tick geometry (just outside the ring)
  const tickBase = r + thickness / 2 + 2;
  const tickMinor = tickBase + 3;
  const tickMajor = tickBase + 6;
  const labelRadius = tickMajor + 14;
  // marker label radius (outside the ring)
  const markerLabelRadius = r + thickness / 2 + 16;

  // `now` is hidden when null/undefined; precompute the hand tip + clock label
  const nowTip = now != null ? hourPoint(c, r, now) : null;
  const nowLabel = now != null ? formatHour(now) : null;

  return (
    <View style={[styles.root, { width: canvas, height: canvas }, style]}>
      <Svg width={canvas} height={canvas} viewBox={`0 0 ${canvas} ${canvas}`}>
        {/* rotated group so fraction-of-circle hours start at 12 o'clock, clockwise */}
        <G origin={`${c}, ${c}`} rotation={-90}>
          {/* faint full track ring */}
          <Circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={thickness}
            strokeLinecap="round"
          />
          {/* colored phase bands */}
          {arcs.map((a, i) => {
            const span = arcSpanHours(a.from, a.to);
            const len = (span / 24) * circ;
            if (len <= 0) return null;
            const offset = -(a.from / 24) * circ;
            return (
              <Circle
                key={`${a.label ?? 'arc'}-${i}`}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={a.color}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={[len, circ - len]}
                strokeDashoffset={offset}
              />
            );
          })}
        </G>

        {/* hour ticks (drawn in screen space via hourPoint, no rotated group) */}
        {hourTicks
          ? Array.from({ length: 24 }, (_, h) => {
              const major = h % 6 === 0;
              const outer = major ? tickMajor : tickMinor;
              const p1 = hourPoint(c, tickBase, h);
              const p2 = hourPoint(c, outer, h);
              return (
                <Line
                  key={`tick-${h}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={major ? colors.textDim : colors.border2}
                  strokeWidth={major ? 2 : 1.5}
                  strokeLinecap="round"
                />
              );
            })
          : null}

        {/* cardinal labels at 0/6/12/18 */}
        {hourTicks
          ? CARDINALS.map(({ h, label }) => {
              const p = hourPoint(c, labelRadius, h);
              return (
                <SvgText
                  key={`card-${h}`}
                  x={p.x}
                  y={p.y}
                  fill={colors.textDim}
                  fontFamily={fonts.mono}
                  fontSize={9}
                  textAnchor="middle"
                  alignmentBaseline="central"
                >
                  {label}
                </SvgText>
              );
            })
          : null}

        {/* now hand — line from center to the inner edge of the ring + tip dot */}
        {nowTip ? (
          <G>
            <Line
              x1={c}
              y1={c}
              x2={nowTip.x}
              y2={nowTip.y}
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.85}
            />
            <Circle cx={nowTip.x} cy={nowTip.y} r={4} fill={colors.text} />
          </G>
        ) : null}

        {/* markers — dots on the ring + optional labels just outside */}
        {markers.map((m, i) => {
          const p = hourPoint(c, r, m.at);
          const color = m.color ?? colors.accent;
          const lp = m.label ? hourPoint(c, markerLabelRadius, m.at) : null;
          return (
            <G key={`mk-${m.label ?? 'm'}-${i}`}>
              <Circle cx={p.x} cy={p.y} r={4} fill={color} />
              {lp ? (
                <SvgText
                  x={lp.x}
                  y={lp.y}
                  fill={colors.textFaint}
                  fontFamily={fonts.mono}
                  fontSize={9}
                  textAnchor="middle"
                  alignmentBaseline="central"
                >
                  {m.label}
                </SvgText>
              ) : null}
            </G>
          );
        })}
      </Svg>

      <View style={styles.center} pointerEvents="none">
        {children ?? <Text style={styles.clock}>{nowLabel ?? '24h'}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  center: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  clock: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: -0.5,
    color: colors.text,
    textAlign: 'center',
  },
});
