// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Input / PasswordInput (native): a tap anywhere on the box focuses the field, and the eye reaches 44pt. */
import { describe, expect, test } from 'vitest';
import { Input } from '../Input';
import { PasswordInput } from '../PasswordInput';
import { click, mount, target } from './dom';

describe('a tap on the field box focuses the input', () => {
  test('Input', () => {
    const { host, unmount } = mount(<Input unit="kg" />);
    click(host.querySelector('input')!.parentElement!);
    expect(document.activeElement).toBe(host.querySelector('input'));
    unmount();
  });

  test('PasswordInput, and its eye is a 44pt target', () => {
    const { host, unmount } = mount(<PasswordInput showLabel="Show" hideLabel="Hide" />);
    click(host.querySelector('input')!.parentElement!);
    expect(document.activeElement).toBe(host.querySelector('input'));
    const eye = host.querySelector('[aria-label="Show"]')!;
    expect(target(eye, 18, 18)).toEqual({ width: 44, height: 44 });
    unmount();
  });
});
