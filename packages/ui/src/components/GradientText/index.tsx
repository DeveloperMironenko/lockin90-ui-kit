import type { ReactNode, ElementType } from 'react';

export interface GradientTextProps {
  children: ReactNode;
  /** Which energy gradient flows through the text. */
  variant?: 'flux' | 'cta' | 'violet';
  /** Render as a static (non-animated) gradient. */
  still?: boolean;
  /** Element to render. Defaults to a <span>. */
  as?: ElementType;
  className?: string;
}

/**
 * Animated energy-spectrum gradient text — the Aurora Flux signature. Use on
 * big numbers, hero words, and the "90" in the wordmark.
 */
export default function GradientText({
  children,
  variant = 'flux',
  still = false,
  as: Tag = 'span',
  className = '',
}: GradientTextProps) {
  const variantCls =
    variant === 'cta' ? 'ea-gradient-text-cta' : variant === 'violet' ? 'ea-gradient-text-violet' : '';
  return (
    <Tag
      className={`ea-gradient-text ${variantCls} ${className}`.trim()}
      style={still ? { animation: 'none' } : undefined}
    >
      {children}
    </Tag>
  );
}
