# SDD — `Skeleton`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Skeleton.tsx` · `packages/ui-native/src/components/Skeleton.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-skeleton`, `@keyframes lk-shimmer`).
> **Exports:** `Skeleton`, type `SkeletonProps`.
> **Status:** Shipped. **Parity:** 🟡 same sizing API; **web** shimmers (sweeping highlight), **native** is a static glass fill (no shimmer).
> **Stories:** `packages/ui/src/stories/Skeleton.stories.tsx` · native equivalent.

---

## 1. Overview

A **placeholder block** for loading states — a glass-filled rectangle sized to stand in for incoming content.
On web a soft highlight sweeps across it (`lk-shimmer`) to signal "loading"; on native it's the same glass block
but **static** (wrap with your own `Animated` shimmer if a moving cue is needed). Three sizing props:
`width`, `height`, `radius`.

Build skeletons by composing several `Skeleton`s into the shape of the real content (a title bar, a few text
lines, an avatar circle) — there is no `SkeletonList`/variant component; you assemble them.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `width` | web `number \| string` / native `DimensionValue` | — (auto) | ✓ | ✓ | block width (px or `%`/`auto`) |
| `height` | web `number \| string` / native `DimensionValue` | `14` | ✓ | ✓ | block height |
| `radius` | web `number \| string` / native `number` | web — (CSS `--r-sm`) / native `radii.sm` | ✓ | ✓ | corner radius |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only; merged last |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | spread onto root |

- **Web:** `<div className="lk-skeleton …" style={{ width, height, borderRadius: radius, ...style }} {...rest} />`
  — `width`/`height`/`radius` are applied inline; the shimmer + base fill come from `.lk-skeleton`.
- **Native:** `<View style={[{ width, height, borderRadius: radius, backgroundColor: colors.glass }, style]}
  {...rest} />` — sizing + fill inline; `radius` **defaults to `radii.sm` (10)**.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`.lk-skeleton`) | Native (inline) |
| --- | --- | --- |
| Fill | `background: var(--glass)` | `colors.glass` |
| Radius (default) | `border-radius: var(--r-sm)` (overridable inline) | `radii.sm` (10) |
| Default height | `14` px (component default) | `14` |
| Overflow | `overflow: hidden` (clips the sweep) | n/a |
| Shimmer | `::after` — `linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent)`, `translateX(-100% → 100%)`, `@keyframes lk-shimmer` 1.6s infinite | **none** (static) |

`--glass` is `rgba(255,255,255,.045)`; `--r-sm` is 10. The shimmer highlight (`rgba(255,255,255,.08)`) is the
only non-token literal and is web-CSS-internal.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default (loading) | glass fill + sweeping shimmer | static glass fill |
| Sized | inline `width`/`height`/`radius` | inline `width`/`height`/`radius` |
| Hover / focus / press | none (presentational) | none |
| Reduced motion | shimmer continues (no `prefers-reduced-motion` guard on `lk-shimmer`) | static (no motion) |

`Skeleton` has no real "states" beyond present/absent — it's swapped out for content once loaded.

## 5. Web ↔ native parity

**Verdict: 🟡 — same sizing API, animation is web-only.** `width`/`height`/`radius` and the `--glass` fill are
identical in intent. Differences:

- **Shimmer:** web sweeps a highlight via `::after` + `lk-shimmer` (1.6s); native renders a **static** glass
  block (the source notes "wrap with an Animated shimmer if desired"). The loading **cue moves** on web and is
  steady on native — documented, accepted, **not blocking**.
- **`radius` default:** web leaves `radius` undefined → falls back to the CSS `--r-sm`; native defaults the prop
  to `radii.sm` (same 10px result via different paths).
- **Type of sizing values:** web accepts `number | string` (px or `%`); native accepts RN `DimensionValue`
  (`number`, `'50%'`, `'auto'`). `radius` is `number | string` on web, `number` on native.

No capability gap — both render an equivalently-sized glass placeholder; only the shimmer is web-only.

## 6. Composition & usage

- **Used in:** any loading state — dashboard cards, list rows, detail panels — assembled into the rough shape of
  the real content.
- **Composes from:** nothing — a leaf. Stack several with your own layout to mirror the loaded UI.

```tsx
// web — a loading card
<div style={{ display: 'grid', gap: 8 }}>
  <Skeleton width={120} height={12} />
  <Skeleton width="100%" height={28} radius={10} />
  <Skeleton width="60%" height={12} />
</div>

// native
<View style={{ gap: 8 }}>
  <Skeleton width={120} height={12} />
  <Skeleton width="100%" height={28} radius={10} />
</View>
```

## 7. Accessibility

- **Web:** the placeholder is decorative (`<div>`, no role). Announce loading at the **region** level (e.g. an
  `aria-busy="true"` / `role="status"` container) rather than per-skeleton — a screen reader shouldn't read each
  block. Pass such attributes via `...rest`/the wrapper.
- **Native:** the `<View>` carries no accessibility info; mark the loading region with `accessibilityState={{ busy: true }}` /
  an `accessibilityLabel` ("Loading") on the container.
- **Motion sensitivity:** the web shimmer has no reduced-motion guard — gate it at the app level if a screen must
  respect `prefers-reduced-motion`.

## 8. Usage rules — Do / Don't

**Do**
- Compose multiple `Skeleton`s into the shape/footprint of the real content so the layout doesn't jump on load.
- Size with `width`/`height`/`radius`; match the loaded element's dimensions.
- Announce the loading state at the container (`aria-busy`/`role="status"` web, `accessibilityState` native).

**Don't**
- ✗ Don't hardcode the glass fill or radius — they're tokens (`--glass`/`colors.glass`, `--r-sm`/`radii.sm`).
- ✗ Don't rely on a moving shimmer on native (it's static) — wrap with `Animated` yourself if required.
- ✗ Don't read each skeleton to screen readers — mark the region busy instead.
- ✗ Don't build a bespoke shimmer block — import `Skeleton`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled gray loading box re-creates `Skeleton` and will drift from the glass fill /
  shimmer — import it.
- **New need → add to BOTH platforms.** If native needs an animated shimmer, **add it to the native component**
  (e.g. an `Animated` overlay) — same API, same tokens — never a one-off in app code as the permanent solution.
- **Tokens only.** `--glass`/`colors.glass` and `--r-sm`/`radii.sm` are the source of truth; hardcoded grays are
  bugs.
- **Parity gate.** Before shipping, diff web phone-width vs native — same block sizes + radius + fill — and accept
  that the shimmer animation is web-only.
