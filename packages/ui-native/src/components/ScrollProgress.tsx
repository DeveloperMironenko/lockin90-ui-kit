import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, radii } from '@lockin90/tokens';

export type ScrollProgressGradient = 'cta' | 'flux' | 'mint' | 'violet';

export interface ScrollProgressProps {
  /**
   * Scroll progress 0→1. Native scrolling is imperative, so — unlike the web
   * twin which tracks `window`/a `target` element itself — the host feeds this
   * from a `ScrollView`'s `onScroll`:
   *   `const p = e.nativeEvent.contentOffset.y / (contentSize.height - layout.height)`
   */
  progress: number;
  /** Bar fill gradient token. Default `'cta'`. */
  gradient?: ScrollProgressGradient;
  /** Bar thickness in px. Default `3`. */
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * ScrollProgress — a top reading-progress bar whose gradient fill grows left→right
 * (0→100% width) to track scroll progress. Native twin of the web `.lk-scrollprogress`;
 * pin it to the top of a screen (it renders absolute, full-width, above content) and
 * drive `progress` from the scroll container's `onScroll`.
 */
export function ScrollProgress({ progress, gradient = 'cta', height = 3, style }: ScrollProgressProps) {
  const g = gradients[gradient] ?? gradients.cta;
  const pct = `${Math.min(100, Math.max(0, progress * 100))}%` as const;

  return (
    <View style={[styles.track, { height }, style]} pointerEvents="none" accessibilityRole="progressbar">
      <View style={[styles.fill, { width: pct }]}>
        <LinearGradient
          colors={g.stops as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderTopRightRadius: radii.pill,
    borderBottomRightRadius: radii.pill,
    overflow: 'hidden',
  },
});
