import React from 'react';
import type { StatusBadgeProps, StatusTone } from './types';

const TONE_TEXT: Record<StatusTone, string> = {
  green:   'text-[#3FB661]',
  amber:   'text-[#F0A93B]',
  red:     'text-accent',
  neutral: 'text-secondary',
  info:    'text-white',
};

const TONE_DOT: Record<StatusTone, string> = {
  green:   'bg-[#3FB661]',
  amber:   'bg-[#F0A93B]',
  red:     'bg-accent',
  neutral: 'bg-muted',
  info:    'bg-white',
};

export default function StatusBadge({ tone, children, dot = true, className }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase ${TONE_TEXT[tone]} ${className ?? ''}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${TONE_DOT[tone]}`} />}
      {children}
    </span>
  );
}
