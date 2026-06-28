# SDD — `Ring`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Ring.tsx` · `packages/ui-native/src/components/Ring.tsx` ·
> web CSS `packages/ui/src/styles/components/ring.css` (`.lk-ring*`).
> **Exports:** `Ring`, type `RingProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; the soft glow is a CSS `drop-shadow` on web vs a wider faint duplicate arc on native (RN SVG filters are patchy), and web animates the arc sweep.
> **Stories:** `packages/ui/src/stories/Ring.stories.tsx` · `packages/ui-native/src/stories/Ring.stories.tsx`.

---

## 1. Overview

A **generic circular-progress primitive**: an SVG track circle + a colored progress arc (rotated −90° so it starts at 12 o'clock, round linecap, soft color glow) with absolutely-centered readout content. Solid by default; pass a `[from, to]` `gradient` tuple for a two-stop arc, or an **N-stop color array** (`≥2`, e.g. `gradients.flux.stops`) for the full lime→mint→cyan→violet→magenta spectrum arc. When `children` is omitted it renders the rounded `value` as a big display number. It's the Aurora-Flux ring used for energy/goal/substance gauges.

`Ring` is the low-level circular gauge — higher-level rings (`Gauge`, `PhaseWheel`, achievement rings) compose or echo it. Reach for `Ring` whenever you need "X% as a circle" with custom center content.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | `72` | ✓ | ✓ | arc fill 0–100, clamped |
| `size` | `number` | `108` | ✓ | ✓ | outer diameter (square viewBox) |
| `thickness` | `number` | `7` | ✓ | ✓ | stroke width of track + arc |
| `color` | `string` | web `'var(--mint)'` · native `colors.mint` | ✓ | ✓ | arc color; ignored when a `gradient` array is given |
| `trackColor` | `string` | web `'var(--border)'` · native `colors.border` | ✓ | ✓ | unfilled track color |
| `gradient` | `string \| string[]` | — | ✓ | ✓ | array (≥2) → N evenly-spaced `linearGradient` stops; `[from,to]` is the 2-stop case; `gradients.flux.stops` → full spectrum; single string → treated like `color` |
| `glow` | `boolean` | `true` | ✓ | ✓ | soft color glow on the arc |
| `children` | `ReactNode` | — | ✓ | ✓ | centered content; omit → shows `Math.round(value)` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web spreads to the root `<div>` |

- **Gradient resolution (both):** `Array.isArray(gradient)` → an N-stop `linearGradient` (`x1,y1=0 → x2,y2=1`) with each stop at offset `i / (n−1)` (evenly spaced; a 2-array is the `[from,to]` case); a `string` gradient is treated as a solid `color`; else the `color` prop.
- **Glow color:** the arc color (or the gradient's **first** stop, `gradient[0]`, on web).

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Track circle | `fill:none`, `stroke=trackColor`, width `thickness` | same |
| Arc | round linecap, `stroke-dasharray=c`, `dashoffset=c·(1−v/100)` | same `dasharray`/`dashoffset`; explicit `rotation={-90}` per-circle |
| Rotation | whole `<svg>` `transform: rotate(-90deg)` | per-`<Circle>` `rotation={-90}` (arc starts at 12 o'clock) |
| Glow | `filter: drop-shadow(0 0 8px var(--lk-ring-glow))` on `.lk-ring-arc` | a **wider faint duplicate arc** (`strokeWidth+8`, `strokeOpacity 0.35`) behind the arc |
| Sweep animation | `transition: stroke-dashoffset 1.1s var(--ease)` | none |
| Center number | `--font-display`, 700, `-0.03em`, 32px, `--text` (`.lk-ring-num`) | `fonts.display`, 700, letterSpacing −0.9, 32px, `colors.text` |

- **Radius:** web `r = (size − thickness) / 2`; native `r = (size − thickness) / 2 − glowPad` where `glowPad = glow ? 5 : 0` — native shrinks the radius so the wider glow arc never clips the square viewBox. (Minor geometric drift; the ring reads the same.)
- **Layout:** web `.lk-ring` is `inline-grid; place-items:center`; native is a relative, centered `View`. Center content overlays the SVG (`.lk-ring-center` / `StyleSheet.absoluteFillObject`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Progress | arc fills to `value`%; web animates the sweep over 1.1s | arc fills; no animation |
| 0 / 100 | `dashoffset` = full circumference / 0 | same |
| Clamp | `value` outside 0–100 clamps | same |
| Gradient arc | N-stop `linearGradient` (2-stop tuple or full flux array) | same |
| Glow off (`glow=false`) | `--lk-ring-glow: transparent` → no shadow | glow duplicate arc not rendered; native also resets `glowPad=0` (slightly larger r) |
| Custom center | renders `children` instead of the number | same |

Static, read-only — no hover/focus/disabled.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped glow + motion.** Identical props, arc math (circumference, dashoffset), gradient handling, −90° start, and 32px display-number center. Differences are substrate-only:

- **Glow:** web uses a CSS `drop-shadow` filter on the arc; native draws a wider, faint duplicate arc behind it because RN-SVG `<FeGaussianBlur>` is unreliable on device. Same visual intent (a circular halo, not a box shadow).
- **Glow padding:** native reduces the radius by `5px` when `glow` is on to fit the halo in the viewBox; web doesn't need to (the filter can spill via `overflow:visible`). The ring is marginally smaller on native — acceptable.
- **Animation:** web tweens the arc sweep (`stroke-dashoffset` transition); native renders the final arc without a tween.
- **className ↔ style:** universal substrate; callers read 1:1.

No capability gap blocks use.

## 6. Composition & usage

- **Used by / echoed in:** energy and goal gauges, substance rings, achievement rings; `Gauge`/`PhaseWheel` are richer radial siblings.
- **Composes:** any centered `children` (a number + a `--font-mono` caption, an icon, a `DeltaPill`).

```tsx
// web — energy ring with a 2-stop gradient arc + custom center
<Ring value={72} gradient={['var(--violet)', 'var(--cyan)']} size={132}>
  <span className="lk-ring-num lk-tnum">72</span>
