import type { BrandMarkProps } from './types';

const SIZES = {
  sm: { numCls: 'text-[64px]',  labelCls: 'text-[8px]',  wrap: 'w-16 h-14' },
  md: { numCls: 'text-[90px]',  labelCls: 'text-[10px]', wrap: 'w-[86px] h-[78px]' },
  lg: { numCls: 'text-[120px]', labelCls: 'text-[12px]', wrap: 'w-[120px] h-[108px]' },
};

export default function BrandMark({ size = 'sm' }: BrandMarkProps) {
  const s = SIZES[size];
  return (
    <div className="inline-flex flex-col items-center">
      <div className={`relative ${s.wrap} flex items-center justify-center`}>
        <div className={`font-display italic font-black ${s.numCls} leading-[0.85] text-white tracking-[-0.04em] tabular-nums`}>
          90
        </div>
        <div className="absolute top-[52%] left-[-4%] w-[108%] h-[3px] bg-accent rotate-[-12deg] origin-left shadow-[0_0_8px_rgba(255,31,31,0.4)]" />
      </div>
      <div className={`font-display italic font-bold ${s.labelCls} tracking-[0.32em] text-white mt-0.5 uppercase`}>
        PERFORMANCE
      </div>
    </div>
  );
}
