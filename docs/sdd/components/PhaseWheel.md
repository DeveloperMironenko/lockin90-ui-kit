# SDD — `PhaseWheel` (+ `PhaseArc`, `PhaseMarker`, `CyclePhase` types)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/PhaseWheel.tsx` · `packages/ui-native/src/components/PhaseWheel.tsx` ·
> web CSS `packages/ui/src/styles/components/phasewheel.css` (`.lk-pw*`).
> **Exports:** `PhaseWheel`, type `PhaseArc`, type `PhaseMarker`, type `PhaseWheelProps` (file also defines `CyclePhase`, `PhaseWheelVariant` — not yet re-exported from the index).
> **Status:** Shipped. **Parity:** 🟡 same API & geometry; label-overflow via CSS padding/`overflow:visible` (web) vs an expanded canvas pad (native); web today-pulse animates, native is a static halo; colors `var()` vs hex.
> **Stories:** `packages/ui/src/stories/PhaseWheel.stories.tsx` · `packages/ui-native/src/stories/PhaseWheel.stories.tsx` (incl. `CW01PhaseWheel`, `CW01Focus`, `CW01Shine`, `CW04CoachWheel`, `CW05PhaseStrip`).

---

## 1. Overview

The kit's **phase-cycle chart**, in two families selected by `variant`:

- **`'circadian'` (default)** — a circular **24-hour circadian clock**: faint track ring + colored phase bands (sleep / focus / dip / wind-down), hour ticks (labeled at 0/6/12/18), point markers, an optional "now" hand, centered clock (or `'24h'`). Hour 0 at top, clockwise. A bare `<PhaseWheel />` renders exactly this.
- **Cycle variants** (design catalog `cycle-charts.html`):
  - **`'phase-wheel'` (CW-01)** — a 28-day menstrual-cycle wheel: 4 phase arcs (coral/cyan/lime/violet, round caps, 2.5° gaps each end), D-labels (D1/D8/D15/D22), a **today pulse dot** on the ring, center **day + phase readout**, and a phase **legend**. Optional **FOCUS** state (`focusPhase`): the named phase stays full-strength, others dim to 20%, center shows days-left.
  - **`'coach-wheel'` (CW-04)** — the wheel + a phase-tinted **recommendation pill** under it (`LUTEAL — LOWER INTENSITY, MORE SLEEP`); center uses the short `D21` form.
  - **`'phase-strip'` (CW-05)** — the wheel unrolled: phase pills on a linear 28-day strip + **TODAY rule** with a tag + D-ticks (D1/D7/D14/D21/D28).

Secondary type exports:
- **`PhaseArc`** = `{ from, to, color, label? }` — circadian band, `from > to` wraps midnight.
- **`PhaseMarker`** = `{ at, color?, label? }` — circadian dot on the ring.
- **`CyclePhase`** = `{ name, days, color }` — one cycle phase; phases run consecutively from day 1, total = Σ `days`.

The only sanctioned circadian/24h clock AND the only sanctioned cycle wheel/strip. Sleep architecture → `Hypnogram`; generic dial → `Gauge`; generic progress ring → `Ring`.

## 2. API contract

