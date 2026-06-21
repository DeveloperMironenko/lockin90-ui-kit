import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** A single message in the thread. */
export interface ChatMessage {
  /** `them` = left/glass bubble, `me` = right/gradient-tinted bubble. */
  from: 'them' | 'me';
  /** Message body text. */
  text: string;
  /** Timestamp / meta line under the bubble, e.g. 'Coach Mara · 2:04 PM' or '2:09 PM'. */
  time?: string;
}

export interface ChatThreadProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional E2EE badge text shown centered above the thread. Pass `null` to hide. */
  e2eeLabel?: string | null;
  /** Optional day divider label (e.g. 'TODAY'). Pass `null` to hide. */
  dayLabel?: string | null;
  /** Ordered list of messages, oldest first. */
  messages?: ChatMessage[];
  /** Placeholder for the composer text input. */
  composerPlaceholder?: string;
}

/** Default conversation mirroring the design showcase example. */
const DEFAULT_MESSAGES: ChatMessage[] = [
  { from: 'them', text: 'How was your energy after the schedule change?', time: 'Coach Mara · 2:04 PM' },
  { from: 'me', text: 'Way better — peak held till 3pm 💪', time: '2:09 PM' },
  { from: 'them', text: "Love that. Let's lock the new morning block in.", time: 'Coach Mara · 2:11 PM' },
  { from: 'me', text: 'Done. Logging it now.', time: '2:12 PM' },
];

/** Padlock glyph — E2EE badge + composer lock. */
function LockGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/** Check / delivered tick shown on `me` messages. */
function DeliveredGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Paperclip / attach glyph for the composer. */
function AttachGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

/** Paper-plane / send glyph for the composer button. */
function SendGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

/** ChatThread — a coach/DM conversation: an E2EE badge, a day divider, message bubbles
 *  (them = left/glass, me = right/gradient-tinted) with timestamps + delivery ticks, and a
 *  composer bar (attach + lock + text input + gradient send button). Renders the showcase
 *  example by default. */
export function ChatThread({
  e2eeLabel = 'End-to-end encrypted · keys verified',
  dayLabel = 'TODAY',
  messages = DEFAULT_MESSAGES,
  composerPlaceholder = 'Message — encrypted end-to-end',
  className,
  ...rest
}: ChatThreadProps) {
  return (
    <div className={cn('lk-card', 'lk-chat', className)} {...rest}>
      {e2eeLabel != null && (
        <span className="lk-chat-e2ee lk-mono">
          <LockGlyph />
          {e2eeLabel}
        </span>
      )}

      <div className="lk-chat-body">
        {dayLabel != null && <div className="lk-chat-day">{dayLabel}</div>}

        {messages.map((msg, i) => (
          <div key={i} className={cn('lk-chat-msg', msg.from === 'me' ? 'lk-chat-me' : 'lk-chat-them')}>
            <div className="lk-chat-bubble">{msg.text}</div>
            {msg.time != null && (
              <div className="lk-chat-meta lk-mono">
                {msg.time}
                {msg.from === 'me' && <DeliveredGlyph />}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="lk-chat-composer">
        <button className="lk-chat-attach" type="button" aria-label="Attach">
          <AttachGlyph />
        </button>
        <LockGlyph className="lk-chat-lock" />
        <input className="lk-chat-input" type="text" placeholder={composerPlaceholder} aria-label="Message" />
        <button className="lk-chat-send" type="button" aria-label="Send">
          <SendGlyph />
        </button>
      </div>
    </div>
  );
}
