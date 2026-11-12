import { createElement } from 'react';
import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { Alert, AlertStrong } from '../Alert';
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
    // every tone's icon is 16 (owner, 2026-11-11)
    expect(svg.attrs.width).toBe('16');
    expect(findAll(tree, (e) => e.tag === 'circle')).not.toHaveLength(0);
  });

  test('a text-only neutral note centres its icon; with a title it top-aligns', () => {
    const root = (props: object) => parse(render(Alert, { tone: 'neutral', children: 'Note', ...props })).children[0];
    expect(hasDeclaration(root({}), 'align-items:center')).toBe(true);
    expect(hasDeclaration(root({ title: 'Heads up' }), 'align-items:center')).toBe(false);
  });

  test('every tone has the same text size (13) and box (12 / 16)', () => {
    for (const tone of ['cyan', 'neutral', 'info', 'violet'] as const) {
      const tree = parse(render(Alert, { tone, children: 'Note' }));
      const note = findByText(tree, 'Note')!;
      expect([note, ...ancestors(note)].some((el) => hasDeclaration(el, 'font-size:13px'))).toBe(true);
      const box = tree.children[0]!;
      expect(hasDeclaration(box, 'padding-top:12px')).toBe(true);
      expect(hasDeclaration(box, 'padding-left:16px')).toBe(true);
    }
  });

  test('the bar is optional: on for a note with bar, off for a signal tone without', () => {
    expect(bars(render(Alert, { tone: 'neutral', bar: true, children: 'Note' }))).toHaveLength(1);
    expect(bars(render(Alert, { tone: 'warn', bar: false, children: 'Note' }))).toHaveLength(0);
  });

  test('info uses the status --info colour (as Toast), not the brand accent', () => {
    const html = render(Alert, { tone: 'info', children: 'Note' });
    expect(html.toLowerCase()).toContain('rgba(110,123,255');
    expect(html.toLowerCase()).not.toContain('rgba(124,92,255');
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
  test('an accent-tinted box on the 4px scale, every corner 10', () => {
    const root = parse(render(Alert, { tone: 'violet', children: 'Why we ask' })).children[0]!;
    const box = inlineStyle(root);
    // the accent tint and its line (cyan's would be 34,211,238 at 0.22)
    expect(box['border-top-color']).toBe('rgba(124,92,255,0.20)');
    expect(hasDeclaration(root, 'padding-left:16px')).toBe(true);
    expect(hasDeclaration(root, 'border-top-left-radius:10px')).toBe(true);
  });
});

/* V5: emphasis is 600 in the full text colour; only a violet note's is the soft accent. */
describe('AlertStrong', () => {
  const strongIn = (tone: 'info' | 'violet') => {
    const sentence = createElement(Text, null, 'Why: ', createElement(AlertStrong, null, 'it matters'));
    const el = findByText(parse(render(Alert, { tone, children: sentence })), 'it matters')!;
    return ancestors(el).concat(el);
  };
  test('reads in the text colour in a signal tone', () => {
    expect(strongIn('info').some((el) => hasDeclaration(el, 'color:rgba(238,241,248,1.00)'))).toBe(true);
  });
  test('reads in accentSoft in the violet note', () => {
    expect(strongIn('violet').some((el) => hasDeclaration(el, 'color:rgba(203,188,255,1.00)'))).toBe(true);
  });
});
