// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Select opens the kit Sheet (V9), its search is named and says when nothing matches (U4 / U5), and it
   finds a time zone by its city (the part after "/", underscores as spaces). */
import { act } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Select } from '../Select';
import { optionMatches } from '../../internal/selectMatch';
import { mount, propOf } from './dom';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const ZONES = [
  { value: 'America/New_York', label: 'America/New_York · GMT-5' },
  { value: 'Europe/Kyiv', label: 'Europe/Kyiv · GMT+2' },
];

const open = (host: Element, name: string) =>
  act(() => (propOf(host.querySelector(`[aria-label="${name}"]`)!, 'onPress') as () => void)());

describe('Select sheet', () => {
  test('opens the kit Sheet: its title (a header) and a × named by closeLabel', () => {
    const view = mount(<Select accessibilityLabel="Time zone" title="Time zone" closeLabel="Закрыть" options={ZONES} />);
    open(view.host, 'Time zone');
    expect(Array.from(document.querySelectorAll('[role="heading"]')).some((h) => h.textContent === 'Time zone')).toBe(true);
    expect(document.querySelector('[aria-label="Закрыть"]')).not.toBeNull();
    view.unmount();
  });

  test('the search clear button takes clearLabel; nothing found says noMatchesLabel', () => {
    vi.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');
    const say = vi.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    const view = mount(
      <Select searchable accessibilityLabel="Time zone" clearLabel="Очистить" noMatchesLabel="Ничего не найдено" options={ZONES} />,
    );
    open(view.host, 'Time zone');
    const input = document.querySelector('input')!;
    act(() => (propOf(input, 'onChangeText') as (t: string) => void)('zzz'));
    expect(document.body.textContent).toContain('Ничего не найдено');
    expect(say).toHaveBeenCalledWith('Ничего не найдено');
    expect(document.querySelector('[aria-label="Очистить"]')).not.toBeNull();
    act(() => (propOf(input, 'onChangeText') as (t: string) => void)('new york'));
    expect(document.body.textContent).toContain('America/New_York');
    expect(document.body.textContent).not.toContain('Ничего не найдено');
    view.unmount();
  });
});

describe('optionMatches', () => {
  test('a city finds its IANA id, underscores as spaces, any case', () => {
    expect(optionMatches({ value: 'America/New_York', label: 'GMT-5' }, 'New York')).toBe(true);
    expect(optionMatches({ value: 'America/Argentina/Buenos_Aires', label: 'x' }, 'buenos aires')).toBe(true);
    expect(optionMatches({ value: 'Europe/Kyiv', label: 'Kyiv' }, 'kyi')).toBe(true);
    expect(optionMatches({ value: 'Europe/Kyiv', label: 'Kyiv' }, 'paris')).toBe(false);
  });
});
