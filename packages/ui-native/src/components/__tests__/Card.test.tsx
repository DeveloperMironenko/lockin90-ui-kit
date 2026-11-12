/* Card (native) — tone danger: the design's danger zone colours (as web). */
import { describe, expect, test } from 'vitest';
import { Card } from '../Card';
import { findAll, hasDeclaration, parse, render } from './markup';

describe('Card tone danger', () => {
  test('the line at 30%, the fill at 4%', () => {
    const root = parse(render(Card, { tone: 'danger', children: null }));
    const card = root.children[0]!;
    expect(hasDeclaration(card, 'border-top-color:rgba(255,77,109,0.30)') || hasDeclaration(card, 'border-top-color:rgba(255,77,109,0.3)')).toBe(true);
    // the --bad 4% tint over the card fill (opaque enough for the aurora), flattened
    expect(findAll(root, (el) => hasDeclaration(el, 'background-color:rgba(34,27,36,')).length).toBe(1);
  });
});
