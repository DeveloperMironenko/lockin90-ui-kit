import { describe, expect, test } from 'vitest';
import { Button } from '../Button';
import { render } from './markup';

/* Screen readers announce every variant as a button. */
describe('Button role', () => {
  for (const variant of ['primary', 'ghost'] as const) {
    test(`${variant} is a button`, () => {
      expect(render(Button, { variant, title: 'Sign in' })).toMatch(/role="button"/);
    });
  }
});
