import type { VersionStatus, VersionStatusPillProps } from './types';

const TONE: Record<VersionStatus, { label: string; text: string; dot: string }> = {
  canary:      { label: 'canary',      text: 'text-[#F0A93B]', dot: 'bg-[#F0A93B]' },
  standard:    { label: 'standard',    text: 'text-white',     dot: 'bg-white' },
  all:         { label: 'all users',   text: 'text-[#3FB661]', dot: 'bg-[#3FB661]' },
  rolled_back: { label: 'rolled back', text: 'text-accent',    dot: 'bg-accent' },
  inactive:    { label: 'inactive',    text: 'text-muted',     dot: 'bg-muted' },
};

export default function VersionStatusPill({ status, className }: VersionStatusPillProps) {
  const t = TONE[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase ${t.text} ${className ?? ''}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
      {t.label}
    </span>
  );
}
