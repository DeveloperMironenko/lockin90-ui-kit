import { View, Text, Image, StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, gradients } from '@lockin90/tokens';

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
 */
export function Avatar({
  name,
  initials,
  src,
  size = 44,
  shape = 'circle',
  gradient = gradients.cta.stops,
  style,
  ...rest
}: AvatarProps) {
  const radius = shape === 'rounded' ? size * 0.3 : size / 2;
  const box = { width: size, height: size, borderRadius: radius };

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

const styles = StyleSheet.create({
  avatar: { overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  mono: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  monoText: { fontFamily: fonts.display, fontWeight: '700', color: '#07080d', letterSpacing: -0.3 },
});
