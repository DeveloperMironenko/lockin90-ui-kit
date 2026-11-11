import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** The OS "Reduce Motion" setting, live (CONVENTIONS "Accessibility"): false until it is read, then it
 *  follows the setting as the user changes it. Every kit loop and large movement stops while it is true
 *  (AuroraBackground holds still, Spinner / DotsLoader / ProgressBar… stop looping); apps use it for
 *  their own motion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((on) => {
        if (alive) setReduced(on);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (on: boolean) => setReduced(on));
    return () => {
      alive = false;
      sub?.remove();
    };
  }, []);
  return reduced;
}
