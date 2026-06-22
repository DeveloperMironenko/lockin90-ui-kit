import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

export interface SegmentedTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Segment labels, one button each. */
  tabs?: string[];
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
      {tabs.map((label, i) => {
        const isLocked = locked?.includes(i) ?? false;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-disabled={isLocked || undefined}
            disabled={isLocked}
            className={cn('lk-seg-tab', i === active && 'is-active', isLocked && 'lk-seg-locked')}
            onClick={isLocked ? undefined : () => onChange?.(i)}
          >
            {label}
            {isLocked && <Icon name="lock" size={12} />}
          </button>
        );
      })}
    </div>
  );
}
