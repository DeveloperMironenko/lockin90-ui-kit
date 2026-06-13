import type { ReactNode } from 'react';
import { cn } from '../../cn';

/** Text color tokens shared across the marketing type scale. */
export type TypographyColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'white';

const COLOR: Record<TypographyColor, string> = {
  primary: 'lk-mk-c-primary',
  secondary: 'lk-mk-c-secondary',
  muted: 'lk-mk-c-muted',
  accent: 'lk-mk-c-accent',
  white: 'lk-mk-c-white',
};

/** Mono, uppercase, tracked label that sits above a heading. */
export function Eyebrow({
  children,
  color = 'secondary',
  className,
}: {
  children: ReactNode;
  color?: 'secondary' | 'accent' | 'muted';
  className?: string;
}) {
  return <div className={cn('lk-eyebrow', COLOR[color], className)}>{children}</div>;
}

/** Inline tabular-mono run — for stats, code-ish values, units. */
export function Mono({
  children,
  color = 'muted',
  className,
}: {
  children: ReactNode;
  color?: TypographyColor;
  className?: string;
}) {
  return <span className={cn('lk-mono', COLOR[color], className)}>{children}</span>;
}

const BODY_SIZE = {
  sm: 'lk-mk-body-sm',
  base: 'lk-mk-body-base',
  lg: 'lk-mk-body-lg',
} as const;

/** Body paragraph in the UI font. */
export function Body({
  children,
  size = 'base',
  color = 'secondary',
  className,
}: {
  children: ReactNode;
  size?: 'sm' | 'base' | 'lg';
  color?: TypographyColor;
  className?: string;
}) {
  return <p className={cn('lk-mk-body', BODY_SIZE[size], COLOR[color], className)}>{children}</p>;
}

/** Oversized intro paragraph — the line that follows a hero headline. */
export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('lk-mk-lead', className)}>{children}</p>;
}

type HeadingTag = 'h1' | 'h2' | 'h3';

const HEADING_SIZE = {
  display: 'lk-mk-h-display',
  title: 'lk-mk-h-title',
  sub: 'lk-mk-h-sub',
} as const;

/** Display headline rendered in the gradient display type. */
export function Heading({
  children,
  as = 'h2',
  size = 'title',
  className,
}: {
  children: ReactNode;
  as?: HeadingTag;
  size?: keyof typeof HEADING_SIZE;
  className?: string;
}) {
  const Tag = as;
  return (
    <Tag className={cn('lk-display', 'lk-gradient-text', HEADING_SIZE[size], className)}>
      {children}
    </Tag>
  );
}
