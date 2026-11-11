// @vitest-environment happy-dom
/// <reference lib="dom" />
/* ListRow pref / action (native): under 300pt wide the control drops under the text (the full row,
   start-aligned), as web's container query; wider rows keep it on the right. */
import { act } from 'react';
import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { ListRow } from '../ListRow';
import { mount, propOf } from './dom';
import { classesFor } from './markup';

const layout = (el: Element, width: number) =>
  act(() => {
    (propOf(el, 'onLayout') as (e: unknown) => void)({ nativeEvent: { layout: { width, height: 60, x: 0, y: 0 } } });
  });

function trailingStacked(host: Element) {
  // the outermost element holding only the control is its trailing slot
  const wrapper = Array.from(host.querySelectorAll('div')).find((d) => d.textContent === 'Kyiv (UTC+2)')!;
  const full = new Set(classesFor('flex-basis:100%'));
  return Array.from(wrapper.classList as unknown as ArrayLike<string>).some((c) => full.has(c));
}

describe('ListRow narrow settings row', () => {
  test.each([
    [280, true],
    [340, false],
  ])('at %ipt the control is under the text: %s', (width, stacked) => {
    const { host, unmount } = mount(
      <ListRow variant="pref" title="Часовий пояс" subtitle="Для нагадувань" trailing={<Text>Kyiv (UTC+2)</Text>} />,
    );
    layout(host.firstElementChild!, width);
    expect(trailingStacked(host)).toBe(stacked);
    unmount();
  });
});
