/* SegmentedTabs — semantic tones (leading dot + active-only tint) vs the
   set-type COLOR tones (always-tinted label, NO dot, tinted active fill —
   the edit-set type selector, design `.sg`). */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SegmentedTabs, type SegmentedTabItem } from './SegmentedTabs';

const tabs: SegmentedTabItem[] = [
  { label: 'Warm-up', tone: 'amber' },
  { label: 'Working', tone: 'cyan' },
  { label: 'OK', tone: 'ok' },
];

/** Per-button markup chunks (opening tag + content), in order. */
const buttonsOf = (html: string) => html.split('</button>').slice(0, -1);

describe('SegmentedTabs color tones', () => {
  it('a color-tone segment tints its label at ALL times (colortone class) and shows NO dot', () => {
    const html = renderToStaticMarkup(<SegmentedTabs tabs={tabs} active={1} />);
    const [warmup, working, ok] = buttonsOf(html);
    // inactive color tone — still tinted, still dotless
    expect(warmup).toContain('lk-seg-amber');
    expect(warmup).toContain('lk-seg-colortone');
    expect(warmup).not.toContain('lk-seg-dot');
    expect(working).not.toContain('lk-seg-dot');
    // semantic tone keeps today's behavior exactly: dot, no colortone marker
    expect(ok).toContain('lk-seg-ok');
    expect(ok).toContain('lk-seg-dot');
    expect(ok).not.toContain('lk-seg-colortone');
  });

  it('the ACTIVE color-tone segment carries the tinted-fill classes', () => {
    const html = renderToStaticMarkup(<SegmentedTabs tabs={tabs} active={1} />);
    const working = buttonsOf(html)[1];
    expect(working).toContain('aria-selected="true"');
    expect(working).toContain('is-active');
    expect(working).toContain('lk-seg-cyan');
    expect(working).toContain('lk-seg-colortone');
  });

  it('maps all four set-type tones to their classes', () => {
    const html = renderToStaticMarkup(
      <SegmentedTabs
        tabs={[
          { label: 'Warm-up', tone: 'amber' },
          { label: 'Working', tone: 'cyan' },
          { label: 'Drop', tone: 'violet' },
          { label: 'Failure', tone: 'magenta' },
        ]}
        active={0}
      />,
    );
    for (const t of ['amber', 'cyan', 'violet', 'magenta'] as const) {
      expect(html).toContain(`lk-seg-${t}`);
    }
    expect(html).not.toContain('lk-seg-dot');
  });
});
