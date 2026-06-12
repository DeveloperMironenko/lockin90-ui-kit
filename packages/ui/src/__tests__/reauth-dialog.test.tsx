import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReauthDialog } from '../index';

describe('@lockin90/ui — ReauthDialog', () => {
  it('entering a password + Confirm calls verify then onConfirmed on resolve', async () => {
    const verify = vi.fn().mockResolvedValue(undefined);
    const onConfirmed = vi.fn();
    const onCancel = vi.fn();
    render(
      <ReauthDialog open verify={verify} onConfirmed={onConfirmed} onCancel={onCancel} />,
    );

    const input = document.getElementById('lk-reauth-password') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hunter2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => expect(verify).toHaveBeenCalledWith('hunter2'));
    await waitFor(() => expect(onConfirmed).toHaveBeenCalledTimes(1));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('renders verify error message, marks the field invalid, and does NOT call onConfirmed on reject', async () => {
    const verify = vi.fn().mockRejectedValue(new Error('That password is incorrect.'));
    const onConfirmed = vi.fn();
    render(
      <ReauthDialog open verify={verify} onConfirmed={onConfirmed} onCancel={() => {}} />,
    );

    const input = document.getElementById('lk-reauth-password') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'wrong-pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => expect(verify).toHaveBeenCalledWith('wrong-pass'));
    await screen.findByText('That password is incorrect.');
    expect(onConfirmed).not.toHaveBeenCalled();
    expect(input).toHaveClass('lk-invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('falls back to "Incorrect password" when the thrown error has no message', async () => {
    const verify = vi.fn().mockRejectedValue(new Error());
    render(
      <ReauthDialog open verify={verify} onConfirmed={() => {}} onCancel={() => {}} />,
    );
    const input = document.getElementById('lk-reauth-password') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'x' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await screen.findByText('Incorrect password');
  });

  it('Confirm is disabled while the password is empty', () => {
    render(<ReauthDialog open verify={vi.fn()} onConfirmed={() => {}} onCancel={() => {}} />);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
  });

  it('Cancel calls onCancel', () => {
    const onCancel = vi.fn();
    render(<ReauthDialog open verify={vi.fn()} onConfirmed={() => {}} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('Escape closes via onCancel (Modal semantics)', () => {
    const onCancel = vi.fn();
    render(<ReauthDialog open verify={vi.fn()} onConfirmed={() => {}} onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders the default title/description and resets state on reopen', () => {
    function Harness() {
      const [open, setOpen] = useState(true);
      return (
        <div>
          <button onClick={() => setOpen((o) => !o)}>toggle</button>
          <ReauthDialog open={open} verify={vi.fn()} onConfirmed={() => {}} onCancel={() => {}} />
        </div>
      );
    }
    render(<Harness />);
    expect(screen.getByText('Confirm your password')).toBeInTheDocument();
    const input = document.getElementById('lk-reauth-password') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'typed' } });
    expect(input.value).toBe('typed');

    // close then reopen → password cleared
    fireEvent.click(screen.getByText('toggle'));
    fireEvent.click(screen.getByText('toggle'));
    const reopened = document.getElementById('lk-reauth-password') as HTMLInputElement;
    expect(reopened.value).toBe('');
  });
});
