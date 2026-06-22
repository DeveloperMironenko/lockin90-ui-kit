import type { ComponentType } from 'react';
import type { ViewProps } from 'react-native';

/* ============================================================================
   expo-blur is an OPTIONAL peer dependency (like expo-clipboard for CopyButton).
   Resolve its `BlurView` lazily and guard usage: when the consuming app hasn't
   installed it — or in the react-native-web Storybook env — the value is null
   and callers fall back to the kit's translucent-fill glass approximation.
   This is the native analogue of the web `backdrop-filter: blur()`.
   ========================================================================== */

export interface OptionalBlurViewProps extends ViewProps {
  /** blur strength, 0–100 (expo-blur scale) */
  intensity?: number;
  /** blur tint; the Aurora surfaces are dark */
  tint?: 'light' | 'dark' | 'default';
}

let resolved: ComponentType<OptionalBlurViewProps> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  resolved = require('expo-blur').BlurView ?? null;
} catch {
  resolved = null;
}

/** expo-blur's `BlurView` if installed, else `null` (render a fallback). */
export const OptionalBlurView = resolved;

/** Whether real backdrop blur is available in this runtime. */
export const hasBlur = resolved != null;
