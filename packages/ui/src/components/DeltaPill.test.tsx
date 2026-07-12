/* DeltaPill — sign inference, including the TRUE MINUS sign U+2212 ('−4',
   the design's negative glyph): it must read as negative, not lose its sign
   and paint the gain treatment. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { DeltaPill } from './DeltaPill';

describe('DeltaPill sign inference', () => {
  it("infers 'down' from the true minus sign U+2212 — energy tone paints AMBER", () => {
    const html = renderToStaticMarkup(<DeltaPill value="−4" tone="energy" />);
    expect(html).toContain('lk-delta-down-amber');
    expect(html).toContain('scaleY(-1)'); // down arrow
    expect(html).not.toContain('lk-delta-up');
  });

  it("still infers 'up' from '+2'", () => {
    const html = renderToStaticMarkup(<DeltaPill value="+2" tone="energy" />);
    expect(html).toContain('lk-delta-up');
  });

  it("ASCII '-3' stays 'down' (default tone → coral)", () => {
    const html = renderToStaticMarkup(<DeltaPill value="-3" />);
    expect(html).toContain('lk-delta-down');
    expect(html).not.toContain('lk-delta-down-amber');
  });
});
