import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';

/** Tint of the leading icon tile — the design's `.n-ico.t-*` category tones. */
export type NotificationTone =
  | 'insight'
  | 'coach'
  | 'achieve'
  | 'announce'
  | 'sync'
  | 'billing';

export interface NotificationRowProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'> {
  /** Primary line — the notification headline. */
  title: string;
  /** Right-aligned relative timestamp, e.g. "2h", "Yesterday". Pre-formatted. */
  time: string;
  /** Optional dimmer snippet under the title. */
  /** Accepts a node so hosts can render rich text (links/bold). */
  body?: string | ReactNode;
  /** Shows the unread cyan dot, tints the card and draws the gradient
   *  left-edge bar (design `.notif.unread`). Read rows dim to 66%. */
  unread?: boolean;
  /** Typed glyph shown inside the 34px tinted tile. */
  icon?: IconName;
  /** Tile tint per notification category (design `.n-ico.t-*`). @default 'announce' */
  tone?: NotificationTone;
  /** Tap handler — renders the row as an interactive `<button>` when set. */
  onClick?: () => void;
}

/**
 * NotificationRow — one inbox card (design extras.html `.card.notif`): a 34px
 * tinted icon tile, headline + right-aligned mono time (unread rows lead with
 * a glowing cyan dot), and an optional snippet below. Unread cards tint
 * violet and draw a 3px gradient bar down the left edge; read cards dim to
 * 66%. With `onClick` it renders an interactive `<button>` (hover lift),
 * otherwise a static `<div>`.
 *
 * Cross-platform primitive: the native twin (`@lockin90/ui-native`) mirrors
 * this contract with `onPress` in place of `onClick`.
 */
export function NotificationRow({
  title,
  time,
  body,
  unread,
  icon,
  tone = 'announce',
  onClick,
  className,
  ...rest
}: NotificationRowProps) {
  const classes = cn(
    'lk-notif',
    unread ? 'lk-notif-unread' : 'lk-notif-read',
    onClick && 'lk-notif-tappable',
    className,
  );

  const body_ = (
    <>
      {icon != null && (
        <span className={cn('lk-notif-tile', `lk-notif-t-${tone}`)}>
          <Icon name={icon} size={17} />
        </span>
      )}
      <span className="lk-notif-main">
        <span className="lk-notif-head">
          {unread && <span className="lk-notif-dot" aria-hidden="true" />}
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
