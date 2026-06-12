import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../cn';

export interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Device mockup frame — wraps children in an Aurora phone with a notch. */
export default function PhoneFrame({ children, className, style }: PhoneFrameProps) {
  return (
    <div className={cn('lk-phone', className)} style={style}>
      <div className="lk-notch" />
      <div className="lk-screen">{children}</div>
    </div>
  );
}
