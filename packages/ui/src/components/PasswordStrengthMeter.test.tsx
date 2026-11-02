/* PasswordStrengthMeter — the contract apps rely on (docs/sdd/components/PasswordStrengthMeter.md):
   a translatable meter name, the rule checklist read with the app's met/unmet words, a faint
   prefix, and a faint (not red) label before anything is typed. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

const RULES = [
  { id: 'len', label: '10+ characters', met: true },
  { id: 'num', label: 'A number', met: false },
];

describe('PasswordStrengthMeter', () => {
  it('names the meter "Password strength: <label>" by default', () => {
    const html = renderToStaticMarkup(<PasswordStrengthMeter score={3} />);
    expect(html).toMatch(/role="meter"[^>]*aria-label="Password strength: Good"/);
  });

  it("names the meter with the app's accessibleLabel", () => {
    const html = renderToStaticMarkup(
      <PasswordStrengthMeter score={3} label="Хороший" accessibleLabel="Надёжность пароля: Хороший" />,
    );
    expect(html).toContain('aria-label="Надёжность пароля: Хороший"');
    expect(html).not.toContain('Password strength');
  });

  it('renders each rule with its label and the met / unmet word, the tick hidden', () => {
    const html = renderToStaticMarkup(
      <PasswordStrengthMeter score={2} rules={RULES} metLabel=", done" unmetLabel=", not yet" />,
    );
    expect(html).toMatch(/<ul class="lk-pwstrength-rules">/);
    expect(html.match(/<li /g)).toHaveLength(2);
    expect(html).toMatch(
      /<li class="lk-pwstrength-rule is-met"><span class="lk-pwstrength-tick" aria-hidden="true">.*?<\/span>10\+ characters<span class="lk-sr-only">, done<\/span><\/li>/,
    );
    expect(html).toMatch(/<li class="lk-pwstrength-rule">.*?A number<span class="lk-sr-only">, not yet<\/span>/);
    expect(html).not.toContain('aria-live');
  });

  it('renders no list without rules, or with none', () => {
    expect(renderToStaticMarkup(<PasswordStrengthMeter score={2} />)).not.toContain('<ul');
    expect(
      renderToStaticMarkup(<PasswordStrengthMeter score={2} rules={[]} metLabel="" unmetLabel="" />),
    ).not.toContain('<ul');
  });

  it('reads the met word exactly as the app gives it', () => {
    const html = renderToStaticMarkup(
      <PasswordStrengthMeter score={2} rules={RULES} metLabel="，已满足" unmetLabel="，未满足" />,
    );
    expect(html).toContain('10+ characters<span class="lk-sr-only">，已满足</span>');
  });

  it('keeps the label row and the hint out of the meter, the hint describing it', () => {
    const html = renderToStaticMarkup(<PasswordStrengthMeter score={2} hint="2 rules to go" />);
    const id = html.match(/role="meter"[^>]*aria-describedby="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`<span id="${id}" class="lk-pwstrength-hint">2 rules to go</span>`);
    // the meter element holds only the segments
    expect(html).toMatch(/role="meter"[^>]*>(<i [^>]*><\/i>){4}<\/div><div class="lk-pwstrength-meta">/);
    expect(renderToStaticMarkup(<PasswordStrengthMeter score={2} />)).not.toContain('aria-describedby');
  });

  it('puts the faint prefix before the tinted label', () => {
    const html = renderToStaticMarkup(<PasswordStrengthMeter score={4} labelPrefix="Strength:" />);
    expect(html).toContain(
      '<span class="lk-pwstrength-prefix">Strength: <span class="lk-pwstrength-label">Strong</span></span>',
    );
  });

  it('makes the label faint at score 0 only', () => {
    expect(renderToStaticMarkup(<PasswordStrengthMeter score={0} label="—" />)).toContain(
      '<span class="lk-pwstrength-label is-empty">—</span>',
    );
    expect(renderToStaticMarkup(<PasswordStrengthMeter score={1} />)).not.toContain('is-empty');
  });
});
