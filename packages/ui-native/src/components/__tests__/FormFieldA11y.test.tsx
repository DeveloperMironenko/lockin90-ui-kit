// @vitest-environment happy-dom
/// <reference lib="dom" />
/* FormField (native): the label names the control, the error / help is its hint, a new error is announced. */
import { AccessibilityInfo } from 'react-native';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { FormField, SearchInput } from '../FormField';
import { Input } from '../Input';
import { mount, propOf, target } from './dom';

afterEach(() => vi.restoreAllMocks());

describe('FormField names and describes its control', () => {
  test('the label (and the required word) name the input; the help is its hint', () => {
    const { host, unmount } = mount(
      <FormField label="Email" required requiredLabel="required" help="We never share it">
        <Input />
      </FormField>,
    );
    const input = host.querySelector('input')!;
    expect(input.getAttribute('aria-label')).toBe('Email, required');
    expect(propOf(input, 'accessibilityHint')).toBe('We never share it');
    unmount();
  });

  test('the control’s own name wins', () => {
    const { host, unmount } = mount(
      <FormField label="Email">
        <Input accessibilityLabel="Work email" />
      </FormField>,
    );
    expect(host.querySelector('input')!.getAttribute('aria-label')).toBe('Work email');
    unmount();
  });

  test('an error becomes the hint, sits in a live region and is announced when it appears', () => {
    const announce = vi.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    const { host, rerender, unmount } = mount(
      <FormField label="Email">
        <Input />
      </FormField>,
    );
    expect(announce).not.toHaveBeenCalled();
    rerender(
      <FormField label="Email" error="Enter your email">
        <Input />
      </FormField>,
    );
    expect(announce).toHaveBeenCalledWith('Enter your email');
    expect(propOf(host.querySelector('input')!, 'accessibilityHint')).toBe('Enter your email');
    expect(host.querySelector('[aria-live="polite"]')?.textContent).toBe('Enter your email');
    unmount();
  });
});

describe('SearchInput clear button', () => {
  test('is named by clearLabel and reaches 44pt', () => {
    const { host, unmount } = mount(<SearchInput value="run" clearLabel="Borrar" />);
    const clear = host.querySelector('[aria-label="Borrar"]')!;
    expect(clear).toBeTruthy();
    expect(target(clear, 20, 20)).toEqual({ width: 44, height: 44 });
    unmount();
  });
});
