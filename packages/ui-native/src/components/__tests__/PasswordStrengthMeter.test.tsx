import { describe, expect, test } from 'vitest';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { findAll, parse, render } from './markup';

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

/* Two columns at every width, as web: the rules two by two, an odd last one beside an empty cell. */
describe('PasswordStrengthMeter rules', () => {
  const named = (count: number) =>
    findAll(
      parse(
        render(PasswordStrengthMeter, {
          score: 1,
          rules: Array.from({ length: count }, (_, i) => ({ id: `r${i}`, label: `Rule ${i}`, met: false })),
          metLabel: ', done',
          unmetLabel: ', not yet',
        }),
      ),
      (el) => /^Rule \d, not yet$/.test(el.attrs['aria-label'] ?? ''),
    );

  test('puts the rules two to a row', () => {
    const rules = named(4);
    expect(rules.map((rule) => rule.parent)).toEqual([rules[0].parent, rules[0].parent, rules[2].parent, rules[2].parent]);
    expect(rules[0].parent).not.toBe(rules[2].parent);
  });

  test('keeps an odd last rule in its column', () => {
    const rules = named(3);
    expect(rules[2].parent?.children).toHaveLength(2);
  });
});
