'use client';

import { type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';
import { Menu, type MenuItemData } from './Menu';

export type SplitButtonVariant = 'primary' | 'default';

export interface SplitButtonProps {
  /** Primary action label (the wide left segment). */
  label: string;
  /** Fired when the primary segment is clicked. */
  onClick?: () => void;
  /** Secondary actions shown in the chevron dropdown. */
  items: MenuItemData[];
  /** `primary` = energy-gradient CTA (default); `default` = neutral glass. */
  variant?: SplitButtonVariant;
  /** Optional leading glyph on the primary segment. */
  icon?: ReactNode;
  /** Extra classes on the joined group. */
  className?: string;
}

/** A primary action joined to a chevron toggle that opens a {@link Menu} of
 *  secondary actions (e.g. "Create page ▾" → New page / Duplicate / Import).
 *  The two segments share one rounded group with a hairline divider between;
 *  the chevron reuses {@link Menu} for the dropdown panel + outside-close. */
export function SplitButton({
  label,
  onClick,
  items,
  variant = 'primary',
  icon,
  className,
}: SplitButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <div className={cn('lk-split', isPrimary ? 'lk-split-primary' : 'lk-split-default', className)}>
      <button type="button" className="lk-split-main" onClick={onClick}>
        {icon != null && <span className="lk-split-icon">{icon}</span>}
        <span className="lk-split-label">{label}</span>
      </button>
      <Menu
        className="lk-split-menu"
        align="right"
        items={items}
        trigger={<span className="lk-split-chev"><Icon name="chevron" size={13} /></span>}
      />
    </div>
  );
}
