/* ============================================================================
   expo-haptics is an OPTIONAL peer dependency (same pattern as expo-blur in
   optionalBlur.ts). Resolve lazily and gate on the NATIVE module actually
   being registered — in apps without it (or react-native-web/Storybook) every
   helper is a silent no-op, never a crash.
   ========================================================================== */

interface HapticsModule {
  selectionAsync: () => Promise<void>;
  impactAsync: (style?: unknown) => Promise<void>;
  ImpactFeedbackStyle: { Light: unknown; Medium: unknown; Heavy: unknown };
}

let haptics: HapticsModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nativeReady =
    require('expo-modules-core').requireOptionalNativeModule?.('ExpoHaptics') != null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  haptics = nativeReady ? require('expo-haptics') : null;
} catch {
  haptics = null;
}

/** Selection tick — the light click for toggles/segments/pickers. No-op without expo-haptics. */
export function hapticSelection(): void {
  void haptics?.selectionAsync().catch(() => {});
}

/** Medium impact — a drag lifting off. No-op without expo-haptics. */
export function hapticLift(): void {
  void haptics?.impactAsync(haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

/** Light impact — a drag dropping into place. No-op without expo-haptics. */
export function hapticDrop(): void {
  void haptics?.impactAsync(haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
