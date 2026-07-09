# SDD — `SessionChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SessionChart.tsx` · `packages/ui-native/src/components/SessionChart.tsx` —
> fully inline-styled; `.lk-snc` / `.lk-snc--<variant>` are hook classes only (no CSS partner file).
> **Exports:** `SessionChart`, `DEFAULT_SESSION_ZONES`, types `SessionChartProps`, `SessionChartVariant`, `SessionZone`, `SessionRound`, `SessionTag`, `SessionAxisLabel`, `SessionRecovery`.
> **Status:** Shipped. **Parity:** 🟡 same API & geometry; web `shine` is a CSS `blur(5px)` underlay and pulses ride SMIL rings, native draws a Gaussian-blurred duplicate stroke (`FeGaussianBlur`) and an `Animated` pulse ring.
> **Stories:** `packages/ui/src/stories/SessionChart.stories.tsx` (`Charts/SessionChart`) · `packages/ui-native/src/stories/SessionChart.stories.tsx` (`Native/SessionChart`).

---

## 1. Overview

The **catalog session family** (`lockin90-design/charts/session-charts.html`, SN-01…SN-10) — one recorded session told as a story in a **320×`height` viewBox** (default 150). Section A is heart-rate training: `hr-zones-session` (default, THE workout HR chart — 5 zone bands Z1 indigo → Z5 coral with the trace **stroked by zone height** via a userSpaceOnUse value gradient), `hr-intervals` (coral work-block shading + square-ish Z2↔Z5 swings), `time-in-zones` (5 horizontal zone rows sized by minutes), `hr-recovery` (peak pulse + dashed 60s bracket + mint drop tag — the fitness signal coaches watch). Section B is heat & recovery sessions: `sauna-rounds` (amber round blocks + PLUNGE chips + TEMP solid / HR dotted traces + legend), `sauna-heat-ramp` (cyan→amber→coral temp ramp vs a dashed TARGET rule + live pulse + state chip), `night-recovery` (violet night canvas, HRV mint rising + RHR violet dashed falling + delta chips), and the CGM pair `glucose-response` (meal-anchored curve, mint baseline band, MEAL rule, peak dot + return chip) / `response-overlay` (3 faint single-meal curves + the bold cyan mean). All trace values live on the **0–1 intensity scale** (Z1 bottom → Z5 top).

The SVG stretches (`preserveAspectRatio="none"`); dots, pulses, mono notes, the bold header stat and chip pills render as **overlays positioned by percentage** (web `<span>`s, native zero-size anchor `View`s), so they stay round and legible at any width. There is **no SN-08** in the catalog — the family is the 9 carded variants.

**Catalog-ID mapping** (story names carry the IDs):

