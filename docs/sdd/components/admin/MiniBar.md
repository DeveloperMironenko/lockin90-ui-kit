# SDD — `MiniBar` (thin row wrapper over root `Meter`, track-only)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as:** `import { MiniBar } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/MiniBar.tsx` · composes root `packages/ui/src/components/Meter.tsx` · web CSS `packages/ui/src/styles/components/minibar.css` (`.lk-minibar*`) + `meter.css` (`.lk-meter*`). NO native counterpart.
> **Exports:** `MiniBar`, type `MiniBarProps`, type `MiniBarTone`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — operator console has no native surface.
> **Stories:** `packages/ui/src/stories/MiniBar.stories.tsx` (Storybook title `Admin/MiniBar`).

---

## 1. Overview

A compact **labelled proportion row** — left label, a thin `value/max` fill bar, right caption —
used for per-category breakdowns in the operator overview (per-plan MRR share, per-provider AI
cost, per-tier conversion, free-tier headcount). Three cells in a CSS grid:
`label · bar · caption`.

The fill **track is delegated to the root `Meter`**, rendered in Meter's **track-only mode**
(no `label`, no `showValue` → `hasHeader` is false, so Meter's header row never renders — just
`.lk-meter-track > .lk-meter-fill`). `MiniBar` keeps everything Meter doesn't provide: the
grid row layout, the left label cell, the right caption cell, and a **7-tone fill palette**
(`MiniBarTone`) piped into Meter via CSS var overrides. This mirrors `ReferenceRangeBar`'s
pattern (wrap a root primitive, add only the console chrome the bare primitive doesn't render) —
`MiniBar` is the same move applied to `Meter` instead of `RangeBar`.

## 2. API contract

### `MiniBarProps`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — (required) | left-hand label, e.g. `"PRO"`; truncates with ellipsis in a 64px column |
| `value` | `number` | — (required) | filled amount → Meter `value` |
| `max` | `number` | — (required) | denominator for the fill width → Meter `max`; fill = `value/max` clamped `[0,1]` (Meter `min` is hardcoded `0`) |
| `caption` | `ReactNode?` | — | right-hand caption (mono), e.g. `"3 · $29k"`; omitted → no caption cell rendered |
| `tone` | `MiniBarTone` | `'flux'` | fill colour — see palette below |
| `className` | `string?` | — | merged onto the root `.lk-minibar` via `cn` |

### `MiniBarTone`

`'flux' | 'accent' | 'mint' | 'cyan' | 'warn' | 'bad' | 'neutral'` — 7 tones, each mapped to a
CSS custom-property value (`TONE_BG`) piped into the delegated `Meter`'s `--fill`:

| Tone | `--fill` value |
| --- | --- |
| `flux` (default) | `var(--grad-flux)` |
| `accent` | `var(--accent)` |
| `mint` | `var(--mint)` |
| `cyan` | `var(--accent-2)` |
| `warn` | `var(--warn)` |
| `bad` | `var(--bad)` |
| `neutral` | `var(--text-faint)` |

This is a **separate palette from `MeterTone`** (`'high'|'mid'|'low'|'accent'|'mint'`) — `MiniBar`
always calls `Meter` with `tone="accent"` (just to pick Meter's CSS branch/class) and then
**overrides** the resulting fill colour with its own 7-tone `TONE_BG` value via inline `style`,
rather than using Meter's built-in tone prop directly. `MiniBarTone` is not assignable to
`MeterTone` and vice versa — do not conflate the two.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token / value |
| --- | --- |
| Row grid | `.lk-minibar` — `display:grid; grid-template-columns: 64px 1fr auto; align-items:center; gap:10px; padding:6px 0` |
| Label | `.lk-minibar-label` — `--font-mono` 10.5px, `0.04em` uppercase, `--text-dim`, `overflow:hidden; text-overflow:ellipsis; white-space:nowrap` |
| Fill track (delegated) | root `Meter`'s `.lk-meter-track`, height overridden `.lk-minibar-meter .lk-meter-track { height:6px }` (Meter's default is 8px — thinner here to keep MiniBar's original proportion) |
| Fill colour | Meter's `.lk-meter-fill` `background: var(--fill)`, where `--fill` is set per-instance to the tone's `TONE_BG` value (inline `style` on the `<Meter>` element) |
| Fill glow | forced off: `--glow: 'transparent'` inline (Meter's fill `box-shadow: 0 0 14px -3px var(--glow)` collapses to nothing) |
| Caption | `.lk-minibar-caption` — `--font-mono` 11px, `--text-faint`, `white-space:nowrap` |

- **What Meter still renders here:** `role="meter"` + `aria-valuemin/max/now` on the track root,
  the `--v` fraction math (`clamp((value-min)/span, 0, 1)`), the `.lk-meter-track > .lk-meter-fill`
  DOM, and Meter's 1.1s width transition — all reused verbatim.
- **What Meter does NOT render here:** the `.lk-meter-head` label/value row (no `label`/`showValue`
  passed → `hasHeader` is `false`), the threshold tick (`threshold` not passed), and segmented
  mode (`segments` not passed) — MiniBar never uses those Meter features.
- **What stays MiniBar's own:** the 3-column grid, the label and caption cells, and the 7-tone
  `TONE_BG` palette — none of this lives in `Meter` or its CSS.

## 4. States

| State | Behaviour |
| --- | --- |
| `caption` present | right cell renders (`.lk-minibar-caption`) |
| `caption` omitted (`== null`) | right cell not rendered — grid collapses to label + bar |
| Each `tone` | fill colour swaps per `TONE_BG`; track/glow shape unchanged |
| `value/max` fraction | Meter clamps `frac` to `[0,1]` — over/under-range values don't overflow or invert the bar |
| Long `label` | truncates with ellipsis in the fixed 64px column (no wrap, no reflow of the bar/caption) |

No hover / focus / pressed / disabled — non-interactive (delegated Meter is `role="meter"`).

## 5. Platform & relationship to root kit

**Web-only by design** (admin console is web-only) — no native counterpart, parity rule N/A.

`MiniBar` is a **wrapper-over-a-root-primitive**, the same governance pattern as
`ReferenceRangeBar` (wraps root `RangeBar`): the load-bearing fill track is the cross-platform
root `Meter`, reused in its track-only mode rather than re-implemented with bespoke
`.lk-minibar-track`/`.lk-minibar-fill` markup. The retired track/fill CSS rules were deleted from
`minibar.css` once the delegation landed — `minibar.css` now covers only the row grid, label,
caption, and the 6px track-height override.

Two things are explicitly **not** part of `Meter` and never will be, per this delegation:
- **MiniBar's row layout** (label · bar · caption grid) is MiniBar's own — it is not a Meter
  layout mode. A caller wanting this exact row shape reaches for `MiniBar`, not `Meter` + custom
  grid CSS.
- **Meter's label/value-readout/threshold/segmented features** are unused here — MiniBar always
  renders Meter header-less, tick-less, and in continuous (non-segmented) mode. If a future
  breakdown row needs a threshold tick or a segmented cell fill, extend `MiniBar`'s props to pass
  them through to the underlying `<Meter>`, don't fork a second track implementation.

## 6. Composition & usage

- **Composes:** root `Meter` (`@lockin90/ui`) for the fill track — passed `value`, `min={0}`,
  `max`, `tone="accent"`, `aria-label={label}`, and a `style` override for `--fill`/`--glow`.
- **Used by:** admin overview `DashboardPanels` — per-plan MRR breakdown, per-provider AI cost
  breakdown, per-tier conversion, free-tier headcount (`lockin90-admin/src/app/(app)/_overview/DashboardPanels.tsx`).

```tsx
import { MiniBar } from '@lockin90/ui/admin';

<MiniBar label="PRO" value={29} max={40} caption="3 · $29k" tone="flux" />
<MiniBar label="COACH" value={12} max={40} caption="1 · $12k" tone="mint" />
<MiniBar label="TEAM" value={8} max={40} caption="2 · $8k" tone="cyan" />
<MiniBar label="FREE" value={4} max={40} caption="120" tone="neutral" />
```

## 7. Accessibility

- The delegated `Meter` carries `role="meter"` with `aria-valuemin={0}` / `aria-valuemax={max}` /
  `aria-valuenow={value}` / `aria-label={label}` — the proportion is announced even though
  MiniBar suppresses Meter's visible header.
- `label` and `caption` are real DOM text (not just the `aria-label`), so sighted and
  screen-reader users both get the row's meaning without relying on the bar's fill colour alone.
- Tone conveys category grouping only (e.g. "this is the cost breakdown," not a pass/fail zone)
  — never the sole signal for a status; pair with `caption` text as this component already does.

## 8. Usage rules — Do / Don't

**Do**
- Use `MiniBar` for any label→fill→caption breakdown row in the admin overview.
- Keep `max` as the shared denominator across a group of `MiniBar` rows (e.g. total MRR) so the
  bars are comparably scaled.
- Pick `tone` from `MiniBarTone` to distinguish categories (plan, provider, tier) within one panel.
- Pre-format `caption` (locale, currency, units) upstream — MiniBar renders it as-supplied.

**Don't**
- ✗ Don't re-implement the fill track with bespoke `.lk-minibar-track`/`.lk-minibar-fill` markup —
  that CSS was retired; the track is `Meter`'s.
- ✗ Don't pass a `MeterTone` value where a `MiniBarTone` is expected (or vice versa) — the two
  palettes are distinct and not interchangeable.
- ✗ Don't reach for `MiniBar` when you need Meter's label/value-readout/threshold/segmented
  features — use root `Meter` directly for those.
- ✗ Don't hardcode the tone colours — they come from `@lockin90/tokens` via `TONE_BG`.
- ✗ Don't expect this on native — it is `/admin` web-only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled label+bar+caption row re-creates both this wrapper and `Meter`
  — and will drift from the fill/track conventions when Meter changes. Import `MiniBar`.
- **Extend the root, not a fork.** If a breakdown row needs a new Meter capability (a threshold
  tick, a segmented cell), wire it through to the underlying `<Meter>` here — never fork a second
  track implementation in `minibar.css`.
- **Tokens only.** The 7-tone `TONE_BG` palette and all Meter-inherited visuals are
  `@lockin90/tokens`-sourced; no raw hex.
- **Reuse is the rule.** The whole point of this delegation is that every value/max fill bar in
  the kit — dashboard meters and admin breakdown rows alike — shares one track implementation
  (`Meter`); don't break that by re-painting a parallel track here.
