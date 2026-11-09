/* `disabled` (docs/sdd/components/Menu.md, ListRow.md): a row shown but unavailable is announced so
   and can't be pressed. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ListRow } from './ListRow';

describe('ListRow disabled', () => {
  it('a static row is announced disabled and dimmed', () => {
    const html = renderToStaticMarkup(<ListRow title="Security" disabled />);
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('lk-listrow-disabled');
  });

  it('a pressable row becomes a disabled button, without the tappable look', () => {
    const html = renderToStaticMarkup(<ListRow title="Security" onClick={() => {}} disabled />);
    expect(html).toMatch(/<button[^>]*disabled=""/);
    expect(html).not.toContain('lk-listrow-tappable');
  });
});
