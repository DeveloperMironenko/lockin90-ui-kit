import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* UnitChart — the shared catalog unit/waffle family (UN-01…UN-05,
   lockin90-design/charts/unit-charts.html): every unit is a day, a dose, a
   session — waffles and pictograms drawn in a fixed 320×150 viewBox with mono
   catalog labels. The 90-day program waffle (`waffle-90`) is the signature:
   90 dots, filled mint ramping toward today, a pulsing lime TODAY dot.
   Key: `.lk-unit-*` (partner CSS packages/ui/src/styles/components/unitchart.css). */

export type UnitChartVariant =
  | 'waffle-90' /* UN-01 — 90 dots (15×6) · filled ramps toward today · lime TODAY pulse + caption */
  | 'waffle-share' /* UN-02 — 10×10 squares partitioned by zone colors + dot legend */
  | 'pictogram-rows' /* UN-03 — icon rows (dumbbell/moon/cup) · done vs remaining 18% + counts */
  | 'day-dots' /* UN-04 — 7 big dots · done = fill + dark check · pending outline + day letters + pill */
  | 'habit-grid'; /* UN-05 — habit rows × 7 day dots, each row its own hue */

/** One share of the `waffle-share` 10×10 grid — `value` cells (of 100). */
export interface UnitSegment {
  /** Legend word ('GOOD'). */
  label: string;
  /** Cell count out of 100 (segments fill the grid in order; leftover stays faint). */
  value: number;
  /** Cell + legend-dot color. Defaults cycle mint / zone-mid / zone-low. */
  color?: string;
}

/** Built-in `pictogram-rows` glyphs (24×24 stroke paths from the catalog). */
export type UnitPictogramIcon = 'dumbbell' | 'moon' | 'cup';

/** One `pictogram-rows` tally row: `done` of `total` icon units. */
export interface UnitPictogramRow {
  /** Row label, mono, right-aligned before the icons ('SLEEP 8H+'). */
  label: string;
  /** Units drawn. */
  total: number;
  /** Units at full opacity (remaining draw at 18%). */
  done: number;
  /** Built-in glyph. Defaults cycle dumbbell / moon / cup. */
  icon?: UnitPictogramIcon;
  /** Custom 24×24 stroke path — overrides `icon`. */
  iconPath?: string;
  /** Icon stroke + count color. Defaults cycle cyan / violet / zone-mid. */
  color?: string;
}

/** One `habit-grid` row: a week of on/off dots in the habit's own hue. */
export interface UnitHabitRow {
  /** Habit label, mono, drawn in the row hue ('MEDITATE'). */
  label: string;
  /** 7 day flags, Monday first. */
  days: (boolean | 0 | 1)[];
  /** Row hue. Defaults cycle mint / cyan / lime. */
  color?: string;
}

