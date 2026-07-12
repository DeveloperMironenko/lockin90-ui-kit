/* PrCard — the red-hot treatment (new/atPeak: tinted border class + red
   PrBadge tag), the quiet amber offPeak text tag, and the content lines. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PrCard } from './PrCard';

describe('PrCard', () => {
  it('renders name, kind, value, detail', () => {
    const html = renderToStaticMarkup(
      <PrCard name="Back Squat" kind="Estimated 1RM" value="130 kg" detail="today · +2kg" />,
    );
    expect(html).toContain('Back Squat');
    expect(html).toContain('Estimated 1RM');
    expect(html).toContain('130 kg');
    expect(html).toContain('today · +2kg');
    expect(html).not.toContain('lk-prcard-hot'); // no state → plain card
  });

  it('new → red treatment + NEW badge', () => {
    const html = renderToStaticMarkup(<PrCard name="A" kind="1RM" value="130 kg" state="new" />);
    expect(html).toContain('lk-prcard-hot');
    expect(html).toContain('lk-prbadge');
    expect(html).toContain('NEW');
  });

  it('atPeak → red treatment + AT PEAK badge', () => {
    const html = renderToStaticMarkup(<PrCard name="A" kind="1RM" value="130 kg" state="atPeak" />);
    expect(html).toContain('lk-prcard-hot');
    expect(html).toContain('AT PEAK');
  });

  it('offPeak → plain surface + amber text tag (no red badge)', () => {
    const html = renderToStaticMarkup(<PrCard name="A" kind="1RM" value="130 kg" state="offPeak" />);
    expect(html).not.toContain('lk-prcard-hot');
    expect(html).not.toContain('lk-prbadge');
    expect(html).toContain('lk-prcard-off');
    expect(html).toContain('OFF PEAK');
  });

  it('onPress renders a <button>', () => {
    const html = renderToStaticMarkup(<PrCard name="A" kind="1RM" value="130 kg" onPress={() => {}} />);
    expect(html).toMatch(/^<button/);
  });
});
