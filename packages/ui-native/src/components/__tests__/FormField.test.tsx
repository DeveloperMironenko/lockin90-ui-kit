import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { FormField } from '../FormField';
import { Button } from '../Button';
import { findByText, hasDeclaration, parse, render } from './markup';

/* The label row can end with a link (the sign-in "Forgot password?"). */
describe('FormField labelAction', () => {
  test('renders the action after the label', () => {
    const html = render(FormField, { label: 'Password', labelAction: <Text>Forgot password?</Text> });
    expect(html.indexOf('PASSWORD')).toBeGreaterThan(-1);
    expect(html.indexOf('Forgot password?')).toBeGreaterThan(html.indexOf('PASSWORD'));
  });

  test('renders the action without a label', () => {
    expect(render(FormField, { labelAction: <Text>Forgot password?</Text> })).toContain('Forgot password?');
  });
});

/* A long action ("¿Olvidaste tu contraseña?" at 320) goes to its own line and a text Button's label wraps:
 * nothing overflows the field. */
describe('FormField label row wraps', () => {
  test('the row wraps and the action sits at its end', () => {
    const root = parse(render(FormField, { label: 'Contraseña', labelAction: <Text>¿Olvidaste tu contraseña?</Text> }));
    const action = findByText(root, '¿Olvidaste tu contraseña?')!.parent!;
    expect(hasDeclaration(action, 'margin-left:auto')).toBe(true);
    expect(hasDeclaration(action.parent!, 'flex-wrap:wrap')).toBe(true);
  });

  test('a text Button label shrinks with its line (it wraps), never stays one fixed line', () => {
    const root = parse(render(Button, { variant: 'text', title: '¿Olvidaste tu contraseña?' }));
    const label = findByText(root, '¿Olvidaste tu contraseña?')!;
    expect(hasDeclaration(label, 'flex-shrink:1')).toBe(true);
    expect(hasDeclaration(label, 'white-space:nowrap')).toBe(false);
  });
});
