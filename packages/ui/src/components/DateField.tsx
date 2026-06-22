import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../cn';

/* ============================================================================
   DateField — a dark glassy date / time / datetime input. Mono uppercase label
   above, a leading calendar glyph, color-scheme:dark so the native picker
   matches the Aurora Flux surface, and an accent focus ring.
   ========================================================================== */

export interface DateFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  /** current value (ISO string the native control understands, e.g. 2026-06-21) */
  value?: string;
  /** fires with the raw input value on every change */
  onChange?: (value: string) => void;
  /** which native picker to surface */
  type?: 'date' | 'datetime-local' | 'time';
  /** small mono uppercase label rendered above the field */
  label?: string;
}

/** Dark glassy date/time field — leading calendar glyph, dark native picker. */
export function DateField({ value, onChange, type = 'date', label, className, ...rest }: DateFieldProps) {
  return (
    <label className="lk-date-wrap">
      {label ? <span className="lk-date-label">{label}</span> : null}
      <span className="lk-date-field">
        <span className="lk-date-lead" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
            <path d="M3 9h18" />
            <path d="M8 2.5v4M16 2.5v4" />
          </svg>
        </span>
        <input
          className={cn('lk-date-input', className)}
          type={type}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          {...rest}
        />
      </span>
    </label>
  );
}

/* ============================================================================
   TreeItem — a nested, expandable tree row for nav / page trees. A chevron that
   rotates when expanded, an optional leading icon, the label, an optional faint
   drag handle, an accent-tinted active state, and indented children rendered
   below when expanded.
   ========================================================================== */

export interface TreeItemProps extends Omit<InputHTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** row label text */
  label?: string;
  /** nesting depth — indents the row by depth * 16px */
  depth?: number;
  /** show a chevron and allow toggling open/closed */
  expandable?: boolean;
  /** whether the children are currently revealed */
  expanded?: boolean;
  /** called when the chevron / row toggle is activated */
  onToggle?: () => void;
  /** optional leading glyph (before the label) */
  icon?: ReactNode;
  /** accent-tinted selected row */
  active?: boolean;
  /** show a faint ⠿ drag handle on the left */
  dragHandle?: boolean;
  /** nested TreeItems, shown only when `expanded` */
  children?: ReactNode;
}

/** Nested, expandable tree row — chevron, optional icon, label, drag handle. */
export function TreeItem({
  label = 'Page',
  depth = 0,
  expandable = false,
  expanded = false,
  onToggle,
  icon,
  active = false,
  dragHandle = false,
  children,
  className,
  ...rest
}: TreeItemProps) {
  return (
    <div className="lk-tree-item">
      <div
        className={cn('lk-tree-row', active && 'lk-tree-active', className)}
        style={{ paddingLeft: depth * 16 + 8 }}
        {...rest}
      >
        {dragHandle ? (
          <span className="lk-tree-grip" aria-hidden="true">
            ⠿
          </span>
        ) : null}

        {expandable ? (
          <button
            type="button"
            className={cn('lk-tree-chevron', expanded && 'lk-tree-open')}
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        ) : (
          <span className="lk-tree-spacer" aria-hidden="true" />
        )}

        {icon ? <span className="lk-tree-icon">{icon}</span> : null}

        <span className="lk-tree-label">{label}</span>
      </div>

      {expandable && expanded && children ? <div className="lk-tree-children">{children}</div> : null}
    </div>
  );
}
