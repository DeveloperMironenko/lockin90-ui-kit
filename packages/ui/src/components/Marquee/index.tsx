import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface MarqueeProps {
  /** Track content. Rendered twice internally for a seamless -50% loop. */
  children: ReactNode;
  className?: string;
}

/** Infinite horizontal ticker that pauses on hover. */
export default function Marquee({ children, className }: MarqueeProps) {
  return (
    <div className={cn('lk-marquee-mask', className)} style={{ overflow: 'hidden' }}>
      <div className="lk-marquee" aria-hidden="false">
        {children}
        {children}
      </div>
    </div>
  );
}
