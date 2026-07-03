import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* BiomarkerRange — the shared catalog biomarker family (BR-01…BR-05,
   lockin90-design/charts/biomarker-charts.html): lab results the readable way —
   a value dot inside its reference range, drawn in a fixed 320×150 viewBox with
   mono catalog labels. Native twin of `@lockin90/ui` BiomarkerRange — same prop
   API; shine is a wider faint duplicate shape and the BR-02 pulse is a static
   duplicate halo (never SVG filters / CSS animation on native). SUPERSEDES the
   web-only ADMIN ReferenceRangeBar for product surfaces (that one has no
   native twin and stays in `@lockin90/ui/admin`). */

export type BiomarkerRangeVariant =
  | 'panel-rows' /* BR-01 — marker rows: faint scale + mint band + value dot + LOW/HIGH flags */
  | 'single-marker' /* BR-02 — one large labeled row: zones, range numbers, pulsing dot + result */
  | 'marker-trend' /* BR-03 — rows + last-4-tests spark + direction arrow per marker */
  | 'panel-grid' /* BR-04 — 2×3 tiles: name + OK/LOW/HIGH verdict + mini row + value */
  | 'range-history'; /* BR-05 — one marker over test dates, line crossing into the band */

/** Trend verdict for `marker-trend` — normally derived from `history`. */
export type BiomarkerTrend = 'improving' | 'worsening' | 'flat';

/** One lab marker: a measured value on a display scale with a reference range. */
export interface BiomarkerMarker {
  /** Short marker name, drawn in mono (e.g. 'VIT D'). */
  name: string;
  /** Latest measured value (same units as the scale). */
  value: number;
  /** Scale floor — the left edge of the drawn track. */
  min: number;
  /** Scale ceiling — the right edge of the drawn track. */
  max: number;
  /** Reference-range lower bound (start of the mint band). */
  low: number;
  /** Reference-range upper bound (end of the mint band). */
  high: number;
  /** Unit appended to the readout (e.g. 'NG/ML' → '48 NG/ML'). */
  unit?: string;
  /** Preformatted readout override when `value + unit` doesn't cut it ('5.2%'). */
  display?: string;
  /** Past test values, oldest → newest (last ≈ `value`). `marker-trend` sparks
   *  the last 4; `range-history` plots them all. */
  history?: number[];
  /** Per-test date labels for `range-history`'s x-axis (pairs with `history`). */
  dates?: string[];
  /** Explicit trend override for `marker-trend` (else derived from `history`:
   *  moved toward the range = improving, away = worsening, else flat). */
  trend?: BiomarkerTrend;
}

