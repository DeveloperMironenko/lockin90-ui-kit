/* Alert — the quiet note tones (docs/sdd/components/Alert.md §3): `neutral` and `cyan` carry their own
   tone class (alert.css drops the accent bar and tints the icon cyan for them, not for signal tones),
   keep a glyph in the icon slot, and centre the icon only when the note is text alone. */
import { describe, expect, it } from 'vitest';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Alert } from './Alert';

/** The root's classes, and the icon slot's markup. */
const view = (el: ReactElement) => {
  const html = renderToStaticMarkup(el);
  const classes = (html.match(/^<div class="([^"]+)"/)?.[1] ?? '').split(' ');
  const iconSlot = html.match(/<span class="lk-alert-icon"[^>]*>(.*?)<\/span><div class="lk-alert-body">/)?.[1] ?? '';
  return { classes, iconSlot };
};

describe('Alert note tones', () => {
  it.each([
    ['neutral', 'lk-alert-neutral'],
    ['cyan', 'lk-alert-cyan'],
  ] as const)('%s carries its own tone class and no signal tone', (tone, cls) => {
    const { classes } = view(<Alert tone={tone}>Note</Alert>);
    expect(classes).toContain(cls);
    expect(classes.filter((c) => /^lk-alert-(info|success|warn|danger)$/.test(c))).toEqual([]);
  });

  it('gives a note a glyph unless the app passes its own', () => {
    expect(view(<Alert tone="neutral">Note</Alert>).iconSlot).toContain('<svg');
    const own = view(
      <Alert tone="cyan" icon={<svg data-own="" />}>
        Note
      </Alert>,
    );
    expect(own.iconSlot).toBe('<svg data-own=""></svg>');
  });

  it('marks a text-only alert, not one with a title or a dismiss', () => {
    expect(view(<Alert tone="neutral">Note</Alert>).classes).toContain('lk-alert--text-only');
    expect(view(<Alert tone="neutral" title="Heads up">Note</Alert>).classes).not.toContain('lk-alert--text-only');
    expect(view(<Alert tone="neutral" onDismiss={() => {}}>Note</Alert>).classes).not.toContain(
      'lk-alert--text-only',
    );
  });
});

describe('Alert violet note', () => {
  it('is a quiet note of its own: its tone class, a glyph, no signal tone', () => {
    const { classes, iconSlot } = view(<Alert tone="violet">Why we ask</Alert>);
    expect(classes).toContain('lk-alert-violet');
    expect(classes.filter((c) => /^lk-alert-(info|success|warn|danger)$/.test(c))).toEqual([]);
    expect(iconSlot).toContain('<svg');
  });
});
