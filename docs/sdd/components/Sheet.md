# SDD — `Sheet`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Sheet.tsx` · `packages/ui-native/src/components/Sheet.tsx` ·
> web CSS `packages/ui/src/styles/components/sheet.css` (`.lk-sheet*`).
> **Exports:** `Sheet`, type `SheetProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & panels; web slides via CSS `transform` over a **blurred** scrim, native uses RN `Modal` `animationType="slide"` over a **dimmed** scrim.
> **Stories:** `packages/ui/src/stories/Sheet.stories.tsx` · `packages/ui-native/src/stories/Sheet.stories.tsx`.

---

## 1. Overview

The kit's **edge-anchored overlay**: a bottom sheet or a side drawer over a scrim. Three sides:

- `bottom` — full-width sheet pinned to the bottom edge, rounded top corners, a centered **drag-handle** pill. The default; the mobile-shaped surface for actions/forms.
- `right` / `left` — full-height ~360px edge **drawers** (nav, filters, detail panels).

Use `Sheet` when content is list/form-shaped and should rise from an edge; use `Modal` for a centered confirmation, `Menu` for a small anchored action list.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `open` | `boolean` | `true` | ✓ | ✓ | when false nothing renders (web `null`; native `visible`) |
| `onClose` | `() => void` | — | ✓ | ✓ | fired on scrim click/tap + **ESC** (web) / **Android back** (native) |
| `side` | `'bottom' \| 'right' \| 'left'` | `'bottom'` | ✓ | ✓ | bottom = handled sheet; right/left = full-height drawer |
| `title` | `string` | — | ✓ | ✓ | optional `font-display` heading |
| `children` | `ReactNode` | — | ✓ | ✓ | body; native wraps a bare `string` child in a styled `Text` |
| `className` | `string` | — | ✓ | — | web only (merged onto `.lk-sheet`) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only — spread onto the panel `<div>` |

- **Web:** renders a fixed scrim (`.lk-sheet-scrim.is-open`) + the panel; the panel carries `role="dialog"` + `aria-modal="true"` and `stopPropagation`s clicks. **Not portaled** (unlike Modal) — it relies on `position: fixed` + a high `z-index`. The `is-open` class drives the slide-in transform.
- **Native:** RN `Modal` (`transparent`, `animationType="slide"`, `statusBarTranslucent`, `onRequestClose`). Scrim alignment + panel shape are picked by `side`; the card `Pressable` swallows taps and is `accessibilityViewIsModal`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Scrim | `rgba(0,0,0,.55)` + `backdrop-filter: blur(6px)`, fades via `--ease` | `rgba(0,0,0,.55)` (no blur), RN slide |
| Panel bg | `--bg-1` (fallback `--glass-2`) | `colors.bg1` |
| Panel border | `1px --border` | `1px colors.border` |
| Panel shadow | `0 -18px 50px -12px rgba(0,0,0,.7)` | inline `#000` opacity .7, radius 50, offset y−18, elevation 20 |
| Bottom radius | top corners `--r-lg` (22) | top corners `radii.lg` (22) |
| Drawer radius | `--r-lg` then outer corners zeroed | inner corners `radii.lg`, outer flat |
| Drag handle | 40×4, `999px`, `--border-2` | 40×4, `999`, `colors.border2` |
| Title | `--font-display` 700, 16px, `-0.01em`, `--text` | `fonts.display` 700, 16px, `-0.16` ls, `colors.text` |
| Body | `--font-ui` 14px / 1.55, `--text-dim`, `overflow-y:auto` | `fonts.ui` 14px / 22 lh, `colors.textDim`, `flexShrink:1` |

