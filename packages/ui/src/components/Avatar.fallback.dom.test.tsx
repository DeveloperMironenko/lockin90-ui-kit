// @vitest-environment happy-dom
/* Avatar (V16): a photo that fails to load shows the initials, never the broken-image icon; a photo has a
   thin control edge. */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Avatar photo', () => {
  it('falls back to the initials when the photo fails, and tries a new src again', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<Avatar name="Ada Lovelace" src="https://x.test/broken.jpg" />));
    expect(host.querySelector('.lk-avatar')!.classList.contains('lk-avatar--photo')).toBe(true);
    act(() => void host.querySelector('img')!.dispatchEvent(new Event('error')));
    expect(host.querySelector('img')).toBeNull();
    expect(host.querySelector('.lk-avatar-mono')!.textContent).toBe('AL');
    expect(host.querySelector('.lk-avatar')!.classList.contains('lk-avatar--photo')).toBe(false);
    act(() => root.render(<Avatar name="Ada Lovelace" src="https://x.test/new.jpg" />));
    expect(host.querySelector('img')).not.toBeNull();
    act(() => root.unmount());
  });
});
