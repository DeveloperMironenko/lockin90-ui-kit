'use client';

import React from 'react';
import { Badge } from '../Badge';
import Toggle from '../Toggle';
import { Body } from '../Typography';

interface ModuleToggleRowProps {
  title: string;
  description?: string;
  isEnabled: boolean;
  onToggle: (next: boolean) => void;
  recommended?: boolean;
  disabled?: boolean;
  className?: string;
}

// Title + description + toggle row used by Settings → Features and by the
// admin module catalog. Recommended modules render a small accent badge.
export function ModuleToggleRow({
  title,
  description,
  isEnabled,
  onToggle,
  recommended,
  disabled,
  className,
}: ModuleToggleRowProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 py-3 border-b border-border last:border-0 ${
        className ?? ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display italic font-bold text-[14px] text-white uppercase tracking-[0.04em]">
            {title}
          </span>
          {recommended && <Badge variant="active">RECOMMENDED</Badge>}
        </div>
        {description && (
          <Body color="secondary" className="mt-1">
            {description}
          </Body>
        )}
      </div>
      <Toggle checked={isEnabled} onChange={onToggle} disabled={disabled} />
    </div>
  );
}

export default ModuleToggleRow;
