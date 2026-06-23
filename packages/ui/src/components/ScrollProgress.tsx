'use client';

import { useEffect, useRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type ScrollProgressGradient = 'cta' | 'flux' | 'mint' | 'violet';

export interface ScrollProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Bar fill gradient token. Default `'cta'`. */
  gradient?: ScrollProgressGradient;
  /** Bar thickness in px. Default `3`. */
  height?: number;
  /**
   * Scroll container to track. When it returns an element, that element's
   * scroll position drives the bar; otherwise (default) the page/window does.
   */
  target?: () => Element | null;
}

/**
 * ScrollProgress — a `position: fixed` top reading-progress bar whose fill
 * scales horizontally (scaleX 0→1) to track scroll progress of the page, or of
 * a custom `target` scroll container.
 *
 * Drives off a passive scroll listener batched through rAF (one transform write
 * per frame), recomputes on resize, and tears everything down on unmount. The
 * gradient fill comes from the chosen token. Honors `prefers-reduced-motion`:
 * the fill still updates, it just drops the smoothing transition.
 */
export function ScrollProgress({
  gradient = 'cta',
  height = 3,
  target,
  className,
  style,
  ...rest
}: ScrollProgressProps) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    let frame = 0;

    const compute = () => {
      frame = 0;
      const el = target?.() ?? null;

      let scrolled: number;
      let scrollable: number;
      if (el) {
        scrolled = el.scrollTop;
        scrollable = el.scrollHeight - el.clientHeight;
      } else {
        const doc = document.documentElement;
        scrolled = window.scrollY || doc.scrollTop || 0;
        scrollable = (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      }

      const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0;
      fill.style.transform = `scaleX(${progress})`;
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    };

    // The scroll events come from the target element if present, else the window.
    const scrollSource: EventTarget = target?.() ?? window;

    scrollSource.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    compute(); // sync to the current scroll position immediately

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      scrollSource.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [target]);

  return (
    <div
      className={cn('lk-scrollprogress', `lk-scrollprogress--${gradient}`, className)}
      role="progressbar"
      aria-label="Scroll progress"
      style={{ height, ...style }}
      {...rest}
    >
      <div ref={fillRef} className="lk-scrollprogress-fill" />
    </div>
  );
}
