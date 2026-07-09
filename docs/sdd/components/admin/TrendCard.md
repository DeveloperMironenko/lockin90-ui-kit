# SDD — `TrendCard` (admin)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as:** `import { TrendCard } from '@lockin90/ui/admin'`.
> **Renamed:** was `Sparkline` — it is a titled stat **card** (title + headline value + delta + area/line chart), not a bare inline sparkline, and the name clashed with the root cross-platform `Sparkline` primitive (`@lockin90/ui`). `admin/index.ts` keeps deprecated `Sparkline` / `SparklineProps` aliases for back-compat (existing admin-app imports keep working); prefer the new names.
> **Source:** `packages/ui/src/admin/TrendCard.tsx` · web CSS `packages/ui/src/styles/components/trendcard.css` (`.lk-trend*`). NO native counterpart.
> **Exports:** `TrendCard`, type `TrendCardProps`, type `SparkDeltaDir` (+ deprecated aliases `Sparkline`, `SparklineProps`).
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — operator console has no native surface.
> **Stories:** `packages/ui/src/stories/TrendCard.stories.tsx` (Storybook title `Admin/TrendCard`).

---

## 1. Overview

A **titled 7-day area+line mini-chart card** for the operator overview: an uppercase mono
`title`, a big headline `value` with an optional colour-coded `delta`, and a self-scaling
area+line chart below (pure inline SVG, no chart lib). Mirrors the `.chart-card` /
`.chart-svg` / `.chart-line` / `.chart-area` block from `lockin90-design/admin/overview.html`.

It is the single sanctioned way to render an overview trend card in the admin console. It is a
**pure render** component (no client hooks, no state); the caller supplies the fully-computed
`points` series and pre-formatted `value` / `delta` strings.

> **Not a `Sparkline`.** The root `@lockin90/ui` `Sparkline` is a decorative, chrome-less inline
> micro-trend (just the line). `TrendCard` is a full card with title/value/delta/axis chrome. The
> rename disambiguates the two.

## 2. API contract

### `TrendCardProps`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | — | uppercase mono title, e.g. `"Signups · 7d"` |
| `value` | `string` | — | big headline value, e.g. `"312"`, `"41.2k"`, `"0.3%"` |
| `delta` | `string?` | — | optional small delta next to the value, e.g. `"+18%"` |
| `deltaDir` | `SparkDeltaDir` = `'up' \| 'down' \| 'flat'` | `'flat'` | colours the delta: up=green, down=red, flat=faint |
| `points` | `number[]` | — | series values, chronological; rendered as area + line, auto-scaled |
| `color` | `string` | — | line/area stroke colour; area is the same colour at low opacity |
| `xLabels` | `string[]?` | — | x-axis tick labels under the chart (e.g. `['Mon','Wed','Fri','Sun']`) |
| `ariaLabel` | `string?` | `` `${title}: ${value}` `` | accessible summary of the trend for the chart `<svg role="img">` |
| `className` | `string?` | — | merged onto the root `.lk-trend` via `cn` |

- Chart box is a fixed `300 × 92` viewBox with `preserveAspectRatio="none"` (stretches to the card
  width). `points` are auto-scaled to the box (`max` → top, with 6px head/foot room).
- `value` and `delta` are rendered as-supplied — **the caller formats them** (no locale/number
  formatting inside the component).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token / value |
| --- | --- |
| Card | `.lk-trend` — glass card chrome (padding, `--r-*`, `1px --border`, `--glass` bg) |
| Title | `.lk-trend-t` — `--font-mono`, uppercase, `--text-faint` |
| Value | `.lk-trend-v` — `--font-display`, `--text` |
| Delta up/down/flat | `.lk-trend-delta--{up\|down\|flat}` — up `--zone-high`/green, down `--zone-low`/red, flat `--text-faint` |
| Grid lines | `.lk-trend-grid` — faint horizontal rules at y=22/46/70 |
| Line | `.lk-trend-line` — `stroke={color}`, no fill |
| Area | `.lk-trend-area` — `fill=url(#grad)`, `color` → transparent vertical gradient |
| Axis | `.lk-trend-axis` — `xLabels` row under the chart, `--text-faint` mono |

- The `color` prop is passed inline (the caller picks a tone token value); the area gradient
  derives from it. Every theme-able surface (card chrome, title/value/delta/axis text, grid) is
  token-driven in `trendcard.css`.

## 4. States

| State | Behaviour |
| --- | --- |
| No `delta` | headline value only (no delta chip) |
| Delta up | `.lk-trend-delta--up` (green) |
| Delta down | `.lk-trend-delta--down` (red) |
| Delta flat | `.lk-trend-delta--flat` (faint) |
| No `xLabels` | axis row omitted |
| Empty `points` | line/area paths are empty (chart draws nothing) — card chrome + value still render |

