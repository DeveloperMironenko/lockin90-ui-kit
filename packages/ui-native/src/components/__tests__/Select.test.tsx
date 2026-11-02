import { describe, expect, test } from 'vitest';
import { Select } from '../Select';
import { render } from './markup';

const OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'uk', label: 'Українська' },
];

/* The trigger has a name for screen readers even with no visible label (the
 * language picker), not just the selected value. */
describe('Select trigger name', () => {
  test('takes accessibilityLabel', () => {
    const html = render(Select, { options: OPTIONS, value: 'en', accessibilityLabel: 'Мова' });
    expect(html).toContain('aria-label="Мова"');
  });

  test('falls back to the visible label', () => {
    const html = render(Select, { options: OPTIONS, value: 'en', label: 'Language' });
    expect(html).toContain('aria-label="Language"');
  });
});
