# SDD — `Popover` (+ `CopyButton` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Popover.tsx` · `packages/ui-native/src/components/Popover.tsx` ·
> web CSS `packages/ui/src/styles/components/popover.css` (`.lk-pop*`, `.lk-copy*`) · positioning `packages/ui/src/components/tooltipPosition.ts` (`computeMenuPosition`).
> **Exports:** `Popover`, `CopyButton`, type `PopoverProps`, type `CopyButtonProps`.
> **Status:** Shipped. **Parity:** 🟡 same API; web is **portaled + collision-aware** (flip/shift), native is an RN `Modal` with **measure-and-clamp**.
> **Stories:** `packages/ui/src/stories/Popover.stories.tsx` · `packages/ui-native/src/stories/Popover.stories.tsx`.

---

## 1. Overview

A **click-triggered floating panel of arbitrary content** — richer than a `Tooltip` (which is text-only and hover-driven). The default trigger is a small "?" info button; the panel is a glass card with a small pointing arrow, aligned to an edge of the trigger and dismissed on outside-click/tap or ESC.

This file also documents **`CopyButton`** (lives in the same source file): a copy-to-clipboard control whose copy glyph flashes to a check for ~1.2s after a successful copy.

## 2. API contract

### `Popover`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `trigger` | `ReactNode` | "?" info button | ✓ | ✓ | a custom trigger renders inside a bare inline wrapper (web: NOT a `<button>`, so an interactive trigger like `<Button>` isn't an invalid nested button) |
| `children` | `ReactNode` | sample explainer text | ✓ | ✓ | panel content; native styles a bare `string` child as `Text` |
| `align` | `'left' \| 'right' \| 'center'` | `'center'` | ✓ | ✓ | which trigger edge the panel aligns to |
| `className` | `string` | — | ✓ | — | web only (merged onto `.lk-pop`) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only — spread onto the `.lk-pop` root |

