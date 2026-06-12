'use client';

import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../cn';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  /** Renders the error/invalid styling (`lk-invalid`) and sets `aria-invalid`. */
  invalid?: boolean;
  className?: string;
}

/** Aurora multi-line text input (vertically resizable). */
export default function Textarea({ invalid, className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={cn('lk-textarea', invalid && 'lk-invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}
