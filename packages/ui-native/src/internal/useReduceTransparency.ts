import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';

/* One module-level store for iOS "Reduce Transparency" (as useReducedMotion): a glass surface draws
   solid while it is on. False on Android and wherever the API is missing. */
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
  AccessibilityInfo.isReduceTransparencyEnabled?.()
    .then(set)
    .catch(() => {});
  try {
    AccessibilityInfo.addEventListener?.('reduceTransparencyChanged', set);
  } catch {
    // an event this RN version doesn't know
  }
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const read = () => reduced;

/** The OS "Reduce Transparency" setting (iOS), live: glass draws solid while it is true. */
export function useReduceTransparency(): boolean {
  return useSyncExternalStore(subscribe, read, read);
}
