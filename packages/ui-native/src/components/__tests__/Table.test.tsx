import { createElement } from 'react';
import { describe, expect, test } from 'vitest';
import { Text } from 'react-native';
import { Table, toggleExpandKey } from '../Table';
import { findAll, findByText, parse, render } from './markup';

/* Expansion bookkeeping. Press events can't be dispatched without a DOM
 * environment (no jsdom in this workspace), so the toggle math is covered at
 * helper level (`toggleExpandKey` — the exact function the chevron press runs)
 * and the controlled/uncontrolled render paths are covered via markup. */

describe('toggleExpandKey (uncontrolled + controlled toggle math)', () => {
  test('adds an absent key', () => {
    expect(toggleExpandKey([], '0')).toEqual(['0']);
    expect(toggleExpandKey(['0'], '2')).toEqual(['0', '2']);
  });

  test('removes a present key, preserving the order of the others', () => {
    expect(toggleExpandKey(['0', '1', '2'], '1')).toEqual(['0', '2']);
    expect(toggleExpandKey(['0'], '0')).toEqual([]);
  });

  test('does not mutate its input (controlled callers keep their array)', () => {
    const input: (string | number)[] = ['0', '1'];
    const out = toggleExpandKey(input, '1');
    expect(input).toEqual(['0', '1']);
    expect(out).not.toBe(input);
  });

  test('mixed string/number keys toggle independently', () => {
    expect(toggleExpandKey([0, '0'], 0)).toEqual(['0']);
  });
});

const detail = (row: Record<string, unknown>) =>
  createElement(Text, null, `DETAIL:${String(row.name)}`);

describe('Table expansion rendering', () => {
  test('uncontrolled: nothing expanded initially — chevrons collapsed, no detail panel', () => {
    const html = render(createElement(Table, { expandable: true, renderDetail: detail }));
    expect(html).not.toContain('DETAIL:');
    const root = parse(html);
    // every chevron reads "Expand row" (none open); NB react-native-web emits no
    // aria-expanded for accessibilityState.expanded, so labels carry the state
    const chevrons = findAll(root, (e) => e.attrs['aria-label'] === 'Expand row');
    expect(chevrons.length).toBe(4); // one per default row
    expect(findAll(root, (e) => e.attrs['aria-label'] === 'Collapse row').length).toBe(0);
  });

  test('controlled: expandedKeys drives which rows are open (own state ignored)', () => {
    const html = render(
      createElement(Table, { expandable: true, renderDetail: detail, expandedKeys: ['1'] }),
    );
    const root = parse(html);
    // exactly one open row: the detail panel for row index 1
    expect(findByText(root, 'DETAIL:Liam Carter')).toBeTruthy();
    expect(html).not.toContain('DETAIL:Ava Mitchell');
    expect(findAll(root, (e) => e.attrs['aria-label'] === 'Collapse row').length).toBe(1);
    expect(findAll(root, (e) => e.attrs['aria-label'] === 'Expand row').length).toBe(3);
  });

  test('controlled empty list renders everything collapsed even with a renderDetail', () => {
    const html = render(
      createElement(Table, { expandable: true, renderDetail: detail, expandedKeys: [] }),
    );
    expect(html).not.toContain('DETAIL:');
  });

  test('custom rowKey is honored by expandedKeys', () => {
    const html = render(
      createElement(Table, {
        expandable: true,
        renderDetail: detail,
        rowKey: (row: Record<string, unknown>) => String(row.name),
        expandedKeys: ['Emma Reyes'],
      }),
    );
    expect(html).toContain('DETAIL:Emma Reyes');
    expect(html).not.toContain('DETAIL:Ava Mitchell');
  });
});
