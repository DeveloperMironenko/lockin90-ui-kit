import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';

export interface NotificationRowProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'> {
  /** Primary line — the notification headline. */
  title: string;
  /** Right-aligned relative timestamp, e.g. "2h", "Yesterday". Pre-formatted. */
  time: string;
  /** Optional dimmer snippet under the title. */
  body?: string;
  /** Shows the unread accent dot + tints the row. */
  unread?: boolean;
  /** Optional typed leading icon from the shared set. */
  icon?: IconName;
  /** Tap handler — renders the row as an interactive `<button>` when set. */
  onClick?: () => void;
}

/**
 * A single notification list item: an unread dot + optional leading icon +
 * title with a right-aligned relative `time`, plus an optional `body` snippet
 * below. With `onClick` it renders an interactive `<button>` (hover bg),
 * otherwise a static `<div>`. Adjacent rows draw a hairline between them.
 *
 * Cross-platform primitive: the native twin (`@lockin90/ui-native`) mirrors this
 * contract with `onPress` in place of `onClick`.
 */
export function NotificationRow({
  title,
  time,
  body,
  unread,
  icon,
  onClick,
  className,
  ...rest
}: NotificationRowProps) {
  const classes = cn(
    'lk-notif',
    unread && 'lk-notif-unread',
    onClick && 'lk-notif-tappable',
    className,
  );

  const body_ = (
    <>
      <span className={cn('lk-notif-dot', !unread && 'lk-notif-dot-off')} aria-hidden="true" />
      {icon != null && (
        <span className="lk-notif-icon">
          <Icon name={icon} size={16} />
        </span>
      )}
      <span className="lk-notif-main">
        <span className="lk-notif-head">
          <span className="lk-notif-title">{title}</span>
          <span className="lk-notif-time">{time}</span>
        </span>
        {body != null && <span className="lk-notif-body">{body}</span>}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {body_}
      </button>
    );
  }

  return (
    <div className={classes} {...rest}>
      {body_}
    </div>
  );
}