No hover / focus / pressed / disabled — it is non-interactive (chart is `role="img"`).

## 5. Platform & relationship to root kit

**Web-only by design.** The admin operator console ships only on web, so there is no native
`TrendCard` and none is planned — the web≡native parity rule does not apply to `/admin`
primitives. It is self-contained (no root-primitive wrapper).

> **Class-namespace fix (`lk-spark*` → `lk-trend*`).** `TrendCard`'s classes and stylesheet were
> **renamed** to stop a real collision, not just a component-name disambiguation: this card
> originally emitted `.lk-spark`, `.lk-spark-line`, `.lk-spark-area`, etc. from a file named
> `sparkline.css` — the **same class names** the root cross-platform `Sparkline` primitive emits
> from `spark.css` (`.lk-spark`, `.lk-spark-line`, `.lk-spark-area`). Both stylesheets are bundled
> globally into `dist/styles.css` (there is no per-app CSS scoping in this kit), so whichever rule
> landed last in the cascade won — the admin card's chrome/sizing rules leaked onto the root
> `Sparkline`'s bare inline SVG (and vice versa) on any surface that loaded both. That this never
> visibly broke prod was luck-of-app-composition (admin renders `TrendCard`, consumer apps render
> `Sparkline`, and no single page happened to render both), not a property the CSS guaranteed.
>
> **Fix:** every class this component emits was renamed `lk-spark*` → `lk-trend*`
> (`.lk-trend`, `.lk-trend-head`, `.lk-trend-t`, `.lk-trend-v`, `.lk-trend-delta` incl.
> `--up`/`--down`/`--flat`, `.lk-trend-svg`, `.lk-trend-grid`, `.lk-trend-line`, `.lk-trend-area`,
> `.lk-trend-axis`) in both the component (`TrendCard.tsx`) and its CSS, and the stylesheet **file**
> was renamed `sparkline.css` → `trendcard.css` to match. The root `Sparkline` and its `spark.css`
> (`.lk-spark`, `.lk-spark-line`, `.lk-spark-area`, `.lk-spark-dot`) are untouched — after this
> rename the two namespaces no longer overlap at all, so the collision is closed for good rather
> than merely unobserved. **The component's public API (`TrendCardProps`) did not change** — this
> is a pure internal class/file rename, invisible to callers.

## 6. Composition & usage

- **Composes:** none (self-contained SVG).
- **Used by:** admin overview charts row (signups, active users, churn, revenue trend cards).
- **Caller owns the math + formatting** — supply the raw `points` series and pre-formatted
  `value` / `delta` strings; the component only scales and paints.

```tsx
import { TrendCard } from '@lockin90/ui/admin';

<TrendCard
  title="Signups · 7d"
  value="312"
  delta="+18%"
  deltaDir="up"
  points={[180, 210, 205, 240, 265, 290, 312]}
  color="var(--mint)"
  xLabels={['Mon', 'Wed', 'Fri', 'Sun']}
/>
```

## 7. Accessibility

- The chart `<svg>` is `role="img"` with `aria-label={ariaLabel ?? `${title}: ${value}`}` — the
  trend line conveys no value to AT on its own; the label + real DOM title/value carry the meaning.
- Colour is not the sole signal: the delta direction is reinforced by the `+`/`-` sign in the
  `delta` string, and the headline value is always real text.
- Contrast: title is faint by design (de-emphasis); keep `value` the high-contrast focal element.

## 8. Usage rules — Do / Don't

**Do**
- Pass `points` chronologically (oldest → newest).
- Pre-format `value` / `delta` (locale, units, sign) upstream.
- Match `color` to the metric's tone token; use `deltaDir` to colour the delta.
- Set a descriptive `ariaLabel` when the default `title: value` isn't enough.

**Don't**
- ✗ Don't reach for `TrendCard` when you need a chrome-less inline micro-trend — use the root
  `Sparkline`.
- ✗ Don't hardcode the card chrome, title/value/delta tones, or grid — they come from
  `@lockin90/tokens`.
- ✗ Don't compute the SVG geometry yourself — supply raw `points`; the component scales them.
- ✗ Don't reach for this on native — it is `/admin` web-only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled title+value+area-chart card re-creates this primitive and will
  drift from the overview chart conventions — import `TrendCard`.
- **New need → extend here.** A new delta band, a multi-series overlay, or a comparison ghost is a
  prop/variant on `TrendCard`, not a one-off in an admin route.
- **Tokens only.** Card chrome, delta tones, grid, and axis text must stay token-sourced; `color`
  is a caller-supplied token value.
- **Deprecated alias.** `Sparkline` / `SparklineProps` from `@lockin90/ui/admin` still resolve to
  `TrendCard` for back-compat but are deprecated — migrate imports to `TrendCard`.
