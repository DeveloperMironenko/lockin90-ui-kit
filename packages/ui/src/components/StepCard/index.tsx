import type { ReactNode } from 'react';
import Card from '../Card';
import { cn } from '../../cn';

export interface StepCardProps {
  /** Step number shown in the gradient badge. */
  step: number;
  /** Step title. */
  title: ReactNode;
  /** Step body copy. */
  children: ReactNode;
  className?: string;
}

/** How-it-works numbered step: gradient number badge + title + body. */
export default function StepCard({ step, title, children, className }: StepCardProps) {
  return (
    <Card className={cn(className)}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: '#07080d',
          background: 'var(--grad-cta)',
          marginBottom: 14,
        }}
      >
        {step}
      </div>
      <h3 className="lk-display" style={{ fontSize: 18, marginBottom: 8 }}>
        {title}
      </h3>
      <p className="lk-muted" style={{ margin: 0, fontSize: 14 }}>
        {children}
      </p>
    </Card>
  );
}
