import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** One arc of the donut, sized by its `value` share of the total. */
export interface DonutSegment {
  /** the segment's value — sizes its arc relative to the sum of all values */
  value: number;
  /** the arc color — a hex/rgb color string */
  color: string;
  /** optional label (accessibility / external legends / `callouts` chip text) */
  label?: string;
  /** per-segment opacity override (nested-arcs shades the outer breakdown by
   *  family, e.g. 1 / 0.68 / 0.42) */
  opacity?: number;
}

export interface DonutChartProps {
  /** the donut segments, drawn clockwise from 12 o'clock */
  segments?: DonutSegment[];
  /** Catalog variant (pie-charts PC-01…PC-13). `donut` (default) keeps the
   *  legacy dasharray renderer; every other value renders **share arcs** —
   *  round-cap segmented stroke arcs with cap-compensated real gaps (tiny
   *  segments become dots), no track ring:
   *  - `duo-split` (PC-01) — 2 segments, e.g. mint + glass remainder
   *  - `split-arcs` (PC-02) — 2–5 spectrum-ordered segments
   *  - `zone-share` (PC-04) — segments colored by zone verdict tokens
   *  - `hero-arc` (PC-05) — hero segment +4px & shine, others 30%
   *  - `callout-arcs` (PC-07) — leader lines + chip-pill labels
   *  - `thin-share` (PC-09) — slim 6px halo-weight segments
   *  - `mini-multiples` (PC-11) — one small ring; compose 3 side by side
   *  - `nested-arcs` (PC-13) — `innerSegments` coarse ring + outer breakdown */
  variant?:
    | 'donut'
    | 'duo-split'
    | 'split-arcs'
    | 'zone-share'
    | 'hero-arc'
    | 'callout-arcs'
    | 'thin-share'
    | 'mini-multiples'
    | 'nested-arcs';
  /** overall diameter in px (default 120 · `mini-multiples` 72) */
  size?: number;
  /** ring stroke width in px (default 14 · share 13 · `thin-share` 6 ·
   *  `mini-multiples` 8) */
  thickness?: number;
  /** gap between segments, in degrees (default 2 · share variants 5).
   *  Share arcs additionally grow every gap by the round-cap overhang
   *  (`capDeg = (thickness / r) · 180/π`) so the VISIBLE gap stays true. */
  gap?: number;
  /** background (track) ring color — legacy `donut` variant only (share arcs
   *  draw no track) */
  track?: string;
  /** hero segment index — drawn +4px wider with shine, others dim to 30%
   *  (defaults to `0` for `variant="hero-arc"`) */
  hero?: number;
  /** glow underlay behind full-opacity segments — a wider faint duplicate arc
   *  (no blur filter on native; defaults on for `hero-arc`) */
  shine?: boolean;
  /** leader lines + chip-pill labels around the ring, from each segment's
   *  `label` (defaults on for `callout-arcs` / `nested-arcs`). Reserves 34px
   *  of the box on every side, shrinking the ring. */
  callouts?: boolean;
  /** inner coarse ring for `nested-arcs` (PC-13) — drawn at ~0.47·r with a 6°
   *  base gap */
  innerSegments?: DonutSegment[];
  /** center content — if omitted, the summed total is shown */
  children?: ReactNode;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of a macro-style breakdown. */
const DEFAULT_SEGMENTS: DonutSegment[] = [
  { value: 50, color: colors.cyan, label: 'Carbs' },
  { value: 30, color: colors.lime, label: 'Protein' },
  { value: 20, color: colors.accent, label: 'Fat' },
];

/** point on a circle for catalog angle `aDeg` (0° = 12 o'clock, clockwise). */
function polar(cx: number, cy: number, r: number, aDeg: number) {
  const rad = ((aDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** SVG arc path from `a0` to `a1` (catalog angles, clockwise). */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const large = (a1 - a0) % 360 > 180 ? 1 : 0;
  return `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}A${r} ${r} 0 ${large} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}

/** One resolved share arc (or dot, when the segment is too small for its caps). */
interface ShareArc {
  seg: DonutSegment;
  a0: number;
  a1: number;
  mid: number;
  swi: number;
  op: number;
  dot: boolean;
}

/** The catalog `arcRing` math: round caps + real gaps (cap growth compensated).
 *  Fracs share the sweep left after per-segment gaps; tiny segments become dots. */
function shareArcs(
  segments: DonutSegment[],
  r: number,
  sw: number,
  gapDeg: number,
  hero: number | undefined,
): ShareArc[] {
  const total = segments.reduce((sum, s) => sum + (s.value > 0 ? s.value : 0), 0) || 1;
  const capDeg = (sw / r) * (180 / Math.PI);
  const gapT = capDeg + gapDeg;
  const avail = Math.max(0, 360 - segments.length * gapT);
  let a = 0;
  return segments.map((seg, i) => {
    const f = (seg.value > 0 ? seg.value : 0) / total;
    const sweep = f * avail;
    const swi = hero === i ? sw + 4 : sw;
    const op = seg.opacity ?? (hero != null && hero !== i ? 0.3 : 1);
    const a0 = a + gapT / 2 + capDeg / 2;
    const a1 = a + gapT / 2 + sweep - capDeg / 2;
    const mid = a + gapT / 2 + sweep / 2;
    a += gapT + sweep;
    return { seg, a0, a1, mid, swi, op, dot: a1 <= a0 };
  });
}

/**
 * DonutChart — proportional composition as a ring. Two renderers behind one
 * API: the legacy `donut` variant (dasharray arcs over a faint track — the
 * macro-breakdown donut) and the catalog **share arcs** (PC-01…PC-13):
 * luminous round-cap segmented stroke arcs with cap-compensated gaps, hero
 * emphasis, leader-line callouts and a nested two-ring mode. Center shows
 * custom `children` or the summed total.
 */
export function DonutChart({
  segments = DEFAULT_SEGMENTS,
  variant = 'donut',
  size,
  thickness,
  gap,
  track = 'rgba(255,255,255,0.07)',
  hero,
  shine,
  callouts,
  innerSegments,
  children,
  style,
}: DonutChartProps) {
  const isShare = variant !== 'donut';
  const box = size ?? (variant === 'mini-multiples' ? 72 : 120);
  const sw =
    thickness ??
    (variant === 'thin-share' ? 6 : variant === 'mini-multiples' ? 8 : isShare ? 13 : 14);
  const gapDeg = Math.max(0, gap ?? (isShare ? 5 : 2));
  const heroIdx = hero ?? (variant === 'hero-arc' ? 0 : undefined);
  const shineOn = shine ?? variant === 'hero-arc';
  const calloutsOn =
    isShare && (callouts ?? (variant === 'callout-arcs' || variant === 'nested-arcs'));

  const c = box / 2;
  // callouts reserve chip room on every side, shrinking the ring
  const r = Math.max(10, (box - sw) / 2 - (calloutsOn ? 34 : 0));

  const total = segments.reduce((sum, s) => sum + (s.value > 0 ? s.value : 0), 0) || 1;

  /* ---------------------------------------------------------------- share */
  if (isShare) {
    const arcs = shareArcs(segments, r, sw, gapDeg, heroIdx);
    const innerR = Math.max(8, r * 0.47);
    const innerSw = Math.max(5, Math.round(sw * 0.9));
    const innerArcs =
      variant === 'nested-arcs' && innerSegments
        ? shareArcs(innerSegments, innerR, innerSw, 6, undefined)
        : [];

    return (
      <View style={[{ width: box, height: box }, styles.box, style]}>
        <Svg width={box} height={box} viewBox={`0 0 ${box} ${box}`}>
          {innerArcs.map((a, i) => {
            if (a.dot) {
              const p = polar(c, c, innerR, a.mid);
              return (
                <Circle
                  key={`in-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={a.swi / 2}
                  fill={a.seg.color}
                  opacity={a.op}
                />
              );
            }
            return (
              <Path
                key={`in-${i}`}
                d={arcPath(c, c, innerR, a.a0, a.a1)}
                fill="none"
                stroke={a.seg.color}
                strokeWidth={a.swi}
                strokeLinecap="round"
                opacity={a.op}
              />
            );
          })}
          {arcs.map((a, i) => {
            if (a.dot) {
              const p = polar(c, c, r, a.mid);
              return (
                <Circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={a.swi / 2}
                  fill={a.seg.color}
                  opacity={a.op}
                />
              );
            }
            return (
              <G key={i}>
                {/* shine — a wider faint duplicate under the arc (no blur on RN) */}
                {shineOn && a.op === 1 ? (
                  <Path
                    d={arcPath(c, c, r, a.a0, a.a1)}
                    fill="none"
                    stroke={a.seg.color}
                    strokeWidth={a.swi + 6}
                    strokeOpacity={0.3}
                    strokeLinecap="round"
                  />
                ) : null}
                <Path
                  d={arcPath(c, c, r, a.a0, a.a1)}
                  fill="none"
                  stroke={a.seg.color}
                  strokeWidth={a.swi}
                  strokeLinecap="round"
                  opacity={a.op}
                />
              </G>
            );
          })}
          {calloutsOn
            ? arcs.map((a, i) => {
                const label = a.seg.label;
                if (!label) return null;
                const pO = polar(c, c, r + sw / 2 + 2, a.mid);
                const pE = polar(c, c, r + sw / 2 + 13, a.mid);
                const right = pE.x > c;
                const w = label.length * 5.35 + 12;
                const anchorX = pE.x + (right ? 5 : -5);
                const xa = Math.max(2, Math.min(right ? anchorX : anchorX - w, box - w - 2));
                return (
                  <G key={`co-${i}`}>
                    <Line
                      x1={pO.x}
                      y1={pO.y}
                      x2={pE.x}
                      y2={pE.y}
                      stroke={colors.text}
                      strokeOpacity={0.3}
                      strokeWidth={1}
                    />
                    <Rect
                      x={xa}
                      y={pE.y - 6.5}
                      width={w}
                      height={13}
                      rx={6.5}
                      fill={`${colors.bg0}C7`}
                      stroke={a.seg.color}
                      strokeOpacity={0.35}
                      strokeWidth={0.8}
                    />
                    <SvgText
                      x={xa + w / 2}
                      y={pE.y + 2.8}
                      fill={a.seg.color}
                      fontFamily={fonts.mono}
                      fontSize={8}
                      textAnchor="middle"
                    >
                      {label}
                    </SvgText>
                  </G>
                );
              })
            : null}
        </Svg>
        <View style={styles.center} pointerEvents="none">
          {children ?? <Text style={styles.total}>{total}</Text>}
        </View>
      </View>
    );
  }

  /* --------------------------------------------------------------- legacy */
  const circ = 2 * Math.PI * r;
  /** the visible-arc count: segments with a positive value get a leading gap */
  const drawn = segments.filter((s) => s.value > 0).length;
  /** px length of the angular gap, capped so it never exceeds a segment's share */
  const gapPx = (gapDeg / 360) * circ;

  // running offset (negative) so arcs chain clockwise from 12 o'clock
  let cursor = 0;
  const arcs = segments.map((s) => {
    const share = (s.value > 0 ? s.value : 0) / total;
    const full = circ * share;
    // shave a gap off the head of each arc (only when there's room + >1 arc)
    const trim = drawn > 1 ? Math.min(gapPx, full) : 0;
    const len = Math.max(0, full - trim);
    const offset = -(cursor + trim);
    cursor += full;
    return { len, offset };
  });

  return (
    <View style={[{ width: box, height: box }, styles.box, style]}>
      <Svg width={box} height={box} viewBox={`0 0 ${box} ${box}`}>
        <G origin={`${c}, ${c}`} rotation={-90}>
          <Circle cx={c} cy={c} r={r} fill="none" stroke={track} strokeWidth={sw} />
          {segments.map((s, i) => {
            const a = arcs[i]!;
            if (a.len <= 0) return null;
            return (
              <Circle
                key={`${s.label ?? 'seg'}-${i}`}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeDasharray={[a.len, circ - a.len]}
                strokeDashoffset={a.offset}
                opacity={s.opacity}
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {children ?? <Text style={styles.total}>{total}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  total: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 26,
    letterSpacing: -0.5,
    color: colors.text,
  },
});
