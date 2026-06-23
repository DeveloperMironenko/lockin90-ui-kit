import { useId, type HTMLAttributes } from 'react';
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
  /** show the role legend + worked-group rows beside the figure (default true) */
  showLegend?: boolean;
  /** SVG height in px (default 220); width scales with the 110×220 viewBox */
  size?: number;
}

/* ----------------------------------------------------------------------------
 * Geometry. A stylized front/back body silhouette in a fixed 110×220 viewBox
 * (lifted from the LockIn90 design mockup, web/exercises.html "Muscles worked").
 * Region <path> strings are defined ONCE here and shared verbatim by the web and
 * native implementations so the figure is pixel-identical on both platforms.
 * ------------------------------------------------------------------------- */

/** SVG viewBox the figure is authored in (mockup units). */
export const MUSCLE_VB_W = 110;
export const MUSCLE_VB_H = 220;

/** Base body silhouette outline shapes (head + torso + arms + legs). */
export const SILHOUETTE_FRONT: string[] = [
  // head
  'M55 7 a13 13 0 1 0 0.01 0 Z',
  // torso (shoulders → waist)
  'M40 36 H70 L76 60 L70 100 H40 L34 60 Z',
  // left arm (viewer-left)
  'M30 42 L22 86 L28 90 L38 56 Z',
  // right arm (viewer-right)
  'M80 42 L88 86 L82 90 L72 56 Z',
  // left leg
  'M41 100 L40 160 L48 200 L54 200 L54 120 Z',
  // right leg
  'M69 100 L70 160 L62 200 L56 200 L56 120 Z',
];

/** Back view shares the same outline silhouette (mirror-symmetric figure). */
export const SILHOUETTE_BACK: string[] = SILHOUETTE_FRONT;

/** Highlight region paths for the FRONT view, per muscle group. */
const REGIONS_FRONT: Partial<Record<MuscleGroup, string>> = {
  traps: 'M44 37 L66 37 L62 45 L48 45 Z',
  shoulders: 'M40 38 L34 56 L40 54 L44 40 Z M70 38 L76 56 L70 54 L66 40 Z',
  chest: 'M44 47 L66 47 L65 62 L55 66 L45 62 Z',
  biceps: 'M30 50 L25 76 L31 78 L36 56 Z M80 50 L85 76 L79 78 L74 56 Z',
  forearms: 'M25 78 L21 90 L27 92 L31 80 Z M85 78 L89 90 L83 92 L79 80 Z',
  abs: 'M48 67 L62 67 L61 90 L49 90 Z',
  obliques: 'M43 64 L47 66 L47 92 L40 80 Z M67 64 L63 66 L63 92 L70 80 Z',
  quads: 'M41 108 L40 150 L48 154 L52 120 Z M69 108 L70 150 L62 154 L58 120 Z',
  calves: 'M42 160 L46 196 L52 196 L53 160 Z M68 160 L64 196 L58 196 L57 160 Z',
};

/** Highlight region paths for the BACK view, per muscle group. */
const REGIONS_BACK: Partial<Record<MuscleGroup, string>> = {
  traps: 'M44 37 L66 37 L62 52 L55 56 L48 52 Z',
  shoulders: 'M40 38 L34 56 L40 54 L44 40 Z M70 38 L76 56 L70 54 L66 40 Z',
  back: 'M46 38 L64 38 L62 60 L48 60 Z',
  lats: 'M44 56 L48 60 L46 88 L40 76 Z M66 56 L62 60 L64 88 L70 76 Z',
  triceps: 'M30 50 L25 76 L31 78 L36 56 Z M80 50 L85 76 L79 78 L74 56 Z',
  biceps: 'M33 52 L28 74 L33 76 L37 56 Z M77 52 L82 74 L77 76 L73 56 Z',
  forearms: 'M25 78 L21 90 L27 92 L31 80 Z M85 78 L89 90 L83 92 L79 80 Z',
  glutes: 'M42 100 L54 100 L54 118 L44 116 Z M68 100 L56 100 L56 118 L66 116 Z',
  hamstrings: 'M41 120 L40 152 L48 156 L52 122 Z M69 120 L70 152 L62 156 L58 122 Z',
  calves: 'M42 160 L46 196 L52 196 L53 160 Z M68 160 L64 196 L58 196 L57 160 Z',
};

/** Region map by view — shared verbatim with the native implementation. */
export const MUSCLE_REGIONS: Record<'front' | 'back', Partial<Record<MuscleGroup, string>>> = {
  front: REGIONS_FRONT,
  back: REGIONS_BACK,
};

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

/** Chip tone used for each role's legend pill. */
const ROLE_CHIP_TONE: Record<MuscleRole, ChipTone> = {
  primary: 'high',
  secondary: 'accent',
  stabilizer: 'neutral',
};

/** Sort order so legend rows read primary → secondary → stabilizer. */
const ROLE_ORDER: Record<MuscleRole, number> = { primary: 0, secondary: 1, stabilizer: 2 };

const DEFAULT_TARGETS: MuscleTarget[] = [
  { group: 'chest', role: 'primary' },
  { group: 'triceps', role: 'secondary' },
  { group: 'shoulders', role: 'secondary' },
];

/**
 * MuscleDiagram — an anatomical body map. Draws a stylized front/back silhouette
 * (head + torso + arms + legs) in a fixed 110×220 viewBox, then tints the
 * targeted muscle groups by role: primary = mint (strongest), secondary = cyan
 * (medium), stabilizer = faint gray (subtle). Untargeted regions stay faint
 * `bg2`. A legend beside the figure lists each worked group + a role Chip.
 * Tokens-driven, no Tailwind. The SVG path data is identical to the native twin.
 */
export function MuscleDiagram({
  targets = DEFAULT_TARGETS,
  view = 'front',
  showLegend = true,
  size = 220,
  className,
  ...rest
}: MuscleDiagramProps) {
  const uid = useId();
  void uid; // reserved for future gradient ids; keeps parity with sibling primitives

  const silhouette = view === 'front' ? SILHOUETTE_FRONT : SILHOUETTE_BACK;
  const regions = MUSCLE_REGIONS[view];

  // de-dup by group (first wins), keep only groups the current view can draw
  const seen = new Set<MuscleGroup>();
  const drawn = targets.filter((t) => {
    if (seen.has(t.group) || !regions[t.group]) return false;
    seen.add(t.group);
    return true;
  });

  // legend rows sorted by role strength
  const rows = [...drawn].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);

  const width = (MUSCLE_VB_W / MUSCLE_VB_H) * size;
  const ariaLabel = `Body map (${view} view)${
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
        {/* base silhouette */}
        <g className="lk-muscle-body">
          {silhouette.map((d, i) => (
            <path key={`body-${i}`} d={d} />
          ))}
        </g>

        {/* highlighted regions, colored by role */}
        <g className="lk-muscle-regions">
          {drawn.map((t) => {
            const style = ROLE_STYLE[t.role];
            return (
              <path
                key={`hl-${t.group}`}
                className={`lk-muscle-hl lk-muscle-hl--${t.role}`}
                d={regions[t.group]}
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
