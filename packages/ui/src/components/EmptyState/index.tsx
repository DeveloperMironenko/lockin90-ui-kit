import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface EmptyStateProps {
  /** Glyph shown in a glass circle at the top. */
  icon?: ReactNode;
  /** Back-compat (pre-Aurora): small label above the heading (admin app). */
  eyebrow?: ReactNode;
  /** Heading text. Optional when the back-compat `heading` alias is supplied. */
  title?: ReactNode;
  /** Back-compat (pre-Aurora) alias for `title`. Rendered as `heading ?? title`. */
  heading?: ReactNode;
  description?: ReactNode;
  /** Optional call-to-action node (e.g. a `<Button>`). */
  action?: ReactNode;
  className?: string;
}

/** Centered zero/empty state — glass icon disc, title, description, optional action. */
export default function EmptyState({ icon, eyebrow, title, heading, description, action, className }: EmptyStateProps) {
  const titleNode = heading ?? title;
  return (
    <div
      className={className}
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: 40,
      }}
    >
      {icon && (
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--glass-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-dim)',
          }}
        >
          {icon}
        </span>
      )}
      {eyebrow != null && <div className="lk-eyebrow">{eyebrow}</div>}
      {titleNode != null && (
        <h3 className="lk-display" style={{ fontSize: 18 }}>
          {titleNode}
        </h3>
      )}
      {description && (
        <p className="lk-muted" style={{ maxWidth: '42ch', fontSize: 14 }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
