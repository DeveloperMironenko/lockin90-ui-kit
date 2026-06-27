# SDD — `Tooltip`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Tooltip.tsx` · `packages/ui-native/src/components/Tooltip.tsx` ·
> web CSS `packages/ui/src/styles/components/tooltip.css` (`.lk-tip*`) · positioning `packages/ui/src/components/tooltipPosition.ts` (`computeTooltipPosition`).
> **Exports:** `Tooltip`, type `TooltipPlacement`, type `TooltipProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & bubble (incl. diamond arrow); web is **hover/focus**-triggered, native is **press**-triggered.
> **Stories:** `packages/ui/src/stories/Tooltip.stories.tsx` · `packages/ui-native/src/stories/Tooltip.stories.tsx`.

---

## 1. Overview

A small **text bubble** revealed on a trigger, for terse helper text. Wraps a trigger (or renders a default "?" badge when none is given) and shows a glassy bubble with a **diamond arrow** pointing at the trigger. The bubble is collision-aware: it flips to the opposite side and shifts to stay inside the viewport, and the arrow tracks the trigger's center.

Reach for `Tooltip` for hover/press hints only. For rich/interactive panel content use `Popover`; for an action list use `Menu`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `content` | `ReactNode` | `'Tooltip'` | ✓ | ✓ | bubble content; native styles a bare `string` as `Text` |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` (`TooltipPlacement`) | `'top'` | ✓ | ✓ | **preferred** side — web flips+shifts via collision math; native places per side, with `top` falling back below |
| `children` | `ReactNode` | "?" badge | ✓ | ✓ | the trigger |
| `className` | `string` | — | ✓ | — | web only (merged onto `.lk-tip`) |
| _rest_ | `Omit<HTMLAttributes<HTMLSpanElement>,'content'>` | — | ✓ | — | web only — spread onto the `.lk-tip` wrapper |

- **Web:** the wrapper `<span>` opens on `mouseenter`/`focus` and closes on `mouseleave`/`blur`; with no children it gets `tabIndex={0}` so it's keyboard-focusable. The bubble is **portaled to `<body>`** (so no `overflow` ancestor clips it), positioned by `computeTooltipPosition` (preferred → opposite → others, then clamp/shift), repinned on `scroll`(capture)/`resize`. `aria-describedby` links trigger→bubble via `useId`.
- **Native:** the trigger `Pressable` toggles a transparent RN `Modal` (`animationType="fade"`) with a backdrop `Pressable`; the trigger is `measureInWindow`'d and the bubble is anchored per `placement`, clamped to `8px` insets. The `top` case falls back to `bottom` when there's no room above; the resolved side drives the arrow.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Default "?" badge | 16×16, `999px`, `1px --border-2`, `--glass-2`, `--text-dim`, 11px 600, `cursor: help` | 16×16, `radii.pill`, `1px colors.border2`, `colors.glass2`, `fonts.ui` 11px 600 |
| Bubble bg | `--bg-1` | `colors.bg1` |
| Bubble border / radius | `1px --border-2` / `--r-sm` (10) | `1px colors.border2` / `radii.sm` (10) |
| Bubble text | `--text`, `--font-ui` 12px / 1.4 | `colors.text`, `fonts.ui` 12px / 16 lh |
| Bubble pad / max-w | `6px 9px` / `240px` | `6px 9px` / `220` |
| Shadow | `0 6px 20px rgba(0,0,0,.45)` | `nativeShadows.elev1` |
| Arrow | `::after` 7×7 rotated square, shares surface+border, tracks `--tip-arrow`, edge per `.lk-tip-<side>` | 8×8 rotated `View`, shares `bg-1`+`border2`, tracks trigger center (clamped `12px` inset) |
| Pointer events | `pointer-events: none` on bubble | `pointerEvents="none"` on bubble |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Hidden | bubble not mounted | `Modal visible={false}` |
| Shown | portaled `.lk-tip-bubble.is-open` (opacity 1, `0.14s`) | `Modal` fade-in; anchored bubble |
| Trigger reveal | `mouseenter` / `focus` | `onPress` (toggle) |
| Trigger hide | `mouseleave` / `blur` | press again / backdrop tap / Android back |
| Reposition | `scroll`(capture)/`resize` recompute (flip+shift) | `onLayout` size change + clamp |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & bubble, platform-shaped trigger.** Identical prop names/defaults, identical bubble tokens (bg-1, border-2, r-sm, ui 12px), identical default "?" badge, and **both render the diamond arrow** that tracks the trigger center. The differences are by necessity:

- **Trigger model:** web is **hover/focus** (pointer + keyboard); native has no hover, so it's **press to toggle** (tap again / backdrop to hide). This is the one intentional interaction difference.
- **Positioning:** web uses the pure `computeTooltipPosition` (preferred → opposite → others, shift) and portals to `<body>`; native places per `placement` with a `top→bottom` fallback and `8px` clamp. Same goal, different substrate.
- **Arrow geometry:** web `::after` pseudo (7px) vs native rotated `View` (8px) — both share the bubble surface+border and point at the trigger.

No capability gap blocks use — the tooltip is fully usable and visually equivalent; only the reveal gesture differs.

## 6. Composition & usage

- **Composes from:** nothing else (self-contained bubble + default badge).
- **Used by:** inline label hints, truncated-value explainers, icon-button affordance text.

```tsx
// web — wrap any trigger
<Tooltip content="Last synced 4m ago" placement="top">
  <Icon name="info" />
</Tooltip>
// default "?" badge
<Tooltip content="Readiness 0–100" />

// native — press to reveal
<Tooltip content="Last synced 4m ago" placement="bottom">
  <Icon name="info" />
</Tooltip>
```

## 7. Accessibility

- **Web:** bubble is `role="tooltip"` with an `id`; the trigger sets `aria-describedby` while open. Opens on `focus` (not just hover) and the default badge is keyboard-focusable (`tabIndex={0}`). Decorative badge text is `aria-hidden`.
- **Native:** the trigger is a `Pressable` (`accessibilityRole="button"`); reveal is a deliberate tap (works without a pointer). Android back / backdrop dismiss.
- **Contrast:** bubble uses `--text` on `--bg-1` — full-strength text (not dimmed) for legibility at 12px.

## 8. Usage rules — Do / Don't

**Do**
- Keep `content` short — a phrase, not a paragraph (use `Popover` for more).
- Set `placement` to your preferred side; trust the flip/shift to keep it on-screen.
- Wrap a real focusable trigger (icon button) so keyboard users get it on web.

**Don't**
- ✗ Don't put interactive content in a `Tooltip` (it's `pointer-events: none` / press-to-toggle) — use `Popover`.
- ✗ Don't hardcode the bubble bg, border, arrow, or text color — tokens.
- ✗ Don't rely on hover on native — it's press-triggered by design.
- ✗ Don't pass `className`/rest on native (web-only).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A `title=`-attribute or a custom absolutely-positioned hint will clip inside overflow ancestors and won't flip/shift. Import `Tooltip`.
- **New need → both platforms.** A delay prop, a rich arrow, or a controlled `open` must be added to `TooltipProps` on web **and** native with the same names/tokens.
- **Tokens only.** Badge, bubble, and arrow colors/radii all come from `@lockin90/tokens`.
- **Parity gate.** Before shipping, confirm the web phone-width tooltip and native tooltip match (same content, placement, arrow) — accepting only the hover-vs-press reveal difference.
