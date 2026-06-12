import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OAuthButton } from '../index';

describe('@lockin90/ui — OAuthButton', () => {
  it('renders a Google button (default label + 4-color G, white brand class)', () => {
    const { container } = render(<OAuthButton provider="google" />);
    const btn = screen.getByRole('button', { name: 'Continue with Google' });
    expect(btn).toHaveClass('lk-oauth', 'lk-oauth-google');
    expect(btn).toHaveAttribute('type', 'button');
    // the official 4-color G is the inline SVG
    const svg = container.querySelector('svg.lk-oauth-logo');
    expect(svg).toBeInTheDocument();
    const fills = Array.from(container.querySelectorAll('svg path')).map((p) =>
      p.getAttribute('fill'),
    );
    expect(fills).toEqual(
      expect.arrayContaining(['#4285F4', '#34A853', '#FBBC05', '#EA4335']),
    );
  });

  it('renders an Apple button (default label + white Apple glyph, black brand class)', () => {
    const { container } = render(<OAuthButton provider="apple" />);
    const btn = screen.getByRole('button', { name: 'Continue with Apple' });
    expect(btn).toHaveClass('lk-oauth', 'lk-oauth-apple');
    expect(container.querySelector('svg.lk-oauth-logo')).toBeInTheDocument();
    expect(container.querySelector('svg path')).toHaveAttribute('fill', '#FFFFFF');
  });

  it('allows overriding the label', () => {
    render(<OAuthButton provider="google" label="Sign up with Google" />);
    expect(
      screen.getByRole('button', { name: 'Sign up with Google' }),
    ).toBeInTheDocument();
  });

  it('forwards onClick when enabled', () => {
    let clicked = 0;
    render(<OAuthButton provider="apple" onClick={() => (clicked += 1)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Continue with Apple' }));
    expect(clicked).toBe(1);
  });

  it('loading shows a spinner, sets aria-busy, disables, and hides the logo', () => {
    let clicked = 0;
    const { container } = render(
      <OAuthButton provider="google" loading onClick={() => (clicked += 1)} />,
    );
    const btn = screen.getByRole('button', { name: 'Continue with Google' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
    expect(container.querySelector('.lk-oauth-spinner')).toBeInTheDocument();
    expect(container.querySelector('svg.lk-oauth-logo')).not.toBeInTheDocument();
    fireEvent.click(btn);
    expect(clicked).toBe(0);
  });

  it('disabled blocks clicks', () => {
    let clicked = 0;
    render(<OAuthButton provider="google" disabled onClick={() => (clicked += 1)} />);
    const btn = screen.getByRole('button', { name: 'Continue with Google' });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(clicked).toBe(0);
  });
});
