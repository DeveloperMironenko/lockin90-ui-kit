# SDD — `SupplementChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SupplementChart.tsx` · `packages/ui-native/src/components/SupplementChart.tsx` ·
> web CSS `packages/ui/src/styles/components/supplement.css` (`.lk-supp*`).
> **Exports:** `SupplementChart`, types `SupplementChartProps`, `SupplementChartVariant`, `SupplementRow`, `SupplementSeries`, `SupplementVessel`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; glows blur on both (web CSS `blur` / native `FeGaussianBlur` Fabric filters); the pulse ring animates on web (SMIL) vs a static halo on native.
> **Stories:** `packages/ui/src/stories/SupplementChart.stories.tsx` (`Charts/SupplementChart`) · `packages/ui-native/src/stories/SupplementChart.stories.tsx` (`Native/SupplementChart`).

---

## 1. Overview

The **catalog supplement-level family** (`lockin90-design/charts/supplement-charts.html`, SP-01…SP-10): saturation, decay and adherence — what's actually in the system. Nine variants in a fixed **320×150 viewBox**. The level variants share the zone level-band frame (SATURATED ≥ 0.72 / LOW < 0.35, 5% washes) and the catalog **saturation model** (`level += (1−level)·kUp` per dose, `level ×= (1−kDown)` per missed day) so real dose logs drive the story. The battery variants render the signature **liquid vessels**: battery cap + glass body + wavy two-Q-curve liquid surface (clipped to the body) + surface highlight + clipped bubbles + zone-colored vertical-gradient fill + a centered mono % that **inverts to bg-0 when submerged**.

Catalog-ID mapping (**SP-08 does not exist** — a numbering gap in the catalog):

| Catalog ID | Props | Card |
| --- | --- | --- |
| SP-01 `saturation-story` | `variant="saturation-story"` (default) + `doses` | level builds to SATURATED → coral MISSED window → rebuilds · dose dots · today pulse |
| SP-02 `active-stack` | `variant="active-stack"` + `rows` | 4 rows: name + level bar + % + status pill |
| SP-03 `half-life` | `variant="half-life"` + `halfLifeH`/`nowH`/`doseMg` | exponential decay + NOW pulse + STILL ACTIVE pill |
| SP-04 `dose-level` | `variant="dose-level"` + `doses` | dose dots + faint intake stems + level line + key pill |
| SP-05 `depletion-forecast` | `variant="depletion-forecast"` + `levels`/`decayRate` | solid past · dashed projection · LOW crossing pulse + restock pill |
| SP-06 `adherence-level` | `variant="adherence-level"` + `doses` | taken/missed cells strip + resulting cyan level line + pill |
| SP-07 `stack-levels` | `variant="stack-levels"` + `series` | 3 level curves with different kinetics + pills |
| SP-09 `liquid-batteries` | `variant="liquid-batteries"` + `vessels` | 5 battery vessels in a bar-chart row |
| SP-10 `battery-hero` | `variant="battery-hero"` + `level` + hero props | one large 56px vessel + FULL/LOW ticks + right stats |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `SupplementChartVariant` | `'saturation-story'` | ✓ | ✓ | the nine catalog forms |
| `doses` | `boolean[]` | catalog creatine story | ✓ | ✓ | per-day adherence, oldest → newest; drives the model + dots/cells (SP-01/04/06) |
| `levels` | `number[]` | — | ✓ | ✓ | explicit 0–1 series (overrides the model); the PAST for SP-05 |
| `kUp` / `kDown` | `number` | `0.32` / `0.18` | ✓ | ✓ | saturation model rates (catalog values) |
| `rows` | `SupplementRow[]` | catalog 4 rows | ✓ | ✓ | SP-02; first four drawn |
| `series` | `SupplementSeries[]` | catalog kinetics trio | ✓ | ✓ | SP-07; first three drawn |
| `vessels` | `SupplementVessel[]` | catalog 5 tanks | ✓ | ✓ | SP-09; first five drawn; bubbles when `level > 0.3` |
| `level` | `number` | `0.78` | ✓ | ✓ | SP-10 hero vessel fill 0–1 (also the big %) |
| `halfLifeH` / `windowH` / `nowH` / `doseMg` | `number` | `5` / `12` / `6.5` / `200` | ✓ | ✓ | SP-03 decay `0.5^(t/t½)`, x-window, NOW hours, dose mg |
| `doseLabel` / `nowNote` | `string` | derived from `doseMg` | ✓ | ✓ | SP-03 pills (`DOSE n MG` / `STILL ACTIVE · n MG`) |
| `projectDays` / `decayRate` / `lowThreshold` | `number` | `14` / `0.82` / `0.35` | ✓ | ✓ | SP-05 projection length, per-day retention, LOW edge |
| `restockNote` | `string` | derived `LOW IN n DAYS — RESTOCK` | ✓ | ✓ | SP-05 pill |
| `note` / `noteAt` | `string` / `number` | derived per variant | ✓ | ✓ | SP-01 rebuild pill (`STILL n% · REBUILDING` at the last missed day), SP-04 key, SP-06 level pill |
| `color` | `string` | mint; cyan for SP-05/06 | ✓ | ✓ | level-line token override |
| `heroCaption` / `heroStatus` / `heroStatusColor` / `heroNote` / `lowAt` | `string`×3 / `string` / `number` | catalog hero copy / `zone-high` / `0.35` | ✓ | ✓ | SP-10 right stats + LOW tick position |
| `title` / `stat` / `statColor` | `string` / `string` / `string` | — / — / `--text` | ✓ | ✓ | top-left mono caption · top-right display stat |
| `bands` | `boolean` | on for level variants | ✓ | ✓ | SATURATED/LOW zone washes (SP-02/06/09/10 never draw them) |
| `startLabel` / `endLabel` | `string` | `'DAY 1'`/`'TODAY'` (SP-03 `'0H'`/`'+12H'`) | ✓ | ✓ | axis captions (SP-01/03 only) |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay (catalog `cfg.shine`) |
| `ariaLabel` | `string` | `'Supplement level chart'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` / _rest_ | `string` / `Omit<HTMLAttributes<HTMLDivElement>,'title'\|'children'>` | — | ✓ | — | web only, merged onto `.lk-supp` / spread to the root div |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

