'use client';

import {
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import { cn } from '../cn';

/** A normalized focal point — `x`/`y` each in the `0..1` range (top-left origin). */
export interface FocalPoint {
  x: number;
  y: number;
}

export interface FocalPointPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Image URL shown beneath the focal marker. */
  src: string;
  /** Current focal point — `x`/`y` each clamped to `0..1` (top-left origin). */
  value: FocalPoint;
  /** Fired with the next focal point on click / drag. */
  onChange: (point: FocalPoint) => void;
  /** Frame aspect ratio (width / height). @default 1.6 */
  aspect?: number;
  /** Render the rule-of-thirds overlay (2 vertical + 2 horizontal lines). @default true */
  showGrid?: boolean;
  /** Alt text for the image. @default '' */
  alt?: string;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * FocalPointPicker — pick the "keep in frame" point of an image. Click or drag
 * anywhere on the image to move the focal marker; the position is reported as
 * normalized `{ x, y }` coordinates (each `0..1`, top-left origin) so a consumer
 * can drive `object-position` for any crop. A rule-of-thirds overlay (two
 * vertical + two horizontal lines) aids composition. Pointer-driven — no
 * external dependency. Sized by the `aspect` ratio of its container width.
 */
export function FocalPointPicker({
  src,
  value,
  onChange,
  aspect = 1.6,
  showGrid = true,
  alt = '',
  className,
  style,
  ...rest
}: FocalPointPickerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const x = clamp01(value?.x ?? 0.5);
  const y = clamp01(value?.y ?? 0.5);

  const emitFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      onChange({
        x: clamp01((clientX - rect.left) / rect.width),
        y: clamp01((clientY - rect.top) / rect.height),
      });
    },
    [onChange],
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      // primary button / touch / pen only
      if (e.button !== undefined && e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      emitFromEvent(e.clientX, e.clientY);
    },
    [emitFromEvent],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      emitFromEvent(e.clientX, e.clientY);
    },
    [dragging, emitFromEvent],
  );

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const rootStyle = {
    '--lk-focal-aspect': String(aspect),
    '--lk-focal-x': `${x * 100}%`,
    '--lk-focal-y': `${y * 100}%`,
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={frameRef}
      className={cn('lk-focal', dragging && 'lk-focal-dragging', className)}
      style={rootStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      {...rest}
    >
      <img className="lk-focal-img" src={src} alt={alt} draggable={false} />

      {showGrid ? (
        <span className="lk-focal-grid" aria-hidden="true">
          <span className="lk-focal-v" style={{ left: '33.333%' }} />
          <span className="lk-focal-v" style={{ left: '66.666%' }} />
          <span className="lk-focal-h" style={{ top: '33.333%' }} />
          <span className="lk-focal-h" style={{ top: '66.666%' }} />
        </span>
      ) : null}

      <span className="lk-focal-marker" aria-hidden="true">
        <span className="lk-focal-ring" />
        <span className="lk-focal-dot" />
      </span>
    </div>
  );
}
