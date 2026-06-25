import { type ButtonHTMLAttributes } from 'react';
import { cn } from '../cn';

/** Padlock — body + shackle. */
function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10.5" width="16" height="10" rx="2.2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

export interface LockedRowProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Row label, e.g. "19 more similar exercises". */
  label?: string;
  /** Tap handler. */
  onClick?: () => void;
}

/** Tappable gated list row: red lock badge + label + chevron, red left accent. */
export function LockedRow({
  label = '19 more similar exercises',
  onClick,
  className,
  ...rest
}: LockedRowProps) {
  return (
    <button type="button" className={cn('lk-lockrow', className)} onClick={onClick} {...rest}>
      <span className="lk-lockrow-badge">
        <LockIcon className="lk-lockrow-lock" />
      </span>
      <span className="lk-lockrow-label">{label}</span>
      <svg className="lk-lockrow-chev" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m9 6 6 6-6 6" />
      </svg>
    </button>
  );
}
