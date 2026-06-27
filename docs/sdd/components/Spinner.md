# SDD — `Spinner`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Spinner.tsx` · `packages/ui-native/src/components/Spinner.tsx` ·
> web CSS `packages/ui/src/styles/components/spinner.css` (`.lk-spinner*`, `@keyframes lk-spinner-rot`).
> **Exports:** `Spinner`, type `SpinnerProps`.
> **Status:** Shipped. **Parity:** ✅ identical API + energy-ring look; CSS rotation + `drop-shadow` glow (web) ↔ `Animated` rotate + a wider faint arc as the glow (native).
> **Stories:** `packages/ui/src/stories/Spinner.stories.tsx` · `packages/ui-native/src/stories/Spinner.stories.tsx`.

---

## 1. Overview

An **indeterminate circular loading spinner** in the Aurora Flux "energy-ring" style: a faint neutral track with a sweeping **gradient arc** (~62% of the circumference, round linecap, soft color glow) that rotates continuously. The arc gradient runs from the prop `color` (leading stop) to the **cyan accent** (trailing stop) for the energy-sweep look. Text-less — a pure "busy" affordance.

Web slows the sweep under `prefers-reduced-motion` (8s instead of stopping, so it still reads as busy). The component is `useId`-keyed so multiple spinners on a page don't collide on the SVG gradient `id`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `size` | `number` | `24` | ✓ | ✓ | outer diameter px; the SVG viewBox is square at this size |
| `color` | `string` | `var(--accent)` (web) / `colors.accent` (native) | ✓ | ✓ | arc's leading gradient stop + glow tint; trailing stop is always cyan |
| `thickness` | `number` | `3` | ✓ | ✓ | stroke width of both the track and the arc |
| `label` | `string` | `'Loading'` | ✓ | ✓ | accessible label (visually hidden on web) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` (web) / `StyleProp<ViewStyle>` (native) | — | ✓ | ✓ | merged onto the container |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) | — | ✓ | — | spreads onto the `<div>` |

- **Web:** `<div class="lk-spinner">` (`role="status"`, `aria-live="polite"`, `aria-label`) wrapping an `<svg>` (track `<circle>` + arc `<circle>` with a `<linearGradient>`), plus a visually-hidden `<span class="lk-sr-only">{label}`. `--lk-spinner-glow` is set inline to `color`.
- **Native:** an `Animated.View` (`accessibilityRole="progressbar"`, `accessibilityLabel`) wrapping a `react-native-svg` `Svg` with a track `Circle`, a wider faint glow `Circle`, and the gradient arc `Circle`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Track stroke | `--border-2` (`rgba(255,255,255,.16)`) | `colors.border2` |
| Arc gradient | `<linearGradient>` `color` → `var(--cyan)` (`#22D3EE`) | `LinearGradient` `color` → `colors.cyan` |
| Arc linecap | `stroke-linecap: round` | `strokeLinecap="round"` |
| Glow | `filter: drop-shadow(0 0 6px var(--lk-spinner-glow))` | a wider (`thickness+4`) `color` arc at `strokeOpacity .3` behind the gradient arc |
| Sweep length | `strokeDashoffset = c × 0.6` (~62% arc) | same (`c × 0.6`) |
| Radius | `(size - thickness) / 2` | `(size - thickness) / 2 - 3` (reserves glow overhang) |
| Rotation | `@keyframes lk-spinner-rot` 1s linear infinite | `Animated.timing` 0→1 over 1000ms linear, looped → `0deg→360deg` |

- **Geometry:** `c = 2πr`; arc `strokeDasharray = c`, `strokeDashoffset = c × 0.6` → a confident partial arc (matches the loaders-showcase ~0.6 ratio).
- **Native glow trick:** instead of a `<Filter>` drop-shadow (patchy on device), native draws a wider, faint copy of the arc behind it so the halo follows the ring — hence the `-3` radius inset to avoid clipping the square viewBox.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Spinning | `.lk-spinner-svg` rotates 1s linear infinite | `Animated.loop` rotates the `Animated.View` 0→360° / 1000ms |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → `animation-duration: 8s` (slows, doesn't stop) | n/a (no media query; loop runs — see §5) |
| Sizing | `size`/`thickness`/`color` inline | same, computed in JS |

No hover / pressed / disabled — it's a passive busy indicator.

## 5. Web ↔ native parity

**Verdict: ✅ identical API + energy-ring look.** Same props (`size` / `color` / `thickness` / `label`) and defaults (24 / accent / 3 / "Loading"), same gradient (prop color → cyan), same ~62% sweep (`c × 0.6`), same round linecap, same faint `border-2` track, same 1s linear full rotation, same `useId`-keyed gradient id.

Substrate differences: web rotates via CSS `@keyframes` and glows via `drop-shadow`; native rotates via `Animated` (native driver) and fakes the glow with a wider, faint arc behind the gradient arc (a `<Filter>` is unreliable on device), which is why native insets the radius by `3` to keep the halo inside the viewBox. The one behavioral nuance is **reduced motion**: web slows the sweep to 8s; native has no media query, so the loop runs at 1s regardless — a minor, non-blocking gap (flagged for honesty). Visually the ring is equivalent on both.

## 6. Composition & usage

- **Composes from:** raw SVG (no other kit primitive).
- **Used by:** `Button` async pending state (drop a `<Spinner size="sm">` in `leading` + disable — per `Button.md` §6), page/section loading, inline "busy" affordances.
- **Pick the right loader:** `Spinner` for a generic "busy" ring; `DotsLoader` for a "composing/typing" indicator; both are text-less.

```tsx
// web — section busy
<Spinner />                                  // 24px accent ring
<Spinner size={16} thickness={2} color="var(--mint)" label="Saving" />

// web — inside a Button
<Button disabled leading={<Spinner size={16} />}>Saving…</Button>

// native — identical
<Spinner size={20} color={colors.mint} label="Saving" />
```

## 7. Accessibility

- **Web:** `<div role="status" aria-live="polite" aria-label={label}>` plus a visually-hidden `<span class="lk-sr-only">{label}` — AT announces the busy state; the SVG is `aria-hidden`.
- **Native:** `accessibilityRole="progressbar"` + `accessibilityLabel={label}`, `accessible`.
- **Always pass a meaningful `label`** when the context isn't obvious ("Saving", "Loading results") — the default is the generic "Loading".
- **Motion sensitivity:** web slows under reduced-motion; native does not — avoid placing many spinners on one screen.

## 8. Usage rules — Do / Don't

**Do**
- Use it for indeterminate "busy" states (no known percentage).
- Size it down (`16` / `sm`) for in-button or inline use; default `24` for sections.
- Pass a contextual `label` for screen readers.

**Don't**
- ✗ Don't hand-roll a ring spinner — use `Spinner`.
- ✗ Don't use it as a determinate progress bar (it shows no percentage).
- ✗ Don't hardcode the arc gradient/glow — they're accent→cyan + token-driven.
- ✗ Don't add visible text inside it — it's text-less (use surrounding copy).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom rotating-arc spinner is a parity violation — import `Spinner`.
- **New treatment?** If a surface needs a determinate ring or a different sweep, add a prop/variant to `Spinner` on **both** platforms (same name, same tokens) — never a local fork.
- **Tokens only.** The track (`border-2`), arc gradient (→ `cyan`), and glow come from `@lockin90/tokens`; a hardcoded color is a bug even if it matches today.
- **Parity gate.** Before shipping a loading surface, confirm web phone-width and native show the same ring size, color, and sweep (accept the reduced-motion nuance noted in §5).
