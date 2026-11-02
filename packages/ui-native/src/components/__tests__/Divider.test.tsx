import { describe, expect, test } from 'vitest';
import { Divider } from '../Divider';
import { findByText, hasDeclaration, parse, render } from './markup';

/* The label keeps its translated text and is shown in capitals, as the web shows it. */
describe('Divider label', () => {
  test('keeps the text and shows it uppercase', () => {
    const label = findByText(parse(render(Divider, { label: 'or continue with' })), 'or continue with');
    expect(label).toBeDefined();
    expect(hasDeclaration(label!, 'text-transform:uppercase')).toBe(true);
  });
});
