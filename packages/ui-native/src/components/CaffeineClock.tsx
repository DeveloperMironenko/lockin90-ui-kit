import { useId, type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* CaffeineClock — the catalog caffeine family (CF-01…CF-03,
   lockin90-design/charts/caffeine-charts.html): half-life decay vs your
   bedtime — when the last safe coffee is. Three variants in a fixed 320×150
   viewBox: the signature exponential decay curve with the amber sleep
   threshold and the violet bedtime rule + verdict pill, stacked per-dose
   curves under a bold total, and the actionable mint→amber→magenta safe
   window strip with the computed LAST SAFE COFFEE tick. Native twin of
   `@lockin90/ui` CaffeineClock — same prop API; glows are wider faint
   duplicate strokes (never SVG filters). */

export type CaffeineClockVariant =
  | 'decay-curve' /* CF-01 — decay + 50MG threshold crossing + bed verdict */
  | 'stacked-doses' /* CF-02 — faint per-dose curves + bold TOTAL curve */
  | 'safe-window'; /* CF-03 — gradient day strip + LAST SAFE COFFEE tick */

/** One caffeine dose. */
export interface CaffeineDose {
  /** Hour of day, 0–24 (e.g. `8.5` = 8:30). */
  atH: number;
  /** Dose size in mg. */
  mg: number;
  /** Marker/curve color token; defaults by position (violet → cyan → amber). */
  color?: string;
}

export interface CaffeineClockProps {
  /** Catalog variant (CF-01 / CF-02 / CF-03). */
  variant?: CaffeineClockVariant;
  /** The day's doses, in time order (default per variant reproduces the card). */
  doses?: CaffeineDose[];
  /** Caffeine half-life in hours (the catalog t½ 5.7h). */
  halfLifeH?: number;
  /** Bedtime hour → violet dashed rule + verdict pill / safe-window anchor. */
  bedH?: number;
  /** Sleep threshold in mg (the amber dashed rule; verdicts compare to it). */
  thresholdMg?: number;
  /** y-scale ceiling in mg. */
  maxMg?: number;
  /** x-axis day window, hours. */
  dayStartH?: number;
  dayEndH?: number;
  /** `safe-window` NOW position, hour of day. */
  nowH?: number;
  /** Decay-curve color token (CF-01). */
  color?: string;
  /** Bed verdict pill override (default derived `BED · ${mg}MG ✓/⚠`). */
  bedLabel?: string;
  /** Threshold-crossing pill override (default `UNDER ${mg}MG · ${time}`). */
  crossLabel?: string;
  /** `stacked-doses` key note. */
  note?: string;
  /** `safe-window` tick pill override (default `LAST SAFE COFFEE · ${time}`,
   *  one half-life before bed). */
  safeLabel?: string;
  /** `safe-window` past-cups caption (default `${n} COFFEES SO FAR`). */
  cupsNote?: string;
  /** `safe-window` bottom legend (default derived from `bedH`). */
  legendNote?: string;
  /** Top-left mono caption (e.g. 'COFFEE 8:30 · 120MG'). */
  title?: string;
  /** Interior gridlines + baseline (the catalog grid). */
  grid?: boolean;
  /** Glow underlay along the decay curve (the catalog `cfg.shine`). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
  /** Optional container style. */
  style?: StyleProp<ViewStyle>;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js + caffeine page) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_H = H - PAD.t - PAD.b; // 120
const GRID_ROWS = [0.25, 0.5, 0.75] as const;
const X0 = PAD.l + 10;
const X1 = W - PAD.r - 10;

/** Round for compact attribute values. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** `h:mm` from a fractional hour (17.3 → '17:18'). */
function fmtH(h: number): string {
  let hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  if (mm === 60) {
    hh += 1;
    mm = 0;
  }
  return `${hh}:${String(mm).padStart(2, '0')}`;
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

/** Glowing dot + static halo ring — the catalog `pulseDot` (no animation). */
function PulseDot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <G>
      <Circle cx={rd(x)} cy={rd(y)} r={6.6} fill={color} opacity={0.35} />
      <Circle cx={rd(x)} cy={rd(y)} r={3.6} fill={color} />
      <Circle cx={rd(x)} cy={rd(y)} r={7} fill="none" stroke={color} strokeWidth={1.4} opacity={0.4} />
    </G>
  );
}

/* per-dose curve colors, in dose order (the catalog stacked trio) */
const DOSE_COLORS = [colors.violet, colors.cyan, colors.zoneMid] as const;

const DEFAULT_DECAY: CaffeineDose[] = [{ atH: 8.5, mg: 120, color: colors.mint }];
const DEFAULT_STACK: CaffeineDose[] = [
  { atH: 7.5, mg: 90 },
  { atH: 10.5, mg: 60 },
  { atH: 14, mg: 80 },
];
const DEFAULT_WINDOW: CaffeineDose[] = [
  { atH: 7.5, mg: 90 },
  { atH: 10.5, mg: 60 },
];

