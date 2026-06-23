'use client';

import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { cn } from '../../cn';

export interface RevealProps {
  children: ReactNode;
  /** Stagger, in ms, applied as a transition-delay once the element reveals. */
  delay?: number;
  className?: string;
  as?: 'div' | 'li';
}

/**
 * Lightweight scroll-reveal: fades + lifts its children into view once, the
 * first time they intersect the viewport. If IntersectionObserver is missing,
 * content shows immediately so it is never stuck hidden. Reduced-motion users
 * get the content instantly (handled in the package styles.css).
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as Ref<HTMLDivElement & HTMLLIElement>}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn('lk-reveal', shown && 'lk-in', className)}
    >
      {children}
    </Tag>
  );
}
