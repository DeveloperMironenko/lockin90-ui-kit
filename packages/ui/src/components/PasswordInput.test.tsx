/* PasswordInput — the eye toggle names the action it does now: show while
   masked, hide while revealed. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput toggle label', () => {
  it('uses showLabel while masked', () => {
    const html = renderToStaticMarkup(<PasswordInput showLabel="Mostrar" hideLabel="Ocultar" />);
    expect(html).toContain('type="password"');
    expect(html).toContain('aria-label="Mostrar"');
  });

  it('uses hideLabel while revealed', () => {
    const html = renderToStaticMarkup(<PasswordInput defaultVisible showLabel="Mostrar" hideLabel="Ocultar" />);
    expect(html).toContain('type="text"');
    expect(html).toContain('aria-label="Ocultar"');
  });
});
