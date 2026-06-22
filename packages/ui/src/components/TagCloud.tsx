import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/* ============================================================================
   TagCloud — a flex-wrapped collection of weighted tag pills, sized by weight
   (bigger = more frequent / more important). For journal topic clouds, interest
   tags, etc. Distinct from TagInput (a form control) and Chip (a single pill).
   Mirrors `.tagcloud` from the journal design: mono pills in 4 size buckets
   (.t-sm / .t-md / .t-lg / .t-xl). In `gradient` mode the bigger buckets pick
   up spectrum tints (cyan for lg, violet for xl); `mono` keeps them neutral.
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

export interface TagCloudProps extends HTMLAttributes<HTMLDivElement> {
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

const SIZE_CLASS: Record<TagCloudSize, string> = {
  sm: 'lk-tagcloud-sm',
  md: 'lk-tagcloud-md',
  lg: 'lk-tagcloud-lg',
  xl: 'lk-tagcloud-xl',
};

/**
 * Map an arbitrary weight to one of 4 buckets. Treats the canonical 1..4 scale
 * directly; values outside that clamp to the nearest bucket so any positive
 * number (raw frequency, score) still resolves sensibly.
 */
export function weightToSize(weight: number | undefined): TagCloudSize {
  const w = weight ?? 2;
  if (w >= 4) return 'xl';
  if (w >= 3) return 'lg';
  if (w >= 2) return 'md';
  return 'sm';
}

/** Weighted tag cloud — flex-wrapped mono pills sized by importance. */
export const TagCloud = forwardRef<HTMLDivElement, TagCloudProps>(function TagCloud(
  { tags, colorMode = 'mono', onTagPress, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('lk-tagcloud', colorMode === 'gradient' && 'lk-tagcloud-grad', className)}
      {...rest}
    >
      {tags.map((tag, i) => {
        const handler = tag.onPress ?? (onTagPress ? () => onTagPress(tag) : undefined);
        const sizeClass = SIZE_CLASS[weightToSize(tag.weight)];
        if (handler) {
          return (
            <button
              key={`${tag.label}-${i}`}
              type="button"
              className={cn('lk-tagcloud-tag', sizeClass)}
              onClick={handler}
            >
              {tag.label}
            </button>
          );
        }
        return (
          <span key={`${tag.label}-${i}`} className={cn('lk-tagcloud-tag', sizeClass)}>
            {tag.label}
          </span>
        );
      })}
    </div>
  );
});
