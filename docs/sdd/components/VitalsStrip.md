# SDD — `VitalsStrip`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/VitalsStrip.tsx` · `packages/ui-native/src/components/VitalsStrip.tsx` ·
> web CSS `packages/ui/src/styles/components/vitals.css` (`.lk-vitals*`).
> **Exports:** `VitalsStrip`, types `VitalsStripProps`, `VitalsStripVariant`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; web blurs the glow underlay + animates the R-peak pulse (SMIL), native draws Gaussian-blurred duplicates (`FeGaussianBlur`) + a static halo (no SMIL on native).
> **Stories:** `packages/ui/src/stories/VitalsStrip.stories.tsx` (`Charts/VitalsStrip`) · `packages/ui-native/src/stories/VitalsStrip.stories.tsx` (`Native/VitalsStrip`).

---

## 1. Overview

The **catalog vitals family** (`lockin90-design/charts/vitals-charts.html`, VT-01…VT-05): ECG-style rhythm strips — heartbeat, HRV, the monitor look. Five variants in a fixed **320×150 viewBox**. Beats are the catalog's 13-point **PQRST template** rendered as a **sharp polyline — never smoothed** (the sharpness IS the ECG look) on faint paper verticals every 14px. RR intervals are **real milliseconds**; the strip renders them at the catalog's **23.5 ms/px** so uneven spacing reads exactly like the design page. `night-hr` swaps the beats for the compressed overnight HR curve (the family's only smoothed line).

Catalog-ID mapping:

| Catalog ID | Props | Card |
| --- | --- | --- |
| VT-01 `ecg-strip` | `variant="ecg-strip"` (default) + `rr` + `bpm` | PQRST beats on ECG paper · big mono BPM · pulse on the latest R peak |
| VT-02 `hrv-rhythm` | `variant="hrv-rhythm"` + `rr` + `hrv` | cyan ECG with visibly uneven spacing + RR bracket ruler (ms per gap) + HRV pill |
| VT-03 `monitor` | `variant="monitor"` + `bpm`/`hrv`/`resp` | ECG mint + slow respiration cyan + HR/HRV/RESP big stat column |
| VT-04 `night-hr` | `variant="night-hr"` + `nightBpm` + `wakeIndex` | overnight HR curve (indigo) in a shaded sleep window · LOW dip pill · WAKE spike amber · 11PM/3AM/7AM ticks |
| VT-05 `anomaly-beat` | `variant="anomaly-beat"` + `rr` (+ `anomalyIndex`) | ONE premature beat re-drawn coral + dashed ring + IRREGULAR pill |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `VitalsStripVariant` | `'ecg-strip'` | ✓ | ✓ | VT-01…VT-05 |
| `rr` | `number[]` | per-variant catalog runs | ✓ | ✓ | RR intervals in **ms**, one per beat (px = ms/23.5) |
| `bpm` | `number` | `62` (monitor `58`) | ✓ | ✓ | VT-01 big readout / VT-03 HR stat |
| `hrv` | `number` | `84` | ✓ | ✓ | VT-02 `HRV ${n}MS` pill / VT-03 stat |
| `resp` | `number` | `14` | ✓ | ✓ | VT-03 RESP stat (the drawn respiration wave is fixed-form) |
| `nightBpm` | `number[]` | catalog night (13 samples) | ✓ | ✓ | VT-04 overnight samples; y = `128 − (v−40)·2.6` |
| `lowLabel` | `string` | derived `LOW ${min}` | ✓ | ✓ | VT-04 dip pill, anchored at the minimum sample |
| `wakeIndex` | `number \| null` | `9` | ✓ | ✓ | VT-04 amber wake marker; `null` hides it |
| `wakeLabel` | `string` | `'WAKE'` | ✓ | ✓ | VT-04 |
| `anomalyIndex` | `number` | shortest RR | ✓ | ✓ | VT-05 premature-beat index (auto-detected by default) |
| `anomalyLabel` | `string` | `'IRREGULAR · 1 BEAT'` | ✓ | ✓ | VT-05 pill |
| `caption` | `string` | per-variant catalog copy | ✓ | ✓ | bottom-left mono note |
| `ticks` | `string[]` | `['11PM','3AM','7AM']` | ✓ | ✓ | VT-04 axis captions, spread evenly |
| `color` | `string` | mint; VT-02 cyan; VT-04 indigo | ✓ | ✓ | trace token override |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay along the trace |
| `ariaLabel` | `string` | `'Vitals rhythm strip'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` / _rest_ | `string` / `Omit<HTMLAttributes<HTMLDivElement>,'title'\|'children'>` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

Default RR runs (ms — the page's px × 23.5): ecg `[987,1034,940,1058,964,1034]` · hrv `[964,1034,893,1081,846,1058,940]` · monitor `[893,940,870,964,893,940]` · anomaly `[987,1034,564,1363,1011,1034]` (564 = the premature beat, 1363 = the compensatory pause).

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14`; beats start at `P.l+4`.

| Element | Spec (both platforms) |
| --- | --- |
| PQRST template | `[0,0]·[.13,0]·[.18,.14]·[.23,0]·[.33,0]·[.36,−.12]·[.40,1]·[.44,−.30]·[.48,0]·[.56,0]·[.64,.24]·[.72,0]·[1,0]` × amp, R peak = index 6 |
| Frames | ecg: paper 30–118, baseline y82, amp 36 · hrv: 26–104 / 70 / 30 · monitor: 26–122 / 56 / 24 · anomaly: 30–118 / 82 / 34 |
| Paper | verticals every 14px, `--text` at `strokeOpacity 0.04` (the catalog white-4%) |
| Trace | 1.8px round join/cap; `shine` = 6px round `opacity 0.45` duplicate (blurred 5px on web via `.lk-vitals-shine`) |
| R-peak pulse (VT-01) | glowing r3.6 dot + expanding ring at the last R peak, in the trace color |
| Big BPM (VT-01) | 24px `--font-display` 700 end-anchored at (306,46) in the trace color + faint `BPM` under (y58) |
| RR ruler (VT-02) | bracket rails at y112 + end ticks y108–116, `--text` `strokeOpacity 0.25`; gap label = `round(rr[i+1])` ms, dim mono at y126; `HRV nMS` cyan pill at (302,22) |
| Monitor (VT-03) | respiration = `sin((x−P.l)/26)·9` around y104, x → 240, 1.6px `--cyan`; stat column 17px display-700 end-anchored at x306, rows y56/92/128 in `--mint`/`--cyan`/`--violet` + faint unit labels (+10) |
| Night (VT-04) | grid + `x0=P.l+8 … x1=W−P.r−8`; sleep window rect `opacity 0.07` in the trace color (indigo); monotone-smooth 2.2px curve; LOW = r3.2 `--mint` dot + pill (+14); WAKE = r3.2 `--zone-mid` dot + start-anchored pill (−12) |
| Anomaly (VT-05) | the flagged beat re-drawn 2px `--zone-low` over the mint strip; dashed `3 3` r17 ring at (`peak.x`, y0−8) `opacity 0.8`; coral pill at (`peak.x+22`, 34) |
| Pills/labels | catalog `tag()` (dark `--bg-0`-at-78% pill + tinted hairline + 8px mono) and 8.5px mono labels |
| Sizing | web `.lk-vitals-svg` `width 100%; height auto; overflow visible`; native root `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled; hooks: web `useMotionOK` only.

| State | Behavior |
| --- | --- |
| Default | VT-01 with the catalog resting run |
| Empty `rr: []` | paper + captions only, no trace/pulse — no crash |
| `anomalyIndex` omitted (VT-05) | auto-detects the shortest RR; explicit index is clamped to range |
| `wakeIndex: null` (VT-04) | wake marker hidden |
| Long RR runs | beats extend past the right pad (the catalog strips clip naturally at the card edge) — keep total ms ≤ ~7,000 for the framed look |
| Reduced motion (web) | SMIL pulse replaced by the static halo ring |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical beat template, ms→px scale, frames and label layout. Real differences:

- **Glow substrate** — web blurs the 6px trace underlay (`.lk-vitals-shine`) and drop-shadows the pulse dot (`.lk-vitals-glowdot`); native Gaussian-blurs the trace duplicate via `FeGaussianBlur stdDeviation 2.5` (see CONVENTIONS.md); the pulse dot keeps an unblurred faint duplicate.
- **Pulse** — web SMIL expanding ring on the last R peak (reduced-motion safe); native static halo ring (the Ring precedent).
- **Label styling channel** — web CSS classes vs native `Svg.Text` font props; pill fill `color-mix` vs `#RRGGBBAA` (`C7`).
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — the live HR widget (VT-01), the HRV explainer (VT-02), the bedside-monitor recovery card (VT-03), sleep-recovery detail (VT-04) and the irregular-rhythm notification detail (VT-05). Typically inside a `Card`; the big numbers can be echoed by `Stat`/`MetricTile` outside the SVG for copyable text.

```tsx
// web — VT-02 from real RR intervals (ms)
<VitalsStrip variant="hrv-rhythm" title="HRV · RR INTERVALS"
  rr={rrIntervalsMs} hrv={Math.round(rmssd)} />
```

```tsx
// native — identical props (VT-04)
<VitalsStrip variant="night-hr" title="OVERNIGHT HR"
  nightBpm={nightSamples} wakeIndex={wakeSampleIndex} lowLabel={`LOW ${minBpm} · ${minAt}`} />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden`. Pass a data-bearing `ariaLabel` ("Resting heart rate 62 bpm, sinus rhythm" / "One premature beat detected").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive; the SMIL pulse honors `prefers-reduced-motion`.
- Color is not the only channel: the anomaly gets a dashed ring + text pill (not just coral), RR gaps are printed in ms, stats are labeled.
- These strips are **illustrative wellness visuals, not diagnostic ECGs** — surrounding copy must not imply medical-grade tracing.

## 8. Usage rules — Do / Don't

**Do**
- Pass RR intervals in **milliseconds** — the component owns the ms→px scale (23.5), so real wearable data lines up with the catalog look.
- Let VT-05 auto-detect the premature beat (shortest RR); override `anomalyIndex` only when the detector upstream disagrees.
- Keep ~5–8 beats per strip (total ≤ ~7s) so the run fills the frame like the catalog.
- Echo the headline number (`bpm`, `hrv`) in real text next to the card.

**Don't**
- Don't smooth the beats or swap the PQRST template — sharp polylines are the spec.
- Don't feed BPM values to `rr` (or vice versa: `nightBpm` is BPM, `rr` is ms).
- Don't build a "mini ECG" with `Sparkline` — this component owns the rhythm-strip look.
- Don't hardcode hex, and don't restyle `.lk-vitals-*` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled ECGs.** Any rhythm strip, RR ruler, monitor card or overnight-HR curve on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new vitals form (e.g. SpO₂ trace) is added here, web + native in the same unit of work, same prop names.
- **Tokens only** — mint/cyan/violet/indigo/zone tokens throughout; paper/ruler whites are `--text` + opacity.
- **Don't fork the template** — the PQRST points and the 23.5 ms/px scale are the catalog spec; apps never re-implement them.
- **Parity gate:** changes ship only after the web and native stories are compared side-by-side against `vitals-charts.html`.
