import React from 'react';

// ─── Divider ──────────────────────────────────────────────────────────────────
// Horizontal rule. strength="strong" uses border-strong colour.

interface DividerProps {
  strength?: 'default' | 'strong';
  className?: string;
}

export function Divider({ strength = 'default', className }: DividerProps) {
  return (
    <div className={`h-px ${strength === 'strong' ? 'bg-border-strong' : 'bg-border'} ${className ?? ''}`} />
  );
}

// ─── OrDivider ────────────────────────────────────────────────────────────────
// The "line — OR — line" separator used between auth methods.

interface OrDividerProps {
  label?: string;
  className?: string;
}

export function OrDivider({ label = 'OR', className }: OrDividerProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <div className="flex-1 h-px bg-border" />
      <span className="ea-mono text-muted">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
