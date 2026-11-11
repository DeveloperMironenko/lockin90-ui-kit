// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Nothing is cut off and no word breaks: SegmentedTabs measures every label and word on one unconstrained
   line (a hidden measurer) and, from the track's width, shrinks a `fill` label (to 80 %) or stacks the
   segments; a Select is at least its widest word wide. (The large-text rule is in LargeText.test.tsx: it
   needs Dimensions.) */
import { act } from 'react';
import { describe, expect, test } from 'vitest';
import { segmentFit, SegmentedTabs, stackedScales } from '../SegmentedTabs';
import { Select } from '../Select';
import { mount, propOf } from './dom';

const layout = (el: Element, width: number) =>
  act(() => {
    (propOf(el, 'onLayout') as (e: unknown) => void)({ nativeEvent: { layout: { width, height: 40, x: 0, y: 0 } } });
  });

const track = (host: Element) => host.querySelector('[role="radiogroup"], [role="tablist"]')!;
const isStacked = (host: Element) => JSON.stringify(propOf(track(host), 'style')).includes('"flexDirection":"column"');
const isHidden = (host: Element) => JSON.stringify(propOf(track(host), 'style')).includes('"opacity":0');
/** Lays every measurer probe out at `perChar` points per character (a space included). */
const measureAll = (host: Element, perChar: number) => {
  for (const probe of Array.from(host.querySelectorAll('[data-testid="lk-seg-measure"] > div'))) {
    layout(probe, (probe.textContent ?? '').length * perChar);
  }
};
const shownLabel = (host: Element, text: string) =>
  Array.from(host.querySelectorAll('[role="radio"] div, [role="tab"] div')).filter((d) => d.textContent === text).pop()!;

describe('segmentFit', () => {
  const w = (full: number, ...words: number[]) => ({ full, words });
  test('a label that fits keeps its size; one a little wide shrinks; a word wider than its room stacks', () => {
    expect(segmentFit([w(50, 50)], [60], 5, 0.8)).toEqual({ stacked: false, scales: [1] });
    expect(segmentFit([w(66, 66)], [61], 5, 0.8)).toEqual({ stacked: false, scales: [0.9] });
    expect(segmentFit([w(90, 90)], [61], 5, 0.8).stacked).toBe(true);
    // no shrink allowed (not `fill`): a word 1pt too wide stacks
    expect(segmentFit([w(61, 61)], [61], 5, 1).stacked).toBe(true);
  });
  test('several words wrap between them onto at most 2 lines', () => {
    // "Very active": 40 + 5 + 50, room 61 → two lines at 0.8, fine
    expect(segmentFit([w(95, 40, 50)], [61], 5, 0.8)).toEqual({ stacked: false, scales: [0.8] });
    // three words, each on its own line → stacks
    expect(segmentFit([w(160, 50, 50, 50)], [61], 5, 0.8).stacked).toBe(true);
  });
  test('an empty label never stacks', () => {
    expect(segmentFit([w(0)], [10], 5, 0.8)).toEqual({ stacked: false, scales: [1] });
  });
});

describe('stackedScales', () => {
  test('a stacked label keeps its size unless its widest word is wider than the segment; then it shrinks', () => {
    expect(stackedScales([{ full: 95, words: [40, 50] }], [60])).toEqual([1]);
    // "Другой" 140 in a 130 column → 0.92
    expect(stackedScales([{ full: 140, words: [140] }], [130])).toEqual([0.92]);
    expect(stackedScales([{ full: 400, words: [400] }], [100])).toEqual([0.5]);
    expect(stackedScales([{ full: 0, words: [] }], [100])).toEqual([1]);
  });
});

describe('SegmentedTabs: nothing cut off', () => {
  test('hidden until measured, then the row when every word fits', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" fill tabs={['Metric', 'Imperial']} />);
    expect(isHidden(host)).toBe(true);
    layout(track(host), 300);
    expect(isHidden(host)).toBe(true); // the track's width alone is not enough
    measureAll(host, 7);
    expect(isHidden(host)).toBe(false);
    expect(isStacked(host)).toBe(false);
    unmount();
  });

  test('a word wider than its segment stacks the segments, the track with a container\'s corners', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" fill tabs={['Sedentary', 'Light', 'Moderate', 'Active', 'Athlete']} />);
    layout(track(host), 300);
    measureAll(host, 12); // "Sedentary" 108 in a ~49 room
    expect(isStacked(host)).toBe(true);
    expect(JSON.stringify(propOf(track(host), 'style'))).toContain('"borderRadius":16');
    unmount();
  });

  test('a fill label slightly too wide shrinks instead (one line, smaller font)', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" fill tabs={['Metric', 'Imperial']} />);
    layout(track(host), 150); // rooms (150 − 10 − 4) / 2 − 8 = 60
    measureAll(host, 8); // "Imperial" 64 → 0.92
    expect(isStacked(host)).toBe(false);
    expect(JSON.stringify(propOf(shownLabel(host, 'Imperial'), 'style'))).toContain('"fontSize":"11.5px"');
    unmount();
  });

  test('a width change decides again: wider, the row comes back', () => {
    const { host, unmount } = mount(<SegmentedTabs tabs={['Metric', 'Imperial']} />);
    layout(track(host), 120);
    measureAll(host, 10);
    expect(isStacked(host)).toBe(true);
    layout(track(host), 400);
    expect(isStacked(host)).toBe(false);
    unmount();
  });

  test('an empty label never crashes or stacks', () => {
    const { host, unmount } = mount(<SegmentedTabs tabs={['', ' ', 'Rest']} />);
    layout(track(host), 300);
    measureAll(host, 7);
    expect(host.querySelectorAll('[role="tab"]')).toHaveLength(3);
    expect(isStacked(host)).toBe(false);
    unmount();
  });

  test('sm hugs its labels: no measurer, never hidden', () => {
    const { host, unmount } = mount(<SegmentedTabs size="sm" tabs={['Metric', 'Imperial']} />);
    expect(host.querySelector('[data-testid="lk-seg-measure"]')).toBeNull();
    expect(isHidden(host)).toBe(false);
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

describe('Select: a word never breaks', () => {
  test('the select is at least its widest word plus the chrome wide', () => {
    const { host, unmount } = mount(
      <Select size="sm" accessibilityLabel="Timezone" value="kyiv" options={[{ value: 'kyiv', label: 'Europe/Kyiv · GMT+2' }]} />,
    );
    const probes = Array.from(host.querySelectorAll('[data-testid="lk-select-measure"] > div'));
    expect(probes.map((p) => p.textContent)).toEqual(['Europe/Kyiv', '·', 'GMT+2']);
    probes.forEach((p) => layout(p, (p.textContent ?? '').length * 20));
    const wrap = host.firstElementChild!;
    // 11 × 20 = 220, + 1 slack + sm chrome 37
    expect(JSON.stringify(propOf(wrap, 'style'))).toContain('"minWidth":"258px"');
    unmount();
  });
});
