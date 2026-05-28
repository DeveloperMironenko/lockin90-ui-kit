import React from 'react';
import { cn } from '../_cn';

type Color = 'primary' | 'secondary' | 'muted' | 'accent' | 'white';

const COLOR: Record<Color, string> = {
  primary: 'text-white',
  secondary: 'text-secondary',
  muted: 'text-muted',
  accent: 'text-accent',
  white: 'text-white',
};

export function Eyebrow({
  children,
  color = 'secondary',
  className,
}: {
  children: React.ReactNode;
  color?: 'secondary' | 'accent' | 'muted';
  className?: string;
}) {
  return <div className={cn('ea-eyebrow', COLOR[color], className)}>{children}</div>;
}

export function Mono({
  children,
  color = 'muted',
  className,
}: {
  children: React.ReactNode;
  color?: Color;
  className?: string;
}) {
  return <span className={cn('ea-mono', COLOR[color], className)}>{children}</span>;
}

export function Body({
  children,
  size = 'base',
  color = 'secondary',
  className,
}: {
  children: React.ReactNode;
  size?: 'sm' | 'base' | 'lg';
  color?: Color;
  className?: string;
}) {
  const sizeClass = size === 'sm' ? 'text-sm leading-relaxed' : size === 'lg' ? 'text-lg leading-relaxed' : 'text-base leading-relaxed';
  return <p className={cn(sizeClass, COLOR[color], className)}>{children}</p>;
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-lg sm:text-xl leading-relaxed text-secondary max-w-prose', className)}>
      {children}
    </p>
  );
}

type HeadingTag = 'h1' | 'h2' | 'h3';

const HEADING_SIZE = {
  display: 'text-[44px] leading-[0.95] sm:text-6xl lg:text-7xl',
  title: 'text-[34px] leading-[0.98] sm:text-5xl',
  sub: 'text-2xl sm:text-3xl',
} as const;

export function Heading({
  children,
  as = 'h2',
  size = 'title',
  className,
}: {
  children: React.ReactNode;
  as?: HeadingTag;
  size?: keyof typeof HEADING_SIZE;
  className?: string;
}) {
  const Tag = as;
  return (
    <Tag className={cn('ea-display ea-text-gradient', HEADING_SIZE[size], className)}>
      {children}
    </Tag>
  );
}
