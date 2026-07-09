import { View, StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, nativeShadows, gradients } from '@lockin90/tokens';
import { OptionalBlurView } from '../internal/optionalBlur';

export interface CardProps extends ViewProps {
  /** gradient hairline on the top edge */
  lit?: boolean;
  /** larger padding (shorthand for `pad="lg"`) */
  padLg?: boolean;
  /** padding size — overrides the default 22px */
  pad?: 'none' | 'sm' | 'md' | 'lg';
  /** drop the elevation shadow */
  flat?: boolean;
  /** real backdrop blur (the web `backdrop-filter` glass) — needs the optional
   *  `expo-blur` peer; falls back to the translucent fill when it's absent */
  blur?: boolean;
  /** tinted border + subtle bg in a status color (`warn` amber / `danger` red) */
  tone?: 'warn' | 'danger';
  /** surface style — `dashed` = an add/connect action card, `ghost` = borderless transparent */
  variant?: 'ghost' | 'dashed';
}

/** Glass panel. Native has no backdrop-filter, so glass is approximated with a
 *  translucent fill + hairline border. Set `blur` for a real frosted surface
 *  (via the optional `expo-blur` peer) that matches the web glass more closely. */
export function Card({ lit, padLg, pad, flat, blur, tone, variant, style, children, ...rest }: CardProps) {
  const composed = [
    styles.card,
    padLg && styles.padLg,
    pad === 'none' && styles.padNone,
    pad === 'sm' && styles.padSm,
    pad === 'md' && styles.padMd,
    pad === 'lg' && styles.padLg,
    flat && styles.flat,
    tone === 'warn' && styles.toneWarn,
    tone === 'danger' && styles.toneDanger,
    variant === 'dashed' && styles.dashed,
    variant === 'ghost' && styles.ghost,
  ];

  if (blur && OptionalBlurView) {
    return (
      <OptionalBlurView
        intensity={24}
        tint="dark"
        style={[composed, styles.cardBlur, style]}
        {...rest}
      >
        {lit && (
          <LinearGradient
            colors={gradients.flux.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.lit}
            pointerEvents="none"
          />
        )}
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
    // Clip children (edge-to-edge rows, the `lit` hairline) to the rounded
    // corners so their borders/fills never bleed past the card radius.
    overflow: 'hidden',
    padding: 22,
    ...nativeShadows.elev1,
  },
  padLg: { padding: 30 },
  padNone: { padding: 0 },
  padSm: { padding: 16 },
  padMd: { padding: 22 },
  flat: { shadowOpacity: 0, elevation: 0 },
  // tone — tinted border + subtle bg. The literals are the flattened web
  // `color-mix(in srgb, var(--warn|--bad) 42%, transparent)` border and
  // `color-mix(in srgb, var(--warn|--bad) 7|8%, var(--glass))` fill
  // (#FFB020 / #FF4D6D mixed into rgba(255,255,255,0.045)).
  toneWarn: { borderColor: 'rgba(255,176,32,0.42)', backgroundColor: 'rgba(255,206,115,0.11)' },
  toneDanger: { borderColor: 'rgba(255,77,109,0.42)', backgroundColor: 'rgba(255,138,159,0.12)' },
  // dashed — add/connect action card (hover accent is web-only; text color
  // doesn't cascade natively, so children set their own `colors.textDim`)
  dashed: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border2,
    shadowOpacity: 0,
    elevation: 0,
  },
  // ghost — borderless transparent surface
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent', shadowOpacity: 0, elevation: 0 },
  // when blurred, drop most of the opaque fill so the frost shows through, and
  // clip the blur to the card radius (iOS needs overflow:hidden for this)
  cardBlur: { backgroundColor: 'rgba(255,255,255,0.02)', overflow: 'hidden' },
  lit: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    opacity: 0.85,
  },
});
