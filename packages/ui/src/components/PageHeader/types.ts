import type { ReactNode } from 'react';

export interface PageHeaderProps {
  eyebrow: string;
  title: string;
  slashWidth?: number;
  /** Optional right-aligned action slot (e.g. page-customization controls). */
  actions?: ReactNode;
}
