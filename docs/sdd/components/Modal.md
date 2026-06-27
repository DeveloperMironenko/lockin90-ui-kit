# SDD — `Modal`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Modal.tsx` · `packages/ui-native/src/components/Modal.tsx` ·
> web CSS `packages/ui/src/styles/components/modal.css` (`.lk-modal*`).
> **Exports:** `Modal`, type `ModalProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & dialog; web portals over a **blurred** scrim, native uses RN `Modal` over a **dimmed** scrim (no `backdrop-filter`).
> **Stories:** `packages/ui/src/stories/Modal.stories.tsx` · `packages/ui-native/src/stories/Modal.stories.tsx`.

---

## 1. Overview

The kit's **centered dialog** — a glass card floating over a scrim, for confirmations, short forms, and detail panels that interrupt the page. Structure: optional header (`font-display` title + `×` close), a padded scrollable body, and an optional hairline footer holding right-aligned actions.

It is the only sanctioned centered-dialog primitive. For an edge-anchored drawer / bottom sheet use `Sheet`; for an anchored action list use `Menu`; for a sensitive re-auth flow use `ReauthDialog` (which composes Modal).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `open` | `boolean` | `true` | ✓ | ✓ | when false nothing renders (web returns `null`; native passes `visible` to RN `Modal`) |
| `onClose` | `() => void` | — | ✓ | ✓ | fired on scrim click/tap, close-button, **ESC** (web) / **Android back** (native) |
| `title` | `string` | — | ✓ | ✓ | header omitted when absent (unless `onClose` present → header renders with just the ×) |
| `children` | `ReactNode` | — | ✓ | ✓ | body; native wraps a bare `string` child in a styled `Text` |
| `footer` | `ReactNode` | — | ✓ | ✓ | right-aligned actions under a hairline; omitted when absent |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | ✓ | ✓ | max-width 380 / 460 / 620 |
| `className` | `string` | — | ✓ | — | web only (merged onto `.lk-modal`) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only — spread onto the dialog `<div>` |

- **Web:** portals to `document.body` (after a mount tick — guards SSR `document` access + hydration mismatch). The dialog `<div>` carries `role="dialog"`, `aria-modal="true"`; the scrim is `role="presentation"`. Click on the card `stopPropagation`s so only scrim clicks close.
- **Native:** thin wrapper over RN `Modal` (`transparent`, `animationType="fade"`, `statusBarTranslucent`, `onRequestClose`). No `className`/rest spread, no DOM. The card `Pressable` has an empty `onPress` to swallow taps; `accessibilityViewIsModal` traps focus.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Scrim | `rgba(0,0,0,.6)` + `backdrop-filter: blur(6px)` | `rgba(0,0,0,.6)` (no blur) |
| Card bg | `--bg-1` (fallback `--glass-2`) | `colors.bg1` |
| Card border | `1px --border` | `1px colors.border` |
| Card radius | `--r-lg` (22) | `radii.lg` (22) |
| Card shadow | `--elev-2` / `0 24px 64px rgba(0,0,0,.5)` | inline `#000` opacity .5, radius 64, offset y24, elevation 20 |
| Title | `--font-display` 700, 17px, `-0.01em`, `--text` | `fonts.display` 700, 17px, `-0.17` ls, `colors.text` |
| Body | `--font-ui` 14px / 1.55, `--text-dim` | `fonts.ui` 14px / 22 lh, `colors.textDim` |
| Close × | 30×30, `--r`, `--text-faint`; hover `--text` + `--glass` | 30×30, `radii.sm`, stroke `colors.textFaint` |

