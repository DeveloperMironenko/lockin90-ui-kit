'use client';

import React from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANT_CLASS: Record<Variant, string> = {
  primary:   'ea-btn ea-btn-primary',
  secondary: 'ea-btn ea-btn-secondary',
  ghost:     'ea-btn ea-btn-ghost',
};

interface ButtonProps {
  variant?: Variant;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  onClick,
  children,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${VARIANT_CLASS[variant]} ${loading ? 'opacity-70' : ''} ${className ?? ''}`}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export function ButtonLink({ href, variant = 'primary', children, className }: ButtonLinkProps) {
  return (
    <Link href={href} className={`${VARIANT_CLASS[variant]} ${className ?? ''}`}>
      {children}
    </Link>
  );
}
