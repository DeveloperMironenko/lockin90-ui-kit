import { View, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, nativeShadows } from '@lockin90/tokens';
import { OptionalBlurView } from '../internal/optionalBlur';

export interface CardProps extends ViewProps {
  /** gradient hairline on the top edge */
  lit?: boolean;
  /** larger padding */
  padLg?: boolean;
  /** drop the elevation shadow */
  flat?: boolean;
  /** real backdrop blur (the web `backdrop-filter` glass) — needs the optional
   *  `expo-blur` peer; falls back to the translucent fill when it's absent */
  blur?: boolean;
}

/** Glass panel. Native has no backdrop-filter, so glass is approximated with a
 *  translucent fill + hairline border. Set `blur` for a real frosted surface
 *  (via the optional `expo-blur` peer) that matches the web glass more closely. */
export function Card({ lit, padLg, flat, blur, style, children, ...rest }: CardProps) {
  const composed = [styles.card, padLg && styles.padLg, flat && styles.flat];

  if (blur && OptionalBlurView) {
    return (
      <OptionalBlurView
        intensity={24}
        tint="dark"
        style={[composed, styles.cardBlur, style]}
        {...rest}
      >
        {lit && <View style={styles.lit} pointerEvents="none" />}
        {children}
      </OptionalBlurView>
    );
  }

  return (
    <View style={[composed, style]} {...rest}>
      {lit && <View style={styles.lit} pointerEvents="none" />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 22,
    ...nativeShadows.elev1,
  },
  padLg: { padding: 30 },
  flat: { shadowOpacity: 0, elevation: 0 },
  // when blurred, drop most of the opaque fill so the frost shows through, and
  // clip the blur to the card radius (iOS needs overflow:hidden for this)
  cardBlur: { backgroundColor: 'rgba(255,255,255,0.02)', overflow: 'hidden' },
  lit: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    backgroundColor: colors.accent,
    opacity: 0.6,
  },
});
