import { describe, expect, test } from 'vitest';
import { textStyles } from '@lockin90/tokens';
import { textStyle } from '../../theme';
import { hapticSelection, hapticSuccess } from '../../internal/optionalHaptics';

/* CONVENTIONS "Type": one table for web and native; native turns em tracking into points. */
describe('textStyle', () => {
  test('the label role is mono 11 / 500, .14em (1.54pt), uppercase', () => {
    expect(textStyle('label')).toMatchObject({ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: '500', letterSpacing: 1.54, textTransform: 'uppercase' });
  });
  test('every role follows the table (size, family) and only label is uppercase', () => {
    for (const role of Object.keys(textStyles) as (keyof typeof textStyles)[]) {
      const s = textStyle(role);
      expect(s.fontSize).toBe(textStyles[role].size);
      expect(s.textTransform === 'uppercase').toBe(role === 'label');
    }
    expect(textStyle('cardTitle')).toMatchObject({ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: '700' });
    expect(textStyle('control').fontSize).toBe(16);
  });
});

describe('haptics without expo-haptics', () => {
  test('selection and success are silent no-ops', () => {
    expect(() => {
      hapticSelection();
      hapticSuccess();
    }).not.toThrow();
  });
});
