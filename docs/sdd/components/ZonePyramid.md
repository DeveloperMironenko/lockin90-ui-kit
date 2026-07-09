# SDD — `ZonePyramid`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ZonePyramid.tsx` · `packages/ui-native/src/components/ZonePyramid.tsx` ·
> web CSS `packages/ui/src/styles/components/pyramid.css` (`.lk-pyr*`).
> **Exports:** `ZonePyramid`, types `ZonePyramidProps`, `ZonePyramidVariant`, `PyramidZone`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; `shine` blurs the duplicate bar on both — web `filter: blur(4px)`, native `FeGaussianBlur stdDeviation 2` (real RN-SVG filters).
> **Stories:** `packages/ui/src/stories/ZonePyramid.stories.tsx` (`Charts/ZonePyramid`) · `packages/ui-native/src/stories/ZonePyramid.stories.tsx` (`Native/ZonePyramid`).

---

## 1. Overview

The **catalog pyramid family** (`lockin90-design/charts/pyramid-charts.html`, PY-01…PY-03) for product surfaces: **time-in-zone as a training pyramid** — base easy, tip hard; a base-heavy shape reads as healthy. Three variants drawn in a fixed **320×150 viewBox** with mono catalog labels. Zones are passed **top row first (Z5 → Z1)** in raw minutes; bar widths normalize so the longest zone spans 95% of the bar box.

| Catalog ID | Props | Card |
| --- | --- | --- |
| PY-01 `zone-pyramid` | `variant="zone-pyramid"` (default) + `zones` | 5 centered bars Z5→Z1 (coral/amber/lime/mint/cyan), width = time · % left, h:mm right, zone letter inside |
| PY-02 `target-pyramid` | `variant="target-pyramid"` + `zones[].target` | PY-01 + dashed white target outline per zone + amber OVER pill at the worst overage |
| PY-03 `mirror-pyramid` | `variant="mirror-pyramid"` + `zones[].prev` | population-pyramid: this week right (solid) vs last week left (32%), zone letters on the spine + delta pill |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'zone-pyramid' \| 'target-pyramid' \| 'mirror-pyramid'` | `'zone-pyramid'` | ✓ | ✓ | PY-01 / 02 / 03 |
| `zones` | `PyramidZone[]` | catalog Z5…Z1 (36/72/118/195/250 min) | ✓ | ✓ | rows, **top first** (hardest zone up top) |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption (`'TIME IN ZONE · WEEK'`) |
| `caption` | `string` | derived | ✓ | ✓ | bottom faint line; `zone-pyramid` derives the total (`'11H 11M TOTAL'`); other variants none; `''` hides |
| `note` | `string` | derived | ✓ | ✓ | the pill: `target-pyramid` biggest positive overage (`'Z3 +40M OVER'`, amber, at that row); `mirror-pyramid` biggest week-over-week change (`'Z2 +29 MIN'`, zone-colored, bottom right); `''` hides |
| `periodLabels` | `[string, string]` | `['THIS WEEK','LAST WEEK']` | ✓ | ✓ | `mirror-pyramid` column headings (right, left) |
| `shine` | `boolean` | `false` | ✓ | ✓ | soft glow underlay behind each solid bar (catalog glow modifier) |
| `ariaLabel` | `string` | `'Zone pyramid'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-pyr` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | spreads to the root `<div>` |

**`PyramidZone`** — `{ label; minutes; target?; prev?; pct?; time?; color? }`:
- `label` — zone letter, inside the bar when it's wider than 34 viewBox px, above it (in the zone hue) otherwise.
- `minutes` — time in zone; widths normalize to `max(minutes)`.
- `target` / `prev` — minutes on the same scale (PY-02 outline / PY-03 left bar).
- `pct` / `time` — label overrides; derived as share-of-total % and `h:mm` when omitted.
- `color` — token override; defaults cycle `--zone-low` → `--zone-mid` → `--lime` → `--mint` → `--cyan` (Z5→Z1).

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14`; bar box `MAXW 168`, row height `RH 16`, gap `5`, centered on `CX 160`, first row at y `28` (mirror: y `30`, half-boxes `108` wide, `14` px either side of the spine).

