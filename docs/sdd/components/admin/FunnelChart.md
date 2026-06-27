# SDD — `FunnelChart` (+ `FunnelStep` type)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as:** `import { FunnelChart } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/FunnelChart.tsx` · web CSS `packages/ui/src/styles/components/funnel.css` (`.lk-funnel*`). NO native counterpart.
> **Exports:** `FunnelChart`, type `FunnelChartProps`, type `FunnelStep`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — operator console has no native surface.
> **Stories:** `packages/ui/src/stories/FunnelChart.stories.tsx`.

---

## 1. Overview

The operator **conversion-funnel** primitive: a vertical stack of proportional horizontal
bars where each bar's width is `∝ count / maxCount` (relative to the first/widest step).
Every step is tier-coloured from the Aurora spectrum and renders, **inside the bar**, the
count (display font) + conversion% (mono) with a drop-off pill pinned to the right.

It is the single sanctioned way to render a funnel in the admin console — mirrors the
`.funnel` block from `lockin90-design/admin/growth.html` (onboarding funnel) and
`content.html` (engagement). It is a **pure render** component (no client hooks, no state);
the caller supplies fully-computed `steps`.

- **`FunnelStep`** (secondary export) — one stage: `id`, `label`, optional `sublabel`,
  optional `icon` (`IconName`), `count`, `conversionPct` (vs first step), optional `dropPct`
  (omit on the first step), optional `tier` (spectrum index; defaults to row index).
- **Drop-off severity** is derived, not passed: `dropPct > 20` → `bad` tone (`▼`), else `warn`.
  The first step instead shows a neutral `— baseline` pill.

## 2. API contract

### `FunnelChartProps` (extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `steps` | `FunnelStep[]` | — | ordered widest (first) → narrowest (last) |
| `legend` | `boolean` | `false` | render the tier/threshold legend row below the funnel |
| `className` | `string` | — | merged onto `.lk-funnel` via `cn` |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | spread on the root `<div role="img">`; `children` is omitted |

### `FunnelStep`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | stable React key |
| `label` | `string` | stage name (e.g. "Verify email") |
| `sublabel` | `string?` | mono sub-line under the label |
| `icon` | `IconName?` | leading glyph (shared `Icon` set), 16px, tinted to the tier colour |
| `count` | `number` | absolute count reaching this stage |
| `conversionPct` | `number` | conversion vs first step, 0–100 |
| `dropPct` | `number?` | drop from previous step; omit on first step |
| `tier` | `number?` | spectrum tier index; defaults to the 0-based row index |

- Width is clamped `Math.max(0, Math.min(100, count/maxCount*100))%`; `maxCount` falls back to `1` for an all-zero set.
- `count` is formatted `toLocaleString('en-US')`; percentages render `toFixed(1)` (`12.3%`).
- Tier colour wraps via `tier % 6`, so any tier index renders a valid spectrum colour.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token / value |
| --- | --- |
| Spectrum tiers (`TIER_VARS`) | `--lime` `--mint` `--cyan` `--indigo` `--violet` `--magenta` (in order) — set inline as bar `background` + icon-tile `color` |
| Step gap | `8px`; row grid `196px 1fr`, column gap `14px` |
| Icon tile | `30px`, `--r-sm` radius, `1px --border-2`, `--glass-2` bg; glyph inherits tier `currentColor` |
| Label name | `--font` (default), `12.5px`/600, `--text`, ellipsised |
| Sublabel | `--font-mono`, `10px`, `--text-faint`, ellipsised |
| Track lane | `40px` tall, `--r-sm`, bg `rgba(255,255,255,.04)`, `overflow:hidden` |
| Fill bar | absolute, `--r-sm`, `opacity .9`; width + spectrum colour inline |
| Count | `--font-display`, `16px`/700, tabular-nums, `#fff` + `text-shadow` for legibility over the coloured bar |
| Conversion | `--font-mono`, `11px`, `rgba(255,255,255,.75)` + shadow |
| Drop pill | `--font-mono`, `11px`/600, `--r-pill`, `padding 2px 9px` |
| — baseline | `rgba(255,255,255,.22)` bg, dark text |
| — warn | `--warn` (78% mix) bg, `--bg-0` text |
| — bad | `--bad` (42% mix) bg + inset `--bad` 1px ring, `#fff` text, trailing `▼` |
| Legend | `--font-mono`, `10.5px`, `--text-faint`; swatches use `--lime` / `--warn` / `--bad` |

