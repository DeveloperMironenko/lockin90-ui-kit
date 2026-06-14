import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepDots, OptionCard } from '../index';

describe('@lockin90/ui — onboarding primitives', () => {
  it('renders StepDots with done / active / todo segments', () => {
    const { container } = render(<StepDots current={2} total={4} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(bar).toHaveAttribute('aria-valuemax', '4');
    expect(container.querySelectorAll('.lk-stepdot')).toHaveLength(4);
    expect(container.querySelectorAll('.lk-stepdot-done')).toHaveLength(1);
    expect(container.querySelectorAll('.lk-stepdot-active')).toHaveLength(1);
    expect(container.querySelectorAll('.lk-stepdot-todo')).toHaveLength(2);
  });

  it('renders an OptionCard as a button and fires onSelect', () => {
    let clicked = 0;
    render(
      <OptionCard title="Apple Watch" description="HR + sleep" onSelect={() => (clicked += 1)} />,
    );
    const btn = screen.getByRole('button', { name: /Apple Watch/ });
    expect(btn).toHaveClass('lk-optioncard');
    expect(screen.getByText('HR + sleep')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(clicked).toBe(1);
  });

  it('reflects selected and disabled states', () => {
    const { rerender } = render(<OptionCard title="Oura" selected />);
    const btn = screen.getByRole('button', { name: /Oura/ });
    expect(btn).toHaveClass('lk-selected');
    expect(btn).toHaveAttribute('aria-pressed', 'true');

    let clicked = 0;
    rerender(<OptionCard title="Oura" disabled onSelect={() => (clicked += 1)} />);
    const disabledBtn = screen.getByRole('button', { name: /Oura/ });
    expect(disabledBtn).toHaveClass('lk-disabled');
    expect(disabledBtn).toBeDisabled();
    fireEvent.click(disabledBtn);
    expect(clicked).toBe(0);
  });
});
