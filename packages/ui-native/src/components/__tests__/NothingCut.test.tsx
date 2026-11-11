// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Nothing is cut off: a SegmentedTabs label whose real text layout breaks inside a word or takes more than
   2 lines stacks the segments (full width, no ellipsis); a Select value wraps. (The large-text rule is in
   LargeText.test.tsx: it needs Dimensions.) */
import { act } from 'react';
import { Platform } from 'react-native';
import { describe, expect, test } from 'vitest';
import { labelProblem, SegmentedTabs } from '../SegmentedTabs';
import { Select } from '../Select';
import { mount, propOf } from './dom';

const layout = (el: Element, width: number) =>
  act(() => {
    (propOf(el, 'onLayout') as (e: unknown) => void)({ nativeEvent: { layout: { width, height: 40, x: 0, y: 0 } } });
  });

const tabLabel = (host: Element, text: string) =>
  Array.from(host.querySelectorAll('[role="radio"] div, [role="tab"] div')).filter((d) => d.textContent === text).pop()!;
const isStacked = (host: Element) =>
  JSON.stringify(propOf(host.querySelector('[role="radiogroup"], [role="tablist"]')!, 'style')).includes('"flexDirection":"column"');
const lines = (el: Element, ...texts: string[]) =>
  act(() => {
    (propOf(el, 'onTextLayout') as (e: unknown) => void)({ nativeEvent: { lines: texts.map((text) => ({ text })) } });
  });
const asOs = (os: string, fn: () => void) => {
  const was = Platform.OS;
  Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
  try {
    fn();
  } finally {
    Object.defineProperty(Platform, 'OS', { value: was, configurable: true });
  }
};

describe('labelProblem', () => {
  test('a break inside a word, or more than 2 lines, is a problem; a break at a space is not', () => {
    expect(labelProblem('Imperial', [{ text: 'Imperi' }, { text: 'al' }])).toBe(true);
    expect(labelProblem('Very active', [{ text: 'Very ' }, { text: 'active' }])).toBe(false);
    expect(labelProblem('Lightly active person', [{ text: 'Lightly ' }, { text: 'active ' }, { text: 'person' }])).toBe(true);
    expect(labelProblem('', [])).toBe(false);
    expect(labelProblem('   ', [{ text: '' }, { text: '' }])).toBe(false);
  });
});

describe('SegmentedTabs: nothing cut off', () => {
  test('labels render unclamped, with no hidden measurer', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" tabs={['Metric', 'Imperial']} />);
    expect(propOf(tabLabel(host, 'Imperial'), 'numberOfLines')).toBeUndefined();
    expect(host.querySelector('[data-testid="lk-seg-measure"]')).toBeNull();
    unmount();
  });

  test('a line break inside a word stacks the segments', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" tabs={['Metric', 'Imperial']} />);
    lines(tabLabel(host, 'Metric'), 'Metric');
    lines(tabLabel(host, 'Imperial'), 'Imperi', 'al');
    expect(isStacked(host)).toBe(true);
    expect(propOf(tabLabel(host, 'Imperial'), 'numberOfLines')).toBeUndefined();
    unmount();
  });

  test('Android: a 3-line label stacks; Android never clamps', () => {
    asOs('android', () => {
      const { host, unmount } = mount(<SegmentedTabs tabs={['Lightly active person', 'Rest']} />);
      lines(tabLabel(host, 'Rest'), 'Rest');
      expect(propOf(tabLabel(host, 'Rest'), 'numberOfLines')).toBeUndefined();
      lines(tabLabel(host, 'Lightly active person'), 'Lightly ', 'active ', 'person');
      expect(isStacked(host)).toBe(true);
      unmount();
    });
  });

  test('iOS: a single word that fits gets one line + shrink-to-fit after its pass', () => {
    asOs('ios', () => {
      const { host, unmount } = mount(<SegmentedTabs tabs={['Metric', 'Very active']} />);
      lines(tabLabel(host, 'Metric'), 'Metric');
      lines(tabLabel(host, 'Very active'), 'Very ', 'active');
      expect(isStacked(host)).toBe(false);
      expect(propOf(tabLabel(host, 'Metric'), 'numberOfLines')).toBe(1);
      expect(propOf(tabLabel(host, 'Very active'), 'numberOfLines')).toBeUndefined();
      unmount();
    });
  });

  test('an empty label never crashes or stacks', () => {
    const { host, unmount } = mount(<SegmentedTabs tabs={['', ' ', 'Rest']} />);
    const tabs = host.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveLength(3);
    expect(isStacked(host)).toBe(false);
    unmount();
  });

  test('a width change re-evaluates: the row comes back, then stacks again when it breaks', () => {
    const { host, unmount } = mount(<SegmentedTabs tabs={['Metric', 'Imperial']} />);
    const track = host.querySelector('[role="tablist"]')!;
    layout(track, 200);
    lines(tabLabel(host, 'Imperial'), 'Imperi', 'al');
    expect(isStacked(host)).toBe(true);
    layout(track, 400); // wider: a new key, the row again
    expect(isStacked(host)).toBe(false);
    lines(tabLabel(host, 'Imperial'), 'Imperial');
    expect(isStacked(host)).toBe(false);
    layout(track, 160);
    lines(tabLabel(host, 'Imperial'), 'Impe', 'rial');
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
