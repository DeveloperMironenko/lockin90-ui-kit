# SDD — `ScrollProgress`

> **Package:** `@lockin90/ui` (web) — **web-only** root export. No native twin.
> **Source:** `packages/ui/src/components/ScrollProgress.tsx` · web CSS `packages/ui/src/styles/components/scrollprogress.css` (`.lk-scrollprogress*`).
> **Exports:** `ScrollProgress`, type `ScrollProgressProps`. _(`ScrollProgressGradient` is defined in-file and used by the prop, but is **not** re-exported by the root index — consumers pass the string union inline.)_
> **Status:** Shipped (web). **Parity:** 🔵 web-only — depends on `position:fixed` + window/document scroll, which have no RN equivalent (see §5).
> **Stories:** `packages/ui/src/stories/ScrollProgress.stories.tsx`.

---

## 1. Overview

A **fixed top reading-progress bar**. A thin bar pinned to the top of the viewport whose fill **scales horizontally** (`scaleX` 0→1) to track how far the page (or a custom `target` scroll container) has been scrolled. Matches the admin design's `#scrollbar`: fixed, full-width, energy-spectrum gradient with an accent glow.

It exists to give long pages (changelog, docs, marketing, admin) a lightweight "how far through am I" indicator. It runs off a **passive scroll listener batched through `requestAnimationFrame`** (one transform write per frame), recomputes on resize, syncs to the current position on mount, and tears everything down on unmount.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `gradient` | `ScrollProgressGradient` (`'cta' \| 'flux' \| 'mint' \| 'violet'`) | `'cta'` | ✓ | — | bar fill gradient token |
| `height` | `number` | `3` | ✓ | — | bar thickness px |
| `target` | `() => Element \| null` | — | ✓ | — | scroll container to track; when it returns an element, that element drives the bar; otherwise the page/window does |
| `className` | `string` | — | ✓ | — | merged onto the bar |
| `style` | `CSSProperties` | — | ✓ | — | merged after `height` |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>` | — | ✓ | — | spread onto the bar `<div>` |

- **Web:** `'use client'`. `useEffect([target])` wires the listeners; the scroll source is `target?.()` if present else `window`. Progress = `clamp(scrolled / scrollable, 0, 1)`; for the page, `scrolled = window.scrollY`, `scrollable = doc.scrollHeight − window.innerHeight`; for a target, its `scrollTop` / `scrollHeight − clientHeight`.
- **rAF batching:** `scroll` fires `schedule()`, which coalesces to **one** `requestAnimationFrame(compute)` per frame (re-entrancy guarded by a `frame` handle); `compute` writes a single `fill.style.transform = scaleX(progress)`. `resize` re-schedules; mount calls `compute()` once to sync; cleanup cancels the frame and removes both listeners.
- `ScrollProgressGradient` is the file's type for the union; it isn't a root export, so callers just pass `gradient="flux"` etc.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Value |
| --- | --- | --- |
| Position | `position:fixed; top:0; left:0; width:100%` | `z-index:200`, `pointer-events:none`, `overflow:hidden` |
| Track | `background:transparent` | the rail itself is invisible; only the fill paints |
| Height | inline `height` (default `3px`) | bar thickness |
| Fill | `transform:scaleX(0)`, `transform-origin:0 50%`, `will-change:transform` | scales L→R |
| Fill gradient | `--grad-cta` (default) · `--grad-flux` · `--grad-mint` · `--grad-violet` via `.lk-scrollprogress--{name}` | energy spectrum |
| Glow | `box-shadow: 0 0 10px rgba(124,92,255,.6)` | accent (`#7C5CFF`) glow |
| Smoothing | `transition: transform 0.12s var(--ease)` | eased fill |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → `transition:none` | still updates, no smoothing |

- The component is `role="progressbar"`; the fill is the only painted element (transparent track), so it floats as a hairline over page content.

## 4. States

| State | Web |
| --- | --- |
| Top of page | fill `scaleX(0)` (empty) |
| Scrolling | fill `scaleX(progress)`, eased over `0.12s` |
| Bottom | fill `scaleX(1)` (full) |
| Resize | recomputes scrollable height + re-syncs |
| Reduced motion | fill still tracks, transition dropped (no smoothing) |
| Hover / focus / disabled | none — `pointer-events:none`, non-interactive |

## 5. Web ↔ native parity

**Verdict: 🔵 web-only — genuine capability gap.** There is **no** `ScrollProgress` in `@lockin90/ui-native`: no native file, not exported from the native index.

Why it's web-only (not just unported):

- It relies on `position: fixed` over the viewport, `window.scrollY` / `document.documentElement.scrollHeight`, and DOM `scroll`/`resize` events — none of which exist in React Native. The DOM document-scroll model has no RN analogue.
- **Native equivalent (if ever needed):** a separate component driven by a `ScrollView`'s `onScroll` + an `Animated` width/scaleX, absolutely positioned at the top of the screen — a different implementation, intentionally not the same component. It would need its own SDD.

This is a hard platform gap; native screens must not assume a `ScrollProgress` import.

## 6. Composition & usage

- **Composes from:** nothing (primitive) — pure DOM + rAF.
- **Used by (web):** long scroll pages — changelog, docs/SDD viewers, marketing long-reads, admin pages with a global top bar.

```tsx
// web — page scroll
<ScrollProgress gradient="flux" />

// web — track a specific scroll container
<ScrollProgress
  gradient="cta"
  height={4}
  target={() => document.querySelector('#article-scroll')}
/>
```

## 7. Accessibility

- **Web:** the bar is `role="progressbar"` with `aria-label="Scroll progress"`. It is **decorative** (a reading-position cue), `pointer-events:none`, and not keyboard-interactive — it should never be the only way to perceive position. It intentionally omits `aria-valuenow` (continuous decorative progress); don't rely on it for assistive announcements.
- **Reduced motion:** honored — the fill keeps tracking but drops the smoothing transition, so there's no animation for motion-sensitive users.

## 8. Usage rules — Do / Don't

**Do**
- Mount one per scroll context (page or a specific container) near the top of the tree.
- Pass `target` when the scroll lives in a nested container, not the window.
- Pick a `gradient` that matches the surface's accent.
- Keep it thin (`height` 3–4) so it reads as a hairline, not a UI bar.

**Don't**
- ✗ Don't import `ScrollProgress` in native code — it doesn't exist there (web-only).
- ✗ Don't mount multiple page-level bars (they'd stack/fight over `position:fixed`).
- ✗ Don't hardcode the gradient/glow — they're tokens (`--grad-*`).
- ✗ Don't treat it as essential UI — it's a decorative progress cue.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** Don't hand-roll a fixed top bar with your own scroll listener — `ScrollProgress` already batches via rAF, handles resize/teardown, and honors reduced motion. Import it.
- **Native need → a deliberate native component.** If native ever needs a reading-progress bar, build a `ScrollView`-driven one with its own SDD; do not pretend this DOM-scroll component is cross-platform.
- **Tokens only.** Gradient + glow come from `@lockin90/tokens`; don't inline a gradient. The `rgba(124,92,255,.6)` glow literal is the accent color and is the single sanctioned hardcode.
- **Parity note.** Any cross-platform page that uses `ScrollProgress` must accept that the native counterpart simply won't show this affordance (or needs its own component) — don't assume parity.
