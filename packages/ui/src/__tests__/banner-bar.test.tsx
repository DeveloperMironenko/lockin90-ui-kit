import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Banner } from '../index';

// Parity contract: the web Banner renders the SAME 3px tone-colored vertical
// accent bar as the native @lockin90/ui-native Banner, so web ≡ mobile.
describe('@lockin90/ui — Banner', () => {
  it('renders a 3px tone-colored vertical accent bar (web ≡ native)', () => {
    const { container } = render(<Banner tone="bad">Invalid email or password</Banner>);
    // The bar is the first child span — 3px wide, full-height (stretch), tone color.
    const bar = container.querySelector('span[aria-hidden]') as HTMLElement | null;
    expect(bar).not.toBeNull();
    expect(bar!.style.width).toBe('3px');
    expect(bar!.style.alignSelf).toBe('stretch');
    expect(bar!.style.background).toContain('--bad');
  });

  it('keeps the message text accessible alongside the bar', () => {
    render(<Banner tone="bad">Invalid email or password</Banner>);
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