| ID | `variant` | Key props |
| --- | --- | --- |
| SN-01 | `hr-zones-session` | `hrSamples` + `zones` + `showZoneLabels` |
| SN-02 | `hr-intervals` | `hrSamples` + `intervals` (default 5) |
| SN-03 | `time-in-zones` | `minutes` (Z1→Z5) + `zones` |
| SN-04 | `hr-recovery` | `hrSamples` + `recovery` `{peakIndex, dropIndex, label}` |
| SN-05 | `sauna-rounds` | `rounds` + `plunges` + `tempSamples`/`hrSamples` + `tempLabel`/`hrLabel` |
| SN-06 | `sauna-heat-ramp` | `tempSamples` + `target`/`targetLabel` + `stateLabel` |
| SN-07 | `night-recovery` | `hrvSamples`/`rhrSamples` + `hrvLabel`/`rhrLabel` |
| SN-09 | `glucose-response` | `glucoseSamples` + `baselineBand` + `mealAt` + `peakIndex` + labels |
| SN-10 | `response-overlay` | `overlays` + `glucoseSamples` (mean) + `meanLabel` |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `SessionChartVariant` | `'hr-zones-session'` | ✓ | ✓ | SN-01 … SN-10 (no SN-08) |
| `hrSamples` | `number[]` | catalog session (seeds 11/22/44; sauna HR seed 60) | ✓ | ✓ | 0–1 intensity; sauna-rounds' coral dotted trace |
| `zones` | `SessionZone[]` | `DEFAULT_SESSION_ZONES` (Z1 indigo → Z5 coral) | ✓ | ✓ | bands + the value-gradient stops for the trace stroke |
| `showZoneLabels` | `boolean` | `true` | ✓ | ✓ | right-edge Z labels on the bands |
| `intervals` | `number` | `5` | ✓ | ✓ | `hr-intervals` work-block count (clamped ≥ 1) |
| `recovery` | `SessionRecovery` | `{52, 62, '−32 BPM · 60S'}` | ✓ | ✓ | `hr-recovery` peak/bracket/tag |
| `minutes` | `number[]` | `[4, 12, 18, 14, 4]` | ✓ | ✓ | `time-in-zones`, Z1 → Z5; bars scale to the max |
| `rounds` | `SessionRound[]` | catalog 0–.24 / .33–.57 / .66–.9 | ✓ | ✓ | `sauna-rounds` amber blocks; label default `ROUND <n> · 15 MIN` |
| `plunges` | `SessionTag[]` | PLUNGE ×2 + REST | ✓ | ✓ | cyan chips along the bottom |
| `tempSamples` | `number[]` | sauna trace (seed 55) / heat ramp | ✓ | ✓ | `sauna-rounds` amber solid · `sauna-heat-ramp` ramp |
| `tempLabel` / `hrLabel` | `string` | `'TEMP'` / `'HR'` | ✓ | ✓ | `sauna-rounds` legend chips |
| `target` | `number` | `0.85` | ✓ | ✓ | `sauna-heat-ramp` dashed rule (0–1) |
| `targetLabel` | `string` | `'TARGET 90°C'` | ✓ | ✓ | chip on the target rule |
| `stateLabel` | `string` | `'87°C · HEATING'` | ✓ | ✓ | live chip at the trace head; `''` hides |
| `hrvSamples` / `rhrSamples` | `number[]` | catalog night (seed 77, n 48) | ✓ | ✓ | `night-recovery` traces |
| `hrvLabel` / `rhrLabel` | `string` | `'HRV +38%'` / `'RHR −12'` | ✓ | ✓ | delta chips at 72% of the window |
| `glucoseSamples` | `number[]` | catalog curve `glCurve(0.46/0.42, 0.15)` | ✓ | ✓ | SN-09 curve; SN-10 bold mean |
| `overlays` | `number[][]` | 3 catalog meal curves | ✓ | ✓ | `response-overlay` faint curves |
| `baselineBand` | `[number, number]` | `[0.36, 0.5]` | ✓ | ✓ | mint band on the 0–1 scale |
| `baselineLabel` | `string` | `'BASELINE 80-110'` | ✓ | ✓ | mint note at the band's top edge |
| `mealAt` | `number` | `0.2` | ✓ | ✓ | MEAL rule anchor (0–1 of the window) |
| `mealLabel` | `string` | `'MEAL 12:40'` | ✓ | ✓ | lime chip on the rule |
| `peakIndex` | `number` | `17` | ✓ | ✓ | SN-09 peak dot index (clamped) |
| `peakLabel` / `returnLabel` | `string` | `'+62 MG/DL PEAK'` / `'BACK TO BASE · 1H 40M'` | ✓ | ✓ | SN-09 chips; `''`/falsy hides |
| `meanLabel` | `string` | `'MEAN OF 3 MEALS'` | ✓ | ✓ | SN-10 legend chip |
| `title` | `string` | per-variant catalog card (e.g. `'TRAINING · TEMPO RUN'`) | ✓ | ✓ | top-left mono caption; `''` hides |
| `stat` | `string` | per-variant catalog card (e.g. `'148 AVG BPM'`) | ✓ | ✓ | top-right bold display stat; `''` hides |
| `statColor` | `string` | per-variant (`--zone-mid`/`--zone-low`/`--mint`), else `--text` | ✓ | ✓ | stat tint |
| `axisLabels` | `SessionAxisLabel[]` | per-variant (0/26 MIN/52 MIN · 45/90 MIN · 18 MIN · 11PM/3AM/7AM · −30M/+2H) | ✓ | ✓ | x captions |
| `weight` | `number` | `2.5` (sauna temp `2.6` · heat ramp `3`) | ✓ | ✓ | main trace stroke width |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay under every **solid** main trace (dashed traces never glow) |
| `height` | `number` | `150` | ✓ | ✓ | viewBox + px height |
| `ariaLabel` | `string` | — | ✓ | ✓ | web `aria-label` on the svg / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-snc .lk-snc--<variant>` |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | web root div / native container |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | spreads to the root `<div>` |

**`SessionZone`** — `{ label, color, from, to }`: the band's 0–1 slice (Z1 bottom → Z5 top). **`SessionRound`** — `{ from, to, label? }`. **`SessionTag`** / **`SessionAxisLabel`** — `{ at, label }`. **`SessionRecovery`** — `{ peakIndex?, dropIndex?, label? }` (indices into `hrSamples`).

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · pad l10 r12 t16 b14 · plot 298×(h−30) · Y(v) = 16 + (1−v)·plotH`. All curves are monotone-smoothed (Fritsch–Carlson, the catalog `smoothPath`).

