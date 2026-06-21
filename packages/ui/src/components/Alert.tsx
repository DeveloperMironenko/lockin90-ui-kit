import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

export type AlertTone = 'info' | 'success' | 'warn' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** signal color + default icon (info=accent, success=mint, warn=amber, danger=red) */
  tone?: AlertTone;
  /** bold heading line (font-display) */
  title?: string;
  /** body text under the title */
  children?: ReactNode;
  /** override the leading glyph; defaults to a tone-appropriate icon */
  icon?: ReactNode;
  /** when provided, renders a top-right × close button */
  onDismiss?: () => void;
}

const TONE: Record<AlertTone, string> = {
  info: 'lk-alert-info',
  success: 'lk-alert-success',
  warn: 'lk-alert-warn',
  danger: 'lk-alert-danger',
};

/** Warning-triangle glyph — shared between warn + danger tones. */
const WARNING = (
  <span className="lk-icon" aria-hidden="true">
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4 2.5 20.5h19z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  </span>
);

/** Per-tone default leading icon. */
const DEFAULT_ICON: Record<AlertTone, ReactNode> = {
  info: <Icon name="info" size={18} />,
  success: <Icon name="check" size={18} />,
  warn: WARNING,
  danger: WARNING,
};

/** Tinted callout box — info / success / warn / danger banner with optional dismiss. */
export function Alert({
  tone = 'info',
  title,
  children,
  icon,
  onDismiss,
  className,
  ...rest
}: AlertProps) {
  return (
    <div className={cn('lk-alert', TONE[tone], className)} role="status" {...rest}>
      <span className="lk-alert-icon" aria-hidden="true">
        {icon ?? DEFAULT_ICON[tone]}
      </span>
      <div className="lk-alert-body">
        {title && <h5 className="lk-alert-title">{title}</h5>}
        {children && <p className="lk-alert-text">{children}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="lk-alert-close"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
