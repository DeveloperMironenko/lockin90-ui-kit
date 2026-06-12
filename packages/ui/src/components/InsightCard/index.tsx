import type { ReactNode } from 'react';
import Card from '../Card';
import { cn } from '../../cn';

export interface InsightCardProps {
  /** Leading icon next to the title. */
  icon?: ReactNode;
  /** Insight headline. */
  title: ReactNode;
  /** Body copy. */
  children: ReactNode;
  /** Chips row under the body (e.g. <Chip/> elements). */
  meta?: ReactNode;
  /** Right-hand sparkline slot — when present, lays out a [1fr 132px] grid. */
  chart?: ReactNode;
  className?: string;
}

/** Pattern-detected insight: title + body + meta chips, with an optional right sparkline. */
export default function InsightCard({ icon, title, children, meta, chart, className }: InsightCardProps) {
  return (
    <Card hover className={cn(className)}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: chart ? '1fr 132px' : '1fr',
          gap: 18,
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
            {icon}
            <h4 className="lk-display" style={{ fontSize: 16 }}>
              {title}
            </h4>
          </div>
          <p className="lk-muted" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>
            {children}
          </p>
          {meta && <div style={{ display: 'flex', gap: 8, marginTop: 11, flexWrap: 'wrap' }}>{meta}</div>}
        </div>
        {chart}
      </div>
    </Card>
  );
}
