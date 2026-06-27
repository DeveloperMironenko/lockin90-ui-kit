# SDD — `DotsLoader`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/DotsLoader.tsx` · `packages/ui-native/src/components/DotsLoader.tsx` ·
> web CSS `packages/ui/src/styles/components/dotsloader.css` (`.lk-dots`, `@keyframes lk-dot-bounce`).
> **Exports:** `DotsLoader`, type `DotsLoaderProps`.
> **Status:** Shipped. **Parity:** ✅ identical API + staggered wave; CSS keyframes (web) ↔ `Animated` loops (native).
> **Stories:** `packages/ui/src/stories/DotsLoader.stories.tsx` · `packages/ui-native/src/stories/DotsLoader.stories.tsx`.

---

## 1. Overview

Three (or `count`) small dots that **bounce / pulse in a staggered wave** — the **typing indicator** (the AI coach composing) and a generic inline loading state. Text-less by design: it's a pure motion affordance, no label. Each dot is delayed by `0.16s × index` for the wave; on web it's pure CSS animation that **holds static + fully lit under `prefers-reduced-motion`**.

Size, color, count, and gap are all prop-driven. Defaults to the accent token color (violet) with a soft glow.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `size` | `number` | `7` | ✓ | ✓ | dot diameter in px |
| `color` | `string` | `--accent` (web) / `colors.accent` (native) | ✓ | ✓ | any CSS/RN color; also tints the glow |
| `count` | `number` | `3` | ✓ | ✓ | number of dots; clamped to `>=1` via `Math.max(1, Math.floor(count))` |
| `gap` | `number` | `6` | ✓ | ✓ | gap between dots in px |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` (web) / `StyleProp<ViewStyle>` (native) | — | ✓ | ✓ | merged onto the container |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web) | — | ✓ | — | spreads onto the `<span>` |

- **Web:** renders a `<span class="lk-dots">` (`role="status"`, `aria-label="Loading"`) with `n` `<i>` children; `size`/`color`/`gap` flow through `--lk-dot-size` / `--lk-dot-color` / `--lk-dot-gap` custom properties, and each `<i>` sets its own inline `animation-delay: ${i * 0.16}s`. Color/gap CSS vars are only set when the props are provided (else the stylesheet defaults apply).
- **Native:** plain function component; one `Animated.Value` driver per dot (kept in a `useRef`, re-allocated only when `n` changes), driven by an `Animated.loop` of `delay → up → down → pad`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Dot shape | `border-radius: 50%` at `--lk-dot-size` (def 7px) | `borderRadius: size/2` at `size` (def 7) |
| Default color | `--lk-dot-color` → `--accent` (`#7C5CFF`) | `colors.accent` |
| Glow | `box-shadow: 0 0 10px var(--lk-dot-color, rgba(124,92,255,.5))` | `shadowColor: color, shadowOpacity: .5, shadowRadius: 10` |
| Gap | `--lk-dot-gap` (def 6px) | `gap` (def 6) |
| Container | `inline-flex`, `align-items: center` | `flexDirection: row, alignItems: center` |

**Animation:**

| Aspect | Web (`@keyframes lk-dot-bounce`, 1.2s `--ease-soft` infinite) | Native (`Animated.loop`) |
| --- | --- | --- |
| Rest (0/80/100%) | `translateY(0) scale(.7)`, opacity `.5` | driver 0 → `translateY 0`, `scale .7`, opacity `.5` |
| Peak (40%) | `translateY(-4px) scale(1)`, opacity `1` | driver 1 → `translateY -4`, `scale 1`, opacity `1` |
| Stagger | inline `animation-delay: i × 0.16s` | `Animated.delay(i * 160)` + trailing pad so cycles realign |
| Up/down timing | one 1.2s ease-soft cycle | up `360ms` ease-out-quad, down `480ms` ease-in-quad |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Animating | `.lk-dots > i` runs `lk-dot-bounce` infinite | per-dot `Animated.loop` running |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → `animation: none`, static + opacity 1 | n/a (no media query; loop runs — see §5) |
| Static (1 dot) | `count={1}` renders a single pulsing dot | same |

No hover / pressed / disabled — it's a passive indicator.

## 5. Web ↔ native parity

**Verdict: ✅ identical API + staggered wave.** Same props (`size` / `color` / `count` / `gap`) and defaults (7 / accent / 3 / 6), same `count` clamp (`Math.max(1, Math.floor)`), same staggered `0.16s × index` start, same rest/peak motion (translateY `-4`, scale `.7→1`, opacity `.5→1`), same glow tint.

Substrate differences: web uses CSS `@keyframes` + custom properties; native uses `Animated.Value` loops on the native driver. The one behavioral nuance is **reduced motion**: web honors `prefers-reduced-motion: reduce` (holds the dots static + fully lit); native has no equivalent media query in this component, so the loop runs regardless. This is a minor, non-blocking gap (a typing indicator is low-amplitude motion) — flagged here for honesty; it does not change the API or visual rest state.

## 6. Composition & usage

- **Composes from:** raw dots (no other kit primitive).
- **Used by:** the AI coach **typing indicator** (chat message composing), inline "loading…" affordances, button-internal pending state (paired with a disabled action).
- **Pick the right loader:** `DotsLoader` for "someone/something is composing"; `Spinner` for a determinate-feeling "busy ring"; both are text-less.

```tsx
// web — coach typing bubble
<DotsLoader />                      // 3 accent dots, default
<DotsLoader count={4} size={6} color="var(--cyan)" />

// native — identical
<DotsLoader />
<DotsLoader color={colors.cyan} gap={8} />
```

## 7. Accessibility

- **Web:** the `<span>` is `role="status"` + `aria-label="Loading"` so AT announces a loading state without the dots needing text.
- **Native:** the container is `accessibilityRole="progressbar"` + `accessibilityLabel="Loading"`.
- **Motion sensitivity:** web respects `prefers-reduced-motion` (static dots); native does not gate the loop — keep amplitude low (it already is: -4px / 1.2s-ish) and avoid stacking many DotsLoaders on one screen.
- **No focus/keyboard** concerns — it's not interactive.

## 8. Usage rules — Do / Don't

**Do**
- Use it for "composing/typing" and short inline loads.
- Let it default (3 accent dots) unless a surface needs a specific size/color.
- Pair with a disabled control when used as an in-button pending indicator.

**Don't**
- ✗ Don't hand-roll three bouncing dots — use `DotsLoader`.
- ✗ Don't add a text label inside it — it's text-less by design (use surrounding copy instead).
- ✗ Don't hardcode the dot color/glow — default to the accent token or pass a token color.
- ✗ Don't use it as a determinate progress bar (it conveys no percentage).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom bouncing-dots indicator is a parity violation — import `DotsLoader`.
- **New motion?** If a surface needs a different wave/shape, add a prop to `DotsLoader` on **both** platforms (same name, same tokens) — never a local fork.
- **Tokens only.** The default dot color + glow come from the accent token; a hardcoded violet is a bug even if it matches today.
- **Parity gate.** Before shipping a typing/loading surface, confirm web phone-width and native show the same dot count, size, and color (accept the reduced-motion nuance noted in §5).
