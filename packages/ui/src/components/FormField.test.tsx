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

  it('renders the action without a label', () => {
    const html = renderToStaticMarkup(
      <FormField labelAction={<a href="/forgot">Forgot password?</a>}>
        <input />
      </FormField>,
    );
    expect(html).toContain('Forgot password?');
  });
});

describe('FormField names and describes its control', () => {
  const attr = (html: string, tag: string, name: string) =>
    html.match(new RegExp(`<${tag}[^>]*\\s${name}="([^"]*)"`))?.[1];

  it('ties the label to the control with a generated id', () => {
    const html = renderToStaticMarkup(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    const id = attr(html, 'input', 'id');
    expect(id).toBeTruthy();
    expect(attr(html, 'label', 'for')).toBe(id);
  });

  it('keeps the control’s own id and the given htmlFor', () => {
    const html = renderToStaticMarkup(
      <FormField label="Email" htmlFor="em">
        <input id="em" />
      </FormField>,
    );
    expect(attr(html, 'input', 'id')).toBe('em');
    expect(attr(html, 'label', 'for')).toBe('em');
  });

  it('links the error, keeps it an alert and marks the field required', () => {
    const html = renderToStaticMarkup(
      <FormField label="Email" required error="Enter your email">
        <input aria-describedby="hint" />
      </FormField>,
    );
    const errorId = attr(html, 'p', 'id');
    expect(html).toMatch(/<p id="[^"]+" class="lk-field-error" role="alert">/);
    expect(attr(html, 'input', 'aria-describedby')).toBe(`hint ${errorId}`);
    expect(attr(html, 'input', 'aria-required')).toBe('true');
  });

  it('links the help when there is no error', () => {
    const html = renderToStaticMarkup(
      <FormField label="Name" help="As on your passport">
        <input />
      </FormField>,
    );
    expect(attr(html, 'input', 'aria-describedby')).toBe(attr(html, 'p', 'id'));
    expect(attr(html, 'input', 'aria-required')).toBeUndefined();
  });
});
