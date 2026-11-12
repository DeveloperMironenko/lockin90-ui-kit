// @vitest-environment happy-dom
/* Toast (docs/sdd/components/Toast.md, owner 2026-11-11): the glass card (no solid tone fill), an action
   ("Undo") with a countdown line whose end is the timeout, and TopLayer above every dialog. The line's
   hold on hover / focus / press is CSS, checked in a real browser (frontend live spec). */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
  const undo = (onTimeout = vi.fn(), onAction = vi.fn()) =>
    mount(<Toast tone="success" title="Photo removed" actionLabel="Undo" onAction={onAction} duration={6000} onTimeout={onTimeout} />);

  it('the action is a button with its label; a click calls onAction', () => {
    const onAction = vi.fn();
    const { host } = undo(vi.fn(), onAction);
    const button = host.querySelector<HTMLButtonElement>('.lk-toast-action')!;
    expect(button.textContent).toBe('Undo');
    act(() => button.click());
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('the line runs for `duration` (whole seconds as its reduced-motion steps) and is hidden from screen readers', () => {
    const { host } = undo();
    const line = host.querySelector<HTMLElement>('.lk-toast-count')!;
    expect(line.style.getPropertyValue('--lk-toast-ms')).toBe('6000ms');
    expect(line.style.getPropertyValue('--lk-toast-steps')).toBe('6');
    expect(line.getAttribute('aria-hidden')).toBe('true');
  });

  it('onTimeout only when the line ends', () => {
    const onTimeout = vi.fn();
    const { host } = undo(onTimeout);
    expect(onTimeout).not.toHaveBeenCalled();
    act(() => {
      host.querySelector('.lk-toast-count')!.dispatchEvent(new Event('animationend', { bubbles: true }));
    });
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('a press holds it (is-held while the pointer is down)', () => {
    const { host } = undo();
    const card = host.querySelector('.lk-toast')!;
    act(() => {
      card.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    });
    expect(card.classList.contains('is-held')).toBe(true);
    act(() => {
      card.dispatchEvent(new Event('pointerup', { bubbles: true }));
    });
    expect(card.classList.contains('is-held')).toBe(false);
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