> The over-bar count/conversion/baseline use literal white/`rgba` values **by design** —
> they sit on an arbitrary spectrum colour and need fixed-contrast text/shadow, not a theme
> token. Every theme-able surface (tiers, tiles, drop tones) is token-driven.

## 4. States

| State | Behaviour |
| --- | --- |
| First step | drop column shows the neutral `— baseline` pill (`.lk-funnel-drop-base`) |
| Drop-off (watch) | `dropPct ≤ 20` → `.lk-funnel-drop-warn`, `−N.N%` |
| Drop-off (intervene) | `dropPct > 20` → `.lk-funnel-drop-bad`, `−N.N% ▼` |
| No `dropPct` (non-first) | drop pill omitted entirely |
| Legend off / on | `legend` toggles the `.lk-funnel-legend` row |
| Narrow (`≤560px`) | row grid collapses to one column — id stacks above the bar |
| Empty `steps` | renders an empty `.lk-funnel` container (no rows) |

No hover / focus / pressed / disabled — it is non-interactive (`role="img"`).

## 5. Platform & relationship to root kit

**Web-only by design.** The admin operator console ships only on web, so there is no native
`FunnelChart` and none is planned — the web≡native parity rule does not apply to `/admin`
primitives. It composes the root kit's `Icon` for step glyphs but is otherwise self-contained
(no root-primitive wrapper). It emits `lk-funnel*` classes whose CSS is folded into the shared
`dist/styles.css` (no extra import).

## 6. Composition & usage

- **Composes:** `Icon` (root kit) for the optional per-step glyph.
- **Used by:** admin Growth (onboarding signup → verify → … → activated funnel) and Content
  (engagement funnel) surfaces.
- **Caller owns the math** — compute `count`, `conversionPct`, `dropPct` upstream; the
  component only proportions and paints.

```tsx
import { FunnelChart, type FunnelStep } from '@lockin90/ui/admin';

const steps: FunnelStep[] = [
  { id: 'signup',   label: 'Signed up',   icon: 'user',  count: 12_480, conversionPct: 100 },
  { id: 'verify',   label: 'Verify email', sublabel: '6-digit code', icon: 'mail', count: 9_310, conversionPct: 74.6, dropPct: 25.4 },
  { id: 'activated',label: 'Activated',    icon: 'check', count: 7_905, conversionPct: 63.3, dropPct: 15.1 },
];

<FunnelChart steps={steps} legend />
```

## 7. Accessibility

- Root is `role="img"`; give it an `aria-label` (via `...rest`) summarising the funnel for
  screen readers — the in-bar numbers are visual only.
- The fill bar is `aria-hidden` (decorative); count/conversion/drop text is real DOM and read in order.
- Colour is **not** the sole signal: the drop tone is reinforced by the `▼` glyph and the
  `−N.N%` / `— baseline` text, and conversion is always a number.
- Contrast on the bar is guaranteed by the fixed white text + shadow, independent of tier colour.

## 8. Usage rules — Do / Don't

**Do**
- Pass steps **pre-sorted** widest → narrowest; the first step is the 100% reference.
- Provide `conversionPct` relative to the first step and `dropPct` relative to the previous step.
- Set `aria-label` on the chart describing what funnel it is.
- Use `tier` only to override the default spectrum order intentionally.

**Don't**
- ✗ Don't pass `dropPct` on the first step — it renders the `— baseline` pill automatically.
- ✗ Don't hardcode the spectrum, drop tones, radii, or fonts — they come from `@lockin90/tokens`.
- ✗ Don't compute width yourself — supply raw `count`; the component proportions it.
- ✗ Don't reach for this on native — it is `/admin` web-only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled "stacked proportional bars + drop pills" funnel re-creates
  this primitive and will drift from the spectrum/threshold conventions — import `FunnelChart`.
- **New need → extend here.** A different funnel shape or a new drop-severity band is a prop/
  variant on `FunnelChart`, not a one-off in an admin route.
- **Tokens only.** Tier colours, drop tones, radii, and fonts must stay token-sourced; the only
  literals are the deliberate over-bar contrast values documented in §3.
- **Threshold is canonical.** The `>20%` "intervene" cutoff lives here so every admin funnel
  flags drop-off identically — don't re-implement the bad/warn split in the consumer.
