# SDD — `PhaseWheel` (+ `PhaseArc`, `PhaseMarker` types)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/PhaseWheel.tsx` · `packages/ui-native/src/components/PhaseWheel.tsx` ·
> web CSS `packages/ui/src/styles/components/phasewheel.css` (`.lk-pw*`).
> **Exports:** `PhaseWheel`, type `PhaseArc`, type `PhaseMarker`, type `PhaseWheelProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & arc math (SVG dashoffset, both rotate −90°); label overflow handled by CSS `padding`/`overflow:visible` (web) vs an expanded canvas `PAD` (native); colors `var()` vs hex.
> **Stories:** `packages/ui/src/stories/PhaseWheel.stories.tsx` · `packages/ui-native/src/stories/PhaseWheel.stories.tsx`.

---

## 1. Overview

A **circular 24-hour circadian clock** — a faint full track ring with colored **phase bands** (sleep / focus / dip / wind-down), **hour ticks** (longer + brighter + labeled at the quarters 0/6/12/18), point **markers** on the ring, an optional **"now" hand** from center to the ring, and centered content (the formatted current time, or `'24h'` when `now` is hidden). Hour 0 (midnight) sits at the top; time runs clockwise.

Secondary type exports:
- **`PhaseArc`** = `{ from, to, color, label? }` — a phase band drawn clockwise `from → to` (hours 0..24); `from > to` wraps through midnight (e.g. 23→7).
- **`PhaseMarker`** = `{ at, color?, label? }` — a dot on the ring at hour `at`, with an optional label just outside.

The only sanctioned circadian/24h clock; for sleep architecture use `Hypnogram`, for a generic dial use `Gauge`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `arcs` | `PhaseArc[]` | `DEFAULT_ARCS` (sleep/focus/dip/wind-down) | ✓ | ✓ | colored phase bands |
| `markers` | `PhaseMarker[]` | `DEFAULT_MARKERS` (Wake @7, Melatonin @21) | ✓ | ✓ | point markers on the ring |
| `now` | `number \| null` | `14.5` | ✓ | ✓ | "now" hour → hand + tip dot + center clock; `null` hides the hand (center shows `'24h'`) |
| `size` | `number` | `200` | ✓ | ✓ | ring diameter in px |
| `thickness` | `number` | `16` | ✓ | ✓ | ring stroke width in px |
| `hourTicks` | `boolean` | `true` | ✓ | ✓ | hour ticks + cardinal labels |
| `children` | `ReactNode` | — | ✓ | ✓ | center content; omit → formatted `now` clock or `'24h'` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only (wrapper) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only |

- **Geometry (identical both sides):** `r = (size−thickness)/2`, `circ = 2πr`. Bands are dasharray arcs on a circle rotated −90° so hour 0 is at top: `len = (arcSpanHours/24)·circ`, `offset = −(from/24)·circ`. `arcSpanHours(from,to) = ((to−from+24) % 24) || 24`. Ticks/markers/labels use `hourPoint(c, r, h)` (`deg = h/24·360 − 90`). `now` hand runs center → `hourPoint(c, r, now)`; `formatHour()` renders the center clock (e.g. `2:30p`).
- **Center default:** `children ?? (nowLabel ?? '24h')`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Track ring | `stroke "rgba(255,255,255,0.07)"`, round caps | same |
| Phase arcs | `.lk-pw-arc` `stroke = arc.color`, round caps | `stroke = arc.color`, round caps |
| Minor tick | `.lk-pw-tick` `stroke var(--border-2)` 1.5 | `stroke colors.border2` 1.5 round |
| Major tick (0/6/12/18) | `.lk-pw-tick-major` `stroke var(--text-dim)` 2 | `stroke colors.textDim` 2 round |
| Cardinal labels | `.lk-pw-card` `9px var(--font-mono)` `var(--text-dim)` | `fonts.mono 9` `colors.textDim` |
| Now hand | `.lk-pw-hand` `stroke var(--text)` 2 opacity .85 + `.lk-pw-hand-dot` fill `var(--text)` | `stroke colors.text` 2 opacity 0.85 + dot fill `colors.text` |
| Marker dot | `.lk-pw-marker` `fill = color ?? var(--accent)`, r `4` + `drop-shadow` | `fill = color ?? colors.accent`, r `4` |
| Marker label | `.lk-pw-marker-label` `9px var(--font-mono)` `var(--text-faint)` | `fonts.mono 9` `colors.textFaint` |
| Clock | `.lk-pw-clock` `30px`, `lk-display` (`var(--font-display)`), `ls −.02em` | `fonts.display 30`, `ls −0.5`, `colors.text` |
| Label room | `.lk-pw { padding: 32px; }` + `.lk-pw-svg { overflow: visible }` | `PAD = 46` → canvas `size + 92`, viewBox padded |

- Default arcs: sleep `#6E7BFF` (indigo, 23→7), focus `#34F5C5` (mint, 9→12), dip `#FFB020` (warn, 14→16), wind-down `#A855F7` (violet, 21→23). Default markers Wake `#22D3EE` @7, Melatonin `#A855F7` @21.
- **Web-only motion:** `.lk-pw-arc` animates `stroke-dasharray`/`stroke-dashoffset` `0.7s var(--ease)`. Native has no arc transition.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | track + arcs + ticks + markers + now hand + clock | same |
| `now = null` | hand hidden, center shows `'24h'` | same |
| `hourTicks=false` | ticks + cardinal labels omitted | same |
| Custom center | `children` replaces the clock | same |
| Wrapping arc | `from > to` spans midnight | same |
| Zero-span arc | `len ≤ 0` → `null` | same |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & geometry; label-overflow strategy + color literal differ.** The arc/tick/marker/hand math is identical (shared `arcSpanHours`/`hourPoint`/`formatHour`, same `−90°` rotation, same dasharray/offset), with the same defaults (`size 200`, `thickness 16`, `now 14.5`, the four phase arcs, the two markers). Differences are substrate-only:

