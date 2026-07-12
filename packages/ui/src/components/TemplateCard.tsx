import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** Who authored the template — coach/AI show a tinted source pill. */
export type TemplateSource = 'coach' | 'ai' | 'manual';

export interface TemplateCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'> {
  /** Template name (display font). */
  name: string;
  /** Dim summary line (e.g. `'Chest · Arms · 5 ex · ~48m'`). */
  meta?: string;
  /** Faint mono footer (e.g. `'Last used 2d ago'`). */
  lastUsed?: string;
  /** Authoring source — `coach` mint pill · `ai` violet pill · `manual` none (default). */
  source?: TemplateSource;
  /** Accent color for the left edge bar (any token, e.g. `'var(--cyan)'`). */
  tint?: string;
  /** When set, the card renders as a `<button>` (hover raise, pointer). */
  onPress?: () => void;
  /** Trailing slot pinned right (chevron, menu, duration…). */
  trailing?: ReactNode;
}

const SOURCE_PILL: Record<Exclude<TemplateSource, 'manual'>, { label: string; className: string }> = {
  coach: { label: 'Coach', className: 'lk-templatecard-src-coach' },
  ai: { label: 'AI', className: 'lk-templatecard-src-ai' },
};

/**
 * TemplateCard — a workout-template row card: glass surface, template name in
 * the display font, a dim meta line, a faint mono "last used", and a small
 * mint `Coach` / violet `AI` source pill when the template wasn't hand-built.
 * `tint` paints a rounded accent bar down the left edge. With `onPress` the
 * whole card is the tap target.
 */
export function TemplateCard({
  name,
  meta,
  lastUsed,
  source = 'manual',
  tint,
  onPress,
  trailing,
  className,
  ...rest
}: TemplateCardProps) {
  const pill = source !== 'manual' ? SOURCE_PILL[source] : null;

  const body = (
    <>
      {tint ? <span className="lk-templatecard-tint" style={{ background: tint }} aria-hidden="true" /> : null}
      <span className="lk-templatecard-main">
        <span className="lk-templatecard-top">
          <span className="lk-templatecard-name">{name}</span>
          {pill ? <span className={cn('lk-templatecard-src', pill.className)}>{pill.label}</span> : null}
        </span>
        {meta != null && <span className="lk-templatecard-meta">{meta}</span>}
        {lastUsed != null && <span className="lk-templatecard-last">{lastUsed}</span>}
      </span>
      {trailing != null && <span className="lk-templatecard-trailing">{trailing}</span>}
    </>
  );

  const classes = cn('lk-templatecard', onPress && 'lk-templatecard-tappable', className);

  if (onPress) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onPress}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {body}
      </button>
    );
  }
  return (
    <div className={classes} {...rest}>
      {body}
    </div>
  );
}
