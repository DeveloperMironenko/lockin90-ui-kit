import type { ReactNode } from 'react';
import { Container } from '../Container';
import { Eyebrow, Heading, Body } from '../Typography';
import { cn } from '../../cn';

export interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  containerSize?: 'default' | 'prose' | 'wide';
  /** Vertical rhythm between sections. */
  spacing?: 'default' | 'tight' | 'loose';
}

const SPACING = {
  default: 'lk-mk-section-default',
  tight: 'lk-mk-section-tight',
  loose: 'lk-mk-section-loose',
} as const;

/** A page section: vertical rhythm + an anchor-aware scroll offset, wrapping a Container. */
export function Section({
  children,
  id,
  className,
  containerSize = 'default',
  spacing = 'default',
}: SectionProps) {
  return (
    <section id={id} className={cn('lk-mk-section', SPACING[spacing], className)}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

export interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

/** Eyebrow + gradient title + subtitle block that opens a Section. */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'lk-mk-section-header',
        align === 'center' ? 'lk-mk-section-header-center' : 'lk-mk-section-header-left',
        className,
      )}
    >
      {eyebrow && <Eyebrow color="accent">{eyebrow}</Eyebrow>}
      <Heading as="h2" size="title">
        {title}
      </Heading>
      {subtitle && (
        <Body size="lg" color="secondary">
          {subtitle}
        </Body>
      )}
    </div>
  );
}
