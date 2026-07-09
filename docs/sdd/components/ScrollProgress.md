# SDD — `ScrollProgress`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ScrollProgress.tsx` · `packages/ui-native/src/components/ScrollProgress.tsx` ·
> web CSS `packages/ui/src/styles/components/scrollprogress.css` (`.lk-scrollprogress*`).
> **Exports:** `ScrollProgress`, type `ScrollProgressProps`. _(`ScrollProgressGradient` is defined in-file and used by the prop, but is **not** re-exported by the root index — consumers pass the string union inline.)_
> **Status:** Shipped — the **native twin now exists**. **Parity:** 🟡 same bar & gradients; the API is platform-shaped — web self-tracks window/`target` scroll, **native is controlled** via a required `progress` prop (no DOM scroll model in RN).
> **Stories:** `packages/ui/src/stories/ScrollProgress.stories.tsx` · native equivalent.

---

## 1. Overview

A **fixed top reading-progress bar**. A thin bar pinned to the top of the viewport whose fill **scales horizontally** (`scaleX` 0→1) to track how far the page (or a custom `target` scroll container) has been scrolled. Matches the admin design's `#scrollbar`: fixed, full-width, energy-spectrum gradient with an accent glow.

It exists to give long pages (changelog, docs, marketing, admin) a lightweight "how far through am I" indicator. On web it runs off a **passive scroll listener batched through `requestAnimationFrame`** (one transform write per frame), recomputes on resize, syncs to the current position on mount, and tears everything down on unmount.

The **native twin is controlled**: RN has no document-scroll model, so the host feeds a `progress` (0→1) prop — typically `contentOffset.y / (contentSize.height − layout.height)` from a `ScrollView`'s `onScroll` — and the bar just renders it (gradient fill at `progress×100%` width).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `progress` | `number` (0→1, clamped) | — (**required**) | ✗ | ✓ | **native only** — controlled fill; web computes its own |
| `gradient` | `ScrollProgressGradient` (`'cta' \| 'flux' \| 'mint' \| 'violet'`) | `'cta'` | ✓ | ✓ | bar fill gradient token |
| `height` | `number` | `3` | ✓ | ✓ | bar thickness px |
| `target` | `() => Element \| null` | — | ✓ | — | **web only** — scroll container to track; when it returns an element, that element drives the bar; otherwise the page/window does |
| `className` | `string` | — | ✓ | — | web only — merged onto the bar |
| `style` | `CSSProperties` (web) / `StyleProp<ViewStyle>` (native) | — | ✓ | ✓ | merged after `height` |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>` | — | ✓ | — | web only — spread onto the bar `<div>` |

- **Web:** `'use client'`. `useEffect([target])` wires the listeners; the scroll source is `target?.()` if present else `window`. Progress = `clamp(scrolled / scrollable, 0, 1)`; for the page, `scrolled = window.scrollY`, `scrollable = doc.scrollHeight − window.innerHeight`; for a target, its `scrollTop` / `scrollHeight − clientHeight`.
- **rAF batching:** `scroll` fires `schedule()`, which coalesces to **one** `requestAnimationFrame(compute)` per frame (re-entrancy guarded by a `frame` handle); `compute` writes a single `fill.style.transform = scaleX(progress)`. `resize` re-schedules; mount calls `compute()` once to sync; cleanup cancels the frame and removes both listeners.
- **Native:** an absolute `View` track (`top:0 left:0 right:0`, `zIndex: 50`, `overflow: hidden`, `pointerEvents: "none"`, `accessibilityRole="progressbar"`) whose fill `View` has `width: ${clamp(progress×100)}%` (not `scaleX`) holding a horizontal `expo-linear-gradient` from `gradients[gradient].stops`, pill-rounded right end. No transition/smoothing — it renders exactly what the host feeds.
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

**Verdict: 🟡 — same bar, platform-shaped API.** The native twin exists; both render the same thin
gradient-filled top hairline with the same `gradient` union and `height` default. The scroll model is the real
delta:

- **Data source:** web self-tracks (`window`/`target` scroll + resize, rAF-batched); native has no DOM
  document-scroll, so it's **controlled** — the host passes `progress` from its `ScrollView`'s `onScroll`
  (`contentOffset.y / (contentSize.height − layout.height)`). Same visual, inverted ownership.
- **Fill mechanism:** web `transform: scaleX` + a `0.12s` eased transition (dropped under reduced motion);
  native sets the fill `width`% directly with **no smoothing** (the scroll events themselves are continuous).
- **Positioning:** web `position: fixed`, `z-index: 200`; native `position: absolute` in its screen, `zIndex: 50`.
- **Props:** `target`/`className`/rest are web-only; `progress` is native-only (required).

No gap blocks use — mount the web bar bare, wire the native bar to the screen's scroll.

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

```tsx
// native — controlled from the screen's ScrollView
const [p, setP] = useState(0);
<ScrollProgress progress={p} gradient="flux" />
<ScrollView
  onScroll={(e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setP(contentOffset.y / Math.max(1, contentSize.height - layoutMeasurement.height));
  }}
  scrollEventThrottle={16}
>…</ScrollView>
```

## 7. Accessibility

- **Web:** the bar is `role="progressbar"` with `aria-label="Scroll progress"`. It is **decorative** (a reading-position cue), `pointer-events:none`, and not keyboard-interactive — it should never be the only way to perceive position. It intentionally omits `aria-valuenow` (continuous decorative progress); don't rely on it for assistive announcements.
- **Reduced motion:** honored — the fill keeps tracking but drops the smoothing transition, so there's no animation for motion-sensitive users.

## 8. Usage rules — Do / Don't

**Do**
- Mount one per scroll context (page or a specific container) near the top of the tree.
- Pass `target` (web) when the scroll lives in a nested container; feed `progress` (native) from the screen's `ScrollView` `onScroll`.
- Pick a `gradient` that matches the surface's accent.
- Keep it thin (`height` 3–4) so it reads as a hairline, not a UI bar.

**Don't**
- ✗ Don't pass `progress` on web (self-tracking) or expect self-tracking on native (controlled).
- ✗ Don't mount multiple page-level bars (they'd stack/fight over `position:fixed`).
- ✗ Don't hardcode the gradient/glow — they're tokens (`--grad-*`).
- ✗ Don't treat it as essential UI — it's a decorative progress cue.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** Don't hand-roll a top progress bar with your own scroll listener or gradient `View` — the web bar already batches via rAF and honors reduced motion; the native twin renders the sanctioned track/fill. Import them.
- **New need → both platforms.** A new gradient or a bottom-edge variant lands in both files with the same prop name/tokens — never a one-off.
- **Tokens only.** Gradient + glow come from `@lockin90/tokens`; don't inline a gradient. The `rgba(124,92,255,.6)` glow literal is the accent color and is the single sanctioned hardcode.
- **Parity gate.** On a shared long-scroll screen, confirm web phone-width and native show the same hairline (same gradient/height) — accepting the controlled-vs-self-tracking API delta.