- **Web:** open state is internal (`useState`); the panel is **portaled to `<body>`** so no `overflow` ancestor clips it. Position is computed by `computeMenuPosition` (opens below, **flips above** when there's no room, **shifts** to stay on-screen) and repinned on `scroll`(capture)/`resize`. Closes on `mousedown` outside (root + portaled panel both checked) or `Escape`. The default trigger is a real `<button aria-haspopup="dialog" aria-expanded>`.
- **Native:** open toggles a transparent RN `Modal` (`animationType="fade"`); a full-screen `Pressable` backdrop closes on tap. The trigger is `measureInWindow`'d to an anchor; the panel is absolutely positioned (flips above near the screen bottom, clamps horizontally to `8px` insets) and self-measures via `onLayout`.

### `CopyButton`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `string` | `'LOCKIN-2026'` | ✓ | ✓ | text written to the clipboard |
| `label` | `string` | — | ✓ | ✓ | optional text beside the icon |
| `onClick` / `onPress` | handler | — | `onClick` | `onPress` | **platform-shaped** — fires after the copy |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `Omit<ButtonHTMLAttributes,'value'>` | — | ✓ | — | web only |

- **Web:** writes via `navigator.clipboard?.writeText` (optional-chained). **Native:** writes via **`expo-clipboard`** if the optional peer is installed — otherwise it keeps the visual check flash and skips the actual write (graceful, best-effort).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web `Popover` | Native `Popover` |
| --- | --- | --- |
| Default trigger | `min-w 28` ×28, `999px`, `1px --border`, `--glass-2`, `--text-dim`; `aria-expanded` → `--accent` border | `min-w 28` ×28, `radii.pill`, `1px colors.border`, `colors.glass2` |
| Panel bg | `--bg-1` (fallback `--glass-2`) + `backdrop-filter: blur(18px) saturate(130%)` | `colors.bg1` |
| Panel border / radius | `1px --border` / `--r-sm` (10) | `1px colors.border` / `radii.sm` (10) |
| Panel shadow | `0 16px 44px rgba(0,0,0,.52)` | `nativeShadows.elev2` |
| Panel max-width / pad | `260px` / `12px` | `260` / `12` |
| Arrow | 8×8 rotated square, shares panel surface+border, tracks `--pop-arrow`, flips per side | _no arrow_ (panel only) |
| Body text | `--font-ui` 12.5px / 1.45, `--text-dim` | `fonts.ui` 12.5px / 18 lh, `colors.textDim` |

| Aspect | Web `CopyButton` | Native `CopyButton` |
| --- | --- | --- |
| Shell | `1px --border`, `--r-sm`, `--glass-2`, `--font-mono` 12.5px, `min-h 28` | `1px colors.border`, `radii.sm`, `colors.glass2`, `fonts.ui` 12.5px 600, `h 30` |
| Icon | copy glyph (two rounded rects), `--text-faint` → check on success | same glyph, `colors.textDim` → `Icon check` `colors.accent3` |
| Success | `.lk-copy-done` → `--mint`/`--zone-high` text + tinted border | `border/​bg` `rgba(52,245,197,.4/.12)`, label `colors.accent3` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Closed | trigger only; portal not mounted | trigger only; `Modal visible={false}` |
| Open | portaled `.lk-pop-panel.is-open` (fade + translateY 0) | `Modal` fade; anchored panel |
| Trigger active | `[aria-expanded='true']` → `--accent` border | `accessibilityRole="button"` press |
| Reposition | on `scroll`(capture)/`resize` → recompute | recompute on `onLayout` size change |
| Dismiss | outside `mousedown` / ESC | backdrop tap / Android back |
| Copy flashed | `.lk-copy-done` for 1.2s (timeout) | `btnDone` for 1.2s (timeout) |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped positioning.** Identical prop names/defaults (`trigger`/`children`/`align`), identical glass-card visuals + tokens, identical CopyButton glyph + 1.2s check flash. The differences are by necessity:

- **Positioning engine:** web uses the pure, unit-tested `computeMenuPosition` (flip + shift collision math) and portals the panel to `<body>`; native `measureInWindow`s the trigger and clamps the panel into the screen (flip above near the bottom, `8px` horizontal inset). Same intent, different substrate.
- **Arrow:** web draws a CSS rotated-square arrow that tracks the trigger (`--pop-arrow`); native renders the panel **without** an arrow. Minor visual difference, does not block use.
- **Panel frost:** web `backdrop-filter: blur(18px) saturate(130%)`; native is an opaque `bg-1` card (no `backdrop-filter`).
- **CopyButton clipboard:** web always has `navigator.clipboard`; native depends on the optional `expo-clipboard` peer (visual flash regardless).
- **Handler name:** CopyButton web `onClick` ↔ native `onPress` (platform-shaped).

## 6. Composition & usage

- **Composes from:** `Icon` (default "?"/info glyph, copy check). Panel content is arbitrary.
- **Used by:** inline explainers next to metric labels, promo-code copy rows (`CopyButton`), help affordances richer than a tooltip.

```tsx
// web — explainer popover
<Popover align="right" trigger={<Button variant="ghost" size="sm">Why?</Button>}>
  <p>Readiness blends recent training, sleep, and recovery.</p>
</Popover>
<CopyButton value="LOCKIN-2026" label="Copy code" />

// native
<Popover align="center"><Text>Readiness blends training, sleep, recovery.</Text></Popover>
<CopyButton value="LOCKIN-2026" label="Copy" onPress={track} />
```

## 7. Accessibility

- **Web:** default trigger is a `<button>` with `aria-haspopup="dialog"` + `aria-expanded`; the panel is `role="dialog"`. A custom trigger uses an inline wrapper (with the same `aria-haspopup`/`expanded`) to avoid nesting a `<button>`. ESC + outside-click dismiss. `CopyButton` toggles `aria-label` between "Copy" and "Copied".
- **Native:** trigger and backdrop are `Pressable` with `accessibilityRole="button"`; `CopyButton` swaps `accessibilityLabel` between "Copy"/"Copied". Android back dismisses.
- **Hit target:** trigger ≥28px; CopyButton ≥28–30px tall.

## 8. Usage rules — Do / Don't

**Do**
- Use `Popover` for rich/interactive content; use `Tooltip` for hover text only.
- Pass an interactive `trigger` freely on web — the inline wrapper keeps the HTML valid.
- Use `CopyButton` for any copy-to-clipboard affordance (codes, IDs, links).
- Install `expo-clipboard` in the native app if you need real copying.

**Don't**
- ✗ Don't hand-roll a floating panel + outside-click handler — use `Popover`.
- ✗ Don't hardcode the panel bg, blur, radius, arrow, or copy-flash colors — tokens.
- ✗ Don't wrap a `<button>` trigger in another `<button>` (the wrapper exists for this).
- ✗ Don't pass `className`/rest on native, or `onClick` to native `CopyButton`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom pop/dropdown that re-implements outside-click + positioning will drift from `computeMenuPosition` and clip inside overflow ancestors. Import `Popover`.
- **New need → both platforms.** A new `align`, a controlled `open`, or an arrow on native must be added to `PopoverProps` on web **and** native with the same name/tokens.
- **Tokens only.** Trigger, panel, arrow, and CopyButton colors/radii all come from `@lockin90/tokens`.
- **Parity gate.** Before shipping, confirm the web phone-width popover and native popover match (same trigger, alignment, content) — accepting the documented arrow/frost differences.
