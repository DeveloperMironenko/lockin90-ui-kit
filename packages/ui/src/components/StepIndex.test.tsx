/* StepIndex (docs/sdd/components/StepIndex.md): the number, or a check once done; hidden from
   assistive tech (the title beside it says the step). */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StepIndex } from './StepIndex';

describe('StepIndex', () => {
  it('shows the step number on the gradient tile', () => {
    const html = renderToStaticMarkup(<StepIndex step={3} />);
    expect(html).toMatch(/^<span aria-hidden="true" class="lk-stepindex">3<\/span>$/);
  });

  it('shows a check in place of the number once done', () => {
    const html = renderToStaticMarkup(<StepIndex step={3} done />);
    expect(html).toContain('lk-stepindex--done');
    expect(html).toContain('<svg');
    expect(html).not.toContain('>3<');
  });
});
