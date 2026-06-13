import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface OrDividerProps {
  /** Center label between the two rules. Defaults to `OR`. */
  label?: ReactNode;
  className?: string;
}

/** The "rule — OR — rule" separator used between auth methods. */
export default function OrDivider({ label = 'OR', className }: OrDividerProps) {
  return (
    <div className={cn('lk-or', className)} role="separator" aria-hidden="true">
      <span className="lk-or-line" />
      <span className="lk-or-label">{label}</span>
      <span className="lk-or-line" />
    </div>
  );
}
