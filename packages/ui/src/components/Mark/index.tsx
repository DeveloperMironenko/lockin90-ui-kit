import type { CSSProperties } from 'react';
import { cn } from '../../cn';

export interface MarkProps {
  /** Icon size in px (square). */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Accessible label. When omitted the mark is decorative (aria-hidden). */
  title?: string;
}

/**
 * LockIn90 icon mark — green outlined rounded-square tile with the energy "N"
 * line + endpoint dot (the iOS app-icon style). Pairs with {@link BrandMark}
 * (the wordmark); together they form the full lockup used in app headers.
 */
export default function Mark({ size = 28, className, style, title }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={cn('lk-mark', className)}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <rect x="2.5" y="2.5" width="31" height="31" rx="9" fill="#0E1320" stroke="#A8FF35" strokeWidth="2.5" />
      <path d="M10 25.5 L15 14 L20.5 21 L26 11" fill="none" stroke="#A8FF35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="26" cy="11" r="2.6" fill="#A8FF35" />
    </svg>
  );
}
