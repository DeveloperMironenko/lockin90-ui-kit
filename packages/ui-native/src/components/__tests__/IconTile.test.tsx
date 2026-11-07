/* IconTile (native): the icon on its tile. */
import { describe, expect, test } from 'vitest';
import { IconTile } from '../IconTile';
import { render } from './markup';

describe('IconTile', () => {
  test('draws the icon', () => {
    const html = render(IconTile, { icon: 'user' });
    expect(html).toContain('<svg');
  });
});
