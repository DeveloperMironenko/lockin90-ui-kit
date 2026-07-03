import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* ZonePyramid — the shared catalog pyramid family (PY-01…PY-03,
   lockin90-design/charts/pyramid-charts.html): time-in-zone as a training
   pyramid — base easy, tip hard — drawn in a fixed 320×150 viewBox with mono
   catalog labels. Zones are passed TOP ROW FIRST (Z5 → Z1); bar widths
   normalize to the longest zone (the widest bar spans 95% of the bar box).
   Key: `.lk-pyr-*` (partner CSS packages/ui/src/styles/components/pyramid.css). */

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

export interface ZonePyramidProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
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

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;

/* Z5 → Z1 hue ladder (the catalog rows) */
const ZONE_COLORS = ['var(--zone-low)', 'var(--zone-mid)', 'var(--lime)', 'var(--mint)', 'var(--cyan)'];

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

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in pyramid.css. */
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
    <text className="lk-pyr-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
      {children}
    </text>
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
    <g>
      <rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(w)}
        height={13}
        rx={6.5}
        fill="var(--bg-0)"
        fillOpacity={0.78}
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <text className="lk-pyr-tag" x={rd(xa + w / 2)} y={rd(y + 2.8)} fill={color} textAnchor="middle">
        {children}
      </text>
    </g>
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
  className,
  ...rest
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
            <g key={i}>
              {shine ? (
                <rect
                  className="lk-pyr-shine"
                  x={CX + SPINE}
                  y={y}
                  width={rd(wNow)}
                  height={RH}
                  rx={RH / 2}
                  fill={col}
                  opacity={0.55}
                />
              ) : null}
              <rect x={CX + SPINE} y={y} width={rd(wNow)} height={RH} rx={RH / 2} fill={col} opacity={0.88} />
              <rect
                x={rd(CX - SPINE - wPrev)}
                y={y}
                width={rd(wPrev)}
                height={RH}
                rx={RH / 2}
                fill={col}
                opacity={0.32}
              />
              <Label x={CX} y={y + RH / 2 + 3} fill="var(--text-dim)">
                {z.label}
              </Label>
            </g>
          );
        })}
        <Label x={CX + SPINE + 50} y={24} fill="var(--text)">
          {periodLabels[0]}
        </Label>
        <Label x={CX - SPINE - 50} y={24} fill="var(--text-faint)">
          {periodLabels[1]}
        </Label>
        <line x1={CX} x2={CX} y1={MIRROR_TOP - 2} y2={rd(spineBottom)} stroke="var(--border)" strokeWidth={1} />
        {resolvedNote ? (
          <Tag x={CX + 80} y={140} color={zones.length ? colorOf(deltaIdx) : 'var(--mint)'}>
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
            <g key={i}>
              {shine ? (
                <rect
                  className="lk-pyr-shine"
                  x={rd(x)}
                  y={y}
                  width={rd(w)}
                  height={RH}
                  rx={RH / 2}
                  fill={col}
                  opacity={0.55}
                />
              ) : null}
              <rect x={rd(x)} y={y} width={rd(w)} height={RH} rx={RH / 2} fill={col} opacity={0.88} />
              {targets && z.target != null ? (
                <rect
                  x={rd(CX - (frac(z.target) * MAXW) / 2)}
                  y={y - 1.5}
                  width={rd(frac(z.target) * MAXW)}
                  height={RH + 3}
                  rx={(RH + 3) / 2}
                  fill="none"
                  stroke="var(--text)"
                  strokeOpacity={0.55}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              ) : null}
              {w > LABEL_MIN_W ? (
                <text
                  className="lk-pyr-zone"
                  x={CX}
                  y={rd(y + RH / 2 + 3)}
                  fill="var(--bg-0)"
                  fillOpacity={0.85}
                  textAnchor="middle"
                >
                  {z.label}
                </text>
              ) : (
                <Label x={CX} y={y - 3} fill={col}>
                  {z.label}
                </Label>
              )}
              <Label x={CX - MAXW / 2 - 10} y={y + RH / 2 + 3} fill="var(--text-faint)" anchor="end">
                {pctOf(z)}
              </Label>
              <Label x={CX + MAXW / 2 + 10} y={y + RH / 2 + 3} fill="var(--text-dim)" anchor="start">
                {z.time ?? hmm(z.minutes)}
              </Label>
            </g>
          );
        })}
        {resolvedNote && overIdx >= 0 ? (
          <Tag x={CX + MAXW / 2 + 24} y={TOP + overIdx * (RH + GAP)} color="var(--zone-mid)" anchor="end">
            {resolvedNote}
          </Tag>
        ) : resolvedNote ? (
          <Tag x={CX + MAXW / 2 + 24} y={TOP} color="var(--zone-mid)" anchor="end">
            {resolvedNote}
          </Tag>
        ) : null}
        {resolvedCaption ? (
          <Label x={CX} y={144} fill="var(--text-faint)">
            {resolvedCaption}
          </Label>
        ) : null}
      </>
    );
  }

  return (
    <div className={cn('lk-pyr', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-pyr-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {title ? (
          <Label x={PAD.l + 2} y={11} fill="var(--text-faint)" anchor="start">
            {title}
          </Label>
        ) : null}
        {body}
      </svg>
    </div>
  );
}
