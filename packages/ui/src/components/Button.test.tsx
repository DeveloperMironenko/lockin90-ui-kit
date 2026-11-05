/* Button `text` variant — the bare mono accent action ("Resend code"): its own class, not a
   surface variant's, and still a real <button type="button">. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from './Button';

describe('Button text variant', () => {
  it("variant='text' renders lk-btn-text on a type=button", () => {
    const html = renderToStaticMarkup(<Button variant="text">Resend code</Button>);
    expect(html).toContain('lk-btn-text');
    expect(html).not.toContain('lk-btn-ghost');
    expect(html).toContain('type="button"');
    expect(html).toContain('Resend code');
  });

  it('takes no size or tone: it has no surface to resize or paint', () => {
    const html = renderToStaticMarkup(
      <Button variant="text" size="sm" tone="danger">
        Remove
      </Button>,
    );
    expect(html).not.toContain('lk-btn-sm');
    expect(html).not.toContain('lk-btn--tone-danger');
  });
});