| Element | Spec (both platforms) |
| --- | --- |
| Normalization | raw minutes → widths: `max(minutes)` spans **0.95** of the bar box (catalog headroom); negatives clamp to 0; targets/prev share the same scale |
| Bars | rx `RH/2` (full pill), fill = zone color at **opacity 0.88**; mirror previous-period bars at **0.32** |
| Zone letter (wide bars) | centered, `--font-mono` **8.5px / 700**, fill `--bg-0` at **0.85** (the catalog's dark-on-color) — `.lk-pyr-zone` on web |
| Zone letter (thin bars) | 3 above the bar, mono 8.5, in the zone color |
| % / h:mm labels | mono 8.5; `%` right-aligned 10 left of the bar box in `--text-faint`; time left-aligned 10 right of the box in `--text-dim` |
| Target outline (PY-02) | rect `target` wide, bar rect inflated 1.5px each way (h `RH+3`, rx `(RH+3)/2`), `fill none`, stroke `--text` at **0.55**, 1px, dash `3 3` |
| Mirror spine | 1px `--border` vertical at `CX`, 2px past the rows both ends; zone letters on it in `--text-dim`; headings at y 24 — current `--text`, previous `--text-faint` |
| OVER pill (PY-02) | catalog `tag()` chip: `--bg-0` at 78% + amber (`--zone-mid`) hairline + 8px mono, right-anchored at `CX+MAXW/2+24`, at the overage row's top |
| Delta pill (PY-03) | same chip at (`CX+80`, 140) in the changed zone's color |
| Caption | mono 8.5 `--text-faint`, centered at (`CX`, 144) |
| Shine | duplicate bar at opacity 0.55 — web `.lk-pyr-shine` (`blur(4px)`); native the same duplicate at 0.55, Gaussian-blurred (`FeGaussianBlur stdDeviation 2`) |
| Sizing | web `.lk-pyr-svg`: `width 100%; height auto; overflow visible`; native root: `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | draws the catalog demo pyramid (5 zones) |
| Empty (`zones: []`) | title only — no bars, no pill, no crash (`note`/`caption` derive to nothing) |
| All-zero minutes | zero-width bars; `pct` derives `'0%'`; letters render above (thin-bar path) |
| No `target` on a zone (PY-02) | that zone draws no outline and is skipped by the OVER derivation |
| Nothing over target (PY-02) | no OVER pill (unless `note` is passed) |
| No `prev` (PY-03) | left bar width 0 (treated as 0 minutes) |
| `caption=''` / `note=''` | the line / pill is hidden |
| More/fewer than 5 zones | rows lay out from the top; hues cycle — the 320×150 box fits ~5 rows, so keep to 5 |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, normalization, derivations (`pct`, `h:mm`, total, OVER/delta pills) and label layout — both compute from the same catalog constants. The real differences:

- **Shine substrate** — web blurs the duplicate bar (`.lk-pyr-shine`, `filter: blur(4px)`, opacity 0.55); native Gaussian-blurs the same duplicate at 0.55 via `FeGaussianBlur stdDeviation 2` in a padded `userSpaceOnUse` region (see CONVENTIONS.md).
- **Label styling channel** — web styles `<text>` via `.lk-pyr-label` / `.lk-pyr-zone` / `.lk-pyr-tag`; native passes `fontSize/fontFamily/fontWeight/letterSpacing` props on `Svg.Text`.
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card` body. The weekly training-intensity card, plan-adherence check (polarized 80/20), week-over-week intensity shift.

```tsx
// web — PY-02, are you training the plan's shape?
<ZonePyramid variant="target-pyramid" title="VS POLARIZED PLAN"
  zones={[
    { label: 'Z5', minutes: 36, target: 26 },
    { label: 'Z4', minutes: 72, target: 53 },
    { label: 'Z3', minutes: 118, target: 78 },
    { label: 'Z2', minutes: 195, target: 224 },
    { label: 'Z1', minutes: 250, target: 263 },
  ]} />
```

```tsx
// native — identical props (PY-03)
<ZonePyramid variant="mirror-pyramid" title="WEEK VS WEEK"
  zones={thisWeek.map((z, i) => ({ label: z.label, minutes: z.minutes, prev: lastWeek[i].minutes }))} />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` (in-SVG text is decorative). Pass a data-bearing `ariaLabel` ("Time in zone this week: 11h11 total, base-heavy — most time in Z1/Z2").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container; keep charts ≥ ~300px wide or move critical numbers into surrounding real text.
- Color is not the only channel: every zone is lettered AND carries % + h:mm text; the dark-on-color zone letter keeps ≥4.5:1 on every default hue.

## 8. Usage rules — Do / Don't

**Do**
- Pass zones **top first (Z5 → Z1)** in raw minutes — %, h:mm, the total caption and the pills all derive.
- Keep `target`/`prev` in the same minute scale as `minutes` — they normalize together.
- Use `pct`/`time` overrides only when the surrounding surface already computed canonical strings.
- Override hues with **tokens only** (`var(--lime)` / `colors.lime`).

**Don't**
- Don't pass pre-normalized fractions as `minutes` — the component normalizes; feed real minutes so labels derive correctly.
- Don't reorder to Z1-first "because the base is first" — the pyramid shape depends on top-first order.
- Don't use more than ~5 zones — rows overflow the fixed 150-high viewBox.
- Don't hardcode hex in `color` overrides, and don't restyle `.lk-pyr-*` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled pyramids.** Any centered time-in-zone bar stack or mirrored week-vs-week pyramid on a product surface is this component — never a local SVG/flexbox lookalike.
- **New variant → both platforms.** A new pyramid form (e.g. a cohort-ghost outline) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — zone/spectrum/text/border tokens throughout; the in-bar letter is `--bg-0` at 0.85, the target outline `--text` at 0.55 (no raw hex in app code, ever).
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `pyramid-charts.html`.
