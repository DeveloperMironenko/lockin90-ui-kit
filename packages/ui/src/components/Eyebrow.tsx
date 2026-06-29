import { type ElementType, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  /** Element to render as (default `span`), e.g. `'h2'` for a section overline. */
  as?: ElementType;
  /** When true, appends an accent `*` after the label — matches `FormField` /
   *  `Input` / `Select`'s required marker so Eyebrow-labeled controls
   *  (SegmentedTabs, custom field groups) share the same affordance. */
  required?: boolean;
}

/** Eyebrow — a mono, uppercase, letter-spaced overline label for section headers
 *  ("Generated · 6", "Targets"). Tiny presentational primitive. */
export function Eyebrow({ as: Tag = 'span', required = false, className, children, ...rest }: EyebrowProps) {
  return (
    <Tag className={cn('lk-eyebrow', className)} {...rest}>
      {children}
      {required ? (
        <span className="lk-field-req" aria-hidden="true">
          *
        </span>
      ) : null}
    </Tag>
  );
}
