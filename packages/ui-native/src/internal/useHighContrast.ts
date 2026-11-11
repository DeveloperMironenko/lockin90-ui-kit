import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';
import { colors } from '@lockin90/tokens';

/* One module-level store for the OS "Increase Contrast" settings (as useReducedMotion): Android's high
   text contrast, iOS's darker system colours and bold text. Any of them on → true. The APIs are newer
   than some RN versions, so each is optional. */
type A11y = typeof AccessibilityInfo & {
  isHighTextContrastEnabled?: () => Promise<boolean>;
  isDarkerSystemColorsEnabled?: () => Promise<boolean>;
};
const info = AccessibilityInfo as A11y;
const flags: Record<string, boolean> = {};
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
    .then((on) => set(name, on))
    .catch(() => {});
  try {
    (info.addEventListener as (e: string, fn: (on: boolean) => void) => unknown)?.(event, (on) => set(name, on));
  } catch {
    // an event this RN version doesn't know
  }
}

function start() {
  if (started) return;
  started = true;
  watch('android', info.isHighTextContrastEnabled, 'highTextContrastChanged');
  watch('darker', info.isDarkerSystemColorsEnabled, 'darkerSystemColorsChanged');
  watch('bold', info.isBoldTextEnabled, 'boldTextChanged');
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
 *  iOS darker system colours or bold text. */
export function useHighContrast(): boolean {
  return useSyncExternalStore(subscribe, read, read);
}

/** The colours that step up under Increase Contrast: faint text → dim, dim → full, a container's line →
 *  a control's edge, a control's edge → stronger. Same keys as `colors`. */
export function contrastColors(on: boolean) {
  return on
    ? { textFaint: colors.textDim, textDim: colors.text, border2: colors.borderControl, borderControl: 'rgba(255,255,255,0.5)' }
    : { textFaint: colors.textFaint, textDim: colors.textDim, border2: colors.border2, borderControl: colors.borderControl };
}

/** `contrastColors` for the current setting. */
export function useContrastColors() {
  return contrastColors(useHighContrast());
}
