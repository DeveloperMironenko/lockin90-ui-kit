// @vitest-environment happy-dom
/// <reference lib="dom" />
import { colors } from '@lockin90/tokens';
import { act } from 'react';
import { AccessibilityInfo } from 'react-native';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Toast } from '../Toast';
import { mount, propOf, propsWith } from './dom';
import { render } from './markup';

/* Toast (docs/sdd/components/Toast.md, owner 2026-11-11): the glass card with a tone-tinted edge, the
 * icon in a tone circle, white text; an action ("Undo") with a countdown line that holds while touched
 * or focused and calls onTimeout only when it runs out. */

/** A colour as markup may write it: the hex, or its rgb() numbers. */
const has = (html: string, hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const flat = html.toLowerCase().replace(/\s/g, '');
  return flat.includes(hex.toLowerCase()) || flat.includes(`${r},${g},${b}`);
};

describe('Toast look', () => {
  test('the glass card, the tone on the edge and the icon circle; never a solid tone fill', () => {
    const html = render(Toast, { tone: 'success', title: 'Units updated' });
    expect(html.replace(/\s/g, '')).toContain('rgba(52,245,197,0.45)');
    expect(html.replace(/\s/g, '')).toContain('rgba(52,245,197,0.16)');
    // `filled` is deprecated and ignored: the same card, no dark ink
    expect(render(Toast, { tone: 'success', title: 'Units updated', filled: true })).toBe(html);
    expect(has(html, colors.bg0)).toBe(false);
  });

  test('no countdown line without an action', () => {
    const html = render(Toast, { tone: 'success', title: 'Units updated', duration: 4000, onTimeout: () => {} });
    expect(html).not.toContain('toast-countdown');
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

  test('the action is a button named by its label; it calls onAction', () => {
    const onAction = vi.fn();
    const view = undoToast(() => {}, onAction);
    const button = view.host.querySelector('[aria-label="Undo"]')!;
    expect(button.getAttribute('role')).toBe('button');
    act(() => (propOf(button, 'onPress') as () => void)());
    expect(onAction).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  test('onTimeout only when the line runs out', () => {
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
    act(() => (propOf(card, 'onTouchEnd') as () => void)());
    advance(3900);
    expect(onTimeout).not.toHaveBeenCalled();
    advance(200);
    expect(onTimeout).toHaveBeenCalledTimes(1);
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
