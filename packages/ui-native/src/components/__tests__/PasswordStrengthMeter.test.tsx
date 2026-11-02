import { describe, expect, test } from 'vitest';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { render } from './markup';

const RULES = [
  { id: 'length', label: '10+ characters', met: true },
  { id: 'case', label: 'Upper & lowercase', met: false },
];

/* As on web: the rules under the meter, each read with its met / unmet word; the app's names. */
describe('PasswordStrengthMeter', () => {
  test('lists the rules, each named with its state', () => {
    const html = render(PasswordStrengthMeter, { score: 2, rules: RULES, metLabel: ', done', unmetLabel: ', not yet' });
    expect(html).toContain('aria-label="10+ characters, done"');
    expect(html).toContain('aria-label="Upper &amp; lowercase, not yet"');
  });

  test('takes the app’s meter name and the label prefix', () => {
    const html = render(PasswordStrengthMeter, {
      score: 0,
      label: '—',
      labelPrefix: 'Strength:',
      accessibleLabel: 'Сила пароля: —',
    });
    expect(html).toContain('aria-label="Сила пароля: —"');
    expect(html).toContain('Strength:');
  });
});
