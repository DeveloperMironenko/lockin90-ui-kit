import { useId, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, FeGaussianBlur, Filter, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** Catalog variant names (`lockin90-design/charts/watch-charts.html`, WC-01…WC-07). */
export type WatchComplicationVariant =
  | 'ring-score'
  | 'battery-gauge'
  | 'micro-spark'
  | 'corner-gauge'
  | 'inline-pill'
  | 'rings-trio';

/** The 4 corner micro-widgets of `variant="corner-gauge"` (WC-05). */
export interface WatchComplicationCorners {
  /** TL featured half-arc gauge fill, 0–100 (default 60) */
  value?: number;
  /** TL tiny value inside the gauge (default 'UV6') */
  label?: string;
  /** TL gauge color (default `colors.zoneMid`) */
  color?: string;
  /** TR quiet mono readout (default '23°') */
  text?: string;
  /** BL filled dots of 3 (default 2) */
  dots?: number;
  /** BR mini ring fill, 0–100 (default 69) */
  ring?: number;
}

export interface WatchComplicationProps {
  /** complication form (default `'ring-score'`, WC-01) */
  variant?: WatchComplicationVariant;
  /** the score/percent, 0–100 — ring fill (WC-01, default 82), battery fill
   *  (WC-02, default 64), inline ring + bar (WC-06, default 92), trio outer
   *  ring (WC-07, default 80) */
  value?: number;
  /** `rings-trio` — middle ring fill, 0–100 (default 60) */
  value2?: number;
  /** `rings-trio` — inner ring fill, 0–100 (default 45) */
  value3?: number;
  /** big readout override — WC-01 defaults to the rounded `value`, WC-02 to
   *  `'{value}%'`, WC-04 to its catalog card ('7:42'); WC-06 replaces the
   *  whole `'{label} {value}%'` line */
  valueText?: string;
  /** small caption — 'ENERGY' (WC-01) / 'BATTERY' (WC-02) / 'SLEEP' (WC-04) /
   *  the pill name 'CREATINE' (WC-06) */
  label?: string;
  /** `micro-spark` — the 0–1 trend points, oldest → newest (catalog: 10) */
  data?: number[];
  /** `corner-gauge` — the corner micro-widgets (defaults reproduce WC-05) */
  corners?: WatchComplicationCorners;
  /** main mark color — ring arc / spark line / inline ring+bar / trio outer.
   *  Per-variant defaults: mint (cyan for `micro-spark`); `battery-gauge`
   *  defaults to the value's zone verdict (≥62 high / ≥38 mid / else low). */
  color?: string;
  /** `rings-trio` — middle ring color (default `colors.cyan`) */
  color2?: string;
  /** `rings-trio` — inner ring color (default `colors.violet`) */
  color3?: string;
  /** rendered size in px. Square variants render `size`×`size`; `inline-pill`
   *  is the wide slot — `size` is the pill WIDTH, height = size·36/152.
   *  Default 108 = the catalog's 2× display scale (a real graphic-circular
   *  slot is ~size 54). */
  size?: number;
  /** glow underlay behind the featured colored mark — a Gaussian-blurred
   *  duplicate shape on native */
  shine?: boolean;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/* --------------------------------------------------------------- geometry
 * The catalog draws each complication 2× on its 320×150 card: circular faces
 * are a r54 circle (108px across), the corner face a 108×108 rx28 square, the
 * inline pill 150×34. Here the face IS the canvas: square variants use a
 * 112×112 viewBox (2-unit bezel), the pill a 152×36 one, scaled to `size`. */
const VB = 112;
const C = VB / 2;
const FACE_R = 54;
const PILL_W = 152;
const PILL_H = 36;

/* face + track alphas — the catalog's white rgba() steps as text-token alphas */
const FACE_FILL = `${colors.text}09`; // rgba(255,255,255,0.035)
const FACE_STROKE = `${colors.text}1F`; // 0.12
const TRACK = `${colors.text}14`; // ring/gauge track 0.08
const TRACK_TRIO = `${colors.text}12`; // trio tracks 0.07
const TRACK_CORNER = `${colors.text}1A`; // TL gauge track 0.1
const DOT_OFF = `${colors.text}26`; // BL pending dots 0.15
const PILL_FILL = `${colors.text}0D`; // pill bg 0.05

/** the catalog's WC-04 demo trend (SP — 10 nights of sleep) */
const DEFAULT_SPARK = [0.4, 0.55, 0.45, 0.6, 0.5, 0.7, 0.62, 0.78, 0.66, 0.8];

const DEFAULT_VALUE: Record<WatchComplicationVariant, number> = {
  'ring-score': 82,
  'battery-gauge': 64,
  'micro-spark': 0,
  'corner-gauge': 0,
  'inline-pill': 92,
  'rings-trio': 80,
};

const DEFAULT_LABEL: Record<WatchComplicationVariant, string> = {
  'ring-score': 'ENERGY',
  'battery-gauge': 'BATTERY',
  'micro-spark': 'SLEEP',
  'corner-gauge': '',
  'inline-pill': 'CREATINE',
  'rings-trio': '',
};

/** Zone verdict color for a 0–100 value (same thresholds as `Ring`). */
function zoneColor(v: number): string {
  return v >= 62 ? colors.zoneHigh : v >= 38 ? colors.zoneMid : colors.zoneLow;
}

function clamp100(v: number): number {
  return Math.max(0, Math.min(100, v));
}

/** polar point — 0° at 12 o'clock, clockwise (the catalog's `polar`) */
function polar(cx: number, cy: number, r: number, aDeg: number) {
  const a = ((aDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** open arc between two angles (the catalog's `arcPath`) */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const lg = (a1 - a0) % 360 > 180 ? 1 : 0;
  return `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}A${r} ${r} 0 ${lg} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}

/** 0–100 → sweep degrees, capped so a full arc never degenerates */
function sweep(v: number): number {
  return Math.min(359.9, clamp100(v) * 3.6);
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (WC-04 only). */
function monotonePath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n < 3) return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
  const dx: number[] = [];
  const m: number[] = [];
  const tg: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  tg[0] = m[0];
  tg[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) tg[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      tg[i] = 0;
      tg[i + 1] = 0;
    } else {
      const a = tg[i] / m[i];
      const b = tg[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        tg[i] = tau * a * m[i];
        tg[i + 1] = tau * b * m[i];
      }
    }
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${(pts[i][0] + h).toFixed(1)} ${(pts[i][1] + h * tg[i]).toFixed(1)} ${(pts[i + 1][0] - h).toFixed(1)} ${(
      pts[i + 1][1] - h * tg[i + 1]
    ).toFixed(1)} ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
  }
  return d;
}

/** faint mono caption (the catalog's `label()`) */
function Small({
  x,
  y,
  text,
  color = colors.textFaint,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <SvgText x={x} y={y} fill={color} fontSize={8.5} textAnchor={anchor} fontFamily={fonts.mono} letterSpacing={0.5}>
      {text}
    </SvgText>
  );
}

/** big display readout (the catalog's `big()` — Space Grotesk 700) */
function Big({ x, y, text, size = 21 }: { x: number; y: number; text: string; size?: number }) {
  return (
    <SvgText
      x={x}
      y={y}
      fill={colors.text}
      fontSize={size}
      fontWeight="700"
      textAnchor="middle"
      fontFamily={fonts.display}
    >
      {text}
    </SvgText>
  );
}

/** the circular watch face */
function Face() {
  return <Circle cx={C} cy={C} r={FACE_R} fill={FACE_FILL} stroke={FACE_STROKE} strokeWidth={1} />;
}

/** faint full track + round-cap progress arc (+ optional shine underlay —
 *  a Gaussian-blurred duplicate arc, the native twin of the web `blur(5px)`
 *  underlay; wide un-blurred copies read as hard outlines on device) */
function RingArc({
  r,
  value,
  color,
  strokeWidth,
  track = TRACK,
  shine = false,
}: {
  r: number;
  value: number;
  color: string;
  strokeWidth: number;
  track?: string;
  shine?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const blurId = `lk-wc-ring-blur-${uid}`;
  return (
    <G>
      {shine ? (
        /* region in user space over the full face so flat arcs never clip */
        <Defs>
          <Filter id={blurId} filterUnits="userSpaceOnUse" x={-10} y={-10} width={VB + 20} height={VB + 20}>
            <FeGaussianBlur stdDeviation={2.5} />
          </Filter>
        </Defs>
      ) : null}
      <Circle cx={C} cy={C} r={r} fill="none" stroke={track} strokeWidth={strokeWidth} />
      {shine ? (
        <Path
          d={arcPath(C, C, r, 0, sweep(value))}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 5}
          strokeLinecap="round"
          opacity={0.45}
          filter={`url(#${blurId})`}
        />
      ) : null}
      <Path
        d={arcPath(C, C, r, 0, sweep(value))}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </G>
  );
}

/**
 * WatchComplication — the catalog watch family (`watch-charts`, WC-01…WC-07):
 * tiny canvases for `lockin90-watch` — rings, gauges, sparks at complication
 * scale. Native twin of `@lockin90/ui` WatchComplication — same prop API +
 * geometry; every glow is a real Gaussian-blurred duplicate shape
 * (Fabric-native SVG filters in react-native-svg 15). Unlike the 320×150
 * charts the face IS the canvas:
 * square/circular variants render `size`×`size` (default 108 = the catalog's
 * 2× display scale), `inline-pill` renders `size` wide.
 *
 * - `ring-score` (WC-01, default) — graphic-circular: value ring on a faint
 *   track + big value + label. THE watch-face energy score.
 * - `battery-gauge` (WC-02) — 270° gauge (opens down), zone-colored + bolt
 *   glyph + %.
 * - `micro-spark` (WC-04) — big value + 10-point micro sparkline + end dot.
 * - `corner-gauge` (WC-05) — square face, 4 corner micro-widgets; featured TL
 *   half-arc gauge + tiny value in a dashed slot ring.
 * - `inline-pill` (WC-06) — wide pill: mini ring + mono text + progress bar.
 * - `rings-trio` (WC-07) — move/train/sleep concentric rings, round caps.
 *
 * Values are 0–100; tokens only. This is the watch-slot widget — for in-app
 * score rings reach for `Ring`, for 270°/180° dial gauges `Gauge`.
 */
export function WatchComplication({
  variant = 'ring-score',
  value,
  value2 = 60,
  value3 = 45,
  valueText,
  label,
  data = DEFAULT_SPARK,
  corners,
  color,
  color2 = colors.cyan,
  color3 = colors.violet,
  size = 108,
  shine = false,
  style,
}: WatchComplicationProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  /* variant-level glows mirror the web `blur(5px)` / `blur(4px)` underlays */
  const blur5Id = `lk-wc-blur5-${uid}`;
  const blur4Id = `lk-wc-blur4-${uid}`;
  const v = clamp100(value ?? DEFAULT_VALUE[variant]);
  const cap = label ?? DEFAULT_LABEL[variant];

  const inline = variant === 'inline-pill';
  const width = size;
  const height = inline ? (size * PILL_H) / PILL_W : size;
  const viewBox = inline ? `0 0 ${PILL_W} ${PILL_H}` : `0 0 ${VB} ${VB}`;
  const vbW = inline ? PILL_W : VB;
  const vbH = inline ? PILL_H : VB;

  let accessibilityLabel: string;
  let content: ReactNode;

  if (variant === 'ring-score') {
    /* --------------------------------------------------- WC-01 ring-score */
    const c = color ?? colors.mint;
    const readout = valueText ?? String(Math.round(v));
    accessibilityLabel = `${cap || 'score'} ${readout} — ring at ${Math.round(v)}%`;
    content = (
      <>
        <Face />
        <RingArc r={38} value={v} color={c} strokeWidth={7} shine={shine} />
        <Big x={C} y={C + 3} text={readout} />
        {cap ? <Small x={C} y={C + 17} text={cap} /> : null}
      </>
    );
  } else if (variant === 'battery-gauge') {
    /* ------------------------------------------------ WC-02 battery-gauge */
    const c = color ?? zoneColor(v);
    const readout = valueText ?? `${Math.round(v)}%`;
    const end = -135 + (270 * v) / 100;
    accessibilityLabel = `${cap || 'battery'} ${readout}`;
    content = (
      <>
        <Face />
        <Path d={arcPath(C, C, 38, -135, 135)} fill="none" stroke={TRACK} strokeWidth={7} />
        {/* shine — a Gaussian-blurred duplicate arc (the web `blur(5px)`) */}
        {shine ? (
          <Path
            d={arcPath(C, C, 38, -135, end)}
            fill="none"
            stroke={c}
            strokeWidth={12}
            strokeLinecap="round"
            opacity={0.45}
            filter={`url(#${blur5Id})`}
          />
        ) : null}
        <Path d={arcPath(C, C, 38, -135, end)} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" />
        {/* the charging-bolt glyph, in the fill color */}
        <Path d={`M${C} ${C - 16}l-4.5 9h3.5l-1 8 5.5-10h-3.8z`} fill={c} />
        <Big x={C} y={C + 16} text={readout} size={15} />
        {cap ? <Small x={C} y={C + 30} text={cap} /> : null}
      </>
    );
  } else if (variant === 'micro-spark') {
    /* -------------------------------------------------- WC-04 micro-spark */
    const c = color ?? colors.cyan;
    const readout = valueText ?? '7:42';
    const n = data.length;
    const pts = data.map(
      (p, i) => [C - 27 + (i * 54) / Math.max(1, n - 1), C + 14 - p * 26] as [number, number],
    );
    const last = pts[pts.length - 1];
    accessibilityLabel = `${cap || 'trend'} ${readout} — ${n}-point trend`;
    content = (
      <>
        <Face />
        {pts.length > 0 ? (
          <>
            {/* shine — a Gaussian-blurred duplicate spark (the web `blur(4px)`) */}
            {shine ? (
              <Path
                d={monotonePath(pts)}
                fill="none"
                stroke={c}
                strokeWidth={6.8}
                strokeLinecap="round"
                opacity={0.4}
                filter={`url(#${blur4Id})`}
              />
            ) : null}
            <Path d={monotonePath(pts)} fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
            <Circle cx={last[0].toFixed(1)} cy={last[1].toFixed(1)} r={2.4} fill={c} />
          </>
        ) : null}
        <Big x={C} y={C - 18} text={readout} size={17} />
        {cap ? <Small x={C} y={C + 28} text={cap} /> : null}
      </>
    );
  } else if (variant === 'corner-gauge') {
    /* ------------------------------------------------- WC-05 corner-gauge */
    const cv = clamp100(corners?.value ?? 60);
    const cl = corners?.label ?? 'UV6';
    const cc = corners?.color ?? colors.zoneMid;
    const ct = corners?.text ?? '23°';
    const cd = corners?.dots ?? 2;
    const cr = clamp100(corners?.ring ?? 69);
    accessibilityLabel = `corner complications — ${cl} gauge at ${Math.round(cv)}%`;
    content = (
      <>
        {/* the square face */}
        <Rect x={2} y={2} width={108} height={108} rx={28} fill={FACE_FILL} stroke={FACE_STROKE} strokeWidth={1} />
        {/* TL — the featured half-arc gauge in its dashed slot ring */}
        <Path d={arcPath(26, 26, 16, -90, 90)} fill="none" stroke={TRACK_CORNER} strokeWidth={4.5} />
        {/* shine — a Gaussian-blurred duplicate gauge arc (the web `blur(4px)`) */}
        {shine ? (
          <Path
            d={arcPath(26, 26, 16, -90, -90 + (180 * cv) / 100)}
            fill="none"
            stroke={cc}
            strokeWidth={9.5}
            strokeLinecap="round"
            opacity={0.45}
            filter={`url(#${blur4Id})`}
          />
        ) : null}
        <Path
          d={arcPath(26, 26, 16, -90, -90 + (180 * cv) / 100)}
          fill="none"
          stroke={cc}
          strokeWidth={4.5}
          strokeLinecap="round"
        />
        <Small x={26} y={29} text={cl} color={colors.text} />
        <Circle
          cx={26}
          cy={26}
          r={23}
          fill="none"
          stroke={colors.mint}
          strokeWidth={1}
          strokeDasharray={[3, 3]}
          opacity={0.7}
        />
        {/* TR / BL / BR — quiet placeholder fits */}
        <Small x={86} y={29} text={ct} color={colors.textDim} />
        {[0, 1, 2].map((k) => (
          <Circle key={k} cx={18 + k * 8} cy={88} r={2.2} fill={k < cd ? colors.mint : DOT_OFF} />
        ))}
        <Path
          d={arcPath(86, 86, 9, 0, sweep(cr))}
          fill="none"
          stroke={colors.violet}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </>
    );
  } else if (variant === 'inline-pill') {
    /* -------------------------------------------------- WC-06 inline-pill */
    const c = color ?? colors.mint;
    const line = valueText ?? `${cap} ${Math.round(v)}%`;
    accessibilityLabel = line;
    content = (
      <>
        <Rect x={1} y={1} width={150} height={34} rx={17} fill={PILL_FILL} stroke={FACE_STROKE} strokeWidth={1} />
        {/* shine — a Gaussian-blurred duplicate mini ring (the web `blur(4px)`) */}
        {shine ? (
          <Path
            d={arcPath(21, 18, 8, 0, sweep(v))}
            fill="none"
            stroke={c}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={0.45}
            filter={`url(#${blur4Id})`}
          />
        ) : null}
        <Path d={arcPath(21, 18, 8, 0, sweep(v))} fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" />
        <Small x={37} y={15} text={line} color={colors.text} anchor="start" />
        <Rect x={37} y={23} width={88} height={3.5} rx={1.75} fill={TRACK} />
        <Rect x={37} y={23} width={(88 * v) / 100} height={3.5} rx={1.75} fill={c} />
      </>
    );
  } else {
    /* --------------------------------------------------- WC-07 rings-trio */
    const rings: Array<[number, number, string]> = [
      [40, v, color ?? colors.mint],
      [30, clamp100(value2), color2],
      [20, clamp100(value3), color3],
    ];
    accessibilityLabel = `activity rings — move ${Math.round(rings[0][1])}%, train ${Math.round(
      rings[1][1],
    )}%, sleep ${Math.round(rings[2][1])}%`;
    content = (
      <>
        <Face />
        {rings.map(([r, rv, rc]) => (
          <RingArc key={r} r={r} value={rv} color={rc} strokeWidth={6} track={TRACK_TRIO} shine={shine} />
        ))}
      </>
    );
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox={viewBox}>
        {shine ? (
          /* real Gaussian blurs for the variant glows (Fabric-native in
             react-native-svg 15) — the native twins of the web `blur(5px)` /
             `blur(4px)` underlays. Regions in user space over the full face so
             flat arcs/sparks never clip. */
          <Defs>
            <Filter id={blur5Id} filterUnits="userSpaceOnUse" x={-10} y={-10} width={vbW + 20} height={vbH + 20}>
              <FeGaussianBlur stdDeviation={2.5} />
            </Filter>
            <Filter id={blur4Id} filterUnits="userSpaceOnUse" x={-10} y={-10} width={vbW + 20} height={vbH + 20}>
              <FeGaussianBlur stdDeviation={2} />
            </Filter>
          </Defs>
        ) : null}
        {content}
      </Svg>
    </View>
  );
}
