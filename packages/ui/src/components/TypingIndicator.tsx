import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface TypingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional leading text, e.g. "Sofia is typing" (default: none — just the dots). */
  label?: string;
}

/**
 * TypingIndicator — a small left-aligned glass bubble (like an incoming
 * `MessageBubble`) holding three dots that bounce/pulse in a staggered loop
 * to signal someone composing a message. Matches the `DotsLoader` animation
 * convention (1.2s cycle, 0.16s stagger). An optional `label` renders as small
 * dim text before the dots. Pure CSS animation — holds the dots static & fully
 * lit under `prefers-reduced-motion: reduce`.
 * Mirrors the native `@lockin90/ui-native` `TypingIndicator`.
 */
export function TypingIndicator({ label, className, ...rest }: TypingIndicatorProps) {
  return (
    <div
      className={cn('lk-typing', className)}
      role="status"
      aria-label={label ? `${label}…` : 'Typing…'}
      {...rest}
    >
      {label != null && <span className="lk-typing-label">{label}</span>}
      <span className="lk-typing-dots" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          // each dot is delayed by 0.16s × index for the staggered wave
          <i key={i} style={{ animationDelay: `${i * 0.16}s` } as CSSProperties} />
        ))}
      </span>
    </div>
  );
}
