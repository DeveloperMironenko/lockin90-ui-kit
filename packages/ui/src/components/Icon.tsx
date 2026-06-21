import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type IconName =
  | 'back'
  | 'chevron'
  | 'share'
  | 'more'
  | 'lock'
  | 'play'
  | 'info'
  | 'timer'
  | 'plus'
  | 'check'
  | 'star';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  /** pixel size of the rendered glyph (width = height) */
  size?: number;
}

/** Inner SVG geometry per glyph — drawn with currentColor strokes. */
const GLYPHS: Record<IconName, ReactNode> = {
  back: <polyline points="15 6 9 12 15 18" />,
  chevron: <polyline points="9 6 15 12 9 18" />,
  share: (
    <>
      <path d="M12 3v12" />
      <polyline points="8 7 12 3 16 7" />
      <path d="M7 11H5v9h14v-9h-2" />
    </>
  ),
  more: (
    <g fill="currentColor" stroke="none">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </g>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  play: (
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  timer: (
    <>
      <line x1="9" y1="3" x2="15" y2="3" />
      <line x1="12" y1="3" x2="12" y2="6" />
      <circle cx="12" cy="14" r="8" />
      <path d="M12 14V9.5" />
      <path d="M12 14l3 2" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  check: <polyline points="5 12.5 10 17.5 19 6.5" />,
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.86-4.25 4.14 1 5.86L12 17.1l-5.25 2.76 1-5.86L3.5 9.66l5.9-.86z" />
  ),
};

/** Shared inline-SVG icon set — color inherits from the parent via currentColor. */
export function Icon({ name, size = 18, className, ...rest }: IconProps) {
  return (
    <span className={cn('lk-icon', className)} {...rest}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {GLYPHS[name]}
      </svg>
    </span>
  );
}
