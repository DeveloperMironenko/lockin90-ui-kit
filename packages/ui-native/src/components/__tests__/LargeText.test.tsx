/* The largest OS text size (static render; react-native-web reads Dimensions here): a settings row stacks
   its control under the text, a plain row's title wraps, and CodeInput's boxes keep 44 tall. */
import { Dimensions, Text } from 'react-native';
import { afterEach, describe, expect, test } from 'vitest';
import { Card } from '../Card';
import { ListRow } from '../ListRow';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { SegmentedTabs } from '../SegmentedTabs';
import { Stepper } from '../Stepper';
import { codeBoxLayout } from '../TagInput';
import { findAll, findByText, hasDeclaration, parse, render } from './markup';

const scale = (fontScale: number) =>
  Dimensions.set({ window: { width: 402, height: 874, scale: 3, fontScale }, screen: { width: 402, height: 874, scale: 3, fontScale } });
afterEach(() => scale(1));

describe('ListRow at a large text size', () => {
  test.each([
    [1, false],
    [1.6, true],
  ])('fontScale %s: the control is under the text: %s', (fs, stacked) => {
    scale(fs);
    const root = parse(render(ListRow, { variant: 'pref', title: 'Units', trailing: <Text>Imperial</Text> }));
    expect(findAll(root, (el) => hasDeclaration(el, 'flex-basis:100%')).length > 0).toBe(stacked);
  });

  test('a plain row’s subtitle is one line, and wraps at a large text size', () => {
    const one = parse(render(ListRow, { title: 'Settings', subtitle: 'Physiology, units & account' }));
    expect(hasDeclaration(findByText(one, 'Physiology, units & account')!, 'white-space:nowrap')).toBe(true);
    scale(1.6);
    const big = parse(render(ListRow, { title: 'Settings', subtitle: 'Physiology, units & account' }));
    expect(hasDeclaration(findByText(big, 'Physiology, units & account')!, 'white-space:nowrap')).toBe(false);
  });

  test('a plain row’s title wraps (never cut)', () => {
    const root = parse(render(ListRow, { title: 'Data sources', subtitle: 'Wearables' }));
    expect(hasDeclaration(findByText(root, 'Data sources')!, 'white-space:nowrap')).toBe(false);
  });
});

describe('SegmentedTabs at a large text size', () => {
  test.each([1, 1.6])('fontScale %s: md is never a forced column list (its rows come from the measured fit)', (fs) => {
    scale(fs);
    const track = parse(render(SegmentedTabs, { tabs: ['Metric', 'Imperial'] })).children[0]!;
    expect(hasDeclaration(track, 'flex-direction:row')).toBe(true);
  });
  test.each([
    [1, false],
    [1.6, true],
  ])('fontScale %s: sm wraps its pills onto more rows: %s', (fs, wraps) => {
    scale(fs);
    const track = parse(render(SegmentedTabs, { size: 'sm', tabs: ['Metric', 'Imperial'] })).children[0]!;
    expect(hasDeclaration(track, 'flex-wrap:wrap')).toBe(wraps);
    expect(hasDeclaration(track, 'flex-direction:row')).toBe(true);
  });
});

describe('Stepper at a large text size', () => {
  test.each([
    [1, false],
    [1.6, true],
  ])('fontScale %s: the rail is vertical and labels unclamped: %s', (fs, vertical) => {
    scale(fs);
    const root = parse(render(Stepper, { variant: 'glow', steps: [{ label: 'Профиль' }, { label: 'Готово' }], current: 0 }));
    expect(hasDeclaration(root.children[0]!, 'flex-direction:row')).toBe(!vertical);
    expect(hasDeclaration(findByText(root, 'Профиль')!, 'white-space:nowrap')).toBe(!vertical);
    // the current node grows with the text (14 × 1.6 × 1.35 → 31, still the 40 minimum; at 3.1 → 59)
    expect((findByText(root, '1')!.parent?.attrs.style ?? '').includes('width:')).toBe(vertical);
  });
});

describe('codeBoxLayout', () => {
  test('6 digits in 300: 44 wide, the gap shrinks to fit', () => {
    const l = codeBoxLayout(300, 6);
    expect(l.width).toBeGreaterThanOrEqual(44);
    expect(l.gap).toBeGreaterThanOrEqual(4);
    expect(l.width * 6 + l.gap * 5).toBeLessThanOrEqual(300.01);
  });

  test('8 digits in 300: narrower, but 44 tall and 4 apart', () => {
    const l = codeBoxLayout(300, 8);
    expect(l.height).toBeGreaterThanOrEqual(44);
    expect(l.width).toBeGreaterThanOrEqual(24);
    expect(l.gap).toBe(4);
  });

  test('a wide row keeps 8 apart and caps the box at 60', () => {
    expect(codeBoxLayout(600, 6)).toEqual({ gap: 8, width: 60, height: 70.8 });
  });
});

describe('PasswordStrengthMeter rules at a large text size', () => {
  const rules = ['10+ characters', 'Upper & lowercase', 'A number or symbol'].map((label, i) => ({ id: String(i), label, met: false }));
  test.each([
    [1, 2],
    [1.6, 3],
  ])('fontScale %s: %s rows (two columns, then one)', (fs, rows) => {
    scale(fs);
    const root = parse(render(PasswordStrengthMeter, { score: 0, rules, metLabel: ', met', unmetLabel: ', not yet' }));
    const rowEls = findAll(root, (el) => hasDeclaration(el, 'column-gap:16px') || hasDeclaration(el, 'gap:16px'));
    expect(rowEls.length).toBe(rows);
  });
});

describe('Card at a large text size', () => {
  test.each([
    [1, 'padding:30px'],
    [1.6, 'padding:16px'],
  ])('fontScale %s: a large card pads %s', (fs, pad) => {
    scale(fs);
    const card = parse(render(Card, { padLg: true, children: <Text>x</Text> })).children[0]!;
    expect(hasDeclaration(card, pad)).toBe(true);
  });
});
