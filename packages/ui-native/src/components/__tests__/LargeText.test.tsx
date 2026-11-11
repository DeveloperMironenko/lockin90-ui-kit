/* The largest OS text size (static render; react-native-web reads Dimensions here): a settings row stacks
   its control under the text, a plain row's title wraps, and CodeInput's boxes keep 44 tall. */
import { Dimensions, Text } from 'react-native';
import { afterEach, describe, expect, test } from 'vitest';
import { ListRow } from '../ListRow';
import { SegmentedTabs } from '../SegmentedTabs';
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

  test('a plain row’s title wraps (never cut)', () => {
    const root = parse(render(ListRow, { title: 'Data sources', subtitle: 'Wearables' }));
    expect(hasDeclaration(findByText(root, 'Data sources')!, 'white-space:nowrap')).toBe(false);
  });
});

describe('SegmentedTabs at a large text size', () => {
  test.each([
    [1, false],
    [1.6, true],
  ])('fontScale %s: the segments stack: %s', (fs, stacked) => {
    scale(fs);
    const track = parse(render(SegmentedTabs, { tabs: ['Metric', 'Imperial'] })).children[0]!;
    // the track is a row; stacked it is a column
    expect(hasDeclaration(track, 'flex-direction:row')).toBe(!stacked);
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
