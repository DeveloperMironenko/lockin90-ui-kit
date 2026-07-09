import { useId, type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, FeGaussianBlur, Filter, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* BodyBattery — the catalog body-battery family (BB-01/02/05/06/07,
   lockin90-design/charts/body-battery-charts.html): charges while you sleep,
   drains through the day. Five variants drawn in a fixed 320×150 viewBox:
   the zone-gradient day curve (violet sleep shading + CHARGING bolt + NOW
   pulse), the glanceable battery glyph (level / charging / low SELECT
   states), drain-event attribution pills, the 7-battery week row and the
   today-vs-yesterday compare. Native twin of `@lockin90/ui` BodyBattery —
   same prop API; the shine glow is a real Gaussian-blurred duplicate
   (Fabric-native SVG filters in react-native-svg 15). (BB-03/04 do not
   exist — numbering gaps.) */

export type BodyBatteryVariant =
  | 'battery-day' /* BB-01 — zone-stroked % curve over 24h + NOW pulse */
  | 'battery-glyph' /* BB-02 — big battery glyph · SELECT STATE level/charging/low */
  | 'drain-events' /* BB-05 — day curve + coral event pills at the dips */
  | 'battery-week' /* BB-06 — 7 mini vertical batteries + % + day letters */
  | 'battery-vs'; /* BB-07 — today zone curve + dashed yesterday + pills */

/** One `drain-events` attribution pill (BB-05). */
export interface BatteryDrainEvent {
  /** Position as a fraction of the day (0 = midnight → 1 = midnight). */
  at: number;
  /** Pill text (e.g. 'MEETING −8%'). */
  label: string;
}

export interface BodyBatteryProps {
  /** Catalog variant (BB-01 / BB-02 / BB-05 / BB-06 / BB-07). */
  variant?: BodyBatteryVariant;
  /** Battery samples 0–1, midnight → midnight (the day curves; any length). */
  levels?: number[];
  /** Yesterday's samples 0–1 — the dashed compare curve (`battery-vs`). */
  compareLevels?: number[];
  /** NOW position as a fraction of the day → pulse + `% NOW` pill (BB-01). */
  now?: number;
  /** Drain attribution pills (`drain-events`). */
  events?: BatteryDrainEvent[];
  /** `battery-glyph` fill 0–1 — also the big % readout (BB-02). */
  level?: number;
  /** `battery-glyph` SELECT STATE: level + empty-ETA / charging bolt +
   *  full-ETA / low warning + advice pill. */
  state?: 'level' | 'charging' | 'low';
  /** `battery-glyph` rate/ETA caption (default per state). */
  eta?: string;
  /** `battery-glyph` low-state advice pill. */
  advice?: string;
  /** Caption above the glyph. */
  glyphLabel?: string;
  /** `battery-week` end-of-day levels 0–1 — the first seven are drawn. */
  days?: number[];
  /** `battery-week` day letters, one per battery. */
  dayLabels?: string;
  /** Sleep shading: asleep until this hour (violet wash from midnight). */
  sleepUntilH?: number;
  /** Sleep shading: asleep from this hour (violet wash to midnight). */
  sleepFromH?: number;
  /** CHARGING bolt + caption on the day curves (default on, the catalog look). */
  charging?: boolean;
  /** Bolt caption. */
  chargingLabel?: string;
  /** `battery-vs` series pills. */
  todayLabel?: string;
  compareLabel?: string;
  /** Top-left mono caption (e.g. 'BODY BATTERY · TODAY'). */
  title?: string;
  /** Top-right display stat. */
  stat?: string;
  /** `stat` color token. */
  statColor?: string;
  /** Interior gridlines + baseline on the day curves (the catalog grid). */
  grid?: boolean;
  /** Glow underlay along the curve / glyph fill (the catalog `cfg.shine`). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
  /** Optional container style. */
  style?: StyleProp<ViewStyle>;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_W = W - PAD.l - PAD.r; // 298
const PLOT_H = H - PAD.t - PAD.b; // 120
const GRID_ROWS = [0.25, 0.5, 0.75] as const;

/** Round for compact attribute values. */
const rd = (n: number) => Math.round(n * 100) / 100;
/** y of a 0–1 battery fraction. */
const yAt = (v: number) => PAD.t + (1 - v) * PLOT_H;

/** battery zone verdict — the catalog batteryIcon thresholds (0.55 / 0.25). */
const batteryZone = (v: number) => (v >= 0.55 ? colors.zoneHigh : v >= 0.25 ? colors.zoneMid : colors.zoneLow);

type Pt = [number, number];

/** Straight polyline through the points. */
function linePath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${rd(x)},${rd(y)}`).join(' ');
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (no overshoot). */
function monotonePath(pts: Pt[]): string {
  const n = pts.length;
  if (n < 3) return linePath(pts);
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
  let d = `M${rd(pts[0][0])},${rd(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${rd(pts[i][0] + h)},${rd(pts[i][1] + h * tg[i])} ${rd(pts[i + 1][0] - h)},${rd(
      pts[i + 1][1] - h * tg[i + 1],
    )} ${rd(pts[i + 1][0])},${rd(pts[i + 1][1])}`;
  }
  return d;
}

/** Mono catalog label (8.5px JetBrains Mono, ~.06em tracking). */
function Label({
  x,
  y,
  fill,
  anchor = 'middle',
  children,
}: {
  x: number;
  y: number;
  fill: string;
  anchor?: 'start' | 'middle' | 'end';
  children: string;
}) {
  return (
    <SvgText x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor} fontSize={8.5} fontFamily={fonts.mono} letterSpacing={0.5}>
      {children}
    </SvgText>
  );
}

/** Chip-pill tag (the catalog `tag()`): dark bg-0 pill + tinted hairline. */
function Tag({
  x,
  y,
  color,
  anchor = 'middle',
  text,
}: {
  x: number;
  y: number;
  color: string;
  anchor?: 'start' | 'middle' | 'end';
  text: string;
}) {
  const wpx = text.length * 5.35 + 12;
  let xa = anchor === 'end' ? x - wpx : anchor === 'start' ? x : x - wpx / 2;
  xa = Math.max(PAD.l - 4, Math.min(xa, W - PAD.r - wpx + 4));
  return (
    <G>
      <Rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(wpx)}
        height={13}
        rx={6.5}
        fill={`${colors.bg0}C7`}
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <SvgText
        x={rd(xa + wpx / 2)}
        y={rd(y + 2.8)}
        fill={color}
        textAnchor="middle"
        fontSize={8}
        fontFamily={fonts.mono}
        letterSpacing={0.4}
      >
        {text}
      </SvgText>
    </G>
  );
}

/** Glowing dot + static halo ring — the catalog `pulseDot`. Native draws a
 *  wider faint duplicate for the glow and a static ring for the pulse. */
function PulseDot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <G>
      <Circle cx={rd(x)} cy={rd(y)} r={6.6} fill={color} opacity={0.35} />
      <Circle cx={rd(x)} cy={rd(y)} r={3.6} fill={color} />
      <Circle cx={rd(x)} cy={rd(y)} r={7} fill="none" stroke={color} strokeWidth={1.4} opacity={0.4} />
    </G>
  );
}

/** The catalog lightning bolt — glow = a wider faint duplicate underneath. */
function Bolt({ x, y, s, color = colors.lime }: { x: number; y: number; s: number; color?: string }) {
  const d =
    `M${rd(x + 2 * s)} ${rd(y)}` +
    `l${rd(-3 * s)} ${rd(4.4 * s)}` +
    `h${rd(2.4 * s)}` +
    `l${rd(-1.6 * s)} ${rd(3.6 * s)}` +
    `l${rd(4 * s)} ${rd(-4.8 * s)}` +
    `h${rd(-2.4 * s)}z`;
  return (
    <G>
      <Path d={d} fill="none" stroke={color} strokeWidth={3} opacity={0.35} />
      <Path d={d} fill={color} stroke="none" />
    </G>
  );
}

/* BB-01 default day — the catalog's charge-at-night / drain-by-day shape
   (48 half-hour samples, seed 11 of the page's bbDay generator) */
const DEFAULT_LEVELS = [
  0.33, 0.37, 0.42, 0.46, 0.51, 0.55, 0.6, 0.64, 0.69, 0.73, 0.78, 0.82, 0.87, 0.91, 0.94, 0.95,
  0.93, 0.91, 0.89, 0.87, 0.86, 0.84, 0.82, 0.8, 0.78, 0.76, 0.75, 0.73, 0.66, 0.64, 0.62, 0.6,
  0.59, 0.57, 0.55, 0.53, 0.46, 0.45, 0.43, 0.41, 0.39, 0.37, 0.36, 0.34, 0.32, 0.3, 0.29, 0.33,
];

const DEFAULT_EVENTS: BatteryDrainEvent[] = [
  { at: 0.38, label: 'MEETING −8%' },
  { at: 0.58, label: 'NO LUNCH −6%' },
  { at: 0.8, label: 'TRAINING −12%' },
];

const DEFAULT_DAYS = [0.82, 0.64, 0.71, 0.45, 0.3, 0.88, 0.76];

/** day-axis ticks (the catalog dayAxis). */
const DAY_TICKS: Array<[string, number]> = [
  ['12A', 0],
  ['7A', 7 / 24],
  ['NOON', 0.5],
  ['6P', 0.75],
  ['11P', 23 / 24],
];

/**
 * BodyBattery — the body-battery family (catalog BB-01…BB-07): the % charge
 * curve over the day with a zone-gradient stroke (mint up high → amber →
 * coral down low), violet sleep shading and a CHARGING bolt; the battery
 * glyph status widget; drain attribution; the week of batteries; and the
 * day-over-day compare. All levels are 0–1 fractions of a full charge.
 */
export function BodyBattery({
  variant = 'battery-day',
  levels = DEFAULT_LEVELS,
  compareLevels,
  now,
  events = DEFAULT_EVENTS,
  level = 0.64,
  state = 'level',
  eta,
  advice = 'LOW — SKIP THE 6PM SESSION',
  glyphLabel = 'BODY BATTERY',
  days = DEFAULT_DAYS,
  dayLabels = 'MTWTFSS',
  sleepUntilH = 7,
  sleepFromH = 23,
  charging,
  chargingLabel = 'CHARGING',
  todayLabel = 'TODAY',
  compareLabel = 'YESTERDAY',
  title,
  stat,
  statColor = colors.text,
  grid = true,
  shine = false,
  ariaLabel = 'Body battery chart',
  style,
}: BodyBatteryProps) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const gradId = `lk-bb-z-${uid}`;
  const blurId = `lk-bb-blur-${uid}`;

  const isCurve = variant === 'battery-day' || variant === 'drain-events' || variant === 'battery-vs';
  const showBolt = charging ?? isCurve; // the catalog day curve always shows it

  let body: ReactNode = null;

  if (isCurve) {
    const n = levels.length;
    const pts: Pt[] = levels.map((v, i) => [PAD.l + (PLOT_W * i) / Math.max(1, n - 1), yAt(v)]);
    const d = monotonePath(pts);
    const nowI = now != null && n > 0 ? Math.max(0, Math.min(n - 1, Math.round(now * (n - 1)))) : null;
    body = (
      <G>
        {/* violet sleep shading (asleep until sleepUntilH · after sleepFromH) */}
        <Rect x={PAD.l} y={PAD.t} width={rd(PLOT_W * (sleepUntilH / 24))} height={PLOT_H} fill={colors.violet} opacity={0.08} />
        <Rect
          x={rd(PAD.l + PLOT_W * (sleepFromH / 24))}
          y={PAD.t}
          width={rd(PLOT_W * ((24 - sleepFromH) / 24))}
          height={PLOT_H}
          fill={colors.violet}
          opacity={0.08}
        />
        {/* dashed yesterday under today (battery-vs) */}
        {variant === 'battery-vs' && compareLevels && compareLevels.length >= 2 ? (
          <Path
            d={monotonePath(
              compareLevels.map((v, i) => [PAD.l + (PLOT_W * i) / Math.max(1, compareLevels.length - 1), yAt(v)]),
            )}
            fill="none"
            stroke={colors.text}
            strokeOpacity={0.3}
            strokeWidth={1.6}
            strokeDasharray={[4, 4]}
          />
        ) : null}
        {/* zone-gradient % curve. shine — a Gaussian-blurred duplicate behind the
            crisp curve: the native twin of the web `.lk-bb-shine` blur(5px)
            underlay. (Wide un-blurred copies read as hard outlines on device.) */}
        {shine ? (
          <Path
            d={d}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={7.5}
            strokeLinecap="round"
            opacity={0.45}
            filter={`url(#${blurId})`}
          />
        ) : null}
        <Path d={d} fill="none" stroke={`url(#${gradId})`} strokeWidth={2.5} strokeLinecap="round" />
        {showBolt ? (
          <G>
            <Bolt x={PAD.l + PLOT_W * 0.06} y={PAD.t + 14} s={1.6} />
            <Label x={PAD.l + PLOT_W * 0.06 + 12} y={PAD.t + 26} fill={colors.lime} anchor="start">
              {chargingLabel}
            </Label>
          </G>
        ) : null}
        {/* NOW pulse + % pill (BB-01) */}
        {nowI != null ? (
          <G>
            <PulseDot x={pts[nowI][0]} y={pts[nowI][1]} color={colors.zoneHigh} />
            <Tag x={pts[nowI][0]} y={pts[nowI][1] - 15} color={colors.zoneHigh} text={`${Math.round(levels[nowI] * 100)}% NOW`} />
          </G>
        ) : null}
        {/* coral drain pills at the dips (BB-05) */}
        {variant === 'drain-events' && n > 0
          ? events.map((ev, di) => {
              const xi = Math.max(0, Math.min(n - 1, Math.round(ev.at * (n - 1))));
              return <Tag key={di} x={pts[xi][0]} y={pts[xi][1] + 16 + (di % 2) * 16} color={colors.zoneLow} text={ev.label} />;
            })
          : null}
        {/* series pills (BB-07) */}
        {variant === 'battery-vs' ? (
          <G>
            <Tag x={W - PAD.r - 4} y={26} color={colors.zoneHigh} anchor="end" text={todayLabel} />
            <Tag x={W - PAD.r - 4} y={42} color={colors.textDim} anchor="end" text={compareLabel} />
          </G>
        ) : null}
        {/* day axis */}
        {DAY_TICKS.map(([t, f]) => (
          <Label key={t} x={PAD.l + PLOT_W * f} y={H - 2} fill={colors.textFaint} anchor={f === 0 ? 'start' : 'middle'}>
            {t}
          </Label>
        ))}
      </G>
    );
  } else if (variant === 'battery-glyph') {
    /* BB-02 — big battery glyph + state readout */
    const lv = Math.max(0, Math.min(1, level));
    const col = batteryZone(lv);
    const bx = 42;
    const by = 52;
    const bw = 130;
    const bh = 46;
    const fillW = Math.max(4, (bw - 6) * lv);
    const isCharging = state === 'charging';
    const etaText = eta ?? (isCharging ? '+9%/H · FULL BY 6:40' : '−4%/H · EMPTY 21:20');
    body = (
      <G>
        <Rect
          x={bx}
          y={by}
          width={bw}
          height={bh}
          rx={rd(bh * 0.22)}
          fill={colors.glass}
          stroke={colors.text}
          strokeOpacity={0.25}
          strokeWidth={1.5}
        />
        <Rect x={bx + bw} y={rd(by + bh * 0.3)} width={4} height={rd(bh * 0.4)} rx={2} fill={colors.text} opacity={0.25} />
        {/* shine — a Gaussian-blurred duplicate of the fill behind it: the native
            twin of the web `.lk-bb-shine` blur(5px) glyph underlay. */}
        {shine ? (
          <Rect
            x={bx + 1}
            y={by + 1}
            width={rd(fillW + 4)}
            height={bh - 2}
            rx={rd(bh * 0.2)}
            fill={col}
            opacity={0.3}
            filter={`url(#${blurId})`}
          />
        ) : null}
        <Rect x={bx + 3} y={by + 3} width={rd(fillW)} height={bh - 6} rx={rd(bh * 0.16)} fill={col} opacity={0.9} />
        {/* charging is conveyed by the ETA caption alone — the in-glyph bolt was
            dropped (too large at this scale, and black-on-black below ~50% fill). */}
        <SvgText x={206} y={84} fill={col} fontSize={30} fontFamily={fonts.display} fontWeight="700" letterSpacing={-0.6}>
          {`${Math.round(lv * 100)}%`}
        </SvgText>
        <Label x={206} y={100} fill={colors.textDim} anchor="start">
          {etaText}
        </Label>
        <Label x={bx + 65} y={40} fill={colors.textFaint}>
          {glyphLabel}
        </Label>
        {state === 'low' ? <Tag x={bx + 65} y={118} color={colors.zoneLow} text={advice} /> : null}
      </G>
    );
  } else {
    /* BB-06 — 7 mini vertical batteries */
    const week = days.slice(0, 7);
    body = (
      <G>
        {week.map((v, i) => {
          const x = PAD.l + 14 + (i * (PLOT_W - 20)) / 7;
          const col = batteryZone(v);
          return (
            <G key={i}>
              <Rect
                x={rd(x)}
                y={PAD.t + 14}
                width={22}
                height={74}
                rx={6}
                fill={colors.glass}
                stroke={colors.text}
                strokeOpacity={0.22}
                strokeWidth={1.2}
              />
              <Rect x={rd(x + 7)} y={PAD.t + 10} width={8} height={4} rx={1.5} fill={colors.text} opacity={0.22} />
              <Rect
                x={rd(x + 2.5)}
                y={rd(PAD.t + 14 + 71 - 68 * v)}
                width={17}
                height={rd(68 * v)}
                rx={4}
                fill={col}
                opacity={0.9}
              />
              <Label x={x + 11} y={H - 12} fill={col}>
                {String(Math.round(v * 100))}
              </Label>
              <Label x={x + 11} y={H - 2} fill={colors.textFaint}>
                {dayLabels[i] ?? ''}
              </Label>
            </G>
          );
        })}
      </G>
    );
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={ariaLabel} style={[styles.root, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {isCurve ? (
          <Defs>
            {/* zone stroke: mint up high → amber → coral down low, fixed to the plot */}
            <LinearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1={PAD.t} x2="0" y2={H - PAD.b}>
              <Stop offset="0%" stopColor={colors.zoneHigh} />
              <Stop offset="55%" stopColor={colors.zoneMid} />
              <Stop offset="100%" stopColor={colors.zoneLow} />
            </LinearGradient>
          </Defs>
        ) : null}
        {shine ? (
          /* real Gaussian blur for the shine (Fabric-native in react-native-svg 15)
             — the native twin of the web `.lk-bb-shine` blur(5px). Region in user
             space over the full canvas so flat curves never clip the blur. */
          <Defs>
            <Filter id={blurId} filterUnits="userSpaceOnUse" x={-10} y={-10} width={W + 20} height={H + 20}>
              <FeGaussianBlur stdDeviation={2.5} />
            </Filter>
          </Defs>
        ) : null}
        {/* catalog grid: 3 interior rows + solid baseline (day curves only) */}
        {isCurve && grid ? (
          <G>
            {GRID_ROWS.map((f) => (
              <Line
                key={f}
                x1={PAD.l}
                x2={W - PAD.r}
                y1={rd(PAD.t + PLOT_H * f)}
                y2={rd(PAD.t + PLOT_H * f)}
                stroke={colors.border}
                strokeOpacity={0.55}
                strokeWidth={1}
              />
            ))}
            <Line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke={colors.border} strokeWidth={1} />
          </G>
        ) : null}
        {title ? (
          <Label x={PAD.l + 2} y={11} fill={colors.textFaint} anchor="start">
            {title}
          </Label>
        ) : null}
        {stat ? (
          <SvgText x={W - PAD.r - 2} y={12} fill={statColor} textAnchor="end" fontSize={12} fontFamily={fonts.display} fontWeight="700">
            {stat}
          </SvgText>
        ) : null}
        {body}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  /* fixed catalog aspect (320×150); the Svg scales the viewBox to fit */
  root: { width: '100%', aspectRatio: W / H },
});
