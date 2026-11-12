// @vitest-environment happy-dom
/* SegmentedTabs kind="choice" (web): a radiogroup with one Tab stop; the arrow keys move and choose,
   skipping locked segments. */
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { wordsOf } from './segRows';
import { SegmentedTabs } from './SegmentedTabs';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('SegmentedTabs choice', () => {
  it('is a radiogroup of radios, the chosen one checked and the only Tab stop', () => {
    const html = renderToStaticMarkup(<SegmentedTabs kind="choice" tabs={['Metric', 'Imperial']} active={1} aria-label="Units" />);
    expect(html).toMatch(/role="radiogroup"/);
    expect(html).toContain('aria-label="Units"');
    expect(html.match(/role="radio"/g)).toHaveLength(2);
    expect(html).toMatch(/role="radio" aria-checked="false" tabindex="-1"/);
    expect(html).toMatch(/role="radio" aria-checked="true" tabindex="0"/);
    expect(html).not.toContain('aria-selected');
  });

  it('stays a tablist by default', () => {
    const html = renderToStaticMarkup(<SegmentedTabs tabs={['A', 'B']} />);
    expect(html).toContain('role="tablist"');
    expect(html).not.toContain('tabindex');
  });

  it('moves and chooses with the arrow keys, Home and End, skipping a locked segment', () => {
    function Harness() {
      const [active, setActive] = useState(0);
      return <SegmentedTabs kind="choice" tabs={['A', 'B', 'C', 'D']} locked={[1]} active={active} onChange={setActive} />;
    }
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<Harness />));
    const radios = () => Array.from(host.querySelectorAll<HTMLElement>('[role="radio"]'));
    const key = (k: string) =>
      act(() => {
        (document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
      });
    const checked = () => radios().findIndex((r) => r.getAttribute('aria-checked') === 'true');

    radios()[0].focus();
    key('ArrowRight');
    expect(checked()).toBe(2);
    expect(document.activeElement).toBe(radios()[2]);
    key('ArrowLeft');
    expect(checked()).toBe(0);
    key('ArrowLeft');
    expect(checked()).toBe(3);
    key('Home');
    expect(checked()).toBe(0);
    key('End');
    expect(checked()).toBe(3);
    expect(radios()[3].tabIndex).toBe(0);
    expect(radios()[0].tabIndex).toBe(-1);
    act(() => root.unmount());
    host.remove();
  });

  it('fill: labels too wide for one row go on balanced rows of pills (3 + 2), kept through re-renders', () => {
    // a 300px track; every text 9px a character (jsdom lays nothing out)
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 300 });
    const rect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
      return { width: (this.textContent ?? '').length * 9 } as DOMRect;
    };
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    const five = ['Sedentary', 'Lighter', 'Moderate', 'Activity', 'Athletes'];
    const draw = (invalid: boolean, active: number) =>
      act(() => root.render(<SegmentedTabs kind="choice" fill tabs={five} invalid={invalid} active={active} />));
    const track = () => host.querySelector('.lk-seg')!;
    draw(false, -1);
    // one row: 60 each; "Sedentary" 81 shrinks to 0.72 (11.52px of jsdom's 16): still one row
    expect(track().classList).not.toContain('lk-seg--rows');
    act(() => root.render(<SegmentedTabs kind="choice" fill tabs={five.map((t) => `${t}xx`)} active={-1} />));
    // 99 × 0.69 = 69 > 59: rows; a third (100) holds every label: 3 + 2, a break after the third
    expect(track().classList).toContain('lk-seg--rows');
    expect(Array.from(track().children).map((el) => (el.classList.contains('lk-seg-break') ? '|' : 'o')).join('')).toBe('ooo|oo');
    expect((track().querySelector('.lk-seg-tab') as HTMLElement).style.width).toBe('100px');
    act(() => root.render(<SegmentedTabs kind="choice" fill tabs={five.map((t) => `${t}xx`)} invalid active={1} />));
    expect(track().classList).toContain('lk-seg--invalid');
    expect(track().classList).toContain('lk-seg--rows');
    act(() => root.unmount());
    host.remove();
    HTMLElement.prototype.getBoundingClientRect = rect;
    delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
  });

  it('fill: a zh / ja label is one word', () => {
    expect(wordsOf('アスリート')).toEqual(['アスリート']);
    expect(wordsOf('Very active')).toEqual(['Very', 'active']);
    expect(wordsOf('Cardio-heavy')).toEqual(['Cardio-', 'heavy']);
  });
});
