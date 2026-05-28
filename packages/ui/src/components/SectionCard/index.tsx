import type { SectionCardProps } from './types';

const PADDING: Record<NonNullable<SectionCardProps['padding']>, string> = {
  tight:  'p-3',
  normal: 'p-5',
  loose:  'p-6',
  none:   '',
};

export default function SectionCard({
  eyebrow,
  title,
  subtitle,
  action,
  children,
  footer,
  padding = 'normal',
  className,
  bodyClassName,
}: SectionCardProps) {
  const hasHeader = !!(eyebrow || title || subtitle || action);
  // Outer is always a flex column with overflow-hidden so chart SVGs / wide
  // tables can't escape the card chrome. The body region scrolls; header and
  // footer stay pinned. When the card has no explicit height the layout still
  // collapses to natural size because flex children without a height take
  // their content's height.
  return (
    <div
      className={`bg-surface border border-border rounded flex flex-col overflow-hidden ${className ?? ''}`}
    >
      {hasHeader && (
        <div className="shrink-0 flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-border">
          <div className="min-w-0">
            {eyebrow && <div className="ea-eyebrow text-secondary mb-0.5">{eyebrow}</div>}
            {title && (
              <div className="font-display italic font-bold text-[16px] text-white uppercase tracking-[0.04em] truncate">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-[12px] text-secondary mt-0.5 truncate">{subtitle}</div>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`flex-1 min-h-0 overflow-auto ${PADDING[padding]} ${bodyClassName ?? ''}`}>
        {children}
      </div>
      {footer && (
        <div className="shrink-0 px-5 py-2 border-t border-border text-[11px] text-muted">
          {footer}
        </div>
      )}
    </div>
  );
}