**`SupplementRow`** `{ name, level, color?, status? }` — color defaults to the level's zone; status defaults ≥0.72 `SATURATED` / ≥0.38 `OK` / ≥0.2 `TAKE TODAY` / else `DEPLETED`.
**`SupplementSeries`** `{ name, levels, color?, dash? }` — positional defaults mint→cyan→amber, widths 2.5/2/1.8, opacities 1/0.85/0.8, `dash` = `4 3`.
**`SupplementVessel`** `{ name, level }`.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · plot 298×120`; day x-scale inset `P.l+14 … W−P.r−8` (`dayX`), level y-scale rides 6%–92% of the plot (`lvlY`).

| Element | Spec (both platforms) |
| --- | --- |
| Zone bands | `[0.72,1]` `--zone-high` + SATURATED label · `[0.35,0.72]` `--zone-mid` · `[0,0.35]` `--zone-low` + LOW label; rect `opacity 0.05`, labels right-anchored at band top +9 — **except SP-07**, which forces band labels **left** (`P.l+2`, anchor start; the right edge belongs to the series pills) |
| Level line | monotone-cubic smooth (catalog `smoothPath` port), `2.5px` round cap; `shine` adds a `+5px` wide `opacity 0.45` duplicate — blurred on both (web `.lk-supp-shine` 5px / native `FeGaussianBlur`) |
| Series pills (SP-07) | right-anchored at `W−P.r−4`; each pill's **y derives from its series' final level** (`lvlY(last)`); sorted top-down, clamped into the plot, **collision-pushed** to a min gap of `pillH+2` (15px), and the whole chain shifts up if it overruns the bottom |
| Dose dots | r3 at `H−P.b−4`: taken = `--mint` fill · missed = dashed `1.5 1.5` `--zone-low` stroke 1.3 |
| Missed window (SP-01) | rect `--zone-low` `opacity 0.07` rx5 spanning the first ≥2-day miss run ±6px + `MISSED × n` pill; SATURATED pill at the pre-miss peak |
| Rows (SP-02) | name mono right-anchored at x76; track `plotW−150`×10 rx5 `--glass-2` (catalog white-7%); fill row color `opacity 0.92` min-width 10; % + status pill in the row color |
| Stems (SP-04) | 3px round `--mint` `opacity 0.22` from baseline to the level |
| Forecast (SP-05) | past solid / projection dashed `5 5` `opacity 0.75`; NOW rule 1px `--text` at `strokeOpacity 0.22`; coral pulse + pill at the LOW crossing |
| Cells (SP-06) | h12 rx3 cells at `P.t+4`: taken `--mint` `opacity 0.75` / missed dashed `2 2` `--zone-low`; line rides at 62% of the model level (display squash under the strip) |
| Vessel | cap `w·0.4`×5 rx2 `--text` op 0.28 · body rx9 `--glass` fill + `--text` stroke `strokeOpacity 0.22` 1.4px · liquid = two-Q wave (amp 2.6, top at `y+h−2−level·(h−6)`) filled with a vertical gradient of the zone color 90%→45%, clipped to an inset rx7.5 rect · surface highlight 1.6px zone color op 0.95 · 4 outlined bubbles `--text` `strokeOpacity 0.4` (clipped) · 10.5px mono-600 % label: fill `≥ 30%` → **centered in the liquid body** ( `(surface + bottom)/2 + 3`, `--bg-0` dark-on-liquid) · fill `< 30%` → sits **above the surface** (`surface − amp − 4`, `--text`) |
| Vessel zones | ≥0.62 `--zone-high` · ≥0.38 `--zone-mid` · else `--zone-low` (catalog `zoneOf`) |
| Hero (SP-10) | vessel 56×100 at x78; FULL tick `--text` op 0.35 / LOW tick `--zone-low` at `lowAt`; 24px display-700 % at (196,56); caption dim, status pill, note faint |
| Pills/labels | catalog `tag()` (dark bg-0-at-78% pill + tinted hairline + 8px mono) and 8.5px mono labels — same spec as AreaChart |
| Type | labels `--font-mono` 8.5px `.06em` (native `letterSpacing 0.5`) · stat 12px / hero 24px `--font-display` 700 · vessel % 10.5px mono 600 |
| Sizing | web `.lk-supp-svg` `width 100%; height auto; overflow visible`; native root `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled; hooks: `useId` (+ web `useMotionOK`).

