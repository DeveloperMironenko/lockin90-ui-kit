/* SourceChip — brand-colored provenance chip: correct ground + ink + Icon
   per source, manual/lockin90/null/unknown render nothing. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SourceChip } from './SourceChip';

describe('SourceChip — synced sources render the right ground + ink + wordmark', () => {
  it('whoop — black ground, white ink, the whoop wordmark band', () => {
    const html = renderToStaticMarkup(<SourceChip source="whoop" />);
    expect(html).toContain('background:#0B0B0B');
    expect(html).toContain('color:#FFFFFF');
    expect(html).toContain('viewBox="0 9.4 24 5.2"'); // whoop WORDMARK_BAND
  });

  it('garmin — white ground, Garmin blue ink, a hairline border', () => {
    const html = renderToStaticMarkup(<SourceChip source="garmin" />);
    expect(html).toContain('background:#FFFFFF');
    expect(html).toContain('color:#007CC3');
    expect(html).toContain('viewBox="0 8.1 24 7.7"'); // garmin WORDMARK_BAND
    expect(html).toContain('lk-sourcechip-bordered');
  });

  it('polar — white ground, Polar red ink, a hairline border', () => {
    const html = renderToStaticMarkup(<SourceChip source="polar" />);
    expect(html).toContain('background:#FFFFFF');
    expect(html).toContain('color:#D10027');
    expect(html).toContain('viewBox="0 9.3 24 5.4"'); // polar WORDMARK_BAND
    expect(html).toContain('lk-sourcechip-bordered');
  });

  it('oura — dark ground, off-white ink, no border', () => {
    const html = renderToStaticMarkup(<SourceChip source="oura" />);
    expect(html).toContain('background:#15120E');
    expect(html).toContain('color:#F0EADF');
    expect(html).toContain('viewBox="0 7.7 24 8.7"'); // oura WORDMARK_BAND
    expect(html).not.toContain('lk-sourcechip-bordered');
  });

  it('apple_health — white ground, the heart glyph in #FF2D55, a hairline border', () => {
    const html = renderToStaticMarkup(<SourceChip source="apple_health" />);
    expect(html).toContain('background:#FFFFFF');
    expect(html).toContain('color:#FF2D55');
    expect(html).toContain('viewBox="0 0 24 24"'); // no WORDMARK_BAND — square heart
    expect(html).toContain('M12 20.9'); // apple-health heart path
    expect(html).toContain('lk-sourcechip-bordered');
  });

  it('size="md" renders a taller icon than the default sm', () => {
    const sm = renderToStaticMarkup(<SourceChip source="whoop" />);
    const md = renderToStaticMarkup(<SourceChip source="whoop" size="md" />);
    expect(sm).toContain('height="12"');
    expect(md).toContain('height="18"');
  });
});

describe('SourceChip — hand-logged / unknown sources render nothing', () => {
  it.each([['manual'], ['lockin90'], [null], [undefined], ['some-future-vendor']])('source=%s renders null', (source) => {
    const html = renderToStaticMarkup(<SourceChip source={source as string | null | undefined} />);
    expect(html).toBe('');
  });
});
