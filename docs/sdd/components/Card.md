# SDD — `Card`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Card.tsx` · `packages/ui-native/src/components/Card.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-card*`).
> **Exports:** `Card`, type `CardProps`.
> **Status:** Shipped. **Parity:** 🟡 same core surface; web adds `hover`/`tone`/`variant` + real `backdrop-filter`, native adds an optional `blur` peer.
> **Stories:** `packages/ui/src/stories/Card.stories.tsx` · `packages/ui-native/src/stories/Card.stories.tsx`.

---

## 1. Overview

The **glassmorphism panel** — the base surface for almost everything in the kit (KPI cards, list containers, modals' bodies, settings rows). A translucent fill + hairline border + elevation shadow, rounded to `--r` (16px). Most composite primitives (`InsightCard`, `PricingTierCard`, `PendingPatternCard`) are `Card`s with content baked in.

Modifiers, all additive:

- `pad` — `none | sm | md | lg` (16 / 22 / 30px); default surface padding is 22px. `padLg` is shorthand for `pad="lg"`.
- `lit` — a gradient hairline (violet→cyan) on the top edge; marks a "live"/primary card.
- `hover` (web only) — lift + glow on pointer hover.
- `flat` — drops the elevation shadow.
- `tone` (web only) — `warn` (amber) / `danger` (red) tinted border + subtle bg for status panels.
- `variant` (web only) — `dashed` (an add/connect action card) / `ghost` (borderless transparent surface).

It is the *only* sanctioned glass surface; hand-rolling a glass panel is a parity violation (see §9).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `pad` | `'none' \| 'sm' \| 'md' \| 'lg'` | (22px) | ✓ | ✓ | overrides the default 22px padding |
| `padLg` | `boolean` | `false` | ✓ | ✓ | shorthand for `pad="lg"` (30px) |
| `lit` | `boolean` | `false` | ✓ | ✓ | gradient hairline on the top edge |
| `flat` | `boolean` | `false` | ✓ | ✓ | drop the elevation shadow |
| `hover` | `boolean` | `false` | ✓ | — | **web only** — lift + glow on hover (no pointer on native) |
| `tone` | `'warn' \| 'danger'` | — | ✓ | — | **web only** — tinted status surface |
| `variant` | `'ghost' \| 'dashed'` | — | ✓ | — | **web only** — borderless / dashed action card |
| `blur` | `boolean` | `false` | — | ✓ | **native only** — real frosted blur via the optional `expo-blur` peer |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | `onClick`/`onPress`, `id`, `children`, etc. |

- **Web:** `forwardRef<HTMLDivElement>`; renders a `<div>` that spreads all HTML attrs.
- **Native:** renders a `<View>` (or `OptionalBlurView` when `blur` is set and the `expo-blur` peer resolves); `children` rendered after the optional `lit` overlay.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Background | `--glass` | `colors.glass` |
| Border | `1px --border` | `1px colors.border` |
| Radius | `--r` (16) | `radii.md` (16) |
| Shadow | `--elev-1` | `nativeShadows.elev1` |
| Blur | `backdrop-filter: blur(16px) saturate(120%)` | none by default; `blur` → `OptionalBlurView` intensity 24, tint `dark` |
| Padding | `22px` (`sm` 16 / `md` 22 / `lg` 30) | `22` (`sm` 16 / `md` 22 / `lg` 30) |
| Transition | `transform/border-color/box-shadow .4s --ease` | n/a |

- **`lit` hairline:** web `::before` inset by `--r`, `linear-gradient(90deg, transparent, rgba(124,92,255,.7), rgba(34,211,238,.7), transparent)`, 1px. Native renders an absolute 1px bar, `colors.accent` at opacity 0.6, clipped to the top corners — a solid accent line (no gradient).
- **`tone` (web):** `warn` = `color-mix(--warn 42%, transparent)` border + `color-mix(--warn 7%, --glass)` bg; `danger` uses `--bad` at 42% / 8%.
- **`variant` (web):** `dashed` = transparent, `2px dashed --border-2`, no shadow, centered column, `--text-dim` (hover → `--accent`); `ghost` = transparent bg + border, no blur, no shadow.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-card` glass + `--elev-1` | base `<View>` glass + `elev1` |
| Hover | `hover` → `translateY(-4px)`, `border-color --border-2`, `box-shadow --elev-2` | n/a (no hover) |
| Flat | `.lk-flat` → `box-shadow: none` | `flat` → `shadowOpacity 0, elevation 0` |
| Lit | `.lk-lit::before` gradient hairline | absolute accent bar @ 0.6 |
| Dashed (action) | `:hover` → accent border + tinted bg | n/a |
| Pressed | n/a (use a `Pressable` wrapper) | n/a (use a `Pressable` wrapper) |

`Card` is not interactive by itself — wrap it (web `onClick`, native `Pressable`) for actions.

## 5. Web ↔ native parity

**Verdict: 🟡 same core surface, platform-shaped extras.** The base contract — glass fill, hairline border, `--r` radius, `--elev-1` shadow, the `pad`/`padLg`/`lit`/`flat` props — is identical on both platforms. The divergences are platform-shaped enhancements, none of which blocks use:

- **`hover` (web only):** pointer-driven lift+glow; native has no hover. Express touch feedback via a wrapping `Pressable` instead.
- **`tone` + `variant` (web only):** status-tinted (`warn`/`danger`) and `dashed`/`ghost` action surfaces are not yet on native. If a native screen needs them, **add the props to the native `Card` first** (same names/tokens) — don't fork a local panel.
- **Blur:** web has real `backdrop-filter` glass; native genuinely **cannot** do `backdrop-filter` (RN limitation) and approximates glass with the translucent `--glass`/`colors.glass` fill, optionally upgrading to a true frosted `OptionalBlurView` when the `blur` prop is set and the `expo-blur` peer is installed.

## 6. Composition & usage

- **Composes:** `OptionalBlurView` (native, optional `expo-blur`).
- **Composed by:** `InsightCard`, `PricingTierCard`, `PendingPatternCard`, `EmptyState`, modal bodies, KPI grids, settings rows — anywhere a panel is needed.
- **Used by:** nearly every screen surface across `lockin90-frontend` / `lockin90-mobile` / `lockin90-admin`.

```tsx
// web
<Card lit pad="lg">…</Card>
<Card hover onClick={open}>…</Card>
<Card tone="danger">Account flagged</Card>
<Card variant="dashed" onClick={connect}>+ Connect a source</Card>

// native
<Card lit pad="lg">…</Card>
<Card blur>…</Card>          {/* frosted, needs expo-blur peer */}
<Pressable onPress={open}><Card>…</Card></Pressable>
```

## 7. Accessibility

- **Web:** a plain `<div>` — semantically neutral. When the card is the click target, pass `role="button"`, `tabIndex={0}`, and a key handler, or wrap a real `<button>`/`<a>` around the content rather than making the div clickable silently.
- **Native:** a `<View>` — wrap in `Pressable` with `accessibilityRole="button"`/`accessibilityLabel` for tap targets.
- **Contrast:** `tone` surfaces keep their tinted text/border within AA against the void background; don't lower the tint opacity.

## 8. Usage rules — Do / Don't

**Do**
- Use `Card` for every glass panel; pick `pad` over ad-hoc margins.
- Use `lit` to mark the one primary/live card on a surface.
- Use `tone="warn"|"danger"` (web) for status panels instead of hand-tinting.
- Wrap in a real button/`Pressable` when the whole card is clickable.

**Don't**
- ✗ Don't hand-roll a glass panel (`background: rgba(...)` + border + blur) — import `Card`.
- ✗ Don't hardcode the padding, radius, border, or shadow — they come from tokens.
- ✗ Don't rely on `hover`/`tone`/`variant` on native (web-only today) — add them to native first if needed.
- ✗ Don't nest a `Card` inside a `Card` for visual weight — use `pad`/`lit`/`flat` modifiers.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom panel" re-creating the glass fill + hairline + `--elev-1` is a parity violation — it will drift from `Card` and the Aurora Flux token renames will silently break it.
- **New need → add to BOTH platforms.** A new surface treatment (e.g. native `tone`) is a new `Card` prop on web *and* native — same name, same tokens — never a one-off component.
- **Tokens only.** Any color/space/radius/shadow not sourced from `@lockin90/tokens` is a bug even if it looks identical today.
- **Parity gate.** Before shipping a screen, confirm the web phone-width card and the native card read identically (same pad, lit, flat); flag any reliance on a web-only modifier that native lacks.
