import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type MessageBubbleVariant = 'incoming' | 'outgoing';
export type MessageBubbleStatus = 'sent' | 'delivered' | 'read';

export interface MessageBubbleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `incoming` = glass, left-aligned; `outgoing` = accent, right-aligned. */
  variant: MessageBubbleVariant;
  /** Message body — text or wrapped nodes. */
  children: ReactNode;
  /** Small line under the bubble, e.g. "Sofia · 8:02am". */
  meta?: string;
  /** Outgoing only — tiny trailing delivery glyph. */
  status?: MessageBubbleStatus;
}

/** Single check (sent). */
function SingleCheck() {
  return (
    <svg className="lk-msg-check" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 13l4 4L14 7" />
    </svg>
  );
}

/** Double check (delivered / read). */
function DoubleCheck() {
  return (
    <svg className="lk-msg-check" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 13l4 4L14 7M9 17l1 1L22 6" />
    </svg>
  );
}

const STATUS_LABEL: Record<MessageBubbleStatus, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
};

/** Chat message bubble — `incoming` (glass, left) / `outgoing` (accent, right),
 *  with an optional `meta` line and an outgoing-only delivery `status` glyph.
 *  Mirrors the native `@lockin90/ui-native` `MessageBubble`. */
export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(function MessageBubble(
  { variant, children, meta, status, className, ...rest },
  ref,
) {
  const outgoing = variant === 'outgoing';
  const showStatus = outgoing && status != null;

  return (
    <div
      ref={ref}
      className={cn('lk-msg', outgoing ? 'lk-msg-out' : 'lk-msg-in', className)}
      {...rest}
    >
      <div className="lk-msg-bubble">{children}</div>
      {(meta != null || showStatus) && (
        <div className="lk-msg-meta">
          {showStatus && (
            <span className={cn('lk-msg-status', `lk-msg-status-${status}`)}>
              <span className="lk-sr-only">{STATUS_LABEL[status!]}</span>
              {status === 'sent' ? <SingleCheck /> : <DoubleCheck />}
            </span>
          )}
          {meta != null && <span className="lk-msg-meta-text">{meta}</span>}
        </div>
      )}
    </div>
  );
});
