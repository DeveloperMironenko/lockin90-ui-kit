import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** the bubble text/content shown on hover/focus */
  content?: ReactNode;
  /** which side the bubble sits on relative to the trigger */
  placement?: TooltipPlacement;
  /** the trigger; if omitted a small "?" badge is rendered instead */
  children?: ReactNode;
}

/** CSS-driven hover/focus tooltip — wraps a trigger, shows a glassy bubble. */
export function Tooltip({
  content = 'Tooltip',
  placement = 'top',
  children,
  className,
  ...rest
}: TooltipProps) {
  const trigger = children ?? (
    <span className="lk-tip-badge" aria-hidden="true">
      ?
    </span>
  );

  return (
    <span className={cn('lk-tip', className)} tabIndex={children ? undefined : 0} {...rest}>
      {trigger}
      <span className={cn('lk-tip-bubble', `lk-tip-${placement}`)} role="tooltip">
        {content}
      </span>
    </span>
  );
}
