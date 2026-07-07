import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../cn';

/* Panel — dense operator card with a bordered header (optional leading icon + title + sub +
   right-aligned actions) and a flush body. `lit` adds the Aurora-Flux gradient hairline along
   the top edge (mirrors `.card.lit`). Base container for the overview surfaces. Web-only.
   `lk-panel*` classes. */

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header title (font-display, 14px). Omit for a header-less panel. */
  title?: ReactNode;
  /** Faint sub-label next to the title. */
  sub?: ReactNode;
  /** Leading header icon (usually a kit <Icon />), rendered in a tinted rounded chip. */
  icon?: ReactNode;
  /** Right-aligned header slot — actions, a live dot, a status chip, etc. */
  right?: ReactNode;
  /** Gradient hairline along the top edge (Aurora-Flux "lit" card treatment). */
  lit?: boolean;
  /** When true, children are placed flush (no body padding) — for tables / feeds. */
  flush?: boolean;
  children?: ReactNode;
}

/**
 * Operator container card. Optional bordered header (icon · title · sub · right) + body. Pass
 * `lit` for the gradient top edge, `flush` for tables/feeds that own their row padding.
 */
export function Panel({ title, sub, icon, right, lit = false, flush = false, className, children, ...rest }: PanelProps) {
  const hasHeader = title != null || sub != null || right != null || icon != null;
  return (
    <section className={cn('lk-panel', lit && 'lk-panel--lit', className)} {...rest}>
      {hasHeader && (
        <div className="lk-panel-head">
          {icon != null && <span className="lk-panel-icon">{icon}</span>}
          {title != null && <h3 className="lk-panel-title">{title}</h3>}
          {sub != null && <span className="lk-panel-sub">{sub}</span>}
          {right != null && <div className="lk-panel-right">{right}</div>}
        </div>
      )}
      {flush ? children : <div className="lk-panel-body">{children}</div>}
    </section>
  );
}
