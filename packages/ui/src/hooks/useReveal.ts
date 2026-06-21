import { useEffect, type RefObject } from 'react';
import { initMotion } from '../motion';

/**
 * Wire up scroll-reveal + count-up for a subtree (or the whole document).
 * Re-runs when `deps` change (e.g. after async content mounts).
 */
export function useReveal(ref?: RefObject<HTMLElement | null>, deps: unknown[] = []): void {
  useEffect(() => {
    return initMotion({ root: ref?.current ?? document });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
