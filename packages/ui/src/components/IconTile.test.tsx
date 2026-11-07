/* IconTile (docs/sdd/components/IconTile.md): a kit icon on a tile, its colour from the prop. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { IconTile } from './IconTile';

describe('IconTile', () => {
  it('draws the icon, decorative, in the given colour', () => {
    const html = renderToStaticMarkup(<IconTile icon="user" color="var(--accent)" />);
    expect(html).toMatch(/^<span aria-hidden="true" class="lk-icontile" style="color:var\(--accent\)">/);
    expect(html).toContain('<svg');
  });

  it('keeps the text colour without one', () => {
    expect(renderToStaticMarkup(<IconTile icon="user" />)).not.toContain('style=');
  });
});
