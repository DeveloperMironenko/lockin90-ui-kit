import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** Catalog variant names (`lockin90-design/charts/rose-charts.html`, RS-01…RS-03). */
export type RoseVariant = 'balance-rose' | 'week-rose' | 'rose-compare';

/** One Nightingale petal. `value` (0–1) drives the petal length. */
export interface RosePetal {
  /** petal length, 0–1 (0 → the 10px hub, 1 → the full 52px radius) */
  value: number;
  /** label around the rim (category name / day letter) */
  label?: string;
  /** petal color override (balance default: the energy spectrum by index) */
  color?: string;
}

export interface RoseChartProps {
  /** chart form (default `'balance-rose'`, RS-01) */
  variant?: RoseVariant;
  /** the petals, clockwise from 12 o'clock (per-variant catalog defaults) */
  petals?: RosePetal[];
  /** `rose-compare` — last period's values (white dashed outlines), one per petal */
  compare?: number[];
  /** `week-rose` — index of the solid "today" petal (default the last) */
  todayIndex?: number;
  /** petal color for `week-rose` (mint) / `rose-compare` (violet) */
  color?: string;
  /** `balance-rose` — dim caption at the bottom-right (e.g. 'MIND LAGS · 50%') */
  note?: string;
  /** `week-rose` — chip-pill above the legend area (default 'TODAY · SUN') */
  todayLabel?: string;
  /** `week-rose` — dim caption under the pill (default 'PETAL = DAY SCORE') */
  caption?: string;
  /** `rose-compare` — chip-pill for the filled petals (default 'THIS WEEK') */
  currentLabel?: string;
  /** `rose-compare` — chip-pill for the dashed ghost (default 'LAST · DASHED') */
  compareLabel?: string;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** glow underlay behind the petals — a faint duplicate petal with a soft
   *  wide edge (no SVG blur filters on native) */
  shine?: boolean;
  /** rendered width in px — the 320×150 viewBox scales to fit */
  width?: number;
  /** rendered height in px */
  height?: number;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/* --------------------------------------------------------------- geometry
 * The catalog canvas: 320×150, rose center at (130, 84), petals grow from a
 * 10px hub to MAXR 52, each petal trimmed 3° per side. Ring guides at
 * 33/66/100%. */
const W = 320;
const H = 150;
const P = { l: 10, r: 12, t: 16, b: 14 };
const CX = 130;
const CY = 84;
const MAXR = 52;
const RMIN = 10;

const SPECTRUM = [colors.lime, colors.mint, colors.cyan, colors.indigo, colors.violet, colors.magenta];

/* chip-pill fill — the catalog tag()'s rgba(8,10,18,0.78) = bg0 @ 78% */
const TAG_FILL = `${colors.bg0}C7`;
/* rose-compare ghost petals — the catalog's rgba(255,255,255,0.55) = text @ 55% */
const GHOST = `${colors.text}8C`;

/** the catalog's six life-balance petals (RS-01 + RS-03 current week) */
const DEFAULT_BALANCE: RosePetal[] = [
  { label: 'TRAIN', value: 0.85 },
  { label: 'SLEEP', value: 0.7 },
  { label: 'FOOD', value: 0.9 },
  { label: 'MIND', value: 0.5 },
  { label: 'SOCIAL', value: 0.6 },
  { label: 'RECOVER', value: 0.75 },
];
/** the catalog's seven day petals (RS-02) */
const DEFAULT_WEEK: RosePetal[] = [
  { label: 'M', value: 0.6 },
  { label: 'T', value: 0.75 },
  { label: 'W', value: 0.5 },
  { label: 'T', value: 0.8 },
  { label: 'F', value: 0.65 },
  { label: 'S', value: 0.9 },
  { label: 'S', value: 0.7 },
];
/** the catalog's last-week ghost (RS-03) */
const DEFAULT_COMPARE = [0.6, 0.8, 0.7, 0.65, 0.45, 0.6];

const DEFAULT_TITLES: Record<RoseVariant, string> = {
  'balance-rose': 'LIFE BALANCE · WEEK',
  'week-rose': 'THE WEEK · 7 PETALS',
  'rose-compare': 'WEEK VS LAST',
};

/** polar point — 0° at 12 o'clock, clockwise */
function polar(cx: number, cy: number, r: number, aDeg: number) {
  const a = ((aDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** filled slice (petal) from the center between two angles */
function slicePath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const lg = (a1 - a0) % 360 > 180 ? 1 : 0;
  return (
    `M${cx} ${cy}L${p0.x.toFixed(1)} ${p0.y.toFixed(1)}` +
    `A${r} ${r} 0 ${lg} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}Z`
  );
}

/** petal i-of-n geometry: 3° trim per side, radius RMIN + v·(MAXR−RMIN) */
function petalGeom(i: number, n: number, v: number) {
  const step = 360 / n;
  const a0 = i * step + 3;
  const a1 = (i + 1) * step - 3;
  return { d: slicePath(CX, CY, RMIN + v * (MAXR - RMIN), a0, a1), mid: (a0 + a1) / 2 };
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

interface PetalOpts {
  fillOp?: number;
  sw?: number;
  dash?: number[];
  shine?: boolean;
}

/** one petal: optional faint glow duplicate + tinted fill + edge */
function Petal({
  i,
  n,
  v,
  color,
  opts = {},
}: {
  i: number;
  n: number;
  v: number;
  color: string;
  opts?: PetalOpts;
}) {
  const { d } = petalGeom(i, n, v);
  return (
    <G>
      {/* glow = duplicate petal, faint fill + soft wide edge (web blurs a clone) */}
      {opts.shine ? (
        <Path
          d={d}
          fill={color}
          fillOpacity={0.25}
          stroke={color}
          strokeWidth={5}
          strokeOpacity={0.18}
          strokeLinejoin="round"
        />
      ) : null}
      <Path
        d={d}
        fill={color}
        fillOpacity={opts.fillOp ?? 0.3}
        stroke={color}
        strokeWidth={opts.sw ?? 1.5}
        strokeDasharray={opts.dash}
      />
    </G>
  );
}

/**
 * RoseChart — the kit's Nightingale rose (catalog family `rose-charts`,
 * RS-01…RS-03). Same prop API + geometry as the web twin: petals fan
 * clockwise from 12 o'clock over three faint ring guides, length = value.
 * Native glow = a faint duplicate petal with a soft wide edge — never SVG
 * blur filters (patchy on device; see the Ring SDD).
 */
export function RoseChart({
  variant = 'balance-rose',
  petals,
  compare = DEFAULT_COMPARE,
  todayIndex,
  color,
  note,
  todayLabel = 'TODAY · SUN',
  caption = 'PETAL = DAY SCORE',
  currentLabel = 'THIS WEEK',
  compareLabel = 'LAST · DASHED',
  title,
  shine = false,
  width = W,
  height = H,
  style,
}: RoseChartProps) {
  const data = petals ?? (variant === 'week-rose' ? DEFAULT_WEEK : DEFAULT_BALANCE);
  const n = data.length;
  const heading = title ?? DEFAULT_TITLES[variant];

  /* ring guides — the catalog's white-6% = border (white-9%) @ 0.67 */
  const guides = [0.33, 0.66, 1].map((f) => (
    <Circle
      key={f}
      cx={CX}
      cy={CY}
      r={RMIN + f * (MAXR - RMIN)}
      fill="none"
      stroke={colors.border}
      strokeOpacity={0.67}
      strokeWidth={1}
    />
  ));

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`${heading}: rose chart with ${n} petals`}
      style={[{ width, height }, style]}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        {guides}

        {variant === 'week-rose' ? (
          <>
            {data.map((p, i) => {
              const today = i === (todayIndex ?? n - 1);
              const c = p.color ?? color ?? colors.mint;
              const lp = polar(CX, CY, MAXR + 10, petalGeom(i, n, p.value).mid);
              return (
                <G key={i}>
                  <Petal
                    i={i}
                    n={n}
                    v={p.value}
                    color={c}
                    opts={{
                      fillOp: today ? 0.65 : 0.12 + p.value * 0.25,
                      sw: today ? 2 : 1.2,
                      shine: shine && today,
                    }}
                  />
                  {p.label ? (
                    <Label x={lp.x} y={lp.y + 3} text={p.label} color={today ? c : undefined} />
                  ) : null}
                </G>
              );
            })}
            <Tag x={252} y={40} text={todayLabel} color={color ?? colors.mint} />
            <Label x={252} y={60} text={caption} color={colors.textDim} anchor="start" />
          </>
        ) : variant === 'rose-compare' ? (
          <>
            {data.map((_, i) => (
              <Petal
                key={`ghost-${i}`}
                i={i}
                n={n}
                v={compare[i] ?? 0}
                color={GHOST}
                opts={{ fillOp: 0, sw: 1.2, dash: [3, 3] }}
              />
            ))}
            {data.map((p, i) => {
              const c = p.color ?? color ?? colors.violet;
              const lp = polar(CX, CY, MAXR + 12, petalGeom(i, n, p.value).mid);
              return (
                <G key={i}>
                  <Petal i={i} n={n} v={p.value} color={c} opts={{ fillOp: 0.3, shine }} />
                  {p.label ? <Label x={lp.x} y={lp.y + 3} text={p.label} /> : null}
                </G>
              );
            })}
            <Tag x={262} y={34} text={currentLabel} color={color ?? colors.violet} />
            <Tag x={262} y={50} text={compareLabel} color={colors.textDim} />
          </>
        ) : (
          /* RS-01 balance-rose */
          <>
            {data.map((p, i) => {
              const c = p.color ?? color ?? SPECTRUM[i % SPECTRUM.length]!;
              const lp = polar(CX, CY, MAXR + 12, petalGeom(i, n, p.value).mid);
              return (
                <G key={i}>
                  <Petal i={i} n={n} v={p.value} color={c} opts={{ shine }} />
                  {p.label ? <Label x={lp.x} y={lp.y + 3} text={p.label} /> : null}
                </G>
              );
            })}
            {note ? (
              <Label x={W - P.r - 4} y={130} text={note} color={colors.textDim} anchor="end" />
            ) : null}
          </>
        )}
      </Svg>
    </View>
  );
}
