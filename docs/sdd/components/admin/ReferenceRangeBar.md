# SDD — `ReferenceRangeBar` (thin wrapper over root `RangeBar`)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as:** `import { ReferenceRangeBar } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/ReferenceRangeBar.tsx` · composes root `packages/ui/src/components/RangeBar.tsx` · web CSS `packages/ui/src/styles/components/refrangebar.css` (`.lk-refrangebar*`) + `rangebar.css` (`.lk-rangebar*`). NO native counterpart.
> **Exports:** `ReferenceRangeBar`, type `ReferenceRangeBarProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — operator console has no native surface.
> **Stories:** `packages/ui/src/stories/AdminSecurity.stories.tsx`.

---

## 1. Overview

A compact **lab-test reference-range bar** for the operator console's catalogs / lab-tests
panel. It is a **thin wrapper over the root `RangeBar`** (`@lockin90/ui`): `RangeBar` carries
all the load-bearing visual — the low→normal→high gradient track, the highlighted normal band,
and the optional auto-toned value marker — and this admin layer adds only what the bare
`RangeBar` header does not show:

- the **min / max tick labels** under the track (the axis floor + ceiling),
- a centered **mono normal-range readout** (`30 – 300 ng/mL`, mint-tinted), and
- a **value readout** (mono, `lk-tnum`) shown only when a measured `value` is supplied.

It is a pure render component (no state). When `value` is omitted, the wrapper anchors the
RangeBar marker at the band center and **hides it via CSS** (`.lk-refrangebar-novalue`) so the
bar reads as a pure reference range. Matches the `.refrange` block from
`lockin90-design/admin/catalogs.html`.

## 2. API contract

### `ReferenceRangeBarProps` (extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `low` | `number` | — | lower bound of the normal range (start of the green band) → RangeBar `low` |
| `high` | `number` | — | upper bound of the normal range (end of the green band) → RangeBar `high` |
| `displayMin` | `number` | — | left edge of the displayed track (axis floor) → RangeBar `min` |
| `displayMax` | `number` | — | right edge of the displayed track (axis ceiling) → RangeBar `max` |
| `unit` | `string?` | — | appended to the range + value readouts (e.g. `'ng/mL'`); also passed to RangeBar |
| `value` | `number?` | — | measured value to mark + read out; omit → pure range (marker hidden) |
| `className` | `string` | — | merged onto `.lk-refrangebar` via `cn` |
| `style` | `CSSProperties?` | — | spread on the root `<div>` |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | spread on the root `<div>`; `children` omitted |

- **Marker handling:** RangeBar always renders a marker, so the wrapper passes
  `value ?? (low + high) / 2` and toggles `.lk-refrangebar-novalue` to `display:none` it when `value == null`.
- **Formatting:** numbers are rendered via `String(n)` (caller's own precision preserved — no rounding).
- The wrapped RangeBar is rendered **without** a `label`/`showValue`, so its header is absent and the
  CSS collapses its `gap` to `0` (this layer owns all labels).

### Relationship to `RangeBar` props

`ReferenceRangeBar` maps 1:1 onto a subset of `RangeBarProps`: `low→low`, `high→high`,
`displayMin→min`, `displayMax→max`, `unit→unit`, `value→value` (with the fallback above). It
does **not** expose `RangeBar`'s `label`, `showValue`, or `markerTone` — the marker stays on
auto-tone (low→`warn`, optimal→`ok`, high→`bad`).

## 3. Visual spec (tokens — never hardcode)

Track visuals come from `RangeBar` (`.lk-rangebar*`); this layer styles only the labels.

| Aspect | Token / value |
| --- | --- |
| Container | `flex` column, `gap 6px`, `min-width 140px`, full width |
| Track (from RangeBar) | `10px` tall, `--r-pill`, `1px --border`; 3-zone gradient (low/high `rgba(255,77,109,.35)`, optimal `rgba(52,245,197,.15)`) keyed by `--low`/`--high` fractions |
| Normal band (from RangeBar) | `linear-gradient(--zone-high → --ok)`, `opacity .72`, mint glow |
| Marker (from RangeBar) | `14px` dot, auto-tone `--zone-mid`/`--zone-high`/`--zone-low`, `2.5px --bg-0` ring + glow; **hidden** when no value |
| Min / max ticks | `--font-mono`, `10px`, `--text-faint` |
| Normal-range readout | `--font-mono`, `11px`, `--ok` (mint), centered |
| Value readout | `--font-mono`, `12px`/500, `--text`, centered, `lk-tnum` tabular figures |
| Value readout unit | `--text-faint`, `margin-left 3px` |

## 4. States

| State | Behaviour |
| --- | --- |
| Pure range (`value` omitted) | `.lk-refrangebar-novalue` → RangeBar marker `display:none`; no value readout row |
| With value (in optimal) | marker auto-tones `ok` (mint); value readout shown |
| With value (below `low`) | marker auto-tones `warn` (amber) |
| With value (above `high`) | marker auto-tones `bad` (red) |
| Unit present / absent | range + value readouts append `unit` only when supplied |

No hover / focus / pressed / disabled — non-interactive (RangeBar is `role="img"`).

## 5. Platform & relationship to root kit

**Web-only by design** (admin console is web-only) — no native counterpart, parity rule N/A.

This is the kit's one explicit **wrapper-over-a-root-primitive** in `/admin`: the load-bearing
range visual is the cross-platform root `RangeBar` (which itself does ship native), reused
**verbatim** rather than re-implemented. The admin layer only adds operator-console chrome
(tick + range + value labels) that the dashboard `RangeBar` header omits. This keeps the lab
range visual identical wherever it appears and means any RangeBar fix propagates here for free.
CSS for both layers folds into the shared `dist/styles.css`.

## 6. Composition & usage

- **Composes:** root `RangeBar` (`@lockin90/ui`) for the track/band/marker.
- **Used by:** admin Catalogs → lab-tests panel (reference ranges per biomarker, with or
  without a sample reading).

```tsx
import { ReferenceRangeBar } from '@lockin90/ui/admin';

