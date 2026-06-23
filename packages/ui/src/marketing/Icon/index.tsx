import type { ReactNode } from 'react';
import { cn } from '../../cn';

/**
 * The full set of marketing icon names. The marketing app references specific
 * names from this union, so it must be preserved exactly.
 */
export type IconName =
  | 'arrowRight'
  | 'arrowUpRight'
  | 'check'
  | 'bolt'
  | 'moon'
  | 'heart'
  | 'activity'
  | 'watch'
  | 'shield'
  | 'brain'
  | 'chart'
  | 'dna'
  | 'flask'
  | 'target'
  | 'refresh'
  | 'users'
  | 'sparkle'
  | 'lock'
  | 'mail'
  | 'phone'
  | 'mapPin'
  | 'instagram'
  | 'x'
  | 'youtube'
  | 'linkedin'
  | 'star'
  | 'topic';

// name → inline SVG glyph. 24×24 viewBox, stroked with currentColor.
const PATHS: Record<IconName, ReactNode> = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  check: <path d="M5 13l4 4L19 7" />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  heart: (
    <path d="M19.5 5.5a5 5 0 0 0-7.5.6 5 5 0 0 0-7.5-.6 5.3 5.3 0 0 0 0 7.4L12 21l7.5-7.7a5.3 5.3 0 0 0 0-7.4z" />
  ),
  activity: <path d="M3 12h4l3 8 4-16 3 8h4" />,
  watch: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="3" />
      <path d="M9 6V3h6v3M9 18v3h6v-3M12 10v2.5l1.5 1" />
    </>
  ),
  shield: <path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3z" />,
  brain: (
    <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8M9 4a2.5 2.5 0 0 1 3 0m-3 0v14m6-14a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8M15 4a2.5 2.5 0 0 0-3 0" />
  ),
  chart: <path d="M4 20V4M4 20h16M8 16l3-4 3 2 4-6" />,
  dna: <path d="M5 3c0 6 14 6 14 12M5 9c0 6 14 6 14 12M7 5h10M7 19h10M9 8h6M9 16h6" />,
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7 15h10" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" />
    </>
  ),
  refresh: <path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2M18 4v4h-4M6 20v-4h4" />,
  users: (
    <path d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 19v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
  ),
  sparkle: <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mapPin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4 4 20" />,
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="m11 9 4 3-4 3z" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 11v6" />
    </>
  ),
  star: <path d="M12 3l2.9 5.9 6.5 1-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5L2.6 9.9l6.5-1z" />,
  topic: <path d="M9 4 7 20M17 4l-2 16M4 9h16M4 15h16" />,
};

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/** Inline stroked SVG icon set for the Aurora marketing surface. */
export function Icon({ name, size = 20, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('lk-icon', className)}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
