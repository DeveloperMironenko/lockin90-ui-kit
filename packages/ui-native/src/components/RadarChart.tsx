import { useId } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** Catalog variant names (`lockin90-design/charts/radar-charts.html`, RD-01…RD-07). */
export type RadarVariant =
  | 'balance-radar'
  | 'target-overlay'
  | 'cohort-ghost'
  | 'zone-vertices'
  | 'weeks-trail'
  | 'mini-triples';

/** RD-01 fill SELECT: `solid` = `color`-tinted shape (default mint) ·
 *  `gradient` = mint→violet stroke over an accent 13% fill. */
export type RadarFill = 'solid' | 'gradient';

/** One small radar of `variant="mini-triples"` (RD-07). */
export interface RadarSeries {
  /** per-axis values, 0–1 */
  values: number[];
  /** caption under the mini radar (e.g. 'MON') */
  label?: string;
}

export interface RadarChartProps {
  /** chart form (default `'balance-radar'`, RD-01) */
  variant?: RadarVariant;
  /** axis labels, clockwise from 12 o'clock (default the catalog's 5 factors) */
  axes?: string[];
  /** your per-axis values, 0–1 (one per axis) */
  values?: number[];
  /** overlay per-axis values, 0–1 — the dashed target (RD-02, default all 0.8)
   *  or cohort ghost (RD-03, default `values × 0.85`) */
  compare?: number[];
  /** `weeks-trail` — value sets oldest→newest; opacity ramps 30%→100% and only
   *  the newest gets vertex dots (RD-06) */
  trail?: number[][];
  /** `mini-triples` — the small radars + captions (RD-07) */
  series?: RadarSeries[];
  /** RD-01 SELECT — shape paint (default `'solid'`) */
  fillStyle?: RadarFill;
  /** shape color for `fillStyle="solid"` (hex/rgba, default mint) */
  color?: string;
  /** bold display readout at the top-right (RD-01 e.g. '72 BALANCED') */
  score?: string;
  /** chip-pill for YOUR shape (RD-02/03 default 'YOU'; RD-06 default 'W1 → Wn') */
  youLabel?: string;
  /** chip-pill for the overlay (RD-02 'TARGET' / RD-03 'COHORT') */
  compareLabel?: string;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** glow underlay behind the shape edge — a wider faint duplicate stroke
   *  (no SVG blur filters on native) */
  shine?: boolean;
  /** rendered width in px — the 320×150 viewBox scales to fit */
  width?: number;
  /** rendered height in px */
  height?: number;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/* --------------------------------------------------------------- geometry
 * The catalog canvas: 320×150 (padding l10 r12 t16 b14), wheel center at
 * (W/2, H/2+8), R 48 (R 30 for the mini triples). */
const W = 320;
const H = 150;
const P = { l: 10, r: 12, t: 16, b: 14 };
const CX = W / 2;
const CY = H / 2 + 8;
const R = 48;
const MINI_R = 30;

/* chip-pill fill — the catalog tag()'s rgba(8,10,18,0.78) = bg0 @ 78% */
const TAG_FILL = `${colors.bg0}C7`;
/* pentagon rings + spokes — the catalog's rgba(255,255,255,0.07) = text @ 7% */
const FRAME_LINE = `${colors.text}12`;
/* cohort-ghost overlay — the catalog's rgba(255,255,255,0.35) = text @ 35% */
const GHOST = `${colors.text}59`;
/* zone-vertices neutral shape — the catalog's rgba(255,255,255,0.4) = text @ 40% */
const NEUTRAL_SHAPE = `${colors.text}66`;

const DEFAULT_AXES = ['SLEEP', 'TRAIN', 'FOOD', 'STRESS', 'LIGHT'];
/** the catalog's seed-11 balance shape */
const DEFAULT_VALUES = [0.66, 0.67, 0.71, 0.7, 0.86];
/** the catalog's W1→W3 trail (seeds 66/69/72, scaled 0.7/0.85/1) */
const DEFAULT_TRAIL = [
  [0.31, 0.25, 0.34, 0.55, 0.49],
  [0.7, 0.46, 0.7, 0.72, 0.75],
  [0.48, 0.44, 0.51, 0.42, 0.39],
];
/** the catalog's MON/TUE/WED minis (seeds 11/22/33) */
const DEFAULT_SERIES: RadarSeries[] = [
  { values: [0.66, 0.67, 0.71, 0.7, 0.86], label: 'MON' },
  { values: [0.72, 0.49, 0.49, 0.47, 0.57], label: 'TUE' },
  { values: [0.68, 0.79, 0.72, 0.36, 0.62], label: 'WED' },
];

const DEFAULT_TITLES: Record<RadarVariant, string> = {
  'balance-radar': 'BODY BALANCE · THIS WEEK',
  'target-overlay': 'YOU VS TARGET',
  'cohort-ghost': 'YOU VS COHORT',
  'zone-vertices': 'FACTOR HEALTH',
  'weeks-trail': 'BALANCE GROWING · 3 WEEKS',
  'mini-triples': 'BALANCE · 3 DAYS',
};

/** zone verdict for a 0–1 value (catalog `zoneOf`) */
function zoneOf(v: number): string {
  return v >= 0.62 ? colors.zoneHigh : v >= 0.38 ? colors.zoneMid : colors.zoneLow;
}

/** polar point — 0° at 12 o'clock, clockwise */
function polar(cx: number, cy: number, r: number, aDeg: number) {
  const a = ((aDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** vertex points of a value polygon (axis i at angle i·360/n) */
function poly(cx: number, cy: number, r: number, vs: number[]) {
  return vs.map((v, i) => polar(cx, cy, r * v, (i * 360) / vs.length));
}

function polyPath(pts: { x: number; y: number }[]): string {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('') + 'Z';
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

/** chip-pill series label (dark rect + tinted hairline) — `y` = pill center */
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

/** the pentagon grid: 3 concentric rings + spokes (+ axis labels at R+11) */
function Frame({
  cx,
  cy,
  r,
  axes,
  withLabels = true,
}: {
  cx: number;
  cy: number;
  r: number;
  axes: string[];
  withLabels?: boolean;
}) {
  return (
    <G>
      {[0.33, 0.66, 1].map((f) => (
        <Path
          key={f}
          d={polyPath(poly(cx, cy, r, axes.map(() => f)))}
          fill="none"
          stroke={FRAME_LINE}
          strokeWidth={1}
        />
      ))}
      {axes.map((a, i) => {
        const pe = polar(cx, cy, r, (i * 360) / axes.length);
        const pl = withLabels ? polar(cx, cy, r + 11, (i * 360) / axes.length) : null;
        return (
          <G key={`${a}-${i}`}>
            <Line
              x1={cx}
              y1={cy}
              x2={pe.x.toFixed(1)}
              y2={pe.y.toFixed(1)}
              stroke={FRAME_LINE}
              strokeWidth={1}
            />
            {pl ? <Label x={pl.x} y={pl.y + 3} text={a} /> : null}
          </G>
        );
      })}
    </G>
  );
}

interface ShapeOpts {
  stroke: string;
  /** the glow duplicate's color when `stroke` is a gradient url */
  glowColor?: string;
  w?: number;
  fill?: boolean;
  fillColor?: string;
  fillOp?: number;
  dash?: number[];
  dots?: boolean;
  zoneDots?: boolean;
  opacity?: number;
  shine?: boolean;
}

/** one radar shape: optional glow underlay + fill + edge + vertex dots */
function Shape({
  cx,
  cy,
  r,
  vs,
  opts,
}: {
  cx: number;
  cy: number;
  r: number;
  vs: number[];
  opts: ShapeOpts;
}) {
  const pts = poly(cx, cy, r, vs);
  const d = polyPath(pts);
  const w = opts.w ?? 2;
  const opacity = opts.opacity ?? 1;
  return (
    <G>
      {/* glow = a wider faint duplicate edge (web blurs; no filters on native) */}
      {opts.shine ? (
        <Path
          d={d}
          fill="none"
          stroke={opts.glowColor ?? opts.stroke}
          strokeWidth={w + 5}
          strokeLinejoin="round"
          opacity={0.2}
        />
      ) : null}
      {opts.fill !== false ? (
        <Path d={d} fill={opts.fillColor ?? opts.stroke} opacity={opts.fillOp ?? 0.13} />
      ) : null}
      <Path
        d={d}
        fill="none"
        stroke={opts.stroke}
        strokeWidth={w}
        strokeLinejoin="round"
        opacity={opacity}
        strokeDasharray={opts.dash}
      />
      {opts.dots !== false
        ? pts.map((p, i) => (
            <Circle
              key={i}
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r={2.8}
              fill={opts.zoneDots ? zoneOf(vs[i] ?? 0) : opts.stroke}
              opacity={opacity}
            />
          ))
        : null}
    </G>
  );
}

/**
 * RadarChart — the kit's balance-wheel / spider chart (catalog family
 * `radar-charts`, RD-01…RD-07). Same prop API + geometry as the web twin:
 * a pentagon grid (3 rings + spokes + axis labels) with one or more value
 * shapes on top. Native glow = a wider faint duplicate edge — never SVG blur
 * filters (patchy on device; see the Ring SDD).
 */
export function RadarChart({
  variant = 'balance-radar',
  axes = DEFAULT_AXES,
  values = DEFAULT_VALUES,
  compare,
  trail = DEFAULT_TRAIL,
  series = DEFAULT_SERIES,
  fillStyle = 'solid',
  color = colors.mint,
  score,
  youLabel,
  compareLabel,
  title,
  shine = false,
  width = W,
  height = H,
  style,
}: RadarChartProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradId = `lk-radar-${uid}`;
  const heading = title ?? DEFAULT_TITLES[variant];
  /* same accessible name as the web twin's aria-label */
  const a11yLabel = `${heading}: radar of ${axes.join(', ')}`;

  /* ---------------------------------------------------- RD-07 mini triples */
  if (variant === 'mini-triples') {
    return (
      <View accessibilityRole="image" accessibilityLabel={a11yLabel} style={[{ width, height }, style]}>
        <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
          <Label x={P.l + 2} y={11} text={heading} anchor="start" />
          {series.map((s, i) => {
            const mx = 62 + i * 98;
            return (
              <G key={s.label ?? i}>
                <Frame cx={mx} cy={CY} r={MINI_R} axes={axes} withLabels={false} />
                <Shape
                  cx={mx}
                  cy={CY}
                  r={MINI_R}
                  vs={s.values}
                  opts={{ stroke: color, w: 1.6, dots: false, shine }}
                />
                {s.label ? <Label x={mx} y={CY + 44} text={s.label} /> : null}
              </G>
            );
          })}
        </Svg>
      </View>
    );
  }

  /* --------------------------------------------------------- full radars */
  const tagX = W - P.r - 4;
  return (
    <View accessibilityRole="image" accessibilityLabel={a11yLabel} style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        <Frame cx={CX} cy={CY} r={R} axes={axes} />

        {variant === 'target-overlay' ? (
          <>
            <Shape
              cx={CX}
              cy={CY}
              r={R}
              vs={compare ?? axes.map(() => 0.8)}
              opts={{ stroke: colors.violet, dash: [5, 4], fill: false, dots: false, w: 1.6 }}
            />
            <Shape cx={CX} cy={CY} r={R} vs={values} opts={{ stroke: color, shine }} />
            <Tag x={tagX} y={26} text={youLabel ?? 'YOU'} color={color} anchor="end" />
            <Tag x={tagX} y={42} text={compareLabel ?? 'TARGET'} color={colors.violet} anchor="end" />
          </>
        ) : variant === 'cohort-ghost' ? (
          <>
            <Shape
              cx={CX}
              cy={CY}
              r={R}
              vs={compare ?? values.map((v) => v * 0.85)}
              opts={{
                stroke: GHOST,
                dash: [4, 4],
                fill: false,
                dots: false,
                w: 1.5,
              }}
            />
            <Shape cx={CX} cy={CY} r={R} vs={values} opts={{ stroke: color, shine }} />
            <Tag x={tagX} y={26} text={youLabel ?? 'YOU'} color={color} anchor="end" />
            <Tag x={tagX} y={42} text={compareLabel ?? 'COHORT'} color={colors.textDim} anchor="end" />
          </>
        ) : variant === 'weeks-trail' ? (
          <>
            {trail.map((vs, i) => {
              const last = i === trail.length - 1;
              // catalog ramp: 30% → 55% → 100% toward the newest
              const op = last ? 1 : 0.3 + 0.25 * i;
              return (
                <Shape
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={R}
                  vs={vs}
                  opts={{
                    stroke: color,
                    opacity: op,
                    fill: false,
                    dots: last,
                    w: last ? 2 : 1.4,
                    shine: shine && last,
                  }}
                />
              );
            })}
            <Tag
              x={tagX}
              y={26}
              text={youLabel ?? `W1 → W${trail.length}`}
              color={color}
              anchor="end"
            />
          </>
        ) : variant === 'zone-vertices' ? (
          <Shape
            cx={CX}
            cy={CY}
            r={R}
            vs={values}
            opts={{ stroke: NEUTRAL_SHAPE, fillOp: 0.06, zoneDots: true, shine }}
          />
        ) : (
          /* RD-01 balance-radar */
          <>
            {fillStyle === 'gradient' ? (
              <Defs>
                <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0%" stopColor={colors.mint} />
                  <Stop offset="100%" stopColor={colors.violet} />
                </LinearGradient>
              </Defs>
            ) : null}
            <Shape
              cx={CX}
              cy={CY}
              r={R}
              vs={values}
              opts={
                fillStyle === 'gradient'
                  ? {
                      stroke: `url(#${gradId})`,
                      glowColor: colors.accent,
                      fillColor: colors.accent,
                      shine,
                    }
                  : { stroke: color, shine }
              }
            />
            {score ? (
              <SvgText
                x={W - P.r - 2}
                y={12}
                fill={colors.text}
                fontSize={12}
                textAnchor="end"
                fontWeight="700"
                fontFamily={fonts.display}
              >
                {score}
              </SvgText>
            ) : null}
          </>
        )}
      </Svg>
    </View>
  );
}