- **Label overflow:** RN SVG **hard-clips** at its bounds (no `overflow:visible`), so native expands the canvas by `PAD = 46` (drawing into a `size + 92` viewBox) to keep the cardinal + marker labels from clipping. Web instead uses CSS `padding: 32px` (content-box) + `.lk-pw-svg { overflow: visible }`. Same visual; the native wrapper box is larger by the pad — account for it in layout.
- **Color literal:** web arc/marker colors may be CSS `var()`; native needs resolved hex/rgb. App code reads 1:1.
- **Polish:** web adds a soft `drop-shadow` on the SVG/markers + the arc transition; native omits both. Minor label-radius offsets (web `+16`/`+20`, native `+14`/`+16`).

No capability gap — fully usable on both.

## 6. Composition & usage

- **Used for:** the circadian / "your day" clock card — sleep window, focus peak, afternoon dip, wind-down, with a live "now" hand.
- **Composes from:** nothing — leaf primitive. Pass a `GradientText`/`Stat` as `children` for a custom center; build a phase legend from `KeyValue`/`Chip` using each arc's `label` + `color`.

```tsx
// web
<PhaseWheel
  arcs={[
    { from: 23, to: 7, color: 'var(--indigo)', label: 'Sleep' },
    { from: 9, to: 12, color: 'var(--mint)', label: 'Peak focus' },
  ]}
  markers={[{ at: 7, color: 'var(--cyan)', label: 'Wake' }]}
  now={14.5}
/>

// native (resolved hex colors)
<PhaseWheel
  arcs={[
    { from: 23, to: 7, color: colors.indigo, label: 'Sleep' },
    { from: 9, to: 12, color: colors.mint, label: 'Peak focus' },
  ]}
  now={null}
/>
```

## 7. Accessibility

- **Web:** the root `<div>` has `role="img"` + an auto-built `aria-label` listing the current time (when `now`) and each arc's `label` (e.g. "24-hour phase wheel, now 2:30p: Sleep, Peak focus."). The inner `<svg>` is `aria-hidden`. Provide `label` on every arc so this reads.
- **Native:** no built-in label — wrap in a `View` with `accessibilityRole="image"` + `accessibilityLabel`.
- Clock/text use `var(--text)`/`colors.text`; phase colors should come from the spectrum/`--zone-*` tokens for recognizability.

## 8. Usage rules — Do / Don't

**Do**
- Use 24h `from`/`to` hours; let `from > to` wrap midnight (don't split a sleep band).
- Provide `label` on arcs (drives the web a11y label + any legend).
- Pass `now={null}` to show a static `'24h'` reference (no hand).
- Account for the native canvas pad (`size + 92`) when laying it out.

**Don't**
- ✗ Don't hand-roll a 24h ring clock — use `PhaseWheel`.
- ✗ Don't pass CSS `var()` colors on native (RN SVG can't resolve them) — pass hex.
- ✗ Don't use it for sleep architecture (use `Hypnogram`) or a generic min/max dial (use `Gauge`).
- ✗ Don't hardcode the arc/tick/marker colors — source them from tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom dasharray ring clock duplicates this primitive — import `PhaseWheel`.
- **New need → add to BOTH platforms.** Need an animated sweeping hand, gradient arcs, or marker tooltips? Add it to web and native with the same prop name + tokens — never a one-off.
- **Tokens only.** Arc/tick/marker/clock colors come from `@lockin90/tokens`; hardcoded hexes break on Aurora Flux renames.
- **Parity gate.** Before shipping, confirm the web phone-width and native wheels show the same arcs, ticks, markers, now-hand, and center clock — only the label-overflow box size, the web glow/transition, and the color-literal form may differ.
