/* FormField — the label row can end with a link (the sign-in "Forgot password?"). */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormField } from './FormField';

describe('FormField labelAction', () => {
  it('renders the action in the label row, after the label', () => {
    const html = renderToStaticMarkup(
      <FormField label="Password" htmlFor="pw" labelAction={<a href="/forgot">Forgot password?</a>}>
        <input id="pw" />
      </FormField>,
    );
    expect(html).toMatch(/lk-field-label-row.*<label[^>]*>Password<\/label><a href="\/forgot">Forgot password\?<\/a><\/div>/);
  });
});
