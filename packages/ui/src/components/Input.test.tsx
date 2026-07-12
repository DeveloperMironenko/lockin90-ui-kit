/* Input — the `numeral` variant added for the edit-set weight/reps readout
   (design `.strow .sv`): 20px bold display-font, centered, with the unit
   suffix styled as a smaller dim companion instead of the default mono
   far-right suffix. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Input } from './Input';

describe('Input variant', () => {
  it("variant='numeral' renders the lk-input-numeral class", () => {
    const html = renderToStaticMarkup(<Input variant="numeral" value="120" unit="kg" readOnly />);
    expect(html).toContain('lk-input-numeral');
    expect(html).toContain('kg');
  });

  it('default variant does NOT render the numeral class', () => {
    const html = renderToStaticMarkup(<Input value="120" readOnly />);
    expect(html).not.toContain('lk-input-numeral');
  });
});