| Prop | Type | Default | Web | Native | Variant | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `variant` | `'circadian' \| 'phase-wheel' \| 'coach-wheel' \| 'phase-strip'` | `'circadian'` | ✓ | ✓ | — | chart form; omitting keeps the original clock |
| `arcs` | `PhaseArc[]` | `DEFAULT_ARCS` | ✓ | ✓ | circadian | colored phase bands (ignored by cycle variants) |
| `markers` | `PhaseMarker[]` | Wake @7, Melatonin @21 | ✓ | ✓ | circadian | ring dots (ignored by cycle variants) |
| `now` | `number \| null` | `14.5` | ✓ | ✓ | circadian | hand + center clock; `null` hides (center `'24h'`) |
| `size` | `number` | `200` | ✓ | ✓ | wheels | diameter in px (ignored by `phase-strip`) |
| `thickness` | `number` | `16` | ✓ | ✓ | wheels | ring stroke px (ignored by `phase-strip`) |
| `hourTicks` | `boolean` | `true` | ✓ | ✓ | circadian | hour ticks + cardinal labels |
| `phases` | `CyclePhase[]` | Menstrual 5 coral / Follicular 8 cyan / Ovulation 3 lime / Luteal 12 violet | ✓ | ✓ | cycle | consecutive phases → 28-day catalog cycle |
| `day` | `number \| null` | `21` | ✓ | ✓ | cycle | 1-based current day (clamped to 1..total) → today pulse/rule + readout; `null` hides, center falls back to `'28d'` |
| `focusPhase` | `string` | — | ✓ | ✓ | wheels | FOCUS: named phase (case-insensitive) full-strength, others 20%, center = days-left (`focus.end − day`) |
| `tip` | `string` | `'lower intensity, more sleep'` | ✓ | ✓ | coach-wheel | pill reads `<PHASE> — <TIP>` (uppercased) |
| `legend` | `boolean` | `true` for `'phase-wheel'`, else `false` | ✓ | ✓ | wheels | phase legend beside the wheel |
| `shine` | `boolean` | `false` | ✓ | ✓ | wheels | arc glow (see §3; no-op on strip, per catalog) |
| `width` | `number` | `300` | ✓ | ✓ | phase-strip | total strip width in px (strip height fixed 76) |
| `children` | `ReactNode` | — | ✓ | ✓ | clock + wheels | center content override |
| `className` / _rest_ | `string` / `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | — | web only, on the root `<div>` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | — | native only (wrapper) |

- **Circadian geometry (unchanged):** `r = (size−thickness)/2`; dasharray arcs on a −90°-rotated circle; `arcSpanHours`, `hourPoint`, `formatHour` as before.
- **Cycle geometry (identical both sides):** `phaseRanges()` lays phases end-to-end (`start`/`end` 1-based inclusive, `total = max(1, Σdays)`). `dayAngle(d) = (d−1)/total·360` (day 1 at top, clockwise). Arc per phase: `a0 = dayAngle(start) + 2.5`, `a1 = dayAngle(end+1) − 2.5` (skipped when `a1 ≤ a0`) via `arcPath()` (`A` command, sweep 1). D-labels every 7 days from D1 at radius `r + thickness/2 + 6`. Today dot at `polarPoint(c, c, r, dayAngle(day))`.
- **Center readout:** children override wins; else focus → `{daysLeft}d` / `LEFT · {NAME}`; else `DAY {day}` (`D{day}` on coach-wheel) / `{PHASE}`; else (`day=null`) `{total}d`.
- **Strip geometry:** `x0=8`, `ww=width−16`; pill x from `(start−1)/total`..`end/total`, 2px gap, h16 rx8, opacity .8, name inside only when pill w > 52. D-ticks (D1, every 7th, last day) at cell centers, `y+21`. TODAY rule at `(day−0.5)/total`, tag pill `w = len·5.35+12` clamped inside the canvas.

## 3. Visual spec (tokens — never hardcode)

Circadian: unchanged — see the classes `.lk-pw-track/-arc/-tick(-major)/-card/-hand(-dot)/-marker(-label)/-clock` (track `rgba(255,255,255,0.07)`, ticks `--border-2`/`--text-dim`, labels `9px var(--font-mono)`, hand/clock `var(--text)`, clock 30px display).

Cycle variants:

| Aspect | Web | Native |
| --- | --- | --- |
| Phase arcs | `.lk-pw-cycle-arc` stroke = `phase.color`, width `thickness`, round caps, opacity `.9` (`.2` dimmed), opacity transition `.45s var(--ease)` | same values via `Path`; dim via `<G opacity>`; no transition |
| `shine` | `.lk-pw-arc-shine` `drop-shadow(0 0 5px currentColor) + (0 0 12px)`, `color` set inline per arc | Gaussian-blurred duplicate `Path` behind (`FeGaussianBlur stdDeviation 5`): `strokeWidth thickness+2`, `strokeOpacity 0.6` |
| D-labels | `.lk-pw-dlabel` `9px var(--font-mono)` `var(--text-faint)` ls `.06em` | `fonts.mono 9` `colors.textFaint` |
| Today dot | `.lk-pw-today` r4 `fill var(--text)` + `drop-shadow(0 0 5px var(--text))`; `.lk-pw-today-pulse` ring `stroke-width 1.4` animating `scale 1→2.75 / opacity .8→0` 1.8s infinite (reduced-motion: static `scale(1.8)` at `.3`) | static: r4 `colors.text` dot + r8 halo ring `strokeWidth 1.4` `strokeOpacity 0.3` |
| Center big / sub | `.lk-pw-day` `24px` w700 ls `−.02em` `var(--text)` (+`lk-display lk-tnum`) · `.lk-pw-daysub` `9px var(--font-mono)` `var(--text-faint)` | `fonts.display 24` `'700'` ls −0.5 · `fonts.mono 9` `colors.textFaint` |
| Legend | `.lk-pw-legend` column gap 12 · 8px dot (phase color) · `.lk-pw-legend-label` `9px var(--font-mono)` `var(--text-dim)`, `NAME · D1-5` | same via Views (`legendDot` 8×8 r4) |
| Coach pill | `.lk-pw-tip` `var(--r-pill)`, bg `color-mix(var(--bg-0) 78%, transparent)`, border 1px `color-mix(--lk-pw-tip 35%)`, text `9px var(--font-mono)` in `--lk-pw-tip` (= current phase color) | `radii.pill`, bg `withAlpha(colors.bg0,'C7')`, border `withAlpha(tipColor,'59')`, `fonts.mono 9` |
| Strip pills | rx8 h16 fill `phase.color` op `.8`; name `.lk-pw-strip-name` `fill var(--bg-0)` `9px mono` | `Rect` same; `SvgText colors.bg0` |
| Strip ticks / rule / tag | `.lk-pw-strip-tick` `--text-faint`; `.lk-pw-strip-rule` `var(--text)` op `.4` w1.2; tag `.lk-pw-tag-box` `fill var(--bg-0)` `.78` + phase-color stroke `.35` w0.8 rx6.5, `.lk-pw-tag-text` 8px mono phase color | same values inline on `Line`/`Rect`/`SvgText` |
| Layout | `.lk-pw-cycle` column, gap 12, padding 12; `.lk-pw-cycle-row` row gap 18; `.lk-pw-strip` padding 0 | `cycleRoot`/`cycleRow` same gaps; dial canvas = `size + 32` (PAD 16) |

- Default phase colors: coral `var(--zone-low)`/`colors.zoneLow`, `var(--cyan)`, `var(--lime)`, `var(--violet)`. Names are rendered `UPPERCASE` regardless of input casing.
- No track ring behind cycle arcs (catalog-exact).

## 4. States

| State | Behavior (both platforms unless noted) |
| --- | --- |
| Default circadian | bare `<PhaseWheel />` — identical to the pre-variant component |
| `day = null` (cycle) | no today pulse / TODAY rule; center `'{total}d'` (e.g. `28d`), no sub |
| FOCUS (`focusPhase`) | matched phase `.9`, others `.2` (web animates the dim); center `{daysLeft}d` / `LEFT · {NAME}`; unmatched name → no dim |
| `shine` | wheel arc glow (web filter / native duplicate arc); ignored by `phase-strip` |
| `legend={false}` on phase-wheel | wheel only (and vice-versa on coach-wheel) |
| Custom center | `children` replaces the day/phase readout (wheels) |
| Tiny phase | arc skipped when the 2.5°+2.5° gap consumes it (`a1 ≤ a0`); strip pill skipped when width ≤ 0, name hidden ≤ 52px |
| Reduced motion (web) | today pulse freezes to a static faint ring |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & geometry; three substrate differences.** `phaseRanges`/`dayAngle`/`arcPath`/`stripTicks` and every default (`day 21`, 28-day phases, `width 300`, strip metrics) are copy-identical. Differences:

- **Today pulse:** web animates an expanding ring (`lk-pw-pulse` keyframes); native shows a **static** dot + halo (no CSS animation in RN SVG; StatusDot precedent: "web pulses; native static glow").
- **`shine`:** web = CSS `drop-shadow` on the arc; native = a Gaussian-blurred duplicate arc (`+2` @ `0.6`, `FeGaussianBlur stdDeviation 5` — see CONVENTIONS.md). Visual intent identical.
- **Label overflow / box size:** native wheel canvas is `size + 32` (PAD 16) because RN SVG hard-clips; web uses `.lk-pw-cycle { padding: 12px }` + `overflow: visible`. Account for the larger native box in layout. (Circadian keeps its PAD 46 / padding 32px.)
- Color literal: web accepts `var()`; native needs resolved hex (defaults come from `@lockin90/tokens`). Web-only: arc dim transition, SVG drop-shadow polish.

No capability gap — fully usable on both.

## 6. Composition & usage

- **Used for:** the circadian "your day" clock; the cycle screen's phase wheel (CW-01), the phase-aware coach card (CW-04), and compact planning rows (CW-05).
- **Composes from:** nothing — leaf primitive. Pass `GradientText`/`Stat` as `children` for a custom wheel center.

```tsx
// web — cycle wheel with FOCUS
<PhaseWheel variant="phase-wheel" day={21} focusPhase="Luteal" />

