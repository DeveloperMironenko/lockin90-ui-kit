# SDD — `CaffeineClock`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/CaffeineClock.tsx` · `packages/ui-native/src/components/CaffeineClock.tsx` ·
> web CSS `packages/ui/src/styles/components/caffeineclock.css` (`.lk-caff*`).
> **Exports:** `CaffeineClock`, types `CaffeineClockProps`, `CaffeineClockVariant`, `CaffeineDose`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; web blurs the glow underlay + animates the NOW pulse (SMIL), native draws wider faint duplicates + a static halo (RN SVG filters/SMIL are unreliable).
> **Stories:** `packages/ui/src/stories/CaffeineClock.stories.tsx` (`Charts/CaffeineClock`) · `packages/ui-native/src/stories/CaffeineClock.stories.tsx` (`Native/CaffeineClock`).

---

## 1. Overview

The **catalog caffeine family** (`lockin90-design/charts/caffeine-charts.html`, CF-01…CF-03): half-life decay vs your bedtime — when the last safe coffee is. Three variants in a fixed **320×150 viewBox** over a 6:00→24:00 day axis. The whole family is **model-driven**: mg in the system = `Σ mg·0.5^((h−atH)/t½)` over the doses, so the bed verdict (`BED · nMG ✓/⚠`), the threshold-crossing time (`UNDER 50MG · 15:42`) and the LAST SAFE COFFEE tick (one half-life before bed) are all **computed from the data**, not copy.

Catalog-ID mapping:

| Catalog ID | Props | Card |
| --- | --- | --- |
| CF-01 `decay-curve` | `variant="decay-curve"` (default) + `doses` | exponential t½ decay from the dose spike · amber dashed 50MG sleep threshold + crossing dot · violet dashed bedtime rule + verdict pill |
| CF-02 `stacked-doses` | `variant="stacked-doses"` + `doses` | each dose decays as its own faint curve + bold TOTAL curve · late dose → coral bed verdict |
| CF-03 `safe-window` | `variant="safe-window"` + `nowH` | mint→amber→magenta day strip + computed LAST SAFE COFFEE tick + NOW pulse + past cups |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'decay-curve' \| 'stacked-doses' \| 'safe-window'` | `'decay-curve'` | ✓ | ✓ | CF-01 / 02 / 03 |
| `doses` | `CaffeineDose[]` | per-variant catalog doses | ✓ | ✓ | `{ atH: 0–24, mg, color? }`, in time order |
| `halfLifeH` | `number` | `5.7` | ✓ | ✓ | the catalog t½ |
| `bedH` | `number` | `23` | ✓ | ✓ | violet dashed rule + verdict / safe-window anchor |
| `thresholdMg` | `number` | `50` | ✓ | ✓ | amber dashed sleep threshold; verdicts compare to it |
| `maxMg` | `number` | `200` | ✓ | ✓ | y-scale ceiling |
| `dayStartH` / `dayEndH` | `number` | `6` / `24` | ✓ | ✓ | x-axis day window; hour ticks every 3h |
| `nowH` | `number` | `14` | ✓ | ✓ | safe-window NOW pulse position |
| `color` | `string` | `--mint` | ✓ | ✓ | CF-01 curve token |
| `bedLabel` | `string` | derived `BED · ${mg}MG ✓/⚠` | ✓ | ✓ | verdict pill override |
| `crossLabel` | `string` | derived `UNDER ${mg}MG · ${h:mm}` | ✓ | ✓ | threshold-crossing pill override |
| `note` | `string` | `'BOLD = TOTAL'` | ✓ | ✓ | CF-02 key |
| `safeLabel` | `string` | derived `LAST SAFE COFFEE · ${h:mm}` | ✓ | ✓ | CF-03 tick pill override |
| `cupsNote` | `string` | derived `${n} COFFEES SO FAR` | ✓ | ✓ | CF-03 past-cups caption |
| `legendNote` | `string` | derived `GREEN = SAFE FOR ${h:mm} BED · RED = HITS SLEEP` | ✓ | ✓ | CF-03 bottom legend |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption |
| `grid` | `boolean` | `true` | ✓ | ✓ | 3 interior rows + baseline (all three variants, per the page) |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay along the CF-01 curve |
| `ariaLabel` | `string` | `'Caffeine decay chart'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` / _rest_ | `string` / `Omit<HTMLAttributes<HTMLDivElement>,'title'\|'children'>` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

**`CaffeineDose`** — `{ atH, mg, color? }`; `color` defaults by position to the catalog trio `--violet` → `--cyan` → `--zone-mid`.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14`; x inset `X0 = P.l+10 … X1 = W−P.r−10`; `ymg(mg) = H−P.b−6 − mg/maxMg·(plotH−18)`; curves sampled every 0.25h.

