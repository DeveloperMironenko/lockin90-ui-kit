/* LineChart chip edge-clamping: a series label anchored on the LAST data point
   sits at the right viewBox edge (x = 560), so its pill must hang inward
   (align 'end' → left:100% + translate(-100%, -50%)) instead of centering and
   clipping. An interior chip keeps the CSS-default centering (no inline
   transform); a first-point chip hangs rightward ('start'). Asserted through
   the PUBLIC surface — the rendered `.lk-lc-chip` markup. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LineChart } from './LineChart';

/** Extract an `.lk-lc-chip` span's style by its exact text. */
function chipStyle(html: string, text: string): string {
  const m = html.match(new RegExp(`<span class="lk-lc-chip" style="([^"]*)">${text}</span>`));
  expect(m, `chip "${text}" not found in markup`).not.toBeNull();
  return m![1];
}

const DATA = [10, 30, 22, 44, 38, 52, 47, 60, 55]; // 9 points → x = 0, 70, …, 560

describe('LineChart chip edge-clamping', () => {
  it('series label on the last point clamps to the right edge (end-aligned, fully inside)', () => {
    const html = renderToStaticMarkup(
      <LineChart
        data={DATA}
        series={[{ data: DATA.map((v) => v + 8), label: 'COHORT AVG' }]} // default labelIndex = last point
      />,
    );
    const style = chipStyle(html, 'COHORT AVG');
    // anchored at the last point (x = 560 → 100%), hanging inward
    expect(style).toContain('left:100%');
    expect(style).toContain('transform:translate(-100%, -50%)');
  });

  it('interior label stays centered on its point (no inline transform)', () => {
    const html = renderToStaticMarkup(
      <LineChart data={DATA} labels={[{ index: 4, text: 'MID' }]} />, // x = 280 → dead center
    );
    const style = chipStyle(html, 'MID');
    expect(style).toContain('left:50%');
    expect(style).not.toContain('transform'); // CSS-default translate(-50%, -50%) centering applies
  });

  it('label on the first point clamps to the left edge (start-aligned)', () => {
    const html = renderToStaticMarkup(
      <LineChart data={DATA} labels={[{ index: 0, text: 'START' }]} />, // x = 0 → 0%
    );
    const style = chipStyle(html, 'START');
    expect(style).toContain('left:0%');
    expect(style).toContain('transform:translate(0, -50%)');
  });
});
