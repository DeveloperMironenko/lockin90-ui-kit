# SDD — `ProgressBar` (+ `ProgressBarVariant` type · `BarFill` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ProgressBar.tsx` · `packages/ui-native/src/components/ProgressBar.tsx` ·
> web CSS `packages/ui/src/styles/components/progressbar.css` (`.lk-progressbar*` classic · `.lk-pbv*` variants).
> **Exports:** `ProgressBar`, type `ProgressBarProps` (plus in-file `ProgressBarVariant`).
> **Status:** Shipped. **Parity:** 🟡 same modes & look; the **`gradient` prop type differs** (web `string` · native `[from, to]` tuple), the indeterminate sweep is CSS vs `Animated`, and native pills anchor without a true translateX(-50%).
> **Stories:** `packages/ui/src/stories/ProgressBar.stories.tsx` · `packages/ui-native/src/stories/ProgressBar.stories.tsx` — variant stories named by catalog ID (`PL01Progress` …).

---

## 1. Overview

An **Aurora-Flux linear progress bar** in three modes:

- **Determinate** — a known `value` 0..1 → an inline-width gradient fill.
- **Indeterminate** — omit `value` → a sweeping gradient band.
- **Catalog variants (`variant="…"`)** — the 8 named forms from `lockin90-design/charts/progress-charts.html` (PL-01…PL-16): a mono title + bold `%` header row, optional `sub` copy, and per-variant structure (zone coloring, step cells, milestone ticks, ghost compare, overflow badge, head pill, countdown drain). Rendered in DOM/Views (not SVG) so the bar stays truly full-width responsive.

Richer sibling of `BarFill` (static fraction only); for a labelled value-in-range use `Meter`.

### Catalog ID → variant map

| ID | `variant` | Form | Extra props used |
| --- | --- | --- | --- |
| PL-01 | `progress` | title+%+sub row | `color`/`gradient` (COLOR SELECT) · `height` 3/8/18 (HEIGHT SELECT) · `shine` |
| PL-04 | `zone-progress` | fill + % colored by value zone (mint/amber/coral) | — |
| PL-08 | `step-cells` | discrete cells, filled = done, counter under | `steps` (default 10) |
| PL-09 | `milestone-line` | ticks + dots at 25/50/75, lit when passed | `milestones` (override fractions) |
| PL-11 | `ghost-compare` | white-16% ghost layer under = previous period | `ghost` (0..1) |
| PL-13 | `overflow-badge` | fill caps at 100% + lime `+N OVER` pill; `%` shows the real value | `value` may exceed 1 |
| PL-14 | `head-pill` | chip-pill with `%` rides the fill head | — |
| PL-16 | `countdown-drain` | coral fill anchored right, drains right→left | `sub` (time remaining copy) |
| — | *(option)* | GOAL tick + pill (`--zone-mid`) on any linear variant | `target` (0..1) |

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number \| undefined` | `undefined` | ✓ | ✓ | 0..1 determinate; `undefined` → indeterminate (variants treat as 0); `overflow-badge` accepts > 1 |
| `height` | `number` | `8` | ✓ | ✓ | the PL-01 HEIGHT SELECT (3 hairline / 8 default / 18 thick) |
| **`gradient`** | web `string` · native `[string, string]` | classic: `--grad-flux` / `[accent, cyan]` · variants: none | ✓ | ✓ | **platform-shaped**; in variant mode wins over `color` |
| `color` | `string` | variant `--mint` (`countdown-drain` → `--zone-low`) | ✓ | ✓ | variant solid fill (web `var()` / native hex); ignored by `zone-progress` |
| `track` | `string` | `rgba(255,255,255,0.07)` / `colors.glass` (classic native) | ✓ | ✓ | unfilled rail |
| `label` | `string` | — | ✓ | ✓ | classic: meta label · variants: the mono uppercase **title** |
| `showValue` | `boolean` | classic `false` · **variants `true`** | ✓ | ✓ | variants render the bold display `%` top-right unless `showValue={false}` |
| `rounded` | `boolean` | `true` | ✓ | ✓ | pill ends |
| `variant` | `ProgressBarVariant` | — | ✓ | ✓ | see the ID map |
| `sub` | `string` | — | ✓ | ✓ | mono faint copy under the bar (step-cells: replaces the counter) |
| `steps` | `number` | `10` | ✓ | ✓ | `step-cells` cell count; done = `round(value·steps)` |
| `milestones` | `number[]` | `[0.25,0.5,0.75]` on `milestone-line` | ✓ | ✓ | tick/dot fractions; usable on other linear variants too |
| `ghost` | `number` | — | ✓ | ✓ | previous-period fraction (white-16% layer) |
| `target` | `number` | — | ✓ | ✓ | GOAL tick + `GOAL n` pill at the fraction |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay (web blur(6px) dup · native wider faint dup) |
| `className` / _rest_ | web `Omit<HTMLAttributes,'role'>` / native `ViewProps` | — | ✓ | ✓ | spreads to root |

- Readout: `pct = round(value·100)` — clamped 0..100 except `overflow-badge` (catalog shows e.g. `112%`); `aria-valuenow` always clamps to 100.

## 3. Visual spec (tokens — never hardcode)

Classic mode unchanged (flux fill, 38% sweep band, mono 10.5px meta).

Variant mode (both platforms, catalog-exact):

| Element | Value |
| --- | --- |
| Header | title 10px `--font-mono` uppercase ls .06em `--text-faint` · `%` 15px `--font-display` 700 `--text` (zone variant → zone color), mb 9px |
| Track | height `height`, `--r-pill` radius, `rgba(255,255,255,.07)` |
| Fill | absolute layer, width `value%`, `color`/`gradient` paint; web tweens width 1.2s (reduced-motion off) |
| Zone fill | `--zone-high/mid/low` at ≥0.62 / ≥0.38 / else (catalog `zoneOf`) |
| Ghost | `rgba(255,255,255,.16)` layer under the fill |
| Step cells | flex row, 3px gap, r3, base `rgba(255,255,255,.07)`; counter `N / M STEPS` under |
| Milestones | 1px ticks `rgba(255,255,255,.3)` ±3px past the track · 4.8px dots 7px above (lit = fill color, else white-20%) |
| GOAL tick | 1.6px `--zone-mid` rule ±5px + `GOAL n` pill |
| Chip-pill | h13 r6.5, bg `rgba(8,10,18,.78)`, 1px hairline @35% of the text color, 8px mono (catalog `C.tag`) |
| Overflow pill | `--lime` `+N OVER`, right-aligned under the bar |
| Drain fill | `--zone-low`, anchored **right**, width = remaining fraction |
| Sub / foot | 10px mono `--text-faint`, mt 7px (sub left · overflow pill right) |
| Shine | web blurred dup (blur 6px, ±2.5px, @.5) · native wider dup (+5px h, @.35, no blur) |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Classic determinate / indeterminate | unchanged | unchanged |
| Variant | `.lk-pbv--<variant>` DOM structure | View structure |
| Overflow (`value>1`) | fill caps at 100%, `%` real, `+N OVER` pill | same |
| Milestone passed | dot takes the fill color | same |
| Reduced motion | fill tween disabled (`prefers-reduced-motion`) | fills are static widths |

`role="progressbar"` + aria values on web (both modes); no hover/focus/disabled.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & forms, platform-shaped paint + anchoring.** Identical prop names, defaults, catalog geometry (pill 13px, dots 4.8px, ticks ±3px, 35% hairline). Real differences:

- **`gradient` type** — web CSS string ↔ native tuple (pre-existing kit convention).
- **Pill anchoring** — web centers pills with `translateX(-50%)` + `clamp()` against the edges; native centers via a zero-width `alignItems:'center'` anchor **without edge clamping** (RN has no % transforms). Extreme head-pill positions (~0%/100%) can overhang on native.
- **Hairline tint** — web `color-mix(currentColor 35%)`; native appends a `59` alpha to hex tokens (`tint35`).
- **Shine / motion** — web blur + width tween; native duplicate + static widths.
- Reduced motion honored on web only (as before, indeterminate sweep included).

## 6. Composition & usage

- **Used for:** goal/intake rows (PL-01/04), habit streaks (PL-08), multi-stage flows (PL-09), period compares (PL-11), beaten goals (PL-13), edge-labelled fills (PL-14), cutoffs/deadlines (PL-16), uploads/sync (classic).
- **Composes from:** none — self-contained (header + sub included; don't wrap it in another labelled row).

```tsx
// web — PL-13 beaten goal
<ProgressBar variant="overflow-badge" value={1.12} color="var(--lime)" label="STEP GOAL" sub="11,2k of 10k" />

