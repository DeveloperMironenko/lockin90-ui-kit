/* Menu's trigger — by default the small menu button; `iconTrigger` puts it on IconButton's surface
   with its spoken name, and `disabled` stops it (the camera on a profile picture, while uploading). */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Menu } from './Menu';
import { Icon } from './Icon';

describe('Menu trigger', () => {
  it('is the small menu button by default', () => {
    const html = renderToStaticMarkup(<Menu items={[{ label: 'Edit' }]} />);
    expect(html).toContain('class="lk-menu-trigger"');
    expect(html).not.toContain('aria-label');
  });

  it('iconTrigger: on IconButton surface, named by label', () => {
    const html = renderToStaticMarkup(
      <Menu iconTrigger label="Change photo" trigger={<Icon name="camera" />} items={[{ label: 'Upload' }]} />,
    );
    expect(html).toContain('class="lk-icon-btn"');
    expect(html).toContain('aria-label="Change photo"');
    expect(html).toContain('aria-haspopup="menu"');
  });

  it('disabled: the trigger cannot be pressed', () => {
    const html = renderToStaticMarkup(<Menu disabled items={[{ label: 'Edit' }]} />);
    expect(html).toContain('aria-expanded="false"');
    expect(html).toMatch(/<button[^>]*disabled=""/);
  });

  it('iconTrigger needs a spoken name (a type error without one)', () => {
    // @ts-expect-error label is required with iconTrigger
    const html = renderToStaticMarkup(<Menu iconTrigger trigger={<Icon name="camera" />} />);
    expect(html).toContain('lk-icon-btn');
  });
});
