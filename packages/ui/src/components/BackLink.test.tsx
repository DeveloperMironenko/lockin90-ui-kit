/* BackLink — `bar` is the signed-in top bar's chip: the pill's surface with its own size. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BackLink } from './BackLink';

describe('BackLink variant', () => {
  it('bar: the pill surface with the bar size', () => {
    const html = renderToStaticMarkup(<BackLink variant="bar" label="Back" />);
    expect(html).toContain('lk-backlink lk-backlink--pill lk-backlink--bar');
  });

  it('pill stays the auth chip', () => {
    expect(renderToStaticMarkup(<BackLink variant="pill" label="Back" />)).not.toContain('lk-backlink--bar');
  });
});

/* Two control sizes (owner, 2026-11-11): the surface variants are md (44) unless `size="sm"` (36). */
describe('BackLink size', () => {
  it('md by default, sm on request, only for the surface variants', () => {
    expect(renderToStaticMarkup(<BackLink variant="pill" />)).not.toContain('lk-backlink--sm');
    expect(renderToStaticMarkup(<BackLink variant="bar" size="sm" />)).toContain('lk-backlink--sm');
    expect(renderToStaticMarkup(<BackLink size="sm" />)).not.toContain('lk-backlink--sm');
  });
  it('sizes its chevron to the size: 16 md, 14 sm, 18 for the text link', () => {
    expect(renderToStaticMarkup(<BackLink variant="pill" />)).toMatch(/width="16"/);
    expect(renderToStaticMarkup(<BackLink variant="pill" size="sm" />)).toMatch(/width="14"/);
    expect(renderToStaticMarkup(<BackLink />)).toMatch(/width="18"/);
  });
});
