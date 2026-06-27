# SDD — `TypingIndicator`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform composite (messaging).
> **Source:** `packages/ui/src/components/TypingIndicator.tsx` · `packages/ui-native/src/components/TypingIndicator.tsx` ·
> web CSS `packages/ui/src/styles/components/typing.css` (`.lk-typing*`, `@keyframes lk-typing-bounce`).
> **Exports:** `TypingIndicator`, type `TypingIndicatorProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; web animates via CSS `@keyframes`, native via `Animated` loops — same 1.2s / 0.16s-stagger / −4px-bounce motion.
> **Stories:** `packages/ui/src/stories/TypingIndicator.stories.tsx` · `packages/ui-native/src/stories/TypingIndicator.stories.tsx`.

---

## 1. Overview

A small **left-aligned glass bubble** (the incoming-`MessageBubble` look) holding **three dots** that bounce / pulse in a staggered loop to signal someone composing a message — the chat-thread "X is typing" affordance. An optional `label` (e.g. `"Sofia is typing"`) renders as small dim text **before** the dots; with no label it's just the animated dots. The motion matches the `DotsLoader` convention: 1.2s cycle, 0.16s per-dot stagger, −4px bounce + 0.7→1 scale + 0.5→1 opacity. Web honors `prefers-reduced-motion: reduce` by holding the dots static + fully lit.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | — (none → dots only) | ✓ | ✓ | leading dim text, e.g. `"Sofia is typing"` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web spreads to the root `<div>` |

- **Web:** plain function; the three dots are `<i>` elements each given an inline `animationDelay: ${i * 0.16}s` for the staggered wave.
- **Native:** plain function; one `Animated.Value` per dot (`DOT_COUNT = 3`), driven by an `Animated.loop(sequence(delay → up → down → pad))` per dot; loops start in `useEffect` and are stopped on unmount.

## 3. Visual spec (tokens — never hardcode)

| Part | Token / value |
| --- | --- |
| Bubble | `--glass-2` / `colors.glass2` bg, `1px --border-2` / `colors.border2`, radius `--r-pill` / `radii.pill` (999), padding `12px / 16px` (native `9px / 14px`), `gap 8px`, `align-self: flex-start`, `max-width: 82%` |
| Label | `--font-ui` / `fonts.ui`, `12px`, `--text-dim` / `colors.textDim`, `white-space: nowrap` |
| Dot | `6×6` circle, `--text-dim` / `colors.textDim`; dots row `gap 4px` |

- **Web sizing guard:** `.lk-typing { flex: none }` so a flex parent can't squeeze the bubble below its content (which previously made dots overflow). `.lk-typing-dots { flex: none }` likewise.
- **Motion (web):** `@keyframes lk-typing-bounce` over `1.2s var(--ease-soft)` infinite — at 0/80/100% `translateY(0) scale(.7) opacity:.5`, at 40% `translateY(-4px) scale(1) opacity:1`; per-dot `animation-delay` 0 / .16 / .32s. `will-change: transform, opacity`.
- **Motion (native):** per dot `Animated.timing` up 360ms `Easing.out(quad)` then down 480ms `Easing.in(quad)`, with `delay(i*160)` lead-in and `delay((2-i)*160)` pad so cycles realign; interpolations `opacity 0.5→1`, `translateY 0→-4`, `scale 0.7→1`. `useNativeDriver: true`.
- **390px fit:** the bubble is `inline-flex` + `flex:none`, sized to its content (`max-width 82%` → ~320px at 390px viewport). `"Sofia is typing"` (nowrap) + three `6px` dots + paddings sit well under that cap — no wrap, no overflow at phone width.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Animating (default) | `@keyframes lk-typing-bounce` loop, staggered | `Animated.loop` per dot, staggered |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → `animation: none`, dots static + fully lit | not handled — loops always run |
| Label present | `.lk-typing-label` before dots | `label` `Text` before dots |
| Dots only | bubble + dots, no label | bubble + dots, no label |

Non-interactive — no hover / pressed / focus / disabled.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, platform-shaped motion engine.** Identical bubble (glass-2, pill, left-aligned, 82% cap), label typography, dot size/color/gap, and the −4px-bounce / 0.7→1-scale / 0.5→1-opacity / 0.16s-stagger motion. Differences are substrate-only:

- **Animation engine:** web CSS `@keyframes` + per-dot `animation-delay`; native `Animated.Value` loops with matching durations/easings + `delay` staggers. Visually equivalent loops.
- **Reduced motion:** web respects `prefers-reduced-motion: reduce` (static lit dots); native does **not** gate on the OS reduce-motion setting — a genuine but minor gap. Flag if a reduce-motion-sensitive native screen needs it (would require reading `AccessibilityInfo.isReduceMotionEnabled`).
- **Bubble padding:** web `12/16`, native `9/14` — a small intentional platform tuning; both read as the same incoming-bubble pill.

No capability gap blocks use; the only behavioral delta is native not honoring reduce-motion.

## 6. Composition & usage

- **Composes from:** primitives only — a flex bubble + three dots (`<i>` / `Animated.View`). No other kit component.
- **Composed into:** the bottom of a message thread, just above `MessageComposer`, while the other party is typing. Mount it conditionally on a "peer typing" signal; unmount to stop (native loops auto-stop on unmount).

```tsx
// web
{peerTyping && <TypingIndicator label="Sofia is typing" />}

// native
{peerTyping && <TypingIndicator label="Sofia is typing" />}
```

## 7. Accessibility

- **Web:** root `<div role="status">` with `aria-label={label ? '`{label}`…' : 'Typing…'}` so assistive tech announces the typing state; the dots are `aria-hidden`.
- **Native:** root `View` with `accessibilityRole="progressbar"` + the same `aria-label` text via `accessibilityLabel`.
- **Reduced motion:** web stops the animation under `prefers-reduced-motion` — keep the bubble visible (state still conveyed by the role/label).
- **Transience:** it's a status, not an alert — don't trap focus on it.

## 8. Usage rules — Do / Don't

**Do**
- Mount it only while the peer is actually composing; unmount when they stop.
- Pass `label` when you know who's typing; omit for an anonymous "…".
- Place it inline with the incoming bubbles (it self-aligns left).

**Don't**
- ✗ Don't hand-roll three bouncing dots — use `TypingIndicator` (or `DotsLoader` for a non-chat loader).
- ✗ Don't leave it permanently mounted — it implies live activity.
- ✗ Don't hardcode the dot size, bubble glass, pill radius, or motion timings — they come from `@lockin90/tokens` / the shared keyframes.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "typing…" bubble that re-creates the glass pill + staggered dots is a parity violation — import `TypingIndicator`.
- **New need → both platforms.** A timing/size change must land in **both** the CSS keyframes and the native `Animated` loop with matching values — never tweak one side.
- **Tokens only.** Bubble glass, pill radius, dot color all source from tokens; the motion constants (1.2s / 0.16s / −4px / 0.7→1 / 0.5→1) are the shared spec and must stay identical across the two engines.
- **Parity gate.** Before shipping the chat screen, confirm web phone-width and native show the same bubble + dot motion, and that the bubble fits at 390px without overflow.
