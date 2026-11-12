// @vitest-environment happy-dom
/// <reference lib="dom" />
import { describe, expect, test } from 'vitest';
import { SsoButton } from '../SsoButton';
import { render } from './markup';

/* The app's translated name replaces the built-in English one. */
describe('SsoButton name', () => {
  test('defaults to the English name', () => {
    expect(render(SsoButton, { provider: 'google' })).toContain('aria-label="Continue with Google"');
  });

  test('takes the app’s accessibilityLabel', () => {
    const html = render(SsoButton, { provider: 'apple', accessibilityLabel: 'Продовжити з Apple' });
    expect(html).toContain('aria-label="Продовжити з Apple"');
  });
});

/* U6: busy while the provider's sheet is open or its token is exchanged. */
describe('SsoButton loading', () => {
  test('is announced busy and ignores presses', async () => {
    const { mount, propOf } = await import('./dom');
    let pressed = 0;
    const view = mount(<SsoButton provider="google" loading onPress={() => (pressed += 1)} />);
    const button = view.host.querySelector('[role="button"]')!;
    expect((propOf(button, 'accessibilityState') as { busy?: boolean }).busy).toBe(true);
    (propOf(button, 'onPress') as () => void)();
    expect(pressed).toBe(0);
    view.unmount();
  });
});
