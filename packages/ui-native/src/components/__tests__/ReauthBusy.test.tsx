// @vitest-environment happy-dom
/// <reference lib="dom" />
/* ReauthDialog busy (U1 / U14): Cancel and the × always work; the field is read-only, not disabled; Google
   ignores presses but stays focusable. */
import { describe, expect, test } from 'vitest';
import { ReauthDialog } from '../ReauthDialog';
import { mount, propOf } from './dom';

describe('ReauthDialog loading', () => {
  test('a way out and nothing disabled', () => {
    let closed = 0;
    let google = 0;
    const view = mount(
      <ReauthDialog open loading hasGoogle onClose={() => (closed += 1)} onGoogle={() => (google += 1)} cancelLabel="Cancelar" closeLabel="Cerrar" />,
    );
    const cancel = document.querySelector('[aria-label="Cancelar"]')!;
    expect(propOf(cancel, 'disabled')).not.toBe(true);
    (propOf(cancel, 'onPress') as () => void)();
    (propOf(document.querySelector('[aria-label="Cerrar"]')!, 'onPress') as () => void)();
    expect(closed).toBe(2);
    const g = document.querySelector('[aria-label="Continue with Google"]')!;
    expect(propOf(g, 'disabled')).not.toBe(true);
    (propOf(g, 'onPress') as () => void)();
    expect(google).toBe(0);
    const input = document.querySelector('input')!;
    expect(propOf(input, 'editable')).toBe(false);
    view.unmount();
  });
});
