/* Chip — tone coloring, with focus on the `pr` tone added for the
   Finished-recap PR pills: it must use the dedicated off-spectrum PR red
   (#FF4757 border / #FF6B78 text via `lk-pr`), NOT `low`'s zoneLow — a PR is
   a deliberate break from the spectrum, not a "low" status reading. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Chip } from './Chip';

describe('Chip tone', () => {
  it("tone='pr' renders the lk-pr class, not lk-low", () => {
    const html = renderToStaticMarkup(<Chip tone="pr">1RM Bench 130kg</Chip>);
    expect(html).toContain('lk-pr');
    expect(html).not.toContain('lk-low');
    expect(html).toContain('1RM Bench 130kg');
  });

  it("tone='low' still renders lk-low (unaffected by the new pr tone)", () => {
    const html = renderToStaticMarkup(<Chip tone="low">Low</Chip>);
    expect(html).toContain('lk-low');
  });

  it("size='sm' tone='pr' still carries lk-pr", () => {
    const html = renderToStaticMarkup(
      <Chip tone="pr" size="sm">
        PR
      </Chip>,
    );
    expect(html).toContain('lk-chip-sm');
    expect(html).toContain('lk-pr');
  });
});
