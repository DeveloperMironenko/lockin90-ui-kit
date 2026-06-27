# SDD — `Countdown` (+ `CountdownUnit` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Countdown.tsx` · `packages/ui-native/src/components/Countdown.tsx` ·
> web CSS `packages/ui/src/styles/components/countdown.css` (`.lk-countdown*`).
> **Exports:** `Countdown`, type `CountdownUnit` (`'days' | 'hours' | 'minutes' | 'seconds'`), type `CountdownProps`.
> **Status:** Shipped. **Parity:** ✅ identical API + visuals; lit cell uses CSS `--grad-cta` (web) ↔ `expo-linear-gradient` (native).
> **Stories:** `packages/ui/src/stories/Countdown.stories.tsx` · `packages/ui-native/src/stories/Countdown.stories.tsx`.

---

## 1. Overview

A **row of glass cells** — days / hours / minutes / seconds — each a big display number with a mono unit label, counting down to a target time. Used on coming-soon / maintenance / launch surfaces.

Two modes: pass **`to`** (target epoch ms) to tick **live every second** (the effect sets a 1s interval and clears on unmount), or pass **`parts`** for a static, non-ticking render. `units` selects/orders which cells appear (default all four); `highlightUnit` renders one cell **lit** with the CTA gradient + glow. Values clamp at zero (never negative). The exported `CountdownUnit` type is the cell key.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `to` | `number` | — | ✓ | ✓ | target epoch (ms); when set, ticks live every 1s and clears on unmount |
| `parts` | `{ days?: number; hours?: number; minutes?: number; seconds?: number }` | — | ✓ | ✓ | static values shown when `to` is absent |
| `units` | `CountdownUnit[]` | `['days','hours','minutes','seconds']` | ✓ | ✓ | which cells to render, in order |
| `highlightUnit` | `CountdownUnit` | — | ✓ | ✓ | the one cell rendered lit (CTA gradient) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `Omit<HTMLAttributes,'children'>` (web) | — | ✓ | — | spreads onto the row `div` |

- **Web:** `'use client'`; the row `div` is `role="timer"` + `aria-live="polite"`. Children are disallowed (`Omit<...,'children'>`).
- **Native:** plain function component; the row `View` is `accessibilityRole="timer"`. No `...rest`.
- **SSR-safe:** both compute the initial value via a `useState` initializer (no `Date.now()` at module scope) and reconcile on mount in the effect, then `tick()` immediately so a stale initial value never lingers a second.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Idle cell | Lit cell (`highlightUnit`) |
| --- | --- | --- |
| Background | `--glass` / `colors.glass` | `--grad-cta` / `gradients.cta` (violet→cyan) |
| Border | `1px --border` / `colors.border` | transparent |
| Shadow | none | `--glow-accent` / `nativeShadows.glowAccent` |
| Radius | `--r` / `radii.md` (16) | same |
| Min width | `92px` | same |
| Padding | `16px / 14px` | same |
| Number | `--font-display` / `fonts.display`, 700, **46px**, `-0.03em`, line 1, `tabular-nums` | same |
| Label | `--font-mono` / `fonts.mono`, 10.5px, 500, `0.16em`, uppercase, `--text-dim` | `rgba(255,255,255,.72)` (reads on the gradient) |

- **Row:** `display:flex` / `flexDirection:row`, `flex-wrap` / `flexWrap:'wrap'`, `justify-content:center`, `gap:12`.
- **Native native specifics:** number `letterSpacing: -1.38` + `lineHeight: 46`; label `letterSpacing: 1.68` (the px equivalents of web's `em` values at 46px / 10.5px).
- **Padding two-digit:** `pad()` zero-pads to 2 digits; days keep all digits when the range exceeds 99.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Idle cell | `.lk-countdown-cell` (glass + border) | `cell` style (glass + border) |
| Lit cell | `.lk-countdown-lit` → `--grad-cta` bg + `--glow-accent`, transparent border; label `rgba(255,255,255,.72)` | `LinearGradient` (`gradients.cta.stops`, `{0,0}→{1,1}`) + `cellLit` (`nativeShadows.glowAccent`); `labelLit` color |
| Live tick | 1s `setInterval` updates state; clears on unmount | identical effect |
| Static | `to` absent → renders `parts`, no interval | identical |
| Zero / past | clamps to `00` (never negative) | same |

No hover / pressed / disabled — it's a display timer.

## 5. Web ↔ native parity

**Verdict: ✅ identical API + visuals.** Same props (`to` / `parts` / `units` / `highlightUnit`), same live-tick logic (1s interval, immediate sync, unmount cleanup), same SSR-safe initializer, same `splitRemaining`/`pad` math, same clamp-at-zero, same cell geometry (92px min, 16/14 padding, 16 radius, 46px display number, 10.5px mono uppercase label), same gap.

The only substrate difference is the **lit cell's gradient**: web fills with the CSS `--grad-cta` variable; native renders an `expo-linear-gradient` using `gradients.cta.stops` (`start {0,0}` → `end {1,1}`). Both produce the same violet→cyan fill + glow. The exported `CountdownUnit` type is shared. No capability gap.

## 6. Composition & usage

- **Composes from:** raw cells only (no other kit primitive). Tokens drive everything.
- **Used by:** coming-soon / launch / maintenance surfaces, limited-offer banners.
- **Live vs static:** pass `to` for a real ticking timer; `parts` for a fixed marketing render (e.g. screenshots, "48 : 00 : 00").

```tsx
// web — live, seconds cell lit
<Countdown to={Date.parse('2026-07-01T00:00:00Z')} highlightUnit="seconds" />

// web — static, only days+hours
<Countdown parts={{ days: 12, hours: 7 }} units={['days', 'hours']} />

// native — identical prop API
<Countdown to={launchEpochMs} highlightUnit="days" />
```

## 7. Accessibility

- **Web:** the row is `role="timer"` with `aria-live="polite"` so screen readers announce updates; the `pad`-formatted numbers and unit labels are real text.
- **Native:** the row is `accessibilityRole="timer"`; `Text` nodes carry the values.
- **Reduced motion:** the countdown is a value update (not a transform animation), so it's unaffected by reduced-motion; only the value changes once per second.
- **Avoid over-announcing:** a live seconds cell announces every second — prefer `units` without `seconds` (or no `aria-live` emphasis) on long-range counters where per-second updates are noise.

## 8. Usage rules — Do / Don't

**Do**
- Use `to` (epoch ms) for a real live countdown; `parts` for a static render.
- Use `units` to drop cells you don't need (e.g. days-only for far-future).
- Use `highlightUnit` to draw attention to the most relevant cell.

**Don't**
- ✗ Don't hand-roll a `setInterval` + cell grid — use `Countdown` (it handles SSR + cleanup).
- ✗ Don't pass both a live `to` and expect `parts` to win — `to` takes precedence.
- ✗ Don't hardcode the gradient/glow on the lit cell — they're `--grad-cta` / `glow-accent`.
- ✗ Don't render a per-second live counter for multi-day ranges (announcement noise).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom days/hours/min/sec cell row with its own interval is a parity violation — import `Countdown`.
- **New cell treatment?** If a surface needs a different lit style or extra unit, add it to `Countdown` on **both** platforms (same prop, same tokens) — never a local fork.
- **Tokens only.** The glass cell, CTA gradient, glow, fonts, and radius come from `@lockin90/tokens`; a hardcoded gradient is a bug even if it matches today.
- **Parity gate.** Before shipping a launch/maintenance surface, confirm web phone-width and native render the same cells, in the same order, with the same lit cell.
