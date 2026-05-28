'use client';

import type { ImpersonationBannerProps } from './types';

export default function ImpersonationBanner({ userEmail, onExit }: ImpersonationBannerProps) {
  return (
    <div className="sticky top-0 z-40 bg-accent text-white px-6 py-2 flex items-center justify-between border-b border-accent">
      <div className="flex items-center gap-3 font-display italic font-bold text-[12px] tracking-[0.1em] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        Impersonating <span className="font-mono text-[11px] not-italic">{userEmail}</span>
      </div>
      <button
        onClick={onExit}
        className="font-display italic font-bold text-[11px] tracking-[0.12em] uppercase text-white border border-white/40 hover:border-white px-3 py-1 rounded transition-colors"
      >
        Exit impersonation
      </button>
    </div>
  );
}
