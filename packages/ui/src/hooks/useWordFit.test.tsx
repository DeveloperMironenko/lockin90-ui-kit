// @vitest-environment happy-dom
/* useWordFit (web): a word wider than its element shrinks the element's text until it fits, never below
   the default text size (an enlarged root font size is taken back) or 11px; a text that fits keeps the
   stylesheet's size. Layout is faked: happy-dom lays nothing out. */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { MetricTile } from '../components/MetricTile';
import { fitFloorPercent } from './useWordFit';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** A fake layout: the element is `room` wide and its text `word × font-size / 16` wide. */
function fakeLayout(room: number, word: number) {
  const proto = HTMLElement.prototype as unknown as Record<string, PropertyDescriptor>;
  const saved = {
    clientWidth: Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth'),
    scrollWidth: Object.getOwnPropertyDescriptor(Element.prototype, 'scrollWidth'),
  };
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => room });
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get(this: HTMLElement) {
      const size = parseFloat(this.style.fontSize) || 16;
      return Math.max(room, (word * size) / 16);
    },
  });
  void proto;
  return () => {
    if (saved.clientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', saved.clientWidth);
    else delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
    delete (HTMLElement.prototype as { scrollWidth?: number }).scrollWidth;
  };
}

let restore = () => {};
afterEach(() => {
  restore();
  document.documentElement.style.removeProperty('font-size');
});

function render(room: number, word: number) {
  restore = fakeLayout(room, word);
  const host = document.createElement('div');
  // the tile's text at 16px whatever the root (as the kit's px sizes): only an enlarged root lets it shrink
  host.style.fontSize = '16px';
  document.body.appendChild(host);
  act(() => createRoot(host).render(<MetricTile size="sm" textValue label="Chronotype" value="Нейтральный" />));
  return host.querySelector<HTMLElement>('.lk-metric-word')!;
}

describe('fitFloorPercent', () => {
  it('never below the default text size, never under 11px', () => {
    expect(fitFloorPercent(16, 16)).toBe(100); // the default text size: nothing shrinks
    expect(fitFloorPercent(24, 32)).toBe(50); // a root twice the default: back to the default size
    expect(fitFloorPercent(15, 32)).toBe(74); // 11px of 15
    expect(fitFloorPercent(10, 32)).toBe(100); // already under 11px: never smaller
  });
  it('belowDefault (SegmentedTabs fill): at the default text size down to 11px; enlarged, the same rule', () => {
    expect(fitFloorPercent(12.5, 16, true)).toBe(88);
    expect(fitFloorPercent(24, 32, true)).toBe(50);
  });
});

describe('useWordFit', () => {
  it('keeps the size of a word that fits', () => {
    const value = render(100, 80);
    expect(value.style.fontSize).toBe('');
  });
  it('at the default text size, a word wider than its element keeps its size (it wraps, the last resort)', () => {
    const value = render(78, 94);
    expect(value.style.fontSize).toBe('');
    expect(value.style.overflowWrap).toBe('');
  });
  it('at an enlarged text size, it shrinks the word until it fits', () => {
    document.documentElement.style.fontSize = '32px';
    const value = render(78, 94);
    expect(parseFloat(value.style.fontSize)).toBeLessThanOrEqual((16 * 78) / 94);
    expect(value.style.overflowWrap).toBe('normal');
  });
});
