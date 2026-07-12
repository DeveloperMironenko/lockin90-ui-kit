import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Icon, type IconName } from './Icon';

export type SourceChipSize = 'sm' | 'md';

export interface SourceChipProps {
  /**
   * The backend `source` field on a workout — `'whoop' | 'garmin' | 'polar' |
   * 'oura' | 'apple_health' | 'manual' | 'lockin90'` or any other/unknown
   * value. `manual`, `lockin90`, `null`, and unrecognized sources render
   * nothing — hand-logged workouts get no chip.
   */
  source?: string | null;
  /** @default 'sm' — the row-meta scale. Use `'md'` for the workout-detail "Synced from" lockup. */
  size?: SourceChipSize;
  style?: StyleProp<ViewStyle>;
}

interface SourceVisual {
  iconName: IconName;
  ground: string;
  ink: string;
  /** width÷height of the vendored wordmark's cropped band — omitted for the
   *  square apple-health heart glyph (uses `size` instead of `width`×`height`). */
  aspect?: number;
  /** hairline border so light-ground chips don't float on the dark UI. */
  border?: boolean;
}

/** Ground + ink per source — the design's `wm-logo` chip lockup (variant B).
 *  Intentionally separate from `Icon`'s `BRAND_COLORS` (tuned for a glyph
 *  drawn directly on the dark UI, no chip ground behind it). Mirrors the web
 *  twin's map pair-for-pair. */
const SOURCES: Partial<Record<string, SourceVisual>> = {
  whoop: { iconName: 'whoop', ground: '#0B0B0B', ink: '#FFFFFF', aspect: 24 / 5.2 },
  garmin: { iconName: 'garmin', ground: '#FFFFFF', ink: '#007CC3', aspect: 24 / 7.7, border: true },
  polar: { iconName: 'polar', ground: '#FFFFFF', ink: '#D10027', aspect: 24 / 5.4, border: true },
  oura: { iconName: 'oura', ground: '#15120E', ink: '#F0EADF', aspect: 24 / 8.7 },
  apple_health: { iconName: 'apple-health', ground: '#FFFFFF', ink: '#FF2D55', border: true },
};

const SIZES: Record<SourceChipSize, { h: number; radius: number; padH: number; padV: number }> = {
  sm: { h: 12, radius: 6, padH: 5, padV: 2 },
  md: { h: 18, radius: 7, padH: 8, padV: 3.5 },
};

/**
 * SourceChip — a brand-colored mini logo lockup marking which wearable a
 * synced workout came from (source-badges.html, variant B · pill). Renders
 * the kit's already-vendored provider wordmark `Icon` on its real brand
 * ground with contrasting ink — never a re-drawn logo. Native twin of the web
 * `SourceChip` (same prop API + visuals). `manual` / `lockin90` / `null` /
 * unknown sources render nothing so hand-logged rows keep their plain layout.
 */
export function SourceChip({ source, size = 'sm', style }: SourceChipProps) {
  const visual = source ? SOURCES[source] : undefined;
  if (!visual) return null;
  const s = SIZES[size];
  const iconWidth = visual.aspect != null ? Math.round(s.h * visual.aspect) : undefined;

  return (
    <View
      style={[
        styles.chip,
        {
          borderRadius: s.radius,
          paddingVertical: s.padV,
          paddingHorizontal: s.padH,
          backgroundColor: visual.ground,
        },
        visual.border && styles.bordered,
        style,
      ]}
    >
      <Icon
        name={visual.iconName}
        color={visual.ink}
        {...(iconWidth != null ? { width: iconWidth, height: s.h } : { size: s.h })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
  },
});
