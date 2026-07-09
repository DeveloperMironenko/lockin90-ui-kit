# SDD — `StatCard` (thin wrapper over root `MetricTile`)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as:** `import { StatCard } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/StatCard.tsx` · composes root `packages/ui/src/components/MetricTile.tsx` · web CSS `packages/ui/src/styles/components/statcard.css` (`.lk-statcard*`) layered over `metric.css` (`.lk-metric*`). NO native counterpart.
> **Exports:** `StatCard`, types `StatCardProps`, `StatDeltaDir`, `StatValueTone`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — operator console has no native surface.
> **Stories:** `packages/ui/src/stories/StatCard.stories.tsx`.

---

## 1. Overview

A **KPI stat cell** for the operator overview stat row: uppercase mono label, big display value, a delta line, and a bottom "spark" fill bar. It is now a **thin wrapper over the root `MetricTile`** (`@lockin90/ui`): `MetricTile` owns the label / value / delta / spark skeleton (the `spark` accessory was added there for exactly this), and this admin layer re-applies the KPI-cell chrome that a plain glass MetricTile doesn't have:

- an **opaque, uniform-height KPI card** (violet-tinted solid fill, `min-height 104px`) instead of MetricTile's translucent glass tile;
- a **value tone** — flux `gradient`, `mint`, or an explicit computed `valueColor` — on the number;
- a **delta LINE** (arrow-prefixed, colour-coded) rather than MetricTile's tone PILL.

It is a pure render component (no state). Mirrors `.stat` + `.stat-cell` + `.barfill` from `lockin90-design/admin/overview.html`. Its public API is unchanged from the pre-consolidation `StatCard`.

## 2. API contract

### `StatCardProps` (extends `HTMLAttributes<HTMLDivElement>`)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | uppercase mono label → MetricTile `label` |
| `value` | `string` | — | pre-formatted big value → MetricTile `value` (wrapped in a tone span, see below) |
| `valueTone` | `'default' \| 'gradient' \| 'mint'` | `'default'` | value colour treatment; `gradient` = static flux, `mint` = `--mint` |
| `valueColor` | `string?` | — | explicit value colour (overrides `valueTone`) — for graded scales (e.g. error-rate orange→red) |
| `delta` | `string?` | — | delta caption, e.g. `"312 · 7d"` → MetricTile `delta` (arrow-prefixed) |
| `deltaDir` | `'up' \| 'down' \| 'flat'` | `'flat'` | colours the delta (up=green, down=red, flat=faint) + prefixes ▲/▼ → MetricTile `deltaTone` |
| `spark` | `number?` | — | bottom bar fill `0..1`; omit to hide → MetricTile `spark={[spark]}` |
| `sparkColor` | `string?` | — | override the spark fill colour (match a graded `valueColor`) → MetricTile `sparkColor` |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | spread onto the rendered MetricTile root |

- **Type exports:** `StatDeltaDir` (`'up' \| 'down' \| 'flat'`) and `StatValueTone` (`'default' \| 'gradient' \| 'mint'`) are still exported for consumers.

### How it maps onto `MetricTile`

- **Value tone via a nested span.** MetricTile's value slot is plain, so the wrapper passes a nested node: `<span className="lk-statcard-value--gradient">…</span>` (or `--mint`, or an inline `color` for `valueColor`). The gradient span clips its own text, so the tone renders inside MetricTile's `.lk-metric-value` unchanged.
- **Delta as an arrow line.** The wrapper builds the string `▲/▼ ${delta}` (arrow from `deltaDir`) and passes `deltaTone={deltaDir}`. MetricTile would render a tone PILL; `.lk-metric.lk-statcard .lk-metric-delta` strips the pill box (`padding:0; background:transparent; border-radius:0`) so only the colour-coded line remains.
- **Spark.** `spark` (single `0..1`) → `spark={[spark]}`; MetricTile renders the `.lk-metric-spark` fill bar (added there).
- **Shell.** `className="lk-statcard"` (+ any caller `className`) is passed through, and `.lk-metric.lk-statcard` overrides the glass tile with the opaque KPI cell.

## 3. Visual spec (tokens — never hardcode)

Skeleton (label/value/delta/spark) comes from `MetricTile` (`.lk-metric*`); this layer re-scopes the shell + delta + value tone.

