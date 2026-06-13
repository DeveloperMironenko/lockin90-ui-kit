import type { ReactNode } from 'react';
import { cn } from '../../cn';

export type SectionCardPadding = 'tight' | 'normal' | 'loose' | 'none';

export interface SectionCardProps {
  /** Small mono/uppercase label above the title. */
  eyebrow?: ReactNode;
  /** Card heading — rendered in the display face. */
  title?: ReactNode;
  /** Muted line under the title. */
  subtitle?: ReactNode;
  /** Right-aligned action node(s) shown next to the title. `right` is an alias. */
  action?: ReactNode;
  /** Alias for `action` (kept so existing call sites using `right` keep working). */
  right?: ReactNode;
  children: ReactNode;
  /** Optional pinned footer row. */
  footer?: ReactNode;
  /** Body padding scale. Default 'normal'. */
  padding?: SectionCardPadding;
  /** Extra classes on the outer card. */
  className?: string;
  /** Extra classes on the body region. */
  bodyClassName?: string;
}

/**
 * A titled glass panel: an optional eyebrow + title + subtitle header (with an
 * optional right-aligned action) and a padded body, plus an optional pinned
 * footer. The web twin of the native `@lockin90/ui-native` `SectionCard`.
 */
export default function SectionCard({
  eyebrow,
  title,
  subtitle,
  action,
  right,
  children,
  footer,
  padding = 'normal',
  className,
  bodyClassName,
}: SectionCardProps) {
  const rightSlot = action ?? right;
  const hasHeader = !!(eyebrow || title || subtitle || rightSlot);
  return (
    <section className={cn('lk-section-card', className)}>
      {hasHeader && (
        <div className="lk-section-card-head">
          <div className="lk-section-card-headtext">
            {eyebrow && <div className="lk-eyebrow lk-section-card-eyebrow">{eyebrow}</div>}
            {title && <h2 className="lk-section-card-title">{title}</h2>}
            {subtitle && <p className="lk-section-card-subtitle">{subtitle}</p>}
          </div>
          {rightSlot && <div className="lk-section-card-right">{rightSlot}</div>}
        </div>
      )}
      <div className={cn('lk-section-card-body', `lk-section-card-pad-${padding}`, bodyClassName)}>
        {children}
      </div>
      {footer && <div className="lk-section-card-footer">{footer}</div>}
    </section>
  );
}
