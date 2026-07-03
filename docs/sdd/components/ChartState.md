# SDD — `ChartState`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ChartState.tsx` · `packages/ui-native/src/components/ChartState.tsx` ·
> no web CSS partner — all styling is inline SVG attributes (`.lk-chartstate` on the root + `.lk-chartstate-cta` on the pill are bare hook classes).
> **Exports:** `ChartState`, types `ChartStateProps`, `ChartStateVariant` — **not yet re-exported from either `src/index.ts`** (the charts-program export wave lands separately).
> **Status:** Built. **Parity:** 🟡 same API & geometry; the partial-sync pulse is a SMIL expanding ring + `drop-shadow` on web vs a static dot + faint halo on native, glows are `blur()` vs wider faint duplicates, and the CTA pill is an SVG `role="button"` (click + Enter/Space) vs a react-native-svg `onPress` group.
> **Stories:** `packages/ui/src/stories/ChartState.stories.tsx` (`Charts/ChartState`) · `packages/ui-native/src/stories/ChartState.stories.tsx` (`Native/ChartState`).

---

## 1. Overview

The **catalog chart-states family** (`lockin90-design/charts/state-charts.html`, SV-01…SV-06) — the non-data states every chart card needs, drawn **at real chart geometry** (the same fixed 320×150 viewBox as the data charts) so nothing shifts when data lands. Six variants: the static skeleton, the sync spinner that says *what* is syncing, the empty state with the next action, the locked forecast with progress toward unlock, the fetch error with RETRY, and the honest partial-sync line. The catalog page's headline rule is baked in: **these states are identical on web and mobile** (parity rule). The CTA/RETRY pill takes an `onCtaPress` handler on both platforms.

Catalog-ID mapping:

| Catalog ID | `variant` | Key props (defaults = the card) |
| --- | --- | --- |
| SV-01 skeleton-chart | `'skeleton-chart'` (default) | `bars` ×9 heights · `caption` note |
| SV-02 loading-ring | `'loading-ring'` | `message 'LOADING DATA…'` · `detail 'SYNCING WHOOP + OURA'` |
| SV-03 empty-cta | `'empty-cta'` | `ghostBars` ×3 · `message` reason · `cta 'LOG YOUR FIRST MEAL'` + `onCtaPress` (filled mint pill) |
| SV-04 locked-forecast | `'locked-forecast'` | `data` ghost curve · `message` (derived from `total`) · `progress 3` / `total 7` dots |
| SV-05 error-retry | `'error-retry'` | `message` reason · `cta 'RETRY'` + `onCtaPress` (coral outline pill) |
| SV-06 partial-sync | `'partial-sync'` | `data` line · `syncedIndex 8` · `pendingLabel 'SYNC PENDING'` · `caption` note |

## 2. API contract

