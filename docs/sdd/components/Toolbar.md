# SDD — `Toolbar` (+ `ToolbarItem`, `Dropzone`, `DropzoneProps`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitives.
> **Source:** `packages/ui/src/components/Toolbar.tsx` · `packages/ui-native/src/components/Toolbar.tsx` ·
> web CSS `packages/ui/src/styles/components/toolbar.css` (`.lk-toolbar*` + `.lk-dropzone*`).
> **Exports:** `Toolbar`, `Dropzone`, type `ToolbarItem`, type `ToolbarProps`, type `DropzoneProps`.
> **Status:** Shipped. **Parity:** 🔵 `Toolbar` ✅ identical (substrate-only); **`Dropzone` native is tap-only** — RN has no OS file drag-drop.
> **Stories:** `packages/ui/src/stories/Toolbar.stories.tsx` · `packages/ui-native/src/stories/Toolbar.stories.tsx`.

---

## 1. Overview

Two related CMS/editor primitives that ship from one file:

- **`Toolbar`** — a **rich-text formatting bar**: a horizontal group of ~30px icon buttons in a glass strip,
  with thin vertical dividers between groups and an accent tint on active buttons. It's the button row that
  drives `RichTextEditor`, and can stand alone for any icon-button toolbar. `ToolbarItem` describes one
  button (or a divider).
- **`Dropzone`** — a large **dashed-border file-drop area**: a centered round icon badge + prompt + hint.
  On web it accepts real OS file drag-drop **and** click-to-pick (hidden `<input type="file">`); on native it
  is a `Pressable` that opens the OS document picker on tap (RN has no file drop).

Both mirror the CMS post-editor / media-library design. Reach for `Toolbar` for formatting rows, `Dropzone`
for upload surfaces.

## 2. API contract

### `Toolbar`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `items` | `ToolbarItem[]` | `DEFAULT_ITEMS` (bold·italic ∣ list·link·image) | ✓ | ✓ | buttons + dividers, in order |
| `className` | `string` | — | ✓ | — | web only (`forwardRef<HTMLDivElement>` + rest) |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

**`ToolbarItem`** — `icon: ReactNode` · `label?: string` · `active?: boolean` (accent tint) · `divider?:
boolean` (render a separator instead of a button) · **action** `onClick?` (web) / `onPress?` (native).

### `Dropzone`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | `'Drop files here or click to upload'` | ✓ | ✓ | primary prompt line |
| `hint` | `string` | `'PNG, JPG up to 10MB'` | ✓ | ✓ | secondary hint line |
| `icon` | `ReactNode` | upload glyph | ✓ | ✓ | badge glyph |
| `onFiles` | web `(files: FileList) => void` · native `(files: unknown[]) => void` | — | ✓ | ✓ | **platform-shaped payload** — web `FileList`; native picked-file descriptors |
| `onPress` | `() => void` | — | — | ✓ | native only — fires on tap before any picker |
| `className` | `string` | — | ✓ | — | web only (`forwardRef<HTMLDivElement>` + rest) |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

- **Native `Dropzone`** lazily `require`s the optional `expo-document-picker` peer (try/catch, like
  `CopyButton`/`expo-clipboard`): if present, tapping opens the OS picker and forwards results to `onFiles`;
  if absent, only `onPress` fires (graceful fallback).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`toolbar.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Bar | `--r-sm`, `1px --border-2`, `--glass-2`, gap `3px`, pad `4px`, `flex-wrap` | `radii.sm`, `1px colors.border2`, `colors.glass2`, gap `3`, pad `4`, `flexWrap` |
| Button | `30×30`, radius `7px`, `--text-dim`; hover `--glass-2`/`--text`; svg `15px` | `30×30`, radius `7`, transparent border; `btnPressed` → `--glass2` |
| Active | `rgba(124,92,255,.16)` bg, `rgba(124,92,255,.4)` border, `#cbbcff` text | `btnOn` — same bg + border (glyph color set by the item) |
| Divider | `1px` `--border-2`, `margin 2/4`, stretch | `1px × 22`, `--border2`, `marginH 4` / `marginV 2` |
| Dropzone | `min-height 168px`, pad `28px`, `--r`, `1.5px dashed --border-2`, `rgba(124,92,255,.04)` | `minHeight 168`, pad `28`, `radii.md`, `1.5 dashed --border2`, `rgba(124,92,255,0.04)` |
| DZ hover/active | `--accent-2` border, `rgba(34,211,238,.06)`, `translateY(-2px)` | `dropzoneActive` → `--accent2` border, `rgba(34,211,238,0.06)` |
| DZ badge | `46px` round, `1px --border-2`, `--glass`, `--accent-2`, svg `22px` | `46` round, `1px --border2`, `--glass`, default icon `--accent2` |
| DZ label / hint | `--font-ui` `14px`/600 `--text` · `12px` `--text-faint` | `fonts.ui` `14`/600 `--text` · `12` `--text-faint` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Toolbar btn idle | `.lk-toolbar-btn` | `styles.btn` |
| Toolbar btn hover | `:hover` → `--glass-2` + `--text` | `pressed` (non-active) → `--glass2` |
| Toolbar btn active | `.lk-toolbar-on` accent tint (`#cbbcff` glyph) | `btnOn` accent bg/border; glyph color from item |
| Divider | `.lk-toolbar-divider` | `styles.divider` |
| Dropzone idle | dashed `--border-2`, faint accent fill | `styles.dropzone` |
| Dropzone hover / dragover | `:hover`/`:focus-visible`/`.lk-dropzone-over` → accent-2 lift | `pressed` → `dropzoneActive` |
| Dropzone activate | click → hidden input; **drag-drop** → `onDrop` reads `dataTransfer.files` | tap → `expo-document-picker` (or `onPress` only) |

