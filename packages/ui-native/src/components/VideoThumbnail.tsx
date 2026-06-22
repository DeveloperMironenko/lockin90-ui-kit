import { View, Text, Image, Pressable, StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

export interface VideoThumbnailProps extends Omit<ViewProps, 'style'> {
  /** Poster image URL. When absent, a glass/gradient placeholder is shown. */
  src?: string;
  /** Accessibility label for the poster image. */
  alt?: string;
  /** Runtime label (e.g. `'0:45'`) — rendered as a mono pill bottom-right. */
  duration?: string;
  /** Pixel width of the thumbnail. @default 150 */
  width?: number;
  /** Aspect ratio (width / height). @default 1.4 */
  aspect?: number;
  /** Press handler — when set the tile becomes interactive (mirrors web `onClick`). */
  onPress?: () => void;
}

/**
 * VideoThumbnail — a media tile with a centered glass play disc and an optional
 * duration badge, mirroring the web `@lockin90/ui` `VideoThumbnail`. Sized by
 * `width` + the `aspect` ratio (height = width / aspect). Renders the poster
 * `<Image>` (cover) when `src` is given, else a violet flux-gradient placeholder.
 * With `onPress` the tile is a `Pressable` that dims slightly while pressed.
 */
export function VideoThumbnail({
  src,
  alt,
  duration,
  width = 150,
  aspect = 1.4,
  onPress,
  ...rest
}: VideoThumbnailProps) {
  const height = Math.round(width / aspect);
  const box = { width, height };

  const inner = (
    <>
      {src ? (
        <Image
          source={{ uri: src }}
          style={styles.img}
          resizeMode="cover"
          accessibilityLabel={alt}
        />
      ) : (
        <LinearGradient
          colors={gradients.violet.stops as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.placeholder}
        />
      )}

      <View style={styles.play} pointerEvents="none">
        <Svg width={16} height={16} viewBox="0 0 24 24" style={styles.playGlyph}>
          <Path d="M9 6.5v11l9-5.5z" fill={colors.text} />
        </Svg>
      </View>

      {duration ? (
        <View style={styles.durPill} pointerEvents="none">
          <Text style={styles.durText}>{duration}</Text>
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={alt}
        onPress={onPress}
        style={({ pressed }) => [styles.thumb, box, pressed && styles.pressed]}
        {...rest}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View style={[styles.thumb, box]} {...rest}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: {
    position: 'relative',
    borderRadius: radii.sm,
    overflow: 'hidden',
    backgroundColor: colors.bg1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  img: { width: '100%', height: '100%' },
  placeholder: { width: '100%', height: '100%', opacity: 0.45 },
  play: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    marginLeft: -20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(12,15,26,0.42)',
    borderWidth: 1,
    borderColor: colors.border2,
  },
  // nudge the play glyph optically to the disc centre
  playGlyph: { marginLeft: 2 },
  durPill: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(5,6,11,0.72)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  durText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: colors.text,
  },
});
