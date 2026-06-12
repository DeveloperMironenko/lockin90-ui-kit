import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface SectionLabelProps {
  /** The eyebrow text. */
  children: ReactNode;
  /** Optional trailing action (button/link) after the fading line. */
  action?: ReactNode;
  className?: string;
}

/** An eyebrow label followed by a fading gradient line, with an optional trailing action. */
export default function SectionLabel({ children, action, className }: SectionLabelProps) {
  return (
    <div className={cn('lk-section-label', className)}>
      <span className="lk-eyebrow">{children}</span>
      <span className="lk-ln" />
      {action}
    </div>
  );
}
