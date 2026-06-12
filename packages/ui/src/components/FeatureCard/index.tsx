import type { ReactNode } from 'react';
import Card from '../Card';
import { cn } from '../../cn';

export type FeatureAccent = 'mint' | 'cyan' | 'accent' | 'lime' | 'magenta';

export interface FeatureCardProps {
  /** Leading icon shown in the badge — inherits the accent color. */
  icon?: ReactNode;
  /** Feature title. */
  title: ReactNode;
  /** Feature body copy. */
  children: ReactNode;
  /** Icon badge accent color. */
  accent?: FeatureAccent;
  className?: string;
}

const ACCENT: Record<FeatureAccent, string> = {
  mint: 'var(--mint)',
  cyan: 'var(--accent-2)',
  accent: 'var(--accent)',
  lime: 'var(--lime)',
  magenta: 'var(--magenta)',
};

/** Marketing feature card: accent icon badge + title + body, tilts on pointer. */
export default function FeatureCard({ icon, title, children, accent = 'mint', className }: FeatureCardProps) {
  return (
    <Card hover tilt={6} className={cn(className)}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          marginBottom: 14,
          color: ACCENT[accent],
          background: 'var(--glass-2)',
          border: '1px solid var(--border)',
        }}
      >
        {icon}
      </div>
      <h3 className="lk-display" style={{ fontSize: 18, marginBottom: 8 }}>
        {title}
      </h3>
      <p className="lk-muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
        {children}
      </p>
    </Card>
  );
}
