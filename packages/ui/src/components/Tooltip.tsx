import {
  useState,
  useRef,
  useId,
  useEffect,
  useLayoutEffect,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../cn';
import { computeTooltipPosition, type Placement, type TooltipPosition } from './tooltipPosition';

export type TooltipPlacement = Placement;

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** the bubble text/content shown on hover/focus */
  content?: ReactNode;
  /** PREFERRED side; auto-flips to the opposite side (and shifts) when it would
   *  overflow the viewport, so the bubble always stays visible */
  placement?: TooltipPlacement;
  /** the trigger; if omitted a small "?" badge is rendered instead */
  children?: ReactNode;
}

// useLayoutEffect on the client (no flicker), useEffect on the server (no SSR warning)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Hover/focus tooltip. The bubble is portaled to <body> (so no overflow:hidden
 *  ancestor can clip it) and positioned with flip + shift collision handling so it
 *  always stays inside the viewport. */
export function Tooltip({ content = 'Tooltip', placement = 'top', children, className, ...rest }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<TooltipPosition | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const reposition = () => {
      const t = triggerRef.current;
      const b = bubbleRef.current;
      if (!t || !b) return;
      const r = t.getBoundingClientRect();
      setPos(
        computeTooltipPosition(
          { top: r.top, left: r.left, width: r.width, height: r.height },
          b.offsetWidth,
          b.offsetHeight,
          placement,
          window.innerWidth,
          window.innerHeight,
        ),
      );
    };
    reposition();
    // keep it pinned while open
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, placement, content]);

  const trigger = children ?? (
    <span className="lk-tip-badge" aria-hidden="true">
      ?
    </span>
  );

  const bubbleStyle: CSSProperties = pos
    ? ({ top: pos.top, left: pos.left, ['--tip-arrow' as string]: `${pos.arrow}px` } as CSSProperties)
    : { top: 0, left: 0, opacity: 0 };

  return (
    <span
      ref={triggerRef}
      className={cn('lk-tip', className)}
      tabIndex={children ? undefined : 0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
      {...rest}
    >
      {trigger}
      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={bubbleRef}
              id={id}
              role="tooltip"
              className={cn('lk-tip-bubble', pos && `lk-tip-${pos.placement}`, pos && 'is-open')}
              style={bubbleStyle}
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
