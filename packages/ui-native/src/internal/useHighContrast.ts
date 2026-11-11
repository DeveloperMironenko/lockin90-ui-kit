import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';
import { colors, highContrastColors } from '@lockin90/tokens';

/* One module-level store for the OS "Increase Contrast" setting (as useReducedMotion): Android's high
   text contrast, iOS's darker system colours (Bold Text is a text-weight setting, not contrast). The APIs
   are newer than some RN versions, so each is optional. */
type A11y = typeof AccessibilityInfo & {
  isHighTextContrastEnabled?: () => Promise<boolean>;
  isDarkerSystemColorsEnabled?: () => Promise<boolean>;
};
const info = AccessibilityInfo as A11y;
const flags: Record<string, boolean> = {};
// a change event that came before the first read resolved wins: the stale first result is ignored
const changed = new Set<string>();
let high = false;
const listeners = new Set<() => void>();
let started = false;

function set(name: string, on: boolean) {
  flags[name] = on;
  const next = Object.values(flags).some(Boolean);
  if (next === high) return;
  high = next;
  listeners.forEach((l) => l());
}

function watch(name: string, read: (() => Promise<boolean>) | undefined, event: string) {
  read?.call(info)
    .then((on) => {
      if (!changed.has(name)) set(name, on);
    })
    .catch(() => {});
  try {
    (info.addEventListener as (e: string, fn: (on: boolean) => void) => unknown)?.(event, (on) => {
      changed.add(name);
      set(name, on);
    });
  } catch {
    // an event this RN version doesn't know
  }
}

function start() {
  if (started) return;
  started = true;
  watch('android', info.isHighTextContrastEnabled, 'highTextContrastChanged');
  watch('darker', info.isDarkerSystemColorsEnabled, 'darkerSystemColorsChanged');
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const read = () => high;

/** The OS "Increase Contrast" setting, live (CONVENTIONS "Accessibility"): Android high text contrast,
 *  iOS darker system colours. */
export function useHighContrast(): boolean {
  return useSyncExternalStore(subscribe, read, read);
}

/** The colours that step up under Increase Contrast — `highContrastColors` from tokens (web uses the same
 *  values under `prefers-contrast: more`). Same keys as `colors`. */
export function contrastColors(on: boolean) {
  return on
    ? { ...highContrastColors }
    : { textFaint: colors.textFaint, textDim: colors.textDim, border2: colors.border2, borderControl: colors.borderControl };
}

/** `contrastColors` for the current setting. */
export function useContrastColors() {
  return contrastColors(useHighContrast());
}
