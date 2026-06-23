import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

/** Semantic tone for a segment's active state + leading dot. `canary` paints
 *  amber (`--warn`) for staged/partial rollouts (e.g. the pipeline
 *  Off/Canary/On flag); `ok` is mint (`--ok`), `danger` is red (`--bad`). */
export type SegmentedTone = 'ok' | 'canary' | 'danger';

/** A rich segment: a `label` plus an optional trailing `count` badge and a
 *  semantic `tone`. Plain strings are still accepted and render identically. */
export interface SegmentedTab {
  /** Segment label text. */
  label: string;
  /** Small trailing count badge inside the segment (e.g. catalog item counts). */
  count?: number;
  /** Tones the segment's active pill + a leading dot. */
  tone?: SegmentedTone;
}

/** Accepts the legacy plain-string form or the rich object form, mixed freely. */
export type SegmentedTabItem = string | SegmentedTab;

const toTab = (t: SegmentedTabItem): SegmentedTab => (typeof t === 'string' ? { label: t } : t);

export interface SegmentedTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Segments, one button each. Each may be a plain label string (legacy) or a
   * `{ label, count?, tone? }` object — the two forms can be mixed.
   */
  tabs?: SegmentedTabItem[];
  /** Index of the active segment. */
  active?: number;
  /** Fires with the clicked segment index. */
  onChange?: (index: number) => void;
  /**
   * Indices of segments that are locked — dimmed, non-interactive (never fire
   * `onChange`), and rendered with a small lock glyph (e.g. the `1Y🔒 / All🔒`
   * upsell pattern on a time-range control).
   */
  locked?: number[];
}

/** iOS-style segmented control — a pill track of equal-width segments; the
 *  active one is a raised lighter pill. Locked segments are dimmed,
 *  non-interactive, and show a lock glyph. */
export function SegmentedTabs({
  tabs = ['Stats', 'History', 'Guide', 'Ranks'],
  active = 0,
  onChange,
  locked,
  className,
  ...rest
}: SegmentedTabsProps) {
  return (
    <div className={cn('lk-seg', className)} role="tablist" {...rest}>
      {tabs.map((item, i) => {
        const { label, count, tone } = toTab(item);
        const isLocked = locked?.includes(i) ?? false;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-disabled={isLocked || undefined}
            disabled={isLocked}
            className={cn(
              'lk-seg-tab',
              i === active && 'is-active',
              isLocked && 'lk-seg-locked',
              tone && `lk-seg-${tone}`,
            )}
            onClick={isLocked ? undefined : () => onChange?.(i)}
          >
            {tone && <span className="lk-seg-dot" aria-hidden="true" />}
            {label}
            {count != null && <span className="lk-seg-count">{count}</span>}
            {isLocked && <Icon name="lock" size={12} />}
          </button>
        );
      })}
    </div>
  );
}
