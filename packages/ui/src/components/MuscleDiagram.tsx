import { useId, useMemo, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** How hard a muscle is worked by a movement. */
export type MuscleRole = 'primary' | 'secondary' | 'stabilizer';

/** A named muscle group the body map can highlight. */
export type MuscleGroup =
  | 'chest'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'back'
  | 'lats'
  | 'traps';

/** Body silhouette to draw — changes the proportions (shoulders / waist / hips / bust). */
export type BodyType = 'male' | 'female' | 'nonbinary';

/** One worked muscle group + the role it plays in the movement. */
export interface MuscleTarget {
  /** the muscle group to highlight */
  group: MuscleGroup;
  /** how hard it's worked — drives the highlight color */
  role: MuscleRole;
}

export interface MuscleDiagramProps extends HTMLAttributes<HTMLDivElement> {
  /** muscle groups to highlight, colored by role */
  targets?: MuscleTarget[];
  /** which side of the body to draw (default 'front') */
  view?: 'front' | 'back';
  /** body silhouette proportions (default 'male') */
  bodyType?: BodyType;
  /** show the role legend + worked-group rows beside the figure (default true) */
  showLegend?: boolean;
  /** SVG height in px (default 240); width scales with the figure's aspect ratio */
  size?: number;
}

/* ============================================================================
 * Anatomical body-map geometry — a deterministic parametric generator. The SAME
 * code (and therefore the SAME path strings) runs in the web and native twins, so
 * the figure is pixel-identical across platforms. A `BodyType` picks half-width
 * proportions; the silhouette is a smooth Catmull-Rom outline, and each muscle
 * group is an anatomically-placed rounded region. viewBox 120 × 248, centered at
 * x = 60.
 * ========================================================================== */

export const MUSCLE_VB_W = 120;
export const MUSCLE_VB_H = 248;

type Pt = [number, number];
const CX = 60;
const nr = (v: number) => Math.round(v * 100) / 100;
const P = (x: number, y: number) => `${nr(x)} ${nr(y)}`;

/** Smooth closed outline from ordered points via Catmull-Rom → cubic béziers. */
function smoothClosed(pts: Pt[]): string {
  const k = 1 / 6;
  const N = pts.length;
  let d = `M${P(pts[0][0], pts[0][1])}`;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % N];
    const p3 = pts[(i + 2) % N];
    const c1x = p1[0] + (p2[0] - p0[0]) * k;
    const c1y = p1[1] + (p2[1] - p0[1]) * k;
    const c2x = p2[0] - (p3[0] - p1[0]) * k;
    const c2y = p2[1] - (p3[1] - p1[1]) * k;
    d += `C${P(c1x, c1y)} ${P(c2x, c2y)} ${P(p2[0], p2[1])}`;
  }
  return d + 'Z';
}

/** Mirror right-side points across the centerline, reversed (for the left half). */
function mirror(pts: Pt[]): Pt[] {
  return pts
    .slice()
    .reverse()
    .map(([x, y]) => [2 * CX - x, y] as Pt);
}

interface Proportions {
  neck: number; trap: number; delt: number; chest: number;
  waist: number; hip: number; thigh: number; calf: number; bust: number;
}

/** Half-widths (from the x=60 centerline) per body type. */
const TYPES: Record<BodyType, Proportions> = {
  male:      { neck: 7,   trap: 12,   delt: 30, chest: 22, waist: 15, hip: 18, thigh: 12,   calf: 7.5, bust: 0 },
  female:    { neck: 5.5, trap: 9,    delt: 22, chest: 17, waist: 11, hip: 21, thigh: 12.5, calf: 7,   bust: 4.5 },
  nonbinary: { neck: 6,   trap: 10.5, delt: 26, chest: 19, waist: 13, hip: 19, thigh: 12,   calf: 7.2, bust: 1.5 },
};

