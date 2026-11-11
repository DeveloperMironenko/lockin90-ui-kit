// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Input / PasswordInput (native): a tap anywhere on the box focuses the field, and the eye reaches 44pt. */
import { createRef } from 'react';
import type { TextInput } from 'react-native';
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

/* An app moves focus to the next field on Return through the field's ref (the TextInput). */
describe('ref is the TextInput', () => {
  test.each([
    ['Input', Input],
    ['PasswordInput', PasswordInput],
  ] as const)('%s: ref.current.focus() focuses the field', (_name, Field) => {
    const ref = createRef<TextInput>();
    const { host, unmount } = mount(<Field ref={ref} />);
    expect(typeof ref.current?.focus).toBe('function');
    ref.current!.focus();
    expect(document.activeElement).toBe(host.querySelector('input'));
    unmount();
  });
});
