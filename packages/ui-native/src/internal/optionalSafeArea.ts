import { useContext, type Context } from 'react';

/* ============================================================================
   react-native-safe-area-context is an OPTIONAL peer (as expo-blur): Expo Router apps have it. When it
   is installed and the app renders its <SafeAreaProvider>, a sheet reads the device's bottom inset (the
   home indicator) from its context; without either, the inset is 0. The context (not
   useSafeAreaInsets) so a missing provider reads null instead of throwing.
   ========================================================================== */

type Insets = { top: number; right: number; bottom: number; left: number };

let InsetsContext: Context<Insets | null> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  InsetsContext = require('react-native-safe-area-context').SafeAreaInsetsContext ?? null;
} catch {
  InsetsContext = null;
}

const NoInsets = { current: null as Insets | null };

/** The bottom safe-area inset (pt), or 0 without react-native-safe-area-context or its provider. The
 *  module is resolved once, so the hook order never changes. */
export function useBottomInset(): number {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const insets = InsetsContext ? useContext(InsetsContext) : NoInsets.current;
  return insets?.bottom ?? 0;
}
