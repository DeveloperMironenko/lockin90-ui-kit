import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

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

/** Popover menu of actions — a glass panel of item rows anchored below a
 *  trigger (the ⋯ row menu, nav dropdowns). Click-outside + ESC close it. */
export function Menu({
  trigger,
  items = DEFAULT_ITEMS,
  align = 'right',
  className,
  ...rest
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
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

      {open && (
        <div
          className={cn('lk-menu-panel', align === 'left' ? 'lk-menu-left' : 'lk-menu-right')}
          role="menu"
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
        </div>
      )}
    </div>
  );
}
