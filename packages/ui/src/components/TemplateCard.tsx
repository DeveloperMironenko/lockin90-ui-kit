import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** Who authored the template — coach/AI show a tinted source pill. */
export type TemplateSource = 'coach' | 'ai' | 'manual';

export interface TemplateCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'> {
  /** Template name (display font). */
  name: string;
  /** Dim summary line (e.g. `'Chest · Arms · 5 ex · ~48m'`). */
  meta?: string;
  /** Bold emphasized fragment appended to the meta line after a `' · '`
   *  separator (e.g. the exercise count `'5 ex'` — design `.tpl .mt b`,
   *  reads slightly brighter than the rest of the meta line). */
  metaCount?: string;
  /** Faint mono footer (e.g. `'Last used 2d ago'`). */
  lastUsed?: string;
  /** Authoring source — `coach` mint pill · `ai` violet pill · `manual` none (default). */
  source?: TemplateSource;
  /** Accent color for the left edge bar (any token, e.g. `'var(--cyan)'`) — the
   *  edge bar renders only when `leading` is absent (see `leading`). */
  tint?: string;
  /**
   * Leading 34×34 tinted icon tile (design `.tpl .ti.tile` — the row's
   * primary identifier, e.g. a type glyph `<Icon>`). Colored from `tint`
   * (13%-fill / 33%-border). When set, this REPLACES the plain `tint` edge
   * bar (the mockup never shows both together).
   */
  leading?: ReactNode;
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
  metaCount,
  lastUsed,
  source = 'manual',
  tint,
  leading,
  onPress,
  trailing,
  className,
  ...rest
}: TemplateCardProps) {
  const pill = source !== 'manual' ? SOURCE_PILL[source] : null;

  const body = (
    <>
      {leading == null && tint ? (
        <span className="lk-templatecard-tint" style={{ background: tint }} aria-hidden="true" />
      ) : null}
      {leading != null ? (
        <span
          className="lk-templatecard-lead"
          style={
            tint
              ? { background: `color-mix(in srgb, ${tint} 13%, transparent)`, borderColor: `color-mix(in srgb, ${tint} 33%, transparent)` }
              : undefined
          }
        >
          {leading}
        </span>
      ) : null}
      <span className="lk-templatecard-main">
        <span className="lk-templatecard-top">
          <span className="lk-templatecard-name">{name}</span>
          {pill ? <span className={cn('lk-templatecard-src', pill.className)}>{pill.label}</span> : null}
        </span>
        {(meta != null || metaCount != null) && (
          <span className="lk-templatecard-meta">
            {meta}
            {meta != null && metaCount != null ? ' · ' : null}
            {metaCount != null ? <b className="lk-templatecard-meta-count">{metaCount}</b> : null}
          </span>
        )}
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
