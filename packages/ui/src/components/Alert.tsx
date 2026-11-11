import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

export type AlertTone = 'info' | 'success' | 'warn' | 'danger' | 'neutral' | 'cyan' | 'violet';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** signal color + default icon (info=accent, success=mint, warn=amber, danger=red);
   *  `neutral` (glass box) and `cyan` (cyan-tinted box) are quiet notes: no left bar, a cyan icon;
   *  `violet` (accent-tinted box, accent icon) is the onboarding "why we ask" note */
  tone?: AlertTone;
  /** bold heading line (font-display) */
  title?: string;
  /** body text under the title */
  children?: ReactNode;
  /** override the leading glyph; defaults to a tone-appropriate icon */
  icon?: ReactNode;
  /** when provided, renders a top-right × close button */
  onDismiss?: () => void;
  /** the × button's name, in the app's language (CONVENTIONS "Accessibility": names via props).
   *  @default 'Dismiss' (an English fallback for older apps) */
  dismissLabel?: string;
  /** the title's element: a heading level when the alert starts a section of the page, else a plain
   *  `p` (the default: an alert's title is not a page heading). Native: a heading level makes the title
   *  a header. */
  titleAs?: AlertTitleLevel;
  /** `false`: no live region at all (the app announces it itself). @default true */
  live?: boolean;
  /** content under the text that is NOT announced when it changes — a ticking countdown ("Try again in
   *  0:42"): the live region is then the title and text only. */
  footer?: ReactNode;
}

export type AlertTitleLevel = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const TONE: Record<AlertTone, string> = {
  info: 'lk-alert-info',
  success: 'lk-alert-success',
  warn: 'lk-alert-warn',
  danger: 'lk-alert-danger',
  neutral: 'lk-alert-neutral',
  cyan: 'lk-alert-cyan',
  violet: 'lk-alert-violet',
};

/** The bold part of a note's sentence (a `violet` note colours it light accent). The same name as the
 *  native twin, so an i18n `Trans` reads alike on both: `components={{ b: <AlertStrong /> }}`. */
export function AlertStrong({ children }: { children?: ReactNode }) {
  return <b>{children}</b>;
}

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
  // the notes' 17px glyph size is set in alert.css (for app icons too)
  neutral: <Icon name="info" />,
  cyan: <Icon name="info" />,
  violet: <Icon name="info" />,
};

/** Tinted callout box — info / success / warn / danger banner (or a quiet neutral / cyan note) with optional dismiss. */
export function Alert({
  tone = 'info',
  title,
  children,
  icon,
  onDismiss,
  dismissLabel = 'Dismiss',
  titleAs: Title = 'p',
  live = true,
  footer,
  className,
  ...rest
}: AlertProps) {
  // an error interrupts (alert); every other tone is a polite status; with a footer the role sits on the
  // title + text only, so a ticking footer is never re-announced
  const role = !live ? undefined : tone === 'danger' ? 'alert' : 'status';
  const text = (
    <>
      {title && <Title className="lk-alert-title">{title}</Title>}
      {children && <p className="lk-alert-text">{children}</p>}
    </>
  );
  return (
    <div
      className={cn('lk-alert', TONE[tone], !title && !onDismiss && !footer && 'lk-alert--text-only', className)}
      role={footer == null ? role : undefined}
      {...rest}
    >
      <span className="lk-alert-icon" aria-hidden="true">
        {icon ?? DEFAULT_ICON[tone]}
      </span>
      <div className="lk-alert-body">
        {footer == null ? (
          text
        ) : (
          <>
            <div role={role}>{text}</div>
            <div className="lk-alert-footer">{footer}</div>
          </>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="lk-alert-close"
          aria-label={dismissLabel}
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