/**
 * CaffeineClock — the caffeine-clock family (catalog CF-01…CF-03): mg in the
 * system over the day, computed from the doses with the exponential half-life
 * model `mg · 0.5^((h − atH)/t½)`. The bed verdict, threshold crossing and
 * LAST SAFE COFFEE tick are all derived from the data — pass real doses and
 * the answers are real.
 */
export function CaffeineClock({
  variant = 'decay-curve',
  doses,
  halfLifeH = 5.7,
  bedH = 23,
  thresholdMg = 50,
  maxMg = 200,
  dayStartH = 6,
  dayEndH = 24,
  nowH = 14,
  color = colors.mint,
  bedLabel,
  crossLabel,
  note = 'BOLD = TOTAL',
  safeLabel,
  cupsNote,
  legendNote,
  title,
  grid = true,
  shine = false,
  ariaLabel = 'Caffeine decay chart',
  style,
}: CaffeineClockProps) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');

  const ds =
    doses ??
    (variant === 'stacked-doses' ? DEFAULT_STACK : variant === 'safe-window' ? DEFAULT_WINDOW : DEFAULT_DECAY);

  /** hour → x (the page's `xh`, generalized to the day window). */
  const xh = (h: number) => X0 + ((h - dayStartH) / (dayEndH - dayStartH)) * (X1 - X0);
  /** mg → y (the page's `ymg`). */
  const ymg = (mg: number) => H - PAD.b - 6 - (mg / maxMg) * (PLOT_H - 18);
  /** total mg in the system at hour `h` (each dose decays independently). */
  const lvl = (dd: CaffeineDose[], h: number) =>
    dd.reduce((s, d) => (h < d.atH ? s : s + d.mg * Math.pow(0.5, (h - d.atH) / halfLifeH)), 0);
  /** decay path sampled every 0.25h from `h0` to the end of the window. */
  const curve = (dd: CaffeineDose[], h0: number) => {
    let d = '';
    for (let h = h0; h <= dayEndH + 0.01; h += 0.25) d += `${d ? 'L' : 'M'}${rd(xh(h))} ${rd(ymg(lvl(dd, h)))}`;
    return d;
  };

  /** dashed-stem cup marker + mg caption (the page's `cup`). */
  const cupMarker = (d: CaffeineDose, i: number) => {
    const c = d.color ?? DOSE_COLORS[i % DOSE_COLORS.length];
    const x = xh(d.atH);
    return (
      <G key={i}>
        <Line
          x1={rd(x)}
          x2={rd(x)}
          y1={rd(ymg(0))}
          y2={rd(ymg(d.mg))}
          stroke={c}
          strokeWidth={1}
          strokeDasharray={[2, 3]}
          opacity={0.7}
        />
        <Circle cx={rd(x)} cy={rd(ymg(d.mg))} r={3} fill={c} />
        <Label x={x} y={ymg(d.mg) - 8} fill={c}>
          {`${d.mg}MG`}
        </Label>
      </G>
    );
  };

  /* bed verdict — derived from the model */
  const mgAtBed = Math.round(lvl(ds, bedH));
  const bedOK = mgAtBed < thresholdMg;
  const bedText = bedLabel ?? `BED · ${mgAtBed}MG ${bedOK ? '✓' : '⚠'}`;
  const bedColor = bedOK ? colors.mint : colors.zoneLow;
  const bedRule = (
    <G>
      <Line
        x1={rd(xh(bedH))}
        x2={rd(xh(bedH))}
        y1={PAD.t + 6}
        y2={H - PAD.b}
        stroke={colors.violet}
        strokeWidth={1.2}
        strokeDasharray={[4, 4]}
      />
      <Tag x={xh(bedH) - 4} y={PAD.t + 12} color={bedColor} anchor="end" text={bedText} />
    </G>
  );

  /* hour ticks every 3h across the window */
  const ticks: number[] = [];
  for (let h = Math.ceil(dayStartH / 3) * 3; h <= dayEndH; h += 3) ticks.push(h);
  const hourTicks = (
    <G>
      {ticks.map((h) => (
        <Label key={h} x={xh(h)} y={H - 3} fill={colors.textFaint}>
          {`${h}:00`}
        </Label>
      ))}
    </G>
  );

  let body: ReactNode = null;

  if (variant === 'stacked-doses') {
    /* CF-02 — faint per-dose curves + bold white TOTAL */
    const first = Math.min(...ds.map((d) => d.atH));
    body = (
      <G>
        {ds.map((d, i) => (
          <Path
            key={i}
            d={curve([d], d.atH)}
            fill="none"
            stroke={d.color ?? DOSE_COLORS[i % DOSE_COLORS.length]}
            strokeWidth={1.2}
            opacity={0.55}
          />
        ))}
        <Path d={curve(ds, first)} fill="none" stroke={colors.text} strokeWidth={2.2} strokeLinecap="round" />
        {ds.map((d, i) => cupMarker(d, i))}
        {bedRule}
        {hourTicks}
        <Label x={xh(dayStartH + (dayEndH - dayStartH) * 0.44) + 8} y={ymg(maxMg * 0.75)} fill={colors.textDim} anchor="start">
          {note}
        </Label>
      </G>
    );
  } else if (variant === 'safe-window') {
    /* CF-03 — gradient day strip + computed LAST SAFE COFFEE tick */
    const y = 74;
    const cut = bedH - halfLifeH; // one half-life before bed
    const gradId = `lk-caff-w-${uid}`;
    const avgH = ds.length > 0 ? ds.reduce((s, d) => s + d.atH, 0) / ds.length : dayStartH;
    body = (
      <G>
        <Defs>
          <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.mint} />
            <Stop offset="55%" stopColor={colors.mint} />
            <Stop offset="75%" stopColor={colors.zoneMid} />
            <Stop offset="100%" stopColor={colors.magenta} />
          </LinearGradient>
        </Defs>
        <Rect x={X0} y={y - 9} width={X1 - X0} height={18} rx={9} fill={`url(#${gradId})`} opacity={0.75} />
        <Line x1={rd(xh(cut))} x2={rd(xh(cut))} y1={y - 17} y2={y + 17} stroke={colors.text} strokeWidth={2} />
        <Tag x={xh(cut)} y={y - 26} color={colors.mint} text={safeLabel ?? `LAST SAFE COFFEE · ${fmtH(cut)}`} />
        <PulseDot x={xh(nowH)} y={y} color={colors.text} />
        <Label x={xh(nowH)} y={y + 26} fill={colors.textDim}>
          {`NOW · ${fmtH(nowH)}`}
        </Label>
        {ds.map((d, i) => (
          <Circle
            key={i}
            cx={rd(xh(d.atH))}
            cy={y}
            r={3}
            fill={`${colors.bg0}CC`}
            stroke={colors.text}
            strokeOpacity={0.8}
            strokeWidth={1.2}
          />
        ))}
        <Label x={xh(avgH)} y={y - 22} fill={colors.textFaint}>
          {cupsNote ?? `${ds.length} COFFEES SO FAR`}
        </Label>
        <Label x={W / 2} y={128} fill={colors.textFaint}>
          {legendNote ?? `GREEN = SAFE FOR ${fmtH(bedH)} BED · RED = HITS SLEEP`}
        </Label>
        {hourTicks}
      </G>
    );
  } else {
    /* CF-01 — the signature decay curve + threshold + bed verdict */
    const first = Math.min(...ds.map((d) => d.atH));
    const d = curve(ds, first);
    // first time the (post-last-dose) total dips under the threshold
    let t50: number | null = null;
    if (ds.length > 0) {
      const lastDose = Math.max(...ds.map((dd) => dd.atH));
      for (let h = Math.max(lastDose, dayStartH); h <= dayEndH; h += 0.05) {
        if (lvl(ds, h) < thresholdMg) {
          t50 = h;
          break;
        }
      }
    }
    body = (
      <G>
        {/* glow — a wider faint duplicate stroke (no blur filters on native) */}
        {shine ? <Path d={d} fill="none" stroke={color} strokeWidth={7} opacity={0.45} /> : null}
        <Line
          x1={X0}
          x2={X1}
          y1={rd(ymg(thresholdMg))}
          y2={rd(ymg(thresholdMg))}
          stroke={colors.zoneMid}
          strokeWidth={1.1}
          strokeDasharray={[4, 4]}
        />
        <Label x={X0 + 2} y={ymg(thresholdMg) - 6} fill={colors.zoneMid} anchor="start">
          {`SLEEP THRESHOLD ${thresholdMg}MG`}
        </Label>
        <Path d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
        {ds.map((dd, i) => cupMarker(dd, i))}
        {t50 != null ? (
          <G>
            <Circle cx={rd(xh(t50))} cy={rd(ymg(thresholdMg))} r={3.4} fill={colors.zoneMid} />
            <Tag
              x={xh(t50) + 6}
              y={ymg(thresholdMg) + 16}
              color={colors.zoneMid}
              anchor="start"
              text={crossLabel ?? `UNDER ${thresholdMg}MG · ${fmtH(t50)}`}
            />
          </G>
        ) : null}
        {bedRule}
        {hourTicks}
      </G>
    );
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={ariaLabel} style={[styles.root, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {/* catalog grid: 3 interior rows + solid baseline */}
        {grid ? (
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
        {body}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  /* fixed catalog aspect (320×150); the Svg scales the viewBox to fit */
  root: { width: '100%', aspectRatio: W / H },
});
