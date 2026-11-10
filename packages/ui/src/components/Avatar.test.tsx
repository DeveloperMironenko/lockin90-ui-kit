/* Avatar — its size is its own inline width/height; a caller's `style` adds to
   it and never replaces it (an app passing `style={undefined}` once left a
   0-wide avatar squeezed into an oval). */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Avatar } from './Avatar';

describe('Avatar size', () => {
  it('keeps its size when style is undefined', () => {
    const html = renderToStaticMarkup(<Avatar initials="E" size={36} style={undefined} />);
    expect(html).toContain('width:36px;height:36px');
  });

  it("adds the caller's style to its size", () => {
    const html = renderToStaticMarkup(<Avatar initials="E" size={36} style={{ marginLeft: 4 }} />);
    expect(html).toContain('width:36px;height:36px;margin-left:4px');
  });

  it('keeps its size on the aura variant too', () => {
    const html = renderToStaticMarkup(<Avatar variant="aura" size={36} style={undefined} />);
    expect(html).toContain('width:36px;height:36px');
  });
});
