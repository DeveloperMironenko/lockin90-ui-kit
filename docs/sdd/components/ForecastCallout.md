# SDD — `ForecastCallout`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform composite (AI / insights).
> **Source:** `packages/ui/src/components/ForecastCallout.tsx` · `packages/ui-native/src/components/ForecastCallout.tsx` ·
> web CSS `packages/ui/src/styles/components/forecastcallout.css` (`.lk-fc*`).
> **Exports:** `ForecastCallout`, type `ForecastCalloutProps`, type `ForecastCalloutTone`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; web draws the left accent bar via `::before` + `--lk-fc-c` var, native via an absolutely-positioned `View`. Tone tints are identical literals.
> **Stories:** `packages/ui/src/stories/ForecastCallout.stories.tsx` · `packages/ui-native/src/stories/ForecastCallout.stories.tsx`.

---

## 1. Overview

A **tinted glass forecast panel** — the "here's what's projected" callout. A tone-tinted glass background + 1px tone border + a **3px left accent bar** in the tone color, a top row of an optional leading icon + a tone-colored `Chip` (e.g. `Forecast` / `31-day`), then the projected peak/dip prose (emphasized `<b>`/`<strong>` spans allowed). Four tones — `accent` (violet), `positive` (mint), `negative` (red), `warn` (amber) — each driving the bar, chip, border, and background tint together. It's the forecast-specific sibling of `InsightCard`: short tinted prose, not a data panel.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `chip` | `string` | — | ✓ | ✓ | small leading label `Chip`, e.g. `'Forecast'` / `'31-day'` |
| `children` | `ReactNode` | — (required) | ✓ | ✓ | the forecast prose; native auto-wraps a `string` in styled `Text`, else renders the node |
| `tone` | `ForecastCalloutTone` (`'accent' \| 'positive' \| 'negative' \| 'warn'`) | `'accent'` | ✓ | ✓ | colors the chip + left bar + border + bg tint |
| `icon` | `IconName` | — | ✓ | ✓ | optional leading glyph (tone color) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web, minus `children`) / `ViewProps` (native, minus `children`) | — | ✓ | ✓ | both spread rest to the root; web sets `role="note"` |

- The top row (`.lk-fc-top`) renders only if `chip || icon`.
- **`CHIP_TONE`** maps callout tone → `ChipTone`: `accent → 'accent'`, `positive → 'high'`, `negative → 'low'`, `warn → 'mid'`. The chip is rendered with `dot`.

## 3. Visual spec (tokens — never hardcode)

| Part | Token / value |
| --- | --- |
| Panel | `--glass-2` base / tone-tinted bg (see below), `1px` tone border, radius `--r-sm` / `radii.sm` (10), padding `12px 13px 12px 16px`, `gap 7px`, `overflow: hidden`, `position: relative` |
| Left bar | `3px` wide, full height, tone color; web `::before` reading `var(--lk-fc-c)`, native an absolute `View` `left:0 top:0 bottom:0 width:3` |
| Top row | `.lk-fc-top` flex, `align-items: center`, `gap 7px` |
| Icon | tone color (`var(--lk-fc-c)` / `t.c`), `Icon size={16}` |
| Chip | `Chip tone={CHIP_TONE[tone]} dot` |
| Text | `--font-ui` / `fonts.ui`, `13px`, line-height 1.5 (native `19`), `--text-dim` / `colors.textDim`; web `<b>`/`<strong>` → weight 700 `--text` |

**Tone tints** (`--lk-fc-c` color · bg · border — identical literals on both platforms):

| Tone | Color | Background | Border |
| --- | --- | --- | --- |
| `accent` | `--accent` / `colors.accent` (violet) | `rgba(124,92,255,.08)` | `rgba(124,92,255,.3)` |
| `positive` | `--mint` / `colors.mint` | `rgba(52,245,197,.08)` | `rgba(52,245,197,.3)` |
| `negative` | `--zone-low` / `colors.zoneLow` (red) | `rgba(255,77,109,.08)` | `rgba(255,77,109,.3)` |
| `warn` | `--zone-mid` / `colors.zoneMid` (amber) | `rgba(255,176,32,.08)` | `rgba(255,176,32,.3)` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| accent (default) | `.lk-fc-accent` violet bar/border/tint | `TONE.accent` |
| positive | `.lk-fc-positive` mint | `TONE.positive` |
| negative | `.lk-fc-negative` red | `TONE.negative` |
| warn | `.lk-fc-warn` amber | `TONE.warn` |
| No chip & no icon | top row omitted | top row omitted |
| Emphasis | `<b>`/`<strong>` → `--text` weight 700 | pass bold `Text` nodes as children |

