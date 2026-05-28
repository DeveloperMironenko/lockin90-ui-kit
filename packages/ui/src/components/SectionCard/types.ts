import type { ReactNode } from 'react';

export interface SectionCardProps {
  eyebrow?: string;
  title?: string;
  /** Secondary line under the title — usually a date range, count, or hint. */
  subtitle?: ReactNode;
  /** Header right-side slot (action chip, link, status pill). */
  action?: ReactNode;
  children: ReactNode;
  /** Optional pinned footer row — never scrolls with the body. */
  footer?: ReactNode;
  padding?: 'tight' | 'normal' | 'loose' | 'none';
  /** Extra classes on the outer card. */
  className?: string;
  /** Extra classes on the body region. Use to drop the default overflow if the
   *  body is intrinsically non-scrolling (e.g. a chart that should clip). */
  bodyClassName?: string;
}
