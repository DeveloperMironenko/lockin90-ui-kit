/* SupplementChart `stack-levels` (SP-07) pill separation: three series whose
   FINAL levels collide must render their end-of-line pills pushed apart —
   pill-center y gaps ≥ 15px (pill height 13 + 2) — while every pill stays
   inside the plot; and with the right edge occupied by the pills, the zone
   band labels anchor at the LEFT edge. Asserted through the rendered markup
   (the public surface): `.lk-supp-tag-text` pill text y's and the
   `.lk-supp-label` band captions. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SupplementChart } from './SupplementChart';

/* viewBox geometry (mirrors the component's catalog constants) */
const H = 150;
const PAD_T = 16;
const PAD_B = 14;
const PILL_H = 13;

/** Pill-center y for a named series pill: the Tag text renders at y = center + 2.8. */
function pillCenterY(html: string, name: string): number {
  const m = html.match(
    new RegExp(`<text class="lk-supp-tag-text" x="[\\d.-]+" y="([\\d.-]+)"[^>]*>${name}</text>`),
  );
  expect(m, `series pill "${name}" not found`).not.toBeNull();
  return Number(m![1]) - 2.8;
}

// three kinetics curves whose final levels collide within ~2 viewBox px
const ramp = (end: number) => [0.2, 0.35, 0.45, end];
const SERIES = [
  { name: 'CREATINE', levels: ramp(0.5) },
  { name: 'OMEGA-3', levels: ramp(0.51) },
  { name: 'MAGNESIUM', levels: ramp(0.52) },
];

describe('SupplementChart stack-levels pill separation', () => {
  const html = renderToStaticMarkup(<SupplementChart variant="stack-levels" series={SERIES} />);
  const ys = SERIES.map((s) => pillCenterY(html, s.name));

  it('colliding final levels render pills ≥ 15px apart', () => {
    const sorted = [...ys].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i] - sorted[i - 1], `gap between pill ${i - 1} and ${i}`).toBeGreaterThanOrEqual(15);
    }
  });

  it('every pushed pill stays inside the plot', () => {
    const top = PAD_T + PILL_H / 2; // 22.5
    const bottom = H - PAD_B - PILL_H / 2; // 129.5
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(top);
      expect(y).toBeLessThanOrEqual(bottom);
    }
  });

  it('band labels anchor at the left edge (the right edge belongs to the pills)', () => {
    // LevelBands labelsLeft → Label at x = PAD.l + 2 = 12, textAnchor 'start'
    expect(html).toMatch(
      /<text class="lk-supp-label" x="12" y="[\d.-]+" fill="var\(--zone-high\)" text-anchor="start">SATURATED<\/text>/,
    );
    expect(html).toMatch(
      /<text class="lk-supp-label" x="12" y="[\d.-]+" fill="var\(--zone-low\)" text-anchor="start">LOW<\/text>/,
    );
  });
});
