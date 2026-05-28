import React from 'react';
import { cn } from '../_cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article' | 'li';
}

export function Card({ children, className, hover = false, as = 'div' }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'relative rounded-md border border-border bg-surface p-6 sm:p-7',
        hover && 'transition-colors duration-200 hover:border-border-strong hover:bg-elevated',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
