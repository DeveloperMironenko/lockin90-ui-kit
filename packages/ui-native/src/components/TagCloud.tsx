import { View, Text, Pressable, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

/* ============================================================================
   TagCloud (native) — a flex-wrapped collection of weighted tag pills, sized by
   weight (bigger = more frequent / important). Native analogue of web TagCloud;
   same export + prop API. For journal topic clouds, interest tags. Distinct from
   Chip (single pill) and a form tag input.
   ========================================================================== */

export interface TagCloudItem {
  /** the tag text */
  label: string;
  /** relative importance / frequency — maps to one of 4 size buckets */
  weight?: number;
  /** per-tag press handler (overrides the cloud-level `onTagPress`) */
  onPress?: () => void;
}

/** weight → size bucket. */
export type TagCloudSize = 'sm' | 'md' | 'lg' | 'xl';

export interface TagCloudProps extends ViewProps {
  /** the weighted tags to render */
  tags: TagCloudItem[];
  /**
   * `mono` (default) keeps every pill the neutral glass/dim style, varying only
   * size; `gradient` tints the heavier buckets with the energy spectrum.
   */
  colorMode?: 'mono' | 'gradient';
  /** cloud-level press handler — fires for any tag without its own `onPress` */
  onTagPress?: (tag: TagCloudItem) => void;
}

/**
 * Map an arbitrary weight to one of 4 buckets. Treats the canonical 1..4 scale
 * directly; values outside that clamp to the nearest bucket so any positive
 * number still resolves sensibly.
 */
export function weightToSize(weight: number | undefined): TagCloudSize {
  const w = weight ?? 2;
  if (w >= 4) return 'xl';
  if (w >= 3) return 'lg';
  if (w >= 2) return 'md';
  return 'sm';
}

/** per-bucket font size (mirrors web .t-sm/.t-md/.t-lg/.t-xl). */
const FONT_SIZE: Record<TagCloudSize, number> = {
  sm: 11,
  md: 12.5,
  lg: 14.5,
  xl: 17,
};

/** gradient-mode tint per bucket; lg = cyan, xl = violet (mirrors web). */
const GRAD_TINT: Partial<Record<TagCloudSize, { color: string; border: string; bg: string }>> = {
  lg: { color: colors.accent2, border: 'rgba(34,211,238,0.3)', bg: colors.glass },
  xl: { color: '#cbbcff', border: 'rgba(124,92,255,0.4)', bg: 'rgba(124,92,255,0.08)' },
};

/** Weighted tag cloud — flex-wrapped mono pills sized by importance. */
export function TagCloud({ tags, colorMode = 'mono', onTagPress, style, ...rest }: TagCloudProps) {
  return (
    <View style={[styles.cloud, style]} {...rest}>
      {tags.map((tag, i) => {
        const size = weightToSize(tag.weight);
        const tint = colorMode === 'gradient' ? GRAD_TINT[size] : undefined;
        const pillStyle = [
          styles.tag,
          tint && { borderColor: tint.border, backgroundColor: tint.bg },
        ];
        const textStyle = [styles.label, { fontSize: FONT_SIZE[size] }, tint && { color: tint.color }];
        const handler = tag.onPress ?? (onTagPress ? () => onTagPress(tag) : undefined);

        if (handler) {
          return (
            <Pressable key={`${tag.label}-${i}`} onPress={handler} style={pillStyle}>
              <Text style={textStyle}>{tag.label}</Text>
            </Pressable>
          );
        }
        return (
          <View key={`${tag.label}-${i}`} style={pillStyle}>
            <Text style={textStyle}>{tag.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  label: {
    fontFamily: fonts.mono,
    color: colors.textDim,
  },
});
