// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Nothing is cut off at the largest text size: a SegmentedTabs label that can't fit its segment even at
   the shrink floor stacks the segments (full width, no ellipsis); a Select value wraps. */
import { act } from 'react';
import { describe, expect, test } from 'vitest';
import { SegmentedTabs } from '../SegmentedTabs';
import { Select } from '../Select';
import { mount, propOf } from './dom';

const layout = (el: Element, width: number) =>
  act(() => {
    (propOf(el, 'onLayout') as (e: unknown) => void)({ nativeEvent: { layout: { width, height: 40, x: 0, y: 0 } } });
  });

describe('SegmentedTabs at a large text size', () => {
  test('a word wider than its segment at the floor stacks the segments; labels lose the one-line clamp', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" tabs={['Metric', 'Imperial']} />);
    const track = host.querySelector('[role="radiogroup"]')!;
    layout(track, 200);
    // the hidden measurers: "Imperial" is 240 wide at this text size (more than twice a ~80 segment)
    const measurers = Array.from(track.children).filter((c) => !c.getAttribute('role'));
    layout(measurers[0], 60);
    layout(measurers[1], 240);
    expect(JSON.stringify(propOf(track, 'style'))).toContain('"flexDirection":"column"');
    const label = Array.from(host.querySelectorAll('[role="radio"] div')).find((d) => d.textContent === 'Imperial')!;
    expect(propOf(label, 'numberOfLines')).toBeUndefined();
    unmount();
  });

  test('labels that fit keep the row', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" tabs={['Metric', 'Imperial']} />);
    const track = host.querySelector('[role="radiogroup"]')!;
    layout(track, 300);
    const measurers = Array.from(track.children).filter((c) => !c.getAttribute('role'));
    layout(measurers[0], 50);
    layout(measurers[1], 60);
    expect(JSON.stringify(propOf(track, 'style'))).not.toContain('"flexDirection":"column"');
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
