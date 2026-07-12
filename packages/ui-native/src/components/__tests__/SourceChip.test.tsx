/* SourceChip (native) — brand-colored provenance chip: correct ground + ink
   + Icon per source, manual/lockin90/null/unknown render nothing. Mirrors
   the web twin's coverage. */
import { describe, expect, test } from 'vitest';
import { SourceChip } from '../SourceChip';
import { findAll, hasDeclaration, parse, render, type El } from './markup';

/** The chip's root paints its ground, whether react-native-web serialized it
 *  as an atomic class (registered style) or an inline style (dynamic ground). */
function paintsBg(el: El, needle: string): boolean {
  return (el.attrs.style ?? '').includes(needle) || hasDeclaration(el, `background-color:${needle}`);
}

/** The `bordered` variant is a static (StyleSheet.create-registered) style,
 *  so react-native-web always serializes it as an atomic class — expanded
 *  into per-side longhands (`border-bottom-color`, not `border-color`). */
function hasHairlineBorder(el: El): boolean {
  return hasDeclaration(el, 'border-bottom-color:rgba(0,0,0,0.12)');
}

describe('SourceChip — synced sources render the right ground + ink + wordmark', () => {
  test('whoop — black ground (11,11,11), white ink, the whoop wordmark band, no border', () => {
    const html = render(SourceChip, { source: 'whoop' });
    const root = parse(html).children[0]!;
    expect(paintsBg(root, '11,11,11') || paintsBg(root, '#0B0B0B')).toBe(true);
    expect(html).toContain('fill="#FFFFFF"');
    expect(html).toContain('viewBox="0 9.4 24 5.2"'); // whoop WORDMARK_BAND
    expect(hasHairlineBorder(root)).toBe(false);
  });

  test('garmin — white ground, Garmin blue ink, a hairline border', () => {
    const html = render(SourceChip, { source: 'garmin' });
    const root = parse(html).children[0]!;
    expect(paintsBg(root, '255,255,255') || paintsBg(root, '#FFFFFF')).toBe(true);
    expect(html).toContain('fill="#007CC3"');
    expect(html).toContain('viewBox="0 8.1 24 7.7"'); // garmin WORDMARK_BAND
    expect(hasHairlineBorder(root)).toBe(true);
  });

  test('polar — white ground, Polar red ink, a hairline border', () => {
    const html = render(SourceChip, { source: 'polar' });
    const root = parse(html).children[0]!;
    expect(html).toContain('fill="#D10027"');
    expect(html).toContain('viewBox="0 9.3 24 5.4"'); // polar WORDMARK_BAND
    expect(hasHairlineBorder(root)).toBe(true);
  });

  test('oura — dark ground (21,18,14), off-white ink, no border', () => {
    const html = render(SourceChip, { source: 'oura' });
    const root = parse(html).children[0]!;
    expect(paintsBg(root, '21,18,14') || paintsBg(root, '#15120E')).toBe(true);
    expect(html).toContain('fill="#F0EADF"');
    expect(html).toContain('viewBox="0 7.7 24 8.7"'); // oura WORDMARK_BAND
    expect(hasHairlineBorder(root)).toBe(false);
  });

  test('apple_health — white ground, the heart glyph in #FF2D55, a hairline border', () => {
    const html = render(SourceChip, { source: 'apple_health' });
    const root = parse(html).children[0]!;
    expect(html).toContain('fill="#FF2D55"');
    expect(html).toContain('viewBox="0 0 24 24"'); // no WORDMARK_BAND — square heart
    expect(html).toContain('M12 20.9'); // apple-health heart path
    expect(hasHairlineBorder(root)).toBe(true);
  });

  test('size="md" renders a taller icon than the default sm', () => {
    const sm = render(SourceChip, { source: 'whoop' });
    const md = render(SourceChip, { source: 'whoop', size: 'md' });
    expect(sm).toContain('height="12"');
    expect(md).toContain('height="18"');
  });
});

describe('SourceChip — hand-logged / unknown sources render nothing', () => {
  test.each([['manual'], ['lockin90'], [null], [undefined], ['some-future-vendor']])(
    'source=%s renders null',
    (source) => {
      const root = findAll(parse(render(SourceChip, { source: source as string | null | undefined })), () => true);
      expect(root.length).toBe(0);
    },
  );
});
