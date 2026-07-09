# SDD — `PkChart` (+ `PkDose`, `PkThreshold` types)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/PkChart.tsx` · `packages/ui-native/src/components/PkChart.tsx` ·
> web CSS `packages/ui/src/styles/components/pk.css` (`.lk-pk*`).
> **Exports:** `PkChart`, type `PkDose`, type `PkThreshold`, type `PkChartProps`.
> _(The model helpers `batemanShapeNorm` / `buildPkSamples` are `export`ed from the file but **not** re-exported by `index.ts` — they are internal, not public API.)_
> **Status:** Shipped. **Parity:** 🟡 same API & model incl. the **`bpm` heartbeat on the live `samples` mode** (CSS keyframes vs `Animated` interpolations, same period/shape); native measures width via `onLayout` (web uses CSS `%`), and the curve's static drop-shadow glow is web-only.
> **Stories:** `packages/ui/src/stories/PkChart.stories.tsx` · `packages/ui-native/src/stories/PkChart.stories.tsx`.

---

## 1. Overview

A **pharmacokinetics concentration-over-time** chart: a smooth area+line of how much of a substance is "in system" across a day (caffeine is the canonical case). The series comes either from raw `samples`, or — the default — by summing each `dose`'s normalized **Bateman one-compartment curve** (absorption + elimination). It overlays a dashed `threshold` reference line with a clipped danger-zone tint above it, faint vertical dose markers with `+mg` tags, a peak callout dot+tag, a right y-axis gutter, and an x-axis label row.

The Bateman model (`batemanShapeNorm`, `buildPkSamples`) is **byte-identical** on both platforms — only the rendering substrate differs. Reach for `PkChart` for any "substance / load decaying over time vs a threshold" surface; for a generic trend use `Sparkline`/`LineChart` instead.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `samples` | `number[]` | — | ✓ | ✓ | raw concentration series; **wins over** `doses` (and suppresses dose markers) |
| `doses` | `PkDose[]` | `DEFAULT_DOSES` (3) | ✓ | ✓ | each summed as a Bateman curve |
| `hours` | `number` | `24` | ✓ | ✓ | total timespan |
| `halfLifeH` | `number` | `5` | ✓ | ✓ | elimination half-life (caffeine ≈ 5) |
| `tMaxH` | `number` | `0.75` | ✓ | ✓ | time-to-peak |
| `threshold` | `PkThreshold` | `DEFAULT_THRESHOLD` `{value:50,label:'Sleep-disruption'}` | ✓ | ✓ | dashed line + right tag + danger tint |
| `unit` | `string` | `'mg'` | ✓ | ✓ | suffix in tags |
| `color` | `string` | web `'var(--accent)'` · native `colors.accent` | ✓ | ✓ | curve color |
| `height` | `number` | `180` | ✓ | ✓ | plot height + viewBox height |
| `axis` | `string[]` | `['6a','10a','2p','6p','10p']` | ✓ | ✓ | x-axis labels |
| `showDoseMarkers` | `boolean` | `true` | ✓ | ✓ | vertical line + mg tag per dose (ignored when `samples` given) |
| `bpm` | `number` | `64` | ✓ | ✓ | heartbeat rate for the live `samples` mode — beat period `60000/bpm` ms (64 → 937.5ms); `≤0` disables |
| `still` | `boolean` | `false` | ✓ | ✓ | freeze the heartbeat (screenshots / motion-free surfaces) |
| `ariaLabel` | `string` | — | ✓ | — | **web only** — SVG `aria-label` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web spreads to root `<div>` |

