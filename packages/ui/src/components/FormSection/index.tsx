import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface FormSectionProps {
  /** Eyebrow-style section title rendered above the group. */
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Groups `FormRow`s under an eyebrow title with a top border — the titled
 * section wrapper used in settings-style forms.
 */
export default function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <div className={cn('lk-form-section', className)}>
      {title && <div className="lk-form-section-title">{title}</div>}
      <div className="lk-form-section-body">{children}</div>
    </div>
  );
}
