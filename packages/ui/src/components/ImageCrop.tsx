'use client';

import {
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useRef,
  useState,
} from 'react';
import { cn } from '../cn';
import { Slider } from './Slider';

/** Where the square frame sits on the image: `zoom` from 1 (the image's short side fills the frame)
 *  to `maxZoom`, and the frame's centre as `x`/`y` in `0..1` of the image (top-left origin). */
export interface ImageCropValue {
  zoom: number;
  x: number;
  y: number;
}

/** The square to cut, in the image's own pixels. */
export interface ImageCropRect {
  left: number;
  top: number;
  size: number;
}

export interface ImageCropProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onLoad'> {
  /** The image to frame (an object URL or a data URL). */
  src: string;
  value: ImageCropValue;
  /** Fired with the next value on drag, wheel, pinch, keys or the zoom slider. */
  onChange: (value: ImageCropValue) => void;
  /** @default 4 */
  maxZoom?: number;
  /** The frame's spoken name (it is moved with the arrow keys, zoomed with + and −). */
  label: string;
  /** The zoom slider's spoken name. */
  zoomLabel: string;
  /** The frame's width and height, in px. @default 320 */
  size?: number;
  /** Fired once the image has loaded, with its own size (for `cropRect`). */
  onLoad?: (natural: { width: number; height: number }) => void;
}

export const IMAGE_CROP_START: ImageCropValue = { zoom: 1, x: 0.5, y: 0.5 };

const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));

/** The value moved back inside the image: the frame never shows past its edges. */
export function clampCrop(
  value: ImageCropValue,
  natural: { width: number; height: number },
  maxZoom = 4,
): ImageCropValue {
  const zoom = clamp(value.zoom, 1, maxZoom);
  const side = Math.min(natural.width, natural.height) / zoom;
  const halfX = side / 2 / natural.width;
  const halfY = side / 2 / natural.height;
  return { zoom, x: clamp(value.x, halfX, 1 - halfX), y: clamp(value.y, halfY, 1 - halfY) };
}

/** The square the value frames, in the image's pixels (draw it onto a canvas to cut it). */
export function cropRect(
  value: ImageCropValue,
  natural: { width: number; height: number },
): ImageCropRect {
  const v = clampCrop(value, natural, Infinity);
  const size = Math.min(natural.width, natural.height) / v.zoom;
  return {
    left: Math.round(v.x * natural.width - size / 2),
    top: Math.round(v.y * natural.height - size / 2),
    size: Math.round(size),
  };
}

/**
 * ImageCrop — frame a square of an image (ImageCrop.md): drag to move it, the wheel, a pinch, `+` /
 * `−` or the slider to zoom, the arrow keys to move. Controlled: it reports where the frame sits, and
 * `cropRect` turns that into the pixels to cut. For a profile photo, before it is sent.
 */
export function ImageCrop({
  src,
  value,
  onChange,
  maxZoom = 4,
  label,
  zoomLabel,
  size = 320,
  onLoad,
  className,
  style,
  ...rest
}: ImageCropProps) {
  const [natural, setNatural] = useState<{ width: number; height: number }>();
  // the pointers on the frame (two: a pinch), and where the gesture started
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ value: ImageCropValue; distance?: number }>(undefined);

  const set = (next: ImageCropValue) => natural && onChange(clampCrop(next, natural, maxZoom));

  // screen px per image px at this zoom
  const scale = natural ? (size / Math.min(natural.width, natural.height)) * value.zoom : 0;
  const rect = natural && cropRect(value, natural);

  const spread = () => {
    const [a, b] = [...pointers.current.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : undefined;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    gesture.current = { value, distance: spread() };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointers.current.get(event.pointerId);
    if (!start || !gesture.current || !natural) return;
    const from = gesture.current;
    if (pointers.current.size === 2 && from.distance) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      set({ ...value, zoom: from.value.zoom * ((spread() ?? from.distance) / from.distance) });
      return;
    }
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    set({
      ...from.value,
      zoom: value.zoom,
      x: from.value.x - dx / scale / natural.width,
      y: from.value.y - dy / scale / natural.height,
    });
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    // the finger left on the frame carries on moving from here
    const [rest] = [...pointers.current.entries()];
    if (rest) pointers.current.set(rest[0], rest[1]);
    gesture.current = { value, distance: spread() };
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) =>
    set({ ...value, zoom: value.zoom * Math.exp(-event.deltaY / 500) });

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!natural) return;
    // a tenth of the frame per press
    const step = 0.1 / value.zoom;
    const moves: Record<string, Partial<ImageCropValue>> = {
      ArrowLeft: { x: value.x - (step * Math.min(natural.width, natural.height)) / natural.width },
      ArrowRight: { x: value.x + (step * Math.min(natural.width, natural.height)) / natural.width },
      ArrowUp: { y: value.y - (step * Math.min(natural.width, natural.height)) / natural.height },
      ArrowDown: { y: value.y + (step * Math.min(natural.width, natural.height)) / natural.height },
      '+': { zoom: value.zoom * 1.1 },
      '=': { zoom: value.zoom * 1.1 },
      '-': { zoom: value.zoom / 1.1 },
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    set({ ...value, ...move });
  };

  return (
    <div className={cn('lk-crop', className)} style={{ width: size, ...style }} {...rest}>
      <div
        className="lk-crop-frame"
        style={{ width: size, height: size }}
        role="group"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
      >
        <img
          className="lk-crop-img"
          src={src}
          alt=""
          draggable={false}
          onLoad={(event) => {
            const image = event.currentTarget;
            const next = { width: image.naturalWidth, height: image.naturalHeight };
            setNatural(next);
            onLoad?.(next);
            onChange(clampCrop(value, next, maxZoom));
          }}
          style={
            natural && rect
              ? {
                  width: natural.width * scale,
                  height: natural.height * scale,
                  transform: `translate(${-rect.left * scale}px, ${-rect.top * scale}px)`,
                }
              : { opacity: 0 }
          }
        />
        <span className="lk-crop-grid" aria-hidden="true" />
      </div>
      <div className="lk-crop-zoom" role="group" aria-label={zoomLabel}>
        <Slider
          min={100}
          max={Math.round(maxZoom * 100)}
          value={Math.round(value.zoom * 100)}
          onChange={(percent) => set({ ...value, zoom: percent / 100 })}
          aria-label={zoomLabel}
        />
      </div>
    </div>
  );
}
