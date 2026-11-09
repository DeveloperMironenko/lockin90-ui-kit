import { describe, expect, test } from 'vitest';
import { Button, type ButtonProps } from '../Button';
import { ancestors, findByText, hasDeclaration, parse, render } from './markup';

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

/* `muted`: the faint way out on a text button ("Skip setup", web `.lk-btn--tone-muted`). */
describe('Button muted tone', () => {
  test('faint 12.5 mono', () => {
    const label = findByText(parse(render(Button, { variant: 'text', tone: 'muted', title: 'Skip setup' })), 'Skip setup')!;
    expect(hasDeclaration(label, 'font-size:12.5px')).toBe(true);
    expect(hasDeclaration(label, 'color:rgba(130,139,159,1.00)')).toBe(true);
  });
});

describe('Button lg', () => {
  test('the 17 label', () => {
    const label = findByText(parse(render(Button, { variant: 'primary', size: 'lg', title: 'Enter' })), 'Enter')!;
    expect(label.attrs.style ?? '').toContain('font-size:17px');
  });
});

/* Disabled dims the whole surface to .5, as web `.lk-btn:disabled` (the `text` variant fades its label instead). */
describe('Button disabled', () => {
  const dimmed = (props: Partial<ButtonProps>) => {
    const label = findByText(parse(render(Button, { title: 'Save', ...props })), 'Save')!;
    return [label, ...ancestors(label)].some((el) => hasDeclaration(el, 'opacity:0.5'));
  };

  const cases: [string, Partial<ButtonProps>][] = [
    ['default', {}],
    ['primary', { variant: 'primary' }],
    ['ghost', { variant: 'ghost' }],
    ['solid danger', { tone: 'danger' }],
    ['ghost danger', { variant: 'ghost', tone: 'danger' }],
  ];
  for (const [name, props] of cases) {
    test(`${name} at half strength when disabled, full otherwise`, () => {
      expect(dimmed({ ...props, disabled: true })).toBe(true);
      expect(dimmed(props)).toBe(false);
    });
  }

  test('an announced-only disabled state stays at full strength: the button still takes presses', () => {
    expect(dimmed({ variant: 'primary', accessibilityState: { disabled: true } })).toBe(false);
    expect(dimmed({ variant: 'primary', 'aria-disabled': true })).toBe(false);
  });

  test('the text variant stays at full strength', () => {
    expect(dimmed({ variant: 'text', disabled: true })).toBe(false);
  });
});
