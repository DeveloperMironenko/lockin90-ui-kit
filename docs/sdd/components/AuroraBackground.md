# SDD — `AuroraBackground`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/AuroraBackground.tsx` · `packages/ui-native/src/components/AuroraBackground.tsx` ·
> web CSS `packages/ui/src/styles/components/aurora.css` (`.lk-aurora*`).
> **Exports:** `AuroraBackground`, type `AuroraBackgroundProps`.
> **Status:** Shipped — the **native twin now exists**. **Parity:** 🟡 same `variant`/`grid` API & drifting-blob look; native swaps CSS `blur`/`mix-blend-mode` for SVG radial-gradient falloff, adds a `still` prop, and drops `className`/rest.
> **Stories:** `packages/ui/src/stories/AuroraBackground.stories.tsx` · native equivalent.

---

## 1. Overview

The **Aurora Flux backdrop** — three drifting, blurred, screen-blended energy-spectrum blobs (indigo → cyan → magenta) over a static four-anchor radial wash, with an optional faint masked grid veil. An `aria-hidden`, `pointer-events: none`, low-z layer that sits **behind** app content.

Drop it in as the first child of the app/page shell (the shell establishes its own stacking context — `position: relative; z-index: 1` for content). Web honors `prefers-reduced-motion` (blobs go static, colors stay); native exposes a `still` prop instead.

The **native twin** renders the same idea without CSS filters: an absolute-fill `View` (`colors.void` base) holding a static SVG radial **wash** (violet → cyan → transparent), three drifting SVG **radial-gradient blob** circles (soft edges from gradient falloff, not blur) animated via `Animated` translate loops, and an optional SVG **grid veil** with a radial fade.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'subtle' \| 'vivid'` | `'default'` | ✓ | ✓ | blob/grid intensity multiplier |
| `grid` | `boolean` | `true` | ✓ | ✓ | overlay the faint grid veil |
| `still` | `boolean` | `false` | ✗ | ✓ | **native only** — disable blob drift (web uses `prefers-reduced-motion` instead) |
| `className` | `string` | — | ✓ | — | web only — merged after the variant classes |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only — spread onto root `<div>` |

- The web root `<div>` is always `aria-hidden="true"`. `variant` toggles `.lk-aurora-subtle` / `.lk-aurora-vivid`; `default` adds no modifier class. Renders exactly three `<span class="lk-aurora-blob">` plus, when `grid`, one `<div class="lk-aurora-grid">`.
- The native root is an absolute-fill `View` (`pointerEvents="none"`, accessibility-hidden, `backgroundColor: colors.void`), measured via `onLayout`; `variant` resolves to an intensity scalar (`subtle 0.55` / `default 0.78` / `vivid 1`).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Value (`aurora.css`) |
| --- | --- |
| Root | `position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none` |
| Intensity vars | `--lk-aurora-i` (blob opacity) + `--lk-aurora-g` (grid opacity) |
| Static wash (`::before`) | 4 radial gradients in `--accent`/`--cyan`/`--magenta`(`#ff3d81`)/`--mint` at `.20/.16/.12/.12` alpha, `opacity: var(--lk-aurora-i)` |
| Blobs | `border-radius: 50%`, `filter: blur(70px)`, `mix-blend-mode: screen`, `opacity: var(--lk-aurora-i)`, `will-change: transform` |
| Blob 1 | `46vw`, `--accent` (`#7c5cff`), `lk-aurora-drift1` 26s |
| Blob 2 | `40vw`, `--cyan` (`#22d3ee`), `lk-aurora-drift2` 30s |
| Blob 3 | `44vw`, `--magenta` (`#ff3d81`), `lk-aurora-drift3` 34s |
| Grid veil | two 1px white `rgba(255,255,255,.025)` line gradients, `56px` cells, radial mask fading toward bottom, `opacity: var(--lk-aurora-g)` |

**Variant intensities:**

| Variant | `--lk-aurora-i` | `--lk-aurora-g` |
| --- | --- | --- |
| `default` | `0.5` | `0.5` |
| `subtle` | `0.3` | `0.32` |
| `vivid` | `0.72` | `0.62` |

- Blob colors fall back to literals via `var(--accent, #7c5cff)` etc. so the layer renders even without the token sheet loaded.

