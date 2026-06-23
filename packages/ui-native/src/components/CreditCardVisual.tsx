import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';

/** Card-art gradient (mirrors the `@lockin90/tokens` gradient tokens). */
export type CardGradient = 'cta' | 'flux' | 'violet' | 'mint' | 'warm';

export interface CreditCardVisualProps {
  /** last 4 digits — rendered as `•••• •••• •••• {last4}` */
  last4: string;
  /** cardholder name (uppercased for display) */
  holder?: string;
  /** expiry, `'MM/YY'` */
  expiry?: string;
  /** brand label shown top-right, e.g. `'VISA'` (plain text, not a logo) */
  brand?: string;
  /** card-art gradient @default 'cta' */
  gradient?: CardGradient;
  style?: StyleProp<ViewStyle>;
}

/** A CSS-style angle (deg, clockwise from 12 o'clock like web `linear-gradient`)
 *  → expo-linear-gradient start/end unit points, so the native art matches the
 *  web gradient direction exactly. */
function angleToPoints(angle: number): { start: { x: number; y: number }; end: { x: number; y: number } } {
  const rad = ((angle - 90) * Math.PI) / 180;
  const x = Math.cos(rad);
  const y = Math.sin(rad);
  return {
    start: { x: 0.5 - x / 2, y: 0.5 - y / 2 },
    end: { x: 0.5 + x / 2, y: 0.5 + y / 2 },
  };
}

/**
 * CreditCardVisual — a credit-card-aspect (≈1.586:1) gradient panel mirroring the
 * `.creditcard` art in the billing mockup: a brand label top-right, a metallic
 * chip glyph, the masked card-number row (mono, letter-spaced) and a bottom row
 * with the cardholder (mono uppercase) + expiry. The chosen `gradient` fills the
 * art (via `expo-linear-gradient`) behind a subtle sheen. Tokens-driven; web twin
 * lives in `@lockin90/ui` with an identical name, props and visuals.
 */
export function CreditCardVisual({ last4, holder, expiry, brand, gradient = 'cta', style }: CreditCardVisualProps) {
  const g = gradients[gradient] ?? gradients.cta;
  const { start, end } = angleToPoints(g.angle);

  return (
    <LinearGradient
      colors={g.stops as unknown as readonly [string, string, ...string[]]}
      start={start}
      end={end}
      style={[styles.card, style]}
    >
      {/* sheen: a soft top-right glossy highlight over the gradient */}
      <View style={styles.sheen} pointerEvents="none" />

      <View style={styles.top}>
        <View style={styles.chip} />
        {brand ? <Text style={styles.brand}>{brand}</Text> : null}
      </View>

      <Text style={styles.num}>{`•••• •••• •••• ${last4}`}</Text>

      <View style={styles.bottom}>
        <View>
          <Text style={styles.lbl}>CARD HOLDER</Text>
          <Text style={styles.val}>{(holder ?? '').toUpperCase()}</Text>
        </View>
        {expiry ? (
          <View style={styles.fieldEnd}>
            <Text style={styles.lbl}>EXPIRES</Text>
            <Text style={styles.val}>{expiry}</Text>
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1.586,
    padding: 22,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border2,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...nativeShadows.elev2,
  },
  sheen: {
    position: 'absolute',
    right: -40,
    top: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#c4a85e',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  brand: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontStyle: 'italic',
    fontSize: 22,
    letterSpacing: -0.4,
    color: colors.text,
  },
  num: {
    fontFamily: fonts.mono,
    fontSize: 19,
    letterSpacing: 2.3,
    color: colors.text,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
  },
  fieldEnd: {
    alignItems: 'flex-end',
  },
  lbl: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    letterSpacing: 0.85,
    color: colors.textFaint,
  },
  val: {
    marginTop: 2,
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.text,
  },
});
