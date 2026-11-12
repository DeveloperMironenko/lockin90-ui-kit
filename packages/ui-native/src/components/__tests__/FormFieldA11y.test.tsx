// @vitest-environment happy-dom
/// <reference lib="dom" />
/* FormField (native): the label names the control, the error / help is its hint, a new error is announced. */
import { AccessibilityInfo, Platform } from 'react-native';
import { View as RNView } from 'react-native';
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

  test('an error becomes the control\'s hint and is announced once; the visible texts are not read again', () => {
    const os = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true });
    const announce = vi.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    const { host, rerender, unmount } = mount(
      <FormField label="Email">
        <Input />
      </FormField>,
    );
    rerender(
      <FormField label="Email" error="Enter your email">
        <Input />
      </FormField>,
    );
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith('Enter your email');
    expect(propOf(host.querySelector('input')!, 'accessibilityHint')).toBe('Enter your email');
    // one announcement (U20): no live region on top of it, and the label / error texts are hidden
    expect(host.querySelector('[aria-live="polite"]')).toBeNull();
    const hidden = Array.from(host.querySelectorAll('[aria-hidden="true"]')).map((el) => el.textContent);
    expect(hidden).toContain('Enter your email');
    // the label (FitText draws it and its hidden measuring copy)
    expect(hidden.some((t) => t?.startsWith('EMAIL'))).toBe(true);
    unmount();
    Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
  });

  test('several children: the texts stay readable and the error is a live region', () => {
    const { host, rerender, unmount } = mount(
      <FormField label="Height">
        <Input />
        <Input />
      </FormField>,
    );
    rerender(
      <FormField label="Height" error="Enter your height">
        <Input />
        <Input />
      </FormField>,
    );
    expect(host.querySelector('[aria-live="polite"]')?.textContent).toBe('Enter your height');
    unmount();
  });

  test('a node help (a View) is laid out on its own, not inside the help Text (V6)', () => {
    const { host, unmount } = mount(
      <FormField label="Height" help={<RNView testID="hint-node" />}>
        <Input />
      </FormField>,
    );
    const node = host.querySelector('[data-testid="hint-node"]')!;
    // no ancestor is a Text (react-native-web draws Text as a div with dir="auto")
    let p: Element | null = node.parentElement;
    let inText = false;
    for (; p && p !== host; p = p.parentElement) if (p.getAttribute('dir') === 'auto') inText = true;
    expect(inText).toBe(false);
    unmount();
  });

  test('an error already there on mount is not announced', () => {
    const os = Platform.OS;
    const announce = vi.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true });
    const a = mount(
      <FormField label="Email" error="Enter your email">
        <Input />
      </FormField>,
    );
    expect(announce).not.toHaveBeenCalled();
    a.unmount();
    Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
  });

  test('going from one child to several keeps the control mounted', () => {
    const { host, rerender, unmount } = mount(
      <FormField label="Email">
        <Input />
      </FormField>,
    );
    const input = host.querySelector('input');
    rerender(
      <FormField label="Email">
        <Input />
        <Input />
      </FormField>,
    );
    expect(host.querySelector('input')).toBe(input);
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
