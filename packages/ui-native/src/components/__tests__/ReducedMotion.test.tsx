// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Reduce Motion (native): loops stop at a defined still frame — DotsLoader's dots fully shown, the
   indeterminate ProgressBar band in the middle of its track — instead of wherever they were. */
import { act } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { mount } from './dom';

afterEach(() => vi.restoreAllMocks());

async function withReducedMotion() {
  vi.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  vi.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((() => ({ remove: () => {} })) as never);
  vi.resetModules();
}

describe('Reduce Motion still frames', () => {
  test('DotsLoader stops with every dot at full strength', async () => {
    await withReducedMotion();
    const { DotsLoader } = await import('../DotsLoader');
    const { host, unmount } = mount(<DotsLoader label="Loading" />);
    await act(async () => {});
    const dots = Array.from(host.querySelectorAll('[aria-label="Loading"] > div')) as HTMLElement[];
    expect(dots.length).toBe(3);
    for (const d of dots) expect(d.style.opacity).toBe('1');
    unmount();
  });

  test('no loop starts once the setting is known', async () => {
    await withReducedMotion();
    const { useReducedMotion } = await import('../../internal/useReducedMotion');
    function Probe() {
      useReducedMotion();
      return null;
    }
    const first = mount(<Probe />);
    await act(async () => {});
    first.unmount();
    const loop = vi.spyOn(Animated, 'loop');
    const { Spinner } = await import('../Spinner');
    const { DotsLoader } = await import('../DotsLoader');
    const view = mount(
      <>
        <DotsLoader />
        <Spinner />
      </>,
    );
    // DotsLoader runs none; Spinner keeps one, slowed right down (8s), as web
    expect(loop).toHaveBeenCalledTimes(1);
    view.unmount();
  });
});
