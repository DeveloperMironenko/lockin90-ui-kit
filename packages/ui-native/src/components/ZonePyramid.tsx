import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* ZonePyramid — the shared catalog pyramid family (PY-01…PY-03,
   lockin90-design/charts/pyramid-charts.html): time-in-zone as a training
   pyramid — base easy, tip hard — drawn in a fixed 320×150 viewBox with mono
   catalog labels. Native twin of `@lockin90/ui` ZonePyramid — same prop API;
   shine is a wider faint duplicate bar (never SVG filters on native). */

export type ZonePyramidVariant =
  | 'zone-pyramid' /* PY-01 — 5 centered bars Z5→Z1 · % left, h:mm right, zone letter inside */
  | 'target-pyramid' /* PY-02 — PY-01 + dashed white target outline per zone + amber OVER pill */
  | 'mirror-pyramid'; /* PY-03 — population-pyramid: this week right (solid) vs last week left (32%) */

/** One pyramid row, top row first (Z5 → Z1). */
export interface PyramidZone {
  /** Zone letter/name — inside the bar when it's wide enough ('Z2'). */
  label: string;
  /** Time in zone (minutes) — bar width normalizes to the longest zone. */
  minutes: number;
  /** Target minutes (`target-pyramid` dashed outline; same scale as `minutes`). */
  target?: number;
  /** Previous-period minutes (`mirror-pyramid` left bar; same scale). */
  prev?: number;
  /** Left label override; derived as the share of total ('17%'). */
  pct?: string;
  /** Right label override; derived as h:mm from `minutes` ('1:58'). */
  time?: string;
  /** Bar color. Defaults cycle zone-low / zone-mid / lime / mint / cyan (Z5→Z1). */
  color?: string;
}

export interface ZonePyramidProps {
  /** Catalog variant (PY-01 / PY-02 / PY-03). */
  variant?: ZonePyramidVariant;
  /** The rows, top first (Z5 → Z1). */
  zones?: PyramidZone[];
  /** Top-left mono caption ('TIME IN ZONE · WEEK'). */
  title?: string;
  /** Bottom faint line. `zone-pyramid` derives '11H 11M TOTAL'; '' hides. */
  caption?: string;
  /** The pill: `target-pyramid` biggest overage ('Z3 +40M OVER' — derived),
   *  `mirror-pyramid` biggest change ('Z2 +29 MIN' — derived); '' hides. */
  note?: string;
  /** `mirror-pyramid` column headings. */
  periodLabels?: [string, string];
  /** Soft glow underlay behind each solid bar (the catalog glow modifier). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
  /** Optional container style. */
  style?: StyleProp<ViewStyle>;
}

/* ---- catalog geometry (viewBox units — charts/pyramid-charts.html) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
/** widest bar box + row metrics (the page's MAXW / RH / GAP) */
const MAXW = 168;
const RH = 16;
const GAP = 5;
const CX = 160;
const TOP = 28;
/** the longest zone's bar spans 95% of the bar box (catalog headroom) */
const HEAD = 0.95;
/** mirror layout: half-width bar boxes either side of a 14px spine gap */
const MIRROR_TOP = 30;
const MIRROR_MAXW = 108;
const SPINE = 14;
/** zone letters render inside bars wider than this; above the bar otherwise */
const LABEL_MIN_W = 34;

/** Round for compact attribute values. */
const rd = (n: number) => Math.round(n * 100) / 100;

/* Z5 → Z1 hue ladder (the catalog rows) */
const ZONE_COLORS = [colors.zoneLow, colors.zoneMid, colors.lime, colors.mint, colors.cyan];

/* the catalog demo data (pyramid-charts.html ZONES + derived target/prev
   minutes) — stories reproduce the cards */
const DEFAULT_ZONES: PyramidZone[] = [
  { label: 'Z5', minutes: 36, target: 26, prev: 22, pct: '3%', time: '0:36' },
  { label: 'Z4', minutes: 72, target: 53, prev: 94, pct: '8%', time: '1:12' },
  { label: 'Z3', minutes: 118, target: 78, prev: 130, pct: '17%', time: '1:58' },
  { label: 'Z2', minutes: 195, target: 224, prev: 166, pct: '29%', time: '3:15' },
  { label: 'Z1', minutes: 250, target: 263, prev: 238, pct: '43%', time: '4:10' },
];

