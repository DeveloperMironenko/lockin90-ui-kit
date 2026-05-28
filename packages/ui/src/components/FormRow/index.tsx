import React from 'react';

// ─── FormRow ──────────────────────────────────────────────────────────────────
// Labeled row used inside profile-style settings forms.
// Renders a small all-caps label + children + a bottom border (unless `last`).
// Pair with Input/NumberInput/Select components — pass without their `label` prop.

interface FormRowProps {
  label: string;
  last?: boolean;
  danger?: boolean;
  children?: React.ReactNode;
}

export function FormRow({ label, last = false, danger = false, children }: FormRowProps) {
  return (
    <div className={`py-4 ${last ? '' : 'border-b border-border'}`}>
      <span className={`block font-display italic font-bold text-[11px] tracking-[0.18em] uppercase ${danger ? 'text-accent' : 'text-secondary'} ${children ? 'mb-[6px]' : ''}`}>
        {label}
      </span>
      {children}
    </div>
  );
}

// ─── FormSection ─────────────────────────────────────────────────────────────
// Groups FormRows under an eyebrow title with a top border.

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <div className={className}>
      {title && <div className="ea-eyebrow mb-2.5">{title}</div>}
      <div className="border-t border-border">
        {children}
      </div>
    </div>
  );
}
