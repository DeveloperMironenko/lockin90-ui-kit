# SDD — `AuroraBackground`

> **Package:** `@lockin90/ui` (web) — **web-only** primitive. No `@lockin90/ui-native` counterpart.
> **Source:** `packages/ui/src/components/AuroraBackground.tsx` · web CSS `packages/ui/src/styles/components/aurora.css` (`.lk-aurora*`).
> **Exports:** `AuroraBackground`, type `AuroraBackgroundProps`.
> **Status:** Shipped (web only). **Parity:** 🔵 web-only — no native build; see §5 for what native does instead.
> **Stories:** `packages/ui/src/stories/AuroraBackground.stories.tsx` · native: none.

---

## 1. Overview

The **Aurora Flux backdrop** — three drifting, blurred, screen-blended energy-spectrum blobs (indigo → cyan → magenta) over a static four-anchor radial wash, with an optional faint masked grid veil. An `aria-hidden`, `pointer-events: none`, low-z layer that sits **behind** app content.

Drop it in as the first child of the app/page shell (the shell establishes its own stacking context — `position: relative; z-index: 1` for content). It honors `prefers-reduced-motion` (blobs go static, colors stay).

It is **web-only**: there is no `AuroraBackground` in `@lockin90/ui-native` (verified — absent from `packages/ui-native/src/index.ts` and `packages/ui-native/src/components/`).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'subtle' \| 'vivid'` | `'default'` | ✓ | — | blob/grid intensity multiplier |
| `grid` | `boolean` | `true` | ✓ | — | overlay the faint masked grid veil |
| `className` | `string` | — | ✓ | — | merged after the variant classes |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | spread onto root `<div>` |

- The root `<div>` is always `aria-hidden="true"`. `variant` toggles `.lk-aurora-subtle` / `.lk-aurora-vivid`; `default` adds no modifier class.
- Renders exactly three `<span class="lk-aurora-blob">` plus, when `grid`, one `<div class="lk-aurora-grid">`.

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

## 4. States

| State | Web |
| --- | --- |
| Default | base `.lk-aurora` — blobs drift on their 26/30/34s loops |
| Subtle / vivid | `.lk-aurora-subtle` / `.lk-aurora-vivid` adjust both intensity vars |
| No grid | `grid={false}` → grid `<div>` omitted |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → `.lk-aurora-blob { animation: none }` (static, colors kept) |

No hover/focus/disabled — it's a non-interactive decorative layer.

## 5. Web ↔ native parity

**Verdict: 🔵 web-only — genuine capability gap.** There is no native implementation, by design. The effect leans on web-only capabilities that have no cheap React Native equivalent:

- **`mix-blend-mode: screen`** on the blobs (additive light) — RN has no general blend-mode for additive layering.
- **`filter: blur(70px)`** large-radius blurs over the whole viewport — RN's blur is expensive/limited and would tank scroll perf.
- **CSS `-webkit-mask-image` radial mask** on the grid veil — no direct RN analogue.
- **`vw`-sized drifting keyframes** across the viewport.

On native, the Aurora look is achieved at the **app-shell** level with static gradient surfaces / `expo-linear-gradient` washes from `@lockin90/tokens` rather than a drifting-blob layer. Treat `AuroraBackground` as a web-shell decoration; do **not** add a hand-rolled blurred-blob lookalike to native.

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

## 7. Accessibility

- Always `aria-hidden="true"` and `pointer-events: none` — invisible to AT and untouchable, so it never steals focus or pointer events.
- Honors `prefers-reduced-motion` automatically (blobs stop animating) — no extra consumer work.
- Purely decorative: it must never be the only carrier of meaning, and content contrast must be verified against the busiest blob position.

## 8. Usage rules — Do / Don't

**Do**
- Place it once, as the first child of a `position: relative` shell.
- Give content its own `z-index: 1` stacking so it renders above the backdrop.
- Use `subtle` behind dense data screens; `default` for app shells; `vivid` for auth/marketing heroes.
- Set `grid={false}` where the grid veil competes with content.

**Don't**
- ✗ Don't add an `AuroraBackground` lookalike to native — it's intentionally web-only.
- ✗ Don't hardcode the blob colors/opacities — they're driven by `--accent`/`--cyan`/`--magenta` + intensity vars.
- ✗ Don't put interactive content inside it (it's `pointer-events: none`).
- ✗ Don't stack multiple instances — one backdrop per shell.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled blurred-blob/gradient backdrop is a parity & maintenance violation — import `AuroraBackground` on web; on native use the shell's tokenized gradient surfaces.
- **Web-only is intentional.** Do **not** "achieve parity" by porting blurred blobs to native — the native shell expresses Aurora Flux through static gradients (capability gap is documented, not a bug).
- **Tokens only.** Blob/wash colors and intensities trace to `@lockin90/tokens` (`--accent`/`--cyan`/`--magenta`) — hardcoding breaks Aurora-Flux renames.
- **Parity gate.** When a screen uses Aurora on web, confirm the native counterpart's shell carries the equivalent gradient mood (not the same component) so the two platforms still read as one design.