export interface BiomarkerRangeProps {
  /** The lab markers. `single-marker` / `range-history` use the first one. */
  markers?: BiomarkerMarker[];
  /** Catalog variant (BR-01 / BR-02 / BR-03 / BR-04 / BR-05). */
  variant?: BiomarkerRangeVariant;
  /** Top-left mono caption (e.g. 'BLOOD PANEL · JUN'). */
  title?: string;
  /** Bottom faint legend line. Defaults to the catalog teaching caption per
   *  variant ('BAND = REFERENCE RANGE · DOT = YOUR VALUE', 'SPARK = LAST 4
   *  TESTS', `single-marker`'s derived 'NAME · OPTIMAL low–high'); '' hides it. */
  caption?: string;
  /** `range-history` context pill, top-right, mint ('SUPPLEMENTED SINCE FEB'). */
  note?: string;
  /** `range-history` state pill anchored at the first test, coral ('DEFICIENT'). */
  flag?: string;
  /** Soft color glow on the value dots (the catalog glow modifier). */
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
const PLOT_H = H - PAD.t - PAD.b; // 120

/** `marker-trend` sparks the LAST 4 tests (the catalog's spark window). */
const SPARK_TESTS = 4;

/* the catalog card's teaching captions — overridable / hideable via `caption` */
const DEFAULT_CAPTIONS: Partial<Record<BiomarkerRangeVariant, string>> = {
  'panel-rows': 'BAND = REFERENCE RANGE · DOT = YOUR VALUE',
  'marker-trend': 'SPARK = LAST 4 TESTS',
};

/* the catalog PANEL, on real-ish scales (fractions match biomarker-charts.html) */
const DEFAULT_MARKERS: BiomarkerMarker[] = [
  {
    name: 'VIT D',
    value: 48,
    min: 0,
    max: 86,
    low: 30,
    high: 60,
    unit: 'NG/ML',
    history: [17, 26, 38, 45, 48],
    dates: ['JAN', 'MAR', 'MAY', 'JUL', 'NOW'],
  },
  { name: 'FERRITIN', value: 22, min: 0, max: 120, low: 36, high: 90, unit: 'UG/L', history: [48, 38, 30, 22] },
  { name: 'HBA1C', value: 5.2, min: 3, max: 8.5, low: 4.1, high: 6, display: '5.2%', history: [5.3, 5.2, 5.25, 5.2] },
  { name: 'LDL', value: 4.4, min: 0, max: 5.6, low: 0.8, high: 3.4, unit: 'MMOL', history: [3.0, 3.6, 4.1, 4.4] },
];

/** Round for compact attribute values. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** A value's 0–1 position on the marker's display scale, clamped. */
const fracOf = (m: BiomarkerMarker, v: number) =>
  Math.max(0, Math.min(1, (v - m.min) / (m.max - m.min || 1)));

/** Out-of-range state — the LOW/HIGH flag text, or null when in range. */
const stateOf = (m: BiomarkerMarker) =>
  m.value < m.low ? 'LOW' : m.value > m.high ? 'HIGH' : null;

/** The readout string: explicit `display`, else `value` (+ unit). */
const readoutOf = (m: BiomarkerMarker) => m.display ?? `${m.value}${m.unit ? ` ${m.unit}` : ''}`;

/** Compact readout for the trend column — the number only ('48', '5.2%'). */
const shortReadoutOf = (m: BiomarkerMarker) => readoutOf(m).split(' ')[0];

/** Distance outside the reference range (0 while inside). */
const offRange = (m: BiomarkerMarker, v: number) =>
  v < m.low ? m.low - v : v > m.high ? v - m.high : 0;

/** Derive the trend verdict from the spark window: moved toward the reference
 *  range = improving, away = worsening, else flat (in-range drift is neutral). */
function trendOf(m: BiomarkerMarker): BiomarkerTrend {
  if (m.trend) return m.trend;
  const hist = (m.history ?? []).slice(-SPARK_TESTS);
  if (hist.length < 2) return 'flat';
  const d = offRange(m, hist[hist.length - 1]) - offRange(m, hist[0]);
  return d < 0 ? 'improving' : d > 0 ? 'worsening' : 'flat';
}

/** Direction arrow: raw spark delta sign; flat is always '→'. */
function arrowOf(m: BiomarkerMarker, trend: BiomarkerTrend): string {
  if (trend === 'flat') return '→';
  const hist = (m.history ?? []).slice(-SPARK_TESTS);
  if (hist.length >= 2) return hist[hist.length - 1] >= hist[0] ? '↑' : '↓';
  return trend === 'improving' ? '↑' : '↓';
}

const TREND_COLORS: Record<BiomarkerTrend, string> = {
  improving: colors.mint,
  worsening: colors.zoneLow,
  flat: colors.textDim,
};

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
    <SvgText
      x={rd(x)}
      y={rd(y)}
      fill={fill}
      textAnchor={anchor}
      fontSize={8.5}
      fontFamily={fonts.mono}
      letterSpacing={0.5}
    >
      {children}
    </SvgText>
  );
}

/** Chip-pill annotation (dark rounded rect + tinted hairline + mono text). */
function Tag({
  x,
  y,
  color,
  anchor = 'middle',
  children,
}: {
  x: number;
  y: number;
  color: string;
  anchor?: 'start' | 'middle' | 'end';
  children: string;
}) {
  const w = children.length * 5.35 + 12;
  let xa = anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2;
  xa = Math.max(PAD.l - 4, Math.min(xa, W - PAD.r - w + 4));
  return (
    <G>
      <Rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(w)}
        height={13}
        rx={6.5}
        fill={colors.bg0}
        fillOpacity={0.78}
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <SvgText
        x={rd(xa + w / 2)}
        y={rd(y + 2.8)}
        fill={color}
        textAnchor="middle"
        fontSize={8}
        fontFamily={fonts.mono}
        letterSpacing={0.4}
      >
        {children}
      </SvgText>
    </G>
  );
}

