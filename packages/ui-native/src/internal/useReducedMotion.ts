import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';

/* One module-level store for the OS "Reduce Motion" setting: a single native read and a single
   listener for the whole app, however many components ask. The value is false until the first read
   resolves (the first mount only); later mounts start with the known value. */
let reduced = false;
const listeners = new Set<() => void>();
let started = false;

function set(next: boolean) {
  if (next === reduced) return;
  reduced = next;
  listeners.forEach((l) => l());
}

function start() {
  if (started) return;
  started = true;
  AccessibilityInfo.isReduceMotionEnabled?.()
    .then(set)
    .catch(() => {});
  AccessibilityInfo.addEventListener?.('reduceMotionChanged', set);
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const read = () => reduced;

/** The OS "Reduce Motion" setting, live (CONVENTIONS "Accessibility"). Every kit loop and large movement
 *  stops at a defined still frame while it is true (AuroraBackground holds still, DotsLoader / ProgressBar…
 *  stop; Spinner slows right down, as web); apps use it for their own motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, read, read);
}

