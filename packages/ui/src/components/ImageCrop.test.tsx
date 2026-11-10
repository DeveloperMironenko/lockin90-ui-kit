/* ImageCrop — the frame never shows past the image's edges, and cropRect gives the square of image
   pixels the frame shows (what the app cuts and sends), always inside the image. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { IMAGE_CROP_START, ImageCrop, clampCrop, cropRect } from './ImageCrop';

const landscape = { width: 600, height: 400 };

describe('cropRect', () => {
  it('at the start: the centre square of the short side', () => {
    expect(cropRect(IMAGE_CROP_START, landscape)).toEqual({ left: 100, top: 0, size: 400 });
  });

  it('zoomed in: a smaller square around the centre', () => {
    expect(cropRect({ zoom: 2, x: 0.5, y: 0.5 }, landscape)).toEqual({ left: 200, top: 100, size: 200 });
  });

  it('moved to an edge: stops at it', () => {
    expect(cropRect({ zoom: 1, x: 0, y: 0.5 }, landscape)).toEqual({ left: 0, top: 0, size: 400 });
    expect(cropRect({ zoom: 2, x: 1, y: 1 }, landscape)).toEqual({ left: 400, top: 200, size: 200 });
  });

  it('never reaches past the image when rounding (an odd side, at the right edge)', () => {
    const odd = { width: 600, height: 401 };
    const rect = cropRect({ zoom: 2, x: 1, y: 0.5 }, odd);
    expect(rect.left + rect.size).toBeLessThanOrEqual(odd.width);
    expect(rect.top + rect.size).toBeLessThanOrEqual(odd.height);
  });
});

describe('clampCrop', () => {
  it('keeps the zoom between 1 and the most', () => {
    expect(clampCrop({ zoom: 0.5, x: 0.5, y: 0.5 }, landscape).zoom).toBe(1);
    expect(clampCrop({ zoom: 9, x: 0.5, y: 0.5 }, landscape, 4).zoom).toBe(4);
  });

  it('a portrait image at zoom 1 moves only up and down', () => {
    const moved = clampCrop({ zoom: 1, x: 0.9, y: 0.9 }, { width: 400, height: 600 });
    expect(moved.x).toBe(0.5);
    expect(moved.y).toBeCloseTo(2 / 3);
  });
});

describe('ImageCrop', () => {
  it('names the frame, and the zoom slider’s own range input', () => {
    const html = renderToStaticMarkup(
      <ImageCrop src="x.png" value={IMAGE_CROP_START} onChange={() => {}} label="Photo" zoomLabel="Zoom" />,
    );
    expect(html).toContain('role="group" aria-label="Photo"');
    expect(html).toMatch(/<input[^>]*type="range"[^>]*aria-label="Zoom"/);
    expect(html).toContain('tabindex="0"');
  });

  it('is exactly the size it is given', () => {
    const html = renderToStaticMarkup(
      <ImageCrop src="x.png" value={IMAGE_CROP_START} onChange={() => {}} label="Photo" zoomLabel="Zoom" size={280} />,
    );
    expect(html).toContain('width:280px;height:280px');
  });
});