| State | Behavior |
| --- | --- |
| Default | every variant self-renders with the catalog demo data |
| Empty `doses: []` | frame + bands only, no line/dots — no crash |
| No miss run (SP-01) | no window/pill; SATURATED pill at the first level ≥ 0.72 (if reached) |
| No LOW crossing (SP-05) | no pulse/pill — the projection simply never dips under `lowThreshold` |
| Levels clamp | row/vessel/hero levels clamp to 0–1; SP-02 fill has a 10px minimum |
| Reduced motion (web) | SMIL pulse replaced by the static halo ring (`useMotionOK`) |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, model math, colors and label layout (same catalog constants + the same private `monotonePath` port). Real differences:

- **Glow substrate** — web blurs underlays via CSS (`.lk-supp-shine` 5px; vessel liquid `.lk-supp-shine-wide` 6px, the catalog `blur()`); native blurs the same duplicates with **real `FeGaussianBlur` Fabric filters** (`userSpaceOnUse` regions — see CONVENTIONS.md). Equivalent halos.
- **Pulse dot** — web = glow dot (`drop-shadow` via `.lk-supp-glowdot`) + SMIL expanding ring (reduced-motion safe); native = glow-duplicate circle + static halo ring (no SMIL on RN).
- **Vessel clip** — both clip the liquid: web `<clipPath>` / native `react-native-svg` `ClipPath` — substrate-only.
- **Label styling channel** — web CSS classes vs native `Svg.Text` font props; tag pill fill `color-mix` vs `#RRGGBBAA` (`C7`).
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically inside a `Card` on the supplements screen. The saturation story is the supplement-detail hero; `active-stack`/`liquid-batteries` are the stack overview; `depletion-forecast` powers restock nudges; `half-life` explains why the 3pm coffee hurts sleep (see `CaffeineClock` for the caffeine-specific family).

```tsx
// web — SP-01 from a real dose log
<SupplementChart title="CREATINE · 5G DAILY" stat={`LVL ${pct}%`} statColor="var(--mint)"
  doses={last14Days.map((d) => d.taken)} />
```

```tsx
// native — identical props (SP-09 tank view)
<SupplementChart variant="liquid-batteries" title="THE STACK · TANK LEVELS"
  vessels={stack.map((s) => ({ name: s.code, level: s.level }))} />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` (in-SVG text is decorative). Pass a data-bearing `ariaLabel` ("Creatine 78% saturated; 3 missed days last week").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive; the SMIL pulse honors `prefers-reduced-motion`. In-chart text scales with the container — keep ≥ ~300px wide or repeat critical numbers in surrounding real text.
- Color is not the only channel: missed doses are dashed (not just coral), statuses are text pills, vessel % is printed inside the tank.

## 8. Usage rules — Do / Don't

**Do**
- Feed **real dose logs** (`doses`) and let the model derive the level — that's the point of the family; use `levels` only when the backend already computed them.
- Use zone tokens through the defaults; override row/series colors with tokens only (`var(--cyan)` / `colors.cyan`).
- Keep vessel counts ≤5 (SP-09) and rows ≤4 (SP-02) — the catalog layout is tuned for those.
- Reproduce catalog cards in stories with the component defaults when checking parity.

**Don't**
- Don't hand-position the SATURATED/MISSED annotations — they derive from the data; use `note`/`noteAt` only for copy overrides.
- Don't re-implement the saturation model in app code to "match" the line — pass `kUp`/`kDown` instead.
- Don't use SP-03 for caffeine product surfaces — `CaffeineClock` owns the caffeine story (bed verdicts, thresholds).
- Don't hardcode hex, and don't restyle `.lk-supp-*` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled tanks.** Any liquid-vessel, saturation-line or adherence-strip widget on a product surface is this component — never a local SVG lookalike (the vessels especially: cap + two-Q wave + clipped bubbles + inverting % is THE signature; don't approximate it).
- **New variant → both platforms.** A new supplement form is added here, web + native in the same unit of work, same prop names.
- **Tokens only** — zone/spectrum/text/glass tokens throughout; the vessel glass is `--glass`, the pill is `--bg-0` at 78% — no raw rgba in app code.
- **Don't fork the math** — the saturation model, half-life decay and the monotone smoothing are catalog ports; apps never re-derive them.
- **Parity gate:** changes ship only after the web and native stories are compared side-by-side against `supplement-charts.html`.
