import BrandMark from '../BrandMark';
import Slash from '../Slash';
import type { AuthPanelProps } from './types';

export default function AuthPanel({ tagline, topLeftLabel, topRightLabel }: AuthPanelProps) {
  return (
    <div className="w-[280px] shrink-0 border-r border-border flex flex-col items-center justify-center p-12 relative">
      {topLeftLabel && (
        <div className="absolute top-6 left-6 font-mono text-[10px] text-accent tracking-[0.18em]">
          {topLeftLabel}
        </div>
      )}
      {topRightLabel && (
        <div className="absolute top-6 right-6 font-mono text-[10px] text-muted tracking-[0.18em]">
          {topRightLabel}
        </div>
      )}

      <BrandMark size="lg" />

      {tagline && (
        <div className="mt-10 text-center">
          <Slash />
          <div className="mt-[14px] font-display italic font-bold text-[13px] tracking-[0.28em] uppercase text-secondary">
            {tagline}
          </div>
        </div>
      )}
    </div>
  );
}
