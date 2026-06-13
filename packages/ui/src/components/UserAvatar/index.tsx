import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { UserAvatarProps } from './types';

export type { UserAvatarProps } from './types';

/**
 * Square initials tile with an accent under-bar — the admin "user" glyph.
 * Distinct from the round gradient `Avatar`; this one takes pre-computed
 * `initials` and a `size`, exactly as the old admin app passes them.
 */
export default function UserAvatar({ initials, size = 32, className }: UserAvatarProps) {
  const isLarge = size >= 48;
  const style: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--r-sm)',
    background: 'var(--glass-2)',
    border: '1px solid var(--border-2)',
    color: 'var(--text)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: isLarge ? 26 : 13,
    letterSpacing: '-0.02em',
  };

  return (
    <div className={cn(className)} style={style} aria-label={initials} title={initials}>
      {initials}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: isLarge ? 3 : 2,
          background: 'var(--accent)',
        }}
      />
    </div>
  );
}
