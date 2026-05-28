import React from 'react';
import { Mono } from '../Typography';

interface MessageBubbleProps {
  direction: 'outbound' | 'inbound';
  // Decrypted plaintext. Pass null if decryption hasn't completed; the bubble
  // will render an "encrypted…" placeholder rather than empty.
  body: string | null;
  // Sent / delivered / read state. Outbound bubbles render this as a faint
  // mono timestamp below; inbound bubbles ignore it.
  state?: 'sent' | 'delivered' | 'read';
  timestamp: string;
  className?: string;
}

// DMS chat bubble. Encryption icon visible when the body hasn't decoded yet —
// rendered even for inbound + outbound so the layout stays consistent.
export function MessageBubble({
  direction,
  body,
  state,
  timestamp,
  className,
}: MessageBubbleProps) {
  const outbound = direction === 'outbound';
  return (
    <div className={`flex ${outbound ? 'justify-end' : 'justify-start'} ${className ?? ''}`}>
      <div
        className={`max-w-[78%] rounded-lg px-3 py-2 ${
          outbound
            ? 'bg-accent/[0.14] border border-accent/30 text-white'
            : 'bg-elevated border border-border text-white'
        }`}
      >
        {body === null ? (
          <div className="flex items-center gap-1.5 text-muted">
            <span aria-hidden>🔒</span>
            <span className="text-xs">encrypted…</span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words text-[14px] leading-snug">{body}</div>
        )}
        <div className="mt-1 text-right">
          <Mono color="muted">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {outbound && state ? ` · ${state}` : ''}
          </Mono>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
