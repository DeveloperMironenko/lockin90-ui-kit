import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../cn';
import { Icon } from './Icon';
import { computeMenuPosition, type MenuAlign, type MenuPosition } from './tooltipPosition';

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  /** The clickable trigger. Defaults to a small "?" info button. */
  trigger?: ReactNode;
  /** Panel content. Defaults to a short sample explainer. */
  children?: ReactNode;
  /** Which edge of the trigger the panel aligns to. */
  align?: MenuAlign;
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Click-triggered floating panel of arbitrary content (richer than a Tooltip).
 *  The panel is portaled to <body> (no overflow ancestor can clip it) and flips
 *  above the trigger / shifts sideways to stay on-screen; the arrow tracks the
 *  trigger. Toggles on click, dismisses on click-outside or ESC. */
export function Popover({ trigger, children, align = 'center', className, ...rest }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
  }, [open, align, children]);

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
    ? ({ top: pos.top, left: pos.left, ['--pop-arrow' as string]: `${pos.arrow}px` } as CSSProperties)
    : { top: 0, left: 0, opacity: 0, pointerEvents: 'none' };

  return (
    <div ref={rootRef} className={cn('lk-pop', className)} {...rest}>
      <button
        type="button"
        className="lk-pop-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger ?? <Icon name="info" size={16} />}
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={panelRef}
              className={cn('lk-pop-panel', pos && `lk-pop-${pos.side}`, pos && 'is-open')}
              role="dialog"
              style={panelStyle}
            >
              <span className="lk-pop-arrow" aria-hidden="true" />
              <div className="lk-pop-body">
                {children ?? (
                  <p className="lk-pop-text">
                    This score blends your recent training, sleep, and recovery signals into a single readiness number.
                  </p>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Text written to the clipboard on click. */
  value?: string;
  /** Optional label rendered beside the icon. */
  label?: string;
}

/** Copies `value` to the clipboard and flashes a transient check for ~1.2s.
 *  The copy glyph (two overlapping rounded rects) swaps to a check Icon. */
export function CopyButton({
  value = 'LOCKIN-2026',
  label,
  className,
  onClick,
  ...rest
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      className={cn('lk-copy', copied && 'lk-copy-done', className)}
      aria-label={copied ? 'Copied' : 'Copy'}
      onClick={(e) => {
        if (value != null) {
          void navigator.clipboard?.writeText(value);
        }
        setCopied(true);
        onClick?.(e);
      }}
      {...rest}
    >
      <span className="lk-copy-icon" aria-hidden="true">
        {copied ? (
          <Icon name="check" size={15} />
        ) : (
          <svg
            width={15}
            height={15}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5V4.5A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
          </svg>
        )}
      </span>
      {label != null && <span className="lk-copy-label">{label}</span>}
    </button>
  );
}
