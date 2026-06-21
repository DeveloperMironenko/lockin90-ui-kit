import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Display name — used to derive monogram initials when `initials` is omitted. */
  name?: string;
  /** Explicit monogram initials; overrides the value derived from `name`. */
  initials?: string;
  /** Image URL. When present, an `<img>` is rendered instead of the monogram. */
  src?: string;
  /** Pixel size of the square avatar. @default 44 */
  size?: number;
  /** Outline shape — a full circle or a softly-rounded square. @default 'circle' */
  shape?: 'circle' | 'rounded';
  /** CSS background for the monogram tile. @default violet→cyan flux gradient */
  gradient?: string;
}

/** First letters of up to two words, uppercased; `'?'` when empty. */
function initialsFor(name: string): string {
  const derived = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
  return derived || '?';
}

/**
 * Avatar — a standalone identity tile showing either an image or a monogram
 * (initials painted on the flux gradient). Square by `size`, circular by
 * default or softly rounded via `shape="rounded"`. The monogram falls back to
 * initials derived from `name`, then to `'?'`. Mirrors the monogram treatment
 * used by ProfileHeader and Leaderboard.
 */
export function Avatar({
  name,
  initials,
  src,
  size = 44,
  shape = 'circle',
  gradient = 'linear-gradient(135deg, var(--accent), var(--cyan))',
  className,
  ...rest
}: AvatarProps) {
  return (
    <span
      className={cn('lk-avatar', shape === 'rounded' && 'lk-avatar-rounded', className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      {src ? (
        <img className="lk-avatar-img" src={src} alt={name ?? ''} />
      ) : (
        <span
          className="lk-avatar-mono"
          style={{ background: gradient, fontSize: Math.round(size * 0.38) }}
        >
          {initials ?? initialsFor(name ?? '')}
        </span>
      )}
    </span>
  );
}
