import { View, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, nativeShadows } from '@lockin90/tokens';

export interface CardProps extends ViewProps {
  /** gradient hairline on the top edge */
  lit?: boolean;
  /** larger padding */
  padLg?: boolean;
  /** drop the elevation shadow */
  flat?: boolean;
}

/** Glass panel. Native has no backdrop-filter, so glass is approximated with a
 *  translucent fill + hairline border (wrap in expo-blur's BlurView for real blur). */
export function Card({ lit, padLg, flat, style, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, padLg && styles.padLg, flat && styles.flat, style]} {...rest}>
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