// native — PL-08 habit streak
<ProgressBar variant="step-cells" value={0.7} steps={10} color={colors.mint} label="HABIT STREAK · THIS WEEK" />
```

## 7. Accessibility

- **Web:** `role="progressbar"` with `aria-valuemin/max/now` (now clamped ≤100) and `aria-label` = `label` in both modes; decorative layers are `aria-hidden`.
- **Native:** no ARIA role wired; pass `accessibilityLabel`/`accessibilityRole` via `...rest` when the progress matters.
- The overflow `%`/pill and the step counter give text equivalents; zone color is a supporting encoding — state the meaning in `label`/`sub`.

## 8. Usage rules — Do / Don't

**Do**
- Ask for progress forms **by catalog ID** (PL-xx) — the map resolves them mechanically.
- Pass `value > 1` only with `overflow-badge`; every other variant clamps.
- Use `sub` for the human copy (`94 g logged · 36 g to go`) instead of composing an extra text row.
- Wrap in a width-constrained container — the bar is full-width.

**Don't**
- ✗ Don't pass a tuple to web `gradient` or a string to native `gradient` — platform-shaped.
- ✗ Don't hand-roll cells/milestones/drain bars — they're variants here.
- ✗ Don't use `countdown-drain` for a filling value — it encodes **remaining** time, anchored right.
- ✗ Don't hardcode the zone thresholds, pill chrome, or ghost/track alphas — catalog constants.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom title+% progress row or step-cell strip re-creates PL-01/PL-08 — import `ProgressBar` with the `variant`.
- **New variant → BOTH platforms** with the same prop names + tokens, in the same unit of work.
- **Tokens only.** Allowed literals are the catalog's structural alphas (track 7%, ghost 16%, tick 30%, pill bg) — everything colored comes from tokens.
- **Parity gate.** Web phone-width ≡ native for the same variant/props; the known native deltas are the un-clamped pill anchor and duplicate-based shine.