**Native values** (same palette, SVG substrate): wash = `RadialGradient` violet `#7C5CFF` → cyan `#22D3EE` → transparent (2-color vs web's 4-anchor wash); blobs = `Circle`s filled with radial gradients — `#7C5CFF` (r 0.62, 17s), `#22D3EE` (r 0.54, 21s), `#FF3D81` (r 0.66, 25s) — drifting via `Animated` translate loops (`Easing.inOut(sin)`, `useNativeDriver: true`; web loops are 26/30/34s); grid veil = SVG lines at 40px step, `rgba(255,255,255,0.03×intensity)` with a radial fade (web: 56px CSS cells + mask). **No blur filter** — soft edges come from the gradient falloff.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | base `.lk-aurora` — blobs drift on their 26/30/34s loops | blobs drift on 17/21/25s `Animated` loops |
| Subtle / vivid | `.lk-aurora-subtle` / `.lk-aurora-vivid` adjust both intensity vars | intensity scalar 0.55 / 1 |
| No grid | `grid={false}` → grid `<div>` omitted | `grid={false}` → `GridVeil` omitted |
| Still / reduced motion | `@media (prefers-reduced-motion: reduce)` → `.lk-aurora-blob { animation: none }` (static, colors kept) | `still` → blobs render static (no OS hook) |

No hover/focus/disabled — it's a non-interactive decorative layer.

## 5. Web ↔ native parity

**Verdict: 🟡 — same API & drifting-blob mood, platform-shaped substrate.** The native twin exists and shares
`variant`/`grid`, the three-blob + wash + grid composition, and the same spectrum palette. By-necessity deltas:

- **Soft edges:** web `filter: blur(70px)` + `mix-blend-mode: screen`; native has neither, so blobs are SVG
  **radial-gradient circles** whose falloff supplies the softness (no blur pass — scroll-perf safe).
- **Motion opt-out:** web honors `prefers-reduced-motion`; native exposes **`still`** (no OS hook).
- **Timings/values:** blob loops 17/21/25s (native) vs 26/30/34s (web); wash 2-color vs 4-anchor; grid 40px SVG
  lines vs 56px masked CSS cells; intensity is a scalar (0.55/0.78/1) vs the `--lk-aurora-i`/`--lk-aurora-g` var pairs.
- **Props:** native adds `style`, drops `className`/rest.

Ambient-decoration deltas only; the two shells read as one design.

## 6. Composition & usage

- **Where:** the very first child of an app/page shell; the shell wraps real content in a `position: relative; z-index: 1` container so it layers above this `z-index: 0` backdrop.
- **Composes:** nothing — pure CSS layer.

```tsx
// web — app shell
<div className="app-shell" style={{ position: 'relative' }}>
  <AuroraBackground variant="subtle" />
  <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
</div>

// auth / marketing hero — louder
<AuroraBackground variant="vivid" grid={false} />
```

```tsx
// native — first child of the screen; freeze for screenshots/reduced motion
<View style={{ flex: 1 }}>
  <AuroraBackground variant="subtle" still={reduceMotion} />
  <View style={{ flex: 1 }}>{children}</View>
</View>
```

## 7. Accessibility

- Always hidden from AT and untouchable (web `aria-hidden` + `pointer-events: none`; native accessibility-hidden + `pointerEvents="none"`) — it never steals focus or pointer events.
- Web honors `prefers-reduced-motion` automatically; **native needs `still`** wired to the app's reduced-motion setting.
- Purely decorative: it must never be the only carrier of meaning, and content contrast must be verified against the busiest blob position.

## 8. Usage rules — Do / Don't

**Do**
- Place it once, as the first child of a `position: relative` shell.
- Give content its own `z-index: 1` stacking so it renders above the backdrop.
- Use `subtle` behind dense data screens; `default` for app shells; `vivid` for auth/marketing heroes.
- Set `grid={false}` where the grid veil competes with content.

**Don't**
- ✗ Don't hand-roll a blob backdrop on either platform — import the kit component (the native twin exists now).
- ✗ Don't hardcode the blob colors/opacities — they're driven by `--accent`/`--cyan`/`--magenta` + intensity vars.
- ✗ Don't put interactive content inside it (it's `pointer-events: none`).
- ✗ Don't stack multiple instances — one backdrop per shell.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled blurred-blob/gradient backdrop is a parity & maintenance violation — import `AuroraBackground` on **both** platforms.
- **Don't force blur onto native.** The native twin's gradient-falloff blobs are the sanctioned substrate — don't bolt an `expo-blur` pass onto it "for parity"; the documented deltas in §5 are the contract.
- **Tokens only.** Blob/wash colors and intensities trace to `@lockin90/tokens` (`--accent`/`--cyan`/`--magenta`) — hardcoding breaks Aurora-Flux renames.
- **Parity gate.** When a screen uses Aurora on web, confirm the native counterpart mounts the native twin with the same `variant`/`grid` so the two platforms read as one design (accepting the §5 substrate deltas).
