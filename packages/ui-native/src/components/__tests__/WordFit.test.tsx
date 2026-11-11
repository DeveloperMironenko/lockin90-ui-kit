// @vitest-environment happy-dom
/// <reference lib="dom" />
/* The word fit at a larger OS text size (react-native-web's text size is fixed at 1, so it is set here):
   a word wider than its room shrinks the text, never below the default text size or 11pt; the room is
   followed while shrunk (a squeeze shrinks it more, a wider box draws it at full size again); an address
   never shrinks its paragraph; a stacked SegmentedTabs track as wide as its labels doesn't shrink them
   again and again; a MetricTile says how wide it must be for its words to stay whole. */
import { act } from 'react';
import { Text } from 'react-native';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { FitText } from '../FitText';
import { MetricTile } from '../MetricTile';
import { SegmentedTabs } from '../SegmentedTabs';
import { mount, propOf } from './dom';

const dims = vi.hoisted(() => ({ fontScale: 1 }));
vi.mock('react-native', async (orig) => {
  const rn = await orig<typeof import('react-native')>();
  return { ...rn, useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: dims.fontScale }) };
});
afterEach(() => {
  dims.fontScale = 1;
});

const layout = (el: Element, width: number) =>
  act(() => {
    (propOf(el, 'onLayout') as (e: unknown) => void)({ nativeEvent: { layout: { width, height: 40, x: 0, y: 0 } } });
  });
const probes = (host: Element, id = 'lk-fit-measure') => Array.from(host.querySelectorAll(`[data-testid="${id}"] > div`));
/** Lays every probe out at `perChar` points a character. */
const measure = (host: Element, perChar: number, id?: string) => {
  for (const p of probes(host, id)) layout(p, (p.textContent ?? '').length * perChar);
};
const style = (el: Element) => JSON.stringify(propOf(el, 'style'));
const box = (host: Element) => host.querySelector('[data-testid="lk-fit-box"]')!;

describe('FitText at a larger text size', () => {
  test('a word wider than the width shrinks the whole text (size, line height, letter spacing)', () => {
    dims.fontScale = 2;
    const { host, unmount } = mount(
      <FitText style={{ fontSize: 20, lineHeight: 24, letterSpacing: -0.4 }}>Your physiological profile</FitText>,
    );
    layout(host.firstElementChild!, 100);
    measure(host, 10); // "physiological" 130 in 100 → 0.76
    expect(style(host.firstElementChild!)).toContain('"fontSize":"15.2px"');
    expect(style(host.firstElementChild!)).toContain('"lineHeight":"18.24px"');
    unmount();
  });

  test('never below the default text size: at twice the size, half', () => {
    dims.fontScale = 2;
    const { host, unmount } = mount(<FitText style={{ fontSize: 20 }}>Нейтральный</FitText>);
    layout(host.firstElementChild!, 50);
    measure(host, 20); // 220 in 50 would want 0.22
    expect(style(host.firstElementChild!)).toContain('"fontSize":"10px"'); // 10 × 2 = the default 20
    unmount();
  });

  test('never under 11pt: an 11 label at 1.2 stops at 0.84', () => {
    dims.fontScale = 1.2;
    const { host, unmount } = mount(<FitText style={{ fontSize: 11 }}>ФИЗИОЛОГИЧЕСКИЙ</FitText>);
    layout(host.firstElementChild!, 60);
    measure(host, 8);
    expect(style(host.firstElementChild!)).toContain('"fontSize":"9.24px"'); // 9.24 × 1.2 = 11.1pt
    unmount();
  });
});

describe('FitText follows its room while shrunk', () => {
  const mountShrunk = () => {
    dims.fontScale = 2;
    const view = mount(<FitText style={{ fontSize: 20 }}>Налаштування</FitText>);
    const text = view.host.firstElementChild!;
    layout(box(view.host), 300);
    layout(text, 100);
    for (const p of probes(view.host)) layout(p, 120);
    expect(style(text)).toContain('"fontSize":"16.4px"'); // (100 − 1) / 120 → 0.82
    return { ...view, text };
  };

  test('its own width as wide as its shrunk word never shrinks it further', () => {
    const { text, unmount } = mountShrunk();
    layout(text, 98.5); // drawn at 0.82, as wide as its content (98.4): not a new room
    expect(style(text)).toContain('"fontSize":"16.4px"');
    unmount();
  });

  test('squeezed narrower than its shrunk word, it shrinks to the new width', () => {
    const { text, unmount } = mountShrunk();
    layout(text, 80); // the row got narrower: 79 / 120 → 0.65
    expect(style(text)).toContain('"fontSize":"13px"');
    unmount();
  });

  test('a wider box draws it at full size again and reads the room afresh', () => {
    const { host, text, unmount } = mountShrunk();
    layout(box(host), 400); // the screen turned: the box the text sits in is wider
    expect(style(text)).toBe('{"fontSize":"20px"}'); // full size, unscaled
    layout(text, 200); // the full-size text's room now
    for (const p of probes(host)) layout(p, 120);
    expect(style(text)).toBe('{"fontSize":"20px"}');
    unmount();
  });
});

describe('an address never shrinks its paragraph', () => {
  test('a long email in a narrow line: the sentence keeps its size', () => {
    dims.fontScale = 3;
    const { host, unmount } = mount(
      <FitText style={{ fontSize: 14 }} measureText="We sent a code to <email>mykola.myronenko.usa@gmail.com</email>.">
        We sent a code to <Text style={{ fontWeight: '600' }}>mykola.myronenko.usa@gmail.com</Text>.
      </FitText>,
    );
    // only the sentence's words are measured: none of the address's pieces
    expect(probes(host).map((p) => p.textContent)).toEqual(['We', 'sent', 'a', 'code', 'to']);
    layout(host.firstElementChild!, 120);
    measure(host, 25); // "code" 100 fits 120
    expect(style(host.firstElementChild!)).toBe('{"fontSize":"14px"}');
    unmount();
  });
});

describe('SegmentedTabs stacked in a parent that does not stretch it', () => {
  test('the stacked track stretches, and its own narrower width while shrunk never shrinks it again', () => {
    dims.fontScale = 2;
    const { host, unmount } = mount(<SegmentedTabs kind="choice" tabs={['Нейтральный', 'Да']} />);
    const track = host.querySelector('[role="radiogroup"]')!;
    layout(track, 100);
    measure(host, 12, 'lk-seg-measure'); // "Нейтральный" 132 in 100 − 6 − 16 = 78 → (78 − 1) / 132 → 0.58
    expect(style(track)).toContain('"flexDirection":"column"');
    expect(style(track)).toContain('"alignSelf":"stretch"');
    const label = () => Array.from(host.querySelectorAll('[role="radio"] div')).filter((d) => d.textContent === 'Нейтральный').pop()!;
    expect(style(label())).toContain('"fontSize":"6.38px"');
    layout(track, 84); // as wide as its shrunk label: ignored
    expect(style(label())).toContain('"fontSize":"6.38px"');
    unmount();
  });
});

describe('MetricTile says how wide it must be', () => {
  test('its widest word at the default size, plus its padding and edge', () => {
    const widths: number[] = [];
    const { host, unmount } = mount(
      <MetricTile size="sm" label="ФИЗИОЛОГИЧЕСКИЙ ПОЛ" value="Мужской" textValue onMinWidth={(w) => widths.push(w)} />,
    );
    measure(host, 7); // "ФИЗИОЛОГИЧЕСКИЙ" 105, "Мужской" 49
    expect(widths.pop()).toBe(106 + 2 * 11 + 2);
    unmount();
  });
});
