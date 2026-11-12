// @vitest-environment happy-dom
/* U10: a live region announces what changes inside it after it exists. Alert (announceOnMount) and Toast
   mount their region first and show the text LIVE_REVEAL_MS later. */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';
import { Toast } from './Toast';
import { LIVE_REVEAL_MS } from '../hooks/useLiveReveal';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mount = (el: React.ReactElement) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(el));
  return { host, root };
};

describe('live regions are there before their text', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('Alert: the role exists at once, the text shows after the delay', () => {
    const { host, root } = mount(<Alert tone="danger">Wrong code</Alert>);
    const region = host.querySelector('[role="alert"]')!;
    const words = region.querySelector<HTMLElement>('.lk-alert-words')!;
    expect(words.style.visibility).toBe('hidden');
    act(() => vi.advanceTimersByTime(LIVE_REVEAL_MS));
    expect(host.querySelector('[role="alert"]')).toBe(region);
    expect(words.style.visibility).toBe('');
    act(() => root.unmount());
  });

  it('Toast: the status region exists at once, the message shows after the delay', () => {
    const { host, root } = mount(<Toast tone="success" title="Saved" />);
    const region = host.querySelector('[role="status"]')!;
    const body = region.querySelector<HTMLElement>('.lk-toast-body')!;
    expect(body.style.visibility).toBe('hidden');
    act(() => vi.advanceTimersByTime(LIVE_REVEAL_MS));
    expect(body.style.visibility).toBe('');
    act(() => root.unmount());
  });
});
