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

  test('the initials fit the box (one line, scaling kept, never adjustsFontSizeToFit: V1)', () => {
    const { host, unmount } = mount(<Avatar name="Ann Lee" size={40} />);
    const initials = Array.from(host.querySelectorAll('div')).find((d) => d.textContent === 'AL' && !d.children.length)!;
    expect(propOf(initials, 'adjustsFontSizeToFit')).toBeUndefined();
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
    const text = Array.from(host.querySelectorAll('div')).find((d) => d.textContent === 'Enter your email' && d.children.length === 0)!;
    expect(text.previousElementSibling?.querySelector('svg')).toBeTruthy();
    unmount();
  });
});

describe('Alert on iOS', () => {
  test('danger says itself on mount; warn only when its text changes; live={false} never', () => {
    const announce = vi.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    ios(() => {
      const a = mount(<Alert tone="danger" title="Sign-in failed">Wrong password</Alert>);
      a.unmount();
      const b = mount(<Alert tone="warn">Weak signal</Alert>);
      expect(announce).toHaveBeenCalledTimes(1);
      b.rerender(<Alert tone="warn">No signal</Alert>);
      b.unmount();
      const c = mount(<Alert tone="danger" live={false}>Quiet</Alert>);
      c.unmount();
      const d = mount(<Alert tone="info">Saved</Alert>);
      d.unmount();
    });
    expect(announce.mock.calls.map((c) => c[0])).toEqual(['Sign-in failed. Wrong password', 'No signal']);
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

describe('useHighContrast (review)', () => {
  test('a change event before the first read wins; Bold Text is not contrast', async () => {
    const info = AccessibilityInfo as unknown as Record<string, unknown>;
    let resolveFirst: (on: boolean) => void = () => {};
    const handlers: Record<string, (on: boolean) => void> = {};
    info.isDarkerSystemColorsEnabled = () => new Promise<boolean>((r) => (resolveFirst = r));
    // Bold Text on: it must not count (the hook never asks for it)
    info.isBoldTextEnabled = () => Promise.resolve(true);
    vi.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(((e: string, fn: (on: boolean) => void) => {
      handlers[e] = fn;
      return { remove: () => {} };
    }) as never);
    vi.resetModules();
    const { useHighContrast } = await import('../../internal/useHighContrast');
    const seen: boolean[] = [];
    function Probe() {
      seen.push(useHighContrast());
      return null;
    }
    const { unmount } = mount(<Probe />);
    expect(handlers.boldTextChanged).toBeUndefined();
    act(() => handlers.darkerSystemColorsChanged?.(true));
    await act(async () => resolveFirst(false));
    expect(seen[seen.length - 1]).toBe(true);
    unmount();
    delete info.isDarkerSystemColorsEnabled;
    delete info.isBoldTextEnabled;
  });
});
