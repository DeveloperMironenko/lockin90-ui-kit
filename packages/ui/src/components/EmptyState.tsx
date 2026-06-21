import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Illustration shown in the circular glass tile. Defaults to a faint star. */
  icon?: ReactNode;
  /** Headline. */
  title?: string;
  /** Supporting sentence. */
  description?: ReactNode;
  /** Call-to-action, typically a <Button>. */
  action?: ReactNode;
  /** Smaller, tighter variant for in-card placeholders. */
  compact?: boolean;
}

/** Centered zero-state: glass icon tile + headline + body + action. */
export function EmptyState({
  icon = <Icon name="star" size={30} />,
  title = 'Nothing here yet',
  description = 'Once you start logging, this is where it shows up.',
  action,
  compact,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div className={cn('lk-empty', compact && 'lk-empty-compact', className)} {...rest}>
      <span className="lk-empty-tile" aria-hidden="true">
        {icon}
      </span>
      {title != null && <div className="lk-empty-title">{title}</div>}
      {description != null && <p className="lk-empty-desc">{description}</p>}
      {action != null && <div className="lk-empty-action">{action}</div>}
    </div>
  );
}
