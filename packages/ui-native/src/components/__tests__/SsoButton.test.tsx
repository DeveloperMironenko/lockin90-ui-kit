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
