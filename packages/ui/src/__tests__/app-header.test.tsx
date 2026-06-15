import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppHeader, TabBar } from '../index';

describe('@lockin90/ui — AppHeader', () => {
  it('renders the eyebrow and title', () => {
    render(<AppHeader eyebrow="LOCKIN90" title="Today" accountName="Mia Kohl" />);
    expect(screen.getByText('LOCKIN90')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument();
  });

  it('renders the account button (with avatar initials) and fires onAccountPress', () => {
    let pressed = 0;
    render(
      <AppHeader title="Today" accountName="Mia Kohl" onAccountPress={() => (pressed += 1)} />,
    );
    const btn = screen.getByRole('button', { name: 'Mia Kohl' });
    expect(btn).toHaveClass('lk-appheader-account');
    // avatar initials derived from the name
    expect(screen.getByText('MK')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(pressed).toBe(1);
  });

  it('uses accountInitials override when provided', () => {
    render(<AppHeader title="Today" accountName="Mia Kohl" accountInitials="ZZ" />);
    expect(screen.getByText('ZZ')).toBeInTheDocument();
  });

  it('renders the account button as a link when accountHref is set', () => {
    render(<AppHeader title="Today" accountName="Mia Kohl" accountHref="/account" />);
    const link = screen.getByRole('link', { name: 'Mia Kohl' });
    expect(link).toHaveAttribute('href', '/account');
    // not also a button
    expect(screen.queryByRole('button', { name: 'Mia Kohl' })).not.toBeInTheDocument();
  });

  it('falls back to "Account" a11y label when no name is given', () => {
    render(<AppHeader title="Today" />);
    expect(screen.getByRole('button', { name: 'Account' })).toBeInTheDocument();
  });

  it('renders the account avatar on the left, before the title', () => {
    const { container } = render(<AppHeader title="Today" accountName="Mia Kohl" />);
    const left = container.querySelector('.lk-appheader-left');
    const account = left?.querySelector('.lk-appheader-account');
    const titles = left?.querySelector('.lk-appheader-titles');
    expect(account).toBeInTheDocument();
    expect(titles).toBeInTheDocument();
    // avatar (account button) comes before the title stack within the left group
    expect(account?.compareDocumentPosition(titles!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders a right-aligned trailing node', () => {
    render(
      <AppHeader
        title="Today"
        accountName="Mia Kohl"
        trailing={<span data-testid="sync">sync</span>}
      />,
    );
    expect(screen.getByTestId('sync')).toBeInTheDocument();
  });
});

describe('@lockin90/ui — TabBar disabled item', () => {
  const icon = <svg aria-hidden="true" />;

  it('renders a disabled item as a non-link dim span (no href)', () => {
    const { container } = render(
      <TabBar
        items={[
          { key: 'home', label: 'Home', icon, href: '/', active: true },
          { key: 'coach', label: 'Coach', icon, disabled: true },
        ]}
      />,
    );
    // active item is a link
    const home = screen.getByText('Home').closest('a');
    expect(home).toHaveAttribute('href', '/');
    // disabled item is NOT a link
    expect(screen.getByText('Coach').closest('a')).toBeNull();
    const coach = container.querySelector('.lk-tabbar-item.lk-disabled');
    expect(coach).toBeInTheDocument();
    expect(coach?.tagName.toLowerCase()).toBe('span');
    expect(coach).toHaveAttribute('aria-disabled', 'true');
  });
});