- **`PkDose`** — `{ at: number /* hours from t0 */, mg: number /* peak height */, label?: string }`.
- **`PkThreshold`** — `{ value: number /* y in `unit` */, label?: string }`.
- Web extends `HTMLAttributes<HTMLDivElement>`; native takes only `style` (no rest-spread).

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Curve stroke | `color`, width 3, round caps; glow `drop-shadow(0 0 8px rgba(124,92,255,.35))` (`.lk-pk-line`) | `color`, width 3, round caps; **no glow filter** |
| Area fill | `linearGradient` `color` 0.26 → 0 | same stops via `react-native-svg` |
| Danger tint | `--bad` 0.22 → 0.04, clipped above threshold | `colors.bad` 0.22 → 0.04, same clip |
| Gridlines | `--border`, opacity 0.6 (`.lk-pk-grid line`) | `colors.border`, opacity 0.6 |
| Dose line | `--border-2`, dash `2 3` (`.lk-pk-dose-line`) | `colors.border2`, dash `2 3` |
| Threshold line | `--bad`, width 1.5, dash `5 4`, opacity 0.85 | `colors.bad`, same |
| Peak dot | 11px, 2px `--bg-0` border, `box-shadow 0 0 8px rgba(255,255,255,.35)` | 11px, `colors.bg0` border, white shadow (radius 8) |
| Tags (peak/dose/threshold) | `--font-mono` 9px, `--r-sm` radius, `--glass-2` bg | `fonts.mono` 9px, `radii.sm`, `colors.glass2` |
| Y-ticks | `--font-mono` 10px, `--text-faint`, right gutter | `fonts.mono` 10px, `colors.textFaint` |
| X-axis | `--font-mono` 9.5px, `--text-faint` | `fonts.mono` 9.5px, `colors.textFaint` |

- **Geometry constants (shared):** `VB_W=560`, `PAD_Y=14`, `Y_TICKS=4`, `SAMPLE_N=121`. The SVG uses a fixed viewBox + `preserveAspectRatio="none"` so it stretches to any width; overlays are positioned by `%`.
- **Right gutter:** web `--lk-pk-gutter: 40px` (CSS var); native `Y_GUTTER = 36` (constant). One small platform value difference.
- **Heartbeat (live `samples` mode only — `beating = samples && !still && beatMs > 0`):** three things animate
  per beat, all keyed to `beatMs = 60000/bpm`:
  1. **peak-dot lub-dub** — two quick scale pulses (1 → 1.35 @8% → 1.05 @18% → 1.22 @26% → rest by 38%);
  2. **sonar ring** expanding off the dot (scale 0.5 → 2.8, opacity .55 → 0);
  3. **trace glow flash** — a 7px under-stroke of the line flashing at beat start (opacity 0 → .5 @8% → 0).
  Web: the root sets `--lk-pk-beat: {beatMs}ms` and CSS keyframes consume it (`lk-pk-beat`/`lk-pk-ripple`/
  `lk-pk-flash`; classes `.lk-pk-dot--beat`, `.lk-pk-beat-ring`, `.lk-pk-beat-glow`). Native: one looped
  `Animated.Value` per beat (linear, `useNativeDriver: true`) interpolated into the same shapes — only View
  opacity/transform animate (no animated SVG props on Fabric); the glow flash is a separate 7px-stroke `<Svg>`
  inside an `Animated.View`. Dose-built curves never beat.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default (doses) | summed Bateman curve + dose markers | same |
| Raw `samples` | curve from samples, **dose markers suppressed**; heartbeat runs (dot lub-dub + sonar ring + glow flash at `60000/bpm`) | same (`Animated` loop) |
| `still` / reduced motion | `still` freezes; `prefers-reduced-motion` disables all three beat animations | `still` freezes (no OS reduced-motion hook) |
| Threshold present | dashed line + clipped danger tint + right tag | same |
| Peak | callout dot+tag at the max sample (only when `peakVal > 0`) | same |
| Empty (`samples=[]`, no positive curve) | `yMax` floors to 1; no line/peak | same |
| Pre-measure | n/a (CSS sizes immediately) | `canvasW <= 0` → Svg not yet drawn until `onLayout` reports width |

No hover/focus/disabled — `PkChart` is a static read-only visualization.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & model, platform-shaped chrome.** The Bateman math, geometry constants, viewBox, tick/marker/threshold logic, and tag copy are identical. Differences are substrate-only:

