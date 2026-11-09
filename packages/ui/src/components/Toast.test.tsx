/* Toast `filled` (docs/sdd/components/Toast.md §2): the card takes the tone's color, its own class
   draws no rail and dark ink; without it the card is the glass one with the rail. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Toast } from './Toast';

describe('Toast filled', () => {
  it('adds lk-toast-filled beside the tone class', () => {
    const html = renderToStaticMarkup(<Toast tone="success" filled title="Name updated" />);
    expect(html).toContain('lk-toast-success');
    expect(html).toContain('lk-toast-filled');
    expect(html).toContain('Name updated');
  });

  it('is off by default', () => {
    expect(renderToStaticMarkup(<Toast tone="success" />)).not.toContain('lk-toast-filled');
  });
});
