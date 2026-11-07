import { createElement } from 'react';
import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { Alert } from '../Alert';
import { ancestors, findAll, findByText, hasDeclaration, inlineStyle, parse, render } from './markup';

/* The quiet note tones (docs/sdd/components/Alert.md §3): `neutral` / `cyan` drop the 3px accent bar
 * that the signal tones draw, and their body text is the note size. */

/** The accent bar is an absolute 3-wide View painted in the tone colour (inline background). */
const bars = (html: string) =>
  findAll(parse(html), (e) => e.tag === 'div' && e.children.length === 0 && !!inlineStyle(e)['background-color']);

describe('Alert note tones', () => {
  test('a signal tone draws the accent bar', () => {
    expect(bars(render(Alert, { tone: 'info', children: 'Note' }))).toHaveLength(1);
  });

  test.each(['neutral', 'cyan'] as const)('%s draws no accent bar', (tone) => {
    expect(bars(render(Alert, { tone, children: 'Note' }))).toHaveLength(0);
  });

  test('a note gets the info glyph unless the app passes its own', () => {
    const tree = parse(render(Alert, { tone: 'neutral', children: 'Note' }));
    const [svg] = findAll(tree, (e) => e.tag === 'svg');
    expect(svg.attrs.width).toBe('17');
    expect(findAll(tree, (e) => e.tag === 'circle')).not.toHaveLength(0);
  });

  test('a text-only neutral note centres its icon; with a title it top-aligns', () => {
    const root = (props: object) => parse(render(Alert, { tone: 'neutral', children: 'Note', ...props })).children[0];
    expect(hasDeclaration(root({}), 'align-items:center')).toBe(true);
    expect(hasDeclaration(root({ title: 'Heads up' }), 'align-items:center')).toBe(false);
  });

  test('the body text is the note size', () => {
    const cyan = findByText(parse(render(Alert, { tone: 'cyan', children: 'Note' })), 'Note')!;
    expect(inlineStyle(cyan)['font-size']).toBe('12.5px');
    const neutral = findByText(parse(render(Alert, { tone: 'neutral', children: 'Note' })), 'Note')!;
    expect(inlineStyle(neutral)['font-size']).toBe('12.5px');
  });
});

/* Any text in the alert gets its text style, as on web: a sentence with a styled part (an i18n Trans). */
describe('Alert text', () => {
  test('styles a sentence with a styled part as the alert text', () => {
    const sentence = createElement(Text, null, 'Timezone detected: ', createElement(Text, { style: { fontWeight: '600' } }, 'Europe/Kyiv'));
    const own = findByText(parse(render(Alert, { tone: 'info', children: sentence })), 'Timezone detected:');
    expect(own).toBeDefined();
    // the alert's text style wraps the app's sentence
    expect(ancestors(own!).some((el) => hasDeclaration(el, 'font-size:13px'))).toBe(true);
  });
});

describe('Alert violet note', () => {
  test('an accent-tinted box on the 4px scale, the container radius', () => {
    const box = inlineStyle(parse(render(Alert, { tone: 'violet', children: 'Why we ask' })).children[0]!);
    expect(box['background-color']).toBe('rgba(124,92,255,0.05)');
    expect(box.gap).toBe('12px');
    expect(box['padding-left']).toBe('16px');
    expect(box['border-top-left-radius']).toBe('16px');
  });
});
