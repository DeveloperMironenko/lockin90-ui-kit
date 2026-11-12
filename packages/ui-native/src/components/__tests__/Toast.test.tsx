// @vitest-environment happy-dom
/// <reference lib="dom" />
import { colors } from '@lockin90/tokens';
import { act } from 'react';
import { AccessibilityInfo } from 'react-native';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Toast } from '../Toast';
import { mount, propOf, propsWith } from './dom';
import { findAll, hasDeclaration, parse, render } from './markup';

/* Toast (docs/sdd/components/Toast.md, owner 2026-11-11, variant C): the card's surface, opaque, with the tone's edge,
 * the icon in a tone circle, white text; a filled action ("Undo") with a seconds ring that holds while
 * touched, focused or a screen reader is on, and calls onTimeout only at 0. */

/** A colour as markup may write it: the hex, or its rgb() numbers. */
const has = (html: string, hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const flat = html.toLowerCase().replace(/\s/g, '');
  return flat.includes(hex.toLowerCase()) || flat.includes(`${r},${g},${b}`);
};

describe('Toast look', () => {
  test("the card's opaque surface, the tone on the edge and the icon circle; never a solid tone fill", () => {
    const html = render(Toast, { tone: 'success', title: 'Units updated' });
    // the card on the page, opaque (it floats over photos and fields: its text keeps 4.5:1)
    expect(findAll(parse(html), (el) => hasDeclaration(el, 'background-color:rgba(19,21,29,1.00)')).length).toBe(1);
    expect(html.replace(/\s/g, '')).toContain('rgba(52,245,197,0.45)');
    expect(html.replace(/\s/g, '')).toContain('rgba(52,245,197,0.14)');
    // `filled` is deprecated and ignored: the same card, no dark ink
    expect(render(Toast, { tone: 'success', title: 'Units updated', filled: true })).toBe(html);
    expect(has(html, colors.bg0)).toBe(false);
  });

  test('no seconds ring without an action, nor on an action without a duration ("Try again")', () => {
    const html = render(Toast, { tone: 'success', title: 'Units updated', duration: 4000, onTimeout: () => {} });
    expect(html).not.toContain('toast-countdown');
    const retry = render(Toast, { tone: 'danger', title: 'Not removed', actionLabel: 'Try again', onAction: () => {} });
    expect(retry).toContain('Try again');
    expect(retry).not.toContain('toast-countdown');
  });

  test('the error tone: its red edge (.7, 3.3:1)', () => {
    expect(render(Toast, { tone: 'danger', title: 'x' }).replace(/\s/g, '')).toMatch(/255,77,109,0\.70?\)/);
  });
});

describe('Toast action and countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(AccessibilityInfo, 'isScreenReaderEnabled').mockResolvedValue(false);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  const undoToast = (onTimeout: () => void, onAction = () => {}) =>
    mount(
      <Toast tone="success" title="Photo removed" actionLabel="Undo" onAction={onAction} duration={6000} onTimeout={onTimeout} />,
    );
  const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

  const seconds = (host: HTMLElement) =>
    host.querySelector('[data-testid="toast-countdown"]')!.textContent;

  test('the action is a button named by its label only (the ring is hidden); it calls onAction', () => {
    const onAction = vi.fn();
    const view = undoToast(() => {}, onAction);
    const button = view.host.querySelector('[aria-label="Undo"]')!;
    expect(button.getAttribute('role')).toBe('button');
    expect(propOf(view.host.querySelector('[data-testid="toast-countdown"]')!, 'accessibilityElementsHidden')).toBe(true);
    act(() => (propOf(button, 'onPress') as () => void)());
    expect(onAction).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  test('the seconds round up: 6, then 4 after 2.5 s, 1 in the last second', () => {
    const view = undoToast(() => {});
    expect(seconds(view.host)).toBe('6');
    advance(2500);
    expect(seconds(view.host)).toBe('4');
    advance(3000);
    expect(seconds(view.host)).toBe('1');
    view.unmount();
  });

  test('onTimeout only at 0', () => {
    const onTimeout = vi.fn();
    const view = undoToast(onTimeout);
    expect(view.host.querySelector('[data-testid="toast-countdown"]')).not.toBeNull();
    advance(5900);
    expect(onTimeout).not.toHaveBeenCalled();
    advance(200);
    expect(onTimeout).toHaveBeenCalledTimes(1);
    advance(10000);
    expect(onTimeout).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  test('a touch holds it; it resumes with the time that was left', () => {
    const onTimeout = vi.fn();
    const view = undoToast(onTimeout);
    const card = view.host.querySelector('[role="alert"]')!;
    advance(2000);
    act(() => (propOf(card, 'onTouchStart') as () => void)());
    advance(30000);
    expect(onTimeout).not.toHaveBeenCalled();
    expect(seconds(view.host)).toBe('4');
    act(() => (propOf(card, 'onTouchEnd') as () => void)());
    advance(3900);
    expect(onTimeout).not.toHaveBeenCalled();
    advance(200);
    expect(onTimeout).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  test('`paused` holds it from outside (the app\'s own Undo is in use)', () => {
    const onTimeout = vi.fn();
    const view = mount(
      <Toast title="Photo removed" actionLabel="Undo" onAction={() => {}} duration={6000} onTimeout={onTimeout} paused />,
    );
    advance(20000);
    expect(onTimeout).not.toHaveBeenCalled();
    view.unmount();
  });

  test('the ring number scales with the text size (no allowFontScaling={false})', () => {
    const view = undoToast(() => {});
    const num = view.host.querySelector('[data-testid="toast-countdown"]')!;
    const text = Array.from(num.querySelectorAll("*")).find((el) => el.textContent === '6' && el.children.length === 0)!;
    expect(propOf(text, 'allowFontScaling')).not.toBe(false);
    view.unmount();
  });

  test('focus on the action holds it', () => {
    const onTimeout = vi.fn();
    const view = undoToast(onTimeout);
    const button = view.host.querySelector('[aria-label="Undo"]')!;
    act(() => (propsWith(button, 'onPress')!.onFocus as () => void)());
    advance(20000);
    expect(onTimeout).not.toHaveBeenCalled();
    act(() => (propsWith(button, 'onPress')!.onBlur as () => void)());
    advance(6100);
    expect(onTimeout).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  test('with a screen reader on it holds, and its × (dismissLabel) ends it at once', async () => {
    vi.spyOn(AccessibilityInfo, 'isScreenReaderEnabled').mockResolvedValue(true);
    const onTimeout = vi.fn();
    const view = mount(
      <Toast
        tone="success"
        title="Photo removed"
        actionLabel="Undo"
        onAction={() => {}}
        duration={6000}
        onTimeout={onTimeout}
        dismissLabel="Dismiss"
      />,
    );
    await act(async () => {});
    advance(60000);
    expect(onTimeout).not.toHaveBeenCalled();
    const close = view.host.querySelector('[aria-label="Dismiss"]')!;
    act(() => (propOf(close, 'onPress') as () => void)());
    expect(onTimeout).toHaveBeenCalledTimes(1);
    view.unmount();
  });
});
