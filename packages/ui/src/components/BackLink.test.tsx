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