| Element | Spec (both platforms) |
| --- | --- |
| Zone bands | per zone: rect fill @ 0.06 + top edge line @ 0.18 in the zone color; Z labels 8.5px mono, end-anchored at `W−14` |
| Zone-height stroke | userSpaceOnUse vertical gradient `y1 = 16 → y2 = h−14`, stops `0/0.3/0.55/0.78/1` = zones reversed (`--zone-low → --zone-mid → --mint → --cyan → --indigo`); non-5-zone configs distribute evenly |
| Interval blocks (SN-02) | `n` rects from `s = 0.14 + (b/n)·0.72`, width `0.72/n·0.55` of the plot, `--zone-low` @ 0.07 |
| Time-in-zones rows (SN-03) | pitch `plotH/5`, Z5 top; pill h 11, rx 5.5 @ 0.9 in the zone color, width `(plot−92)·m/max` (min 6); `MIN` labels `--text-dim` |
| Recovery (SN-04) | pulse at `pts[peakIndex]` in `--zone-low`; bracket `--text` @ 0.35, 1px, dash `2 3`, 14px above the trace; mint chip at the midpoint, 26px above the drop |
| Sauna blocks (SN-05) | round rects full plot height, rx 6, `--zone-mid` @ 0.1 + amber ROUND chips at `t+8`; PLUNGE/REST chips `--cyan` at `h−24`; TEMP `--zone-mid` 2.6px solid, HR `--zone-low` 1.8px dash `2 4`; legend chips end-anchored at y 42/58 |
| Heat ramp (SN-06) | target rule `--zone-low` 1px dash `5 4` @ 0.85 + end-anchored chip 10px above; trace = userSpaceOnUse ramp gradient bottom→top `--cyan → 0.55 --zone-mid → --zone-low`, 3px; pulse + state chip at the head |
| Night canvas (SN-07) | rect full plot, rx 6, `--violet` @ 0.05; HRV `--mint` 2.5px solid, RHR `--violet` 2px dash `5 4`; chips at 72% (−13px / +14px off the traces) |
| Glucose (SN-09/10) | baseline band rect rx 4 `--mint` @ 0.07 + mint note at its top edge; curves inset `gx = 18 … W−18`; MEAL rule `--text` @ 0.22, dash `2 3` + lime chip; SN-09 peak dot Ø 6.4 `--zone-mid` + start-anchored chip, mint return chip end-anchored at `Y(0.44)+22`; SN-10 overlay curves `--text` @ 0.18, 1.4px + bold `--cyan` mean 2.5px + end-anchored legend chip |
| Header | title 8.5px mono `--text-faint` top-left; stat `--font-display` / `fonts.display` **700 · 12px** top-right in `statColor` |
| Chip pills | `padding 2px 6px`, r 999, bg `--bg-0` @ 78%, border 1px color @ 35% (native `` `${c}59` ``), 8px mono text |
| Shine | web `blur(5px)` on a `w+5` round-cap duplicate @ 0.45 (the catalog `C.blur`); native the same duplicate @ `strokeOpacity 0.45`, blurred with `FeGaussianBlur stdDeviation 2.5` |
| Pulse | core dot r 3.6 (+ web `drop-shadow(0 0 5px c)` / native `shadow*` + elevation); web SMIL ring r 3.6→11, fade .8→0, 1.8s (reduced-motion → static r 7 @ 0.4); native `Animated.loop` ring, same choreography |
| Sizing | web svg `position: absolute; inset: 0; width/height 100%; overflow visible` in an `h`-px box; native Svg sized to the measured width (`onLayout`) |

Deterministic defaults are catalog ports: `hrSession(11/22/44, 70)`, `saunaTrace(55/60, 60, 3)`, `heatRampData()`, `nightTraces(77, 48)`, `glCurve(0.46/0.42, 0.15)` + the 3 overlay curves.

## 4. States

Pure render — no hover/press/focus/disabled states; the only client behavior is the pulse loop (and native width measurement).

| State | Behavior |
| --- | --- |
| Default | draws the chosen variant from its trace/config props (catalog defaults reproduce the cards) |
| Header off | `title=''` / `stat=''` suppress the captions (defaults are demo copy — real surfaces pass real values) |
| Index clamping | `peakIndex`, `recovery.peakIndex/dropIndex` clamp into the sample range — no crash on short traces |
| Empty traces | bands/rules/axis/title still render; `minutes: []` yields min-width bars |
| Reduced motion (web) | SMIL pulse replaced by a static halo ring via the `useMotionOK` gate |
| Pre-layout (native) | Svg waits for the measured width; overlays render immediately |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Both sides build the *same* mark/overlay lists from the same catalog constants and generators — geometry, gradients (both userSpaceOnUse), data model and label layout are identical. The real differences:

