// @vitest-environment happy-dom
/* SegmentedTabs kind="choice" (web): a radiogroup with one Tab stop; the arrow keys move and choose,
   skipping locked segments. */
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
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

  it('keeps a fill track on rows when a render rewrites its class (invalid, a choice made)', () => {
    // every label wider than its segment, at any size: the fit goes to rows
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, get: () => 100 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 50 });
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    const draw = (invalid: boolean, active: number) =>
      act(() => root.render(<SegmentedTabs kind="choice" fill tabs={['Sedentary', 'Moderate']} invalid={invalid} active={active} />));
    const track = () => host.querySelector('.lk-seg')!;
    draw(false, -1);
    expect(track().classList).toContain('lk-seg--rows');
    draw(true, -1);
    expect(track().classList).toContain('lk-seg--invalid');
    expect(track().classList).toContain('lk-seg--rows');
    draw(false, 1);
    expect(track().classList).toContain('lk-seg--rows');
    expect(host.querySelectorAll('.lk-seg-tab')[1].classList).toContain('lk-seg-wrap');
    act(() => root.unmount());
    host.remove();
    // back to the DOM's own (inherited) sizes
    delete (HTMLElement.prototype as { scrollWidth?: number }).scrollWidth;
    delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
  });
});
