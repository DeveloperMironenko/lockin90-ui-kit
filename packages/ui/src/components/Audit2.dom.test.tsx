// @vitest-environment happy-dom
/* Running-app audit fixes (web, live): ReauthDialog opens on its field, keeps Confirm enabled and says
   what's missing; Menu opens from the keyboard on its first item and the arrows move. */
import { act, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Menu } from './Menu';
import { ReauthDialog } from './ReauthDialog';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let done: () => void = () => {};
afterEach(() => done());
function mount(el: ReactElement) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(el));
  done = () => {
    act(() => root.unmount());
    host.remove();
  };
  return host;
}
const key = (el: Element, k: string) =>
  act(() => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
  });

describe('ReauthDialog', () => {
  it('opens on the password field; an empty Confirm says what is missing instead of being disabled', () => {
    const onSubmit = vi.fn();
    mount(<ReauthDialog open onClose={() => {}} onSubmitPassword={onSubmit} passwordRequiredLabel="Введіть пароль" />);
    const field = document.querySelector('input[type="password"]')!;
    expect(document.activeElement).toBe(field);
    const confirm = document.querySelector<HTMLButtonElement>('.lk-reauth-submit')!;
    expect(confirm.disabled).toBe(false);
    act(() => confirm.click());
    expect(onSubmit).not.toHaveBeenCalled();
    const error = document.querySelector('.lk-field-error')!;
    expect(error.textContent).toContain('Введіть пароль');
    expect(field.getAttribute('aria-describedby')).toContain(error.id);
  });
});

describe('Menu keyboard', () => {
  it('Enter opens on the first item, the arrows move (wrapping), Escape returns to the trigger', () => {
    const host = mount(
      <Menu label="More" items={[{ label: 'Edit' }, { label: 'Share' }, { label: 'Delete', danger: true }]} />,
    );
    const trigger = host.querySelector('button')!;
    trigger.focus();
    key(trigger, 'Enter');
    const items = () => Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    expect(document.activeElement).toBe(items()[0]);
    key(document.activeElement!, 'ArrowDown');
    expect(document.activeElement).toBe(items()[1]);
    key(document.activeElement!, 'ArrowUp');
    key(document.activeElement!, 'ArrowUp');
    expect(document.activeElement).toBe(items()[2]);
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});

describe('ReauthDialog providers', () => {
  it('shows Google and Apple when both are linked, Apple calls onApple, both off while loading', () => {
    const onApple = vi.fn();
    const onGoogle = vi.fn();
    const props = { open: true, onClose: () => {}, hasGoogle: true, hasApple: true, onGoogle, onApple, googleLabel: 'Continuar con Google', appleLabel: 'Continuar con Apple' };
    mount(<ReauthDialog {...props} />);
    const byText = (t: string) => Array.from(document.querySelectorAll('button')).find((b) => b.textContent === t)!;
    act(() => byText('Continuar con Apple').click());
    expect(onApple).toHaveBeenCalledTimes(1);
    expect(byText('Continuar con Google')).toBeTruthy();
    done();
    mount(<ReauthDialog {...props} loading />);
    expect(byText('Continuar con Apple').disabled).toBe(true);
    expect(byText('Continuar con Google').disabled).toBe(true);
  });
});
