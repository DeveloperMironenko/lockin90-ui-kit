# SDD — `ProgressBar` (+ `BarFill` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ProgressBar.tsx` · `packages/ui-native/src/components/ProgressBar.tsx` ·
> web CSS `packages/ui/src/styles/components/progressbar.css` (`.lk-progressbar*`).
> **Exports:** `ProgressBar`, type `ProgressBarProps`.
> **Status:** Shipped. **Parity:** 🟡 same modes & look; the **`gradient` prop type differs** (web `string` / CSS gradient · native `[from, to]` tuple), and the indeterminate sweep is CSS-keyframes (web) vs `Animated` (native).
> **Stories:** `packages/ui/src/stories/ProgressBar.stories.tsx` · `packages/ui-native/src/stories/ProgressBar.stories.tsx`.

---

## 1. Overview

An **Aurora-Flux linear progress bar** with a gradient fill, in two modes:

- **Determinate** — a known `value` 0..1 → an inline-width gradient fill.
- **Indeterminate** — omit `value` → a gradient band sweeps continuously (use while a duration is unknown).

It's the richer sibling of `BarFill` (a static fraction fill only): `ProgressBar` adds the indeterminate animation, an optional label / percentage row, and configurable height / paint / track. It's a **full-width** bar (`width:100%`) — wrap it to constrain width (the kit's stories use a width wrapper).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number \| undefined` | `undefined` | ✓ | ✓ | 0..1 → determinate; `undefined` → **indeterminate** |
| `height` | `number` | `8` | ✓ | ✓ | bar height in px |
| **`gradient`** | web `string` · native `[string, string]` | web `'var(--grad-flux)'` · native `[colors.accent, colors.cyan]` | ✓ | ✓ | **platform-shaped** — CSS color/gradient string vs a 2-stop tuple |
| `track` | `string` | web `'rgba(255,255,255,0.07)'` · native `colors.glass` | ✓ | ✓ | unfilled rail color |
| `label` | `string` | — | ✓ | ✓ | label above the bar |
| `showValue` | `boolean` | `false` | ✓ | ✓ | render `%` (determinate only) |
| `rounded` | `boolean` | `true` | ✓ | ✓ | fully-rounded ends (web `--r-pill`; native `height`-radius) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web, `Omit<…,'role'>`) / `ViewProps` (native) | — | ✓ | ✓ | spreads to root |

- `v = clamp(value, 0, 1)`; `pct = round(v·100)`. Meta row shows only when `label` or (`showValue && !indeterminate`).

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Track | height `--lk-pb-h`, `--lk-pb-radius` (`--r-pill` / 0), bg `--lk-pb-track`, `overflow:hidden` | height `height`, radius `rounded?height:0`, bg `track`, `overflow:hidden` |
| Determinate fill | width `--lk-pb-v%`, bg `--lk-pb-fill` (`--grad-flux`), `background-size:240%`, glow `--glow-accent`, width transition 1.2s | `expo-linear-gradient(gradient, start{0,0}→end{1,0})` sized to `pct%` |
| Indeterminate | 38% band, `box-shadow 0 0 12px rgba(124,92,255,.55)`; `lkPbSlide 1.5s` + `lkPbFlow 4s` | `Animated` band `BAND_FRACTION=0.38`, `translateX` over a 1500ms `bezier(.22,1,.36,1)` loop |
| Label | `--font-mono` 10.5px `--text-dim` (`.lk-progressbar-meta` gap 10px, mb 7px) | `JetBrains Mono` 10.5px `colors.textDim` (`meta` mb 7) |
| Value `%` | `--font-mono` 10.5px `--accent-2`, tnum | `JetBrains Mono` 10.5px `colors.accent2` |

