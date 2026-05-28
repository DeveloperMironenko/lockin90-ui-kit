'use client';

import { useState } from 'react';
import { formatSync } from './helpers';
import type { WearableCardProps } from './types';

function ServiceLogo({ id, size = 28 }: { id: string; size?: number }) {
  if (id === 'whoop') return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle"
        fontFamily="Arial Black, sans-serif" fontWeight="900"
        fontSize="18" fill="#FFFFFF" letterSpacing="-1">W</text>
    </svg>
  );
  return (
    <div className="font-display italic font-extrabold text-[18px] text-white">
      {id[0].toUpperCase()}
    </div>
  );
}

export default function WearableCard({
  provider, name, isConnected, lastSyncAt, details,
  onConnect, onDisconnect, isLoading, comingSoon,
}: WearableCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-surface border border-border-strong rounded overflow-hidden relative ${comingSoon ? 'opacity-45' : ''}`}>
      {!comingSoon && (
        <div
          className="absolute top-0 right-0 w-[18px] h-[18px] bg-accent"
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
        />
      )}

      <div className={`w-full py-4 px-[18px] flex items-center gap-[14px] ${!comingSoon ? 'cursor-pointer' : ''}`}
        onClick={() => !comingSoon && setExpanded(!expanded)}
        role={!comingSoon ? 'button' : undefined}
      >
        <div className="w-11 h-11 rounded-sm bg-base border border-border-strong flex items-center justify-center shrink-0">
          <ServiceLogo id={provider} size={28} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-display italic font-extrabold text-xl text-white uppercase tracking-[0.04em]">
            {name}
          </div>
          <div className="ea-mono text-secondary mt-[3px]">
            {comingSoon ? 'COMING SOON' : isConnected ? `CONNECTED · synced ${formatSync(lastSyncAt)}` : 'NOT CONNECTED'}
          </div>
        </div>

        {!comingSoon && (
          <div className="flex items-center gap-[6px] font-display italic font-bold text-[11px] text-accent tracking-[0.14em] uppercase shrink-0">
            {expanded ? 'HIDE' : 'DETAILS'}
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }}
            >
              <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {!comingSoon && (
        <div className="px-[18px] pb-4">
          {isConnected ? (
            <button
              onClick={onDisconnect}
              disabled={isLoading}
              className={`py-2 px-4 bg-transparent border border-accent/40 rounded cursor-pointer font-display italic font-bold text-[11px] text-accent tracking-[0.12em] uppercase transition-all duration-200 ${isLoading ? 'opacity-50' : ''}`}
            >
              {isLoading ? 'Disconnecting…' : 'Disconnect'}
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={isLoading}
              className={`relative overflow-hidden py-2 px-4 bg-white border-none rounded cursor-pointer font-display italic font-extrabold text-[11px] text-black tracking-[0.12em] uppercase transition-opacity duration-200 ${isLoading ? 'opacity-50' : ''}`}
            >
              {isLoading ? 'Connecting…' : `Connect ${name}`}
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-accent" />
            </button>
          )}
        </div>
      )}

      {!comingSoon && expanded && details && details.length > 0 && (
        <div
          className="px-[18px] pb-4 border-t border-border"
          style={{ animation: 'ea-fade-in 250ms var(--ease-smooth)' }}
        >
          <div className="grid grid-cols-3 gap-[6px] pt-[14px]">
            {details.map(({ label, value }) => (
              <div key={label} className="bg-base border border-border py-[10px] px-3">
                <div className="ea-mono text-muted text-[9px]">{label.toUpperCase()}</div>
                <div className="font-display italic font-extrabold text-base text-white mt-1">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