</Ring>

// web/native — full flux spectrum arc (N-stop)
import { gradients } from '@lockin90/tokens';
<Ring value={88} gradient={[...gradients.flux.stops]} size={132} />

// native — solid mint ring, default centered number
<Ring value={72} color={colors.mint} size={132} />
```

## 7. Accessibility

- **Web:** the inner `<svg>` is `aria-hidden` (decorative geometry); the **center content carries the meaning** — render a real number/label (or pass `aria-label` via `...rest` on the root `<div>`) so the value is announced.
- **Native:** SVG is decorative; supply an `accessibilityLabel` on a wrapping/parent View when the value matters.
- **Contrast:** the 32px display number uses `--text` on the dark surface; keep custom center content at `--text`/`--text-dim`, not faint, for legibility at small `size`.

## 8. Usage rules — Do / Don't

**Do**
- Use `gradient={[from, to]}` for a two-tone arc, or `gradient={[...gradients.flux.stops]}` for the full spectrum; use `color` for a single zone tone.
- Provide center `children` (number + caption) or rely on the default number.
- Scale `thickness` with `size` for balanced rings.

**Don't**
- ✗ Don't pass `value` outside 0–100 expecting overflow — it clamps.
- ✗ Don't hardcode the arc/track/glow colors — pass token values (`var(--mint)` / `colors.mint`).
- ✗ Don't depend on the sweep animation on native — it renders the final arc directly.
- ✗ Don't hand-roll a circular-progress SVG — extend `Ring` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke SVG progress circle re-deriving the dashoffset + −90° start + glow is a parity violation — import `Ring`.
- **New need → both platforms.** A new cap style, multi-arc, or animation option ships to web **and** native with the same prop name + tokens.
- **Tokens only.** `color` / `trackColor` / `gradient` must be token values; raw hex drifts on a token rename.
- **Parity gate.** Before shipping, confirm the web phone-width ring ≡ native ring (same value, size, gradient, center) — accepting the documented glow/animation substrate differences.
