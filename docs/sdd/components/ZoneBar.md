# SDD — `ZoneBar`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ZoneBar.tsx` · `packages/ui-native/src/components/ZoneBar.tsx` ·
> web CSS `packages/ui/src/styles/components/zonebar.css` (`.lk-zonebar*`).
> **Exports:** `ZoneBar`, type `ZoneBarProps`, type `ZoneBarZone`.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals; only the substrate differs (web `className` + CSS classes ↔ native `style` + `StyleSheet`).
> **Stories:** `packages/ui/src/stories/ZoneBar.stories.tsx`.

---

## 1. Overview

A horizontal **heart-rate training-zone bar**: the 5 HR zones (Z1..Z5) rendered as a row of token-colored pill segments whose **widths are proportional to time-in-zone**, with the cool→hot Z1→Z5 ramp, the **`current` zone lit** (the rest dimmed) and a bright **marker tick** showing where the athlete is right now. Optional Z1..Z5 labels sit below the bar.

It is the purpose-built counterpart to the watch + mobile training screens' hand-rolled `.zonebar` / `.zmark` / `.zgauge` — the **only** sanctioned way to render an HR-zone bar in any LockIn90 app (see §9). It is *not* a re-skin of `StackedBar`: it shares the flex-weighted-segment + token pattern but adds three things StackedBar lacks — the per-zone **current highlight**, the **marker tick**, and the **Z-labels** — while dropping the legend. Distinct from `Meter` (a single scalar value-in-range) and `RangeBar` (one value across a low/optimal/high reference range).

There are no variants — shape is driven entirely by the `zones` data, `current`, and `showLabels`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `zones` | `ZoneBarZone[]` | — (required) | ✓ | ✓ | the zones left→right (cool/recovery → hot/max); typically 5; segment width ∝ `value` |
| `current` | `number` | — | ✓ | ✓ | index `0..n-1` of the active zone → lit segment + marker tick; out-of-range / omitted = no marker |
| `showLabels` | `boolean` | `false` | ✓ | ✓ | render the zone labels (Z1..Z5) under the bar |
| `height` | `number` | `8` | ✓ | ✓ | bar thickness in px |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (minus `children`) | — | ✓ | — | web only — spreads to the wrapper (`id`, `data-*`, …) |

**`ZoneBarZone`** (identical both platforms):

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `number` | — (required) | time-in-zone (seconds) or a share — sizes the segment relative to the others |
| `label` | `string` | `Z{i+1}` | label under the bar; falls back to `Z1`..`Zn` by index |
| `color` | `string` | Z1→Z5 ramp | override the segment color — web a token `var()` (`'var(--lime)'`), native a hex/token string (`colors.lime`) |

- **Sizing:** each segment's `flexGrow` = its `value` (negatives treated as 0). If **every** `value` is 0 (empty state), all segments fall back to equal widths. A `min-width: 3px` keeps a zero/tiny zone visible.
- **Default ramp:** `[cyan, zone-high, lime, zone-mid, zone-low]` (cool recovery → hot max), lifted from the design's `.z1`..`.z5`. Beyond index 4 it falls back to `--accent` / `colors.accent`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web token | Native token | Value |
| --- | --- | --- | --- |
| Z1 (recovery) | `--cyan` | `colors.cyan` | `#22D3EE` |
| Z2 (easy) | `--zone-high` | `colors.zoneHigh` | `#34F5C5` |
| Z3 (aerobic) | `--lime` | `colors.lime` | `#A8FF35` |
| Z4 (threshold) | `--zone-mid` | `colors.zoneMid` | `#FFB020` |
| Z5 (max) | `--zone-low` | `colors.zoneLow` | `#FF4D6D` |
| Segment radius | `--r-pill` | `radii.pill` | `999` |
| Marker fill | `--text` | `colors.text` | `#EEF1F8` |
| Label (idle) | `--text-faint` | `colors.textFaint` | `#828B9F` |
| Label (current) | `--text` | `colors.text` | `#EEF1F8` |
| Label / mono | `--font-mono` | `fonts.mono` | JetBrains Mono, 9.5px / 600 / `.06em` |
| Motion | `--ease` | n/a | width drift 1.1s, opacity/glow .3s |

