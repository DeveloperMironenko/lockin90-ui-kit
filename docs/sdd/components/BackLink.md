# SDD — `BackLink`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/BackLink.tsx` · `packages/ui-native/src/components/BackLink.tsx` ·
> web CSS `packages/ui/src/styles/components/backlink.css` (`.lk-backlink*`).
> **Exports:** `BackLink`, type `BackLinkProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; web's `href` (anchor vs button) has no native equivalent.
> **Stories:** `packages/ui/src/stories/BackLink.stories.tsx` · `packages/ui-native/src/stories/BackLink.stories.tsx`.

---

## 1. Overview

The **"‹ Back" navigation affordance** — a chevron-left glyph + label rendered in the accent color. It's the kit's single sanctioned back control, mandated on every screen the user navigates **into** (detail, settings sub-screen, opened menu) so the hierarchy retraces cleanly.

On web it renders an `<a href>` when `href` is set, otherwise a `<button type="button">`; on native it's always a `Pressable` driven by `onClick`. Both wire to the router's back with a logical-parent fallback (the consumer supplies `onClick`/`href`).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | `'Back'` | ✓ | ✓ | text after the chevron |
| `href` | `string` | — | ✓ | — | **web only** — when set, renders `<a href>`; else `<button>` |
| `onClick` | `() => void` | — | ✓ | ✓ | click/press handler (native maps it onto `onPress`) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `Omit<Anchor & Button HTMLAttributes, keyof CommonProps>` (web) / `Omit<PressableProps, 'children' \| 'style' \| 'onPress'>` (native) | — | ✓ | ✓ | spread onto the rendered element |

- **Web:** `BackLinkProps = CommonProps & Omit<AnchorHTMLAttributes & ButtonHTMLAttributes, keyof CommonProps>` — rest is cast to the anchor or button attr set depending on which element renders.
- **Native:** `onClick` is the shared handler name (mirrors web); the component maps it to `Pressable`'s `onPress`. There is **no `href`** on native (no anchor concept).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`backlink.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Row | `inline-flex`, `align-items: center`, `gap: 4px`, `padding: 4px 2px` | row, `align-items: center`, `gap: 4`, `paddingVertical: 4`, `paddingHorizontal: 2` |
| Color | `--accent`; hover → `--accent-2` | `colors.accent` (label + icon) |
| Font | `--font-ui`, `14.5px`, 600, `line-height: 1` | `fonts.ui`, `14.5`, `'600'` |
| Icon | `Icon name="back"` size 18, `.lk-backlink-icon` | `Icon name="back"` size 18, `colors.accent` |
| Chrome | `border: 0`, `background: none`, `text-decoration: none` | none (bare Pressable row) |

- **Icon nudge (web):** `.lk-backlink:hover .lk-backlink-icon { transform: translateX(-2px) }` over `.2s var(--ease)`.
- **Focus (web):** `:focus-visible` → `box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 45%, transparent)` + `--r-sm` radius.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | accent row, chevron + label | accent row, chevron + label |
| Hover | color → `--accent-2`, icon `translateX(-2px)` | n/a (no hover) |
| Pressed | `:active` (no special rule beyond hover) | `pressed` → `opacity: 0.7` |
| Focus | `:focus-visible` accent ring | platform focus (Pressable) |
| As link | `<a href>` (web only) | always `Pressable` |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, platform-shaped element.** Identical `label` default, identical chevron (`Icon name="back"` size 18), identical accent color + `font-ui` 14.5/600 typography, and a shared `onClick` handler name. Real differences:

- **`href` / element:** web renders an `<a href>` when `href` is set (real link semantics, middle-click, etc.) else a `<button>`; native has no anchor — it's always a `Pressable` driven by `onClick`. This is the one intentional API asymmetry; app code still passes `onClick` on both, plus `href` on web when it's a true link.
- **Hover vs press:** web nudges the icon left on hover + brightens to `--accent-2`; native dims to `opacity: 0.7` on press (no hover, no icon nudge).
- **Focus ring:** web `:focus-visible` accent ring; native uses the platform focus.

No capability gap blocks use — both are a fully usable back control.

## 6. Composition & usage

- **Composes:** `Icon` (the `back` chevron).
- **Used by:** every navigated-into sub-screen header (item detail, settings sub-screen, changelog item, opened menu).
- **Wiring (global rule):** point `onClick` at `router.back()` (web) / `router.canGoBack() ? router.back() : <parentRoute>` (native), and **always** supply a logical-parent fallback for direct-link/refresh/OAuth-return cases. On web, set `href` to the parent route so it's a real link.

```tsx
// web — real link to parent with router-back override
<BackLink href="/account" label="Account" onClick={(e) => { e.preventDefault(); router.back(); }} />

// native — back with parent fallback
<BackLink label="Account" onClick={() => (router.canGoBack() ? router.back() : router.replace('/account'))} />
```

## 7. Accessibility

- **Web:** real `<a>`/`<button>` — focusable, Enter/Space (button) or Enter (link) activate; `:focus-visible` shows the accent ring. The chevron is part of the kit `Icon` (decorative); the `label` carries the text.
- **Native:** `Pressable` with `accessibilityRole="button"`; pass an `accessibilityLabel` via `...rest` if `label` alone isn't descriptive enough.
- **Hit target:** small by design (`4px`/`2px` padding) — keep it in a header row with surrounding space; don't place two back controls adjacent.

## 8. Usage rules — Do / Don't

**Do**
- Put a `BackLink` on **every** screen the user navigates into (global back-navigation rule).
- Wire `onClick` to the router's back **with a logical-parent fallback** (item→list, list→account, account→dashboard).
- Set `href` (web) to the parent route so it's a real, mid-clickable link.
- Match the destination + label across web and native (parity).

**Don't**
- ✗ Don't hand-roll a "‹ Back" row — use `BackLink`.
- ✗ Don't let back `no-op` or exit the app on direct-link/refresh — always fall back to the parent.
- ✗ Don't pass `href` on native (no anchor) — use `onClick`.
- ✗ Don't hardcode the accent color, chevron, or focus ring — tokens only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom chevron-left back row is a parity violation — import `BackLink`.
- **New need → both platforms.** A back control variant (e.g. icon-only) goes on `BackLink` web **and** native (same props, same tokens), never a one-off.
- **Tokens only.** `--accent`/`--accent-2`, `--font-ui`, and the focus ring color come from `@lockin90/tokens`.
- **Parity gate.** Before shipping a sub-screen, confirm the web phone-width and native back controls have the same label, the same destination, and a working parent fallback.
