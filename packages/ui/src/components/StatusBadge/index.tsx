import React from 'react';
import type { StatusBadgeProps, StatusTone } from './types';

const TONE_TEXT: Record<StatusTone, string> = {
  green:   'text-[#34F5C5]',
  amber:   'text-[#FFB020]',
  red:     'text-[#FF4D6D]',
  neutral: 'text-secondary',
  info:    'text-accent-2',
};

const TONE_DOT: Record<StatusTone, string> = {
  green:   'bg-[#34F5C5]',
  amber:   'bg-[#FFB020]',
  red:     'bg-[#FF4D6D]',
  neutral: 'bg-muted',
  info:    'bg-accent-2',
};

export default function StatusBadge({ tone, children, dot = true, className }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase ${TONE_TEXT[tone]} ${className ?? ''}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${TONE_DOT[tone]}`} />}
      {children}
    </span>
  );
}
