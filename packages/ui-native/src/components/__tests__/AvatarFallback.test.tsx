// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Avatar (V1 / V16): the initials never use adjustsFontSizeToFit (on iOS's new architecture it dropped the
   display font for a serif); a photo that fails to load shows the initials. */
import { act } from 'react';
import { describe, expect, test } from 'vitest';
import { Avatar } from '../Avatar';
import { mount, propOf } from './dom';
import { classesFor } from './markup';

describe('Avatar', () => {
  test('initials in the display font, without adjustsFontSizeToFit', () => {
    const view = mount(<Avatar name="Ada Lovelace" size={137} />);
    const text = Array.from(view.host.querySelectorAll('div')).find((d) => d.textContent === 'AL' && d.children.length === 0)!;
    expect(propOf(text, 'adjustsFontSizeToFit')).toBeUndefined();
    const display = new Set(classesFor('Space Grotesk'));
    expect(Array.from(text.classList as unknown as ArrayLike<string>).some((c) => display.has(c))).toBe(true);
    view.unmount();
  });

  test('a photo that fails falls back to the initials', () => {
    const view = mount(<Avatar name="Ada Lovelace" src="https://x.test/broken.jpg" />);
    const img = view.host.querySelector('img')!;
    const onError = propOf(img, 'onError') as (() => void) | undefined;
    expect(typeof onError).toBe('function');
    expect(view.host.textContent).not.toContain('AL');
    act(() => onError!());
    expect(view.host.textContent).toContain('AL');
    view.unmount();
  });
});
