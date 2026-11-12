// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Nothing is cut off and no word breaks: SegmentedTabs measures every label and word on one unconstrained
   line (a hidden measurer) and, from the track's width, puts the segments on balanced rows when a label
   doesn't fit one row; a
   Select is at least its widest word wide; a FitText (MetricTile, ListRow, Alert, FormField, Eyebrow)
   keeps the default text size at the default text size. (Shrinking at a larger OS text size is in
   WordFit.test.tsx, the large-text rule in LargeText.test.tsx: both need the text size set.) */
import { act } from 'react';
import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { segmentRows, SegmentedTabs } from '../SegmentedTabs';
import { Select } from '../Select';
import { FitText, textOf } from '../FitText';
import { breakableAddress, breakableWords, fitFloor, taggedWords, wordFitScale } from '../../internal/wordFit';
import { mount, propOf } from './dom';

const layout = (el: Element, width: number) =>
  act(() => {
    (propOf(el, 'onLayout') as (e: unknown) => void)({ nativeEvent: { layout: { width, height: 40, x: 0, y: 0 } } });
  });

const track = (host: Element) => host.querySelector('[role="radiogroup"], [role="tablist"]')!;
const onRows = (host: Element) => JSON.stringify(propOf(track(host), 'style')).includes('"flexDirection":"column"');
const isHidden = (host: Element) => JSON.stringify(propOf(track(host), 'style')).includes('"opacity":0');
/** Lays every measurer probe out at `perChar` points per character (a space included). */
const measureAll = (host: Element, perChar: number) => {
  for (const probe of Array.from(host.querySelectorAll('[data-testid="lk-seg-measure"] > div'))) {
    layout(probe, (probe.textContent ?? '').length * perChar);
  }
};
const shownLabel = (host: Element, text: string) =>
  Array.from(host.querySelectorAll('[role="radio"] div, [role="tab"] div')).filter((d) => d.textContent === text).pop()!;