| Element | Spec (both platforms) |
| --- | --- |
| Decay curve (CF-01) | 2.2px round cap in `color` (`--mint`); `shine` = 7px `opacity 0.45` duplicate (blurred 5px on web) |
| Sleep threshold | dashed `4 4` 1.1px `--zone-mid` rule at `ymg(thresholdMg)` + start-anchored label above; crossing = r3.4 `--zone-mid` dot + pill at the computed time (0.05h scan after the last dose) |
| Bed rule | dashed `4 4` 1.2px `--violet` at `xh(bedH)` from `P.t+6` to the baseline; verdict pill end-anchored at (−4, `P.t+12`) — `--mint` when `mg < thresholdMg` else `--zone-low` |
| Cup markers | dashed `2 3` 1px stem `opacity 0.7` from the baseline to `ymg(mg)` + r3 dot + `${mg}MG` label above, all in the dose color |
| Stacked doses (CF-02) | per-dose curves 1.2px `opacity 0.55` from each `atH`; TOTAL 2.2px `--text`; `BOLD = TOTAL` note at ≈44% of the window, `ymg(0.75·maxMg)` |
| Safe window (CF-03) | strip 18px rx9 at y74, horizontal gradient `0% --mint · 55% --mint · 75% --zone-mid · 100% --magenta`, `opacity 0.75`; LAST SAFE tick = 2px `--text` rule ±17px + mint pill at −26; NOW = glowing `--text` pulse + `NOW · h:mm` below; past cups = r3 `--bg-0`-at-80% dots with `--text` `strokeOpacity 0.8` rims; captions faint |
| Hour ticks | `${h}:00` every 3h across the window, faint mono at `H−3` |
| Grid | 3 interior rows `--border` `strokeOpacity 0.55` + solid `--border` baseline |
| Pills/labels | catalog `tag()` (dark `--bg-0`-at-78% pill + tinted hairline + 8px mono) and 8.5px mono labels |
| Time format | `h:mm` from fractional hours (17.3 → `17:18`) |
| Sizing | web `.lk-caff-svg` `width 100%; height auto; overflow visible`; native root `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled; hooks: `useId` (+ web `useMotionOK`).

| State | Behavior |
| --- | --- |
| Default | CF-01 with the catalog 8:30·120mg dose — verdict ✓ (21mg at bed) |
| Over threshold at bed | verdict pill flips to `--zone-low` + `⚠` automatically |
| Never crosses threshold | no crossing dot/pill (dose too small or window too short) |
| Empty `doses: []` | frame + rules only (CF-03 still shows the strip/tick/NOW); no crash |
| Doses before `dayStartH` | curve starts at the dose hour (clamped x may sit at the left edge) |
| Reduced motion (web) | SMIL pulse replaced by the static halo ring |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical model math (half-life sum, crossing scan, cut = `bedH − halfLifeH`), geometry and label layout. Real differences:

- **Glow substrate** — web blurs the 7px underlay (`.lk-caff-shine`, catalog `blur(5)`) and drop-shadows the pulse dot; native draws unblurred wider faint duplicates (no RN SVG filters).
- **Pulse** — web SMIL expanding ring (reduced-motion safe); native static halo ring.
- **Label styling channel** — web CSS classes vs native `Svg.Text` font props; pill fills `color-mix` vs `#RRGGBBAA` (`C7`/`CC`).
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — the caffeine widget on the today screen (CF-01 "will it hit my sleep?"), the log-detail view for multi-coffee days (CF-02), and the actionable "can I have one more?" card (CF-03). Distinct from `SupplementChart`'s generic `half-life` variant: this family owns bed verdicts, thresholds and the safe window.

```tsx
// web — CF-01 from a real log
<CaffeineClock title="COFFEE 8:30 · 120MG"
  doses={[{ atH: 8.5, mg: 120 }]} bedH={user.bedH} />
```

```tsx
// native — identical props (CF-03)
<CaffeineClock variant="safe-window" title="CAN I HAVE ONE MORE?"
  doses={todayDoses} nowH={nowFractionalHour} bedH={user.bedH} />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden`. Pass a data-bearing `ariaLabel` ("120mg at 8:30 decays under 50mg by 15:42; 21mg at your 23:00 bedtime — safe").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive; the SMIL pulse honors `prefers-reduced-motion`.
- Color is not the only channel: the verdict pill carries `✓`/`⚠` text, thresholds and times are printed, the safe-window strip has the labeled tick.

## 8. Usage rules — Do / Don't

**Do**
- Pass **real doses** and the user's real `bedH` — every verdict/time on the chart derives from them.
- Use `halfLifeH` to personalize (slow metabolizers) rather than pre-computing curves.
- Override pill copy (`bedLabel`, `safeLabel`…) only for i18n — keep the derived numbers.
- Keep doses within `dayStartH`–`dayEndH` or widen the window props.

**Don't**
- Don't pre-sum overlapping doses — the component stacks them; feed the raw log.
- Don't use this for non-caffeine half-life stories — `SupplementChart variant="half-life"` covers the generic case.
- Don't restyle the verdict colors: mint = safe / coral = hits sleep is the catalog contract.
- Don't hardcode hex, and don't restyle `.lk-caff-*` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled decay curves.** Any caffeine curve, bed-verdict pill or safe-window strip on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new caffeine form is added here, web + native in the same unit of work, same prop names.
- **Tokens only** — mint/amber/violet/magenta/zone tokens throughout; the strip gradient and pill fills are token-expressed.
- **Don't fork the model** — the half-life sum, the crossing scan and `cut = bedH − t½` are the spec; apps never re-derive them to "match".
- **Parity gate:** changes ship only after the web and native stories are compared side-by-side against `caffeine-charts.html`.
