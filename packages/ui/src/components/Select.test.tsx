/* Select — the combobox (the element screen readers announce) must have a name:
   `aria-label` lands on the trigger, and a visible `label` names it via
   aria-labelledby; neither goes only to the wrapper div. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Select } from './Select';

const options = [{ value: 'en', label: 'English' }];
const trigger = (html: string) => html.match(/<button[^>]*role="combobox"[^>]*>/)?.[0] ?? '';

describe('Select accessible name', () => {
  it('puts aria-label on the combobox trigger, not on the wrapper', () => {
    const html = renderToStaticMarkup(<Select aria-label="Language" options={options} value="en" />);
    expect(trigger(html)).toContain('aria-label="Language"');
    expect(html).not.toMatch(/<div[^>]*class="lk-select-wrap"[^>]*aria-label=/);
  });

  it('names the trigger with the visible label via aria-labelledby', () => {
    const html = renderToStaticMarkup(<Select label="Units" options={options} value="en" />);
    const labelledby = trigger(html).match(/aria-labelledby="([^"]+)"/)?.[1];
    expect(labelledby).toBeTruthy();
    expect(html).toMatch(new RegExp(`<span id="${labelledby}" class="lk-select-label">Units`));
  });

  it('puts a caller aria-labelledby, aria-describedby and required on the trigger', () => {
    const html = renderToStaticMarkup(
      <Select aria-labelledby="h1" aria-describedby="err" required options={options} value="en" />,
    );
    expect(trigger(html)).toContain('aria-labelledby="h1"');
    expect(trigger(html)).toContain('aria-describedby="err"');
    expect(trigger(html)).toContain('aria-required="true"');
    expect(html).not.toMatch(/<div[^>]*class="lk-select-wrap"[^>]*aria-(labelledby|describedby)=/);
  });
});
