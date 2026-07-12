# SDD — `SessionBanner`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SessionBanner.tsx` · `packages/ui-native/src/components/SessionBanner.tsx` ·
> web CSS `packages/ui/src/styles/components/sessionbanner.css` (`.lk-sessionbanner*`).
> **Exports:** `SessionBanner`, types `SessionBannerStat`, `SessionBannerAction`, `SessionBannerProps`.
> **Status:** Shipped. **Parity:** 🟡 same API, platform-shaped impl — live-dot pulse is CSS keyframes (reduced-motion gated) ↔ `Animated` loop (the DotsLoader substrate); web has `backdrop-filter` blur, native a solid dark-glass fill.
> **Stories:** `packages/ui/src/stories/SessionBanner.stories.tsx` · `packages/ui-native/src/stories/SessionBanner.stories.tsx`.

---

## 1. Overview

The **active-session live banner** — the "you're mid-workout" surface pinned on the training hub / above the tab bar: a dark glass card with a **one-line header** (optional `leading` slot, pulsing magenta live dot, a title that truncates, a status that never wraps), a dim subtitle, up to **3 mono stats** split by hairlines, and a row of kit-`Button` actions.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `title` | `string` | — (required) | ✓ | ✓ | truncates, never wraps |
| `status` | `string` | — | ✓ | ✓ | right-pinned mono, never wraps; magenta when `live` |
| `subtitle` | `string` | — | ✓ | ✓ | dim line under the header |
| `stats` | `SessionBannerStat[]` | — | ✓ | ✓ | `{ value, label }`, capped at 3 |
| `actions` | `SessionBannerAction[]` | — | ✓ | ✓ | `{ label, variant?: 'primary'\|'ghost', onPress? }` → kit `Button sm` |
| `live` | `boolean` | `false` | ✓ | ✓ | pulsing magenta dot + status tint |
| `leading` | `ReactNode` | — | ✓ | ✓ | app icon / exercise glyph slot |
| `className` / _rest_ | — | — | ✓ | — | `<section>` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | container |

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Card | `rgba(10,12,20,.72)` + `backdrop-filter: blur(14px)`, 1px `--border`, `--r-lg` (22), padding `14px 16px`, column gap 9 | same fill literal (no backdrop blur on RN views), `colors.border`, `radii.lg` |
| Live dot | 8px circle `--magenta`, glow `0 0 8px rgba(255,61,129,.7)`, keyframes scale 1→1.35 / opacity 1→.55, 1.6s `--ease` | `colors.magenta` + legacy `shadow*` glow; `Animated` loop 800ms×2 easeInOut, same scale/opacity |
| Title | `--font-display` 700 15px, `flex:1; min-width:0`, ellipsis nowrap | same, `numberOfLines={1}` |
| Status | `--font-mono` 11px 600 tnum nowrap `--text-dim`; live → `--magenta` | same via `fontVariant` |
| Subtitle | 12.5px `--text-dim` | same |
| Stats | flex thirds; value mono 700 15px tnum; label mono 8.5px uppercase `.12em` `--text-faint`; `+` siblings get `border-left --border`; first has no left pad | same (first `paddingLeft:0`, `borderLeft` from i>0; labels pre-uppercased) |
| Actions | kit `Button size="sm"` `primary`/`ghost`, gap 8 | same (`title`/`onPress`) |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| `live` | pulsing dot + magenta status | same (Animated pulse) |
| not live | no dot, dim status | same |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → `animation:none` (static dot) | loop runs (no RN reduce-motion precedent in the kit — see §5) |
| >3 stats | silently capped at 3 | same |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.**
- **Pulse substrate:** CSS keyframes (reduced-motion gated) ↔ unconditional `Animated` loop — the kit's existing animation substrate (DotsLoader, TypingIndicator); native has no established reduce-motion gate yet, so the dot follows that precedent.
- **Backdrop blur:** web `backdrop-filter: blur(14px)`; native views can't blur what's behind them — the shared `rgba(10,12,20,.72)` fill carries the dark-glass read (the `OptionalBlurView` internal is a TabBar-specific substrate, not used here).
- Everything else (layout, truncation rules, stats math, Button reuse) reads 1:1.

## 6. Composition & usage

- **Used in:** training hub (session in progress), floating above the tab bar during a live workout.
- **Composes from:** kit `Button` (actions); `PrBadge`/stat content can ride in `leading`/`stats`.

```tsx
// web
<SessionBanner
  title="Push Day A" status="Live · 24:18" subtitle="Bench Press · set 2 of 5" live
  stats={[{ value: '142', label: 'BPM' }, { value: '12', label: 'Sets' }, { value: '8 400', label: 'KG vol' }]}
  actions={[{ label: 'Resume', variant: 'primary', onPress: resume }, { label: 'Finish', onPress: finish }]}
/>

// native — minimal pinned banner
<SessionBanner title="Push Day A" status="Live · 02:41" live />
```

## 7. Accessibility

- **Web:** a `<section>`; the dot is `aria-hidden` (the status **text** says "Live"); actions are real buttons.
- **Native:** Texts read in order; actions are kit Buttons (accessible pressables).
- Liveness is conveyed by the status text, never the dot alone — keep "Live" in `status` whenever `live` is set.

## 8. Usage rules — Do / Don't

**Do**
- Pre-format `status` with the running clock (`'Live · 24:18'`) — the banner renders, the app ticks.
- Keep to ≤2 actions; primary first.
- Put "Live" in the `status` string whenever `live` (a11y — see §7).

**Don't**
- ✗ Don't wrap the header — long titles truncate by design; move detail to `subtitle`.
- ✗ Don't pass >3 stats expecting a grid — extras are dropped.
- ✗ Don't hand-roll the banner from `Card` + `Pulse` — the one-line header + stats + transport contract lives here.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** Any "session in progress" surface IS this component — import it.
- **New need → both platforms** (e.g. a dismiss affordance) with the same prop name.
- **Tokens only** (the dark-glass fill literal is the canonical matched value).
- **Parity gate.** Web phone-width banner ≡ native banner (truncation, stats hairlines, dot, buttons) before shipping.
