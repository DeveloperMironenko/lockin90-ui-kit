import { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients, nativeShadows } from '@lockin90/tokens';

export interface AvatarProps extends ViewProps {
  /** Display name — used to derive monogram initials when `initials` is omitted. */
  name?: string;
  /** Explicit monogram initials; overrides the value derived from `name`. */
  initials?: string;
  /** Image URL. When present, an `<Image>` is rendered instead of the monogram. */
  src?: string;
  /** Pixel size of the square avatar. @default 44 */
  size?: number;
  /** Outline shape — a full circle or a softly-rounded square. @default 'circle' */
  shape?: 'circle' | 'rounded';
  /**
   * Visual variant.
   * - `'default'` — image / monogram identity tile (a real user).
   * - `'aura'` — an energy-spectrum flux orb for the AI coach (Aura); ignores
   *   `src`/`initials`/`name`/`gradient` and renders the `gradients.flux` stops
   *   with `nativeShadows.glowAccent`.
   * @default 'default'
   */
  variant?: 'default' | 'aura';
  /**
   * Monogram tile gradient as ordered color stops (native can't parse CSS
   * gradient strings). @default violet→cyan flux gradient
   */
  gradient?: readonly [string, string, ...string[]];
}

/** First letters of up to two words, uppercased; `'?'` when empty. */
function initialsFor(name: string): string {
  const derived = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
  return derived || '?';
}

/**
 * Avatar — a standalone identity tile showing either an image or a monogram
 * (initials painted on the flux gradient). Square by `size`, circular by
 * default or softly rounded via `shape="rounded"`. The monogram falls back to
 * initials derived from `name`, then to `'?'`.
 *
 * `variant="aura"` renders an energy-spectrum flux orb (no image/monogram) for
 * the AI coach — use it ONLY for Aura, never a human user.
 */
export function Avatar({
  name,
  initials,
  src,
  size = 44,
  shape = 'circle',
  variant = 'default',
  gradient = gradients.cta.stops,
  style,
  ...rest
}: AvatarProps) {
  const radius = shape === 'rounded' ? size * 0.3 : size / 2;
  const box = { width: size, height: size, borderRadius: radius };

  if (variant === 'aura') {
    return <AuraOrb size={size} radius={radius} name={name} style={style} {...rest} />;
  }

  return (
    <View style={[styles.avatar, box, style]} {...rest}>
      {src ? (
        <Image source={{ uri: src }} style={styles.img} resizeMode="cover" />
      ) : (
        <LinearGradient
          colors={gradient as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mono}
        >
          <Text style={[styles.monoText, { fontSize: Math.round(size * 0.38) }]}>
            {initials ?? initialsFor(name ?? '')}
          </Text>
        </LinearGradient>
      )}
    </View>
  );
}

/**
 * AuraOrb — the AI coach (Aura) tile: an energy-spectrum `gradients.flux` orb
 * under a soft `nativeShadows.glowAccent`. The gradient layer is oversized
 * (1.5×) and slowly rotated on the native driver so the spectrum swirls like
 * flowing energy without ever revealing an edge; the parent clips it to the
 * circle. Non-blocking — the loop runs entirely off the JS thread.
 */
function AuraOrb({
  size,
  radius,
  name,
  style,
  ...rest
}: { size: number; radius: number; name?: string } & ViewProps) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // oversize the rotating gradient so the clipped circle is always covered
  const fluxSize = size * 1.5;
  const offset = -(fluxSize - size) / 2;

  return (
    <View
      style={[styles.auraGlow, { width: size, height: size, borderRadius: radius }, style]}
      accessibilityRole="image"
      accessibilityLabel={name ?? 'Aura'}
      {...rest}
    >
      <View style={[styles.auraOrb, { borderRadius: radius }]}>
        <Animated.View
          style={{
            position: 'absolute',
            top: offset,
            left: offset,
            width: fluxSize,
            height: fluxSize,
            transform: [{ rotate }],
          }}
        >
          <LinearGradient
            colors={gradients.flux.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  mono: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  monoText: { fontFamily: fonts.display, fontWeight: '700', color: '#07080d', letterSpacing: -0.3 },
  // backgroundColor anchors the glow's shape on iOS; it's fully hidden by the orb
  auraGlow: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.void, ...nativeShadows.glowAccent },
  auraOrb: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
});
