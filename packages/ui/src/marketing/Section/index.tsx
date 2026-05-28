import React from 'react';
import { Container } from '../Container';
import { Eyebrow, Heading, Body } from '../Typography';
import { cn } from '../_cn';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerSize?: 'default' | 'prose' | 'wide';
  /** Vertical rhythm. */
  spacing?: 'default' | 'tight' | 'loose';
}

const SPACING = {
  default: 'py-20 sm:py-28',
  tight: 'py-14 sm:py-20',
  loose: 'py-24 sm:py-36',
} as const;

export function Section({
  children,
  id,
  className,
  containerSize = 'default',
  spacing = 'default',
}: SectionProps) {
  return (
    <section id={id} className={cn(SPACING[spacing], 'scroll-mt-24', className)}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'center', className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center mx-auto max-w-2xl' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && <Eyebrow color="accent">{eyebrow}</Eyebrow>}
      <Heading as="h2" size="title">
        {title}
      </Heading>
      {subtitle && (
        <Body size="lg" color="secondary" className={align === 'center' ? 'mx-auto' : ''}>
          {subtitle}
        </Body>
      )}
    </div>
  );
}
