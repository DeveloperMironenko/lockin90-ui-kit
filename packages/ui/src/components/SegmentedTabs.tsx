import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface SegmentedTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Segment labels, one button each. */
  tabs?: string[];
  /** Index of the active segment. */
  active?: number;
  /** Fires with the clicked segment index. */
  onChange?: (index: number) => void;
}

/** iOS-style segmented control — a pill track of equal-width segments; the
 *  active one is a raised lighter pill. */
export function SegmentedTabs({
  tabs = ['Stats', 'History', 'Guide', 'Ranks'],
  active = 0,
  onChange,
  className,
  ...rest
}: SegmentedTabsProps) {
  return (
    <div className={cn('lk-seg', className)} role="tablist" {...rest}>
      {tabs.map((label, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === active}
          className={cn('lk-seg-tab', i === active && 'is-active')}
          onClick={() => onChange?.(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
