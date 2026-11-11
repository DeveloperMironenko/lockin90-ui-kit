// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Nothing is cut off and no word breaks: SegmentedTabs measures every label and word on one unconstrained
   line (a hidden measurer) and, from the track's width, shrinks a `fill` label (to 80 %) or stacks the
   segments; a Select is at least its widest word wide; a FitText (MetricTile, ListRow, Alert, FormField,
   Eyebrow) shrinks until its widest word fits. (The large-text rule is in LargeText.test.tsx: it
   needs Dimensions.) */
import { act } from 'react';
import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { segmentFit, SegmentedTabs, stackedScales } from '../SegmentedTabs';
import { Select } from '../Select';
import { FitText, textOf } from '../FitText';
import { breakableWords, taggedWords, wordFitScale } from '../../internal/wordFit';
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

describe('breakableWords / wordFitScale', () => {
  test('a line breaks at spaces, after a hyphen and around CJK characters; a no-break space joins', () => {
    expect(breakableWords('Run onboarding again')).toEqual(['Run', 'onboarding', 'again']);
    expect(breakableWords('Health-Connect')).toEqual(['Health-', 'Connect']);
    expect(breakableWords('72 kg')).toEqual(['72 kg']);
    expect(breakableWords('体重 kg')).toEqual(['体', '重', 'kg']);
    expect(breakableWords('  ')).toEqual([]);
  });
  test('a word that fits keeps the size; a wider one shrinks to fit, down to the floor', () => {
    expect(wordFitScale(100, 120, 0.5)).toBe(1);
    expect(wordFitScale(120, 100, 0.5)).toBe(0.82);
    expect(wordFitScale(400, 100, 0.5)).toBe(0.5);
    expect(wordFitScale(0, 100, 0.5)).toBe(1);
  });
});

describe('FitText: a word never splits', () => {
  const shown = (host: Element) => host.firstElementChild!;
  const fontSize = (host: Element) => JSON.stringify(propOf(shown(host), 'style'));
  const measureWords = (host: Element, perChar: number) => {
    for (const probe of Array.from(host.querySelectorAll('[data-testid="lk-fit-measure"] > div')))
      layout(probe, (probe.textContent ?? '').length * perChar);
  };
  test('a text whose widest word fits its width is drawn as given', () => {
    const { host, unmount } = mount(<FitText style={{ fontSize: 20, lineHeight: 24 }}>Run onboarding again</FitText>);
    layout(shown(host), 300);
    measureWords(host, 10); // "onboarding" 100 in 300
    expect(fontSize(host)).toContain('"fontSize":"20px"');
    unmount();
  });
  test('a word wider than the width shrinks the whole text (size, line height, letter spacing)', () => {
    const { host, unmount } = mount(
      <FitText style={{ fontSize: 20, lineHeight: 24, letterSpacing: -0.4 }}>Your physiological profile</FitText>,
    );
    layout(shown(host), 100);
    measureWords(host, 10); // "physiological" 130 in 100 → 0.76
    const style = fontSize(host);
    expect(style).toContain('"fontSize":"15.2px"');
    expect(style).toContain('"lineHeight":"18.24px"');
    unmount();
  });
  test('no further than minScale', () => {
    const { host, unmount } = mount(<FitText minScale={0.8} style={{ fontSize: 20 }}>Нейтральный</FitText>);
    layout(shown(host), 50);
    measureWords(host, 10);
    expect(fontSize(host)).toContain('"fontSize":"16px"');
    unmount();
  });
});

describe('FitText: a text as wide as its content', () => {
  test('a single word exactly as wide as its text keeps its size', () => {
    const { host, unmount } = mount(<FitText style={{ fontSize: 11 }}>ПАРОЛЬ</FitText>);
    layout(host.firstElementChild!, 60);
    for (const probe of Array.from(host.querySelectorAll('[data-testid="lk-fit-measure"] > div'))) layout(probe, 60);
    expect(JSON.stringify(propOf(host.firstElementChild!, 'style'))).toContain('"fontSize":"11px"');
    unmount();
  });
  test('once shrunk, its own narrower width never shrinks it further', () => {
    const { host, unmount } = mount(<FitText style={{ fontSize: 20 }}>Налаштування</FitText>);
    const text = host.firstElementChild!;
    layout(text, 100);
    for (const probe of Array.from(host.querySelectorAll('[data-testid="lk-fit-measure"] > div'))) layout(probe, 120);
    expect(JSON.stringify(propOf(text, 'style'))).toContain('"fontSize":"16.4px"'); // (100 − 1) / 120 → 0.82
    layout(text, 98); // drawn at 0.82 it is narrower: ignored
    expect(JSON.stringify(propOf(text, 'style'))).toContain('"fontSize":"16.4px"');
    unmount();
  });
});

describe('SegmentedTabs: inline with a field', () => {
  test('the md track is a field\'s 44 tall; each segment fills it and reaches 44 with its hit slop', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" fill tabs={['Male', 'Female']} />);
    layout(track(host), 300);
    measureAll(host, 7);
    const trackStyle = JSON.stringify(propOf(track(host), 'style'));
    expect(trackStyle).toContain('"minHeight":44');
    expect(trackStyle).not.toContain('"padding":4');
    const radio = host.querySelector('[role="radio"]')!;
    expect(JSON.stringify(propOf(radio, 'style'))).toContain('{"minHeight":42}');
    expect(propOf(radio, 'hitSlop')).toEqual({ top: 1, bottom: 1 });
    unmount();
  });
});

describe('styled parts are measured at bold', () => {
  test('a tagged part of a translation, and a nested element, are bold words', () => {
    expect(taggedWords('Sent to <email>a@b.c</email>.')).toEqual([
      { word: 'Sent', bold: false },
      { word: 'to', bold: false },
      { word: 'a@b.c', bold: true },
      { word: '.', bold: false },
    ]);
    expect(textOf(['Need ', <Text key="b" style={{ fontWeight: '600' }}>Re-authentication</Text>, ' now'])).toBe('Need <n>Re-authentication</n> now');
  });
  test('the words of a sentence nested in a Text: the styled part bold, the rest regular', () => {
    const children = (
      <Text>
        <Text style={{ fontWeight: '600' }}>Re-authentication</Text> required
      </Text>
    );
    // the alert's body is one Text holding the sentence; inside it, the bold part
    expect(taggedWords(textOf(children))).toEqual([
      { word: 'Re-', bold: true },
      { word: 'authentication', bold: true },
      { word: 'required', bold: false },
    ]);
  });
});