Non-interactive — no hover / pressed / focus / disabled.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, one substrate delta.** Identical props, the four tone tints (same `rgba` literals), `CHIP_TONE` mapping, `dot` chip, optional icon, padding, radius, and prose typography. The only difference is how the accent bar is drawn:

- **Left bar:** web uses a `::before` pseudo-element reading the `--lk-fc-c` CSS var; native renders an absolutely-positioned `View` (`pointerEvents="none"`) with the tone color. Same `3px` full-height bar — no pseudo-elements in RN, so the `View` is the necessary equivalent.
- **Children:** web drops `children` into `<p class="lk-fc-text">`; native wraps a `string` in styled `Text` and passes richer nodes through (so bold emphasis is composed as nested `Text` rather than `<b>`). App code reads 1:1.

No capability gap — both render the same tinted callout with the same bar/chip/tint.

## 6. Composition & usage

- **Composes from:** `Chip` (tone-mapped, `dot`) + `Icon` (optional, tone color) + the tinted panel + accent bar. No `Card`.
- **Composed into:** forecast / projection sections — the projected energy peak/dip line on the dashboard or intelligence timeline. Use `tone` to match the projection's valence (`positive` peak, `negative`/`warn` dip).

```tsx
// web
<ForecastCallout tone="positive" chip="Forecast" icon="trend-up">
  Projected <b>peak +14</b> energy on Thursday — train hard.
</ForecastCallout>

// native
<ForecastCallout tone="warn" chip="31-day" icon="trend-down">
  <Text>Projected <Text style={{ fontWeight: '700' }}>dip −9</Text> mid-week — ease off.</Text>
</ForecastCallout>
```

## 7. Accessibility

- **Web:** root `<div role="note">` so assistive tech treats it as an aside/annotation. The icon is `aria-hidden`; meaning lives in the chip + prose.
- **Native:** root `View` (spread `...rest` allows `accessibilityRole`/`accessibilityLabel`); the bar `View` is `pointerEvents="none"` and decorative.
- **Color independence:** tone is reinforced by the `chip` label + prose, not color alone — don't rely on mint-vs-red being distinguishable; the chip text + content carry the valence.
- **Contrast:** `--text-dim` prose on the `.08` tint over the void meets body contrast; bold spans lift to `--text`.

## 8. Usage rules — Do / Don't

**Do**
- Set `tone` to match the forecast valence (positive peak / negative-or-warn dip).
- Use a short `chip` label (`Forecast`, `31-day`) — it's the callout's category badge.
- Emphasize the key number with `<b>`/`<strong>` (web) or a bold nested `Text` (native).

**Don't**
- ✗ Don't hand-roll a tinted callout with a custom left bar + chip — use `ForecastCallout`.
- ✗ Don't use it as a data panel (icon+title+sparkline+stats) — that's `InsightCard`.
- ✗ Don't hardcode the tone tints, bar color, or chip mapping — they come from `@lockin90/tokens` (the `.08`/`.3` `rgba` tints are the shared literals, kept identical across platforms).
- ✗ Don't rely on tone color alone to convey peak vs dip (a11y).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom forecast banner" re-creating the tinted glass + 3px bar + tone chip is a parity violation — import `ForecastCallout`.
- **New need → both platforms.** A new `ForecastCalloutTone` must be added to **both** web (`TONE` class + `.lk-fc-*` tint CSS + `CHIP_TONE`) and native (`TONE` map + `CHIP_TONE`) with the same color + tint literals — never a one-off.
- **Tokens only.** Bar/chip/icon tone colors source from tokens; the per-tone bg/border `rgba()` tints are the one shared literal set and must stay byte-identical across platforms.
- **Parity gate.** Before shipping a forecast screen, confirm web phone-width and native render the same tone bar, chip, icon, tint, and prose emphasis.
