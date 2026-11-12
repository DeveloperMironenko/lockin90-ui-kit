'use client';

import {
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useId,
  useLayoutEffect,
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
  /** Read after the frame's name (`aria-describedby`): how to move it from the keyboard, in the app's
   *  language ("Arrow keys move the photo."). */
  description?: string;
  /** The frame's width and height, in px: fit it to the space it has (it never shrinks itself, so what
   *  it shows is always what `cropRect` cuts). @default 320 */
  size?: number;
  /** Fired once the image has loaded, with its own size (for `cropRect`). */
  onLoad?: (natural: { width: number; height: number }) => void;
}

export const IMAGE_CROP_START: ImageCropValue = { zoom: 1, x: 0.5, y: 0.5 };

type Natural = { width: number; height: number };

const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));

/** The value moved back inside the image: the frame never shows past its edges. */
export function clampCrop(value: ImageCropValue, natural: Natural, maxZoom = 4): ImageCropValue {
  const zoom = clamp(value.zoom, 1, maxZoom);
  const side = Math.min(natural.width, natural.height) / zoom;
  const halfX = side / 2 / natural.width;
  const halfY = side / 2 / natural.height;
  return { zoom, x: clamp(value.x, halfX, 1 - halfX), y: clamp(value.y, halfY, 1 - halfY) };
}

// The frame's square in image pixels, unrounded (what the screen shows).
const exactRect = (value: ImageCropValue, natural: Natural) => {
  const v = clampCrop(value, natural, Infinity);
  const size = Math.min(natural.width, natural.height) / v.zoom;
  return { left: v.x * natural.width - size / 2, top: v.y * natural.height - size / 2, size };
}

/** The square the value frames, in whole image pixels, always inside the image (draw it onto a
 *  canvas to cut it). */
export function cropRect(value: ImageCropValue, natural: Natural): ImageCropRect {
  const exact = exactRect(value, natural);
  const size = Math.min(Math.round(exact.size), natural.width, natural.height);
  return {
    left: clamp(Math.round(exact.left), 0, natural.width - size),
    top: clamp(Math.round(exact.top), 0, natural.height - size),
    size,
  };
}

// A wheel's delta in px, whatever unit the browser reports (Firefox may count lines).
const wheelPixels = (event: WheelEvent) =>
  event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);

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
  description,
  size = 320,
  onLoad,
  className,
  style,
  ...rest
}: ImageCropProps) {
  // the loaded image's own size, for this `src` only (a new image waits for its own)
  const [loaded, setLoaded] = useState<{ src: string } & Natural>();
  const natural = loaded?.src === src ? loaded : undefined;
  const frame = useRef<HTMLDivElement>(null);
  const descriptionId = useId();
  const image = useRef<HTMLImageElement>(null);
  // the pointers on the frame now, and the gesture's start: the value and where they were then
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const start = useRef<{ value: ImageCropValue; at: Map<number, { x: number; y: number }> }>(undefined);
  // the latest props, for the native wheel listener
  const latest = useRef({ value, natural, maxZoom, onChange });
  latest.current = { value, natural, maxZoom, onChange };

  const set = (next: ImageCropValue) => natural && onChange(clampCrop(next, natural, maxZoom));

  const takeLoaded = (element: HTMLImageElement) => {
    const next = { width: element.naturalWidth, height: element.naturalHeight };
    if (!next.width || !next.height) return;
    setLoaded({ src, ...next });
    onLoad?.(next);
    onChange(clampCrop(value, next, maxZoom));
  };

  // an image that loaded before its handler was attached (cached, hydrated)
  useLayoutEffect(() => {
    const element = image.current;
    if (element?.complete && loaded?.src !== src) takeLoaded(element);
    // only when the image changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // the wheel zooms the image and never scrolls what's behind it: a native listener, since React's is
  // passive and can't stop the scroll
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      const { value: v, natural: n, maxZoom: max, onChange: change } = latest.current;
      if (!n) return;
      event.preventDefault();
      change(clampCrop({ ...v, zoom: v.zoom * Math.exp(-wheelPixels(event) / 500) }, n, max));
    };
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, []);

  // screen px per image px at this zoom
  const scale = natural ? (size / Math.min(natural.width, natural.height)) * value.zoom : 0;
  const shown = natural && exactRect(value, natural);

  const restart = () => {
    start.current = { value, at: new Map(pointers.current) };
  };
  const spread = (at: Map<number, { x: number; y: number }>) => {
    const [a, b] = [...at.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : undefined;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // the main button or a touch only (a right click opens the context menu)
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    restart();
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId) || !start.current || !natural) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const from = start.current;
    const fromSpread = spread(from.at);
    if (pointers.current.size >= 2 && fromSpread) {
      set({ ...from.value, zoom: from.value.zoom * ((spread(pointers.current) ?? fromSpread) / fromSpread) });
      return;
    }
    const began = from.at.get(event.pointerId);
    if (!began) return;
    set({
      ...from.value,
      x: from.value.x - (event.clientX - began.x) / scale / natural.width,
      y: from.value.y - (event.clientY - began.y) / scale / natural.height,
    });
  };

  // a finger lifted: the ones still down carry on from where they are
  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    restart();
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!natural) return;
    // a tenth of the frame per press, in each axis's own fraction of the image
    const side = Math.min(natural.width, natural.height) / value.zoom / 10;
    const dx = side / natural.width;
    const dy = side / natural.height;
    const moves: Record<string, Partial<ImageCropValue>> = {
      ArrowLeft: { x: value.x - dx },
      ArrowRight: { x: value.x + dx },
      ArrowUp: { y: value.y - dy },
      ArrowDown: { y: value.y + dy },
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
        ref={frame}
        className="lk-crop-frame"
        style={{ width: size, height: size }}
        role="group"
        aria-label={label}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
      >
        <img
          ref={image}
          className="lk-crop-img"
          src={src}
          alt=""
          draggable={false}
          onLoad={(event) => takeLoaded(event.currentTarget)}
          style={
            natural && shown
              ? {
                  width: natural.width * scale,
                  height: natural.height * scale,
                  transform: `translate(${-shown.left * scale}px, ${-shown.top * scale}px)`,
                }
              : { opacity: 0 }
          }
        />
        {description ? (
          <span id={descriptionId} className="lk-sr-only">
            {description}
          </span>
        ) : null}
        <span className="lk-crop-grid" aria-hidden="true">
          <span className="lk-crop-v" style={{ left: '33.333%' }} />
          <span className="lk-crop-v" style={{ left: '66.666%' }} />
          <span className="lk-crop-h" style={{ top: '33.333%' }} />
          <span className="lk-crop-h" style={{ top: '66.666%' }} />
        </span>
      </div>
      <Slider
        min={100}
        max={Math.round(maxZoom * 100)}
        value={Math.round(value.zoom * 100)}
        onChange={(percent) => set({ ...value, zoom: percent / 100 })}
        aria-label={zoomLabel}
      />
    </div>
  );
}