/** State-colored value dot; shine = wider faint duplicate circle behind it
 *  (the native glow — never SVG filters). */
function Dot({ x, y, r, color, shine }: { x: number; y: number; r: number; color: string; shine: boolean }) {
  return (
    <G>
      {shine ? <Circle cx={rd(x)} cy={rd(y)} r={r + 3} fill={color} opacity={0.35} /> : null}
      <Circle
        cx={rd(x)}
        cy={rd(y)}
        r={r}
        fill={color}
        stroke={colors.bg0}
        strokeOpacity={0.85}
        strokeWidth={1.2}
      />
    </G>
  );
}

/** One range row: faint scale + mint reference band + state-colored value dot. */
function MarkerRow({
  m,
  y,
  x0,
  x1,
  shine,
  trackH = 5,
  showName = true,
  showVal = true,
  showFlag = true,
}: {
  m: BiomarkerMarker;
  y: number;
  x0: number;
  x1: number;
  shine: boolean;
  trackH?: number;
  showName?: boolean;
  showVal?: boolean;
  showFlag?: boolean;
}) {
  const w = x1 - x0;
  const bad = stateOf(m);
  const fLo = fracOf(m, m.low);
  const fHi = fracOf(m, m.high);
  const dx = x0 + fracOf(m, m.value) * w;
  const col = bad ? colors.zoneLow : colors.mint;
  return (
    <G>
      <Rect x={x0} y={rd(y - trackH / 2)} width={w} height={trackH} rx={trackH / 2} fill={colors.glass2} />
      <Rect
        x={rd(x0 + fLo * w)}
        y={rd(y - trackH / 2)}
        width={rd((fHi - fLo) * w)}
        height={trackH}
        rx={trackH / 2}
        fill={colors.mint}
        opacity={0.22}
      />
      <Dot x={dx} y={y} r={4} color={col} shine={shine} />
      {bad && showFlag ? (
        <Label x={dx} y={y - 9} fill={colors.zoneLow}>
          {bad}
        </Label>
      ) : null}
      {showName ? (
        <Label x={x0 - 8} y={y + 3} fill={colors.textDim} anchor="end">
          {m.name}
        </Label>
      ) : null}
      {showVal ? (
        <Label x={x1 + 8} y={y + 3} fill={bad ? colors.zoneLow : colors.textDim} anchor="start">
          {readoutOf(m)}
        </Label>
      ) : null}
    </G>
  );
}

/**
 * BiomarkerRange — lab-panel reference-range chart for product surfaces
 * (catalog family BR-01…BR-05). `panel-rows` is the signature lab-results
 * screen: one row per marker with the value dot mint in-range / coral out and
 * LOW/HIGH flags. `single-marker` teaches the anatomy (zones, range numbers,
 * pulsing dot + big result). `marker-trend` adds a last-4-tests spark and a
 * direction arrow per row. `panel-grid` packs markers into verdict tiles.
 * `range-history` follows one marker across test dates into its band.
 */