| Aspect | Token / value | Source |
| --- | --- | --- |
| Card shell | `min-height 104px`, `padding 14×16`, `linear-gradient(180deg, rgba(124,92,255,.10), rgba(124,92,255,.03)) , --bg-1`, `1px --border-2`, `--r`, `--elev-1` | `.lk-metric.lk-statcard` |
| Label | `--font-mono`, `10.5px`, `0.16em`, uppercase, `--text-faint` | MetricTile `.lk-metric-label` |
| Value | `--font-display`, `700`, `24px`, `-0.02em`, `line-height 1.1` | MetricTile `.lk-metric-value` + `.lk-statcard` override |
| Value `gradient` | `linear-gradient(135deg,#7C5CFF,#22D3EE,#7C5CFF)` clipped to text | `.lk-statcard-value--gradient` |
| Value `mint` | `--mint` | `.lk-statcard-value--mint` |
| Delta (line) | `--font-mono`, `11px`; up `--zone-high`, down `--zone-low`, flat `--text-faint`; pill box stripped | `.lk-metric-delta-*` + `.lk-statcard` override |
| Spark bar | `8px`, `--r-pill` track (`rgba(255,255,255,.06)`), fill `calc(var(--v)*100%)` `--grad-cta` (or `sparkColor`), `margin-top 3px` | MetricTile `.lk-metric-spark` |

## 4. States

| State | Behaviour |
| --- | --- |
| Default | label + value + (optional) delta line + (optional) spark bar in an opaque cell |
| Value tone | `gradient` / `mint` / explicit `valueColor` via the nested value span |
| Delta up / down / flat | ▲ green / ▼ red / no-arrow faint line |
| No delta / no spark | rows omitted; `min-height 104px` keeps the row of cards uniform |

No hover / focus / pressed / disabled — non-interactive (a presentational cell).

## 5. Platform & relationship to root kit

**Web-only by design** (admin console is web-only) — no native counterpart, parity rule N/A.

This is a **wrapper-over-a-root-primitive**: the KPI skeleton is the root cross-platform `MetricTile` (which itself ships native), reused rather than re-implemented. The consolidation added the reusable `spark` accessory to `MetricTile` and moved StatCard's chrome into `.lk-metric.lk-statcard` overrides, so the rendered result is **byte-identical to the pre-consolidation StatCard**.

**Documented deltas vs a plain `MetricTile`** (intentional, not regressions): MetricTile's delta is a tone PILL whereas StatCard's is an arrow LINE; MetricTile's card is translucent glass whereas StatCard's is an opaque solid cell; MetricTile has icon/unit slots, StatCard uses neither.

## 6. Composition & usage

- **Composes:** root `MetricTile` (`@lockin90/ui`) for the label/value/delta/spark skeleton.
- **Used by:** admin operator overview → the KPI stat row (users, MRR, error rate, uptime, …).

```tsx
import { StatCard } from '@lockin90/ui/admin';

// gradient KPI with a positive delta + spark
<StatCard label="Total users" value="12,480" valueTone="gradient" delta="312 · 7d" deltaDir="up" spark={0.78} />

// graded colour (error-rate scale) with matching spark colour
<StatCard label="Error rate" value="1.8%" valueColor="#FFB020" delta="0.4%" deltaDir="down" spark={0.3} sparkColor="#FFB020" />
```

## 7. Accessibility

- Renders a presentational cell (a `<div>`); the label + value + delta are real DOM text read in source order.
- The delta direction is conveyed by the ▲/▼ glyph **and** the colour — never colour alone.
- The spark bar is decorative (the fill fraction restates the value); it carries no separate label.

## 8. Usage rules — Do / Don't

**Do**
- Use `StatCard` for the operator overview KPI cells (uniform-height row).
- Use `valueTone`/`valueColor` to signal the headline number; keep graded colours paired with `sparkColor`.
- Pass `spark` (0..1) to show the proportion bar; omit it for a value-only cell.

**Don't**
- ✗ Don't re-create the KPI cell (opaque card + gradient value + line delta + spark) — import `StatCard`.
- ✗ Don't hand-roll the spark bar — it's the root `MetricTile` `spark` accessory now; reuse it.
- ✗ Don't hardcode the gradient, zone colours, radii, or fonts — all token-sourced.
- ✗ Don't expect this on native — it is `/admin` web-only (the underlying `MetricTile` is the cross-platform part).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom KPI cell duplicates both this wrapper and `MetricTile` and will drift from the tone/spark semantics. Import `StatCard`.
- **Extend the root, not a fork.** A new KPI need (e.g. a second delta) belongs on `MetricTile` (so native benefits too) surfaced here — never a re-painted cell.
- **Tokens only.** Fills, zone colours, radii, and fonts come from `@lockin90/tokens`; the one opaque-fill rgba is kept in `.lk-metric.lk-statcard`.
- **Reuse is the rule.** The dashboard MetricTile and the admin StatCard now share one skeleton + one spark bar — don't break that by re-implementing either.
