// @vitest-environment happy-dom
/// <reference lib="dom" />
/* A narrow phone (≤ breakpoints.narrow, 360): a large-padded Card drops to 16 so an 8-box CodeInput fits a
   320 screen; a Chip's long label wraps instead of overflowing. */
import { act } from 'react';
import { Text } from 'react-native';
import { afterEach, describe, expect, test } from 'vitest';
import { Card } from '../Card';
import { Chip } from '../Chip';
import { mount } from './dom';
import { classesFor } from './markup';

const resize = (width: number) =>
  act(() => {
    // react-native-web's window width is the document element's clientWidth
    Object.defineProperty(document.documentElement, 'clientWidth', { value: width, configurable: true });
    window.dispatchEvent(new Event('resize'));
  });
const has = (el: Element, decl: string) => {
  const set = new Set(classesFor(decl));
  return Array.from(el.classList as unknown as ArrayLike<string>).some((c) => set.has(c));
};

afterEach(() => resize(1024));

describe('Card padLg on a narrow phone', () => {
  test.each([
    [320, 'padding:16px'],
    [402, 'padding:30px'],
  ])('at %i the padding is %s', (width, decl) => {
    resize(width);
    const { host, unmount } = mount(
      <Card padLg>
        <Text>Code</Text>
      </Card>,
    );
    expect(has(host.firstElementChild!, decl)).toBe(true);
    unmount();
  });
});

describe('Chip', () => {
  test('a long label can wrap: the label shrinks and the chip is never wider than its line', () => {
    const { host, unmount } = mount(<Chip label="Paso 2 de 2 · creación de la cuenta" />);
    const chip = host.firstElementChild!;
    const label = Array.from(host.querySelectorAll('div')).filter((d) => d.textContent === 'Paso 2 de 2 · creación de la cuenta').pop()!;
    expect(has(chip, 'max-width:100%')).toBe(true);
    expect(has(label, 'flex-shrink:1')).toBe(true);
    unmount();
  });
});