- **Scrim padding:** web `24px` (grid-centered); native `24` (flex-centered). **Card width:** `100%` up to the size cap. **Max-height:** web `calc(100vh − 48px)` with `overflow-y:auto` body; native body has no cap (host scroll).
- **Header / footer chrome:** header `18px 20px` with `1px --border` bottom; footer `16px 20px`, `flex-end`, `gap 10/12`, `1px --border` top.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Open | portaled `.lk-modal-scrim` + `.lk-modal` | `RNModal visible` fade-in |
| Closed | returns `null` (after unmount) | `RNModal visible={false}` |
| Close-× hover | `.lk-modal-close:hover` → `--text` + `--glass` bg | n/a (press only, `hitSlop 6`) |
| Dismiss | scrim click / ESC | scrim tap / Android back (`onRequestClose`) |
| Scroll | body `overflow-y:auto` when taller than `100vh−48` | host scroll |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & dialog, platform-shaped overlay.** Identical prop names/defaults, identical header/body/footer structure, identical card tokens (bg-1, border, r-lg, display title, dim body), identical size caps. Differences are substrate + one real capability gap:

- **Scrim blur (capability gap):** web frosts the scrim with `backdrop-filter: blur(6px)`; native can't blur arbitrary content behind a `Modal`, so it dims with the same `rgba(0,0,0,.6)` only. Ambient, does not block use.
- **Dismiss key:** web closes on **ESC** (window `keydown`); native closes on **Android back** (`onRequestClose`). Both also close on scrim tap.
- **Substrate:** web portals to `<body>` to escape transformed/`backdrop-filter` ancestors; native uses RN `Modal`. Web exposes `className`/rest on the dialog; native does not.

No capability gap blocks use — the dialog is fully usable and visually equivalent (modulo the scrim frost).

## 6. Composition & usage

- **Composes from:** plain layout + your own body content; footer typically holds `Button`s (`ghost` cancel + `primary` confirm).
- **Used by:** `ReauthDialog` (sensitive step-up), confirm/destructive flows, short edit forms. For mobile-shaped surfaces prefer `Sheet`.

```tsx
// web
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete workout?"
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={confirm}>Delete</Button>
  </>}
>
  This permanently removes the workout and its logs.
</Modal>

// native
<Modal open={open} onClose={() => setOpen(false)} title="Delete workout?"
  footer={<Button variant="primary" title="Delete" onPress={confirm} />}>
  This permanently removes the workout and its logs.
</Modal>
```

## 7. Accessibility

- **Web:** `role="dialog"` + `aria-modal="true"` on the card; scrim is `role="presentation"`. Close button has `aria-label="Close"`. ESC closes. (Focus-trapping/return-focus is not built in — the consumer should manage initial focus for long-lived dialogs.)
- **Native:** `accessibilityViewIsModal` on the card traps assistive focus; close button has `accessibilityRole="button"` + `accessibilityLabel="Close"` and `hitSlop={6}` for a comfortable target.
- **Hit target:** the × is 30×30 (native adds `hitSlop`). Footer actions inherit `Button` sizing (≥44px at `md`).

## 8. Usage rules — Do / Don't

**Do**
- Pass `onClose` so the scrim/ESC/back all dismiss consistently.
- Keep one clear primary action in the `footer` (`ghost` cancel + `primary` confirm).
- Choose `size` by content density — `sm` confirmations, `lg` rich detail.
- Render a bare string body and let native style it; pass nodes for richer bodies.

**Don't**
- ✗ Don't hand-roll a centered overlay with a custom scrim/card — use `Modal`.
- ✗ Don't hardcode the scrim color, card radius, shadow, or padding — they're tokens.
- ✗ Don't rely on the scrim blur being present on native (it dims only).
- ✗ Don't pass `className`/rest on native (web-only).
- ✗ Don't nest a `Modal` inside another open `Modal`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "popup" div + dimmer is a parity violation — it won't portal/escape overflow on web and won't trap focus on native. Import `Modal`.
- **New need → both platforms.** A new size or a header-action slot must be added to `ModalProps` on web **and** native with the same name/tokens — never a one-off.
- **Tokens only.** Scrim, `bg-1`, `border`, `r-lg`, `elev-2`, and the display/ui type all come from `@lockin90/tokens`.
- **Parity gate.** Before shipping, confirm the web phone-width modal and the native modal match (same title, body, footer actions, size) — accepting only the documented scrim-blur difference.
