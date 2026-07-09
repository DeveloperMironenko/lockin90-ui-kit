import { useId, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, FeGaussianBlur, Filter, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** Catalog variant names (`lockin90-design/charts/environment-charts.html`, EN-01…EN-04). */
export type EnvironmentChartVariant = 'sun-uv-arc' | 'pollen-rows' | 'aqi-day' | 'outdoor-window';

export interface EnvironmentChartProps {
  /** chart form (default `'sun-uv-arc'`, EN-01) */
  variant?: EnvironmentChartVariant;
  /** `sun-uv-arc` — sunrise, fractional hours (default 5.78 → '05:47') */
  sunrise?: number;
  /** `sun-uv-arc` — sunset, fractional hours (default 21.2 → '21:12') */
  sunset?: number;
  /** `sun-uv-arc` + `aqi-day` — the NOW hour, 0–24 (default 14). The pulse on
   *  the sun arc / the AQI curve (nearest hourly point). `null` hides it. */
  now?: number | null;
  /** `sun-uv-arc` — the day's max UV index (default 7); the arc's UV curve is
   *  `sin(t·π)·peakUv`, segment color cyan < 3 / amber < 6 / coral ≥ 6 */
  peakUv?: number;
  /** `sun-uv-arc` — NOW caption override (default computed 'NOW · UV n') */
  nowLabel?: string;
  /** `sun-uv-arc` — top-right peak pill override (default computed
   *  'UV {peakUv} PEAK · {solar noon}') */
  peak?: string;
  /** `pollen-rows` — 16 hourly 0–1 loads per kind, `startHour` first */
  tree?: number[];
  grass?: number[];
  weed?: number[];
  /** `pollen-rows` — top-right worst-window pill (default 'GRASS HIGH 10–14');
   *  computing the worst window is the caller's job. `''` hides it. */
  flag?: string;
  /** `aqi-day` — 16 hourly 0–1 values (AQI/100), `startHour` first */
  aqi?: number[];
  /** `aqi-day` — the dashed rule position, 0–1 (default 0.5 = AQI 50) */
  threshold?: number;
  /** `aqi-day` — the rule's caption (default 'MODERATE >50') */
  thresholdLabel?: string;
  /** `aqi-day` — NOW verdict pill override (default computed
   *  'AQI {value} · GOOD/MODERATE' at the `now` point) */
  verdict?: string;
  /** `outdoor-window` — 16 hourly 0–1 rows, `startHour` first */
  uv?: number[];
  pollen?: number[];
  air?: number[];
  /** `outdoor-window` — the best-window bounds, fractional hours
   *  (defaults 17 → 19.5); computing the window is the caller's job */
  windowStart?: number;
  windowEnd?: number;
  /** `outdoor-window` — window pill override (default computed
   *  'BEST WINDOW · {start}–{end}') */
  windowLabel?: string;
  /** first hour of the 16 hourly cells (default 6 → cells 6:00–22:00) */
  startHour?: number;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** bottom hint — `pollen-rows` 'CELL BRIGHTNESS = POLLEN LOAD' /
   *  `outdoor-window` 'ALL THREE LOW = GO OUTSIDE'. `''` hides it. */
  caption?: string;
  /** glow underlay behind the sun arc (catalog shine — `sun-uv-arc` only,
   *  like the catalog) — a Gaussian-blurred duplicate stroke on native */
  shine?: boolean;
  /** rendered width in px — the 320×150 viewBox scales to fit */
  width?: number;
  /** rendered height in px */
  height?: number;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/* --------------------------------------------------------------- geometry
 * The catalog canvas: 320×150, pad l10 r12 t16 b14. Sun arc: horizon y 112,
 * amplitude 70, x 30→288. Hourly cells: x0 84, cell width 13, 16 cells
 * (startHour 6 → 22:00). AQI curve: x 30 + i·17.2, half-step 8.6. */
const W = 320;
const H = 150;
const P = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_H = H - P.t - P.b;

const HORIZON = 112;
const AMP = 70;
const SUN_X0 = 30;
const SUN_SPAN = 258;
const SEGMENTS = 40;

const CELL_X0 = 84;
const CELL_W = 13;
const CELLS = 16;

const AQI_X0 = 30;
const AQI_STEP = 17.2;

/* chip-pill fill — the catalog tag()'s rgba(8,10,18,0.78) = bg0 @ 78% */
const TAG_FILL = `${colors.bg0}C7`;
/* horizon — the catalog's rgba(255,255,255,0.12) = text @ 12% */
const HORIZON_STROKE = `${colors.text}1F`;
/* inner grid lines — the catalog grid()'s rgba(255,255,255,0.05) = text @ 5% */
const GRID_FAINT = `${colors.text}0D`;

/* the catalog's hourly demo arrays (6:00 → 22:00) */
const UV16 = [0, 0.05, 0.15, 0.3, 0.5, 0.75, 0.9, 1, 0.95, 0.8, 0.6, 0.4, 0.22, 0.1, 0.02, 0];
const POL16 = [0.2, 0.3, 0.45, 0.7, 0.9, 0.95, 0.9, 0.8, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1];
const AQI16 = [0.3, 0.35, 0.5, 0.6, 0.55, 0.5, 0.45, 0.4, 0.42, 0.38, 0.3, 0.25, 0.2, 0.2, 0.25, 0.3];
const TREE16 = [0.5, 0.6, 0.7, 0.75, 0.7, 0.6, 0.5, 0.45, 0.4, 0.3, 0.25, 0.2, 0.2, 0.15, 0.1, 0.1];
const GRASS16 = [0.3, 0.4, 0.55, 0.75, 0.9, 1, 0.95, 0.85, 0.6, 0.45, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];
const WEED16 = [0.15, 0.2, 0.2, 0.3, 0.35, 0.4, 0.4, 0.35, 0.3, 0.3, 0.25, 0.2, 0.15, 0.15, 0.1, 0.1];

const DEFAULT_TITLES: Record<EnvironmentChartVariant, string> = {
  'sun-uv-arc': 'SUN · TODAY',
  'pollen-rows': 'POLLEN · HOURLY',
  'aqi-day': 'AIR QUALITY',
  'outdoor-window': 'TRAIN OUTSIDE?',
};

const DEFAULT_CAPTIONS: Record<EnvironmentChartVariant, string> = {
  'sun-uv-arc': '',
  'pollen-rows': 'CELL BRIGHTNESS = POLLEN LOAD',
  'aqi-day': '',
  'outdoor-window': 'ALL THREE LOW = GO OUTSIDE',
};

/** value → plot y (the catalog's `Y`) */
function Y(v: number): number {
  return P.t + (1 - v) * PLOT_H;
}

/** UV index → segment color (the catalog's `uvCol`) */
function uvColor(uvIndex: number): string {
  return uvIndex < 3 ? colors.cyan : uvIndex < 6 ? colors.zoneMid : colors.zoneLow;
}

/** pollen/air load → cell color (the catalog's `cellRow` scale — LOW is good) */
function loadColor(v: number): string {
  return v < 0.34 ? colors.mint : v < 0.67 ? colors.zoneMid : colors.zoneLow;
}

/** point on the sun path at day-fraction t (the catalog's `sunPt`) */
function sunPt(t: number): { x: number; y: number } {
  return { x: SUN_X0 + t * SUN_SPAN, y: HORIZON - Math.sin(t * Math.PI) * AMP };
}

/** fractional hours → zero-padded 'HH:MM' (5.78 → '05:47') */
function fmtTime(h: number): string {
  const norm = ((h % 24) + 24) % 24;
  let hr = Math.floor(norm);
  let min = Math.round((norm - hr) * 60);
  if (min === 60) {
    hr = (hr + 1) % 24;
    min = 0;
  }
  return `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
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
    <SvgText x={x} y={y} fill={color} fontSize={8.5} textAnchor={anchor} fontFamily={fonts.mono} letterSpacing={0.5}>
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

/** NOW marker — static dot + faint halo ring (no SMIL/JS animation on native;
 *  the web pulse ring is a documented substrate diff, like `Ring`/`DayWheel`) */
function PulseDot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <G>
      <Circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={7} fill="none" stroke={color} strokeWidth={1.4} strokeOpacity={0.4} />
      <Circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={3.6} fill={color} />
    </G>
  );
}

/** one hourly cell row (the catalog's `cellRow`) */
function CellRow({ y, name, vals }: { y: number; name: string; vals: number[] }) {
  return (
    <G>
      <Label x={CELL_X0 - 8} y={y + 3.5} text={name} color={colors.textDim} anchor="end" />
      {vals.slice(0, CELLS).map((v, i) => (
        <Rect
          key={i}
          x={CELL_X0 + i * CELL_W}
          y={y - 4.5}
          width={CELL_W - 1.5}
          height={9}
          rx={2.5}
          fill={loadColor(v)}
          opacity={0.16 + v * 0.62}
        />
      ))}
    </G>
  );
}

/** hour captions under a cell strip (the catalog's `hoursUnder`) */
function HoursUnder({ x0, cw, y, startHour }: { x0: number; cw: number; y: number; startHour: number }) {
  return (
    <G>
      {[0, 4, 8, 12, 16].map((k) => (
        <Label key={k} x={x0 + (k / CELLS) * (CELLS * cw)} y={y} text={`${startHour + k}:00`} />
      ))}
    </G>
  );
}

/**
 * EnvironmentChart — the catalog environment family (`environment-charts`,
 * EN-01…EN-04): UV, pollen, air — when to train outside. Native twin of
 * `@lockin90/ui` EnvironmentChart — same prop API + geometry; the web SMIL
 * NOW-pulse is a static dot + faint halo ring here, and the sun-arc `shine`
 * glow is a real Gaussian-blurred duplicate stroke (Fabric-native SVG
 * filters in react-native-svg 15).
 *
 * - `sun-uv-arc` (EN-01, default) — the sun path sunrise→sunset, 40 segments
 *   colored by UV (cyan low / amber mid / coral high) + NOW pulse on the arc +
 *   horizon with times + PEAK pill. THE daylight/UV widget.
 * - `pollen-rows` (EN-02) — 3 hourly cell rows (tree/grass/weed),
 *   brightness + color = load, worst window flagged.
 * - `aqi-day` (EN-03) — stepped AQI curve + area, dashed MODERATE rule + NOW
 *   pulse with verdict pill.
 * - `outdoor-window` (EN-04) — UV + pollen + air rows stacked + the computed
 *   mint BEST WINDOW box where all three are low.
 *
 * Hourly values are 0–1 (`aqi` = AQI/100), 16 cells from `startHour`; times
 * are fractional hours. Geometry is the catalog's 320×150 canvas (scaled via
 * `width`/`height`); tokens only.
 */
export function EnvironmentChart({
  variant = 'sun-uv-arc',
  sunrise = 5.78,
  sunset = 21.2,
  now = 14,
  peakUv = 7,
  nowLabel,
  peak,
  tree = TREE16,
  grass = GRASS16,
  weed = WEED16,
  flag = 'GRASS HIGH 10–14',
  aqi = AQI16,
  threshold = 0.5,
  thresholdLabel = 'MODERATE >50',
  verdict,
  uv = UV16,
  pollen = POL16,
  air = AQI16,
  windowStart = 17,
  windowEnd = 19.5,
  windowLabel,
  startHour = 6,
  title,
  caption,
  shine = false,
  width = W,
  height = H,
  style,
}: EnvironmentChartProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const blurId = `lk-env-blur-${uid}`;
  const heading = title ?? DEFAULT_TITLES[variant];
  const hint = caption ?? DEFAULT_CAPTIONS[variant];

  let accessibilityLabel: string;
  let content: ReactNode;

  if (variant === 'sun-uv-arc') {
    /* --------------------------------------------------- EN-01 sun-uv-arc */
    const tNow = now != null ? (now - sunrise) / (sunset - sunrise) : null;
    const np = tNow != null && tNow >= 0 && tNow <= 1 ? sunPt(tNow) : null;
    const uvNow = tNow != null ? Math.sin(Math.max(0, Math.min(1, tNow)) * Math.PI) * peakUv : 0;
    const nowText = nowLabel ?? `NOW · UV ${Math.round(uvNow)}`;
    const peakText = peak ?? `UV ${Math.round(peakUv)} PEAK · ${fmtTime((sunrise + sunset) / 2)}`;
    accessibilityLabel = `${heading}: sun path ${fmtTime(sunrise)}–${fmtTime(sunset)}${
      now != null ? `, ${nowText.toLowerCase()}` : ''
    }`;
    content = (
      <>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        {shine ? (
          /* real Gaussian blur for the arc shine (Fabric-native in react-native-svg
             15) — the native twin of the web segments' `blur(5px)`. Region in user
             space over the full canvas so flat segments never clip the blur. */
          <Defs>
            <Filter id={blurId} filterUnits="userSpaceOnUse" x={-10} y={-10} width={W + 20} height={H + 20}>
              <FeGaussianBlur stdDeviation={2.5} />
            </Filter>
          </Defs>
        ) : null}
        <Line x1={P.l} x2={W - P.r} y1={HORIZON} y2={HORIZON} stroke={HORIZON_STROKE} strokeWidth={1} />
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const t0 = i / SEGMENTS;
          const t1 = (i + 1) / SEGMENTS;
          const a = sunPt(t0);
          const b = sunPt(t1);
          const c = uvColor(Math.sin(((t0 + t1) / 2) * Math.PI) * peakUv);
          return (
            <G key={i}>
              {/* shine — a Gaussian-blurred duplicate segment behind the crisp one
                  (the web segment's `blur(5px)` underlay) */}
              {shine ? (
                <Line
                  x1={a.x.toFixed(1)}
                  y1={a.y.toFixed(1)}
                  x2={b.x.toFixed(1)}
                  y2={b.y.toFixed(1)}
                  stroke={c}
                  strokeWidth={8}
                  strokeLinecap="round"
                  opacity={0.4}
                  filter={`url(#${blurId})`}
                />
              ) : null}
              <Line
                x1={a.x.toFixed(1)}
                y1={a.y.toFixed(1)}
                x2={b.x.toFixed(1)}
                y2={b.y.toFixed(1)}
                stroke={c}
                strokeWidth={3.2}
                strokeLinecap="round"
              />
            </G>
          );
        })}
        {np ? (
          <G>
            <PulseDot x={np.x} y={np.y} color={colors.text} />
            <Label x={np.x} y={np.y - 12} text={nowText} color={colors.textDim} />
          </G>
        ) : null}
        <Label x={SUN_X0} y={HORIZON + 12} text={fmtTime(sunrise)} />
        <Label x={SUN_X0 + SUN_SPAN} y={HORIZON + 12} text={fmtTime(sunset)} />
        <Label x={SUN_X0} y={HORIZON + 24} text="SUNRISE" />
        <Label x={SUN_X0 + SUN_SPAN} y={HORIZON + 24} text="SUNSET" />
        {peakText ? <Tag x={W - P.r - 6} y={26} text={peakText} color={colors.zoneLow} anchor="end" /> : null}
      </>
    );
  } else if (variant === 'pollen-rows') {
    /* -------------------------------------------------- EN-02 pollen-rows */
    accessibilityLabel = `${heading}: hourly tree, grass and weed pollen loads${
      flag ? ` — ${flag.toLowerCase()}` : ''
    }`;
    content = (
      <>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        <CellRow y={48} name="TREE" vals={tree} />
        <CellRow y={74} name="GRASS" vals={grass} />
        <CellRow y={100} name="WEED" vals={weed} />
        <HoursUnder x0={CELL_X0} cw={CELL_W} y={124} startHour={startHour} />
        {flag ? <Tag x={W - P.r - 6} y={26} text={flag} color={colors.zoneLow} anchor="end" /> : null}
        {hint ? <Label x={160} y={142} text={hint} /> : null}
      </>
    );
  } else if (variant === 'aqi-day') {
    /* ------------------------------------------------------ EN-03 aqi-day */
    const vals = aqi.slice(0, CELLS);
    const pts = vals.map((v, i) => ({ x: AQI_X0 + i * AQI_STEP, y: Y(v) }));
    let d = '';
    pts.forEach((q, i) => {
      d +=
        (i ? `L${(q.x - 8.6).toFixed(1)} ${q.y.toFixed(1)}` : `M${(q.x - 8.6).toFixed(1)} ${q.y.toFixed(1)}`) +
        `L${(q.x + 8.6).toFixed(1)} ${q.y.toFixed(1)}`;
    });
    const idx =
      now != null && pts.length > 0
        ? Math.max(0, Math.min(pts.length - 1, Math.round(now - startHour)))
        : null;
    const nowPt = idx != null ? pts[idx] : null;
    const nowVal = idx != null ? vals[idx] : 0;
    const good = nowVal < threshold;
    const verdictText = verdict ?? `AQI ${Math.round(nowVal * 100)} · ${good ? 'GOOD' : 'MODERATE'}`;
    accessibilityLabel = `${heading}: hourly air quality${nowPt ? ` — ${verdictText.toLowerCase()}` : ''}`;
    content = (
      <>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        {[0.25, 0.5, 0.75].map((f) => (
          <Line
            key={f}
            x1={P.l}
            x2={W - P.r}
            y1={P.t + PLOT_H * f}
            y2={P.t + PLOT_H * f}
            stroke={GRID_FAINT}
            strokeWidth={1}
          />
        ))}
        <Line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke={colors.border} strokeWidth={1} />
        {pts.length > 0 ? (
          <>
            <Path
              d={`${d}L${(pts[pts.length - 1].x + 8.6).toFixed(1)} ${H - P.b}L${(pts[0].x - 8.6).toFixed(1)} ${
                H - P.b
              }Z`}
              fill={colors.cyan}
              opacity={0.12}
            />
            <Path d={d} fill="none" stroke={colors.cyan} strokeWidth={2} />
          </>
        ) : null}
        <Line
          x1={P.l}
          x2={W - P.r}
          y1={Y(threshold)}
          y2={Y(threshold)}
          stroke={colors.zoneMid}
          strokeWidth={1}
          strokeDasharray={[4, 4]}
          opacity={0.7}
        />
        {thresholdLabel ? (
          <Label x={P.l + 2} y={Y(threshold) - 5} text={thresholdLabel} color={colors.zoneMid} anchor="start" />
        ) : null}
        {nowPt ? (
          <G>
            <PulseDot x={nowPt.x} y={nowPt.y} color={colors.cyan} />
            <Tag
              x={nowPt.x + 6}
              y={nowPt.y - 14}
              text={verdictText}
              color={good ? colors.mint : colors.zoneMid}
              anchor="start"
            />
          </G>
        ) : null}
        <HoursUnder x0={AQI_X0} cw={AQI_STEP} y={H - 3} startHour={startHour} />
      </>
    );
  } else {
    /* ------------------------------------------------- EN-04 outdoor-window */
    const bx = CELL_X0 + (windowStart - startHour) * CELL_W;
    const bw = (windowEnd - windowStart) * CELL_W;
    const windowText = windowLabel ?? `BEST WINDOW · ${fmtTime(windowStart)}–${fmtTime(windowEnd)}`;
    accessibilityLabel = `${heading}: UV, pollen and air rows — ${windowText.toLowerCase()}`;
    content = (
      <>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        <CellRow y={44} name="UV" vals={uv} />
        <CellRow y={64} name="POLLEN" vals={pollen} />
        <CellRow y={84} name="AIR" vals={air} />
        <Rect x={(bx - 3).toFixed(1)} y={30} width={(bw + 6).toFixed(1)} height={64} rx={8} fill={colors.mint} opacity={0.08} />
        <Rect
          x={(bx - 3).toFixed(1)}
          y={30}
          width={(bw + 6).toFixed(1)}
          height={64}
          rx={8}
          fill="none"
          stroke={colors.mint}
          strokeWidth={1.2}
        />
        <Tag x={bx + bw / 2} y={110} text={windowText} color={colors.mint} />
        <HoursUnder x0={CELL_X0} cw={CELL_W} y={130} startHour={startHour} />
        {hint ? <Label x={160} y={146} text={hint} /> : null}
      </>
    );
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        {content}
      </Svg>
    </View>
  );
}
