import { describe, expect, test } from 'vitest';
import { ListRow } from '../ListRow';
import { render } from './markup';

/* ListRow `disabled` (docs/sdd/components/ListRow.md): shown but unavailable — dimmed and announced. */
describe('ListRow disabled', () => {
  test('a disabled row is announced disabled, pressable or not', () => {
    const html = render(ListRow, { title: 'Security', disabled: true });
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('r-opacity');
    expect(render(ListRow, { title: 'Security', disabled: true, onPress: () => {} })).toContain(
      'aria-disabled="true"',
    );
  });

  test('a plain row is not', () => {
    const html = render(ListRow, { title: 'Security' });
    expect(html).not.toContain('aria-disabled');
  });
});