describe('segmentRows', () => {
  const w = (full: number, ...words: number[]) => ({ full, words: words.length ? words : [full] });
  const room = (_i: number, segW: number) => segW;
  test('one row when every label fits it on one line; one a little wide shrinks, as far as the floor', () => {
    expect(segmentRows([w(50), w(50)], room, 122, 5, 0.88)).toEqual({ rows: [2], widths: [61], scales: [1, 1], wraps: [false, false] });
    expect(segmentRows([w(66), w(50)], room, 122, 5, 0.88).scales).toEqual([0.9, 1]);
    // no shrink allowed (not `fill` at the default text size): a label 1pt too wide goes to rows
    expect(segmentRows([w(61), w(50)], room, 122, 5, 1).rows).toEqual([1, 1]);
  });
  test('labels that still don\'t fit wrap into balanced rows, the fuller first, a shorter row\'s pills as wide', () => {
    const five = [w(80), w(80), w(80), w(80), w(80)];
    // one row: 60 each; 3 + 2: 100 each (the 2 centred, as wide as the 3)
    expect(segmentRows(five, room, 300, 5, 1)).toEqual({ rows: [3, 2], widths: [100, 100], scales: [1, 1, 1, 1, 1], wraps: [false, false, false, false, false] });
    expect(segmentRows([w(80), w(80), w(80), w(80)], room, 300, 5, 1).rows).toEqual([2, 2]);
    // 160-wide labels: 2 + 2 + 1, never a column of 5
    expect(segmentRows([w(140), w(140), w(140), w(140), w(140)], room, 300, 5, 1).rows).toEqual([2, 2, 1]);
  });
  test('only a label that needs the full width gets a row of its own', () => {
    expect(segmentRows([w(50), w(50), w(200), w(50)], room, 300, 5, 1)).toMatchObject({ rows: [2, 1, 1], widths: [150, 300, 150] });
  });
  test('on rows a label wraps between words onto 2 lines (never on the one row)', () => {
    // "Very active" 40 + 5 + 50 in a 61 room: 2 lines on rows of 2
    const l = segmentRows([w(95, 40, 50), w(30), w(30), w(30)], room, 124, 5, 1);
    expect(l.rows).toEqual([2, 2]);
    expect(l.wraps[0]).toBe(true);
  });
  test('a word wider than the full width at the floor: each label a row, shrunk to the floor (the last resort)', () => {
    expect(segmentRows([w(400), w(20)], room, 100, 5, 0.5)).toEqual({ rows: [1, 1], widths: [100, 100], scales: [0.5, 1], wraps: [true, true] });
  });
  test('large text: labels wrap onto rows at their size; only a label alone on its row shrinks', () => {
    // minScale 1 for rows (no shrink first), 0.5 alone: two 80-wide labels in 150 → 1 + 1 at full size
    expect(segmentRows([w(80), w(80)], room, 150, 5, 1, 0, 0.5)).toMatchObject({ rows: [1, 1], scales: [1, 1] });
    // allowed to shrink (the default text size), the same labels stay on one row
    expect(segmentRows([w(80), w(80)], room, 150, 5, 0.88, 0, 0.88)).toMatchObject({ rows: [2], scales: [0.92, 0.92] });
    // a word wider than the full width, alone on its row, shrinks to fit
    expect(segmentRows([w(200), w(20)], room, 150, 5, 1, 0, 0.5)).toMatchObject({ rows: [1, 1], scales: [0.74, 1] });
  });
  test('an empty label fits anywhere', () => {
    expect(segmentRows([{ full: 0, words: [] }], room, 10, 5, 0.8).rows).toEqual([1]);
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
    expect(onRows(host)).toBe(false);
    unmount();
  });

  test('labels too wide for one row go on balanced rows of pills, the track with a container\'s corners', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" fill tabs={['Sedentary', 'Light', 'Moderate', 'Active', 'Athlete']} />);
    layout(track(host), 300);
    // "Sedentary" 108: × 0.88 (11pt) still wider than a third's 86 room, so its row has 2 (147 wide);
    // "Moderate" 96 × 0.88 fits a third: 2 + 3
    measureAll(host, 12);
    expect(onRows(host)).toBe(true);
    expect(track(host).children).toHaveLength(3); // 2 rows and the measurer
    expect(track(host).children[0]!.querySelectorAll('[role="radio"]')).toHaveLength(2);
    expect(track(host).children[1]!.querySelectorAll('[role="radio"]')).toHaveLength(3);
    expect(JSON.stringify(propOf(track(host), 'style'))).toContain('"borderRadius":16');
    unmount();
  });

  test('at the default text size a fill label slightly too wide shrinks (down to 11pt) and keeps the row', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" fill tabs={['Metric', 'Imperial']} />);
    layout(track(host), 150); // rooms (150 − 2 − 4) / 2 − 12 = 60
    measureAll(host, 8); // "Imperial" 64 → (60 − 1) / 64 → 0.92: 11.5pt
    expect(onRows(host)).toBe(false);
    expect(JSON.stringify(propOf(shownLabel(host, 'Imperial'), 'style'))).toContain('"fontSize":"11.5px"');
    unmount();
  });

  test('not fill: at the default text size a label never shrinks; too wide, the segments go on rows', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" tabs={['Metric', 'Imperial']} />);
    layout(track(host), 150); // rooms (150 − 2 − 4) / 2 − 16 = 56
    measureAll(host, 8);
    expect(onRows(host)).toBe(true);
    expect(JSON.stringify(propOf(shownLabel(host, 'Imperial'), 'style'))).not.toContain('fontSize');
    unmount();
  });

  test('a tint segment\'s hairline (on its pill) takes no room from its label', () => {
    const { host, unmount } = mount(<SegmentedTabs appearance="tint" tabs={['Metric', 'Imperial']} />);
    layout(track(host), 150); // rooms (150 − 2 − 4) / 2 − 16 = 56
    measureAll(host, 6.8); // "Imperial" 54.4: fits 56 less the 1pt slack only without the old 2pt hairline
    expect(onRows(host)).toBe(false);
    unmount();
  });

  test('a zh / ja label is one word: measured whole, drawn with its characters joined', () => {
    const { host, unmount } = mount(<SegmentedTabs kind="choice" tabs={['アスリート', '朝 型']} />);
    const probes = Array.from(host.querySelectorAll('[data-testid="lk-seg-measure"] > div')).map((p) => p.textContent);
    expect(probes).toContain('アスリート');
    expect(probes).not.toContain('ア');
    expect(probes).toContain('朝');
    expect(host.querySelector('[role="radio"]')!.textContent).toBe('ア\u2060ス\u2060リ\u2060ー\u2060ト');
    unmount();
  });

  test('a width change decides again: wider, the row comes back', () => {
    const { host, unmount } = mount(<SegmentedTabs tabs={['Metric', 'Imperial']} />);
    layout(track(host), 120);
    measureAll(host, 10);
    expect(onRows(host)).toBe(true);
    layout(track(host), 400);
    expect(onRows(host)).toBe(false);
    unmount();
  });

  test('an empty label never crashes or puts the segments on rows', () => {
    const { host, unmount } = mount(<SegmentedTabs tabs={['', ' ', 'Rest']} />);
    layout(track(host), 300);
    measureAll(host, 7);
    expect(host.querySelectorAll('[role="tab"]')).toHaveLength(3);
    expect(onRows(host)).toBe(false);
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
    expect(probes.map((p) => p.textContent)).toEqual(['Europe/', 'Kyiv', '·', 'GMT+2']);
    probes.forEach((p) => layout(p, (p.textContent ?? '').length * 20));
    const wrap = host.firstElementChild!;
    // "Europe/" 7 × 20 = 140, + 1 slack + sm chrome 37
    expect(JSON.stringify(propOf(wrap, 'style'))).toContain('"minWidth":"178px"');
    unmount();
  });

  test('a long time zone breaks after its "/": its minimum fits the design\'s 178 picker', () => {
    const label = 'America/Argentina/Buenos_Aires · GMT-3';
    const { host, unmount } = mount(
      <Select size="sm" accessibilityLabel="Timezone" value="ba" options={[{ value: 'ba', label }]} />,
    );
    const probes = Array.from(host.querySelectorAll('[data-testid="lk-select-measure"] > div'));
    expect(probes.map((p) => p.textContent)).toEqual(['America/', 'Argentina/', 'Buenos_Aires', '·', 'GMT-3']);
    // mono 11 ≈ 6.6 a character: "Buenos_Aires" 79.2 → 80 + 1 + 37 = 118 (the whole zone as one word was 236)
    probes.forEach((p) => layout(p, (p.textContent ?? '').length * 6.6));
    expect(JSON.stringify(propOf(host.firstElementChild!, 'style'))).toContain('"minWidth":"118px"');
    unmount();
  });

  test('a leading icon\'s width counts, measured from its ref too (no onLayout on a hidden tree)', () => {
    const { host, unmount } = mount(
      <Select size="sm" accessibilityLabel="Language" value="en" leading={<Text>G</Text>} options={[{ value: 'en', label: 'English' }]} />,
    );
    const probes = Array.from(host.querySelectorAll('[data-testid="lk-select-measure"] > div'));
    probes.forEach((p) => layout(p, 50));
    const lead = Array.from(host.querySelectorAll('div')).find((d) => d.textContent === 'G' && d.children.length === 1)!;
    layout(lead, 14);
    // 50 + 1 + 37 + 14 + the 5 gap
    expect(JSON.stringify(propOf(host.firstElementChild!, 'style'))).toContain('"minWidth":"107px"');
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
  test('as iOS breaks: after a slash (not between digits), not after a hyphen before a digit, CJK punctuation stays', () => {
    expect(breakableWords('Europe/Kyiv')).toEqual(['Europe/', 'Kyiv']);
    expect(breakableWords('12/31')).toEqual(['12/31']);
    expect(breakableWords('GMT-3')).toEqual(['GMT-3']);
    expect(breakableWords('Port-au-Prince')).toEqual(['Port-', 'au-', 'Prince']);
    expect(breakableWords('体重。')).toEqual(['体', '重。']);
    // a word joiner between CJK characters keeps them together (a link in ja / zh)
    expect(breakableWords('利\u2060用')).toEqual(['利\u2060用']);
    // …and a space between word joiners (a link kept on one line)
    expect(breakableWords('see T\u2060e\u2060r\u2060m\u2060s\u2060 \u2060o\u2060f')).toEqual(['see', 'T\u2060e\u2060r\u2060m\u2060s\u2060 \u2060o\u2060f']);
  });
  test('an email or web address breaks after "@" and "."', () => {
    expect(breakableWords('Sent to user.name@mail.example.org.')).toEqual(['Sent', 'to', 'user.', 'name@', 'mail.', 'example.', 'org.']);
    expect(breakableWords('see www.lockin90.app')).toEqual(['see', 'www.', 'lockin90.', 'app']);
    // not a sentence's full stop between words
    expect(breakableWords('Done.Next')).toEqual(['Done.Next']);
    expect(breakableAddress('a.b@c.io')).toBe('a.\u200bb@\u200bc.\u200bio');
    expect(breakableWords(breakableAddress('a.b@c.io'))).toEqual(['a.', 'b@', 'c.', 'io']);
  });
  test('the floor: never below the default text size, never under 11pt', () => {
    expect(fitFloor(20, 1)).toBe(1); // the default size: nothing shrinks
    expect(fitFloor(20, 0.85)).toBe(1); // a smaller text size: nothing either
    expect(fitFloor(20, 2)).toBe(0.5); // twice the size: back to the default one
    expect(fitFloor(12.5, 1.2)).toBe(0.84); // 1 / 1.2 (12.5 × 1.2 × 0.84 = 12.6pt)
    expect(fitFloor(11, 3)).toBe(0.34); // AX: 11pt, the default size and the minimum alike
    expect(fitFloor(11, 1.2)).toBe(0.84); // 11 × 1.2 × 0.84 = 11.1pt
    expect(fitFloor(14, 3.57)).toBe(0.29); // 14 × 3.57 × 0.29 ≈ 14.5pt, never under the default 14
    // SegmentedTabs `fill` choice rows: at the default text size down to 11pt drawn; larger, the same rule
    expect(fitFloor(12.5, 1, true)).toBe(0.88); // 12.5 × 0.88 = 11pt
    expect(fitFloor(12.5, 0.85, true)).toBe(1); // 12.5 × 0.85 is already under 11: no shrink
    expect(fitFloor(12.5, 1.2, true)).toBe(0.84); // as without: 1 / 1.2
    expect(fitFloor(12.5, 3, true)).toBe(0.34);
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
  test('at the default text size a word wider than the width never shrinks the text below it', () => {
    const { host, unmount } = mount(
      <FitText style={{ fontSize: 20, lineHeight: 24, letterSpacing: -0.4 }}>Your physiological profile</FitText>,
    );
    layout(shown(host), 100);
    measureWords(host, 10); // "physiological" 130 in 100: the layout's to fix (FitText's minWidth says so)
    expect(fontSize(host)).toContain('"fontSize":"20px"');
    unmount();
  });
  test('it reports the narrowest width its words fit whole in', () => {
    const widths: number[] = [];
    const { host, unmount } = mount(
      <FitText style={{ fontSize: 20 }} onMinWidth={(w) => widths.push(w)}>Your physiological profile</FitText>,
    );
    measureWords(host, 10);
    expect(widths.pop()).toBe(131); // "physiological" 130 + 1
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
    expect(taggedWords('Sent to <email>ab</email>.')).toEqual([
      { word: 'Sent', bold: false },
      { word: 'to', bold: false },
      // no space after the tag: "ab." is one piece, measured at bold
      { word: 'ab.', bold: true },
    ]);
    // an address breaks after "@" and ".", the full stop after it stays with its last part
    expect(taggedWords('Sent to <email>a@b.c</email>.')).toEqual([
      { word: 'Sent', bold: false },
      { word: 'to', bold: false },
      { word: 'a@', bold: true, address: true },
      { word: 'b.', bold: true, address: true },
      { word: 'c.', bold: true, address: true },
    ]);
    // …with the zero-width spaces `breakableAddress` puts in, too
    expect(taggedWords(`To <email>${breakableAddress('a@b.c')}</email>`).map((w) => w.address)).toEqual([undefined, true, true, true]);
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
