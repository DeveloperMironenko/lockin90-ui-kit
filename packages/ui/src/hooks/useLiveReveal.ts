import { useEffect, useState } from 'react';

/** How long a new live region waits before it shows its text (as react-aria's announcer): a screen reader
 *  only reads what changes inside a region it already knows. */
export const LIVE_REVEAL_MS = 100;

/** A live region that mounts with its text is often not announced (CONVENTIONS "Accessibility": the
 *  region exists first, its text comes after). `true` for the first {@link LIVE_REVEAL_MS} ms after mount
 *  when `enabled`: the component renders the region with its text hidden (`visibility: hidden`, so the box
 *  keeps its size and nothing jumps), then shows it, which screen readers announce. */
export function useLiveReveal(enabled: boolean): boolean {
  const [pending, setPending] = useState(enabled);
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setPending(false), LIVE_REVEAL_MS);
    return () => clearTimeout(t);
  }, [pending]);
  return pending;
}
