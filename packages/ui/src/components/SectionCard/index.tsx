import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface SectionCardProps {
  /** Card heading — rendered in the display face. */
  title?: ReactNode;
  /** Muted line under the title. */
  subtitle?: ReactNode;
  /** Right-aligned action node(s) shown next to the title. */
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * A titled glass panel: an optional title + subtitle header (with an optional
 * right-aligned action), then a vertically-stacked body. The web twin of the
 * native `@lockin90/ui-native` `SectionCard` — same title/subtitle treatment so
 * web and mobile titled cards read identically.
 */
export default function SectionCard({ title, subtitle, right, children, className }: SectionCardProps) {
  const hasHeader = title || subtitle || right;
  return (
    <section className={cn('lk-section-card', className)}>
      {hasHeader && (
        <div className="lk-section-card-head">
          <div className="lk-section-card-headtext">
            {title && <h2 className="lk-section-card-title">{title}</h2>}
            {subtitle && <p className="lk-section-card-subtitle">{subtitle}</p>}
          </div>
          {right && <div className="lk-section-card-right">{right}</div>}
        </div>
      )}
      <div className="lk-section-card-body">{children}</div>
    </section>
  );
}
