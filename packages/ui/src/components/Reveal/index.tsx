'use client';

import type { ElementType, ReactNode } from 'react';
import { useInView } from '../motion';
import { cn } from '../../cn';

export type RevealVariant = 'up' | 'left' | 'right' | 'scale';

export interface RevealProps {
  children: ReactNode;
  /** Entrance direction (default 'up'). */
  variant?: RevealVariant;
  /** Delay the reveal by N milliseconds (stagger). */
  delay?: number;
  /** Element/component to render as (default 'div'). */
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: '',
  left: 'lk-reveal-left',
  right: 'lk-reveal-right',
  scale: 'lk-reveal-scale',
};

/**
 * Fade / slide a block in when it scrolls into view. Reduced-motion + SSR safe
 * (snaps visible). Wrap groups of cards and pass an increasing `delay` to stagger.
 */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  as,
  className,
  style,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={cn('lk-reveal', VARIANT_CLASS[variant], inView && 'lk-in', className)}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
