// @vitest-environment happy-dom
/// <reference lib="dom" />
/* CONVENTIONS "Accessibility" on native: 44pt touch targets with the same look (hitSlop / minHeight),
   names from props, announcement roles, Button loading, SegmentedTabs as a choice. */
import { AccessibilityInfo } from 'react-native';
import { act } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Alert } from '../Alert';
import { BackLink } from '../BackLink';
import { Button } from '../Button';
import { ChoiceChip } from '../ChoiceChip';
import { DotsLoader } from '../DotsLoader';
import { IconButton } from '../IconButton';
import { SegmentedTabs } from '../SegmentedTabs';
import { Select } from '../Select';
import { Toast } from '../Toast';
import { click, mount, propOf, target } from './dom';

afterEach(() => vi.restoreAllMocks());

const byLabel = (host: Element, label: string) => host.querySelector(`[aria-label="${label}"]`)!;

describe('44pt touch targets, same look', () => {
  test('Button sm (36.2 tall) and the text variant (17)', () => {
    const sm = mount(<Button size="sm" title="Edit" />);
    expect(target(sm.host.querySelector('[role="button"]')!, 60, 36.2).height).toBeGreaterThanOrEqual(44);
    sm.unmount();
    const text = mount(<Button variant="text" title="Resend" />);
    expect(target(text.host.querySelector('[role="button"]')!, 60, 17).height).toBeGreaterThanOrEqual(44);
    text.unmount();
  });

  test('BackLink, both variants', () => {
    const d = mount(<BackLink label="Back" />);
    expect(target(d.host.querySelector('[role="button"]')!, 60, 26).height).toBeGreaterThanOrEqual(44);
    d.unmount();
    const p = mount(<BackLink label="Back" variant="pill" />);
    expect(target(p.host.querySelector('[role="button"]')!, 60, 30).height).toBeGreaterThanOrEqual(44);
    p.unmount();
  });

  test('Select sm (27 tall) and md (39.6)', () => {
    const sm = mount(<Select size="sm" accessibilityLabel="Language" />);
    expect(target(byLabel(sm.host, 'Language'), 80, 27).height).toBeGreaterThanOrEqual(44);
    sm.unmount();
    const md = mount(<Select accessibilityLabel="Country" />);
    expect(target(byLabel(md.host, 'Country'), 200, 39.6).height).toBeGreaterThanOrEqual(44);
    md.unmount();
  });

  test('ChoiceChip md (32) and sm (28)', () => {
    const md = mount(<ChoiceChip>Run</ChoiceChip>);
    expect(target(md.host.querySelector('[role="button"]')!, 60, 32).height).toBeGreaterThanOrEqual(44);
    md.unmount();
    const sm = mount(<ChoiceChip size="sm">Run</ChoiceChip>);
    expect(target(sm.host.querySelector('[role="button"]')!, 60, 28).height).toBeGreaterThanOrEqual(44);
    sm.unmount();
  });

  test('IconButton: the target is at least 44 around the 32 / 40 square', () => {
    const { host, unmount } = mount(<IconButton icon="camera" label="Change photo" />);
    const style = propOf(byLabel(host, 'Change photo'), 'style') as unknown[];
    expect(JSON.stringify(style)).toMatch(/"minWidth":44.*"minHeight":44/);
    unmount();
  });

  test('Alert (26) and Toast (20) close buttons, named by dismissLabel', () => {
    const a = mount(<Alert onDismiss={() => {}} dismissLabel="Cerrar">x</Alert>);
    expect(target(byLabel(a.host, 'Cerrar'), 26, 26)).toEqual({ width: 44, height: 44 });
    a.unmount();
    const t = mount(<Toast onDismiss={() => {}} dismissLabel="Cerrar" />);
    expect(target(byLabel(t.host, 'Cerrar'), 20, 20)).toEqual({ width: 44, height: 44 });
    t.unmount();
  });

  test('SegmentedTabs segments, md (30) and sm (23)', () => {
    const md = mount(<SegmentedTabs tabs={['A', 'B']} />);
    expect(target(md.host.querySelector('[role="tab"]')!, 80, 30).height).toBeGreaterThanOrEqual(44);
    md.unmount();
    const sm = mount(<SegmentedTabs size="sm" tabs={['A', 'B']} />);
    expect(target(sm.host.querySelector('[role="tab"]')!, 40, 23).height).toBeGreaterThanOrEqual(44);
    sm.unmount();
  });
});

