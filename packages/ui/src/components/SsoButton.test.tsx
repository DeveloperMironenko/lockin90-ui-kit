// @vitest-environment happy-dom
/* SsoButton `loading` (U6): busy while the provider's popup is open or its token is exchanged. */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { SsoButton } from './SsoButton';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('SsoButton loading', () => {
  it('is busy, keeps its name and focus, shows the spinner and ignores clicks', () => {
    const onClick = vi.fn();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<SsoButton provider="google" loading onClick={onClick} aria-label="Continuar con Google" />));
    const button = host.querySelector('button')!;
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-label')).toBe('Continuar con Google');
    expect(button.querySelector('.lk-sso-spin')).not.toBeNull();
    act(() => button.click());
    expect(onClick).not.toHaveBeenCalled();
    act(() => root.render(<SsoButton provider="google" onClick={onClick} />));
    act(() => host.querySelector('button')!.click());
    expect(onClick).toHaveBeenCalledTimes(1);
    act(() => root.unmount());
  });
});
