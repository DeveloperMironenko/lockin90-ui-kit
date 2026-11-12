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

describe('Button muted tone', () => {
  it('makes a text button the faint way out', () => {
    const html = renderToStaticMarkup(
      <Button variant="text" tone="muted">
        Skip setup
      </Button>,
    );
    expect(html).toContain('lk-btn-text');
    expect(html).toContain('lk-btn--tone-muted');
  });

  it('does nothing on a surface variant', () => {
    expect(renderToStaticMarkup(<Button tone="muted">Save</Button>)).not.toContain('lk-btn--tone-muted');
  });
});

describe('Button lg', () => {
  it('is the large closing CTA, on surface variants only', () => {
    expect(renderToStaticMarkup(<Button variant="primary" size="lg">Enter</Button>)).toContain('lk-btn-lg');
    expect(renderToStaticMarkup(<Button variant="text" size="lg">Enter</Button>)).not.toContain('lk-btn-lg');
  });
});

describe('Button loading', () => {
  it('keeps the label (and so the width), shows the kit Spinner, and says it is busy', () => {
    const html = renderToStaticMarkup(
      <Button variant="primary" loading>
        Save
      </Button>,
    );
    expect(html).toContain('lk-btn-loading');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('Save');
    expect(html).toMatch(/<span class="lk-btn-spin" aria-hidden="true"><div class="lk-spinner"/);
    expect(html).not.toContain('disabled');
  });

  it('is not busy by default', () => {
    const html = renderToStaticMarkup(<Button>Save</Button>);
    expect(html).not.toContain('aria-busy');
    expect(html).not.toContain('lk-btn-spin');
  });
});
