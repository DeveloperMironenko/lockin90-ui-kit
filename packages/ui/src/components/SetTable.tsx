import { type HTMLAttributes, type MouseEvent } from 'react';
import { cn } from '../cn';
import { PrBadge } from './PrBadge';

/** Set kind — drives the SET-column label + color. */
export type SetType = 'warmup' | 'working' | 'drop' | 'failure';

/** Reference-column tint: mint for coach targets, violet accent for AI. */
export type SetReferenceTone = 'coach' | 'ai' | 'none';

export interface WorkoutSet {
  id: string;
  setType: SetType;
  /** SET-column label override. Default: `W` warmup · working sets numbered `1,2,…` · `D` drop · `F` failure. */
  label?: string;
  weight?: number;
  reps?: number;
  unit?: 'kg' | 'lb';
  /** Reference readout (e.g. the coach/AI recommendation `80×5`). */
  reference?: string;
  /** Reference tint — `coach` mint · `ai` violet accent · `none` faint (default). */
  referenceTone?: SetReferenceTone;
  done?: boolean;
  /** Personal record — stamps a red `PR` badge next to the value once `done`. */
  isPr?: boolean;
  /** The set being performed now — subtle cyan row tint. */
  isCurrent?: boolean;
}

export type SetTableColumn = 'set' | 'value' | 'reference' | 'check';

const ALL_COLUMNS: SetTableColumn[] = ['set', 'value', 'reference', 'check'];

export interface SetTableProps extends HTMLAttributes<HTMLDivElement> {
  /** The sets, in order. */
  sets: WorkoutSet[];
  /** Columns to render, in this order (default all 4). */
  columns?: SetTableColumn[];
  /** Values are tappable (tap → `onSetPress`); they stay plain text — only
   *  the CURRENT set's value gets the cyan-accented box ("you are here"). */
  editable?: boolean;
  /** Row tapped (open the set editor). */
  onSetPress?: (id: string) => void;
  /** Done-check toggled. */
  onTogglePress?: (id: string) => void;
  /** When given, renders the trailing `+ Add set` row. */
  onAddSet?: () => void;
  /** Add-row label (default `'Add set'`). */
  addLabel?: string;
  /** Reference column header (default `'Coach rec'`). */
  referenceHeader?: string;
}

/** Default SET-column labels: warmup `W`, drop `D`, failure `F`, working sets numbered `1,2,…`. */
export function setLabels(sets: readonly Pick<WorkoutSet, 'setType' | 'label'>[]): string[] {
  let n = 0;
  return sets.map((s) => {
    if (s.setType === 'working') n += 1;
    if (s.label != null) return s.label;
    return s.setType === 'warmup' ? 'W' : s.setType === 'drop' ? 'D' : s.setType === 'failure' ? 'F' : String(n);
  });
}

const TYPE_CLASS: Record<SetType, string> = {
  warmup: 'lk-settable-warmup',
  working: 'lk-settable-working',
  drop: 'lk-settable-drop',
  failure: 'lk-settable-failure',
};

const REF_CLASS: Record<SetReferenceTone, string> = {
  coach: 'lk-settable-ref-coach',
  ai: 'lk-settable-ref-ai',
  none: '',
};

/** `80×5`, with an em dash for a missing half. */
function formatValue(s: WorkoutSet): string {
  const w = s.weight != null ? String(s.weight) : '—';
  const r = s.reps != null ? String(s.reps) : '—';
  return `${w}×${r}`;
}

/** Value-column header from the sets' unit (`KG × REPS` / `LB × REPS`). */
function valueHeader(sets: readonly WorkoutSet[]): string {
  const unit = sets.find((s) => s.unit)?.unit;
  return unit ? `${unit.toUpperCase()} × REPS` : 'WEIGHT × REPS';
}

/**
 * SetTable — the per-set workout table, the training design's core primitive.
 * One row per set: SET label (`W`/`1`/`2`/`D`/`F`, colored by set type —
 * warmup amber, working cyan, drop violet, failure magenta), the centered
 * mono `weight×reps` value, a right-aligned mono reference (coach = mint,
 * AI = violet accent), and the done check (filled mint once done). The
 * current set gets a subtle cyan row tint, done rows a subtle mint tint, and
 * a PR'd done set a red `PrBadge` floated right of the value (absolutely
 * positioned — the centered number never shifts). With `onAddSet` a trailing
 * `+ Add set` row appears (cyan uppercase mono).
 */
export function SetTable({
  sets,
  columns = ALL_COLUMNS,
  editable = false,
  onSetPress,
  onTogglePress,
  onAddSet,
  addLabel = 'Add set',
  referenceHeader = 'Coach rec',
  className,
  ...rest
}: SetTableProps) {
  const has = (c: SetTableColumn) => columns.includes(c);
  const labels = setLabels(sets);
  const colCount = columns.length;

  const headers: Record<SetTableColumn, string> = {
    set: 'Set',
    value: valueHeader(sets),
    reference: referenceHeader,
    check: '',
  };

  return (
    <div className={cn('lk-settable', className)} {...rest}>
      <table className="lk-settable-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} className={`lk-settable-h-${c}`} scope="col">
                {headers[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sets.map((s, i) => {
            const rowPress = onSetPress ? () => onSetPress(s.id) : undefined;
            return (
              <tr
                key={s.id}
                className={cn(
                  'lk-settable-row',
                  s.isCurrent && 'lk-settable-current',
                  s.done && 'lk-settable-done',
                  rowPress && 'lk-settable-tappable',
                )}
                onClick={rowPress}
              >
                {has('set') && <td className={cn('lk-settable-set', TYPE_CLASS[s.setType])}>{labels[i]}</td>}
                {has('value') && (
                  <td className="lk-settable-val">
                    {/* three glance-distinct states: pending = plain mono text,
                        current = the ONE cyan-boxed emphasized value, done =
                        dimmed plain text on the mint row wash. The value +
                        its PR badge share a content-hugging inline-flex group
                        so the badge sits directly beside the number instead
                        of pinning to the cell's own right edge. */}
                    <span className="lk-settable-valgroup">
                      <span
                        className={cn(
                          'lk-settable-valtext',
                          editable && s.isCurrent && 'lk-settable-valbox',
                        )}
                      >
                        {formatValue(s)}
                      </span>
                      {s.isPr && s.done ? <PrBadge size="sm" className="lk-settable-pr" /> : null}
                    </span>
                  </td>
                )}
                {has('reference') && (
                  <td className={cn('lk-settable-ref', REF_CLASS[s.referenceTone ?? 'none'])}>
                    {s.reference ?? '—'}
                  </td>
                )}
                {has('check') && (
                  <td className="lk-settable-checkcell">
                    <button
                      type="button"
                      className="lk-settable-check"
                      aria-pressed={!!s.done}
                      aria-label={`Set ${labels[i]} done`}
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        onTogglePress?.(s.id);
                      }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
          {onAddSet ? (
            <tr className="lk-settable-addrow">
              <td colSpan={colCount}>
                <button type="button" className="lk-settable-add" onClick={onAddSet}>
                  + {addLabel}
                </button>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
