import { type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* VitalsStrip — the catalog vitals family (VT-01…VT-05,
   lockin90-design/charts/vitals-charts.html): ECG-style rhythm strips —
   heartbeat, HRV, the monitor look. Five variants in a fixed 320×150
   viewBox: sharp PQRST polyline beats on faint ECG-paper verticals with a
   big mono BPM readout, the uneven-RR HRV explainer with a ms bracket
   ruler, the bedside monitor (ECG + respiration + stat column), the
   compressed overnight HR curve, and the one-premature-beat anomaly flag.
   Native twin of `@lockin90/ui` VitalsStrip — same prop API; glows are
   wider faint duplicate strokes (never SVG filters). */

export type VitalsStripVariant =
  | 'ecg-strip' /* VT-01 — PQRST beats + big BPM + pulse on the last R peak */
  | 'hrv-rhythm' /* VT-02 — uneven RR spacing + ms bracket ruler + HRV pill */
  | 'monitor' /* VT-03 — ECG + respiration + HR/HRV/RESP stat column */
  | 'night-hr' /* VT-04 — overnight curve, LOW dip pill, WAKE spike */
  | 'anomaly-beat'; /* VT-05 — one premature beat coral + dashed ring + pill */

export interface VitalsStripProps {
  /** Catalog variant (VT-01…VT-05). */
  variant?: VitalsStripVariant;
  /** RR intervals in **milliseconds**, one per beat (uneven spacing IS the
   *  data — the HRV story). Defaults per variant reproduce the catalog. */
  rr?: number[];
  /** Beats per minute — the VT-01 big readout / VT-03 HR stat. */
  bpm?: number;
  /** HRV in ms — the VT-02 pill / VT-03 stat. */
  hrv?: number;
  /** Breaths per minute — the VT-03 RESP stat. */
  resp?: number;
  /** `night-hr` overnight BPM samples (VT-04). */
  nightBpm?: number[];
  /** `night-hr` dip pill (default `LOW ${min}`; anchored at the minimum). */
  lowLabel?: string;
  /** `night-hr` wake-spike sample index (`null` hides the marker). */
  wakeIndex?: number | null;
  /** `night-hr` wake pill text. */
  wakeLabel?: string;
  /** `anomaly-beat` premature-beat index (default: the shortest RR). */
  anomalyIndex?: number;
  /** `anomaly-beat` pill text. */
  anomalyLabel?: string;
  /** Bottom-left mono note (per-variant catalog default). */
  caption?: string;
  /** `night-hr` axis captions, spread evenly. */
  ticks?: string[];
  /** Trace color token (defaults: mint; `hrv-rhythm` cyan; `night-hr` indigo). */
  color?: string;
  /** Top-left mono caption (e.g. 'RESTING HR · LIVE'). */
  title?: string;
  /** Glow underlay along the trace (the catalog `cfg.shine`). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
  /** Optional container style. */
  style?: StyleProp<ViewStyle>;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js + vitals page) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_H = H - PAD.t - PAD.b; // 120
const GRID_ROWS = [0.25, 0.5, 0.75] as const;

/** the catalog's px↔ms scale: 1 viewBox px of RR width = 23.5 ms. */
const MS_PER_PX = 23.5;

/** PQRST beat template: [fraction of RR, normalized amplitude] — sharp, unsmoothed. */
const BEAT: Array<[number, number]> = [
  [0, 0],
  [0.13, 0],
  [0.18, 0.14],
  [0.23, 0],
  [0.33, 0],
  [0.36, -0.12],
  [0.4, 1],
  [0.44, -0.3],
  [0.48, 0],
  [0.56, 0],
  [0.64, 0.24],
  [0.72, 0],
  [1, 0],
];

/** Round for compact attribute values. */
const rd = (n: number) => Math.round(n * 100) / 100;

interface EcgRun {
  d: string;
  peaks: Array<{ x: number; y: number }>;
}

/** A run of PQRST beats: polyline path + the R-peak positions (BEAT index 6). */
function ecgRun(x0: number, y0: number, amp: number, widths: number[]): EcgRun {
  let d = '';
  const peaks: EcgRun['peaks'] = [];
  let x = x0;
  for (const w of widths) {
    BEAT.forEach((q, i) => {
      const px = x + q[0] * w;
      const py = y0 - q[1] * amp;
      d += `${d ? 'L' : 'M'}${rd(px)} ${rd(py)}`;
      if (i === 6) peaks.push({ x: px, y: py });
    });
    x += w;
  }
  return { d, peaks };
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

/** Faint ECG-paper verticals every 14px (the page's `paper`). */
function Paper({ y0, y1 }: { y0: number; y1: number }) {
  const lines: number[] = [];
  for (let x = PAD.l; x <= W - PAD.r; x += 14) lines.push(x);
  return (
    <G>
      {lines.map((x) => (
        <Line key={x} x1={x} x2={x} y1={y0} y2={y1} stroke={colors.text} strokeOpacity={0.04} strokeWidth={1} />
      ))}
    </G>
  );
}

/** ECG trace + optional glow — a wider faint duplicate stroke (no filters). */
function Trace({ d, color, shine }: { d: string; color: string; shine: boolean }) {
  return (
    <G>
      {shine ? <Path d={d} fill="none" stroke={color} strokeWidth={6} opacity={0.45} strokeLinecap="round" /> : null}
      <Path d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
    </G>
  );
}

/* Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (VT-04 only). */
function monotonePath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n < 3) return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${rd(x)},${rd(y)}`).join(' ');
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

/* catalog default RRs, in ms (page px × 23.5) */
const RR_ECG = [987, 1034, 940, 1058, 964, 1034];
const RR_HRV = [964, 1034, 893, 1081, 846, 1058, 940];
const RR_MONITOR = [893, 940, 870, 964, 893, 940];
const RR_ANOMALY = [987, 1034, 564, 1363, 1011, 1034];
const DEFAULT_NIGHT = [62, 58, 54, 50, 46, 44, 45, 48, 44, 46, 52, 58, 64];

/* per-variant frame constants (page draw() branches) */
const FRAMES = {
  'ecg-strip': { paper: [30, 118], y0: 82, amp: 36 },
  'hrv-rhythm': { paper: [26, 104], y0: 70, amp: 30 },
  monitor: { paper: [26, 122], y0: 56, amp: 24 },
  'anomaly-beat': { paper: [30, 118], y0: 82, amp: 34 },
} as const;

/**
 * VitalsStrip — the vitals rhythm-strip family (catalog VT-01…VT-05): sharp
 * PQRST polyline beats (never smoothed — the sharpness is the ECG look) on
 * faint paper verticals. RR intervals are real milliseconds; the strip
 * renders them at the catalog's 23.5 ms/px so uneven spacing reads exactly
 * like the design page. `night-hr` swaps the beats for the compressed
 * overnight HR curve.
 */
export function VitalsStrip({
  variant = 'ecg-strip',
  rr,
  bpm,
  hrv = 84,
  resp = 14,
  nightBpm = DEFAULT_NIGHT,
  lowLabel,
  wakeIndex = 9,
  wakeLabel = 'WAKE',
  anomalyIndex,
  anomalyLabel = 'IRREGULAR · 1 BEAT',
  caption,
  ticks = ['11PM', '3AM', '7AM'],
  color,
  title,
  shine = false,
  ariaLabel = 'Vitals rhythm strip',
  style,
}: VitalsStripProps) {
  let body: ReactNode = null;

  if (variant === 'night-hr') {
    /* VT-04 — compressed overnight HR curve in a shaded sleep window */
    const c = color ?? colors.indigo;
    const x0 = PAD.l + 8;
    const x1 = W - PAD.r - 8;
    const pts: Array<[number, number]> = nightBpm.map((v, i) => [
      x0 + ((x1 - x0) * i) / Math.max(1, nightBpm.length - 1),
      128 - (v - 40) * 2.6,
    ]);
    let minI = 0;
    nightBpm.forEach((v, i) => {
      if (v < nightBpm[minI]) minI = i;
    });
    const min = pts.length > 0 ? pts[minI] : null;
    const wake = wakeIndex != null && wakeIndex >= 0 && wakeIndex < pts.length ? pts[wakeIndex] : null;
    body = (
      <G>
        {/* catalog grid */}
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
        {/* shaded sleep window */}
        <Rect x={x0} y={PAD.t + 4} width={x1 - x0} height={108} fill={c} opacity={0.07} />
        {shine ? (
          <Path d={monotonePath(pts)} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" opacity={0.45} />
        ) : null}
        <Path d={monotonePath(pts)} fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" />
        {/* LOW dip */}
        {min ? (
          <G>
            <Circle cx={rd(min[0])} cy={rd(min[1])} r={3.2} fill={colors.mint} />
            <Tag x={min[0]} y={min[1] + 14} color={colors.mint} text={lowLabel ?? `LOW ${nightBpm[minI]}`} />
          </G>
        ) : null}
        {/* WAKE spike */}
        {wake ? (
          <G>
            <Circle cx={rd(wake[0])} cy={rd(wake[1])} r={3.2} fill={colors.zoneMid} />
            <Tag x={wake[0] + 4} y={wake[1] - 12} color={colors.zoneMid} anchor="start" text={wakeLabel} />
          </G>
        ) : null}
        {ticks.map((t, i) => (
          <Label key={t} x={x0 + ((x1 - x0) * i) / Math.max(1, ticks.length - 1)} y={H - 3} fill={colors.textFaint}>
            {t}
          </Label>
        ))}
      </G>
    );
  } else {
    const frame = FRAMES[variant];
    const rrMs =
      rr ??
      (variant === 'hrv-rhythm'
        ? RR_HRV
        : variant === 'monitor'
          ? RR_MONITOR
          : variant === 'anomaly-beat'
            ? RR_ANOMALY
            : RR_ECG);
    const widths = rrMs.map((ms) => ms / MS_PER_PX);
    const run = ecgRun(PAD.l + 4, frame.y0, frame.amp, widths);
    const traceColor = color ?? (variant === 'hrv-rhythm' ? colors.cyan : colors.mint);

    if (variant === 'ecg-strip') {
      /* VT-01 — the heartbeat strip + big BPM */
      const last = run.peaks[run.peaks.length - 1];
      body = (
        <G>
          <Paper y0={frame.paper[0]} y1={frame.paper[1]} />
          <Trace d={run.d} color={traceColor} shine={shine} />
          {last ? <PulseDot x={last.x} y={last.y} color={traceColor} /> : null}
          <SvgText x={W - PAD.r - 4} y={46} fill={traceColor} textAnchor="end" fontSize={24} fontFamily={fonts.display} fontWeight="700">
            {String(bpm ?? 62)}
          </SvgText>
          <Label x={W - PAD.r - 4} y={58} fill={colors.textFaint} anchor="end">
            BPM
          </Label>
          <Label x={PAD.l + 2} y={132} fill={colors.textFaint} anchor="start">
            {caption ?? 'RESTING · SINUS RHYTHM'}
          </Label>
        </G>
      );
    } else if (variant === 'hrv-rhythm') {
      /* VT-02 — uneven RR spacing + ms bracket ruler */
      const brackets: ReactNode[] = [];
      for (let i = 0; i < run.peaks.length - 1; i++) {
        const a = run.peaks[i].x;
        const b = run.peaks[i + 1].x;
        brackets.push(
          <G key={i}>
            <Line x1={rd(a)} x2={rd(b)} y1={112} y2={112} stroke={colors.text} strokeOpacity={0.25} strokeWidth={1} />
            <Line x1={rd(a)} x2={rd(a)} y1={108} y2={116} stroke={colors.text} strokeOpacity={0.25} strokeWidth={1} />
            <Line x1={rd(b)} x2={rd(b)} y1={108} y2={116} stroke={colors.text} strokeOpacity={0.25} strokeWidth={1} />
            <Label x={(a + b) / 2} y={126} fill={colors.textDim}>
              {String(Math.round(rrMs[i + 1]))}
            </Label>
          </G>,
        );
      }
      body = (
        <G>
          <Paper y0={frame.paper[0]} y1={frame.paper[1]} />
          <Trace d={run.d} color={traceColor} shine={shine} />
          {brackets}
          <Label x={PAD.l + 2} y={140} fill={colors.textFaint} anchor="start">
            {caption ?? 'RR INTERVALS · MS'}
          </Label>
          <Tag x={W - PAD.r - 6} y={22} color={traceColor} anchor="end" text={`HRV ${hrv}MS`} />
        </G>
      );
    } else if (variant === 'monitor') {
      /* VT-03 — ECG + slow respiration + stat column */
      let respD = '';
      for (let x = PAD.l + 4; x <= 240; x += 4)
        respD += `${respD ? 'L' : 'M'}${x} ${rd(104 - Math.sin((x - PAD.l) / 26) * 9)}`;
      const stats: Array<[string, string, string, number]> = [
        [String(bpm ?? 58), 'HR', colors.mint, 56],
        [String(hrv), 'HRV', colors.cyan, 92],
        [String(resp), 'RESP', colors.violet, 128],
      ];
      body = (
        <G>
          <Paper y0={frame.paper[0]} y1={frame.paper[1]} />
          <Trace d={run.d} color={traceColor} shine={shine} />
          <Path d={respD} fill="none" stroke={colors.cyan} strokeWidth={1.6} strokeLinecap="round" />
          {stats.map(([num, unit, c, y]) => (
            <G key={unit}>
              <SvgText x={W - PAD.r - 4} y={y} fill={c} textAnchor="end" fontSize={17} fontFamily={fonts.display} fontWeight="700">
                {num}
              </SvgText>
              <Label x={W - PAD.r - 4} y={y + 10} fill={colors.textFaint} anchor="end">
                {unit}
              </Label>
            </G>
          ))}
        </G>
      );
    } else {
      /* VT-05 — one premature beat re-drawn coral + dashed ring */
      let aIdx = anomalyIndex ?? 0;
      if (anomalyIndex == null) {
        rrMs.forEach((ms, i) => {
          if (ms < rrMs[aIdx]) aIdx = i;
        });
      }
      aIdx = Math.max(0, Math.min(widths.length - 1, aIdx));
      let ax = PAD.l + 4;
      for (let i = 0; i < aIdx; i++) ax += widths[i];
      const ab = widths.length > 0 ? ecgRun(ax, frame.y0, frame.amp, [widths[aIdx]]) : null;
      const peak = ab?.peaks[0];
      body = (
        <G>
          <Paper y0={frame.paper[0]} y1={frame.paper[1]} />
          <Trace d={run.d} color={traceColor} shine={shine} />
          {ab ? <Path d={ab.d} fill="none" stroke={colors.zoneLow} strokeWidth={2} strokeLinejoin="round" /> : null}
          {peak ? (
            <G>
              <Circle
                cx={rd(peak.x)}
                cy={frame.y0 - 8}
                r={17}
                fill="none"
                stroke={colors.zoneLow}
                strokeWidth={1}
                strokeDasharray={[3, 3]}
                opacity={0.8}
              />
              <Tag x={peak.x + 22} y={34} color={colors.zoneLow} anchor="start" text={anomalyLabel} />
            </G>
          ) : null}
          <Label x={PAD.l + 2} y={132} fill={colors.textFaint} anchor="start">
            {caption ?? 'PREMATURE BEAT + COMPENSATORY PAUSE'}
          </Label>
        </G>
      );
    }
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={ariaLabel} style={[styles.root, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
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
