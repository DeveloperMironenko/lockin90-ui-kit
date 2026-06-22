import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Avatar, type AvatarProps } from './Avatar';

/** Per-avatar props forwarded to the composed {@link Avatar}. */
export type AvatarStackItem = Pick<AvatarProps, 'name' | 'initials' | 'src' | 'gradient'>;

export interface AvatarStackProps extends HTMLAttributes<HTMLSpanElement> {
  /** Roster entries — each forwarded to a composed `Avatar`. */
  avatars: AvatarStackItem[];
  /** Cap of visible avatars; the remainder collapse into a trailing "+N" chip. @default 4 */
  max?: number;
  /** Pixel diameter of each avatar. @default 32 */
  size?: number;
  /**
   * Ring/gap color drawn between overlapping avatars so they read as separate.
   * @default 'var(--bg-1)'
   */
  ring?: string;
}

/**
 * AvatarStack — a row of overlapping circular avatars with a trailing "+N"
 * overflow chip; social proof / multi-author / roster. Composes {@link Avatar}
 * for each entry, overlaps them with a negative margin, and draws a ring in the
 * surrounding background color so each tile reads as separate. Anything beyond
 * `max` collapses into a same-size "+N" chip. Mirrors the `.wl-avatars` /
 * `.authors` treatments from the marketing + CMS designs.
 */
export function AvatarStack({
  avatars,
  max = 4,
  size = 32,
  ring = 'var(--bg-1)',
  className,
  style,
  ...rest
}: AvatarStackProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;
  // Overlap ≈ a third of the diameter; ring thickness scales gently with size.
  const overlap = -Math.round(size * 0.32);
  const ringWidth = Math.max(2, Math.round(size * 0.06));

  return (
    <span
      className={cn('lk-avstack', className)}
      style={{ ['--lk-avstack-ring' as string]: ring, ...style }}
      {...rest}
    >
      {visible.map((a, i) => (
        <span
          key={i}
          className="lk-avstack-item lk-avstack-ringed"
          style={{
            marginLeft: i === 0 ? 0 : overlap,
            zIndex: visible.length - i,
            boxShadow: `0 0 0 ${ringWidth}px var(--lk-avstack-ring)`,
          }}
        >
          <Avatar {...a} size={size} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="lk-avstack-item"
          style={{ marginLeft: overlap, zIndex: 0 }}
        >
          <span
            className="lk-avstack-more"
            style={{
              width: size,
              height: size,
              fontSize: Math.round(size * 0.36),
              boxShadow: `0 0 0 ${ringWidth}px var(--lk-avstack-ring)`,
            }}
          >
            +{overflow}
          </span>
        </span>
      )}
    </span>
  );
}
