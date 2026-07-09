# SDD — `FunnelChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> _Not to be confused with the **admin** `FunnelChart` (`@lockin90/ui/admin`, web-only) — see §1._
> **Source:** `packages/ui/src/components/FunnelChart.tsx` · `packages/ui-native/src/components/FunnelChart.tsx` ·
> web CSS `packages/ui/src/styles/components/funnelchart.css` (`.lk-fnl*`).
> **Exports:** `FunnelChart`, types `FunnelChartProps`, `FunnelStage`, `FunnelChartVariant`, `FunnelChartFill`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; `shine` is a CSS `drop-shadow` on web vs a Gaussian-blurred duplicate shape on native (`FeGaussianBlur`, real RN-SVG filters).
> **Stories:** `packages/ui/src/stories/FunnelChart.charts.stories.tsx` (`Charts/FunnelChart`) · `packages/ui-native/src/stories/FunnelChart.stories.tsx` (`Native/FunnelChart`).

---

## 1. Overview

The **catalog conversion-funnel family** (`lockin90-design/charts/funnel-charts.html`, FN-01/03/04/05) for product surfaces: four variants drawn in a fixed **320×150 viewBox** with mono catalog labels. `band-funnel` (default) is the classic centered symmetric trapezoid stack; the three bar variants render left-aligned stage bars with the conversion `%` after each bar and a coral per-stage drop-off label at the right — `zone-funnel` colors each bar by its conversion zone, `compare-funnel` layers thin current-period bars over previous-period ghost bars. Stage values are **normalized against the first stage** (the funnel top = 100%), so raw counts and 0–1 fractions both work.

**Relationship to the admin `FunnelChart`:** the operator variant at `@lockin90/ui/admin` (web-only, `.lk-funnel-*`, `FunnelStep` rows with icon/sublabel/count/conversionPct/dropPct, `Primitives/FunnelChart` story) **remains the funnel for admin surfaces** — richer per-step meta, HTML rows, no native twin. This shared component (`.lk-fnl-*`) is the design-catalog family for product surfaces (web + native). Same exported name, different entry points — they never collide.

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `stages` | `FunnelStage[]` | catalog 4-stage onboarding funnel | ✓ | ✓ | ordered, funnel top first |
| `variant` | `'band-funnel' \| 'bar-funnel' \| 'zone-funnel' \| 'compare-funnel'` | `'band-funnel'` | ✓ | ✓ | FN-01 / FN-03 / FN-04 / FN-05 |
| `fill` | `'tokens' \| 'glass'` | `'tokens'` | ✓ | ✓ | FN-01 SELECT — solid spectrum bands vs faint glass fill; only affects `band-funnel` |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption (e.g. `'ONBOARDING · THIS MONTH'`); omit → no caption |
| `shine` | `boolean` | `false` | ✓ | ✓ | soft color glow behind the bands/bars (catalog glow modifier) |
| `ghostLabel` | `string` | `'GHOST = LAST MONTH'` | ✓ | ✓ | bottom-right footer, `compare-funnel` only; `''` hides it |
| `ariaLabel` | `string` | `'Conversion funnel'` | ✓ | ✓ | accessible description (web `aria-label` / native `accessibilityLabel`) |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-fnl` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | spreads to the root `<div>`; the HTML `title` attr is repurposed as the caption prop |

**`FunnelStage`** — `{ label: string; value: number; prev?: number; color?: string }`:
- `value` — stage size; every stage's drawn fraction = `clamp01(value / stages[0].value)` (first stage ≤ 0 falls back to 1).
- `prev` — previous-period value (same units), the ghost bar in `compare-funnel`; omit per-stage → no ghost for that stage.
- `color` — per-stage token override (web `'var(--violet)'` / native `colors.violet`); **ignored by `zone-funnel`** (the zone owns the color, per the catalog).

Default stage palette (catalog `STAGES`, wraps for longer funnels): `--cyan` → `--mint` → `--lime` → `--zone-mid`.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · plot 298×120`.