- **Reduced motion (web only):** `@media (prefers-reduced-motion: reduce)` stops the sweep and parks a calm centered band (`left: 24%`), and disables the fill width transition.
- **Per-instance vars (web):** `--lk-pb-h`, `--lk-pb-fill`, `--lk-pb-track`, `--lk-pb-radius`, `--lk-pb-v`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Determinate | fill to `pct%`; width tweens 1.2s | gradient fill to `pct%`; no tween |
| Indeterminate | sweeping band (`lkPbSlide`+`lkPbFlow`) | `Animated` translateX loop (measures track width via `onLayout`) |
| `showValue` | `%` shown (determinate only) | same |
| Reduced motion | sweep stops, calm centered band | **not handled** — the loop keeps running |
| `rounded=false` | square ends | square ends |
| Clamp | `value` outside 0..1 clamps | same |

`role="progressbar"` (web) carries the ARIA state; no hover/focus/disabled.

## 5. Web ↔ native parity

**Verdict: 🟡 same modes, platform-shaped paint + motion.** Identical modes (determinate/indeterminate), the same 38% band fraction, the same percentage/label semantics, and the same flux look. Real differences:

- **`gradient` prop type differs (genuine API shape):** web accepts any CSS color **or** gradient **string** (default `var(--grad-flux)`); native accepts a **`[from, to]` tuple** (default `[accent, cyan]`) for `expo-linear-gradient`. Callers must pass the platform-appropriate value — the one intentional API divergence.
- **Default track differs:** web `rgba(255,255,255,.07)` vs native `colors.glass`.
- **Sweep engine:** CSS keyframes (web) vs `Animated.loop` + measured track width (native).
- **Reduced motion:** honored on web (`prefers-reduced-motion`); native does **not** respect a reduce-motion setting here — the sweep loops regardless. Flagged as a real (minor) gap.
- **className ↔ style:** universal substrate.

No capability gap blocks use, but the `gradient` prop type and reduced-motion handling are the parity-sensitive points.

## 6. Composition & usage

- **Used for:** uploads/imports/sync with a known fraction (determinate), and "loading, duration unknown" (indeterminate). For a static fraction with no animation/label, prefer `BarFill`; for a labelled value-in-range, prefer `Meter`.
- **Composes from:** none (self-contained).

```tsx
// web — determinate upload with a label + %
<div style={{ width: 320 }}>
  <ProgressBar value={0.62} label="Uploading" showValue />
</div>

// web — indeterminate
<ProgressBar />

// native — determinate with a custom 2-stop gradient
<ProgressBar value={0.62} gradient={[colors.violet, colors.cyan]} label="Uploading" showValue />
```

## 7. Accessibility

- **Web:** root is `role="progressbar"` with `aria-valuemin/max/now` set when determinate (omitted when indeterminate), and `aria-label` = `label` (falling back to `'Loading'` when indeterminate).
- **Native:** no ARIA progressbar role is wired; pass an `accessibilityLabel` / `accessibilityRole` via `...rest` when the progress matters.
- **Motion:** respect `prefers-reduced-motion` is web-only today — on native, avoid relying on the sweep to convey state; pair indeterminate use with a text "Loading" where possible.

## 8. Usage rules — Do / Don't

**Do**
- Pass `value` 0..1 when the fraction is known; omit it for indeterminate.
- Wrap in a width-constrained container — `ProgressBar` is full-width by default.
- Pass `gradient` in the **platform-correct** form (string on web, `[from,to]` on native).

**Don't**
- ✗ Don't pass a tuple to web `gradient` or a string to native `gradient` — they're platform-shaped.
- ✗ Don't use `ProgressBar` for a static fraction with no animation — use `BarFill`.
- ✗ Don't hardcode the fill/track colors — use token values / token-derived gradients.
- ✗ Don't hand-roll an indeterminate sweep — extend `ProgressBar` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom sweeping/loading bar re-creating the flux gradient + band is a parity violation — import `ProgressBar`.
- **New need → both platforms.** A new tone, a buffer track, or a stepped variant ships to web **and** native with the same prop name + tokens (and keep the `gradient` shapes documented).
- **Tokens only.** Fill defaults to `--grad-flux` / `[accent, cyan]`; the track and any custom paint must be token values — no drifting hex.
- **Parity gate.** Before shipping, confirm the web phone-width bar ≡ native bar (same value, label, %, gradient look) — and reconcile the reduced-motion behavior if the indeterminate sweep matters.
