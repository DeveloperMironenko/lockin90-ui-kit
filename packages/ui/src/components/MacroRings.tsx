import { useId, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** One macro ring (protein / carbs / fats). */
export interface Macro {
  /** display label, e.g. "Protein" */
  label: string;
  /** grams consumed so far (center readout) */
  grams: number;
  /** daily target in grams */
  target: number;
  /** 0..100 fill percentage of the ring */
  pct: number;
  /** the two gradient stops [from, to] for the arc */
  gradient: [string, string];
}

export interface MacroRingsProps extends HTMLAttributes<HTMLDivElement> {
  /** card title above the rings */
  title?: string;
  /** the three macro rings, in order (protein, carbs, fats) */
  macros?: Macro[];
  /** total calories consumed today (header pill + footer value) */
  kcal?: number;
  /** daily calorie target (footer "/ target") */
  kcalTarget?: number;
}

/* ring geometry: 78×78 viewBox, stroke ring at r=33 */
const VB = 78;
const CX = 39;
const CY = 39;
const R = 33;
const CIRC = 2 * Math.PI * R; // 207.345

/** which slot (0,1,2) maps to which color class for the center grams + arc */
const SLOT = ['is-p', 'is-c', 'is-f'] as const;

/** Faithful reproduction of the design's "Today's macros" example. */
const DEFAULT_MACROS: Macro[] = [
  { label: 'Protein', grams: 142, target: 160, pct: 89, gradient: ['#34F5C5', '#A8FF35'] },
  { label: 'Carbs', grams: 186, target: 220, pct: 85, gradient: ['#22D3EE', '#34F5C5'] },
  { label: 'Fats', grams: 58, target: 70, pct: 83, gradient: ['#FFB020', '#FF4D6D'] },
];

const NF = new Intl.NumberFormat('en-US');

/** Macro rings — daily macros as three % progress rings (protein · carbs ·
 *  fats), each showing grams vs target with a % fill, a center grams readout
 *  and a label, over a glass card, with a calories-total footer. */
export function MacroRings({
  title = "Today's macros",
  macros = DEFAULT_MACROS,
  kcal = 1840,
  kcalTarget = 2420,
  className,
  ...rest
}: MacroRingsProps) {
  const uid = useId();
  const kcalFrac = kcalTarget > 0 ? Math.max(0, Math.min(1, kcal / kcalTarget)) : 0;

  return (
    <div className={cn('lk-macro', 'lk-card', className)} {...rest}>
      <div className="lk-macro-head">
        <span className="lk-macro-title">{title}</span>
        <span className="lk-macro-kcal lk-mono lk-tnum">
          <b>{NF.format(kcal)}</b> kcal
        </span>
      </div>

      <div className="lk-macro-trio">
        {macros.map((m, i) => {
          const slot = SLOT[i] ?? SLOT[SLOT.length - 1];
          const gradId = `lk-macro-grad-${uid}-${i}`;
          const frac = Math.max(0, Math.min(1, m.pct / 100));
          const dash = `${(CIRC * frac).toFixed(1)} ${(CIRC * (1 - frac)).toFixed(1)}`;
          return (
            <div className="lk-macro-cell" key={`${m.label}-${i}`}>
              <div
                className="lk-macro-ring"
                role="img"
                aria-label={`${m.label} ${m.grams} of ${m.target}g, ${m.pct}%`}
              >
                <svg viewBox={`0 0 ${VB} ${VB}`}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor={m.gradient[0]} />
                      <stop offset="1" stopColor={m.gradient[1]} />
                    </linearGradient>
                  </defs>
                  <circle className="lk-macro-track" cx={CX} cy={CY} r={R} />
                  <circle
                    className={cn('lk-macro-arc', slot)}
                    cx={CX}
                    cy={CY}
                    r={R}
                    stroke={`url(#${gradId})`}
                    strokeDasharray={dash}
                  />
                </svg>
                <div className="lk-macro-ctr">
                  <span className={cn('lk-macro-g', slot, 'lk-tnum')}>{m.grams}</span>
                  <span className="lk-macro-pct">{m.pct}%</span>
                </div>
              </div>
              <span className="lk-macro-lbl">{m.label}</span>
              <span className="lk-macro-tgt lk-mono">of {m.target}g</span>
            </div>
          );
        })}
      </div>

      <div className="lk-macro-foot">
        <span className="lk-macro-flbl">Calories</span>
        <span className="lk-macro-bar">
          <i style={{ width: `${(kcalFrac * 100).toFixed(1)}%` }} />
        </span>
        <span className="lk-macro-fval lk-tnum">
          {NF.format(kcal)}
          <span className="lk-macro-fu">/ {NF.format(kcalTarget)}</span>
        </span>
      </div>
    </div>
  );
}

export type { Macro as MacroRingsMacro };
