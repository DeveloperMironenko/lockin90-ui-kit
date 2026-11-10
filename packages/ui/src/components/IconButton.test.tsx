/* IconButton — one kit icon, no text: its name is the required label, which nothing can replace. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('is a type=button named by its label, showing the kit icon at 18px, hidden from screen readers', () => {
    const html = renderToStaticMarkup(<IconButton label="Change photo" icon="camera" />);
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Change photo"');
    expect(html).toContain('class="lk-icon-btn"');
    expect(html).toMatch(/<svg[^>]*width="18"/);
    expect(html).toContain('aria-hidden="true"');
  });

  it('sm draws a 16px icon and adds its size class; disabled passes through', () => {
    const html = renderToStaticMarkup(<IconButton label="Remove" icon="trash" size="sm" disabled />);
    expect(html).toContain('lk-icon-btn lk-icon-btn-sm');
    expect(html).toMatch(/<svg[^>]*width="16"/);
    expect(html).toContain('disabled=""');
  });

  it('keeps its label even when an aria-label comes in the rest props', () => {
    const rest = { 'aria-label': '' } as object;
    const html = renderToStaticMarkup(<IconButton label="Change photo" icon="camera" {...rest} />);
    expect(html).toContain('aria-label="Change photo"');
    expect(html).not.toContain('aria-label=""');
  });
});
