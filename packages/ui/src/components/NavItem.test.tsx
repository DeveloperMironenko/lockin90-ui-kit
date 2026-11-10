/* NavItem — a real link; the current page says so (aria-current) and carries the active look. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  it('is a link with its label', () => {
    const html = renderToStaticMarkup(<NavItem href="/settings" label="Settings" />);
    expect(html).toContain('<a href="/settings"');
    expect(html).toContain('Settings');
    expect(html).not.toContain('aria-current');
  });

  it('active: the current page', () => {
    const html = renderToStaticMarkup(<NavItem href="/settings" label="Settings" active />);
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('lk-nav-item-active');
  });

  it('sm: the section list row, no edge bar', () => {
    const html = renderToStaticMarkup(<NavItem href="#profile" label="Profile" size="sm" active />);
    expect(html).toContain('lk-nav-item lk-nav-item-sm lk-nav-item-active');
  });
});
