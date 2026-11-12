// @vitest-environment happy-dom
/* Select search (U4 / U5): the clear button takes `clearLabel`, a search that finds nothing says
   `noMatchesLabel` in a live region that was there from the open, and a time zone is found by its city. */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { Select } from './Select';
import { optionMatches } from './selectMatch';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(() => {
  document.body.innerHTML = '';
});

const ZONES = [
  { value: 'America/New_York', label: 'America/New_York · GMT-5' },
  { value: 'Europe/Kyiv', label: 'Europe/Kyiv · GMT+2' },
];

const type = (input: HTMLInputElement, text: string) =>
  act(() => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

describe('Select search', () => {
  it('names its clear button, finds a city, and announces no matches', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() =>
      root.render(
        <Select searchable aria-label="Time zone" clearLabel="Borrar" noMatchesLabel="Sin resultados" options={ZONES} />,
      ),
    );
    act(() => host.querySelector<HTMLButtonElement>('[role="combobox"]')!.click());
    const status = document.querySelector('.lk-select-empty')!;
    expect(status.getAttribute('role')).toBe('status');
    expect(status.textContent).toBe('');
    const input = document.querySelector<HTMLInputElement>('.lk-select-search input')!;
    type(input, 'new york');
    expect(Array.from(document.querySelectorAll('[role="option"]')).map((o) => o.textContent)).toEqual(['America/New_York · GMT-5']);
    expect(document.querySelector('[aria-label="Borrar"]')).not.toBeNull();
    type(input, 'zzz');
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(0);
    expect(document.querySelector('.lk-select-empty')!.textContent).toBe('Sin resultados');
    act(() => root.unmount());
  });

  it('optionMatches: the city part, underscores as spaces', () => {
    expect(optionMatches({ value: 'America/Argentina/Buenos_Aires', label: 'GMT-3' }, 'Buenos Aires')).toBe(true);
    expect(optionMatches({ value: 'Europe/Kyiv', label: 'Kyiv' }, 'paris')).toBe(false);
  });
});