describe('Button loading', () => {
  test('keeps the title, says busy and ignores presses', () => {
    const onPress = vi.fn();
    const { host, rerender, unmount } = mount(<Button title="Save" loading onPress={onPress} />);
    const button = host.querySelector('[role="button"]')!;
    // RN reads accessibilityState (react-native-web doesn't render `busy`)
    expect(propOf(button, 'accessibilityState')).toMatchObject({ busy: true });
    expect(host.textContent).toContain('Save');
    // the spinner is shown but hidden from screen readers: the button reads its title once
    expect(host.querySelector('[role="progressbar"]')).toBeTruthy();
    expect(button.getAttribute('aria-label')).toBe('Save');
    expect(propOf(host.querySelector('[role="progressbar"]')!, 'importantForAccessibility')).toBe('no-hide-descendants');
    click(button);
    expect(onPress).not.toHaveBeenCalled();
    rerender(<Button title="Save" onPress={onPress} />);
    expect(host.querySelector('[role="progressbar"]')).toBeNull();
    click(host.querySelector('[role="button"]')!);
    expect(onPress).toHaveBeenCalledTimes(1);
    unmount();
  });
});

describe('announcements and names', () => {
  test('a danger Alert is an alert in an assertive live region; others are polite, not alerts', () => {
    const d = mount(<Alert tone="danger">Failed</Alert>);
    const el = d.host.querySelector('[role="alert"]')!;
    expect(el.getAttribute('aria-live')).toBe('assertive');
    d.unmount();
    const i = mount(<Alert tone="info">Note</Alert>);
    expect(i.host.querySelector('[role="alert"]')).toBeNull();
    expect(i.host.querySelector('[aria-live="polite"]')).toBeTruthy();
    i.unmount();
  });

  test('Alert title is a header only on request', () => {
    const plain = mount(<Alert title="Heads up">x</Alert>);
    expect(plain.host.querySelector('[role="heading"]')).toBeNull();
    plain.unmount();
    const h = mount(<Alert title="Heads up" titleAs="h3">x</Alert>);
    expect(h.host.querySelector('[role="heading"]')?.textContent).toBe('Heads up');
    h.unmount();
  });

  test('DotsLoader reads its label', () => {
    const { host, unmount } = mount(<DotsLoader label="Cargando" />);
    expect(byLabel(host, 'Cargando')).toBeTruthy();
    unmount();
  });
});

describe('SegmentedTabs kind="choice"', () => {
  test('a radiogroup of radios, the active one checked, named by the field', () => {
    const { host, unmount } = mount(
      <SegmentedTabs kind="choice" tabs={['Metric', 'Imperial']} active={1} accessibilityLabel="Units" />,
    );
    const group = host.querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute('aria-label')).toBe('Units');
    const radios = host.querySelectorAll('[role="radio"]');
    expect(radios).toHaveLength(2);
    expect(propOf(radios[1], 'accessibilityState')).toMatchObject({ checked: true });
    expect(propOf(radios[0], 'accessibilityState')).toMatchObject({ checked: false });
    unmount();
  });
});

describe('useReducedMotion', () => {
  test('one native read and listener for every user; follows the setting and its changes', async () => {
    let listener: ((on: boolean) => void) | undefined;
    const read = vi.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const listen = vi.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(((_e: string, fn: (on: boolean) => void) => {
      listener = fn;
      return { remove: () => {} };
    }) as never);
    vi.resetModules();
    const { useReducedMotion: hook } = await import('../../internal/useReducedMotion');
    const seen: boolean[][] = [[], []];
    function Probe({ i }: { i: number }) {
      seen[i].push(hook());
      return null;
    }
    const { unmount } = mount(
      <>
        <Probe i={0} />
        <Probe i={1} />
      </>,
    );
    await act(async () => {});
    expect(read).toHaveBeenCalledTimes(1);
    expect(listen).toHaveBeenCalledTimes(1);
    expect(seen.map((s) => s[s.length - 1])).toEqual([true, true]);
    act(() => listener?.(false));
    expect(seen.map((s) => s[s.length - 1])).toEqual([false, false]);
    unmount();
    // a later user starts from the known value, with no second native read
    const later: boolean[] = [];
    function Late() {
      later.push(hook());
      return null;
    }
    act(() => listener?.(true));
    const again = mount(<Late />);
    expect(later[0]).toBe(true);
    expect(read).toHaveBeenCalledTimes(1);
    again.unmount();
  });
});
