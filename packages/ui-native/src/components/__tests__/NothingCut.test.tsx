// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Nothing is cut off at the largest text size: a SegmentedTabs label whose longest word can't fit its room
   even at the shrink floor stacks the segments (full width, no ellipsis); a Select value wraps. */
import { act } from 'react';
import { Platform } from 'react-native';
import { describe, expect, test } from 'vitest';
import { SegmentedTabs } from '../SegmentedTabs';
import { Select } from '../Select';
import { mount, propOf } from './dom';

const layout = (el: Element, width: number) =>
  act(() => {
    (propOf(el, 'onLayout') as (e: unknown) => void)({ nativeEvent: { layout: { width, height: 40, x: 0, y: 0 } } });
  });

const words = (host: Element) => Array.from(host.querySelectorAll('[data-testid="lk-seg-measure"] > div'));
const room = (host: Element, i: number) => host.querySelector(`[data-testid="lk-seg-room-${i}"]`)!;
const label = (host: Element, text: string) =>
  Array.from(host.querySelectorAll('[role="radio"] div, [role="tab"] div')).filter((d) => d.textContent === text).pop()!;
const isStacked = (host: Element) =>
  JSON.stringify(propOf(host.querySelector('[role="radiogroup"], [role="tablist"]')!, 'style')).includes('"flexDirection":"column"');
/** Lay the track, each label's room and each measured word out at the given widths. */
function measure(host: Element, track: number, rooms: number[], wordWidths: number[]) {
  layout(host.querySelector('[role="radiogroup"], [role="tablist"]')!, track);
  rooms.forEach((w, i) => layout(room(host, i), w));
  words(host).forEach((el, k) => layout(el, wordWidths[k]));
}
const asIos = async (fn: () => void | Promise<void>) => {
  const os = Platform.OS;
  Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true });
  try {
    await fn();
  } finally {
    Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
  }
};

describe('SegmentedTabs: nothing cut off', () => {
  test('the measurer is unconstrained (10000 wide, out of the flow)', () => {
    const { host, unmount } = mount(<SegmentedTabs tabs={['Metric', 'Imperial']} />);
    const box = host.querySelector('[data-testid="lk-seg-measure"]')!;
    expect(JSON.stringify(propOf(box, 'style'))).toMatch(/"position":"absolute".*"width":10000/);
    unmount();
  });

  test('a word wider than its room (no shrink on Android / web) stacks the segments, unclamped', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" tabs={['Metric', 'Imperial']} />);
    // before the decision: no one-line clamp (no clamped flash)
    expect(propOf(label(host, 'Imperial'), 'numberOfLines')).toBeUndefined();
    measure(host, 200, [80, 80], [50, 120]);
    expect(isStacked(host)).toBe(true);
    expect(propOf(label(host, 'Imperial'), 'numberOfLines')).toBeUndefined();
    expect(words(host)).toHaveLength(0);
    unmount();
  });

  test('labels that fit keep the row, clamped and shrinking', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" tabs={['Metric', 'Imperial']} />);
    measure(host, 300, [120, 120], [50, 60]);
    expect(isStacked(host)).toBe(false);
    expect(propOf(label(host, 'Imperial'), 'numberOfLines')).toBe(1);
    unmount();
  });

  test('iOS, several words: the longest word at half size decides', async () => {
    await asIos(() => {
      const fits = mount(<SegmentedTabs tabs={['Very active', 'Light']} />);
      // words: Very 40, active 90 (45 at the floor ≤ 60), Light 40
      measure(fits.host, 200, [60, 60], [40, 90, 40]);
      expect(isStacked(fits.host)).toBe(false);
      expect(propOf(label(fits.host, 'Very active'), 'numberOfLines')).toBe(2);
      fits.unmount();
      const tooLong = mount(<SegmentedTabs tabs={['Very active', 'Light']} />);
      measure(tooLong.host, 200, [60, 60], [40, 130, 40]);
      expect(isStacked(tooLong.host)).toBe(true);
      tooLong.unmount();
    });
  });

  test('a tab with a count badge: the room is the label’s own container (the badge already taken out)', () => {
    const { host, unmount } = mount(<SegmentedTabs tabs={[{ label: 'Imperial', count: 12 }, 'Metric']} />);
    const tab = host.querySelector('[role="tab"]')!;
    expect(tab.contains(room(host, 0))).toBe(true);
    expect(room(host, 0).textContent).toBe('Imperial');
    // the segment is wide, but the badge leaves the label 50: the 60 word stacks
    measure(host, 400, [50, 150], [60, 50]);
    expect(isStacked(host)).toBe(true);
    unmount();
  });

  test('new labels drop the decision and measure again', () => {
    const { host, rerender, unmount } = mount(<SegmentedTabs tabs={['A', 'B']} />);
    measure(host, 300, [120, 120], [10, 10]);
    expect(propOf(label(host, 'A'), 'numberOfLines')).toBe(1);
    rerender(<SegmentedTabs tabs={['Metric', 'Imperial']} />);
    expect(words(host)).toHaveLength(2);
    expect(propOf(label(host, 'Imperial'), 'numberOfLines')).toBeUndefined();
    measure(host, 300, [40, 40], [50, 120]);
    expect(isStacked(host)).toBe(true);
    unmount();
  });
});

describe('Select value', () => {
  test('wraps (no one-line clamp): the field grows instead of cutting "UTC…"', () => {
    const { host, unmount } = mount(
      <Select accessibilityLabel="Timezone" value="kyiv" options={[{ value: 'kyiv', label: 'UTC+02:00 Europe/Kyiv' }]} />,
    );
    const value = Array.from(host.querySelectorAll('div')).filter((d) => d.textContent === 'UTC+02:00 Europe/Kyiv').pop()!;
    expect(propOf(value, 'numberOfLines')).toBeUndefined();
    unmount();
  });
});