/** Full silhouette paths (head + neck + body outline + optional bust) for a type. */
function buildBody(t: Proportions): string[] {
  const yNeck = 33, yDelt = 50, yArmpit = 60, yChestB = 74,
        yWaist = 96, yHip = 116, yHipMax = 124, yCrotch = 128,
        yKnee = 176, yCalf = 196, yAnkle = 224, yFoot = 232;

  const right: Pt[] = [
    [CX + t.neck, yNeck],
    [CX + t.trap, 39],
    [CX + t.delt, yDelt],
    [CX + t.delt - 4, yChestB - 4],
    [CX + t.delt - 6, yWaist - 6],
    [CX + t.delt - 7, yWaist + 4],
    [CX + t.delt - 11, yWaist + 3],
    [CX + t.delt - 10, yChestB],
    [CX + t.chest - 1, yArmpit + 2],
    [CX + t.chest, yChestB],
    [CX + t.waist, yWaist],
    [CX + t.hip, yHip],
    [CX + t.hip, yHipMax],
    [CX + t.thigh + 3, yCrotch + 8],
    [CX + t.thigh + 1, yKnee],
    [CX + t.calf + 1.5, yCalf],
    [CX + t.calf - 4, yAnkle],
    [CX + t.calf - 3.5, yFoot],
    [CX + 2.5, yFoot],
    [CX + 3, yAnkle],
    [CX + 4.5, yCalf],
    [CX + 4, yKnee],
    [CX + 5, yCrotch + 6],
    [CX + 1, yCrotch],
  ];
  const outline = [...right, ...mirror(right)];

  const headR = 13, headCy = 19;
  const head = `M${P(CX, headCy - headR)} a${headR} ${headR} 0 1 0 0.01 0 Z`;
  const neck =
    `M${P(CX - t.neck - 0.5, yNeck)} L${P(CX - t.neck + 1, headCy + headR - 3)} ` +
    `L${P(CX + t.neck - 1, headCy + headR - 3)} L${P(CX + t.neck + 0.5, yNeck)} Z`;

  const parts = [head, neck, smoothClosed(outline)];
  if (t.bust > 0.5) {
    const by = 62, bx = 9, br = t.bust;
    parts.push(
      `M${P(CX - bx - br, by - br)} a${br} ${br} 0 1 0 ${nr(2 * br)} 0 a${br} ${br} 0 1 0 ${nr(-2 * br)} 0 Z` +
        `M${P(CX + bx - br, by - br)} a${br} ${br} 0 1 0 ${nr(2 * br)} 0 a${br} ${br} 0 1 0 ${nr(-2 * br)} 0 Z`,
    );
  }
  return parts;
}

/** A mirrored pair of ellipse blobs at ±dx, vertical center cy, radii rx/ry. */
function pairEllipse(dx: number, cy: number, rx: number, ry: number): string {
  const e = (cx: number) =>
    `M${P(cx - rx, cy)} a${rx} ${ry} 0 1 0 ${nr(2 * rx)} 0 a${rx} ${ry} 0 1 0 ${nr(-2 * rx)} 0 Z`;
  return e(CX - dx) + e(CX + dx);
}
/** A rounded-rectangle plate from (x0,y0) to (x1,y1). */
function plate(x0: number, y0: number, x1: number, y1: number, rad = 4): string {
  return (
    `M${P(x0 + rad, y0)} L${P(x1 - rad, y0)} Q${P(x1, y0)} ${P(x1, y0 + rad)} ` +
    `L${P(x1, y1 - rad)} Q${P(x1, y1)} ${P(x1 - rad, y1)} L${P(x0 + rad, y1)} ` +
    `Q${P(x0, y1)} ${P(x0, y1 - rad)} L${P(x0, y0 + rad)} Q${P(x0, y0)} ${P(x0 + rad, y0)} Z`
  );
}

/** Anatomically-placed muscle regions per view, sized to the body proportions. */
function buildRegions(t: Proportions): Record<'front' | 'back', Partial<Record<MuscleGroup, string>>> {
  const dDelt = t.delt - 6;
  const dArm = t.delt - 8;
  const dObl = t.waist + 1;
  return {
    front: {
      traps: plate(CX - t.trap + 1, 37, CX + t.trap - 1, 45, 3),
      shoulders: pairEllipse(dDelt, 50, 6, 7),
      chest: plate(CX - t.chest + 2, 47, CX - 1.5, 64, 4) + plate(CX + 1.5, 47, CX + t.chest - 2, 64, 4),
      biceps: pairEllipse(dArm, 66, 4.5, 8),
      forearms: pairEllipse(dArm - 1, 86, 4, 8),
      abs: plate(CX - 7, 66, CX + 7, 94, 4),
      obliques: pairEllipse(dObl, 80, 3.5, 10),
      quads: pairEllipse(9, 142, 7, 18),
      calves: pairEllipse(9, 192, 5.5, 14),
    },
    back: {
      traps: plate(CX - t.trap + 1, 37, CX + t.trap - 1, 50, 4),
      shoulders: pairEllipse(dDelt, 50, 6, 7),
      back: plate(CX - t.chest + 3, 50, CX + t.chest - 3, 70, 5),
      lats: pairEllipse(t.chest - 4, 78, 5, 11),
      triceps: pairEllipse(dArm, 66, 4.5, 8),
      biceps: pairEllipse(dArm, 64, 3.8, 7),
      forearms: pairEllipse(dArm - 1, 86, 4, 8),
      glutes: pairEllipse(8, 124, 8, 9),
      hamstrings: pairEllipse(9, 150, 7, 16),
      calves: pairEllipse(9, 192, 5.5, 14),
    },
  };
}

