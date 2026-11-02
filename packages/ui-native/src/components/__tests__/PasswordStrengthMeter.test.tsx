import { describe, expect, test } from 'vitest';
import { colors } from '@lockin90/tokens';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { findAll, findByText, inlineStyle, parse, render } from './markup';

/* The contract apps rely on (docs/sdd/components/PasswordStrengthMeter.md): a translatable meter
 * name, each rule one screen-reader stop read with the app's met/unmet word, a faint prefix, and a
 * faint (not red) label before anything is typed. accessibilityLabel renders as aria-label. */

const RULES = [
  { id: 'len', label: '8+ characters', met: true },
  { id: 'case', label: 'Upper & lowercase', met: false },
  { id: 'num', label: 'Number or symbol', met: false },
];

/** react-native-web writes an inline `#RRGGBB` colour as `rgba(r,g,b,1.00)`. */
const rgba = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},1.00)`;
};
const labelColor = (html: string, text: string) => inlineStyle(findByText(parse(html), text)!).color;

describe('PasswordStrengthMeter', () => {
  test('names the meter "Password strength: <label>" by default', () => {
    expect(render(PasswordStrengthMeter, { score: 3 })).toContain('aria-label="Password strength: Good"');
  });

  test("names the meter with the app's accessibleLabel", () => {
    const html = render(PasswordStrengthMeter, {
      score: 3,
      label: 'Хороший',
      accessibleLabel: 'Надёжность пароля: Хороший',
    });
    expect(html).toContain('aria-label="Надёжность пароля: Хороший"');
    expect(html).not.toContain('Password strength');
  });

  test('reads each rule as one stop: its label, then the met / unmet word', () => {
    const html = render(PasswordStrengthMeter, {
      score: 2,
      rules: RULES,
      metLabel: ', done',
      unmetLabel: ', not yet',
    });
    expect(html).toContain('aria-label="8+ characters, done"');
    expect(html).toContain('aria-label="Upper &amp; lowercase, not yet"');
    expect(html).toContain('aria-label="Number or symbol, not yet"');
    expect(html).not.toContain('checkbox');
  });

  test('reads the met word exactly as the app gives it', () => {
    const html = render(PasswordStrengthMeter, { score: 2, rules: RULES, metLabel: '，已满足', unmetLabel: '，未满足' });
    expect(html).toContain('aria-label="8+ characters，已满足"');
  });

  test('renders no rules when the list is empty', () => {
    const html = render(PasswordStrengthMeter, { score: 2, rules: [], metLabel: ', done', unmetLabel: ', not yet' });
    expect(findAll(parse(html), (e) => e.tag === 'svg')).toHaveLength(0);
  });

  test('keeps the label row out of the meter, the hint describing it', () => {
    const tree = parse(render(PasswordStrengthMeter, { score: 2, hint: '2 rules to go' }));
    const [meter] = findAll(tree, (e) => e.attrs.role === 'progressbar');
    expect(meter.children).toHaveLength(4);
    expect(findByText(meter, '2 rules to go')).toBeUndefined();
  });

  test('an odd last rule keeps half the row (a spacer fills the second column)', () => {
    const tree = parse(
      render(PasswordStrengthMeter, { score: 2, rules: RULES, metLabel: ', done', unmetLabel: ', not yet' }),
    );
    const last = findAll(tree, (e) => e.attrs['aria-label'] === 'Number or symbol, not yet')[0];
    const row = last.parent!;
    expect(row.children).toHaveLength(2);
    expect(row.children[1].attrs['aria-label']).toBeUndefined();
    expect(row.children[1].children).toHaveLength(0);
  });

  test('lays the rules out in rows of two', () => {
    const tree = parse(
      render(PasswordStrengthMeter, { score: 2, rules: RULES, metLabel: ', done', unmetLabel: ', not yet' }),
    );
    const rows = findAll(tree, (e) => e.children.some((c) => c.attrs['aria-label']?.endsWith(', done')));
    expect(rows).toHaveLength(1);
    expect(rows[0].children).toHaveLength(2);
  });

  test('puts the faint prefix before the label', () => {
    const tree = parse(render(PasswordStrengthMeter, { score: 4, labelPrefix: 'Strength:' }));
    const prefix = findByText(tree, 'Strength:');
    expect(prefix?.children.map((c) => c.text)).toEqual(['Strong']);
  });

  test('makes the label faint at score 0, tinted from score 1', () => {
    expect(labelColor(render(PasswordStrengthMeter, { score: 0, label: '—' }), '—')).toBe(rgba(colors.textFaint));
    expect(labelColor(render(PasswordStrengthMeter, { score: 1 }), 'Weak')).toBe(rgba(colors.bad));
  });
});
