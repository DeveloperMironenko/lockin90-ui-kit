/* ListRow — `activeTint` overrides the active background via the
   --lk-listrow-active-bg custom property (design `.exl.on` cyan). */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ListRow } from './ListRow';

describe('ListRow activeTint', () => {
  it('sets the --lk-listrow-active-bg custom property on the active row', () => {
    const html = renderToStaticMarkup(
      <ListRow title="Incline DB Press" active activeTint="rgba(34,211,238,0.09)" onClick={() => {}} />,
    );
    expect(html).toContain('lk-listrow-active');
    expect(html).toContain('--lk-listrow-active-bg:rgba(34,211,238,0.09)');
  });

  it('default active row carries no override (accent tint from the stylesheet)', () => {
    const html = renderToStaticMarkup(<ListRow title="Row" active />);
    expect(html).toContain('lk-listrow-active');
    expect(html).not.toContain('--lk-listrow-active-bg');
  });
});
