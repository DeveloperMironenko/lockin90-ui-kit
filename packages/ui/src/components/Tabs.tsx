import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Tab labels, one button each. */
  tabs?: string[];
  /** Index of the active tab. */
  active?: number;
  /** Fires with the clicked tab index. */
  onChange?: (index: number) => void;
}

/** Underline tab bar — a horizontal row of text tabs along a 1px rail; the
 *  active one is brighter with a 2px accent underline sitting on the rail.
 *  Distinct from the pill-track SegmentedTabs. */
export function Tabs({
  tabs = ['Overview', 'Activity', 'Settings'],
  active = 0,
  onChange,
  className,
  ...rest
}: TabsProps) {
  return (
    <div className={cn('lk-tabs', className)} role="tablist" {...rest}>
      {tabs.map((label, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === active}
          className={cn('lk-tabs-tab', i === active && 'is-active')}
          onClick={() => onChange?.(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
