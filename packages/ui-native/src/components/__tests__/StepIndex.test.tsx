/* StepIndex (native): the number, or a check once done. */
import { describe, expect, test } from 'vitest';
import { StepIndex } from '../StepIndex';
import { findByText, parse, render } from './markup';

describe('StepIndex', () => {
  test('shows the number', () => {
    const html = render(StepIndex, { step: 1 });
    expect(findByText(parse(html), '1')).toBeTruthy();
  });

  test('a check, no number, once done', () => {
    const html = render(StepIndex, { step: 2, done: true });
    expect(html).toContain('<svg');
    expect(findByText(parse(html), '2')).toBeUndefined();
  });
});