| Element | Spec (both platforms) |
| --- | --- |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, letter-spacing `.06em` (native `0.5`) — title + ghost footer `--text-faint`, stage names `--text-dim`, `%` in the bar color, drop-offs `--zone-low` |
| Bands (FN-01) | width ≤ `plotW × 0.78` centered at x 160; band height `(plotH − 18) / n`, 4px gap; trapezoid top edge = previous stage's fraction. `tokens` fill: `fillOpacity 0.4`, stroke 1 / `glass` fill: `fillOpacity 0.14`, stroke 1.4 — stroke is the stage color at `strokeOpacity 0.8`. Center label `--text` (catalog's `#EAF0FF` → token); `glass` labels take the stage color |
| Bars (FN-03/04/05) | row height `plotH / n`; 96px right-anchored label gutter; bars start x 112, max width 180, `min 8`, `opacity 0.92`, h 12 / rx 6 (`compare`: h 7 / rx 3.5) |
| Ghost bars (FN-05) | h 5 / rx 2.5, above the thin bar — fill `rgba(255,255,255,0.14)`, the catalog's white-14%. **Deliberate non-token**: `--glass-2` (.075) is half as bright, `--border-2` (.16) is a border token — checked `tokens.css`, no equivalent |
| Drop labels | `−{round((1 − fracᵢ/fracᵢ₋₁)·100)}%` right-aligned at x 306, `--zone-low`; suppressed on the first stage and clamped at 0 (never renders a negative drop) |
| Zone colors (FN-04) | **funnel-page thresholds**: frac `> 0.6` → `--zone-high`, `> 0.4` → `--zone-mid`, else `--zone-low` (not the global `zoneOf` ≥0.62/≥0.38 — the catalog page's own `draw` is the spec here) |
| Shine | web: `.lk-fnl-shine` → `drop-shadow(0 0 6px var(--lk-fnl-glow))`, glow color set inline per shape; native: Gaussian-blurred duplicate shape behind (`FeGaussianBlur` stdDev 3) — bars @ `opacity 0.55`, band edges `strokeOpacity 0.8` |
| Sizing | web `.lk-fnl-svg`: `width 100%; height auto; overflow visible` (aspect kept by the viewBox); native root: `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | draws all stages of the chosen variant |
| Empty (`stages: []`) | renders the empty frame (+ `title` if given) — no bars, no crash |
| Missing `prev` | `compare-funnel` simply skips that stage's ghost |
| Rising stage | drop label clamps to `−0%` (fractions clamp 0–1; the funnel is assumed monotone) |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, data model, colors, and label layout (both compute from the same catalog constants). The real differences:

- **Shine substrate** — web uses the CSS `drop-shadow` filter (like `Ring`); native draws a **Gaussian-blurred duplicate shape** behind (bars @ 0.55, bands same fill+edge silhouette — `FeGaussianBlur stdDeviation 3`, see CONVENTIONS.md). Halo shape/intensity differs marginally; does not block use.
- **Label styling channel** — web styles `<text>` via `.lk-fnl-label` (CSS, `.06em`); native passes `fontSize/fontFamily/letterSpacing` props on `Svg.Text` (`0.5` ≈ `.06em` at 8.5px).
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Onboarding/conversion analytics, retention funnels, marketing surfaces.

```tsx
// web
<FunnelChart variant="zone-funnel" title="FUNNEL HEALTH"
  stages={[
    { label: 'SIGNED UP', value: 4210 },
    { label: 'CONNECTED DEVICE', value: 3031 },
    { label: 'FIRST SYNC', value: 2442 },
    { label: 'DAY-7 ACTIVE', value: 1431 },
  ]} />
```

```tsx
// native — identical props
<FunnelChart variant="compare-funnel" title="FUNNEL VS LAST MONTH"
  stages={[
    { label: 'SIGNED UP', value: 1, prev: 0.91 },
    { label: 'DAY-7 ACTIVE', value: 0.34, prev: 0.35 },
  ]} />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` (in-SVG text is decorative — the label carries the meaning). Pass a data-bearing `ariaLabel` ("Onboarding funnel, 34% day-7 active").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container (8.5 viewBox px ≈ 9.6px at 360w); keep charts ≥ ~300px wide or move critical numbers into surrounding real text.
- Color is not the only channel: every bar/band also prints its `%`, and drop-offs are printed values, not just color.

## 8. Usage rules — Do / Don't

**Do**
- Pass stage values in one consistent unit (all counts or all fractions) — the component normalizes against the first stage.
- Use `zone-funnel` when the verdict per stage matters; `compare-funnel` for period-over-period drift (with `prev` on every stage).
- Override stage colors with **tokens only** (`var(--violet)` / `colors.violet`).
- Reproduce catalog cards in tests/stories with the catalog data (see the stories) when checking parity.

**Don't**
- Don't use this for admin operator funnels with per-step icons/sublabels/counts — that's the admin `FunnelChart` (`@lockin90/ui/admin`).
- Don't pass pre-computed percentages AND expect per-stage drop math to differ — drops are always derived from consecutive stage fractions.
- Don't feed a non-monotone series and expect rising stages to be flagged — drops clamp at 0.
- Don't hardcode hex in `color` overrides, and don't restyle `.lk-fnl-label` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled funnels.** Any trapezoid-band or stage-bar funnel on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new funnel form (e.g. horizontal funnel) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — spectrum/zone/status/text tokens; the ghost's `rgba(255,255,255,0.14)` is the single documented exception (catalog value with no token equivalent) and lives inside the component, never in app code.
- **Don't fork the admin funnel into product code** (or vice versa): admin keeps `.lk-funnel-*`, product keeps `.lk-fnl-*`.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `funnel-charts.html`.
