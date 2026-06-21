import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Size tier of a tag — drives font size and tint (xl is the most frequent). */
export type TagSize = 'xl' | 'lg' | 'md' | 'sm';

export interface TagCloudItem {
  /** the tag text, e.g. '#sleep' */
  label: string;
  /** optional frequency count shown after the label */
  count?: number;
  /** weight tier (xl = biggest/most frequent) */
  size: TagSize;
  /** xl tags only: render the label with the flux gradient highlight */
  grad?: boolean;
}

export interface TagCloudProps extends HTMLAttributes<HTMLDivElement> {
  /** weighted tags, ordered most-frequent first */
  tags?: TagCloudItem[];
  /** card heading */
  title?: string;
  /** mono sub-label, e.g. a time window */
  sub?: string;
  /** filter hint shown below the cloud (omit to hide) */
  hint?: string;
}

const DEFAULT_TAGS: TagCloudItem[] = [
  { label: '#sleep', count: 42, size: 'xl', grad: true },
  { label: '#focus', count: 31, size: 'lg' },
  { label: '#caffeine', count: 28, size: 'lg' },
  { label: '#workout', count: 24, size: 'md' },
  { label: '#stress', size: 'md' },
  { label: '#travel', size: 'sm' },
  { label: '#cold-plunge', size: 'md' },
  { label: '#fasting', size: 'sm' },
  { label: '#mood', size: 'md' },
  { label: '#recovery', size: 'lg' },
  { label: '#walk', size: 'sm' },
  { label: '#hydration', size: 'sm' },
  { label: '#calm', size: 'md' },
  { label: '#sunlight', size: 'sm' },
];

const SIZE_CLASS: Record<TagSize, string> = {
  xl: 'lk-tag-xl',
  lg: 'lk-tag-lg',
  md: 'lk-tag-md',
  sm: 'lk-tag-sm',
};

/** Weighted tag cloud — journal/log tags sized & tinted by frequency, the most
 *  frequent rendered with a gradient highlight + count, in a wrapped flow with a
 *  filter hint. Renders the showcase example by default. */
export function TagCloud({
  tags = DEFAULT_TAGS,
  title = 'Your tags',
  sub = 'last 90 days',
  hint = 'Tap a tag to filter your journal',
  className,
  ...rest
}: TagCloudProps) {
  return (
    <div className={cn('lk-card', 'lk-tag-card', className)} {...rest}>
      <div className="lk-tag-head">
        <span className="lk-tag-title lk-display">{title}</span>
        {sub && <span className="lk-tag-sub lk-mono">{sub}</span>}
      </div>
      <div className="lk-tag-cloud">
        {tags.map((tag, i) => {
          const useGrad = tag.size === 'xl' && tag.grad;
          return (
            <a key={`${tag.label}-${i}`} className={cn(SIZE_CLASS[tag.size], useGrad && 'lk-tag-grad')}>
              {useGrad ? <span className="lk-tag-lbl">{tag.label}</span> : tag.label}
              {tag.count != null && <span className="lk-tag-n">{tag.count}</span>}
            </a>
          );
        })}
      </div>
      {hint && <span className="lk-tag-hint">{hint}</span>}
    </div>
  );
}
