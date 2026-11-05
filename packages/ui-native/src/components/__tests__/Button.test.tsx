import { describe, expect, test } from 'vitest';
import { Button } from '../Button';
import { findByText, hasDeclaration, parse, render } from './markup';

/* Screen readers announce every variant as a button. */
describe('Button role', () => {
  for (const variant of ['primary', 'ghost', 'text'] as const) {
    test(`${variant} is a button`, () => {
      expect(render(Button, { variant, title: 'Sign in' })).toMatch(/role="button"/);
    });
  }
});

/* `text`: the label is the button — mono accent, faint when disabled (web `.lk-btn-text`). */
describe('Button text variant', () => {
  const label = (disabled: boolean) =>
    findByText(parse(render(Button, { variant: 'text', title: 'Resend code', disabled })), 'Resend code')!;

  test('mono 11.5 on a 17 line, in the accent', () => {
    expect(hasDeclaration(label(false), 'font-family:JetBrains Mono')).toBe(true);
    expect(hasDeclaration(label(false), 'font-size:11.5px')).toBe(true);
    expect(hasDeclaration(label(false), 'line-height:17px')).toBe(true);
    expect(hasDeclaration(label(false), 'color:rgba(34,211,238,1.00)')).toBe(true);
  });

  test('faint when disabled', () => {
    expect(hasDeclaration(label(true), 'color:rgba(130,139,159,1.00)')).toBe(true);
  });
});
