import { colors } from '@lockin90/tokens';
import { describe, expect, test } from 'vitest';
import { Toast } from '../Toast';
import { findAll, inlineStyle, parse, render } from './markup';

/* Toast `filled` (docs/sdd/components/Toast.md §2): the tone's color fills the card, no rail, the
 * title dark on it; without it, the rail and the light title. */

/** The rail is an absolute 3-wide View painted in the tone colour (inline background), no children. */
const rails = (html: string) =>
  findAll(parse(html), (e) => e.tag === 'div' && e.children.length === 0 && !!inlineStyle(e)['background-color']);

/** A colour as markup may write it: the hex, or its rgb() numbers. */
const has = (html: string, hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const flat = html.toLowerCase().replace(/\s/g, '');
  return flat.includes(hex.toLowerCase()) || flat.includes(`${r},${g},${b}`);
};

describe('Toast filled', () => {
  test('a plain toast draws its rail', () => {
    expect(rails(render(Toast, { tone: 'success', title: 'Saved' }))).toHaveLength(1);
  });

  test('a filled toast has no rail, the tone color as its card and a dark title', () => {
    const html = render(Toast, { tone: 'success', title: 'Saved', filled: true });
    expect(rails(html)).toHaveLength(0);
    expect(has(html, colors.zoneHigh)).toBe(true);
    expect(has(html, colors.bg0)).toBe(true);
    // the plain one has neither the fill nor the dark ink
    const plain = render(Toast, { tone: 'success', title: 'Saved' });
    expect(has(plain, colors.bg0)).toBe(false);
  });
});