export function BiomarkerRange({
  markers = DEFAULT_MARKERS,
  variant = 'panel-rows',
  title,
  caption,
  note,
  flag,
  shine = false,
  ariaLabel = 'Biomarker reference ranges',
  style,
}: BiomarkerRangeProps) {
  const m0 = markers[0];
  const resolvedCaption =
    caption ??
    (variant === 'single-marker' && m0
      ? `${m0.name} · OPTIMAL ${m0.low}–${m0.high}`
      : DEFAULT_CAPTIONS[variant]);

  return (
    <View accessibilityRole="image" accessibilityLabel={ariaLabel} style={[styles.root, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {title ? (
          <Label x={PAD.l + 2} y={11} fill={colors.textFaint} anchor="start">
            {title}
          </Label>
        ) : null}

        {variant === 'panel-rows' ? (
          /* ---- BR-01 · marker rows (the signature lab panel) ---- */
          <>
            {markers.map((m, i) => (
              <MarkerRow key={i} m={m} y={38 + i * 27} x0={96} x1={244} shine={shine} />
            ))}
            {resolvedCaption ? (
              <Label x={170} y={144} fill={colors.textFaint}>
                {resolvedCaption}
              </Label>
            ) : null}
          </>
        ) : variant === 'single-marker' && m0 ? (
          /* ---- BR-02 · one large row with the anatomy labeled ---- */
          (() => {
            const x0 = 60;
            const w = 200;
            const fLo = fracOf(m0, m0.low);
            const fHi = fracOf(m0, m0.high);
            const dx = x0 + fracOf(m0, m0.value) * w;
            const col = stateOf(m0) ? colors.zoneLow : colors.mint;
            return (
              <>
                <Rect x={x0} y={58} width={w} height={10} rx={5} fill={colors.glass2} />
                <Rect
                  x={rd(x0 + fLo * w)}
                  y={58}
                  width={rd((fHi - fLo) * w)}
                  height={10}
                  rx={5}
                  fill={colors.mint}
                  opacity={0.25}
                />
                {/* pulsing value dot — static duplicate halos on native (no
                    cheap RN way to run the web CSS pulse without Animated) */}
                <Circle cx={rd(dx)} cy={63} r={9} fill={col} opacity={0.12} />
                <Circle cx={rd(dx)} cy={63} r={6.5} fill={col} opacity={0.3} />
                <Circle cx={rd(dx)} cy={63} r={3.6} fill={col} />
                <Label x={x0 + (fLo * w) / 2} y={84} fill={colors.zoneLow}>
                  LOW
                </Label>
                <Label x={x0 + ((fLo + fHi) / 2) * w} y={84} fill={colors.mint}>
                  OPTIMAL
                </Label>
                <Label x={x0 + ((fHi + 1) / 2) * w} y={84} fill={colors.zoneMid}>
                  HIGH
                </Label>
                <Label x={x0 + fLo * w} y={50} fill={colors.textFaint}>
                  {String(m0.low)}
                </Label>
                <Label x={x0 + fHi * w} y={50} fill={colors.textFaint}>
                  {String(m0.high)}
                </Label>
                <SvgText
                  x={160}
                  y={118}
                  fill={col}
                  textAnchor="middle"
                  fontSize={20}
                  fontWeight="700"
                  fontFamily={fonts.display}
                >
                  {readoutOf(m0)}
                </SvgText>
                {resolvedCaption ? (
                  <Label x={160} y={134} fill={colors.textFaint}>
                    {resolvedCaption}
                  </Label>
                ) : null}
              </>
            );
          })()
        ) : variant === 'marker-trend' ? (
          /* ---- BR-03 · rows + last-4-tests spark + direction arrow ---- */
          <>
            {markers.map((m, i) => {
              const y = 42 + i * 34;
              const trend = trendOf(m);
              const tcol = TREND_COLORS[trend];
              const spark = (m.history ?? []).slice(-SPARK_TESTS);
              const d = spark
                .map((v, j) => `${j ? 'L' : 'M'}${216 + j * 9} ${rd(y + 6 - fracOf(m, v) * 14)}`)
                .join('');
              return (
                <G key={i}>
                  <MarkerRow m={m} y={y} x0={84} x1={204} shine={shine} showFlag={false} showVal={false} />
                  {spark.length >= 2 ? <Path d={d} fill="none" stroke={tcol} strokeWidth={1.4} /> : null}
                  <SvgText x={254} y={y + 4} fill={tcol} textAnchor="start" fontSize={11} fontFamily={fonts.mono}>
                    {arrowOf(m, trend)}
                  </SvgText>
                  <Label x={268} y={y + 3} fill={tcol} anchor="start">
                    {shortReadoutOf(m)}
                  </Label>
                </G>
              );
            })}
            {resolvedCaption ? (
              <Label x={160} y={140} fill={colors.textFaint}>
                {resolvedCaption}
              </Label>
            ) : null}
          </>
        ) : variant === 'panel-grid' ? (
          /* ---- BR-04 · 2×3 verdict tiles ---- */
          <>
            {markers.map((m, i) => {
              const gx = 16 + (i % 3) * 99;
              const gy = 28 + Math.floor(i / 3) * 56;
              const bad = stateOf(m);
              return (
                <G key={i}>
                  <Rect
                    x={gx}
                    y={gy}
                    width={90}
                    height={48}
                    rx={10}
                    fill={colors.glass}
                    stroke={bad ? colors.zoneLow : colors.border}
                    strokeOpacity={bad ? 0.5 : 1}
                    strokeWidth={1}
                  />
                  <Label x={gx + 8} y={gy + 13} fill={colors.textDim} anchor="start">
                    {m.name}
                  </Label>
                  <Label x={gx + 82} y={gy + 13} fill={bad ? colors.zoneLow : colors.mint} anchor="end">
                    {bad ?? 'OK'}
                  </Label>
                  <MarkerRow
                    m={m}
                    y={gy + 26}
                    x0={gx + 8}
                    x1={gx + 82}
                    shine={shine}
                    showName={false}
                    showVal={false}
                    showFlag={false}
                  />
                  <Label x={gx + 8} y={gy + 42} fill={bad ? colors.zoneLow : colors.textFaint} anchor="start">
                    {readoutOf(m)}
                  </Label>
                </G>
              );
            })}
          </>
        ) : variant === 'range-history' && m0 ? (
          /* ---- BR-05 · one marker's journey into the band ---- */
          (() => {
            const x0 = 40;
            const x1 = 296;
            const yOf = (f: number) => PAD.t + (1 - f) * PLOT_H;
            const yLo = yOf(fracOf(m0, m0.low));
            const yHi = yOf(fracOf(m0, m0.high));
            const hist = m0.history?.length ? m0.history : [m0.value];
            const pp = hist.map((v, i) => ({
              x: hist.length <= 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (hist.length - 1),
              y: yOf(fracOf(m0, v)),
              inRange: v >= m0.low && v <= m0.high,
            }));
            const d = pp.map((q, i) => `${i ? 'L' : 'M'}${rd(q.x)} ${rd(q.y)}`).join('');
            return (
              <>
                {[0.25, 0.5, 0.75].map((f) => (
                  <Line
                    key={f}
                    x1={PAD.l}
                    x2={W - PAD.r}
                    y1={rd(PAD.t + PLOT_H * f)}
                    y2={rd(PAD.t + PLOT_H * f)}
                    stroke={colors.glass}
                    strokeWidth={1}
                  />
                ))}
                <Line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke={colors.border} strokeWidth={1} />
                <Rect x={x0 - 6} y={rd(yHi)} width={x1 - x0 + 12} height={rd(yLo - yHi)} fill={colors.mint} opacity={0.09} />
                <Label x={x1 + 2} y={yHi + 4} fill={colors.textFaint} anchor="start">
                  {String(m0.high)}
                </Label>
                <Label x={x1 + 2} y={yLo + 4} fill={colors.textFaint} anchor="start">
                  {String(m0.low)}
                </Label>
                <Path d={d} fill="none" stroke={colors.mint} strokeWidth={1.8} />
                {pp.map((q, i) => (
                  <G key={i}>
                    <Dot x={q.x} y={q.y} r={3.6} color={q.inRange ? colors.mint : colors.zoneLow} shine={shine} />
                    {m0.dates?.[i] ? (
                      <Label x={q.x} y={H - 3} fill={colors.textFaint}>
                        {m0.dates[i]}
                      </Label>
                    ) : null}
                  </G>
                ))}
                {flag && pp.length > 0 ? (
                  <Tag x={pp[0].x + 24} y={pp[0].y + 16} color={colors.zoneLow}>
                    {flag}
                  </Tag>
                ) : null}
                {note ? (
                  <Tag x={W - PAD.r - 6} y={26} color={colors.mint} anchor="end">
                    {note}
                  </Tag>
                ) : null}
              </>
            );
          })()
        ) : null}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  /* fixed catalog aspect (320×150); the Svg scales the viewBox to fit */
  root: { width: '100%', aspectRatio: W / H },
});
