import { useLayoutEffect, useRef } from 'react';

/** How far a word shrinks to stay whole (percent of its size), as native FitText's 0.5. */
const MIN_FIT = 50;

/**
 * A word never splits (CONVENTIONS "Accessibility"), as native `FitText`: the element's lines wrap between
 * words, and when a word alone is wider than the element (a long translation in a third of a phone's width,
 * a large browser text size) the element's text shrinks until it fits, down to 50 %. Measured with the
 * element's `overflow-wrap` set to `normal` (a too-wide word then overflows: `scrollWidth > clientWidth`);
 * past 50 % the stylesheet's own `overflow-wrap` (`anywhere`) is the last resort. Runs again when `text`
 * changes, when the webfonts arrive and when the element's width changes. The element must be a block or
 * a flex item (its width set by its container, not by its text).
 */
export function useWordFit<T extends HTMLElement>(text: unknown) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.removeProperty('font-size');
      el.style.overflowWrap = 'normal';
      if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
        const base = parseFloat(getComputedStyle(el).fontSize) || 16;
        let percent = Math.min(98, Math.floor((100 * el.clientWidth) / el.scrollWidth));
        for (; percent >= MIN_FIT; percent -= 2) {
          el.style.fontSize = `${(base * percent) / 100}px`;
          if (el.scrollWidth <= el.clientWidth + 1) break;
        }
        if (el.scrollWidth <= el.clientWidth + 1) return;
      }
      el.style.removeProperty('overflow-wrap');
    };
    fit();
    let width = el.clientWidth;
    let frame = 0;
    const refit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    void document.fonts?.ready.then(refit);
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => {
            if (el.clientWidth === width) return;
            width = el.clientWidth;
            refit();
          });
    observer?.observe(el);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [text]);
  return ref;
}
