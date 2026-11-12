/** Re-export the shared design tokens for convenient native consumption:
 *  `import { colors, radii } from '@lockin90/ui-native'`. */
export {
  colors,
  gradients,
  radii,
  spacing,
  breakpoints,
  fonts,
  shadows,
  nativeShadows,
  motion,
  brand,
  tokens,
  textStyles,
} from '@lockin90/tokens';
export type {
  Colors,
  ColorToken,
  Gradients,
  GradientToken,
  Radii,
  Spacing,
  SpacingStep,
  Breakpoints,
  Tokens,
  TextStyles,
  TextRole,
} from '@lockin90/tokens';

import type { TextStyle } from 'react-native';
import { fonts as typeFonts, textStyles as typeTable, type TextRole as Role } from '@lockin90/tokens';

/** A role of the type table (CONVENTIONS "Type") as a React Native text style: family, size, weight,
 *  line height and tracking (`tracking` em × size), uppercase for `label`. Colour is the caller's (a field
 *  label `textDim`, a section label `textFaint`). */
export function textStyle(role: Role): TextStyle {
  const s = typeTable[role];
  return {
    fontFamily: typeFonts[s.font],
    fontSize: s.size,
    fontWeight: s.weight,
    lineHeight: Math.round(s.size * s.lineHeight * 10) / 10,
    letterSpacing: Math.round(s.tracking * s.size * 100) / 100,
    ...(role === 'label' ? { textTransform: 'uppercase' as const } : null),
  };
}