// web — coach wheel + strip
<PhaseWheel variant="coach-wheel" day={21} tip="lower intensity, more sleep" />
<PhaseWheel variant="phase-strip" day={21} width={320} />

// native — same props, hex tokens for custom phases
<PhaseWheel
  variant="phase-wheel"
  phases={[
    { name: 'Menstrual', days: 5, color: colors.zoneLow },
    { name: 'Follicular', days: 8, color: colors.cyan },
    { name: 'Ovulation', days: 3, color: colors.lime },
    { name: 'Luteal', days: 12, color: colors.violet },
  ]}
  day={9}
/>
```

## 7. Accessibility

- **Web:** circadian root keeps its `role="img"` + auto label. Cycle wheels put `role="img"` + a generated label on the **dial** (`"28-day cycle wheel, day 21 (Luteal): Menstrual D1–5, … Focus Luteal, 7 days left."` + coach tip when present) so the legend/pill remain real text; strip root is `role="img"` with the same summary. All SVGs `aria-hidden`.
- **Native:** cycle roots set `accessibilityRole="image"` + the same generated `accessibilityLabel`; the circadian variant still has none — wrap it yourself.
- Center/labels use `--text`/`--text-faint`; phase colors must come from spectrum/zone tokens.

## 8. Usage rules — Do / Don't

**Do**
- Keep phases **consecutive day counts** (`days`), not ranges — the component derives D1-based ranges and the total.
- Pass `day` as the 1-based cycle day; `null` for a static reference wheel/strip.
- Use `focusPhase` with a `day` so the days-left center can compute.
- Account for the native wheel canvas pad (`size + 32`) and the web `12px` padding in layout.

**Don't**
- ✗ Don't hand-roll a cycle wheel/strip (or a 24h ring clock) — this is the primitive.
- ✗ Don't pass CSS `var()` colors on native — pass token hexes from `@lockin90/tokens`.
- ✗ Don't mix families: `arcs`/`markers`/`now`/`hourTicks` are circadian-only; `phases`/`day`/`focusPhase`/`tip`/`legend`/`shine`/`width` are cycle-only.
- ✗ Don't restyle the coach pill into a `Chip`/`Badge` lookalike — the pill is part of the variant.
- ✗ Don't hardcode phase colors — coral is `--zone-low`, the rest are spectrum tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A dasharray ring clock, a hand-built cycle donut, or a row of colored rounded rects with a today line duplicates this primitive — import `PhaseWheel` with the right `variant`.
- **New need → add to BOTH platforms.** Want an inner energy band (catalog CW-03 form), marker tooltips, or an animated native pulse? Same prop name, same tokens, web + native together — never a one-off.
- **Tokens only.** Phase/label/pill colors come from `@lockin90/tokens`; the only literals in source are the catalog's white-alpha track/rule tints.
- **Parity gate.** Before shipping a screen: same arcs (gaps, caps, dim state), same D-labels, same center readout, same legend rows, same pill text, same strip pills/ticks/TODAY tag on web phone-width and native — only the pulse animation, shine mechanism, and canvas pad may differ.
