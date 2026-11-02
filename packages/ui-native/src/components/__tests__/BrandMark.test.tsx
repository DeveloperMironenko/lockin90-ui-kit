import { describe, expect, test } from 'vitest';
import { BrandMark } from '../BrandMark';
import { render } from './markup';

/* The web logo is a 30px mark with 19px text: the lockup's wordmark can be
 * sized apart from the mark, as on web. */
describe('BrandMark lockup wordmark', () => {
  test('scales with the mark by default', () => {
    expect(render(BrandMark, { variant: 'lockup', size: 30 })).toMatch(/font-size:32px/);
  });

  test('takes its own size from wordmarkSize', () => {
    const html = render(BrandMark, { variant: 'lockup', size: 30, wordmarkSize: 19 });
    expect(html).toMatch(/font-size:19px/);
    expect(html).not.toMatch(/font-size:32px/);
  });
});
