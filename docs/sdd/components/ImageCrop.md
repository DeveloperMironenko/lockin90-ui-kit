# SDD — `ImageCrop`

> **Package:** `@lockin90/ui` (web only, see §5).
> **Source:** `packages/ui/src/components/ImageCrop.tsx` · web CSS `packages/ui/src/styles/components/crop.css` (`.lk-crop*`).
> **Exports:** `ImageCrop`, `IMAGE_CROP_START`, `clampCrop`, `cropRect`, types `ImageCropProps`, `ImageCropValue`, `ImageCropRect`.
> **Status:** Shipped (web 2026-11-11). **Parity:** web only: on a phone the system's own crop screen does this (§5).

---

## 1. Overview

Frame a **square** of an image before it's used: drag to move it, zoom with the wheel, a pinch, `+` /
`−` or the zoom slider, move with the arrow keys. Controlled: it reports where the frame sits
(`ImageCropValue`), and `cropRect` turns that into the image's pixels to cut. Made for the profile
photo on the web (LockIn90 1.33e, owner 2026-11-10: "on phone we can change position for photo or make
zoom but on web no"). `FocalPointPicker` only picks a point; it doesn't frame or zoom.

## 2. API contract

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `src` | `string` | — (required) | the image (an object URL or a data URL) |
| `value` | `ImageCropValue` | — (required) | `{ zoom, x, y }`: `zoom` from 1 (the short side fills the frame) to `maxZoom`; `x` / `y` the frame's centre in `0..1` of the image |
| `onChange` | `(value) => void` | — (required) | every move and zoom, already kept inside the image (`clampCrop`) |
| `label` | `string` | — (required) | the frame's spoken name (it's focusable) |
| `zoomLabel` | `string` | — (required) | the zoom slider's spoken name |
| `maxZoom` | `number` | `4` | |
| `size` | `number` | `320` | the frame's side, px. It never shrinks itself (what it shows is what `cropRect` cuts): the app fits it to the space it has |
| `onLoad` | `({ width, height }) => void` | — | the image's own size once loaded (for `cropRect`) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | on the root |

`IMAGE_CROP_START` is `{ zoom: 1, x: .5, y: .5 }` (the centre square). `clampCrop(value, natural,
maxZoom?)` keeps a value inside the image. `cropRect(value, natural)` → `{ left, top, size }` in whole
image pixels, always inside the image. On screen the image moves by the exact (unrounded) value, so
it glides.

## 3. Visual spec (tokens — never hardcode)

The frame: `--bg-1`, a 1px `--border`, `--r` corners, `--elev-1`; a rule-of-thirds grid of `--border-2`
lines over the image (as `FocalPointPicker`'s); `cursor: grab` (`grabbing` while dragged). Below it the kit `Slider` (16 px gap).
Focus: a 2px `--accent` outline, 2px off.

## 4. States

| State | What |
| --- | --- |
| Loading | the image hidden until it loads (its size is needed to place it); a new `src` waits for its own size; an image already loaded (cached) is taken at once |
| Idle / dragging | grab / grabbing cursor; the main button or a touch only (a right click opens the context menu) |
| Wheel | zooms; never scrolls what's behind the frame (a non-passive listener); lines or pages counted as pixels |
| Pinch | the zoom follows the fingers' spread from where they are; lifting one carries on with the other |
| At an edge | the frame stops: it never shows past the image |
| Focused | the accent outline; arrows move, `+` / `=` / `-` zoom |

## 5. Web ↔ native parity

**Web only, on purpose.** On iOS and Android the app's image picker opens the system's own crop
screen (`expo-image-picker` `allowsEditing`), which the platform's users know; a kit twin would
duplicate it. A native `ImageCrop` is added when a native screen needs a crop the system can't give.

## 6. Composition & usage

```tsx
const [crop, setCrop] = useState(IMAGE_CROP_START)
const [natural, setNatural] = useState<{ width: number; height: number }>()
<ImageCrop src={url} value={crop} onChange={setCrop} onLoad={setNatural}
  label={t('account.photo.adjust')} zoomLabel={t('account.photo.zoom')} />
// on Save: draw cropRect(crop, natural!) of the image onto a canvas
```

## 7. Accessibility

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies: contrast 4.5:1 text / 3:1 UI, 44pt native / 24px web targets, names from props, errors and changes announced, reduced motion, text scaling never disabled.

The frame is a focusable `role="group"` named by `label`, moved with the arrow keys and zoomed with
`+` / `−`; the zoom `Slider`'s range input is named by `zoomLabel` (`Slider` now puts `aria-label` on its input). The image itself is
decorative (`alt=""`): the app's text says what it is.

## 8. Usage rules — Do / Don't

- **Do** put it in a `Modal` with Cancel / Save, and cut with `cropRect` (don't recompute the maths).
- **Don't** use it for a non-square crop: it frames squares only.

## 9. Anti-patterns & lookalike ban

A hand-made drag-and-zoom box in an app is a lookalike: use this.
