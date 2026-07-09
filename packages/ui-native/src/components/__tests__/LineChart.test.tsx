import { describe, expect, test } from 'vitest';
import { LineChart } from '../LineChart';
import { ancestors, findByText, hasDeclaration, inlineStyle, parse, render } from './markup';

/* Chip-pill edge clamping: a label anchored near the right edge of the plot
 * flips to hang INWARD (align-items:flex-end wrapper) so the pill never leaves
 * the viewBox; a left-edge label hangs right (flex-start); an interior label
 * stays centered on its point. Geometry: VB_W=560, PAD_X=14, 6 points →
 * x = 14 + (i/5)*532; chip width ≈ len*5.35+12. */

const DATA = [10, 20, 30, 40, 50, 60];

/** the overlay wrapper View that positions a chip (has the left:% anchor) */
function chipWrapper(html: string, text: string) {
  const root = parse(html);
  const label = findByText(root, text);
  expect(label, `chip text "${text}" not rendered`).toBeTruthy();
  const wrapper = ancestors(label!).find((a) => (a.attrs.style ?? '').includes('left:'));
  expect(wrapper, `chip "${text}" has no positioned wrapper`).toBeTruthy();
  return wrapper!;
}

describe('LineChart chip edge clamping', () => {
  const html = render(LineChart, {
    data: DATA,
    labels: [
      { index: 5, text: 'EDGE LABEL' }, // x=546; half-width 32.75 → crosses 560
      { index: 2, text: 'MIDDLE' }, // x=226.8; fully interior
      { index: 0, text: 'START LABEL' }, // x=14; half-width crosses 0
    ],
  });

  test('label at the last point near the right edge hangs inward (stays inside the viewBox)', () => {
    const wrapper = chipWrapper(html, 'EDGE LABEL');
    expect(hasDeclaration(wrapper, 'align-items:flex-end')).toBe(true);
    expect(hasDeclaration(wrapper, 'align-items:center')).toBe(false);
    // anchored exactly on the data point — 546/560 of the plot width
    expect(inlineStyle(wrapper).left).toBe('97.5%');
  });

  test('interior label stays centered on its point', () => {
    const wrapper = chipWrapper(html, 'MIDDLE');
    expect(hasDeclaration(wrapper, 'align-items:center')).toBe(true);
    expect(hasDeclaration(wrapper, 'align-items:flex-end')).toBe(false);
    expect(hasDeclaration(wrapper, 'align-items:flex-start')).toBe(false);
  });

  test('label at the first point near the left edge hangs right', () => {
    const wrapper = chipWrapper(html, 'START LABEL');
    expect(hasDeclaration(wrapper, 'align-items:flex-start')).toBe(true);
    expect(hasDeclaration(wrapper, 'align-items:center')).toBe(false);
  });

  test('a series label defaulting to the last point also flips to hang inward', () => {
    const seriesHtml = render(LineChart, {
      data: DATA,
      series: [{ data: [15, 25, 35, 45, 55, 65], label: 'COHORT MEDIAN' }],
    });
    const wrapper = chipWrapper(seriesHtml, 'COHORT MEDIAN');
    expect(hasDeclaration(wrapper, 'align-items:flex-end')).toBe(true);
  });
});
