import { useId, type SVGProps } from 'react';

export type BrandMarkVariant = 'mark' | 'lockup' | 'icon' | 'mono';

export interface BrandMarkProps extends Omit<SVGProps<SVGSVGElement>, 'height' | 'width'> {
  /** mark = line+dot, lockup = mark+wordmark, icon = dark app-tile, mono = single-color */
  variant?: BrandMarkVariant;
  /** pixel height of the mark (the lockup wordmark scales with it) */
  size?: number;
  title?: string;
}

const LINE = '#78CEDF';
const DOT = '#C6F84E';

/** The signature energy line + glowing peak dot, drawn in a 343×302 space. */
function MarkGlyph({ mono = false }: { mono?: boolean }) {
  const stroke = mono ? 'var(--text)' : LINE;
  const dot = mono ? 'var(--text)' : DOT;
  return (
    <>
      {!mono && (
        <>
          <circle cx="288" cy="90" r="42" fill="none" stroke={DOT} strokeOpacity="0.28" strokeWidth="6" />
          <circle cx="288" cy="90" r="58" fill="none" stroke={DOT} strokeOpacity="0.13" strokeWidth="5" />
        </>
      )}
      <path d="M48 256 L128 120 L184 204 L262 116" fill="none" stroke={stroke} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="288" cy="90" r="30" fill={dot} />
    </>
  );
}

/**
 * LockIn90 brand mark — a sky-cyan energy line climbing to a glowing lime peak dot.
 * `icon` renders the dark store-tile (violet glow); `lockup` adds the wordmark.
 */
export function BrandMark({ variant = 'mark', size = 28, title = 'LockIn90', ...rest }: BrandMarkProps) {
  const gid = useId().replace(/:/g, '');

  if (variant === 'lockup') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.42) }}>
        <BrandMark variant="mark" size={size} aria-hidden />
        <span className="lk-display" style={{ fontSize: Math.round(size * 1.05), fontWeight: 700, letterSpacing: '-0.02em' }}>
          LockIn<span className="lk-gradient-text">90</span>
        </span>
      </span>
    );
  }

  if (variant === 'icon') {
    return (
      <svg width={size} height={Math.round((size * 302) / 343)} viewBox="0 0 343 302" style={{ borderRadius: Math.round(size * 0.22) }} role="img" aria-label={title} {...rest}>
        <defs>
          <linearGradient id={`${gid}b`} x1="0" y1="0" x2="343" y2="302">
            <stop offset="0" stopColor="#1b2438" />
            <stop offset="1" stopColor="#0b0f18" />
          </linearGradient>
          <radialGradient id={`${gid}g`} cx="0.26" cy="0.16" r="0.6">
            <stop offset="0" stopColor="#5d40ad" stopOpacity="0.6" />
            <stop offset="1" stopColor="#5d40ad" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="343" height="302" fill={`url(#${gid}b)`} />
        <rect width="343" height="302" fill={`url(#${gid}g)`} />
        {/* center the solid glyph (line+dot bbox x[33,318] y[60,271]) in the tile */}
        <g transform="translate(-4 -14.5)">
          <MarkGlyph />
        </g>
      </svg>
    );
  }

  // mark / mono — transparent, cropped to the glyph
  return (
    <svg width={size} height={Math.round((size * 248) / 320)} viewBox="30 28 320 248" fill="none" role="img" aria-label={title} {...rest}>
      <MarkGlyph mono={variant === 'mono'} />
    </svg>
  );
}
