import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type HighlightTone = 'accent' | 'mint' | 'warm' | 'low';

export interface HighlightProps extends HTMLAttributes<HTMLSpanElement> {
  /** signal color for the emphasized keyword */
  tone?: HighlightTone;
}

const TONE: Record<HighlightTone, string> = {
  accent: '',
  mint: 'lk-hl-mint',
  warm: 'lk-hl-warm',
  low: 'lk-hl-low',
};

/** Inline tone-colored text emphasis for AI-summary / insight prose.
 *  Flows inside a paragraph: colored bold keyword on a faint tinted background. */
export const Highlight = forwardRef<HTMLSpanElement, HighlightProps>(function Highlight(
  { tone = 'accent', className, ...rest },
  ref,
) {
  return <span ref={ref} className={cn('lk-hl', TONE[tone], className)} {...rest} />;
});
