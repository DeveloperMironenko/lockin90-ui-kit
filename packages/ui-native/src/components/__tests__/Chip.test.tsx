/* Chip (native) — tone coloring, with focus on the `pr` tone added for the
   Finished-recap PR pills: it must use the dedicated off-spectrum PR red
   (#FF4757 border / #FF6B78 text), NOT `low`'s zoneLow (#FF4D6D) — a PR is a
   deliberate break from the spectrum, not a "low" status reading. */
import { describe, expect, test } from 'vitest';
import { Chip } from '../Chip';
import { ancestors, findByText, hasDeclaration, parse, render, type El } from './markup';

function carriesColor(el: El, rgb: string): boolean {
  return (el.attrs.style ?? '').includes(rgb) || hasDeclaration(el, rgb);
}

describe('Chip tone', () => {
  test("tone='pr' uses the dedicated PR red text (#FF6B78), not zoneLow", () => {
    const root = parse(render(Chip, { tone: 'pr', label: '1RM Bench 130kg' }));
    const label = findByText(root, '1RM Bench 130kg')!;
    expect(label).toBeDefined();
    expect(carriesColor(label, '255,107,120')).toBe(true); // #FF6B78
    expect(carriesColor(label, '255,77,109')).toBe(false); // NOT zoneLow ('low' tone)
    // the pill chrome (ancestor) carries the PR-red border/bg family, not zoneLow
    expect(ancestors(label).some((a) => carriesColor(a, '255,71,87'))).toBe(true);
  });

  test("tone='low' still uses zoneLow (unaffected by the new pr tone)", () => {
    const root = parse(render(Chip, { tone: 'low', label: 'Low' }));
    expect(carriesColor(findByText(root, 'Low')!, '255,77,109')).toBe(true);
  });

  test("size='sm' tone='pr' still carries the PR red text", () => {
    const root = parse(render(Chip, { tone: 'pr', size: 'sm', label: 'PR' }));
    expect(carriesColor(findByText(root, 'PR')!, '255,107,120')).toBe(true);
  });
});
