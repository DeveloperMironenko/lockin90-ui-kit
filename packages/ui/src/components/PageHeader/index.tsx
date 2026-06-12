import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Small mono label shown above the title. */
  eyebrow?: ReactNode;
  /** Right-aligned action node(s) — buttons, chips, etc. */
  actions?: ReactNode;
  className?: string;
}

/** Page title block: eyebrow + display title + subtitle, with right-aligned actions. */
export default function PageHeader({ title, subtitle, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div>
        {eyebrow && <span className="lk-eyebrow">{eyebrow}</span>}
        <h1 className="lk-display" style={{ fontSize: 26 }}>
          {title}
        </h1>
        {subtitle && (
          <p className="lk-muted" style={{ margin: '4px 0 0', fontSize: 14 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}
