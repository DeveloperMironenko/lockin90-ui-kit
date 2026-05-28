'use client';

import React from 'react';
import Toggle from '../Toggle';
import { Body, Eyebrow } from '../Typography';

export interface DataSharingCategory {
  category: string;
  isGranted: boolean;
  label: string;
  description?: string;
}

interface DataSharingMatrixProps {
  rows: DataSharingCategory[];
  onToggle: (category: string, next: boolean) => void;
  disabled?: boolean;
  className?: string;
}

// Per-category data-sharing grid. Each row is a category with a label, optional description, and
// a toggle. Used by the coach module (client-side sharing toggles per data category).
export function DataSharingMatrix({
  rows,
  onToggle,
  disabled,
  className,
}: DataSharingMatrixProps) {
  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      {rows.map((row, idx) => (
        <div
          key={row.category}
          className={`flex items-start justify-between gap-4 py-3 ${
            idx < rows.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          <div className="min-w-0">
            <Eyebrow>{row.label}</Eyebrow>
            {row.description && (
              <Body size="sm" color="muted" className="mt-1">
                {row.description}
              </Body>
            )}
          </div>
          <Toggle
            checked={row.isGranted}
            disabled={disabled}
            onChange={(next) => onToggle(row.category, next)}
          />
        </div>
      ))}
    </div>
  );
}

export default DataSharingMatrix;
