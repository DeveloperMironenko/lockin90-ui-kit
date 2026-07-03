import { useId, type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts, radii } from '@lockin90/tokens';

/** Zone verdict color for a 0–100 value (same thresholds as the chart catalog). */
function zoneColor(v: number): string {
  return v >= 62 ? colors.zoneHigh : v >= 38 ? colors.zoneMid : colors.zoneLow;
}

export interface RingProps {
  /** Arc fill, 0–100 (clamped). */
  value?: number;
  /** Second ring's fill, 0–100 — `dual` (inner ring) and `triple` (middle ring). */
  value2?: number;
  /** Third ring's fill, 0–100 — `triple` (innermost ring). */
  value3?: number;
  /** Outer diameter in px (the SVG viewBox is square at this size). */
  size?: number;
  /** Stroke width of both the track and the arc, in px.
   *  Defaults to `7` (or `4` for `variant="thin-halo"` — DN-06). */
  thickness?: number;
  /** Arc color — any color. Ignored when a `gradient` array is given or `zone`
   *  is on. */
  color?: string;
  /** Second ring's color — defaults to `colors.violet` (`dual`, DN-04) or
   *  `colors.cyan` (`triple`, DN-05). */
  color2?: string;
  /** Third ring's color — defaults to `colors.violet` (`triple`, DN-05). */
  color3?: string;
  /** Track (unfilled) color. */
  trackColor?: string;
  /** Optional arc gradient. A `[from, to]` tuple paints a two-stop gradient; an
   *  N-length array (≥2, e.g. `gradients.flux.stops`) paints N evenly-spaced
   *  stops — the full flux spectrum arc; a single string is treated like a
   *  solid `color`. Applies to the main (outer) arc only. */
  gradient?: string | string[];
  /** Soft color glow behind the arc (on by default). */
  glow?: boolean;
  /** Color the arc + default center number by the value's zone verdict
   *  (≥62 → `zoneHigh`, ≥38 → `zoneMid`, else `zoneLow`) — DN-03. */
  zone?: boolean;
  /** Catalog variant (donut-charts DN-01…DN-09):
   *  - `score` (default) — single ring + center stat (DN-01)
   *  - `dual` — concentric outer + inner ring, shared center stat (DN-04)
   *  - `triple` — activity-style 3 concentric rings, no default center (DN-05)
   *  - `thin-halo` — quiet 4px ring (DN-06)
   *  - `dashed-track` — dotted `2 5` track under a solid arc (DN-07)
   *  - `pulse` — a dot marks the arc end (static on native — no tween precedent)
   *  - `delta` — score ring + delta chip under the center (DN-09; the chip
   *    renders whenever `delta` is set, on any variant) */
  variant?: 'score' | 'dual' | 'triple' | 'thin-halo' | 'dashed-track' | 'pulse' | 'delta';
  /** Delta chip text under the center stat (e.g. '+6 VS YESTERDAY') — DN-09. */
  delta?: string;
  /** Delta chip tint (hex — used with alpha suffixes for the chip hairline). */
  deltaColor?: string;
  /** Centered content. When omitted the rounded `value` is shown as the number
   *  (`triple` shows nothing by default — three values are ambiguous). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Ring — a generic, prop-driven circular-progress primitive: an SVG track +
 * colored progress arc (rotated −90° so it starts at 12 o'clock, round
 * linecap, soft color glow) with absolutely-centered readout content. Solid by
 * default; pass a `[from, to]` `gradient` for a two-stop arc, or an N-stop
 * array (e.g. `gradients.flux.stops`) for the full spectrum. Covers the
 * catalog score-ring family (DN-01…DN-09) via `variant` + `zone`/`delta`.
 */
export function Ring({
  value = 72,
  value2,
  value3,
  size = 108,
  thickness,
  color = colors.mint,
  color2,
  color3,
  trackColor = colors.border,
  gradient,
  glow = true,
  zone = false,
  variant = 'score',
  delta,
  deltaColor = colors.mint,
  children,
  style,
}: RingProps) {
  const uid = useId();
  const gradId = `lk-ring-grad-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;

  const sw = thickness ?? (variant === 'thin-halo' ? 4 : 7);
  const v = Math.max(0, Math.min(100, value));
  // reserve the glow's overhang (a wider stroke than the arc) so neither the arc
  // nor its halo clips against the square SVG viewBox
  const glowPad = glow ? 5 : 0;
  const r = (size - sw) / 2 - glowPad;

  const useGradient = Array.isArray(gradient) && !zone;
  // resolved solid arc color: zone verdict > explicit single-string gradient > color
  const solid = zone ? zoneColor(v) : typeof gradient === 'string' ? gradient : color;
  const stroke = useGradient ? `url(#${gradId})` : solid;
  // pulse tint (gradient → mint, like the catalog)
  const pulseColor = useGradient ? colors.mint : solid;

  const half = size / 2;
  const dashedTrack = variant === 'dashed-track';

  // concentric ring set outer → inner; inner radii step by thickness + 4
  // (catalog r52/r38 · r52/r39/r26 spacing).
  const step = sw + 4;
  const rings: { r: number; v: number; stroke: string }[] = [{ r, v, stroke }];
  if (variant === 'dual' || variant === 'triple') {
    rings.push({
      r: r - step,
      v: Math.max(0, Math.min(100, value2 ?? 0)),
      stroke: color2 ?? (variant === 'triple' ? colors.cyan : colors.violet),
    });
  }
  if (variant === 'triple') {
    rings.push({
      r: r - 2 * step,
      v: Math.max(0, Math.min(100, value3 ?? 0)),
      stroke: color3 ?? colors.violet,
    });
  }

  // pulse dot at the main arc's end (arcs rotate −90°, so angle 0 = 12 o'clock)
  const pulseAngle = ((v / 100) * 360 - 90) * (Math.PI / 180);
  const px = half + r * Math.cos(pulseAngle);
  const py = half + r * Math.sin(pulseAngle);

  return (
    <View style={[styles.root, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {useGradient ? (
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
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
        {rings.map((ring, i) => {
          const c = 2 * Math.PI * ring.r;
          const dashOffset = c * (1 - ring.v / 100);
          return (
            <G key={i}>
              {/* track */}
              <Circle
                cx={half}
                cy={half}
                r={ring.r}
                fill="none"
                stroke={trackColor}
                strokeWidth={sw}
                strokeDasharray={dashedTrack ? [2, 5] : undefined}
                strokeLinecap={dashedTrack ? 'butt' : undefined}
              />
              {/* glow — a wider, faint copy of the progress arc behind it, so the
                  halo follows the circular ring (not a square box shadow). Avoids
                  <Filter>/<FeGaussianBlur>, which is patchy on device. */}
              {glow ? (
                <Circle
                  cx={half}
                  cy={half}
                  r={ring.r}
                  fill="none"
                  stroke={ring.stroke}
                  strokeWidth={sw + 8}
                  strokeOpacity={0.35}
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={dashOffset}
                  rotation={-90}
                  originX={half}
                  originY={half}
                />
              ) : null}
              {/* progress arc — rotated −90° to start at 12 o'clock */}
              <Circle
                cx={half}
                cy={half}
                r={ring.r}
                fill="none"
                stroke={ring.stroke}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={dashOffset}
                rotation={-90}
                originX={half}
                originY={half}
              />
            </G>
          );
        })}
        {/* pulse marker — static dot + faint halo ring (no SMIL/JS animation on
            native; the web wave animation is a documented substrate diff) */}
        {variant === 'pulse' ? (
          <>
            <Circle cx={px} cy={py} r={7} fill="none" stroke={pulseColor} strokeWidth={1.4} strokeOpacity={0.4} />
            <Circle cx={px} cy={py} r={3.6} fill={pulseColor} />
          </>
        ) : null}
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {children ??
          (variant === 'triple' ? null : (
            <Text style={[styles.num, zone ? { color: solid } : null]}>{Math.round(v)}</Text>
          ))}
        {delta ? (
          <View style={[styles.deltaChip, { borderColor: `${deltaColor}59` }]}>
            <Text style={[styles.deltaText, { color: deltaColor }]}>{delta}</Text>
          </View>
        ) : null}
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
  },
  num: {
    fontFamily: fonts.display,
    fontWeight: '700',
    letterSpacing: -0.9,
    lineHeight: 32,
    fontSize: 32,
    color: colors.text,
    textAlign: 'center',
  },
  // DN-09 delta chip — dark pill + tinted hairline (catalog tag())
  deltaChip: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderWidth: 1,
    borderRadius: radii.pill,
    backgroundColor: `${colors.bg0}C7`,
  },
  deltaText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0.45,
  },
});
