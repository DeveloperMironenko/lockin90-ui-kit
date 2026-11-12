import { useLayoutEffect, useRef } from 'react';

/** The browser's default text size (the root font size nothing has enlarged). */
const DEFAULT_ROOT = 16;
/** The smallest size meaningful text is drawn at (CONVENTIONS "No meaningful text under 11px"). */
const MIN_TEXT = 11;

/**
 * How far (percent of its size) a text `base` px big may shrink so a word stays whole, as native
 * `fitFloor`: never below the default text size (only an enlarged root font size is taken back:
 * 16 / root; at the default size nothing shrinks) and never under 11px. `belowDefault` (SegmentedTabs
 * `fill` choice rows only, owner 2026-11-11): at the default text size (or a smaller root) down to 11px; at
 * an enlarged one the rule above stands. 100 when it can't shrink.
 */
export function fitFloorPercent(base: number, root: number, belowDefault = false): number {
  const minText = MIN_TEXT / base;
  const floor = belowDefault && root <= DEFAULT_ROOT ? minText : Math.max(DEFAULT_ROOT / Math.max(DEFAULT_ROOT, root), minText);
  return Math.min(100, Math.ceil(100 * floor - 1e-9));
}

/**
 * A word never splits (CONVENTIONS "Accessibility"), as native `FitText`: the element's lines wrap between
 * words, and when a word alone is wider than the element (a long translation at an enlarged browser text
 * size) the element's text shrinks until it fits, down to `fitFloorPercent` (never below the default text
 * size or 11px). Measured with the element's `overflow-wrap` set to `normal` (a too-wide word then
 * overflows: `scrollWidth > clientWidth`); past the floor the stylesheet's own `overflow-wrap`
 * (`anywhere`) is the last resort, and the layout is what should change (fewer columns). Runs again when
 * `text` changes, when the webfonts arrive and when the element's width changes. The element must be a
 * block or a flex item that can shrink (`min-width: 0`: its width set by its container, not by its text).
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
        const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || DEFAULT_ROOT;
        const floor = fitFloorPercent(base, root);
        // one measured jump, then 2 % steps, the last one the floor
        let percent = Math.max(floor, Math.min(98, Math.floor((100 * el.clientWidth) / el.scrollWidth)));
        while (floor < 100) {
          el.style.fontSize = `${(base * percent) / 100}px`;
          if (el.scrollWidth <= el.clientWidth + 1 || percent === floor) break;
          percent = Math.max(floor, percent - 2);
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
