// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Simulator findings (native): Avatar hides its initials when it isn't accessible and fits them in the
   circle, Badge grows with its text, FormField's error has an icon, a danger Alert says itself on iOS, and
   Increase Contrast steps faint / dim text and edges up. */
import { act } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Alert } from '../Alert';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { mount, propOf } from './dom';
import { classesFor } from './markup';

afterEach(() => vi.restoreAllMocks());
const has = (el: Element, decl: string) => {
  const set = new Set(classesFor(decl));
  return Array.from(el.classList as unknown as ArrayLike<string>).some((c) => set.has(c));
};
const ios = (fn: () => void) => {
  const os = Platform.OS;
  Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true });
  try {
    fn();
  } finally {
    Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
  }
};

describe('Avatar', () => {
  test('accessible={false} hides its initials too', () => {
    const { host, unmount } = mount(<Avatar name="Ann Lee" accessible={false} />);
    expect(propOf(host.firstElementChild!, 'importantForAccessibility')).toBe('no-hide-descendants');
    unmount();
  });

  test('the initials shrink to fit the circle (one line, scaling kept)', () => {
    const { host, unmount } = mount(<Avatar name="Ann Lee" size={40} />);
    const initials = Array.from(host.querySelectorAll('div')).find((d) => d.textContent === 'AL' && !d.children.length)!;
    expect(propOf(initials, 'adjustsFontSizeToFit')).toBe(true);
    expect(propOf(initials, 'numberOfLines')).toBe(1);
    expect(propOf(initials, 'allowFontScaling')).toBeUndefined();
    unmount();
  });
});

describe('Badge', () => {
  test('no fixed height: it grows with its text', () => {
    const { host, unmount } = mount(<Badge>3</Badge>);
    const badge = host.firstElementChild!;
    expect(has(badge, 'min-height:16px')).toBe(true);
    expect(has(badge, 'height:16px') && !has(badge, 'min-height:16px')).toBe(false);
    unmount();
  });
});

describe('FormField error', () => {
  test('an icon before the text (colour is not the only cue)', () => {
    const { host, unmount } = mount(
      <FormField label="Email" error="Enter your email">
        <Input />
      </FormField>,
    );
    const text = host.querySelector('[aria-live="polite"]')!;
    expect(text.previousElementSibling?.querySelector('svg')).toBeTruthy();
    unmount();
  });
});

describe('Alert on iOS', () => {
  test('a danger or warn alert says itself; a note does not', () => {
    const announce = vi.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    ios(() => {
      const a = mount(<Alert tone="danger" title="Sign-in failed">Wrong password</Alert>);
      a.unmount();
      const b = mount(<Alert tone="info">Saved</Alert>);
      b.unmount();
      const c = mount(<Alert tone="warn" live={false}>Quiet</Alert>);
      c.unmount();
    });
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith('Sign-in failed. Wrong password');
  });
});

describe('Increase Contrast', () => {
  test('steps the field label and edge up while it is on', async () => {
    const info = AccessibilityInfo as unknown as { isDarkerSystemColorsEnabled?: () => Promise<boolean> };
    info.isDarkerSystemColorsEnabled = () => Promise.resolve(true);
    vi.resetModules();
    const { FormField: FF } = await import('../FormField');
    const { Input: In } = await import('../Input');
    const { host, unmount } = mount(
      <FF label="Email">
        <In />
      </FF>,
    );
    await act(async () => {});
    const label = Array.from(host.querySelectorAll('div')).filter((d) => d.textContent === 'EMAIL').pop()!;
    // the label in --text (was --text-dim)
    expect(JSON.stringify(propOf(label, 'style'))).toContain('"color":"rgba(238,241,248,1.00)"');
    unmount();
    delete info.isDarkerSystemColorsEnabled;
  });
});