- **Layout:** wrapper is a `column` flex, `gap: 6`. Track is a `row` flex, `gap: 3`, height set inline (default 8); **no overflow clip** so the marker can protrude.
- **Opacity:** segments are `0.85` when no `current`; when a `current` is set, the rest drop to `0.42` and the current rises to `1` so the active zone reads at a glance.
- **Current-segment glow:** web `box-shadow: 0 0 12px -2px var(--seg)` (the segment's own color, passed via the per-segment `--seg` var); native `shadowColor` = the segment color, `shadowOpacity .7`, `shadowRadius 8`.
- **Marker:** a `3px` wide tick, `height = bar + 6` (protrudes 3px above + below), centered on the current zone. Fill `--text` / `colors.text`; glow `0 0 8px rgba(255,255,255,.85)` (web) / `shadowColor colors.text`, `shadowOpacity .85` (native) — the kit's white-glass glow convention, mirroring `.lk-daytl-now`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default (no current) | every `.lk-zonebar-seg` at opacity `.85` | every seg at opacity `.85` |
| Current set | `.has-current` dims others to `.42`; `.is-current` → opacity 1 + `--seg` glow + `.lk-zonebar-mark` | non-current segs → `.42`; current → opacity 1 + colored shadow + marker `View` |
| Empty (all values 0) | segments fall back to equal flex; no marker unless `current` set | same |
| Partial (some zones 0) | zero zones render at `min-width: 3px` | zero zones render at `minWidth: 3` |
| Labels on | `.lk-zonebar-labels` row, current label `--text`, rest `--text-faint` | label `Text` row, current `colors.text`, rest `colors.textFaint` |

No hover / pressed / focus / disabled — `ZoneBar` is a non-interactive read-only data viz (`role="img"`).

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same export surface (`ZoneBar` + `ZoneBarProps` + `ZoneBarZone`), same prop names, same defaults (`height: 8`, `showLabels: false`), same Z1→Z5 ramp, same sizing math (flexGrow ∝ value, equal-width empty fallback, 3px min-width), same opacity model, same marker geometry, same label typography. App code reads 1:1.

The only differences are the universal **substrate** ones the kit treats as "substrate is the only difference":

- **Style passthrough:** web `className` + `...rest` HTML attrs vs native `style` (the standard web/native convention — present in every kit primitive).
- **Impl:** web emits `lk-zonebar*` classes (CSS in `zonebar.css`, per-segment color via inline `background` + `--seg` var); native uses `StyleSheet` + inline `backgroundColor`/`shadowColor`. The current-zone glow is a CSS `box-shadow` on web and `shadowColor`/`elevation` on native — visually equivalent.

There is **no capability gap** — the bar renders identically and is fully usable on both platforms.

## 6. Composition & usage

- **Used by:** workout / training screens (live HR zone strip), post-workout summaries (time-in-zone), the watch companion surfaces.
- **Composes from:** nothing — a leaf primitive (token-colored flex segments + a marker). Shares the segmented-bar pattern with `StackedBar` but is its own component.
- **Pair with:** a `Meter` / big-stat readout for the live BPM, or a `Card` wrapper for the panel chrome.

```tsx
// web — live: 5 zones by minutes, athlete currently in Z3
<ZoneBar
  zones={[{ value: 8 }, { value: 6 }, { value: 12 }, { value: 3 }, { value: 1 }]}
  current={2}
  showLabels
/>

// native — same data, same API
<ZoneBar
  zones={[{ value: 8 }, { value: 6 }, { value: 12 }, { value: 3 }, { value: 1 }]}
  current={2}
  showLabels
/>
```

## 7. Accessibility

- **Web:** the track is `role="img"` with an `aria-label` enumerating the zones and which is current (e.g. _"Heart-rate zones: Z1, Z2, Z3 (current), Z4, Z5."_). The labels row + marker are `aria-hidden` (decorative — the label already names them).
- **Native:** the track `View` is `accessibilityRole="image"` with the same `accessibilityLabel`.
- **Contrast:** zone colors are bright spectrum tokens on the dark void; the lit/dim opacity split keeps the current zone distinguishable. Don't rely on color alone — pair `current` with the marker (default) and/or `showLabels` so the active zone is conveyed non-chromatically.
- **Non-interactive:** no focus/keyboard target by design.

## 8. Usage rules — Do / Don't

**Do**
- Pass time-in-zone (or a share) as `value`; let the component weight the widths.
- Set `current` to the live zone index so the lit segment + marker appear.
- Use `showLabels` when there's room for the Z1..Z5 axis; rely on the `aria-label` otherwise.
- Override a `color` only with a **token** (`var(--…)` web / `colors.…` native), and only for a deliberate non-default ramp.

**Don't**
- ✗ Don't hand-roll a row of colored zone bars / a `.zonebar` lookalike — use `ZoneBar`.
- ✗ Don't hardcode the zone colors, radius, or marker glow — they come from `@lockin90/tokens`.
- ✗ Don't pass `className` on native or `style`-as-className on web (wrong-platform prop).
- ✗ Don't use `ZoneBar` for a single scalar value (use `Meter`) or a low/optimal/high range (use `RangeBar`).
- ✗ Don't set `current` to an out-of-range index expecting a marker — it's ignored.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** The watch (`watch-v2/workout.html`) and the mobile training screens currently hand-roll the zone strip (`.zonebar` + `.zmark`, `.zgauge`). A local re-creation of the 5-zone ramp + lit-current + marker is a **parity violation** — it will drift from the kit and break the web≡native rule. If you need a zone bar, import `ZoneBar`.
- **New need → add to BOTH platforms.** If a screen needs a behavior `ZoneBar` doesn't have (e.g. per-zone time captions under the bar, a vertical gauge layout), **add the prop to `ZoneBar` on web AND native** (same prop name, same tokens) — never a one-off local component, never a fork on one platform only.
- **Tokens only.** Any color/radius/shadow not sourced from tokens is a bug, even if it "looks the same" today — Aurora Flux token renames will silently break hardcoded values.
- **Parity gate.** Before shipping a screen that uses `ZoneBar`, confirm the web phone-width render and the native render are identical (same zones, `current`, `showLabels`, `height`).
