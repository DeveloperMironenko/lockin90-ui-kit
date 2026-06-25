import { type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon } from '../components/Icon';
import { BrandMark } from '../components/BrandMark';

/* PushPreview (NotificationPreview) — the live OS-style notification preview that
   sits beside the admin broadcast composer, updating in real time from the
   composer's title/body/channel inputs. `channel` switches the chrome:
   push     → an iOS lock-screen-style rounded glass card (icon tile · name · time);
   in-app   → a toast-like inline banner with an accent edge;
   email    → a mini email header (from row + bold subject + preview body).
   `placeholder` dims the card to a "type to preview…" empty hint. Pure render,
   no state — the consumer (composer) drives every prop. Web-only (admin has no
   native surface). Matches the `.push-card` / `.bc-preview` live preview from
   lockin90-design/admin/growth.html + overview.html (broadcast composer). */

export interface PushPreviewProps {
  /** App name shown in the chrome, e.g. 'LockIn90'. */
  appName: string;
  /** App icon tile; defaults to a small BrandMark icon tile. */
  appIcon?: ReactNode;
  /** Notification / email subject — the bold headline. */
  title: string;
  /** Notification / email body copy. */
  body: string;
  /** Trailing timestamp, e.g. 'now', '9:41'. @default 'now' */
  timeLabel?: string;
  /** Which delivery channel's chrome to render. */
  channel: 'push' | 'in-app' | 'email';
  /** Dim the card to a "type to preview…" empty state. */
  placeholder?: boolean;
}

const CHANNEL_LABEL: Record<PushPreviewProps['channel'], string> = {
  push: 'push',
  'in-app': 'in-app',
  email: 'email',
};

/**
 * Live OS-style notification preview for the broadcast composer. Renders the app
 * icon tile, app name + time, bold title and body. The wrapping `.lk-pushprev`
 * frame carries the dashed "LIVE PREVIEW · <channel>" chrome; the inner card
 * shape changes per `channel`. In `placeholder` mode the whole frame dims and a
 * "type to preview…" hint replaces the body text.
 */
export function PushPreview({
  appName,
  appIcon,
  title,
  body,
  timeLabel = 'now',
  channel,
  placeholder = false,
}: PushPreviewProps) {
  const icon = appIcon ?? <BrandMark variant="icon" size={30} aria-hidden />;

  return (
    <div
      className={cn(
        'lk-pushprev',
        `lk-pushprev-${channel}`,
        placeholder && 'lk-pushprev-placeholder',
      )}
      data-channel={CHANNEL_LABEL[channel]}
      role="figure"
      aria-label={`${CHANNEL_LABEL[channel]} preview`}
    >
      {channel === 'email' ? (
        <div className="lk-pushprev-card">
          <div className="lk-pushprev-emailhead">
            <span className="lk-pushprev-ic">{icon}</span>
            <div className="lk-pushprev-from">
              <span className="lk-pushprev-name">{appName}</span>
              <span className="lk-pushprev-addr">{`hello@${appName.toLowerCase()}.com`}</span>
            </div>
            <span className="lk-pushprev-time">{timeLabel}</span>
          </div>
          <div className="lk-pushprev-emailsubjlabel">Subject</div>
          <div className="lk-pushprev-title">
            {placeholder ? 'type to preview…' : title}
          </div>
          {!placeholder && body ? (
            <div className="lk-pushprev-body">{body}</div>
          ) : null}
        </div>
      ) : channel === 'in-app' ? (
        <div className="lk-pushprev-card">
          {/* basic-app banner: logo + name + time + close along the TOP, copy below */}
          <div className="lk-pushprev-apphead">
            <span className="lk-pushprev-ic">{icon}</span>
            <span className="lk-pushprev-name">{appName}</span>
            <span className="lk-pushprev-time">{timeLabel}</span>
            <span className="lk-pushprev-close" aria-hidden>
              <Icon name="close" size={13} />
            </span>
          </div>
          <div className="lk-pushprev-title">
            {placeholder ? 'type to preview…' : title}
          </div>
          {!placeholder && body ? (
            <div className="lk-pushprev-body">{body}</div>
          ) : null}
        </div>
      ) : (
        <div className="lk-pushprev-card">
          <span className="lk-pushprev-ic">{icon}</span>
          <div className="lk-pushprev-ct">
            <div className="lk-pushprev-headrow">
              <span className="lk-pushprev-name">{appName}</span>
              <span className="lk-pushprev-time">{timeLabel}</span>
            </div>
            <div className="lk-pushprev-title">
              {placeholder ? 'type to preview…' : title}
            </div>
            {!placeholder && body ? (
              <div className="lk-pushprev-body">{body}</div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
