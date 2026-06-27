# SDD — `FocalPointPicker` (+ `FocalPoint` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/FocalPointPicker.tsx` · `packages/ui-native/src/components/FocalPointPicker.tsx` ·
> web CSS `packages/ui/src/styles/components/focal.css` (`.lk-focal*`).
> **Exports:** `FocalPointPicker`, type `FocalPoint`, type `FocalPointPickerProps`.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals — both click/tap **and** drag; substrate is pointer events ↔ `PanResponder`.
> **Stories:** `packages/ui/src/stories/FocalPointPicker.stories.tsx` · `packages/ui-native/src/stories/FocalPointPicker.stories.tsx`.

---

## 1. Overview

Pick the **"keep in frame" point** of an image. Click/tap or drag anywhere on the framed image to move a
glowing focal marker; the position is reported as a normalized `FocalPoint` (`{ x, y }`, each `0..1`,
top-left origin) so a consumer can drive `object-position` (or a native crop) for any aspect ratio. A
rule-of-thirds overlay (two vertical + two horizontal lines) aids composition.

`FocalPoint` is the small shared coordinate type (`{ x: number; y: number }`). Pointer/gesture-driven and
**dependency-free** — no cropping library. The frame sizes itself by `aspect` (width / height) over the
container width.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `src` | `string` | — (required) | ✓ | ✓ | image URL beneath the marker |
| `value` | `FocalPoint` | — (required) | ✓ | ✓ | current point; each axis clamped `0..1` (falls back to `0.5`) |
| `onChange` | `(point: FocalPoint) => void` | — (required) | ✓ | ✓ | next point on click/tap + drag |
| `aspect` | `number` | `1.6` | ✓ | ✓ | frame ratio (width / height) |
| `showGrid` | `boolean` | `true` | ✓ | ✓ | rule-of-thirds overlay |
| `alt` | `string` | `''` (web) / `undefined` (native) | ✓ | ✓ | web `<img alt>`; native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | web merges into the CSS-var style; native `ViewStyle` |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>` | — | ✓ | — | web only |

- `clamp01` clamps both axes on read and on every emit, so out-of-range input/touches never escape `0..1`.
- **Web** computes the point from `getBoundingClientRect` deltas; **native** from the touch's
  `locationX/locationY` over the laid-out frame size.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`focal.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Frame | `aspect-ratio: var(--lk-focal-aspect)`, `--r` radius, `1px --border`, `--bg-1`, `--elev-1` shadow | `aspectRatio`, `radii.md`, `1px colors.border`, `colors.bg1` |
| Cursor | `crosshair`; `.lk-focal-dragging` → `grabbing` | n/a (touch) |
| Image | `object-fit:cover`, `pointer-events:none`, undraggable | `resizeMode="cover"`, full-bleed |
| Grid lines | `1px` `--border-2` at `33.333%` / `66.666%`, `box-shadow 0 0 1px rgba(5,6,11,.6)` | `1px` `colors.border2` at `33.333%` / `66.666%` |
| Marker ring | `30px`, `2px --accent` border, `rgba(124,92,255,.12)` fill, `--glow-accent` + dark hairline | `30px`, `2px colors.accent`, `rgba(124,92,255,0.12)` fill |
| Ring (dragging) | (same fill) | `ringActive` → `rgba(124,92,255,0.22)` |
| Center dot | `6px` `#fff`, `box-shadow 0 0 8px -1px --accent` | `6px` `#fff` |

- **Web marker position** is driven by per-instance CSS vars `--lk-focal-x` / `--lk-focal-y` (`x*100%` /
  `y*100%`) and animates via `transition: top/left var(--dur) var(--ease)` — suppressed (`transition:none`)
  while dragging. **Native** positions the marker with `left`/`top` percentages (no transition).
- `--r` = the medium radius (`radii.md`, 16); both frames match.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Idle | marker at `value`, smooth transition to new spots | marker at `value` |
| Press / down | `pointerdown` (primary button/touch/pen) → `setPointerCapture`, emit, `dragging=true` | `onPanResponderGrant` → `dragging=true`, emit |
| Drag | `pointermove` while captured → emit (transition off) | `onPanResponderMove` → emit |
| Release | `pointerup`/`pointercancel` → release capture, `dragging=false` | `onPanResponderRelease`/`Terminate` → `dragging=false` |
| Grid off | `showGrid={false}` hides the overlay | same |

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same `FocalPoint` contract, same defaults, same rule-of-thirds geometry, same
marker (30px accent ring + 6px white dot), same clamp behavior, and — critically — **both platforms support
click/tap *and* drag**. Differences are pure substrate:

- **Input mechanism:** web uses Pointer Events with pointer capture; native uses a single stable
  `PanResponder` (reading `sizeRef`/`onChangeRef` so it never goes stale). Both = press-to-set + drag-to-refine.
- **Marker motion:** web tweens the marker between non-drag positions (CSS transition); native snaps. Cosmetic.
- **Drag feedback:** web swaps the cursor to `grabbing`; native deepens the ring fill (`.12 → .22`).
- **Web-only:** `className` + `...rest` + a `crosshair` cursor (no pointer on touch).

No capability gap — fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Standalone** — no kit sub-primitives. Pair the emitted point with `object-position: ${x*100}% ${y*100}%`
  (web) or a crop transform (native) on the display image elsewhere.
- **Used by:** CMS / media cover-image cropping, avatar/hero focal selection, social-card framing.

```tsx
// web
<FocalPointPicker src={url} value={focal} onChange={setFocal} aspect={1.91} alt="Cover" />

// native
<FocalPointPicker src={url} value={focal} onChange={setFocal} aspect={1.91} alt="Cover" />
```

## 7. Accessibility

- **Web:** the `<img>` carries `alt`; the marker + grid are `aria-hidden`. The frame is pointer-driven (no
  keyboard nudge today — note it if a screen needs keyboard focal control).
- **Native:** the frame is `accessibilityRole="adjustable"` with `accessibilityLabel={alt}`; the image also
  carries `accessibilityLabel`. Grid + marker are `pointerEvents="none"`.
- **Hit area:** the entire framed image is the interactive target (not just the marker) — large and
  touch-friendly; the marker is a non-interactive indicator.

## 8. Usage rules — Do / Don't

**Do**
- Treat `value` as normalized `0..1` and persist it that way; let the picker clamp.
- Match `aspect` to where the image will actually be displayed.
- Pass `alt` for the image (it's the a11y label on both platforms).

**Don't**
- ✗ Don't store pixel coordinates — the contract is normalized `0..1`.
- ✗ Don't hardcode the ring/dot/grid colors or the frame radius/shadow — tokens only.
- ✗ Don't rely on `className`/rest on native — they don't exist there.
- ✗ Don't assume keyboard focal-nudge — interaction is pointer/touch + drag only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled draggable dot over an `<img>` with thirds-lines is a parity violation —
  import `FocalPointPicker`.
- **Tokens only.** Marker ring = `--accent` + `--glow-accent`; grid = `--border-2`; frame = `--bg-1` + `--r`
  + `--elev-1`. The `rgba(124,92,255,…)` fills mirror the accent at fixed opacity (documented).
- **New need → both platforms.** Keyboard nudge, a zoom/scale handle, or a secondary crop rectangle must be
  added to `FocalPointPicker` on web **and** native with the same props.
- **Parity gate.** Confirm web phone-width and native renders match (frame aspect, grid, marker, drag
  feedback) before shipping.
