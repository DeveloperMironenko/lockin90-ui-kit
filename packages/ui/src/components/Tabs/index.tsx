'use client';

import Link from 'next/link';
import type { TabsProps } from './types';

export default function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={`flex items-center gap-0 border-b border-border ${className ?? ''}`}>
      {tabs.map(tab => {
        const isActive = tab.id === active;
        const cls = `relative px-4 py-3 font-display italic font-bold text-[12px] tracking-[0.1em] uppercase transition-colors ${
          isActive ? 'text-white' : 'text-muted hover:text-secondary'
        }`;
        const inner = (
          <>
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="ml-1.5 font-mono text-[10px] tracking-[0.04em] text-secondary not-italic">
                {tab.count}
              </span>
            )}
            {isActive && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-accent" />}
          </>
        );
        return tab.href ? (
          <Link key={tab.id} href={tab.href} className={cls}>{inner}</Link>
        ) : (
          <button key={tab.id} onClick={() => onChange?.(tab.id)} className={cls}>{inner}</button>
        );
      })}
    </div>
  );
}
