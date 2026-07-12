/* PrBadge — the solid red PR flag: default 'PR' label, sm size class,
   custom labels for PrCard state tags. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PrBadge } from './PrBadge';

describe('PrBadge', () => {
  it('renders the default PR label', () => {
    const html = renderToStaticMarkup(<PrBadge />);
    expect(html).toContain('lk-prbadge');
    expect(html).toContain('>PR</span>');
    expect(html).not.toContain('lk-prbadge-sm');
  });

  it('sm size adds the compact class', () => {
    const html = renderToStaticMarkup(<PrBadge size="sm" />);
    expect(html).toContain('lk-prbadge-sm');
  });

  it('renders a custom label (PrCard state tags)', () => {
    const html = renderToStaticMarkup(<PrBadge label="AT PEAK" />);
    expect(html).toContain('AT PEAK');
  });
});