- **Shine substrate** — web blurs the wider duplicate trace (`filter: blur(5px)`); native blurs the same `w+5` duplicate @ 0.45 with a real `FeGaussianBlur` (`stdDeviation 2.5`; see CONVENTIONS.md). Halo softness differs marginally.
- **Pulse substrate** — web SMIL ring gated by `prefers-reduced-motion`; native `Animated.loop` ring with the same 1.8s choreography, no reduced-motion gate (no OS media query hook).
- **Glow on dots** — web `drop-shadow` filter vs native `shadowColor/shadowRadius/elevation`.
- **Overlay substrate** — web absolutely-positioned `<span>`s (`%` left + transform anchors); native zero-size anchor `View`s (`alignItems` anchoring). Same visual result.
- **Container** — web `div.lk-snc[…]` + `className`/rest, `aria-label` on the inner svg; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card` on session-detail, sauna, sleep and CGM screens. Complements `Hypnogram` (sleep stages) and `ZoneBar` (zone summary chips) rather than replacing them.

```tsx
// web — SN-01 with real session data (0–1 of the intensity scale)
<SessionChart
  hrSamples={session.trace}
  title="TRAINING · TEMPO RUN"
  stat={`${session.avgBpm} AVG BPM`}
  statColor="var(--zone-mid)"
  axisLabels={[
    { at: 0, label: '0' },
    { at: 1, label: `${session.minutes} MIN` },
  ]}
/>
```

```tsx
// native — identical props (SN-09 CGM detail)
<SessionChart
  variant="glucose-response"
  glucoseSamples={meal.curve}
  mealAt={0.2}
  mealLabel="MEAL 12:40"
  peakIndex={meal.peakIndex}
  peakLabel={`+${meal.peakDelta} MG/DL PEAK`}
  returnLabel={`BACK TO BASE · ${meal.returnTime}`}
/>
```

## 7. Accessibility

- **Web:** the `<svg>` carries `role="img"` + `aria-label={ariaLabel}` (or `aria-hidden` when unset); overlays are `pointer-events: none` — pass a data-bearing `ariaLabel` ("Tempo run, 52 minutes, average 148 bpm, mostly zone 3").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. Overlay text renders at true px (8.5/8/12px) regardless of chart width.
- Pulses respect `prefers-reduced-motion` on web.
- Color is not the only channel: zones carry Z labels, every annotation (recovery drop, peak, target, deltas) is printed as chip text, and the header stat restates the headline number.

## 8. Usage rules — Do / Don't

**Do**
- Normalize traces to the 0–1 intensity scale before passing (`(bpm − hrMin) / (hrMax − hrMin)` against the user's zone model) — the zone bands and the zone-height stroke assume it.
- Pass real `title`/`stat`/`axisLabels` on product surfaces — the defaults are the catalog's demo copy.
- Keep `zones` at the user's real 5-zone model; a different zone count still renders (bands + evenly-distributed gradient stops).
- Use `hr-recovery` when you have a measured 60s drop — set `recovery.peakIndex/dropIndex` from the data, don't eyeball.
- Override colors with **tokens only** (`var(--zone-mid)` / `colors.zoneMid`).

**Don't**
- Don't pass raw bpm/°C/mg-dL — the chart never auto-scales; 0–1 in, catalog geometry out.
- Don't use `shine` expecting dashed traces (sauna HR, RHR) to glow — only solid main traces get the underlay, per the catalog.
- Don't ask for SN-08 — the catalog has no such card.
- Don't rebuild `time-in-zones` with `BarChart` — the zone-row form with Z labels + MIN captions lives here.
- Don't hardcode hex in `zones[].color`/`statColor`.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled session charts.** Any HR-over-zones trace, interval structure, time-in-zones summary, recovery bracket, sauna protocol, overnight HRV/RHR story or CGM meal-response curve on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new session form is added here, web + native in the same unit of work, with the same prop names — never a one-off in an app.
- **Tokens only** — zone/spectrum/text tokens throughout; the catalog's raw whites are `--text` + opacity inside the component, never re-derived in app code.
- **Substrate diffs stay documented, not widened** — don't bolt blur filters onto native shine or swap the Animated pulse for SMIL; §5 is the accepted contract.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `session-charts.html`.
