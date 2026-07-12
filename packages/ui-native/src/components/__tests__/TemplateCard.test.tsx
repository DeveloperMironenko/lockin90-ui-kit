/* TemplateCard (native) — source pills (coach mint / ai violet / manual
   none), the tinted edge bar, and the content lines. Mirrors the web twin. */
import { createElement } from 'react';
import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { TemplateCard } from '../TemplateCard';
import { findByText, hasDeclaration, parse, render, type El } from './markup';

function carriesColor(el: El, rgb: string): boolean {
  return (el.attrs.style ?? '').includes(rgb) || hasDeclaration(el, rgb);
}

describe('TemplateCard', () => {
  test('renders name, meta, and lastUsed', () => {
    const root = parse(
      render(TemplateCard, {
        name: 'Push Day A',
        meta: 'Chest · Arms · 5 ex · ~48m',
        lastUsed: 'Last used 2d ago',
      }),
    );
    expect(findByText(root, 'Push Day A')).toBeDefined();
    expect(findByText(root, 'Chest · Arms · 5 ex · ~48m')).toBeDefined();
    expect(findByText(root, 'Last used 2d ago')).toBeDefined();
  });

  test('coach → mint COACH pill · ai → violet AI pill · manual → none', () => {
    const coach = parse(render(TemplateCard, { name: 'A', source: 'coach' }));
    const coachPill = findByText(coach, 'COACH');
    expect(coachPill).toBeDefined();
    expect(carriesColor(coachPill!, '52,245,197')).toBe(true); // mint
    const ai = parse(render(TemplateCard, { name: 'B', source: 'ai' }));
    const aiPill = findByText(ai, 'AI');
    expect(aiPill).toBeDefined();
    expect(carriesColor(aiPill!, '124,92,255')).toBe(true); // accent
    const manual = parse(render(TemplateCard, { name: 'C', source: 'manual' }));
    expect(findByText(manual, 'COACH')).toBeUndefined();
    expect(findByText(manual, 'AI')).toBeUndefined();
  });

  test('tint paints the left edge bar; trailing slot renders', () => {
    const html = render(TemplateCard, {
      name: 'A',
      tint: '#22D3EE',
      trailing: createElement(Text, null, '~48m'),
    });
    expect(html).toContain('34,211,238'); // the tinted bar
    expect(findByText(parse(html), '~48m')).toBeDefined();
  });

  test('onPress renders a pressable card (button role)', () => {
    const html = render(TemplateCard, { name: 'A', onPress: () => {} });
    expect(html).toContain('role="button"');
    const still = render(TemplateCard, { name: 'A' });
    expect(still).not.toContain('role="button"');
  });
});