## 5. Web ↔ native parity

**Verdict: 🔵 — `Toolbar` identical, `Dropzone` has a native capability gap.**

**`Toolbar`** is effectively ✅: same `items`/`ToolbarItem` model, same bar/button/divider tokens, sizes, and
active tint. The only differences are substrate — web `onClick` vs native `onPress`, and native has **no
`currentColor` inheritance**, so each glyph must set its own color (the default-set svgs use `colors.textDim`;
for an active item pass an already-accent-colored glyph). Web also adds `forwardRef`/`className`.

**`Dropzone`** is 🔵: web supports real **OS file drag-drop** (`onDrop`/`onDragOver`/`onDragLeave` reading
`dataTransfer.files`) plus click-to-pick; **React Native cannot receive OS file drops**, so native is
**tap-only** — it opens the `expo-document-picker` (when the peer is installed) or just calls `onPress`. The
`onFiles` payload also differs: a DOM `FileList` (web) vs picked-file descriptors (native). This is a genuine
platform limit, not a styling choice — design uploads to use tap-to-pick on native.

## 6. Composition & usage

- **`Toolbar` composes:** consumer-supplied `icon` nodes (inline SVG or shared `Icon`). It is the formatting
  bar inside `RichTextEditor` (which maps each `RichTextAction` to a `ToolbarItem`).
- **`Dropzone`** is standalone (web hides its own `<input type="file">`).
- **Used by:** rich-text editors, CMS media-library upload surfaces, admin asset pickers.

```tsx
// web
<Toolbar items={[{ icon: <BoldGlyph />, label: 'Bold', active, onClick: toggleBold }, { divider: true, icon: null }]} />
<Dropzone onFiles={(files) => upload(files)} hint="PNG, JPG, GIF up to 10MB" />

// native
<Toolbar items={[{ icon: <BoldGlyph color={colors.text} />, label: 'Bold', active, onPress: toggleBold }]} />
<Dropzone onPress={openPicker} onFiles={(assets) => upload(assets)} />
```

## 7. Accessibility

- **Toolbar:** web root is `role="toolbar"`; each button carries `aria-label`/`title`/`aria-pressed` from the
  item; dividers are `aria-hidden`. Native root is `accessibilityRole="toolbar"`; buttons carry
  `accessibilityLabel` + `accessibilityState={{ selected: active }}`.
- **Dropzone:** web is `role="button"` `tabIndex={0}`, activatable by Enter/Space (click opens the file
  dialog); the file `<input>` is visually hidden but reachable. Native is a `Pressable`
  `accessibilityRole="button"` labelled by `label`.
- **Hit target:** toolbar buttons are 30px; the dropzone is ≥168px tall — both touch-adequate.

## 8. Usage rules — Do / Don't

**Do**
- Use `Toolbar` for icon-button formatting rows; mark the current format with `active`.
- On native, pass already-colored glyphs (or `Icon`) — there's no `currentColor` to inherit.
- Use `Dropzone` for upload surfaces; design native flows around **tap-to-pick**.

**Don't**
- ✗ Don't pass `onClick` on native or `onPress` on web for toolbar items (wrong-platform prop).
- ✗ Don't rely on file drag-drop working on native — it can't; tap opens the picker.
- ✗ Don't assume `onFiles` gives a `FileList` on native — it's picked-file descriptors.
- ✗ Don't hardcode the bar/button/dropzone chrome or the active tint — tokens only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled icon-button strip or a custom dashed upload box is a parity violation —
  import `Toolbar` / `Dropzone`.
- **Capability honesty.** Don't fake file drag-drop on native; build tap-to-pick (via `expo-document-picker`)
  and surface the difference to product.
- **New need → both platforms.** A new toolbar affordance (overflow menu, button groups) or a Dropzone
  feature (progress, previews) must be added on web **and** native with the same prop API.
- **Tokens only.** Bar `--glass-2`/`--border-2`, active `rgba(124,92,255,…)` accent tint, dropzone dashed
  `--border-2` → `--accent-2` on hover/drag. The `#cbbcff` active glyph + the accent-tint rgba values mirror
  the accent token at fixed opacity (documented).
- **Parity gate.** Confirm web phone-width and native renders match (bar, dividers, active state; dropzone
  badge/label) and that native uploads use tap-to-pick before shipping.
