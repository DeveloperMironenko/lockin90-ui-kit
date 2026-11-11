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

describe('Reduce Motion', () => {
  test('DotsLoader keeps looping, three times slower (a loading indicator slows, still says busy)', async () => {
    await withReducedMotion();
    const { useReducedMotion } = await import('../../internal/useReducedMotion');
    function Probe() {
      useReducedMotion();
      return null;
    }
    const first = mount(<Probe />);
    await act(async () => {});
    first.unmount();
    const timing = vi.spyOn(Animated, 'timing');
    const loop = vi.spyOn(Animated, 'loop');
    const { DotsLoader } = await import('../DotsLoader');
    const view = mount(<DotsLoader count={1} />);
    expect(loop).toHaveBeenCalledTimes(1);
    const durations = timing.mock.calls.map((c) => (c[1] as { duration: number }).duration);
    expect(durations).toEqual([1080, 1440]);
    view.unmount();
  });

  test('Spinner keeps one loop, slowed (2.5s)', async () => {
    await withReducedMotion();
    const { useReducedMotion } = await import('../../internal/useReducedMotion');
    function Probe() {
      useReducedMotion();
      return null;
    }
    const first = mount(<Probe />);
    await act(async () => {});
    first.unmount();
    const timing = vi.spyOn(Animated, 'timing');
    const { Spinner } = await import('../Spinner');
    const view = mount(<Spinner />);
    expect((timing.mock.calls[0][1] as { duration: number }).duration).toBe(2500);
    view.unmount();
  });
});