/** minutes → 'h:mm' ('118' → '1:58'). */
function hmm(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
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

/**
 * ZonePyramid — time-in-zone intensity pyramid for product surfaces (catalog
 * family PY-01…PY-03). `zone-pyramid` is THE weekly intensity-distribution
 * card: centered bars Z5→Z1, width = time, % left / h:mm right, zone letter
 * inside wide bars — a base-heavy shape reads as healthy. `target-pyramid`
 * overlays a dashed target outline per zone plus an amber OVER pill where you
 * exceed; `mirror-pyramid` mirrors this week (solid, right) against last week
 * (32%, left) around a spine with the zone letters on it.
 */
export function ZonePyramid({
  variant = 'zone-pyramid',
  zones = DEFAULT_ZONES,
  title,
  caption,
  note,
  periodLabels = ['THIS WEEK', 'LAST WEEK'],
  shine = false,
  ariaLabel = 'Zone pyramid',
  style,
}: ZonePyramidProps) {
  const maxMin = Math.max(...zones.map((z) => z.minutes), 0);
  const totalMin = zones.reduce((a, z) => a + Math.max(0, z.minutes), 0);
  const frac = (m: number) => (maxMin > 0 ? (Math.max(0, m) / maxMin) * HEAD : 0);
  const colorOf = (i: number) => zones[i].color ?? ZONE_COLORS[i % ZONE_COLORS.length];
  const pctOf = (z: PyramidZone) =>
    z.pct ?? (totalMin > 0 ? `${Math.round((Math.max(0, z.minutes) / totalMin) * 100)}%` : '0%');

  let body = null;
  if (variant === 'mirror-pyramid') {
    /* ---- PY-03 · this week vs last week around a spine ---- */
    const spineBottom = MIRROR_TOP + zones.length * (RH + GAP) - GAP + 2;
    /* derived delta pill: the zone with the biggest week-over-week change */
    let deltaIdx = 0;
    zones.forEach((z, i) => {
      const d = z.minutes - (z.prev ?? 0);
      const best = zones[deltaIdx].minutes - (zones[deltaIdx].prev ?? 0);
      if (Math.abs(d) > Math.abs(best)) deltaIdx = i;
    });
    const delta = zones.length ? zones[deltaIdx].minutes - (zones[deltaIdx].prev ?? 0) : 0;
    const resolvedNote =
      note ??
      (zones.length
        ? `${zones[deltaIdx].label} ${delta >= 0 ? '+' : ''}${Math.round(delta)} MIN`
        : undefined);
    body = (
      <>
        {zones.map((z, i) => {
          const y = MIRROR_TOP + i * (RH + GAP);
          const wNow = frac(z.minutes) * MIRROR_MAXW;
          const wPrev = frac(z.prev ?? 0) * MIRROR_MAXW;
          const col = colorOf(i);
          return (
            <G key={i}>
              {shine ? (
                <Rect
                  x={CX + SPINE - 2}
                  y={y - 2}
                  width={rd(wNow + 4)}
                  height={RH + 4}
                  rx={(RH + 4) / 2}
                  fill={col}
                  opacity={0.3}
                />
              ) : null}
              <Rect x={CX + SPINE} y={y} width={rd(wNow)} height={RH} rx={RH / 2} fill={col} opacity={0.88} />
              <Rect
                x={rd(CX - SPINE - wPrev)}
                y={y}
                width={rd(wPrev)}
                height={RH}
                rx={RH / 2}
                fill={col}
                opacity={0.32}
              />
              <Label x={CX} y={y + RH / 2 + 3} fill={colors.textDim}>
                {z.label}
              </Label>
            </G>
          );
        })}
        <Label x={CX + SPINE + 50} y={24} fill={colors.text}>
          {periodLabels[0]}
        </Label>
        <Label x={CX - SPINE - 50} y={24} fill={colors.textFaint}>
          {periodLabels[1]}
        </Label>
        <Line x1={CX} x2={CX} y1={MIRROR_TOP - 2} y2={rd(spineBottom)} stroke={colors.border} strokeWidth={1} />
        {resolvedNote ? (
          <Tag x={CX + 80} y={140} color={zones.length ? colorOf(deltaIdx) : colors.mint}>
            {resolvedNote}
          </Tag>
        ) : null}
      </>
    );
  } else {
    /* ---- PY-01 / PY-02 · the centered pyramid (+ dashed targets) ---- */
    const targets = variant === 'target-pyramid';
    /* derived OVER pill: the zone with the biggest positive overage */
    let overIdx = -1;
    if (targets) {
      zones.forEach((z, i) => {
        if (z.target == null) return;
        const over = z.minutes - z.target;
        if (over > 0 && (overIdx < 0 || over > zones[overIdx].minutes - (zones[overIdx].target ?? 0))) overIdx = i;
      });
    }
    const resolvedNote =
      note ??
      (targets && overIdx >= 0
        ? `${zones[overIdx].label} +${Math.round(zones[overIdx].minutes - (zones[overIdx].target ?? 0))}M OVER`
        : undefined);
    const resolvedCaption =
      caption ??
      (variant === 'zone-pyramid'
        ? `${Math.floor(Math.round(totalMin) / 60)}H ${String(Math.round(totalMin) % 60).padStart(2, '0')}M TOTAL`
        : undefined);
    body = (
      <>
        {zones.map((z, i) => {
          const y = TOP + i * (RH + GAP);
          const w = frac(z.minutes) * MAXW;
          const x = CX - w / 2;
          const col = colorOf(i);
          return (
            <G key={i}>
              {shine ? (
                <Rect
                  x={rd(x - 2)}
                  y={y - 2}
                  width={rd(w + 4)}
                  height={RH + 4}
                  rx={(RH + 4) / 2}
                  fill={col}
                  opacity={0.3}
                />
              ) : null}
              <Rect x={rd(x)} y={y} width={rd(w)} height={RH} rx={RH / 2} fill={col} opacity={0.88} />
              {targets && z.target != null ? (
                <Rect
                  x={rd(CX - (frac(z.target) * MAXW) / 2)}
                  y={y - 1.5}
                  width={rd(frac(z.target) * MAXW)}
                  height={RH + 3}
                  rx={(RH + 3) / 2}
                  fill="none"
                  stroke={colors.text}
                  strokeOpacity={0.55}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              ) : null}
              {w > LABEL_MIN_W ? (
                <SvgText
                  x={CX}
                  y={rd(y + RH / 2 + 3)}
                  fill={colors.bg0}
                  fillOpacity={0.85}
                  textAnchor="middle"
                  fontSize={8.5}
                  fontFamily={fonts.mono}
                  fontWeight="700"
                >
                  {z.label}
                </SvgText>
              ) : (
                <Label x={CX} y={y - 3} fill={col}>
                  {z.label}
                </Label>
              )}
              <Label x={CX - MAXW / 2 - 10} y={y + RH / 2 + 3} fill={colors.textFaint} anchor="end">
                {pctOf(z)}
              </Label>
              <Label x={CX + MAXW / 2 + 10} y={y + RH / 2 + 3} fill={colors.textDim} anchor="start">
                {z.time ?? hmm(z.minutes)}
              </Label>
            </G>
          );
        })}
        {resolvedNote && overIdx >= 0 ? (
          <Tag x={CX + MAXW / 2 + 24} y={TOP + overIdx * (RH + GAP)} color={colors.zoneMid} anchor="end">
            {resolvedNote}
          </Tag>
        ) : resolvedNote ? (
          <Tag x={CX + MAXW / 2 + 24} y={TOP} color={colors.zoneMid} anchor="end">
            {resolvedNote}
          </Tag>
        ) : null}
        {resolvedCaption ? (
          <Label x={CX} y={144} fill={colors.textFaint}>
            {resolvedCaption}
          </Label>
        ) : null}
      </>
    );
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
