// @vitest-environment happy-dom
/* Toast (docs/sdd/components/Toast.md, owner 2026-11-11): the glass card (no solid tone fill), an action
   ("Undo", filled) with a seconds ring whose 0 is the timeout, held while hovered, pressed or focused, and
   TopLayer above every dialog. */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';
import { TopLayer } from './TopLayer';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mount = (el: React.ReactElement) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(el));
  return { host, unmount: () => act(() => root.unmount()) };
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Toast look', () => {
  it('`filled` is ignored: the same glass card, its tone class', () => {
    const html = renderToStaticMarkup(<Toast tone="success" title="Name updated" />);
    expect(renderToStaticMarkup(<Toast tone="success" filled title="Name updated" />)).toBe(html);
    expect(html).toContain('lk-toast-success');
    expect(html).not.toContain('lk-toast-filled');
  });

  it('no action, no countdown line (a plain confirmation)', () => {
    const html = renderToStaticMarkup(<Toast tone="success" title="Units updated" duration={4000} onTimeout={() => {}} />);
    expect(html).not.toContain('lk-toast-count');
    expect(html).not.toContain('lk-toast-action');
  });
});

describe('Toast action and countdown', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const undo = (onTimeout = vi.fn(), onAction = vi.fn()) =>
    mount(<Toast tone="success" title="Photo removed" actionLabel="Undo" onAction={onAction} duration={6000} onTimeout={onTimeout} />);
  const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
  const number = (host: HTMLElement) => host.querySelector('.lk-toast-ring i')!.textContent;

  it('the action is a filled button named "Undo" (the ring and number hidden); a click calls onAction', () => {
    const onAction = vi.fn();
    const { host } = undo(vi.fn(), onAction);
    const button = host.querySelector<HTMLButtonElement>('.lk-toast-action')!;
    expect(button.textContent).toBe('6Undo');
    expect(host.querySelector('.lk-toast-ring')!.getAttribute('aria-hidden')).toBe('true');
    act(() => button.click());
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('no bottom line; the seconds round up (6 at the start, 4 after 2.5 s, 1 in the last second)', () => {
    const { host } = undo();
    expect(host.querySelector('.lk-toast-count')).toBeNull();
    expect(number(host)).toBe('6');
    advance(2500);
    expect(number(host)).toBe('4');
    advance(3000);
    expect(number(host)).toBe('1');
  });

  it('onTimeout only at 0', () => {
    const onTimeout = vi.fn();
    undo(onTimeout);
    advance(5900);
    expect(onTimeout).not.toHaveBeenCalled();
    advance(200);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('hover, press and focus hold it; it resumes with the time that was left', () => {
    const onTimeout = vi.fn();
    const { host } = undo(onTimeout);
    const card = host.querySelector('.lk-toast')!;
    advance(2000);
    act(() => void card.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: document.body })));
    advance(20000);
    expect(onTimeout).not.toHaveBeenCalled();
    expect(number(host)).toBe('4');
    act(() => void card.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body })));
    act(() => void card.dispatchEvent(new Event('pointerdown', { bubbles: true })));
    advance(20000);
    expect(onTimeout).not.toHaveBeenCalled();
    act(() => void card.dispatchEvent(new Event('pointerup', { bubbles: true })));
    act(() => host.querySelector<HTMLButtonElement>('.lk-toast-action')!.focus());
    advance(20000);
    expect(onTimeout).not.toHaveBeenCalled();
    act(() => host.querySelector<HTMLButtonElement>('.lk-toast-action')!.blur());
    advance(3900);
    expect(onTimeout).not.toHaveBeenCalled();
    advance(200);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });
});

describe('TopLayer', () => {
  it('draws its children in a click-through layer at the end of <body>, outside the page', () => {
    const { host } = mount(
      <TopLayer>
        <span data-testid="toast">Units updated</span>
      </TopLayer>,
    );
    const toast = document.querySelector('[data-testid="toast"]')!;
    expect(host.contains(toast)).toBe(false);
    expect(toast.parentElement!.className).toBe('lk-top-layer');
    expect(toast.parentElement!.parentElement).toBe(document.body);
  });
});
