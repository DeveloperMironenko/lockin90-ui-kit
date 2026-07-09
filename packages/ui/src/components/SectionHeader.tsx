import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Eyebrow } from './Eyebrow';
import { GradientText } from './GradientText';

export interface SectionHeaderProps extends HTMLAttributes<HTMLElement> {
  /** mono uppercase overline (e.g. "Today · Thu Jun 11"). Omit for a bare title. */
  eyebrow?: string;
  /** the display title (e.g. "Energy"). */
  title: string;
  /** gradient-fill the title ('flux' | 'cta' | 'violet'), or `false` for a plain
   *  (solid) title. Default 'flux' — the mockups map section titles to GradientText. */
  gradient?: 'flux' | 'cta' | 'violet' | false;
}

/** SectionHeader — the mockups' `.section-head`: an Eyebrow overline above a
 *  display title, optionally gradient-filled. The web twin of the native
 *  SectionHeader; composes the kit `Eyebrow` + `GradientText`. */
export function SectionHeader({ eyebrow, title, gradient = 'flux', className, ...rest }: SectionHeaderProps) {
  return (
    <div className={cn('lk-section-header', className)} {...rest}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {gradient ? (
        <GradientText as="h2" gradient={gradient} className="lk-section-title">
          {title}
        </GradientText>
      ) : (
        <h2 className="lk-section-title">{title}</h2>
      )}
    </div>
  );
}
