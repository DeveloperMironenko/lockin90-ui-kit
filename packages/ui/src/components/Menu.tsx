import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../cn';
import { Icon } from './Icon';
import { computeMenuPosition, type MenuPosition } from './tooltipPosition';

/** A single row in a {@link Menu}. A `divider` row renders a hairline
 *  separator instead of an action (its `label` is ignored). */
export interface MenuItemData {
  /** Visible row text. */
  label: string;
  /** Optional leading glyph (e.g. an `<Icon />`). */
  icon?: ReactNode;
  /** Fired on click; the menu closes afterwards. */
  onClick?: () => void;
  /** Render the row in the danger tone (`--zone-low`). */
  danger?: boolean;
  /** Render a 1px separator instead of an action row. */
  divider?: boolean;
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  /** The clickable trigger. Defaults to a small ⋯ icon button. */
  trigger?: ReactNode;
  /** Action rows to render in the panel. */
  items?: MenuItemData[];
  /** Which edge of the trigger the panel aligns to. */
  align?: 'left' | 'right';
}

const DEFAULT_ITEMS: MenuItemData[] = [
  { label: 'Edit' },
  { label: 'Duplicate' },
  { divider: true, label: '' },
  { label: 'Delete', danger: true },
];

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Popover menu of actions — a glass panel of item rows anchored to a trigger.
 *  The panel is portaled to <body> (no overflow ancestor can clip it) and flips
 *  above the trigger / shifts sideways to stay inside the viewport. */
export function Menu({ trigger, items = DEFAULT_ITEMS, align = 'right', className, ...rest }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // position the panel while open, and keep it pinned on scroll/resize
  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const reposition = () => {
      const t = rootRef.current;
      const p = panelRef.current;
      if (!t || !p) return;
      const r = t.getBoundingClientRect();
      setPos(
        computeMenuPosition(
          { top: r.top, left: r.left, width: r.width, height: r.height },
          p.offsetWidth,
          p.offsetHeight,
          align,
          window.innerWidth,
          window.innerHeight,
        ),
      );
    };
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, align, items]);

  // click-outside + ESC — the panel is portaled, so check it too
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const panelStyle: CSSProperties = pos
    ? { top: pos.top, left: pos.left }
    : { top: 0, left: 0, opacity: 0, pointerEvents: 'none' };

  return (
    <div ref={rootRef} className={cn('lk-menu', className)} {...rest}>
      <button
        type="button"
        className="lk-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger ?? <Icon name="more" />}
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={panelRef}
              className={cn('lk-menu-panel', pos && `lk-menu-${pos.side}`, pos && 'is-open')}
              role="menu"
              style={panelStyle}
            >
              {items.map((item, i) =>
                item.divider ? (
                  <div key={i} className="lk-menu-divider" role="separator" />
                ) : (
                  <button
                    key={i}
                    type="button"
                    role="menuitem"
                    className={cn('lk-menu-item', item.danger && 'lk-menu-danger')}
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                  >
                    {item.icon != null && <span className="lk-menu-icon">{item.icon}</span>}
                    <span className="lk-menu-label">{item.label}</span>
                  </button>
                ),
              )}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