- **Bottom sheet:** `max-height 86vh` (native `86%`), padding `8px 16px 18px`; slides from `translateY(100%)` → `0` (native uses RN slide).
- **Drawers:** `width 360px` (`max-width 100vw`), full-height, padding `18px 20px`; slide from `translateX(±100%)` → `0`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Open | `.lk-sheet-scrim.is-open` (opacity 1) + panel `is-open` (transform 0) | `RNModal visible` slide-in |
| Closed | returns `null` | `RNModal visible={false}` |
| Slide-in | `transform` over `0.36s var(--ease)` (`cubic-bezier(.22,1,.36,1)`) | RN `animationType="slide"` |
| Dismiss | scrim click / ESC | scrim tap / Android back |
| Body scroll | `overflow-y:auto` past `86vh` | host scroll (`flexShrink:1`) |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & panel design, platform-shaped overlay.** Identical prop names/defaults, identical three-side model, identical drag-handle + title + body tokens, identical 360px drawer width and 86% bottom cap. Differences are substrate + the scrim-blur gap:

- **Scrim blur (capability gap):** web frosts the scrim (`backdrop-filter: blur(6px)`); native dims with the same `rgba(0,0,0,.55)` only. Ambient.
- **Slide engine:** web animates a CSS `transform` (`is-open` class, `--ease`); native uses RN `Modal`'s built-in `slide`. Same visual result; native doesn't expose the easing curve.
- **Dismiss key:** ESC (web) vs Android back (native); both also tap-dismiss.
- **Substrate:** web is `position: fixed` (not portaled) + `className`/rest; native is an RN `Modal` with no DOM props.

No gap blocks use — the sheet/drawer is fully usable and visually equivalent (modulo scrim frost).

## 6. Composition & usage

- **Composes from:** your own body content; bottom sheets often hold a short form or an action list, drawers hold nav/filter trees.
- **Used by:** mobile-shaped action/detail surfaces, filter panels, side nav on web phone-width.

```tsx
// web — bottom action sheet
<Sheet open={open} onClose={close} title="Log a workout">
  <FormField label="Exercise"><Input /></FormField>
  <Button variant="primary" onClick={save}>Save</Button>
</Sheet>

// native — right drawer
<Sheet open={open} onClose={close} side="right" title="Filters">
  <Checkbox label="Strength" /> <Checkbox label="Cardio" />
</Sheet>
```

## 7. Accessibility

- **Web:** panel is `role="dialog"` + `aria-modal="true"`; scrim is `role="presentation"`. ESC + scrim click dismiss. The drag handle is `aria-hidden` (decorative). Manage initial focus for long forms.
- **Native:** `accessibilityViewIsModal` traps assistive focus; the handle is `pointerEvents="none"` decoration. Android back dismisses via `onRequestClose`.
- **Touch:** bottom sheet's handle signals draggability (visual only — there's no gesture-to-dismiss built in; dismissal is scrim/back). Body scrolls when content exceeds the cap.

## 8. Usage rules — Do / Don't

**Do**
- Use `bottom` for mobile-shaped actions/forms; `right`/`left` for drawers.
- Always wire `onClose` so scrim + ESC/back dismiss consistently.
- Keep the body scroll-friendly — sheets cap at 86% height.
- Give a `title` when the sheet has a clear subject.

**Don't**
- ✗ Don't hand-roll an edge-anchored panel + scrim — use `Sheet`.
- ✗ Don't hardcode the radius, handle, scrim, or slide distance — tokens.
- ✗ Don't expect the drag handle to dismiss by gesture (it's a visual affordance).
- ✗ Don't pass `className`/rest on native (web-only).
- ✗ Don't stack a `Sheet` over an open `Modal`/`Sheet`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom drawer with its own transform + scrim is a parity violation (web won't match the `--ease` slide; native won't match RN slide). Import `Sheet`.
- **New need → both platforms.** A new `side`, a snap-point, or a sticky footer must land in `SheetProps` on web **and** native with the same name/tokens.
- **Tokens only.** Scrim, `bg-1`, `border`, `r-lg`, handle `border-2`, and display/ui type are all tokens.
- **Parity gate.** Before shipping, confirm the web phone-width sheet and the native sheet match (same side, title, handle, body) — accepting only the documented scrim-blur difference.
