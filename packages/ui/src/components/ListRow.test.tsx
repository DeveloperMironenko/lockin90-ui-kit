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

describe('ListRow boxed', () => {
  it('marks a row of its own', () => {
    const html = renderToStaticMarkup(<ListRow boxed title="Profile" subtitle="32 yrs" />);
    expect(html).toContain('lk-listrow-boxed');
    expect(renderToStaticMarkup(<ListRow title="Profile" />)).not.toContain('lk-listrow-boxed');
  });
});

describe('ListRow disabled', () => {
  it('a static row is a group announced unavailable, dimmed', () => {
    const html = renderToStaticMarkup(<ListRow title="Security" disabled />);
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('lk-listrow-disabled');
  });

  it('a pressable row stays a focusable button, announced unavailable, without the tappable look', () => {
    const html = renderToStaticMarkup(<ListRow title="Security" onClick={() => {}} disabled />);
    expect(html).toMatch(/<button[^>]*aria-disabled="true"/);
    expect(html).not.toMatch(/<button[^>]* disabled=""/);
    expect(html).not.toContain('lk-listrow-tappable');
  });
});
