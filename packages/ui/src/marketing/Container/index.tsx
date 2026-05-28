import React from 'react';
import { cn } from '../_cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Narrower max width for long-form reading (legal, blog article). */
  size?: 'default' | 'prose' | 'wide';
}

const SIZE: Record<NonNullable<ContainerProps['size']>, string> = {
  default: 'max-w-[1200px]',
  prose: 'max-w-[760px]',
  wide: 'max-w-[1320px]',
};

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', SIZE[size], className)}>
      {children}
    </div>
  );
}
