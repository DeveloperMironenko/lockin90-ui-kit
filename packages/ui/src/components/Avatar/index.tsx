import type { CSSProperties } from 'react';
import { cn } from '../../cn';

export type AvatarGradient = 'flux' | 'cta' | 'mint' | 'violet' | 'warm';

export interface AvatarProps {
  /** Display name — used to derive up-to-2-letter initials and the alt text. */
  name?: string;
  /** Optional image URL. When set, the image fills the circle instead of initials. */
  src?: string;
  /** Diameter in px. */
  size?: number;
  /** Gradient fill behind initials. */
  gradient?: AvatarGradient;
  className?: string;
}

/** Up-to-2-letter initials from a display name (e.g. "Mia Kohl" → "MK"). */
function initialsFrom(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Gradient initials circle that can also render a cover image. */
export default function Avatar({
  name,
  src,
  size = 38,
  gradient = 'flux',
  className,
}: AvatarProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    fontSize: Math.round(size * 0.36),
    background: `var(--grad-${gradient})`,
  };
  const initials = name ? initialsFrom(name) : '';

  return (
    <div className={cn('lk-avatar', className)} style={style} aria-label={name} title={name}>
      {src ? (
        <img
          src={src}
          alt={name ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        initials
      )}
    </div>
  );
}