/** Deterministic figure generator — identical output on web + native. */
export function generateFigure(bodyType: BodyType) {
  const t = TYPES[bodyType] ?? TYPES.male;
  return { silhouette: buildBody(t), regions: buildRegions(t) };
}

/** Human-readable label for each muscle group. */
export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  abs: 'Abs',
  obliques: 'Obliques',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  back: 'Back',
  lats: 'Lats',
  traps: 'Traps',
};

/** Resolved fill + stroke (token values) per role; opacity descends by role. */
export const ROLE_STYLE: Record<MuscleRole, { fill: string; stroke: string }> = {
  primary: { fill: 'rgba(52,245,197,0.55)', stroke: 'var(--mint)' },
  secondary: { fill: 'rgba(34,211,238,0.45)', stroke: 'var(--cyan)' },
  stabilizer: { fill: 'rgba(130,139,159,0.35)', stroke: 'var(--text-faint)' },
};

const ROLE_CHIP_TONE: Record<MuscleRole, ChipTone> = {
  primary: 'high',
  secondary: 'accent',
  stabilizer: 'neutral',
};

const ROLE_ORDER: Record<MuscleRole, number> = { primary: 0, secondary: 1, stabilizer: 2 };

const DEFAULT_TARGETS: MuscleTarget[] = [
  { group: 'chest', role: 'primary' },
  { group: 'triceps', role: 'secondary' },
  { group: 'shoulders', role: 'secondary' },
];

/**
 * MuscleDiagram — an anatomical body map. Draws a smooth front/back silhouette
 * for the chosen `bodyType` (male / female / nonbinary proportions), then tints
 * the targeted muscle groups by role: primary = mint (strongest), secondary =
 * cyan, stabilizer = faint gray. A legend beside the figure lists each worked
 * group + a role Chip. Tokens-driven, no Tailwind. The path data is generated by
 * a deterministic function shared verbatim with the native twin.
 */
export function MuscleDiagram({
  targets = DEFAULT_TARGETS,
  view = 'front',
  bodyType = 'male',
  showLegend = true,
  size = 240,
  className,
  ...rest
}: MuscleDiagramProps) {
  const uid = useId();
  void uid;

  const { silhouette, regions } = useMemo(() => generateFigure(bodyType), [bodyType]);
  const viewRegions = regions[view];

  // de-dup by group (first wins), keep only groups the current view can draw
  const seen = new Set<MuscleGroup>();
  const drawn = targets.filter((t) => {
    if (seen.has(t.group) || !viewRegions[t.group]) return false;
    seen.add(t.group);
    return true;
  });

  const rows = [...drawn].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);

  const width = (MUSCLE_VB_W / MUSCLE_VB_H) * size;
  const ariaLabel = `Body map (${bodyType}, ${view} view)${
    drawn.length ? `: ${drawn.map((t) => `${MUSCLE_LABELS[t.group]} ${t.role}`).join(', ')}` : ''
  }.`;

  return (
    <div className={cn('lk-muscle', showLegend && 'lk-muscle--legend', className)} {...rest}>
      <svg
        className="lk-muscle-svg"
        width={width}
        height={size}
        viewBox={`0 0 ${MUSCLE_VB_W} ${MUSCLE_VB_H}`}
        role="img"
        aria-label={ariaLabel}
      >
        <g className="lk-muscle-body">
          {silhouette.map((d, i) => (
            <path key={`body-${i}`} d={d} />
          ))}
        </g>

        <g className="lk-muscle-regions">
          {drawn.map((t) => {
            const style = ROLE_STYLE[t.role];
            return (
              <path
                key={`hl-${t.group}`}
                className={`lk-muscle-hl lk-muscle-hl--${t.role}`}
                d={viewRegions[t.group]}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={1}
              />
            );
          })}
        </g>
      </svg>

      {showLegend && rows.length > 0 && (
        <ul className="lk-muscle-list">
          {rows.map((t) => {
            const style = ROLE_STYLE[t.role];
            return (
              <li key={t.group} className="lk-muscle-row">
                <span
                  className="lk-muscle-dot"
                  style={{ background: style.stroke, color: style.stroke }}
                  aria-hidden="true"
                />
                <span className="lk-muscle-name">{MUSCLE_LABELS[t.group]}</span>
                <Chip tone={ROLE_CHIP_TONE[t.role]}>{t.role}</Chip>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
