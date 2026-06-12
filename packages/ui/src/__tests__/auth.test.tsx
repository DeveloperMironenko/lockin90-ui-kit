import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput, CodeInput, Button } from '../index';

describe('@lockin90/ui — auth primitives', () => {
  it('PasswordInput masks by default and toggles to plain text', () => {
    const { container } = render(<PasswordInput placeholder="Password" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');

    const toggle = screen.getByRole('button', { name: 'Show password' });
    fireEvent.click(toggle);
    expect(input.type).toBe('text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input.type).toBe('password');
  });

  it('PasswordInput forwards value/onChange and applies lk-invalid', () => {
    function Harness() {
      const [v, setV] = useState('');
      return <PasswordInput invalid value={v} onChange={(e) => setV(e.target.value)} />;
    }
    const { container } = render(<Harness />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toHaveClass('lk-input', 'lk-invalid');
    fireEvent.change(input, { target: { value: 'hunter2' } });
    expect(input.value).toBe('hunter2');
  });

  it("PasswordInput toggle is type=button (does not submit) and not focusable when disabled", () => {
    render(<PasswordInput disabled />);
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toHaveAttribute('type', 'button');
    expect(toggle).toBeDisabled();
  });

  it('CodeInput accepts digits, auto-advances, and ignores non-digits', () => {
    function Harness() {
      const [v, setV] = useState('');
      return <CodeInput value={v} onChange={setV} />;
    }
    render(<Harness />);
    const cells = screen.getAllByRole('textbox');
    expect(cells).toHaveLength(6);

    fireEvent.change(cells[0], { target: { value: '1' } });
    expect((cells[0] as HTMLInputElement).value).toBe('1');

    fireEvent.change(cells[1], { target: { value: 'a' } });
    expect((cells[1] as HTMLInputElement).value).toBe('');

    fireEvent.change(cells[1], { target: { value: '2' } });
    expect((cells[1] as HTMLInputElement).value).toBe('2');
  });

  it('CodeInput distributes a pasted full code across cells', () => {
    function Harness() {
      const [v, setV] = useState('');
      return (
        <div>
          <CodeInput value={v} onChange={setV} />
          <span data-testid="val">{v}</span>
        </div>
      );
    }
    render(<Harness />);
    const cells = screen.getAllByRole('textbox');
    fireEvent.paste(cells[0], { clipboardData: { getData: () => '123456' } });
    expect(screen.getByTestId('val')).toHaveTextContent('123456');
  });

  it('CodeInput renders length cells and respects disabled + invalid', () => {
    render(<CodeInput value="12" onChange={() => {}} length={4} disabled invalid />);
    const cells = screen.getAllByRole('textbox');
    expect(cells).toHaveLength(4);
    cells.forEach((c) => {
      expect(c).toBeDisabled();
      expect(c).toHaveClass('lk-code-cell', 'lk-invalid');
    });
  });

  it('Button loading shows a spinner, sets aria-busy, and disables', () => {
    let clicked = 0;
    const { container } = render(
      <Button loading onClick={() => (clicked += 1)}>
        Sign in
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Sign in' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
    expect(container.querySelector('.lk-btn-spinner')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(clicked).toBe(0);
  });

  it('Button without loading behaves normally', () => {
    const { container } = render(<Button>Sign in</Button>);
    const btn = screen.getByRole('button', { name: 'Sign in' });
    expect(btn).not.toHaveAttribute('aria-busy');
    expect(btn).not.toBeDisabled();
    expect(container.querySelector('.lk-btn-spinner')).not.toBeInTheDocument();
  });
});
