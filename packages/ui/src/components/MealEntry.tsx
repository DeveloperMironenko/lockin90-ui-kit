import { type CSSProperties, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

export interface MealMacros {
  /** protein, grams */
  protein: number;
  /** carbohydrate, grams */
  carbs: number;
  /** fat, grams */
  fat: number;
}

export interface MealEntryProps {
  /** meal name, e.g. "Greek yogurt + berries" */
  name?: string;
  /** logged time, e.g. "8:30am" */
  time?: string;
  /** energy, kcal */
  kcal?: number;
  /** P / C / F in grams */
  macros?: MealMacros;
  /** optional one-line ingredient list under the title */
  foods?: string;
  /** glycemic chip tone (signal color): high = stable/good, mid = moderate, low = spiky */
  glycemicTone?: ChipTone;
  /** glycemic chip label, e.g. "GL 8 · low GI" */
  glycemicLabel?: string;
  /** optional secondary chip, e.g. "stable glucose" */
  note?: string;
  /** custom leading icon (defaults to a meal/cutlery glyph) */
  icon?: ReactNode;
  /** when false, bars start empty so they can animate in via reveal */
  visible?: boolean;
  className?: string;
}

/** Reference per-macro ceilings used to size the mini-bars from raw grams.
 *  Tuned so the design's example (22/24/6 g) renders ≈ .72 / .40 / .18. */
const MACRO_MAX = { protein: 30, carbs: 60, fat: 35 } as const;

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" style={{ stroke: 'var(--lime)' }}>
    <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3-2 5h-4c0-2-2-3-2-5a4 4 0 0 1 4-4zM9 16h6M9 19h6" />
  </svg>
);

function frac(grams: number, max: number): number {
  return Math.max(0, Math.min(1, grams / max));
}

interface MacroBarProps {
  letter: string;
  grams: number;
  max: number;
  kind: 'p' | 'c' | 'f';
  visible: boolean;
}

function MacroBar({ letter, grams, max, kind, visible }: MacroBarProps) {
  return (
    <div className="lk-meal-mm">
      <div className="lk-meal-mm-top">
        <span>{letter}</span>
        <span className="lk-tnum">{grams}g</span>
      </div>
      <div
        className={cn('lk-meal-bar', `lk-${kind}`, visible && 'is-visible')}
        style={{ ['--v']: frac(grams, max) } as CSSProperties}
      >
        <i />
      </div>
    </div>
  );
}

/** Food-log meal row — icon, name/time/kcal, P/C/F mini-macro bars and glycemic chips. */
export function MealEntry({
  name = 'Greek yogurt + berries',
  time = '8:30am',
  kcal = 220,
  macros = { protein: 22, carbs: 24, fat: 6 },
  foods = 'Greek yogurt · blueberries · honey · pumpkin seeds',
  glycemicTone = 'high',
  glycemicLabel = 'GL 8 · low GI',
  note = 'stable glucose',
  icon,
  visible = true,
  className,
}: MealEntryProps) {
  return (
    <div className={cn('lk-meal-entry', className)}>
      <div className="lk-meal-ico">{icon ?? DEFAULT_ICON}</div>
      <div className="lk-meal-body">
        <div className="lk-meal-row1">
          <span className="lk-meal-title">{name}</span>
          <span className="lk-meal-time lk-mono">{time}</span>
          <span className="lk-meal-kcal lk-mono lk-tnum">{kcal} kcal</span>
        </div>
        {foods ? <div className="lk-meal-foods">{foods}</div> : null}
        <div className="lk-meal-macros">
          <MacroBar letter="P" grams={macros.protein} max={MACRO_MAX.protein} kind="p" visible={visible} />
          <MacroBar letter="C" grams={macros.carbs} max={MACRO_MAX.carbs} kind="c" visible={visible} />
          <MacroBar letter="F" grams={macros.fat} max={MACRO_MAX.fat} kind="f" visible={visible} />
        </div>
        <div className="lk-meal-chips">
          {glycemicLabel ? (
            <Chip tone={glycemicTone} dot>
              {glycemicLabel}
            </Chip>
          ) : null}
          {note ? <Chip>{note}</Chip> : null}
        </div>
      </div>
    </div>
  );
}