export interface UnitChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'color'> {
  /** Catalog variant (UN-01 / UN-02 / UN-03 / UN-04 / UN-05). */
  variant?: UnitChartVariant;
  /** `waffle-90` — total dots (one per program day). */
  total?: number;
  /** `waffle-90` — days completed; dot `done` is TODAY (pulses lime). */
  done?: number;
  /** `waffle-90` — grid columns (rows derive as `ceil(total / columns)`). */
  columns?: number;
  /** `waffle-90` fill / `day-dots` dot color. */
  color?: string;
  /** `waffle-share` — the grid shares (values sum to ≤100). */
  segments?: UnitSegment[];
  /** `pictogram-rows` — the tally rows. */
  rows?: UnitPictogramRow[];
  /** `day-dots` — 7 day flags, Monday first. */
  days?: (boolean | 0 | 1)[];
  /** Day letters under `day-dots` / `habit-grid` dots (one char per day). */
  dayLabels?: string;
  /** `habit-grid` — the habit rows. */
  habits?: UnitHabitRow[];
  /** Top-left mono caption ('90-DAY LOCK-IN'). */
  title?: string;
  /** Top-right mint stat. `waffle-90` derives `'62%'` from done/total; '' hides. */
  stat?: string;
  /** Bottom faint legend line. `waffle-90` derives
   *  'EACH DOT = A DAY · 56 OF 90 LOCKED IN'; '' hides. */
  caption?: string;
  /** `day-dots` chip-pill, top-right ('5 OF 7 · ON TRACK' — derived); '' hides. */
  note?: string;
  /** Soft glow underlays (the catalog glow modifier). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_W = W - PAD.l - PAD.r; // 298
const PLOT_H = H - PAD.t - PAD.b; // 120

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;

/* built-in pictogram glyphs (24×24 stroke paths — the catalog rows) */
const ICON_PATHS: Record<UnitPictogramIcon, string> = {
  dumbbell: 'M6 10h2v4H6zM16 10h2v4h-2zM8 11h8v2H8z',
  moon: 'M15 4a7 7 0 1 0 5 10 8 8 0 0 1-5-10z',
  cup: 'M5 8h10v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM15 9h2a2 2 0 0 1 0 4h-2',
};

/* default hue cycles (catalog rows) */
const SEGMENT_COLORS = ['var(--mint)', 'var(--zone-mid)', 'var(--zone-low)'];
const PICTO_COLORS = ['var(--cyan)', 'var(--violet)', 'var(--zone-mid)'];
const PICTO_ICONS: UnitPictogramIcon[] = ['dumbbell', 'moon', 'cup'];
const HABIT_COLORS = ['var(--mint)', 'var(--cyan)', 'var(--lime)'];

/* the catalog demo data (unit-charts.html) — stories reproduce the cards */
const DEFAULT_SEGMENTS: UnitSegment[] = [
  { label: 'GOOD', value: 52 },
  { label: 'OK', value: 31 },
  { label: 'ROUGH', value: 17 },
];
const DEFAULT_ROWS: UnitPictogramRow[] = [
  { label: 'TRAINING', total: 5, done: 3 },
  { label: 'SLEEP 8H+', total: 7, done: 5 },
  { label: 'NO-CAFF DAYS', total: 7, done: 4 },
];
const DEFAULT_DAYS = [true, true, true, true, true, false, false];
const DEFAULT_HABITS: UnitHabitRow[] = [
  { label: 'MEDITATE', days: [1, 1, 0, 1, 1, 1, 0] },
  { label: 'LIFT', days: [1, 0, 1, 0, 1, 0, 0] },
  { label: 'SUNLIGHT', days: [1, 1, 1, 1, 0, 1, 1] },
];

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in unitchart.css. */
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
    <text className="lk-unit-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
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
      <text className="lk-unit-tag" x={rd(xa + w / 2)} y={rd(y + 2.8)} fill={color} textAnchor="middle">
        {children}
      </text>
    </g>
  );
}

/** TODAY pulse: glowing core + expanding fading ring (the catalog pulseDot). */
function PulseDot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <>
      <circle
        className="lk-unit-pulsecore"
        cx={rd(x)}
        cy={rd(y)}
        r={3.6}
        fill={color}
        style={{ color } as CSSProperties}
      />
      <circle className="lk-unit-pulsering" cx={rd(x)} cy={rd(y)} r={3.6} fill="none" stroke={color} strokeWidth={1.4} />
    </>
  );
}

/**
 * UnitChart — countable-units chart for product surfaces (catalog family
 * UN-01…UN-05). `waffle-90` is THE program waffle: every day is a dot, filled
 * ramps toward today, TODAY pulses lime. `waffle-share` renders a percentage
 * as a 10×10 zone-colored grid, `pictogram-rows` as friendly icon tallies,
 * `day-dots` as a single habit's week strip, `habit-grid` as the mini habit
 * board (rows × day dots, one hue per habit).
 */
