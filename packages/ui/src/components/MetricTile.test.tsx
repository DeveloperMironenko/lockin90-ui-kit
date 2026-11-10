/* MetricTile — `size="sm"` is the settings readout tile (design web/settings.html .field). */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MetricTile } from './MetricTile';

describe('MetricTile size', () => {
  it('is the default tile without a size', () => {
    expect(renderToStaticMarkup(<MetricTile label="Age" value="31" />)).not.toContain('lk-metric-sm');
  });

  it('sm: the settings tile, empty or not', () => {
    expect(renderToStaticMarkup(<MetricTile size="sm" label="Age" value="31" unit="yrs" />)).toContain(
      'class="lk-metric lk-metric-sm"',
    );
    expect(renderToStaticMarkup(<MetricTile size="sm" label="Age" empty />)).toContain(
      'lk-metric lk-metric-empty lk-metric-sm',
    );
  });
});

describe('MetricTile hint', () => {
  it('shows its line under a value, as under the dash', () => {
    expect(renderToStaticMarkup(<MetricTile label="Height" value="183" hint="BMI 25.8" />)).toContain(
      '<span class="lk-metric-hint">BMI 25.8</span>',
    );
    expect(renderToStaticMarkup(<MetricTile label="Max HR" empty hint="no data yet" />)).toContain(
      '<span class="lk-metric-hint">no data yet</span>',
    );
  });
});

describe('MetricTile textValue', () => {
  it('marks a word value, so a phone draws it on one line', () => {
    expect(renderToStaticMarkup(<MetricTile size="sm" label="Sport" value="Powerlifting" textValue />)).toContain(
      'lk-metric-value lk-tnum lk-metric-word',
    );
    expect(renderToStaticMarkup(<MetricTile size="sm" label="Age" value="31" />)).not.toContain('lk-metric-word');
  });
});
