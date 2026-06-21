import { forwardRef, Fragment, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

/* ============================================================================
   Pagination + Breadcrumb — admin/CMS navigation atoms.
   ========================================================================== */

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** current page, 1-based */
  page?: number;
  /** total number of pages */
  pageCount?: number;
  onChange?: (page: number) => void;
}

/** Build the page list with ellipsis truncation — always shows first, last,
 *  current, and current ±1; `'…'` marks collapsed ranges. */
function pageItems(page: number, pageCount: number): Array<number | '…'> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const out: Array<number | '…'> = [1];
  const left = Math.max(2, page - 1);
  const right = Math.min(pageCount - 1, page + 1);
  if (left > 2) out.push('…');
  for (let p = left; p <= right; p += 1) out.push(p);
  if (right < pageCount - 1) out.push('…');
  out.push(pageCount);
  return out;
}

/** Numbered pager — mono numerals, accent-filled active page, chevron
 *  prev/next that disable at the ends. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page = 1, pageCount = 8, onChange, className, ...rest },
  ref,
) {
  const count = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), count);
  const go = (p: number) => {
    if (p < 1 || p > count || p === current) return;
    onChange?.(p);
  };

  return (
    <nav ref={ref} className={cn('lk-pager', className)} aria-label="Pagination" {...rest}>
      <button
        type="button"
        className="lk-pager-btn lk-pager-edge"
        onClick={() => go(current - 1)}
        disabled={current <= 1}
        aria-label="Previous page"
      >
        <Icon name="back" size={16} />
      </button>

      {pageItems(current, count).map((item, i) =>
        item === '…' ? (
          <span key={`gap-${i}`} className="lk-pager-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={cn('lk-pager-btn', item === current && 'is-active')}
            onClick={() => go(item)}
            aria-current={item === current ? 'page' : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className="lk-pager-btn lk-pager-edge"
        onClick={() => go(current + 1)}
        disabled={current >= count}
        aria-label="Next page"
      >
        <Icon name="chevron" size={16} />
      </button>
    </nav>
  );
});

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'onNavigate'> {
  items?: Crumb[];
  onNavigate?: (index: number) => void;
}

const DEFAULT_CRUMBS: Crumb[] = [{ label: 'Admin' }, { label: 'Users' }, { label: 'Profile' }];

/** Inline breadcrumb trail — dim clickable ancestors, bold current leaf,
 *  faint chevron separators. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items = DEFAULT_CRUMBS, onNavigate, className, ...rest },
  ref,
) {
  return (
    <nav ref={ref} className={cn('lk-crumb', className)} aria-label="Breadcrumb" {...rest}>
      {items.map((crumb, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={`${crumb.label}-${i}`}>
            {last ? (
              <span className="lk-crumb-item is-current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <a
                className="lk-crumb-item lk-crumb-link"
                href={crumb.href}
                onClick={(e) => {
                  if (!crumb.href) e.preventDefault();
                  onNavigate?.(i);
                }}
              >
                {crumb.label}
              </a>
            )}
            {!last && <Icon name="chevron" size={13} className="lk-crumb-sep" aria-hidden="true" />}
          </Fragment>
        );
      })}
    </nav>
  );
});
