// @vitest-environment happy-dom
/* useWordFit (web): a word wider than its element shrinks the element's text until it fits, down to 50 %;
   a text that fits keeps the stylesheet's size. Layout is faked: happy-dom lays nothing out. */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { MetricTile } from '../components/MetricTile';

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
afterEach(() => restore());

function render(room: number, word: number) {
  restore = fakeLayout(room, word);
  const host = document.createElement('div');
  document.body.appendChild(host);
  act(() => createRoot(host).render(<MetricTile size="sm" textValue label="Chronotype" value="Нейтральный" />));
  return host.querySelector<HTMLElement>('.lk-metric-word')!;
}

describe('useWordFit', () => {
  it('keeps the size of a word that fits', () => {
    const value = render(100, 80);
    expect(value.style.fontSize).toBe('');
  });
  it('shrinks a word wider than its element until it fits', () => {
    const value = render(78, 94);
    expect(parseFloat(value.style.fontSize)).toBeLessThanOrEqual((16 * 78) / 94);
    expect(value.style.overflowWrap).toBe('normal');
  });
});
