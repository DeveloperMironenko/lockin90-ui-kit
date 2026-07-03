import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** Catalog variant names (`lockin90-design/charts/radial-charts.html`, RA-01…RA-06). */
export type DayWheelVariant = 'clock-events' | 'radial-bars' | 'zone-wheel' | 'radial-heat';

/** One event on the 24h rim (`variant="clock-events"`). */
export interface DayWheelEvent {
  /** clock hour, 0–24 (fractional ok, e.g. 7.2 = 07:12) */
  at: number;
  /** dot color (token, default accent) */
  color?: string;
  /** accessible name (not drawn — the wheel stays clean; web renders it as the
   *  dot's tooltip, native has no tooltip substrate) */
  label?: string;
}

export interface DayWheelProps {
  /** chart form (default `'clock-events'`, RA-01) */
  variant?: DayWheelVariant;
  /** `clock-events` — glowing dots on the rim */
  events?: DayWheelEvent[];
  /** `clock-events` — the NOW hour (0–24): hand + pulse + digital center.
   *  Pass `null` to hide. */
  now?: number | null;
  /** `radial-bars` + `zone-wheel` — 24 hourly values, 0–1 (midnight first) */
  hours?: number[];
  /** `zone-wheel` — big center readout (default '74') */
  score?: string | number;
  /** `zone-wheel` — faint caption under the score (default 'TODAY') */
  centerLabel?: string;
  /** `radial-heat` — day rings × 24 hourly values 0–1, innermost ring first */
  week?: number[][];
  /** `radial-heat` — segment hue (default mint) */
  color?: string;
  /** `radial-heat` — dim chip-pill at the top-right (default 'RING = DAY · MON IN') */
  legend?: string;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** glow underlay behind the marks (dots / bars / segments) — a wider faint
   *  duplicate shape on native, never SVG filters (no-op on `radial-heat` —
   *  168 segments would smear) */
  shine?: boolean;
  /** rendered width in px — the 320×150 viewBox scales to fit */
  width?: number;
  /** rendered height in px */
  height?: number;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/* --------------------------------------------------------------- geometry
 * The catalog canvas: 320×150, wheel center at (W/2, H/2+6), R 52. Hour 0
 * (midnight) at the top, clockwise: angle = h/24·360. */
const W = 320;
const H = 150;
const P = { l: 10, r: 12, t: 16, b: 14 };
const CX = W / 2;
const CY = H / 2 + 6;
const R = 52;

const CARDINALS: [string, number][] = [
  ['12A', 0],
  ['6A', 6],
  ['12P', 12],
  ['6P', 18],
];

/* chip-pill fill — the catalog tag()'s rgba(8,10,18,0.78) = bg0 @ 78% */
const TAG_FILL = `${colors.bg0}C7`;
/* clock ticks — the catalog's rgba(255,255,255,0.12) = text @ 12% (bold 6h ticks @ 30%) */
const TICK = `${colors.text}1F`;
const TICK_BOLD = `${colors.text}4D`;
/* NOW hand — the catalog's rgba(255,255,255,0.2) = text @ 20% */
const HAND = `${colors.text}33`;

/** the catalog's demo events (RA-01) */
const DEFAULT_EVENTS: DayWheelEvent[] = [
  { at: 7.2, color: colors.mint },
  { at: 9.5, color: colors.zoneMid },
  { at: 12.8, color: colors.lime },
  { at: 17.5, color: colors.cyan },
  { at: 22.4, color: colors.violet },
];
/** the catalog's hourly demo curve — dayVals(22), the RA-03 card (RA-05's
 *  card uses seed 33 — reproduced in the stories) */
const DEFAULT_HOURS = [
  0.16, 0.14, 0.14, 0.14, 0.17, 0.24, 0.28, 0.39, 0.51, 0.59, 0.69, 0.73, 0.7, 0.62, 0.43, 0.26,
  0.23, 0.34, 0.43, 0.45, 0.39, 0.24, 0.2, 0.15,
];
/** the catalog's 7-day demo spiral (RA-06, Monday innermost) */
const DEFAULT_WEEK = [
  [0.17, 0.17, 0.15, 0.14, 0.16, 0.21, 0.3, 0.37, 0.52, 0.61, 0.73, 0.75, 0.74, 0.63, 0.46, 0.27, 0.26, 0.33, 0.42, 0.43, 0.37, 0.29, 0.16, 0.18],
  [0.15, 0.18, 0.13, 0.18, 0.16, 0.22, 0.26, 0.4, 0.5, 0.62, 0.72, 0.77, 0.7, 0.63, 0.47, 0.28, 0.28, 0.32, 0.42, 0.46, 0.35, 0.26, 0.17, 0.17],
  [0.17, 0.13, 0.13, 0.18, 0.19, 0.22, 0.28, 0.37, 0.5, 0.63, 0.7, 0.72, 0.75, 0.64, 0.47, 0.23, 0.24, 0.34, 0.41, 0.44, 0.38, 0.26, 0.22, 0.13],
  [0.13, 0.13, 0.15, 0.14, 0.17, 0.2, 0.28, 0.36, 0.52, 0.65, 0.7, 0.78, 0.73, 0.6, 0.42, 0.24, 0.27, 0.33, 0.39, 0.47, 0.38, 0.29, 0.18, 0.14],
  [0.15, 0.16, 0.17, 0.13, 0.2, 0.22, 0.28, 0.4, 0.51, 0.61, 0.74, 0.76, 0.7, 0.6, 0.44, 0.24, 0.22, 0.35, 0.39, 0.44, 0.4, 0.27, 0.19, 0.18],
  [0.13, 0.14, 0.16, 0.18, 0.17, 0.2, 0.31, 0.4, 0.5, 0.6, 0.69, 0.78, 0.74, 0.61, 0.47, 0.27, 0.26, 0.35, 0.4, 0.47, 0.37, 0.26, 0.19, 0.14],
  [0.13, 0.13, 0.14, 0.14, 0.15, 0.21, 0.3, 0.4, 0.51, 0.61, 0.72, 0.73, 0.69, 0.63, 0.42, 0.25, 0.25, 0.35, 0.42, 0.44, 0.36, 0.27, 0.17, 0.17],
];

const DEFAULT_TITLES: Record<DayWheelVariant, string> = {
  'clock-events': 'TODAY · AROUND THE CLOCK',
  'radial-bars': 'HOURLY OUTPUT',
  'zone-wheel': 'HOUR QUALITY WHEEL',
  'radial-heat': 'WEEK SPIRAL',
};

/** hour → angle: midnight at top, clockwise */
function ha(h: number): number {
  return (h / 24) * 360;
}

/** polar point — 0° at 12 o'clock, clockwise */
function polar(cx: number, cy: number, r: number, aDeg: number) {
  const a = ((aDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** open arc between two angles */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const lg = (a1 - a0) % 360 > 180 ? 1 : 0;
  return `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}A${r} ${r} 0 ${lg} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}

/** zone verdict for a 0–1 value (catalog `zoneOf`) */
function zoneOf(v: number): string {
  return v >= 0.62 ? colors.zoneHigh : v >= 0.38 ? colors.zoneMid : colors.zoneLow;
}

/** '14.6' → '14:36' */
function formatClock(h: number): string {
  const norm = ((h % 24) + 24) % 24;
  const hr = Math.floor(norm);
  const min = Math.round((norm - hr) * 60);
  return `${hr}:${String(min).padStart(2, '0')}`;
}

function Label({
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
    <SvgText
      x={x}
      y={y}
      fill={color}
      fontSize={8.5}
      textAnchor={anchor}
      fontFamily={fonts.mono}
      letterSpacing={0.5}
    >
      {text}
    </SvgText>
  );
}

/** chip-pill label (dark rect + tinted hairline) — `y` = pill center */
function Tag({
  x,
  y,
  text,
  color,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  const w = text.length * 5.35 + 12;
  let xa = anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2;
  xa = Math.max(P.l - 4, Math.min(xa, W - P.r - w + 4));
  return (
    <G>
      <Rect
        x={xa.toFixed(1)}
        y={(y - 6.5).toFixed(1)}
        width={w.toFixed(1)}
        height={13}
        rx={6.5}
        fill={TAG_FILL}
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <SvgText
        x={(xa + w / 2).toFixed(1)}
        y={(y + 2.8).toFixed(1)}
        fill={color}
        fontSize={8}
        textAnchor="middle"
        fontFamily={fonts.mono}
        letterSpacing={0.4}
      >
        {text}
      </SvgText>
    </G>
  );
}

/** the 24h tick ring: rim circle + 24 ticks (bold every 6h) + cardinal labels */
function ClockFrame({ labelRadius = R + 10 }: { labelRadius?: number }) {
  return (
    <G>
      {/* rim — the catalog's rgba(255,255,255,0.09) IS the border token */}
      <Circle cx={CX} cy={CY} r={R} fill="none" stroke={colors.border} strokeWidth={1} />
      {Array.from({ length: 24 }, (_, h) => {
        const big = h % 6 === 0;
        const p1 = polar(CX, CY, R, ha(h));
        const p2 = polar(CX, CY, R - (big ? 6 : 3), ha(h));
        return (
          <Line
            key={h}
            x1={p1.x.toFixed(1)}
            y1={p1.y.toFixed(1)}
            x2={p2.x.toFixed(1)}
            y2={p2.y.toFixed(1)}
            stroke={big ? TICK_BOLD : TICK}
            strokeWidth={1}
          />
        );
      })}
      {CARDINALS.map(([t, h]) => {
        const pl = polar(CX, CY, labelRadius, ha(h));
        return <Label key={t} x={pl.x} y={pl.y + 3} text={t} />;
      })}
    </G>
  );
}

/**
 * DayWheel — the kit's 24-hour radial chart (catalog family `radial-charts`,
 * RA-01…RA-06): circadian data wrapped around a clock, midnight at the top,
 * time running clockwise. Native twin of `@lockin90/ui` DayWheel — same prop
 * API + geometry; the web SMIL NOW-pulse is a static dot + faint halo ring
 * here, and every glow is a wider faint duplicate shape (never SVG filters),
 * like `Ring`.
 *
 * - `clock-events` (RA-01, default) — the tick ring (bold every 6h + 12A/6A/
 *   12P/6P) with glowing event dots on the rim, a NOW hand + pulse dot and the
 *   digital time in the center.
 * - `radial-bars` (RA-03) — 24 radiating 4.5px round bars, length = value,
 *   color = zone verdict.
 * - `zone-wheel` (RA-05) — 24 arc segments, zone color + opacity carry the
 *   value, big score in the center.
 * - `radial-heat` (RA-06) — 7 concentric day-rings × 24 segments, opacity =
 *   value — the whole week on one clock.
 *
 * Values are 0–1 (zone thresholds at 0.62 / 0.38). Geometry is the catalog's
 * 320×150 canvas (scaled via `width`/`height`); tokens only. NOTE: this is the
 * radial DATA wheel — for phase bands / cycle arcs reach for `PhaseWheel`.
 */
export function DayWheel({
  variant = 'clock-events',
  events = DEFAULT_EVENTS,
  now = 14.6,
  hours = DEFAULT_HOURS,
  score = '74',
  centerLabel = 'TODAY',
  week = DEFAULT_WEEK,
  color = colors.mint,
  legend = 'RING = DAY · MON IN',
  title,
  shine = false,
  width = W,
  height = H,
  style,
}: DayWheelProps) {
  const heading = title ?? DEFAULT_TITLES[variant];

  let accessibilityLabel: string;
  let content: ReactNode;

  /* -------------------------------------------------- RA-01 clock-events */
  if (variant === 'clock-events') {
    const np = now != null ? polar(CX, CY, R, ha(now)) : null;
    accessibilityLabel = `${heading}: ${events.length} events on the 24h clock${
      now != null ? `, now ${formatClock(now)}` : ''
    }`;
    content = (
      <>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        <ClockFrame />
        {events.map((ev, i) => {
          const p = polar(CX, CY, R, ha(ev.at));
          const c = ev.color ?? colors.accent;
          return (
            <G key={i}>
              {/* glow = wider faint duplicates (web: shine blur + drop-shadow) */}
              {shine ? (
                <Circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={10} fill={c} opacity={0.18} />
              ) : null}
              <Circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={7} fill={c} opacity={0.35} />
              <Circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={4} fill={c} />
            </G>
          );
        })}
        {np ? (
          <G>
            <Line
              x1={CX}
              y1={CY}
              x2={np.x.toFixed(1)}
              y2={np.y.toFixed(1)}
              stroke={HAND}
              strokeWidth={1}
            />
            {/* NOW pulse — static dot + faint halo ring (no SMIL/JS animation
                on native; the web pulse ring is a documented substrate diff) */}
            <Circle
              cx={np.x.toFixed(1)}
              cy={np.y.toFixed(1)}
              r={7}
              fill="none"
              stroke={colors.text}
              strokeWidth={1.4}
              strokeOpacity={0.4}
            />
            <Circle cx={np.x.toFixed(1)} cy={np.y.toFixed(1)} r={3.6} fill={colors.text} />
            <Label x={CX} y={CY + 4} text={formatClock(now!)} color={colors.textDim} />
          </G>
        ) : null}
      </>
    );
  } else if (variant === 'radial-bars') {
    /* ------------------------------------------------- RA-03 radial-bars */
    accessibilityLabel = `${heading}: 24 hourly bars, zone-colored`;
    content = (
      <>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        <ClockFrame />
        {hours.slice(0, 24).map((v, h) => {
          const p1 = polar(CX, CY, 14, ha(h));
          const p2 = polar(CX, CY, 14 + v * (R - 18), ha(h));
          const c = zoneOf(v);
          return (
            <G key={h}>
              {shine ? (
                <Line
                  x1={p1.x.toFixed(1)}
                  y1={p1.y.toFixed(1)}
                  x2={p2.x.toFixed(1)}
                  y2={p2.y.toFixed(1)}
                  stroke={c}
                  strokeWidth={9}
                  strokeLinecap="round"
                  opacity={0.3}
                />
              ) : null}
              <Line
                x1={p1.x.toFixed(1)}
                y1={p1.y.toFixed(1)}
                x2={p2.x.toFixed(1)}
                y2={p2.y.toFixed(1)}
                stroke={c}
                strokeWidth={4.5}
                strokeLinecap="round"
                opacity={0.9}
              />
            </G>
          );
        })}
      </>
    );
  } else if (variant === 'zone-wheel') {
    /* -------------------------------------------------- RA-05 zone-wheel */
    accessibilityLabel = `${heading}: 24 hour segments, center score ${score}`;
    content = (
      <>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        {hours.slice(0, 24).map((v, h) => {
          const d = arcPath(CX, CY, R - 6, ha(h) + 1.5, ha(h + 1) - 1.5);
          const c = zoneOf(v);
          return (
            <G key={h}>
              {shine ? <Path d={d} fill="none" stroke={c} strokeWidth={15} opacity={0.25} /> : null}
              <Path d={d} fill="none" stroke={c} strokeWidth={11} opacity={0.35 + v * 0.6} />
            </G>
          );
        })}
        {CARDINALS.map(([t, h]) => {
          const pl = polar(CX, CY, R + 8, ha(h));
          return <Label key={t} x={pl.x} y={pl.y + 3} text={t} />;
        })}
        <SvgText
          x={CX}
          y={CY + 7}
          fill={colors.text}
          fontSize={20}
          textAnchor="middle"
          fontWeight="700"
          fontFamily={fonts.display}
        >
          {String(score)}
        </SvgText>
        <Label x={CX} y={CY + 21} text={centerLabel} />
      </>
    );
  } else {
    /* ------------------------------------------------- RA-06 radial-heat */
    accessibilityLabel = `${heading}: ${week.length} day rings of 24 hour segments`;
    content = (
      <>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        {week.map((day, d) => {
          const r = 18 + d * 5;
          return day.slice(0, 24).map((v, h) => (
            <Path
              key={`${d}-${h}`}
              d={arcPath(CX, CY, r, ha(h) + 2, ha(h + 1) - 2)}
              fill="none"
              stroke={color}
              strokeWidth={3.4}
              opacity={0.06 + v * 0.85}
            />
          ));
        })}
        {CARDINALS.map(([t, h]) => {
          const pl = polar(CX, CY, 58, ha(h));
          return <Label key={t} x={pl.x} y={pl.y + 3} text={t} />;
        })}
        {legend ? <Tag x={W - P.r - 4} y={26} text={legend} color={colors.textDim} anchor="end" /> : null}
      </>
    );
  }

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[{ width, height }, style]}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        {content}
      </Svg>
    </View>
  );
}
