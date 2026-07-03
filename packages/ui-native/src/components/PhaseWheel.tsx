import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts, radii } from '@lockin90/tokens';

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

/** One phase of a cycle (the cycle variants) — phases run consecutively from
 *  day 1, each `days` long, so the wheel/strip total is the sum of `days`. */
export interface CyclePhase {
  /** phase name — legend, center readout + coach pill (rendered UPPERCASE) */
  name: string;
  /** phase length in days */
  days: number;
  /** the phase color — a hex/rgb color string */
  color: string;
}

/** Chart form. `'circadian'` (default) is the original 24h clock; the cycle
 *  variants are the CW catalog forms (28-day cycle wheel / coach wheel / strip). */
export type PhaseWheelVariant = 'circadian' | 'phase-wheel' | 'coach-wheel' | 'phase-strip';

export interface PhaseWheelProps {
  /** chart form (default `'circadian'` — the 24h clock, unchanged) */
  variant?: PhaseWheelVariant;
  /** [circadian] colored phase bands on the ring */
  arcs?: PhaseArc[];
  /** [circadian] point markers on the ring */
  markers?: PhaseMarker[];
  /** [circadian] the "now" hour, 0..24 → draws a hand from center to the ring + a tip dot.
   *  Pass `null` to hide the hand (omitting it keeps the default). */
  now?: number | null;
  /** overall diameter in px (default 200; ignored by `phase-strip`) */
  size?: number;
  /** ring stroke width in px (default 16; ignored by `phase-strip`) */
  thickness?: number;
  /** [circadian] hour tick marks around the ring, longer + brighter at 0/6/12/18 (default true) */
  hourTicks?: boolean;
  /** [cycle] consecutive cycle phases (default: Menstrual 5 coral / Follicular 8
   *  cyan / Ovulation 3 lime / Luteal 12 violet — the 28-day catalog cycle) */
  phases?: CyclePhase[];
  /** [cycle] current cycle day, 1-based → today dot (wheels) / TODAY rule
   *  (strip) + center readout. Pass `null` to hide (center falls back to the
   *  cycle length, e.g. '28d'). Default 21. */
  day?: number | null;
  /** [phase-wheel · coach-wheel] FOCUS state: the named phase stays full-strength,
   *  the others dim to 20% and the center shows days left in it (needs `day`).
   *  Matched case-insensitively against `phases[].name`. */
  focusPhase?: string;
  /** [coach-wheel] recommendation text — the pill reads "<PHASE> — <TIP>"
   *  (default 'lower intensity, more sleep') */
  tip?: string;
  /** [phase-wheel · coach-wheel] phase legend beside the wheel
   *  (default: true for `'phase-wheel'`, false otherwise) */
  legend?: boolean;
  /** [phase-wheel · coach-wheel] soft glow behind the phase arcs (default false).
   *  Rendered as a wider faint duplicate arc — never an SVG filter. */
  shine?: boolean;
  /** [phase-strip] total strip width in px (default 300) */
  width?: number;
  /** center content — defaults to the formatted `now` clock / cycle-day readout */
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

/** Default 28-day cycle (the catalog's PH table). */
const DEFAULT_PHASES: CyclePhase[] = [
  { name: 'Menstrual', days: 5, color: colors.zoneLow }, // coral
  { name: 'Follicular', days: 8, color: colors.cyan },
  { name: 'Ovulation', days: 3, color: colors.lime },
  { name: 'Luteal', days: 12, color: colors.violet },
];

const DEFAULT_TIP = 'lower intensity, more sleep';

/** angular gap (deg) trimmed off EACH end of a cycle phase arc */
const ARC_GAP_DEG = 2.5;

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

/** point on a circle for an angle in degrees, 0° at 12 o'clock, clockwise. */
function polarPoint(cx: number, cy: number, r: number, aDeg: number) {
  const a = ((aDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** SVG arc path from `a0` to `a1` degrees (0° at top, clockwise). */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = polarPoint(cx, cy, r, a0);
  const p1 = polarPoint(cx, cy, r, a1);
  const large = (a1 - a0) % 360 > 180 ? 1 : 0;
  return `M${p0.x.toFixed(2)} ${p0.y.toFixed(2)}A${r} ${r} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}

/** A cycle phase resolved to its 1-based inclusive day range. */
interface PhaseRange extends CyclePhase {
  start: number;
  end: number;
}

/** Lay the phases end-to-end from day 1 → `{ ranges, total }`. */
function phaseRanges(phases: CyclePhase[]): { ranges: PhaseRange[]; total: number } {
  let start = 1;
  const ranges = phases.map((p) => {
    const r = { ...p, start, end: start + p.days - 1 };
    start += p.days;
    return r;
  });
  return { ranges, total: Math.max(1, start - 1) };
}

/** angle (deg, 0° at top, clockwise) where cycle day `d` STARTS */
function dayAngle(d: number, total: number) {
  return ((d - 1) / total) * 360;
}

/** the D-tick days of a strip: D1, every 7th day, and the last day. */
function stripTicks(total: number): number[] {
  const ticks = [1];
  for (let d = 7; d <= total; d += 7) ticks.push(d);
  if (ticks[ticks.length - 1] !== total) ticks.push(total);
  return ticks;
}

/** Append an alpha byte to a 6-digit hex token (pass-through otherwise). */
function withAlpha(color: string, alphaHex: string) {
  return /^#[0-9a-fA-F]{6}$/.test(color) ? `${color}${alphaHex}` : color;
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
 * PhaseWheel — the kit's phase-cycle chart.
 *
 * Default (`variant="circadian"`): a circular 24-hour circadian clock — a faint
 * full track ring with colored phase bands (sleep / focus / dip / wind-down),
 * hour ticks (longer + brighter at the quarters with cardinal labels), point
 * markers on the ring, an optional "now" hand from center to the ring, and
 * centered content (the formatted current time or '24h'). Hour 0 (midnight)
 * sits at the top and time runs clockwise.
 *
 * Cycle variants (the CW catalog):
 * - `'phase-wheel'` (CW-01) — 4 menstrual-cycle phase arcs (coral/cyan/lime/
 *   violet, round caps, gaps), D-labels, a today dot, center day/phase readout
 *   + legend; `focusPhase` dims the other phases to 20% and the center shows
 *   the days left in the focused phase.
 * - `'coach-wheel'` (CW-04) — the wheel + a phase-tinted recommendation pill
 *   under it ("LUTEAL — LOWER INTENSITY, MORE SLEEP").
 * - `'phase-strip'` (CW-05) — the wheel unrolled: phase pills on a linear
 *   28-day strip + TODAY rule + D-ticks.
 *
 * Tokens-driven.
 */
export function PhaseWheel({
  variant = 'circadian',
  arcs = DEFAULT_ARCS,
  markers = DEFAULT_MARKERS,
  now = 14.5,
  size = 200,
  thickness = 16,
  hourTicks = true,
  phases = DEFAULT_PHASES,
  day = 21,
  focusPhase,
  tip = DEFAULT_TIP,
  legend,
  shine = false,
  width = 300,
  children,
  style,
}: PhaseWheelProps) {
  /* ---------------------------------------------------------------- cycle */
  if (variant !== 'circadian') {
    const { ranges, total } = phaseRanges(phases);
    const cday = day == null ? null : Math.min(Math.max(Math.round(day), 1), total);
    const currentPhase =
      cday !== null ? ranges.find((r) => cday >= r.start && cday <= r.end) : undefined;
    const phasesLabel = ranges.map((r) => `${r.name} D${r.start}–${r.end}`).join(', ');

    /* ------------------------------------------------------ CW-05 strip */
    if (variant === 'phase-strip') {
      const stripH = 76;
      const y = 44; // pill row center
      const x0 = 8;
      const ww = width - 16;
      const tagLabel = cday !== null ? `TODAY · D${cday}` : null;
      const tagW = tagLabel ? tagLabel.length * 5.35 + 12 : 0;
      const tx = cday !== null ? x0 + (ww * (cday - 0.5)) / total : 0;
      const tagX = tagLabel ? Math.max(2, Math.min(tx - tagW / 2, width - tagW - 2)) : 0;
      const todayColor = currentPhase?.color ?? colors.violet;
      const a11y = `${total}-day cycle strip${
        cday !== null ? `, day ${cday}${currentPhase ? ` (${currentPhase.name})` : ''}` : ''
      }: ${phasesLabel}.`;

      return (
        <View
          style={[styles.stripRoot, { width }, style]}
          accessibilityRole="image"
          accessibilityLabel={a11y}
        >
          <Svg width={width} height={stripH} viewBox={`0 0 ${width} ${stripH}`}>
            {/* phase pills */}
            {ranges.map((r) => {
              const xs = x0 + (ww * (r.start - 1)) / total;
              const xe = x0 + (ww * r.end) / total;
              const w = xe - xs - 2;
              if (w <= 0) return null;
              return (
                <G key={r.name}>
                  <Rect
                    x={xs}
                    y={y - 8}
                    width={w}
                    height={16}
                    rx={8}
                    fill={r.color}
                    opacity={0.8}
                  />
                  {w > 52 ? (
                    <SvgText
                      x={(xs + xe) / 2}
                      y={y}
                      fill={colors.bg0}
                      fontFamily={fonts.mono}
                      fontSize={9}
                      textAnchor="middle"
                      alignmentBaseline="central"
                    >
                      {r.name.toUpperCase()}
                    </SvgText>
                  ) : null}
                </G>
              );
            })}

            {/* D-ticks under the strip */}
            {stripTicks(total).map((d) => (
              <SvgText
                key={`tick-${d}`}
                x={x0 + (ww * (d - 0.5)) / total}
                y={y + 21}
                fill={colors.textFaint}
                fontFamily={fonts.mono}
                fontSize={9}
                textAnchor="middle"
                alignmentBaseline="central"
              >
                {`D${d}`}
              </SvgText>
            ))}

            {/* TODAY rule + tag */}
            {tagLabel ? (
              <G>
                <Line
                  x1={tx}
                  x2={tx}
                  y1={y - 18}
                  y2={y + 12}
                  stroke={colors.text}
                  strokeOpacity={0.4}
                  strokeWidth={1.2}
                />
                <Rect
                  x={tagX}
                  y={y - 26 - 6.5}
                  width={tagW}
                  height={13}
                  rx={6.5}
                  fill={colors.bg0}
                  fillOpacity={0.78}
                  stroke={todayColor}
                  strokeOpacity={0.35}
                  strokeWidth={0.8}
                />
                <SvgText
                  x={tagX + tagW / 2}
                  y={y - 26}
                  fill={todayColor}
                  fontFamily={fonts.mono}
                  fontSize={8}
                  textAnchor="middle"
                  alignmentBaseline="central"
                >
                  {tagLabel}
                </SvgText>
              </G>
            ) : null}
          </Svg>
        </View>
      );
    }

    /* --------------------------------------- CW-01 / CW-04 cycle wheels */
    const showLegend = legend ?? variant === 'phase-wheel';
    // RN SVG hard-clips at its bounds, so pad the canvas for the D-labels.
    const PAD = 16;
    const canvas = size + PAD * 2;
    const c = canvas / 2;
    const r = (size - thickness) / 2;
    const dLabelRadius = r + thickness / 2 + 6;

    const focus =
      focusPhase != null
        ? ranges.find((p) => p.name.toLowerCase() === focusPhase.toLowerCase())
        : undefined;
    const daysLeft = focus && cday !== null ? Math.max(0, focus.end - cday) : null;

    const big =
      daysLeft !== null
        ? `${daysLeft}d`
        : cday !== null
          ? variant === 'coach-wheel'
            ? `D${cday}`
            : `DAY ${cday}`
          : `${total}d`;
    const sub =
      daysLeft !== null && focus
        ? `LEFT · ${focus.name.toUpperCase()}`
        : currentPhase
          ? currentPhase.name.toUpperCase()
          : null;

    const tipText =
      variant === 'coach-wheel'
        ? `${currentPhase ? `${currentPhase.name} — ` : ''}${tip}`.toUpperCase()
        : null;
    const tipColor = currentPhase?.color ?? colors.violet;

    const todayPt = cday !== null ? polarPoint(c, c, r, dayAngle(cday, total)) : null;

    const a11y = `${total}-day cycle wheel${
      cday !== null ? `, day ${cday}${currentPhase ? ` (${currentPhase.name})` : ''}` : ''
    }: ${phasesLabel}.${
      focus && daysLeft !== null ? ` Focus ${focus.name}, ${daysLeft} days left.` : ''
    }${tipText ? ` Coach: ${tipText}.` : ''}`;

    return (
      <View
        style={[styles.cycleRoot, style]}
        accessibilityRole="image"
        accessibilityLabel={a11y}
      >
        <View style={styles.cycleRow}>
          <View style={[styles.dial, { width: canvas, height: canvas }]}>
            <Svg width={canvas} height={canvas} viewBox={`0 0 ${canvas} ${canvas}`}>
              {/* phase arcs — round caps, 2.5° gap trimmed off each end.
                  `shine` = a wider faint duplicate arc behind the real one
                  (no SVG filters on native — Ring precedent). */}
              {ranges.map((p) => {
                const a0 = dayAngle(p.start, total) + ARC_GAP_DEG;
                const a1 = dayAngle(p.end + 1, total) - ARC_GAP_DEG;
                if (a1 <= a0) return null;
                const dimmed = focus != null && focus.name !== p.name;
                const d = arcPath(c, c, r, a0, a1);
                return (
                  <G key={p.name} opacity={dimmed ? 0.2 : 0.9}>
                    {shine ? (
                      <Path
                        d={d}
                        fill="none"
                        stroke={p.color}
                        strokeWidth={thickness + 8}
                        strokeOpacity={0.35}
                        strokeLinecap="round"
                      />
                    ) : null}
                    <Path
                      d={d}
                      fill="none"
                      stroke={p.color}
                      strokeWidth={thickness}
                      strokeLinecap="round"
                    />
                  </G>
                );
              })}

              {/* D-labels every 7 days (D1, D8, …) just outside the ring */}
              {Array.from({ length: Math.ceil(total / 7) }, (_, i) => 1 + i * 7).map((d) => {
                const p = polarPoint(c, c, dLabelRadius, dayAngle(d, total));
                return (
                  <SvgText
                    key={`d-${d}`}
                    x={p.x}
                    y={p.y}
                    fill={colors.textFaint}
                    fontFamily={fonts.mono}
                    fontSize={9}
                    textAnchor="middle"
                    alignmentBaseline="central"
                  >
                    {`D${d}`}
                  </SvgText>
                );
              })}

              {/* today — dot on the ring + static halo (web pulses; native
                  shows a static ring — StatusDot precedent) */}
              {todayPt ? (
                <G>
                  <Circle cx={todayPt.x} cy={todayPt.y} r={4} fill={colors.text} />
                  <Circle
                    cx={todayPt.x}
                    cy={todayPt.y}
                    r={8}
                    fill="none"
                    stroke={colors.text}
                    strokeWidth={1.4}
                    strokeOpacity={0.3}
                  />
                </G>
              ) : null}
            </Svg>

            <View style={styles.center} pointerEvents="none">
              {children ?? (
                <>
                  <Text style={styles.day}>{big}</Text>
                  {sub ? <Text style={styles.daySub}>{sub}</Text> : null}
                </>
              )}
            </View>
          </View>

          {showLegend ? (
            <View style={styles.legend}>
              {ranges.map((p) => (
                <View key={p.name} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: p.color }]} />
                  <Text style={styles.legendLabel}>
                    {`${p.name.toUpperCase()} · D${p.start}-${p.end}`}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {tipText ? (
          <View
            style={[
              styles.tip,
              {
                backgroundColor: withAlpha(colors.bg0, 'C7'), // 78%
                borderColor: withAlpha(tipColor, '59'), // 35%
              },
            ]}
          >
            <Text style={[styles.tipText, { color: tipColor }]}>{tipText}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  /* ------------------------------------------------------------ circadian */
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
  /* ------------------------------------------------------ cycle variants */
  cycleRoot: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'flex-start',
  },
  cycleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  dial: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 26,
    letterSpacing: -0.5,
    color: colors.text,
    textAlign: 'center',
  },
  daySub: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.textFaint,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'column',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.textDim,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  tipText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  stripRoot: {
    alignSelf: 'flex-start',
  },
});
