import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
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
  /** Shown but unavailable (e.g. "coming soon"): dimmed, announced disabled, does nothing. */
  disabled?: boolean;
  /** Render a 1px separator instead of an action row. */
  divider?: boolean;
}

interface MenuBaseProps extends HTMLAttributes<HTMLDivElement> {
  /** The clickable trigger. Defaults to a small ⋯ icon button. */
  trigger?: ReactNode;
  /** Action rows to render in the panel. */
  items?: MenuItemData[];
  /** Which edge of the trigger the panel aligns to. */
  align?: 'left' | 'right';
  /** Drop the trigger's default button chrome (border / hover bg / open-state
   *  ring). Use when the trigger is already a complete visual element (e.g.
   *  an avatar + name row) and the surrounding chrome would be visual noise. */
  bare?: boolean;
  /** The trigger can't be pressed (e.g. while the action it opens is under way); an open panel
   *  closes. */
  disabled?: boolean;
}

export type MenuProps = MenuBaseProps &
  (
    | {
        iconTrigger?: false;
        /** The trigger's spoken name (`aria-label`), for a trigger that shows no text. */
        label?: string;
        iconSize?: never;
      }
    | {
        /** The trigger on IconButton's surface (its glass square and corners), for a menu opened
         *  from an icon in a tight spot, like the camera on a profile picture. Pass the icon as
         *  `trigger`; its spoken name is required, as IconButton's. `bare` doesn't apply. */
        iconTrigger: true;
        label: string;
        /** IconButton's sizes: 32 / 40 px (`sm` reaches a 44px touch target). @default 'md' */
        iconSize?: 'sm' | 'md';
      }
  );

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
export function Menu({
  trigger,
  items = DEFAULT_ITEMS,
  align = 'right',
  bare = false,
  iconTrigger = false,
  iconSize = 'md',
  label,
  disabled = false,
  className,
  ...rest
}: MenuProps) {
  const [openState, setOpen] = useState(false);
  // a trigger switched off closes its open panel, in the same render
  const open = openState && !disabled;
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // opened from the keyboard: which item takes focus once the panel is there (WAI-ARIA menu button)
  const focusOnOpen = useRef<'first' | 'last' | null>(null);
  const menuItems = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    const list = menuItems();
    (focusOnOpen.current === 'last' ? list[list.length - 1] : list[0])?.focus();
    focusOnOpen.current = null;
  }, [open]);

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const where =
      e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' ? 'first' : e.key === 'ArrowUp' ? 'last' : null;
    if (!where || disabled) return;
    e.preventDefault();
    focusOnOpen.current = where;
    setOpen(true);
  };

  const onPanelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = menuItems();
    const at = list.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => {
      e.preventDefault();
      list[(i + list.length) % list.length]?.focus();
    };
    if (e.key === 'ArrowDown') go(at + 1);
    else if (e.key === 'ArrowUp') go(at < 0 ? list.length - 1 : at - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(list.length - 1);
    else if (e.key === 'Tab') setOpen(false);
  };

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
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // focus back on the trigger when it was inside the menu
      if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
      setOpen(false);
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
    <div ref={rootRef} className={cn('lk-menu', bare && 'lk-menu--bare', className)} {...rest}>
      <button
        ref={triggerRef}
        type="button"
        onKeyDown={onTriggerKey}
        className={
          iconTrigger
            ? cn('lk-icon-btn', iconSize === 'sm' && 'lk-icon-btn-sm')
            : 'lk-menu-trigger'
        }
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
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
              onKeyDown={onPanelKey}
            >
              {items.map((item, i) =>
                item.divider ? (
                  <div key={i} className="lk-menu-divider" role="separator" />
                ) : (
                  <button
                    key={i}
                    type="button"
                    role="menuitem"
                    className={cn('lk-menu-item', item.danger && 'lk-menu-danger', item.disabled && 'lk-menu-disabled')}
                    // focusable and announced, as the WAI-ARIA menu pattern keeps unavailable items;
                    // a click does nothing and the menu stays open
                    aria-disabled={item.disabled || undefined}
                    onClick={() => {
                      if (item.disabled) return;
                      const fromMenu = panelRef.current?.contains(document.activeElement);
                      item.onClick?.();
                      setOpen(false);
                      if (fromMenu) triggerRef.current?.focus();
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