- **Sizing:** web stretches via CSS (`width:100%`, `preserveAspectRatio="none"`); native must `useState`+`onLayout` to learn its width before drawing (`canvasW = width − Y_GUTTER`). Reads 1:1 for callers.
- **Static curve glow:** web adds a violet `drop-shadow` filter on the line (`.lk-pk-line`); native omits this
  always-on glow (the Fabric blur-filter port hasn't reached PkChart's static line). Cosmetic — does not block
  use. The peak **dot** glow exists on both, and the **beat glow flash** is on both.
- **Heartbeat:** same `bpm`/`still` props, same period, same three animated shapes; web = CSS keyframes driven
  by the `--lk-pk-beat` custom prop (disabled under `prefers-reduced-motion`), native = one `Animated` loop
  interpolated into View opacity/transform (no reduced-motion hook — pass `still`).
- **`ariaLabel`:** web-only prop (SVG `aria-label`); native has no equivalent SVG a11y label here.
- **Gutter width:** web 40px vs native 36px — a minor value drift, not a contract difference.

No capability gap blocks use; the chart is fully usable and visually equivalent on both.

## 6. Composition & usage

- **Used for:** caffeine/substance "in-system" timelines, load-decay vs a sleep-disruption or therapeutic threshold.
- **Composes from:** raw SVG primitives only (no other kit component); the Bateman helpers are internal.

```tsx
// web — three caffeine doses vs the sleep-disruption line
<PkChart
  doses={[{ at: 7, mg: 120, label: 'Coffee' }, { at: 13.5, mg: 60, label: 'Tea' }]}
  threshold={{ value: 50, label: 'Sleep-disruption' }}
  unit="mg"
/>

// native — same, plus a container style
<PkChart
  doses={[{ at: 7, mg: 120, label: 'Coffee' }, { at: 13.5, mg: 60, label: 'Tea' }]}
  threshold={{ value: 50, label: 'Sleep-disruption' }}
  style={{ marginTop: 12 }}
/>
```

## 7. Accessibility

- **Web:** the SVG is `role="img"` with `aria-label={ariaLabel}` — **pass `ariaLabel`** with a one-line summary of the shape (e.g. "Caffeine peaks at 9am, dropping below the sleep threshold by 6pm"). Tick/axis text is decorative (`aria-hidden`).
- **Native:** no SVG a11y label is wired; if the chart conveys essential data, wrap it in an `accessibilityLabel`'d parent View at the call site.
- **Color:** the danger tint + threshold are reinforced by the dashed line and the labelled tag — not color-only.

## 8. Usage rules — Do / Don't

**Do**
- Pass `halfLifeH` / `tMaxH` for the actual substance; the defaults are caffeine.
- Use `samples` when you already have a measured series; use `doses` to model from intake.
- Provide `ariaLabel` (web) describing the curve.
- Keep `unit` consistent with the `threshold.value` scale.

**Don't**
- ✗ Don't pass both `samples` and `doses` expecting markers — `samples` suppresses dose markers.
- ✗ Don't hardcode the curve/threshold/tint colors — they come from tokens (`color` defaults to the accent token).
- ✗ Don't hand-roll a PK/decay chart — extend `PkChart` on both platforms.
- ✗ Don't rely on the static curve glow on native — it's a web-only cosmetic (the beat flash is on both).
- ✗ Don't expect the heartbeat on dose-built curves — it's the live `samples` mode only; pass `still` where motion must stop (native has no reduced-motion hook).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke "concentration vs threshold" chart re-implementing the Bateman model or the danger-tint clip is a parity violation — import `PkChart` and keep the model in one place (the helpers are deliberately shared, byte-identical).
- **New need → both platforms.** A new overlay (second threshold, intake annotations) ships to web **and** native with the same prop name + tokens, never a one-off.
- **Tokens only.** Curve/threshold/tint/tag colors must resolve from `@lockin90/tokens` (or a token-valued `color`); hardcoded hex will drift on a token rename.
- **Parity gate.** Before shipping a screen with `PkChart`, confirm the web phone-width render ≡ native render (same doses, threshold, peak, axis) — accepting the documented curve-glow gap.
