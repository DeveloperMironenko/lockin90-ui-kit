# SDD — `SplitButton` (+ `SplitButtonVariant` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SplitButton.tsx` · `packages/ui-native/src/components/SplitButton.tsx` ·
> web CSS `packages/ui/src/styles/components/splitbutton.css` (`.lk-split*`).
> **Exports:** `SplitButton`, type `SplitButtonVariant`, type `SplitButtonProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; platform-shaped (web `onClick` ↔ native `onPress`; CSS gradient drift vs static `expo-linear-gradient`).
> **Stories:** `packages/ui/src/stories/SplitButton.stories.tsx` · `packages/ui-native/src/stories/SplitButton.stories.tsx`.

---

## 1. Overview

A **primary action joined to a chevron toggle** that opens a `Menu` of secondary actions — e.g.
`Create page ▾` → New page / Duplicate / Import. The two segments share one rounded group with a hairline
divider between them; the chevron reuses the shared `Menu` for the dropdown panel + outside-close.

Two variants via `SplitButtonVariant`:
- `primary` (default) — the **energy-gradient CTA** (`grad-cta`, violet→cyan) with glow, matching `Button`'s
  primary. The dark-on-bright label color (`#0A0A12`) is shared with `Button`.
- `default` — neutral glass surface with a hairline border.

Reach for it when one main action has a small cluster of related variants (save-and-…, create-as-…) in
CMS/admin editors. For a single action use `Button`; for a pure menu use `Menu`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | — (required) | ✓ | ✓ | primary segment label (left) |
| **primary action** | `() => void` | — | `onClick` | `onPress` | **platform-shaped** — fired by the wide left segment |
| `items` | `MenuItemData[]` | — (required) | ✓ | ✓ | secondary actions in the chevron `Menu` |
| `variant` | `'primary' \| 'default'` | `'primary'` | ✓ | ✓ | identical union both sides |
| `icon` | `ReactNode` | — | ✓ | ✓ | optional leading glyph on the primary segment |
| `className` | `string` | — | ✓ | — | web only |

- `SplitButtonVariant = 'primary' | 'default'`.
- The chevron segment is a `Menu` with `align="right"`, triggered by an `Icon name="chevron"` (size 13).
- No `forwardRef`/rest spread on either side — it's a composed group, not a single element.

## 3. Visual spec (tokens — never hardcode)

| Aspect | `primary` | `default` |
| --- | --- | --- |
| Group | `--r-sm` radius; web `--glow-accent` / native `nativeShadows.glowAccent` | `1px --border` / `colors.border` |
| Main bg | `--grad-cta` / `gradients.cta` (`LinearGradient` start `{0,0}`→end `{1,1}`) | `--glass-2` / `colors.glass2` |
| Label color | `#0A0A12` (dark-on-bright, both platforms) | `--text` / `colors.text` |
| Divider | `rgba(0,0,0,.22)` (web `border-left` / native `View`) | `--border` / `colors.border` |
| Chevron color | `#0A0A12` | `--text-dim` / `colors.textDim` |

- **Main padding:** web `8px / 14px`, native `9 / 14`; label `--font-ui` 600, `13px`; icon gap `8`.
- **Chevron segment:** `30px` wide, centered; web reuses `.lk-menu-trigger` with a `1px` left border; native
  rotates the right-pointing `chevron` icon `90°` to point down.
- **Web-only motion:** `primary` runs `@keyframes lk-btn-flow` (6s gradient-position drift, `160% 160%`
  background-size) and `hover filter:brightness(1.06)`; `default` hover = `color-mix(--accent 14%, --glass-2)`.
  Native press feedback = `opacity .85` on the primary segment (no gradient animation — matches `Button`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-split` group | `View` group |
| Primary idle | animated `--grad-cta` + `--glow-accent` | static `gradients.cta` + `glowAccent` |
| Hover | main/chevron `filter:brightness(1.06)`; default → accent `color-mix` | n/a (no hover) |
| Pressed | `:active` via the inner controls | `pressed` → `opacity .85` on main |
| Menu open | `Menu` panel (portaled) right-aligned, outside-click close | `Menu` modal panel right-aligned |
| Icon | optional leading glyph (`.lk-split-icon` 15px svg) | optional leading glyph `View` |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Identical variant union, label, items, icon, group shape,
divider, dark-on-gradient label color, and the `Menu`-powered chevron. Differences are substrate-only:

- **Primary callback:** web `onClick` vs native `onPress` — the one intentional API difference (same role,
  same call site shape).
- **Gradient:** web CSS `--grad-cta` with animated `background-position` (`lk-btn-flow`, 6s); native
  `expo-linear-gradient` `gradients.cta.stops` (`{0,0}`→`{1,1}`), no animation — identical to `Button`'s
  documented trade-off.
- **Hover:** web-only `brightness`/`color-mix`; native uses `pressed` opacity instead.
- **Web-only `className`.**

No capability gap — fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Composes:** `Menu` (`MenuItemData[]` dropdown + outside-close) and `Icon` (`chevron`, optional leading
  glyph). Shares the gradient/label conventions with `Button`.
- **Used by:** CMS/admin editor headers (create/save split actions), bulk-action bars.

```tsx
// web
<SplitButton
  label="Create page"
  onClick={createPage}
  items={[{ label: 'Duplicate', onSelect: dup }, { label: 'Import', onSelect: imp }]}
/>

// native
<SplitButton
  label="Create page"
  onPress={createPage}
  variant="default"
  items={[{ label: 'Duplicate', onSelect: dup }, { label: 'Import', onSelect: imp }]}
/>
```

## 7. Accessibility

- **Web:** the primary is a real `<button type="button">`; the chevron is the `Menu` trigger (its own
  button + listbox semantics). Provide descriptive `label` and `items` labels.
- **Native:** the primary is a `Pressable`; the chevron is the `Menu`'s `Pressable` trigger. Icon-only
  leading glyphs should be decorative — the `label` carries the action name.
- **Contrast:** `primary` uses `#0A0A12` on the bright gradient (meets contrast on every stop, matching
  `Button`); the chevron divider is a dark hairline so the join reads on the gradient.

## 8. Usage rules — Do / Don't

**Do**
- Use when one main action has a small set of related secondary actions.
- Keep the primary the most-common action; put the rest in `items`.
- Use `variant="primary"` for the one prominent split CTA on a surface; `default` otherwise.

**Don't**
- ✗ Don't pass `onClick` on native or `onPress` on web (wrong-platform prop).
- ✗ Don't overload `items` into a deep menu — that's a `Menu`, not a SplitButton.
- ✗ Don't place multiple `primary` SplitButtons/Buttons in one decision context.
- ✗ Don't hardcode the gradient, glow, divider, or label color — tokens only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-joined Button + chevron Menu that re-creates the gradient/glow group is a parity
  violation — import `SplitButton` (and it shares `Button`'s gradient tokens, so it can't drift).
- **New variant → both platforms.** A new `SplitButtonVariant` must be added on web **and** native with the
  same tokens — never a one-off.
- **Tokens only.** Gradient `--grad-cta`, glow `--glow-accent`, glass `--glass-2`, label `#0A0A12` (the shared
  dark-on-bright constant). The `rgba(0,0,0,.22)` divider is the shared on-gradient hairline.
- **Parity gate.** Confirm web phone-width and native renders match (variant, label, icon, menu alignment)
  before shipping.
