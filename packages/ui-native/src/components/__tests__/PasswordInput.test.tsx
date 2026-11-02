import { describe, expect, test } from 'vitest';
import { PasswordInput } from '../PasswordInput';
import { render } from './markup';

/* The eye toggle names the action it does now: show while masked, hide while
 * revealed (one string couldn't, so apps' translated label went stale). */
describe('PasswordInput toggle label', () => {
  test('uses showLabel while masked', () => {
    const html = render(PasswordInput, { showLabel: 'Mostrar', hideLabel: 'Ocultar' });
    expect(html).toContain('aria-label="Mostrar"');
    expect(html).not.toContain('Ocultar');
  });

  test('uses hideLabel while revealed', () => {
    const html = render(PasswordInput, { defaultVisible: true, showLabel: 'Mostrar', hideLabel: 'Ocultar' });
    expect(html).toContain('aria-label="Ocultar"');
    expect(html).not.toContain('Mostrar');
  });
});