Same prop API on both platforms (including `onCtaPress` — the kit's cross-platform `on*Press` convention, like `TabBar.onFabPress`); only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | 6-name union (§1) | `'skeleton-chart'` | ✓ | ✓ | picks the state |
| `title` | `string` | per-variant | ✓ | ✓ | top-left mono caption: LOADING / SYNCING / NO DATA / NOT ENOUGH DATA / ERROR / PARTIAL DATA |
| `message` | `string` | per-variant | ✓ | ✓ | the plain-words reason line (`--text-dim`); locked derives `FORECAST UNLOCKS AT ${total} DAYS OF DATA` |
| `detail` | `string` | `'SYNCING WHOOP + OURA'` | ✓ | ✓ | loading-ring second line — what is actually syncing; `''` hides |
| `caption` | `string` | per-variant | ✓ | ✓ | faint bottom note (skeleton + partial-sync); `''` hides |
| `cta` | `string` | `'LOG YOUR FIRST MEAL'` / `'RETRY'` | ✓ | ✓ | pill text (empty-cta filled · error-retry outline); `''` hides the pill |
| `ctaColor` | `string` | `--mint` / `--zone-low` | ✓ | ✓ | pill tint |
| `onCtaPress` | `() => void` | — | ✓ | ✓ | pill handler — web: SVG `<g role="button" tabIndex={0}>` (click + Enter/Space); native: `<G onPress accessibilityRole="button">` |
| `bars` | `number[]` | catalog 9 heights | ✓ | ✓ | skeleton placeholder bars 0–1 (drawn at 80% plot height, middle bar brighter) |
| `ghostBars` | `number[]` | `[0.35, 0.55, 0.45]` | ✓ | ✓ | empty-cta dashed outlines 0–1 |
| `data` | `number[]` | wave-5 ×12 / wave-9 ×14 | ✓ | ✓ | locked ghost curve / partial line, 0–1 (the catalog's seeded waves, ported PRNG) |
| `progress` | `number` | `3` | ✓ | ✓ | locked — days collected (clamped to `total`); mint dots + `${progress}/${total}` |
| `total` | `number` | `7` | ✓ | ✓ | locked — days required; dots row centers on x 160 |
| `syncedIndex` | `number` | `8` | ✓ | ✓ | partial — index of the last synced point (clamped); solid through it, dashed after, shaded region + pulse + chip at it |
| `pendingLabel` | `string` | `'SYNC PENDING'` | ✓ | ✓ | partial chip (amber); `''` hides |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay: spinner arc / CTA pill / error triangle / sync pulse |
| `width` / `height` | `number` | `320` / `150` | ✓ | ✓ | rendered px — the viewBox scales to fit |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-chartstate` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children'>` | — | ✓ | — | spreads to the root `<svg>` |

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units (`W 320 · H 150 · pad l10 r12 t16 b14`); grid = 3 rules `white-5%` + baseline `white-9%`.

| Element | Spec (both platforms) |
| --- | --- |
| Labels / chips | `--font-mono` 8.5 (chips 8, pill 9), tracking `.06em`/`.05em`/`.08em` (native `0.5`/`0.4`/`0.7`); reasons `--text-dim`, notes `--text-faint`; chip = rect h13 rx6.5 `rgba(8,10,18,0.78)` + tinted hairline @ 0.35 |
| Skeleton | title stub 64×8 rx4 `white-7%` + legend stub 54×8 `white-5%` at y 22; 9 bars 20 wide, pitch 32, rx3, `white-6.5%` (middle bar `white-10%`) — **no shimmer, ever** |
| Loading ring | arc r22 at (160, 70): track 0→300° `white-30%` w3.5 round + progress 0→70° `--mint` w3.5 round (static — the catalog draws no spin) |
| Ghost bars | 11 wide, pitch 16 at x 138, rx2.5, stroke `white-22%` 1.2 dashed `3 3`, no fill |
| CTA pill | h24 rx12, width `len·5 + 58` (catalog: 152/84), centered x 160 — filled: fill `ctaColor` @ 0.14 · outline: fill `white-4%`; both stroke `ctaColor` @ 0.55 w1; 9px mono text in `ctaColor` |
| Locked | ghost curve `white-16%` w2 dashed `4 5` (monotone smooth); progress dots r3, pitch 10, centered on x 160 at y 74 — done `--mint`, rest `white-12%`; `n/m` readout `--mint` |
| Error mark | triangle `M160 44l16 27h-32z` stroke `--zone-low` 1.6 round-join + exclamation (line 54→62 + dot r0.9) |
| Partial sync | solid `--mint` 2.2 round through `syncedIndex`; dashed `white-18%` 1.6 `3 4` after; pending region rect `white-3%` from the cut to the right edge; pulse dot r3.6 `--zone-mid`; amber chip at (cut+10, 30) |
| Shine | web `blur(3–6px)` duplicates (arc w8 @ 0.3, pill @ 0.35, triangle fill @ 0.3, pulse r8 @ 0.35); native wider duplicates without blur (pill +6 @ 0.18, triangle inflated @ 0.18, pulse r9 @ 0.25) |

## 4. States

This component **is** the states — its own interactive surface is only the pill.

| State | Behavior |
| --- | --- |
| Default | bare `<ChartState variant="…"/>` reproduces the catalog card |
| Pill + `onCtaPress` | web: focusable `role="button"`, pointer cursor, Enter/Space activate; native: pressable `G` with `accessibilityRole="button"` |
| Pill without handler | renders as a static visual (no role/tabIndex/cursor) |
| `cta=''` | no pill (reason line only) |
| Empty `data`/`bars` | grid + captions render; curves/bars skipped, partial pulse hidden — no crash |
| `syncedIndex` ≥ last index | fully solid line, no dashed tail (region/pulse sit on the last point) |
| Web `aria-busy` | `skeleton-chart` + `loading-ring` set `aria-busy="true"` on the root |
| Reduced motion (web) | skeleton is static by design ("NO SHIMMER"); the **partial-sync SMIL pulse animates regardless** (SMIL can't be CSS-gated) — the only moving part in the family |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, copy, colors, defaults and the same seeded default data (both port the catalog PRNG). The real differences:

- **CTA activation substrate** — web an SVG group with `role="button"`, `tabIndex={0}`, click + Enter/Space and a pointer cursor; native a react-native-svg `<G onPress>` with `accessible`/`accessibilityRole="button"`. Same prop (`onCtaPress`), same visual.
- **Partial-sync pulse** — web SMIL expanding ring + `drop-shadow`; native a **static dot + faint halo ring** (r 7 @ 0.4), the `Ring` precedent. Motion-only diff.
- **Shine substrate** — web `blur()` underlays; native wider faint duplicates (no filters).
- **`aria-busy`** — web-only (no direct RN equivalent; the computed label carries "loading").
- **Container** — web `svg[role=img]` + `className`/SVGProps rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

The **state layer of every chart card**: render it in place of the chart (same `Card` slot, same width/height) while data is loading / missing / stale — geometry parity means zero layout shift when you swap the real chart in. Pair `empty-cta`'s pill with the surface's primary action and `error-retry`'s with the refetch.

```tsx
// web — the fetch triad around a LineChart card
{isLoading ? <ChartState /> :
 error ? <ChartState variant="error-retry" message="COULDN'T LOAD ENERGY DATA" onCtaPress={refetch} /> :
 data.length === 0 ? <ChartState variant="empty-cta" message="NO MEALS LOGGED YET"
   cta="LOG YOUR FIRST MEAL" onCtaPress={openLog} /> :
 <LineChart data={data} />}
```

```tsx
// native — SV-06: identical props
<ChartState variant="partial-sync" data={day.map((v) => v / 100)}
  syncedIndex={lastSyncedIdx} pendingLabel="SYNC PENDING" />
```

## 7. Accessibility

- **Web:** root `<svg role="img">` with a computed per-variant `aria-label` (e.g. `"NOT ENOUGH DATA: 3 of 7 days collected"`); loading variants add `aria-busy="true"`. The pill (with a handler) is a real tab stop: `role="button"` + `aria-label` = the pill text, Enter/Space activate.
- **Native:** root `View accessibilityRole="image"` + the same label; the pill group is `accessible` with `accessibilityRole="button"`.
- The reasons are drawn in 8.5 viewBox px — at very small rendered widths surface the same message as real text nearby.
- Skeleton has **no shimmer by design** (reduced-motion safe); the partial-sync SMIL pulse is the family's only animation and does not honor `prefers-reduced-motion` (§4).

## 8. Usage rules — Do / Don't

**Do**
- Match the ChartState's `width`/`height` to the chart it replaces — no layout shift is the whole point (SV-01's spec line).
- Say **what** is syncing (`detail`) and **why** it's empty/locked (`message`) in plain words — the catalog's copy is the tone template (short, uppercase, honest).
- Wire `onCtaPress` on every `empty-cta`/`error-retry` — a dead CTA pill is worse than none (`cta=''` if there's truly no action).
- Use `partial-sync` when a device lags — show what you have honestly (solid) vs pending (dashed); keep `data` 0–1.
- Keep the pill text short (≤ ~20 chars) — width grows with it and clamps into the canvas.

**Don't**
- Don't add shimmer/spin animations to the skeleton or the loading arc — the family is deliberately static (reduced-motion rule from the catalog).
- Don't fake zeros while syncing — that's exactly what `partial-sync`/`skeleton-chart` exist to avoid.
- Don't hand-roll empty/error cards for chart slots with `EmptyState`/`Alert` — those are page-level primitives; **chart-geometry** states are this component.
- Don't hardcode hex in `ctaColor` — mint for actions, `--zone-low` for errors, `--zone-mid` for pending.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled chart states.** Any loading/empty/locked/error/partial rendering inside a chart card is this component — never a local SVG/DOM lookalike, never a bare spinner in a chart slot.
- **New state → both platforms.** A new non-data state (e.g. a permissions-needed card) is added to the `variant` union here, web + native in the same unit of work, same prop names — never a one-off in an app.
- **Tokens only** — `--mint`/`--zone-low`/`--zone-mid` + text tokens; the skeleton/ghost alphas (6.5–30%) live **inside** the component.
- **Don't re-derive the geometry** (ring at (160, 70) r22, pill h24 rx12 at y 116/120, dots pitch 10 on x 160, triangle at (160, 44)) in app code — the component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `state-charts.html` — this family IS the parity rule's poster child.
