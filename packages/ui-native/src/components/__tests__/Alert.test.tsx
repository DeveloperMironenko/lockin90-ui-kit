import { describe, expect, test } from 'vitest';
import { Alert } from '../Alert';
import { findAll, findByText, hasDeclaration, inlineStyle, parse, render } from './markup';

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