export function UnitChart({
  variant = 'waffle-90',
  total = 90,
  done = 56,
  columns = 15,
  color = 'var(--mint)',
  segments = DEFAULT_SEGMENTS,
  rows = DEFAULT_ROWS,
  days = DEFAULT_DAYS,
  dayLabels = 'MTWTFSS',
  habits = DEFAULT_HABITS,
  title,
  stat,
  caption,
  note,
  shine = false,
  ariaLabel = 'Unit chart',
  className,
  ...rest
}: UnitChartProps) {
  const resolvedStat =
    stat ?? (variant === 'waffle-90' && total > 0 ? `${Math.round((done / total) * 100)}%` : undefined);
  const resolvedCaption =
    caption ?? (variant === 'waffle-90' ? `EACH DOT = A DAY · ${done} OF ${total} LOCKED IN` : undefined);

  return (
    <div className={cn('lk-unit', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-unit-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {title ? (
          <Label x={PAD.l + 2} y={11} fill="var(--text-faint)" anchor="start">
            {title}
          </Label>
        ) : null}
        {resolvedStat ? (
          <text className="lk-unit-stat" x={W - PAD.r - 2} y={12} fill="var(--mint)" textAnchor="end">
            {resolvedStat}
          </text>
        ) : null}

        {variant === 'waffle-90' ? (
          /* ---- UN-01 · the 90-day program waffle ---- */
          (() => {
            const rowsN = Math.max(1, Math.ceil(total / Math.max(1, columns)));
            const gap = 4;
            const cw = (PLOT_W - 30 - gap * (columns - 1)) / columns; // dot diameter
            return (
              <>
                {Array.from({ length: total }, (_, i) => {
                  const r = i % rowsN;
                  const c = Math.floor(i / rowsN);
                  const x = PAD.l + 16 + c * (cw + gap);
                  const y = PAD.t + 10 + r * (cw + gap);
                  const filled = i < done;
                  return (
                    <g key={i}>
                      {shine && filled && i % 7 === 0 ? (
                        <circle
                          cx={rd(x + cw / 2)}
                          cy={rd(y + cw / 2)}
                          r={rd(cw / 2 + 2)}
                          fill={color}
                          opacity={0.5}
                          style={{ filter: 'blur(4px)' }}
                        />
                      ) : null}
                      <circle
                        cx={rd(x + cw / 2)}
                        cy={rd(y + cw / 2)}
                        r={rd(cw / 2)}
                        fill={filled ? color : 'var(--glass-2)'}
                        opacity={filled ? rd(0.5 + 0.5 * (i / done)) : 1}
                      />
                      {i === done ? <PulseDot x={x + cw / 2} y={y + cw / 2} color="var(--lime)" /> : null}
                    </g>
                  );
                })}
                {resolvedCaption ? (
                  <Label x={PAD.l + 16} y={H - 4} fill="var(--text-faint)" anchor="start">
                    {resolvedCaption}
                  </Label>
                ) : null}
              </>
            );
          })()
        ) : variant === 'waffle-share' ? (
          /* ---- UN-02 · 10×10 percent grid + dot legend ---- */
          (() => {
            const n = 10;
            const gap = 3;
            const cell = Math.min(PLOT_H - 22, 110) / n - gap + 3; // 9.8
            // grid sits LEFT of center — the +20 right-shift made its last columns
            // (right edge ≈244) run under the dot legend at x=226; -34 keeps ≥36px clear.
            const gx = W / 2 - (n * (cell + gap)) / 2 - 34;
            const cells = [];
            for (let r = 0; r < n; r++) {
              for (let c = 0; c < n; c++) {
                const idx = r * n + c;
                let acc = 0;
                let col = 'var(--glass-2)';
                for (let k = 0; k < segments.length; k++) {
                  acc += segments[k].value;
                  if (idx < acc) {
                    col = segments[k].color ?? SEGMENT_COLORS[k % SEGMENT_COLORS.length];
                    break;
                  }
                }
                cells.push(
                  <rect
                    key={idx}
                    x={rd(gx + c * (cell + gap))}
                    y={rd(PAD.t + 8 + r * (cell + gap))}
                    width={rd(cell)}
                    height={rd(cell)}
                    rx={2}
                    fill={col}
                    opacity={0.9}
                  />,
                );
              }
            }
            return (
              <>
                {cells}
                {segments.map((s, i) => {
                  const ly = PAD.t + 26 + i * 22;
                  const col = s.color ?? SEGMENT_COLORS[i % SEGMENT_COLORS.length];
                  return (
                    <g key={i}>
                      <circle cx={226} cy={ly} r={4} fill={col} />
                      <Label x={236} y={ly + 3} fill="var(--text-dim)" anchor="start">
                        {`${s.label} ${s.value}`}
                      </Label>
                    </g>
                  );
                })}
              </>
            );
          })()
        ) : variant === 'pictogram-rows' ? (
          /* ---- UN-03 · icon tallies (done vs remaining 18%) ---- */
          <>
            {rows.map((row, ri) => {
              const y = PAD.t + 16 + ri * 34;
              const col = row.color ?? PICTO_COLORS[ri % PICTO_COLORS.length];
              const d = row.iconPath ?? ICON_PATHS[row.icon ?? PICTO_ICONS[ri % PICTO_ICONS.length]];
              return (
                <g key={ri}>
                  <Label x={PAD.l + 74} y={y + 12} fill="var(--text-dim)" anchor="end">
                    {row.label}
                  </Label>
                  {Array.from({ length: row.total }, (_, u) => (
                    <g
                      key={u}
                      transform={`translate(${PAD.l + 86 + u * 26} ${y}) scale(0.9)`}
                      opacity={u < row.done ? 1 : 0.18}
                    >
                      <path d={d} fill="none" stroke={col} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  ))}
                  <Label x={PAD.l + 86 + row.total * 26 + 4} y={y + 12} fill={col} anchor="start">
                    {`${row.done}/${row.total}`}
                  </Label>
                </g>
              );
            })}
          </>
        ) : variant === 'day-dots' ? (
          /* ---- UN-04 · single habit week strip ---- */
          (() => {
            const y = H / 2 + 4;
            const onCount = days.filter(Boolean).length;
            const pill = note ?? `${onCount} OF ${days.length} · ON TRACK`;
            return (
              <>
                {days.map((raw, u) => {
                  const on = Boolean(raw);
                  const x = PAD.l + 34 + u * 38;
                  return (
                    <g key={u}>
                      {on && shine ? (
                        <circle cx={x} cy={y} r={12} fill={color} opacity={0.5} style={{ filter: 'blur(5px)' }} />
                      ) : null}
                      <circle
                        cx={x}
                        cy={y}
                        r={10}
                        fill={on ? color : 'none'}
                        stroke={on ? color : 'var(--border-2)'}
                        strokeWidth={1.6}
                      />
                      {on ? (
                        <path
                          d={`M${x - 4} ${y}l3 3 5 -6`}
                          fill="none"
                          stroke="var(--bg-0)"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : null}
                      <Label x={x} y={y + 24} fill="var(--text-faint)">
                        {dayLabels[u] ?? ''}
                      </Label>
                    </g>
                  );
                })}
                {pill ? (
                  <Tag x={W - PAD.r - 4} y={y - 24} color={color} anchor="end">
                    {pill}
                  </Tag>
                ) : null}
              </>
            );
          })()
        ) : variant === 'habit-grid' ? (
          /* ---- UN-05 · the mini habit board (rows × day dots) ---- */
          <>
            {habits.map((hb, hi) => {
              const y = PAD.t + 18 + hi * 30;
              const col = hb.color ?? HABIT_COLORS[hi % HABIT_COLORS.length];
              return (
                <g key={hi}>
                  <Label x={PAD.l + 64} y={y + 4} fill={col} anchor="end">
                    {hb.label}
                  </Label>
                  {hb.days.map((raw, di) => {
                    const on = Boolean(raw);
                    return (
                      <circle
                        key={di}
                        cx={PAD.l + 78 + di * 30}
                        cy={y}
                        r={8}
                        fill={on ? col : 'none'}
                        stroke={on ? col : 'var(--border-2)'}
                        strokeWidth={1.4}
                        opacity={on ? 0.9 : 1}
                      />
                    );
                  })}
                </g>
              );
            })}
            {Array.from({ length: 7 }, (_, d) => (
              <Label key={d} x={PAD.l + 78 + d * 30} y={H - 4} fill="var(--text-faint)">
                {dayLabels[d] ?? ''}
              </Label>
            ))}
          </>
        ) : null}
      </svg>
    </div>
  );
}