// pure reference range (no measured value → marker hidden)
<ReferenceRangeBar low={30} high={300} displayMin={0} displayMax={400} unit="ng/mL" />

// with a measured value (marker auto-tones by zone, value read out)
<ReferenceRangeBar low={70} high={99} displayMin={40} displayMax={200} unit="mg/dL" value={112} />
```

## 7. Accessibility

- The wrapped `RangeBar` is `role="img"` with an auto-generated `aria-label`
  (`"<value><unit> (optimal <low>–<high>)"`) — screen readers get the value + range without the
  visual ticks.
- Tick / range / value labels are real DOM text, read in source order beneath the track.
- Zone status is conveyed by the readout colour **and** the numeric value vs the stated range —
  never colour alone.

## 8. Usage rules — Do / Don't

**Do**
- Use it for any lab/biomarker reference range in the admin console.
- Omit `value` for a pure reference range (catalog definition); pass `value` only for an actual reading.
- Keep `displayMin ≤ low ≤ high ≤ displayMax` so the band and marker render in-bounds.
- Pass `unit` so the range and value readouts are self-describing.

**Don't**
- ✗ Don't re-create the gradient track — it's the root `RangeBar`; this wrapper exists so you reuse it.
- ✗ Don't hand-roll tick/range labels around a bare `RangeBar` in a route — use `ReferenceRangeBar`.
- ✗ Don't hardcode the zone colours, radii, or fonts — all token-sourced.
- ✗ Don't expect this on native — it is `/admin` web-only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom lab-range bar duplicates both this wrapper and `RangeBar` — and
  will drift from the zone-colour / band semantics. Import `ReferenceRangeBar`.
- **Extend the root, not a fork.** If a range visual needs a new behaviour (e.g. dual markers),
  add it to `RangeBar` (so native benefits too) and surface it here — never fork the track.
- **Tokens only.** Zone colours, radii, glow, and fonts come from `@lockin90/tokens`.
- **Reuse is the rule.** The whole point of this component is that the catalog lab-range and
  the dashboard biomarker bar share one track implementation — don't break that by re-painting.
