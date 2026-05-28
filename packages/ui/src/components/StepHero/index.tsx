import type { StepHeroProps } from './types';

export default function StepHero({ step, total, title, status }: StepHeroProps) {
  const stepLabel = `STEP / ${String(step).padStart(2, '0')} OF ${String(total).padStart(2, '0')}`;
  const stepNum = String(step).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');

  return (
    <div className="pt-5 pb-6 border-b border-border mb-6">
      <div className="flex justify-between mb-[18px]">
        <span className="font-mono text-[10px] text-muted tracking-[0.22em]">{stepLabel}</span>
        <span className="font-mono text-[10px] text-accent tracking-[0.22em]">● {status}</span>
      </div>

      <div className="flex items-end mb-1">
        <div className="relative shrink-0 pr-2.5">
          <span
            className="font-display italic font-black text-[120px] leading-none text-white select-none pr-4 block"
            style={{ letterSpacing: '-4px' }}
          >
            {stepNum}
          </span>
          <div
            className="absolute bg-accent"
            style={{ top: '50%', left: '-8%', width: '116%', height: 4, transform: 'rotate(-12deg)' }}
          />
        </div>

        <div className="pb-3 flex-1 pl-[18px]">
          <div className="font-mono text-[9px] tracking-[0.18em] text-secondary uppercase">OF {totalNum}</div>
          <div className="font-display italic text-[26px] text-white uppercase mt-0.5">{title}</div>
        </div>
      </div>

      <div className="flex gap-1 mt-4">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`flex-1 h-[3px] ${i < step ? 'bg-accent' : 'bg-border'}`} />
        ))}
      </div>
    </div>
  );
}
