import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { FormField } from '../FormField';
import { render } from './markup';

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
