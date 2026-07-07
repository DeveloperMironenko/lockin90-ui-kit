import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Eyebrow } from './Eyebrow';

export interface SectionDividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Section label (rendered as a mono, uppercase eyebrow) before the rule. */
  label: ReactNode;
}

/**
 * SectionDivider — an eyebrow label followed by a hairline that fades to the
 * right, for separating page sections (e.g. "EXPLAINABILITY ————————"). Mirrors
 * the design's `.section-label` (eyebrow + fading `.ln`).
 */
export function SectionDivider({ label, className, ...rest }: SectionDividerProps) {
  return (
    <div className={cn('lk-section-divider', className)} {...rest}>
      <Eyebrow className="lk-section-divider-label">{label}</Eyebrow>
      <span className="lk-section-divider-line" aria-hidden="true" />
    </div>
  );
}
