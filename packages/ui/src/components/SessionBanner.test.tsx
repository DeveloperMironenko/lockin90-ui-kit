/* SessionBanner — live dot + live-tinted status, stats capped at 3,
   Button-variant actions, and the one-line header slots. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SessionBanner } from './SessionBanner';

describe('SessionBanner', () => {
  it('renders title, status, subtitle', () => {
    const html = renderToStaticMarkup(
      <SessionBanner title="Push Day A" status="Live · 24:18" subtitle="Bench Press · set 2 of 5" />,
    );
    expect(html).toContain('Push Day A');
    expect(html).toContain('Live · 24:18');
    expect(html).toContain('Bench Press · set 2 of 5');
  });

  it('live shows the pulsing dot and tints the status; off hides both', () => {
    const live = renderToStaticMarkup(<SessionBanner title="A" status="Live · 24:18" live />);
    expect(live).toContain('lk-sessionbanner-dot');
    expect(live).toContain('lk-sessionbanner-status-live');
    const off = renderToStaticMarkup(<SessionBanner title="A" status="Paused" />);
    expect(off).not.toContain('lk-sessionbanner-dot');
    expect(off).not.toContain('lk-sessionbanner-status-live');
  });

  it('renders at most 3 stats', () => {
    const html = renderToStaticMarkup(
      <SessionBanner
        title="A"
        stats={[
          { value: '142', label: 'BPM' },
          { value: '12', label: 'SETS' },
          { value: '8 400', label: 'KG VOL' },
          { value: 'X', label: 'DROPPED' },
        ]}
      />,
    );
    expect(html.match(/lk-sessionbanner-stat"/g)).toHaveLength(3);
    expect(html).not.toContain('DROPPED');
  });

  it('actions render as kit Buttons with the mapped variants', () => {
    const html = renderToStaticMarkup(
      <SessionBanner
        title="A"
        actions={[
          { label: 'Resume', variant: 'primary' },
          { label: 'Discard' },
        ]}
      />,
    );
    expect(html).toContain('Resume');
    expect(html).toContain('Discard');
    expect(html).toContain('lk-btn-primary');
    expect(html).toContain('lk-btn-ghost');
  });

  it('renders the leading slot', () => {
    const html = renderToStaticMarkup(<SessionBanner title="A" leading={<span>ICON</span>} />);
    expect(html).toContain('lk-sessionbanner-leading');
    expect(html).toContain('ICON');
  });
});
