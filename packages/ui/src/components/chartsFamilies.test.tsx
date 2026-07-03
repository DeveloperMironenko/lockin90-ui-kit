/* Render smoke tests for the SupplementChart / BodyBattery / CaffeineClock /
   VitalsStrip families: every catalog variant renders to static markup,
   empty data never crashes, and the model-derived annotations (bed verdicts,
   threshold crossings, LAST SAFE COFFEE, LOW dip, anomaly auto-detect)
   reproduce the catalog cards' values. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SupplementChart } from './SupplementChart';
import { BodyBattery } from './BodyBattery';
import { CaffeineClock } from './CaffeineClock';
import { VitalsStrip } from './VitalsStrip';

describe('new chart families render', () => {
  it('SupplementChart — all variants', () => {
    for (const variant of [
      'saturation-story',
      'active-stack',
      'half-life',
      'dose-level',
      'depletion-forecast',
      'adherence-level',
      'stack-levels',
      'liquid-batteries',
      'battery-hero',
    ] as const) {
      const html = renderToStaticMarkup(<SupplementChart variant={variant} title="T" shine />);
      expect(html, variant).toContain('<svg');
    }
    // empty-data safety
    expect(renderToStaticMarkup(<SupplementChart doses={[]} />)).toContain('<svg');
    expect(renderToStaticMarkup(<SupplementChart variant="dose-level" doses={[]} />)).toContain('<svg');
    expect(renderToStaticMarkup(<SupplementChart variant="adherence-level" doses={[]} />)).toContain('<svg');
    expect(renderToStaticMarkup(<SupplementChart variant="depletion-forecast" levels={[]} />)).toContain('<svg');
    expect(renderToStaticMarkup(<SupplementChart doses={[true, false, true]} />)).toContain('<svg');
  });

  it('BodyBattery — all variants + states', () => {
    for (const variant of ['battery-day', 'battery-glyph', 'drain-events', 'battery-week', 'battery-vs'] as const) {
      const html = renderToStaticMarkup(<BodyBattery variant={variant} now={0.62} shine />);
      expect(html, variant).toContain('<svg');
    }
    for (const state of ['level', 'charging', 'low'] as const) {
      expect(renderToStaticMarkup(<BodyBattery variant="battery-glyph" state={state} />)).toContain('<svg');
    }
    expect(renderToStaticMarkup(<BodyBattery levels={[]} now={0.5} />)).toContain('<svg');
    expect(renderToStaticMarkup(<BodyBattery variant="drain-events" levels={[]} />)).toContain('<svg');
  });

  it('CaffeineClock — all variants + derived verdicts', () => {
    for (const variant of ['decay-curve', 'stacked-doses', 'safe-window'] as const) {
      expect(renderToStaticMarkup(<CaffeineClock variant={variant} shine />), variant).toContain('<svg');
    }
    // CF-01 default: 120mg at 8:30, bed 23:00 → 21MG ✓ verdict + 15:4x crossing
    const cf1 = renderToStaticMarkup(<CaffeineClock />);
    expect(cf1).toContain('BED · 21MG ✓');
    expect(cf1).toContain('UNDER 50MG · 15:4');
    // CF-02 default: 3 doses → 54MG ⚠ at bed
    const cf2 = renderToStaticMarkup(<CaffeineClock variant="stacked-doses" />);
    expect(cf2).toContain('BED · 54MG ⚠');
    // CF-03: cut = 23 − 5.7 = 17.3 → 17:18
    const cf3 = renderToStaticMarkup(<CaffeineClock variant="safe-window" />);
    expect(cf3).toContain('LAST SAFE COFFEE · 17:18');
    expect(renderToStaticMarkup(<CaffeineClock doses={[]} variant="safe-window" />)).toContain('<svg');
    expect(renderToStaticMarkup(<CaffeineClock doses={[]} />)).toContain('<svg');
    expect(renderToStaticMarkup(<CaffeineClock doses={[]} variant="stacked-doses" />)).toContain('<svg');
  });

  it('VitalsStrip — all variants', () => {
    for (const variant of ['ecg-strip', 'hrv-rhythm', 'monitor', 'night-hr', 'anomaly-beat'] as const) {
      expect(renderToStaticMarkup(<VitalsStrip variant={variant} shine />), variant).toContain('<svg');
    }
    // VT-05 auto-detects the shortest RR (564ms premature beat)
    expect(renderToStaticMarkup(<VitalsStrip variant="anomaly-beat" />)).toContain('IRREGULAR · 1 BEAT');
    // VT-04 dip label derives from the minimum
    expect(renderToStaticMarkup(<VitalsStrip variant="night-hr" lowLabel={undefined} />)).toContain('LOW 44');
    expect(renderToStaticMarkup(<VitalsStrip rr={[]} />)).toContain('<svg');
    expect(renderToStaticMarkup(<VitalsStrip variant="anomaly-beat" rr={[]} />)).toContain('<svg');
    expect(renderToStaticMarkup(<VitalsStrip variant="night-hr" nightBpm={[]} />)).toContain('<svg');
  });
});
