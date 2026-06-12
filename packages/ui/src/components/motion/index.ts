'use client';

// Aurora Flux motion layer — a small, idiomatic-React port of the vanilla
// `mockups/design/1/shared/motion.js` engine. Components self-animate with these
// hooks instead of a global DOM-scanning script. Everything honors
// prefers-reduced-motion (and a `?still=1` URL flag) by snapping to final state.

import { useEffect, useRef, useState, useCallback } from 'react';
import type { CSSProperties } from 'react';

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** True when the user prefers reduced motion or the page is in `?still=1` mode. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const still = new URLSearchParams(window.location.search).has('still');
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(still || mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

export interface InViewOptions {
  /** Fire once then stop observing (default true). */
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/** Observe an element and report when it scrolls into view. */
export function useInView<T extends Element = HTMLDivElement>(
  options: InViewOptions = {},
): { ref: React.RefObject<T | null>; inView: boolean } {
  const { once = true, threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, rootMargin]);

  return { ref, inView };
}

export interface CountUpOptions {
  durationMs?: number;
  decimals?: number;
  /** Begin the animation. When false, the value stays at 0 until flipped. */
  start?: boolean;
  /** Snap straight to the target with no tween (e.g. when animation is disabled). */
  instant?: boolean;
  /** Group separators (1,234). */
  comma?: boolean;
  prefix?: string;
  suffix?: string;
}

/** Animate a number from 0 → `target`, returning the formatted string. */
export function useCountUp(target: number, options: CountUpOptions = {}): string {
  const { durationMs = 1400, decimals = 0, start = true, instant = false, comma = false, prefix = '', suffix = '' } = options;
  const reduced = useReducedMotion();
  const [value, setValue] = useState(instant ? target : 0);

  const fmt = useCallback(
    (v: number): string => {
      const body = comma
        ? v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : v.toFixed(decimals);
      return `${prefix}${body}${suffix}`;
    },
    [comma, decimals, prefix, suffix],
  );

  useEffect(() => {
    if (!start) return;
    if (instant || reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    let startedAt: number | null = null;
    const tick = (now: number) => {
      if (startedAt === null) startedAt = now;
      const p = Math.min(1, (now - startedAt) / durationMs);
      setValue(target * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start, instant, reduced]);

  return fmt(value);
}

/** Pointer-tilt — spread the returned props onto the element you want to tilt. */
export function useTilt(max = 8): {
  ref: React.RefObject<HTMLDivElement | null>;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
  style: CSSProperties;
} {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el || reduced) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
    },
    [max, reduced],
  );

  const onPointerLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);

  return {
    ref,
    onPointerMove,
    onPointerLeave,
    style: { transformStyle: 'preserve-3d', transition: 'transform .2s var(--ease)' },
  };
}

/** Magnetic pull toward the pointer — spread the returned props onto a button. */
export function useMagnetic(strength = 0.3): {
  ref: React.RefObject<HTMLElement | null>;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
} {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el || reduced) return;
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${
        (e.clientY - r.top - r.height / 2) * strength
      }px)`;
    },
    [strength, reduced],
  );

  const onPointerLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
