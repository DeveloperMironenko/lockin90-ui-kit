/* PkChart heartbeat pacing: beat period = 60000/bpm ms, exposed as the
   `--lk-pk-beat` custom property on the root, and the beat only runs on the
   LIVE raw-`samples` trace (never doses-derived), when not `still`, with a
   finite bpm > 0. Asserted through the rendered markup: the custom property +
   the beat elements (`lk-pk-beat-glow` path, `lk-pk-beat-ring`,
   `lk-pk-dot--beat`). */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PkChart } from './PkChart';

const SAMPLES = [10, 40, 80, 120, 90, 60, 30]; // live trace (peak 120 > 0)

const hasBeat = (html: string) =>
  html.includes('lk-pk-beat-glow') && html.includes('lk-pk-beat-ring') && html.includes('lk-pk-dot--beat');

describe('PkChart bpm → beat period', () => {
  it('paces the beat at 60000/bpm ms', () => {
    expect(renderToStaticMarkup(<PkChart samples={SAMPLES} bpm={60} />)).toContain('--lk-pk-beat:1000ms');
    expect(renderToStaticMarkup(<PkChart samples={SAMPLES} bpm={64} />)).toContain('--lk-pk-beat:937.5ms'); // default bpm
    expect(renderToStaticMarkup(<PkChart samples={SAMPLES} bpm={120} />)).toContain('--lk-pk-beat:500ms');
  });

  it('renders the beat elements only while beating', () => {
    expect(hasBeat(renderToStaticMarkup(<PkChart samples={SAMPLES} bpm={64} />))).toBe(true);
  });

  it('bpm <= 0 or non-finite disables the beat', () => {
    for (const bpm of [0, -5, Number.NaN, Number.POSITIVE_INFINITY]) {
      const html = renderToStaticMarkup(<PkChart samples={SAMPLES} bpm={bpm} />);
      expect(hasBeat(html), `bpm=${bpm}`).toBe(false);
      expect(html, `bpm=${bpm}`).not.toContain('--lk-pk-beat');
    }
  });

  it('`still` holds the live trace static', () => {
    const html = renderToStaticMarkup(<PkChart samples={SAMPLES} bpm={64} still />);
    expect(hasBeat(html)).toBe(false);
    expect(html).not.toContain('--lk-pk-beat');
  });

  it('the doses-derived (non-live) curve never beats, whatever the bpm', () => {
    const html = renderToStaticMarkup(<PkChart bpm={64} />); // default doses, no samples
    expect(hasBeat(html)).toBe(false);
    expect(html).not.toContain('--lk-pk-beat');
  });
});
