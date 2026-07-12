# SDD — `RestTimer` (+ `formatRestTime`, `restFraction` helpers)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/RestTimer.tsx` · `packages/ui-native/src/components/RestTimer.tsx` ·
> web CSS `packages/ui/src/styles/components/resttimer.css` (`.lk-resttimer*`).
> **Exports:** `RestTimer`, `formatRestTime`, `restFraction`, type `RestTimerProps`.
> **Status:** Shipped. **Parity:** 🟡 same API, platform-shaped impl — web arc eases between ticks via a CSS transition (reduced-motion gated); native re-renders per tick (no tween precedent, same rule as Ring); glow = CSS drop-shadow ↔ Gaussian-blurred duplicate arc.
> **Stories:** `packages/ui/src/stories/RestTimer.stories.tsx` · `packages/ui-native/src/stories/RestTimer.stories.tsx`.

---

## 1. Overview

The **between-sets countdown**: a mint arc draining on a faint track (the design's rest ring) with the remaining time centered in mono, an optional "what's next" sublabel, a ghost **Skip** transport, and a `trailing` slot for a live readout (HR). **Purely prop-driven** — the caller owns the clock and ticks `remainingSec`; the component never runs its own interval.

Secondary exports: `formatRestTime(sec)` (`95 → '1:35'`, clamped at 0) and `restFraction(remaining, total)` (0–1, guards `total ≤ 0`).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `remainingSec` | `number` | — (required) | ✓ | ✓ | drives arc + readout |
| `totalSec` | `number` | — (required) | ✓ | ✓ | the 100% arc |
| `label` | `string` | `'Rest'` | ✓ | ✓ | tiny mono caption above the time, uppercased |
| `sublabel` | `string` | — | ✓ | ✓ | dim line right of the ring |
| `trailing` | `ReactNode` | — | ✓ | ✓ | far-right slot (HR readout) |
| `onSkip` | `() => void` | — | ✓ | ✓ | renders kit `Button` ghost `sm` "Skip" |
| `paused` | `boolean` | `false` | ✓ | ✓ | dims arc + readout, announces ", paused" |
| `className` / _rest_ | — | — | ✓ | — | container |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | container |

## 3. Visual spec (tokens — never hardcode)

Shared geometry: **116px viewBox, r = 50, stroke 8**, `C = 2π·50 ≈ 314.16`; `dashoffset = C · (1 − remaining/total)`; arc rotated −90° (starts at 12 o'clock), round linecap.

| Element | Web | Native |
| --- | --- | --- |
| Track | `rgba(255,255,255,.07)` | same literal |
| Arc | `--mint`, `drop-shadow(0 0 7px rgba(52,245,197,.45))`, transition `stroke-dashoffset .95s linear` | `colors.mint`; glow = duplicate arc behind, `FeGaussianBlur stdDeviation 3` (`filterUnits="userSpaceOnUse"`) |
| Label | `--font-mono` 9px uppercase `.14em` `--text-faint` | `fonts.mono` 9, ls 1.3 |
| Time | `--font-mono` 22px 700 tnum `--text` | same via `fontVariant` |
| Sublabel | 12.5px `--text-dim` | same |
| Skip | kit `Button` `variant="ghost" size="sm"` | same (`title="Skip"`) |
| Layout | flex row, gap 16; trailing `margin-left:auto` | same |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Running | mint arc + glow; dashoffset transitions between ticks | mint arc + blurred-duplicate glow; discrete per-tick redraw |
| Paused | arc opacity .4, glow off, transition off; time `--text-dim`; aria says ", paused" | arc group opacity .4, glow arc dropped; time dim; a11y label says ", paused" |
| Done (`remainingSec ≤ 0`) | empty arc, `0:00` | same |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` kills the dashoffset transition | n/a — never animates |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Identical geometry, math, colors, type, and slots. Differences:
- **Tick easing:** web CSS `stroke-dashoffset` transition (`.95s linear`, the design's rest ring) smooths 1s ticks; native redraws discretely — the kit's standing "no tween precedent on native SVG" rule (Ring DN-08). Not a blocker: at 1s ticks the native ring reads as a countdown.
- **Glow substrate:** CSS `drop-shadow` ↔ real `FeGaussianBlur` duplicate arc (the current native glow rule).
- **role="timer"** exists only on web; native uses `accessibilityLabel` on the container.

## 6. Composition & usage

- **Used in:** the live-session screen between sets (with `SetTable`), often inside a `Card`.
- **Composes from:** kit `Button` (Skip). The caller ticks the clock:

```tsx
// web
<RestTimer remainingSec={left} totalSec={150} sublabel="Next: Bench Press · set 3 of 5" onSkip={skip} />

// native — with a live HR readout
<RestTimer remainingSec={left} totalSec={90} trailing={<HrReadout />} onSkip={skip} paused={paused} />
```

## 7. Accessibility

- **Web:** container is `role="timer"` with `aria-label="{label}: {m:ss} remaining[, paused]"`; the SVG is `aria-hidden`; Skip is a real button.
- **Native:** the same label via `accessibilityLabel`; Skip is the kit Button (accessible pressable).
- Time is real text (not SVG text) on both — selectable/readable by AT.

## 8. Usage rules — Do / Don't

**Do**
- Own the interval in the app (store/hook) and pass `remainingSec` down — pause logic stays with the caller.
- Pass `paused` rather than freezing your tick silently, so AT hears ", paused".
- Keep `sublabel` to one line ("Next: …").

**Don't**
- ✗ Don't run `setInterval` inside a wrapper component around every render — tick state, not the world.
- ✗ Don't recolor the arc per call site — rest is mint; a different ring semantic is `Ring`, not `RestTimer`.
- ✗ Don't rebuild the ring with `Ring` + a `Text` — the rest ring's track/glow/transport is this primitive.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A countdown circle with centered mono time IS `RestTimer` — import it.
- **New need → both platforms** (e.g. a `size` prop) with the same name + geometry derivation.
- **Tokens only** (track literal `rgba(255,255,255,.07)` is the canonical matched value).
- **Parity gate.** Same remaining/total must render the same arc fraction, time string, and dim states on both platforms.
