/* ReauthDialog — its labels are passed in, translated (English by default), as native. */
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReauthDialog } from './ReauthDialog';

// the Modal portals once mounted in a browser; here its content renders in place
vi.mock('./Modal', () => ({
  Modal: ({ children, footer, closeLabel }: { children?: ReactNode; footer?: ReactNode; closeLabel?: string }) => (
    <div>
      <button aria-label={closeLabel} />
      {children}
      {footer}
    </div>
  ),
}));

describe('ReauthDialog labels', () => {
  it('shows the labels it is given', () => {
    const html = renderToStaticMarkup(
      <ReauthDialog
        open
        onClose={() => {}}
        hasGoogle
        passwordLabel="Пароль"
        passwordPlaceholder="Ваш пароль"
        confirmLabel="Видалити"
        cancelLabel="Скасувати"
        googleLabel="Підтвердити з Google"
        orLabel="або"
        closeLabel="Закрити"
      />,
    );
    for (const text of ['Закрити', 'Пароль', 'Ваш пароль', 'Видалити', 'Скасувати', 'Підтвердити з Google', 'або']) {
      expect(html).toContain(text);
    }
    expect(html).not.toContain('Cancel');
  });
});

/* U1 / U14: while busy there is always a way out, and nothing that had focus is disabled. */
describe('ReauthDialog busy', () => {
  const html = renderToStaticMarkup(<ReauthDialog open onClose={() => {}} hasGoogle loading cancelLabel="Cancelar" />);
  it('Cancel is never disabled', () => {
    expect(html).toMatch(/<button[^>]*class="[^"]*lk-reauth-cancel[^"]*"(?![^>]*disabled)[^>]*>/);
  });
  it('the field is read-only and busy, not disabled', () => {
    const input = html.match(/<input[^>]*>/)![0];
    expect(input.toLowerCase()).toContain('readonly');
    expect(input).toContain('aria-busy="true"');
    expect(input).not.toMatch(/\sdisabled/);
  });
  it('Google is announced unavailable but stays focusable', () => {
    const google = html.match(/<button[^>]*lk-reauth-google[^>]*>/)![0];
    expect(google).toContain('aria-disabled="true"');
    expect(google).not.toMatch(/\sdisabled=""/);
  });
});
