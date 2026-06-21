import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** Volume status of a muscle group this week. */
export type MuscleTone = 'opt' | 'high' | 'low';

export interface MuscleGroup {
  /** group name, e.g. "Chest" */
  name: string;
  /** weekly working-set count */
  sets: number;
  /** volume status — drives the bar fill, status chip and leading dot */
  tone: MuscleTone;
  /** bar fill fraction (0..1) */
  fill: number;
  /** leading dot / accent color (hex or css color); defaults from the tone */
  dot?: string;
}

export interface MuscleMapProps extends HTMLAttributes<HTMLDivElement> {
  /** muscle groups, in display order */
  groups?: MuscleGroup[];
  /** caption side label, e.g. "front" */
  side?: string;
  /** caption period label, e.g. "this week" */
  period?: string;
}

/** tone → status chip tone + label */
const STATUS: Record<MuscleTone, { chip: ChipTone; label: string }> = {
  opt: { chip: 'high', label: 'optimal' },
  high: { chip: 'mid', label: 'high' },
  low: { chip: 'low', label: 'low' },
};

/** tone → default leading-dot color */
const DOT: Record<MuscleTone, string> = {
  opt: 'var(--zone-high)',
  high: 'var(--zone-mid)',
  low: 'rgba(255,255,255,.28)',
};

/** Faithful reproduction of the design's front-body example. */
const DEFAULT_GROUPS: MuscleGroup[] = [
  { name: 'Chest', sets: 14, tone: 'opt', fill: 0.7, dot: 'var(--zone-high)' },
  { name: 'Shoulders', sets: 11, tone: 'opt', fill: 0.55, dot: 'var(--accent-2)' },
  { name: 'Back', sets: 8, tone: 'low', fill: 0.4, dot: 'rgba(255,255,255,.28)' },
  { name: 'Quads', sets: 16, tone: 'high', fill: 0.92, dot: 'var(--zone-mid)' },
  { name: 'Arms', sets: 6, tone: 'low', fill: 0.3, dot: 'rgba(255,255,255,.28)' },
];

/** Muscle activation map — a front-body silhouette tinted by weekly training
 *  volume beside per-group weekly-sets bars and status chips. */
export function MuscleMap({
  groups = DEFAULT_GROUPS,
  side = 'front',
  period = 'this week',
  className,
  ...rest
}: MuscleMapProps) {
  return (
    <div className={cn('lk-musc', 'lk-card', className)} {...rest}>
      <div className="lk-musc-fig">
        <svg
          className="lk-musc-svg"
          viewBox="0 0 110 220"
          role="img"
          aria-label="Front body: chest and shoulders optimal, quads over-volume"
        >
          {/* untinted body outline */}
          <g className="lk-musc-base">
            <circle cx="55" cy="20" r="13" />
            <path d="M40 36 H70 L76 60 L70 100 H40 L34 60 Z" />
            <path d="M30 42 L22 86 L28 90 L38 56 Z" />
            <path d="M80 42 L88 86 L82 90 L72 56 Z" />
            <path d="M41 100 L40 160 L48 200 L54 200 L54 120 Z" />
            <path d="M69 100 L70 160 L62 200 L56 200 L56 120 Z" />
          </g>
          {/* volume-tinted regions */}
          <path className="lk-musc-reg lk-opt2" d="M38 42 L31 50 L36 60 L44 50 Z" />
          <path className="lk-musc-reg lk-opt2" d="M72 42 L79 50 L74 60 L66 50 Z" />
          <path className="lk-musc-reg lk-opt" d="M42 44 L54 44 L54 64 L44 62 Z" />
          <path className="lk-musc-reg lk-opt" d="M56 44 L68 44 L66 62 L56 64 Z" />
          <path className="lk-musc-reg lk-faint" d="M47 68 L63 68 L62 94 L48 94 Z" />
          <path className="lk-musc-reg lk-high" d="M41 112 L40 152 L48 156 L52 124 Z" />
          <path className="lk-musc-reg lk-high" d="M69 112 L70 152 L62 156 L58 124 Z" />
        </svg>
        <span className="lk-musc-cap">
          <b>{side}</b> · {period}
        </span>
      </div>

      <div className="lk-musc-list">
        {groups.map((g) => {
          const status = STATUS[g.tone];
          return (
            <div className="lk-musc-row" key={g.name}>
              <span className="lk-musc-name">
                <span className="lk-musc-dot" style={{ background: g.dot ?? DOT[g.tone], color: g.dot ?? DOT[g.tone] }} />
                {g.name}
              </span>
              <span className="lk-musc-bar">
                <span className={cn('lk-barfill', 'is-visible', g.tone)} style={{ ['--v']: g.fill } as CSSProperties}>
                  <i />
                </span>
                <span className="lk-musc-sets lk-tnum">
                  {g.sets}
                  <small> sets</small>
                </span>
              </span>
              <span className="lk-musc-status">
                <Chip tone={status.chip} dot>
                  {status.label}
                </Chip>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
